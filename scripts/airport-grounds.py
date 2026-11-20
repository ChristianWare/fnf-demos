# Builds public/geo/airports.json, the airport grounds on the airport map
# (src/lib/airportMap.ts): every runway's ends, widened into circles and
# wrapped in one outline (convex hull), so the terminals between the
# runways sit inside it. Data: OurAirports (public domain).
#
# When a market adds airports, download the two files into a folder:
#   https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv
#   https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/runways.csv
# then run it with every market's airport codes (src/markets/*.ts):
#   python3 scripts/airport-grounds.py <folder> public/geo/airports.json ATL,PDK,...
import csv, json, math, sys
data_dir, out_path = sys.argv[1], sys.argv[2]
codes = sys.argv[3].split(",")

airports = {}
with open(f"{data_dir}/airports.csv", newline="", encoding="utf-8") as f:
    for r in csv.DictReader(f):
        if r["iso_country"] != "US" or r["type"] not in ("large_airport", "medium_airport", "small_airport"):
            continue
        for key in (r["iata_code"], r["local_code"], r["gps_code"]):
            if key:
                airports.setdefault(key, []).append(r)

runways = {}
with open(f"{data_dir}/runways.csv", newline="", encoding="utf-8") as f:
    for r in csv.DictReader(f):
        runways.setdefault(r["airport_ident"], []).append(r)

RANK = {"large_airport": 0, "medium_airport": 1, "small_airport": 2}

def hull(points):
    pts = sorted(set(points))
    if len(pts) < 3:
        return pts
    def cross(o, a, b):
        return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]

features, report = [], []
for code in codes:
    cands = airports.get(code, [])
    # The IATA code first, then the FAA code; the biggest airport wins.
    cands.sort(key=lambda r: (r["iata_code"] != code, RANK[r["type"]]))
    if not cands:
        report.append(f"{code}: NOT FOUND"); continue
    ap = cands[0]
    rws = [r for r in runways.get(ap["ident"], [])
           if r["closed"] != "1" and r["le_latitude_deg"] and r["he_latitude_deg"]
           and not r["le_ident"].startswith("H")]
    if not rws:
        report.append(f"{code}: {ap['ident']} no runway coordinates"); continue
    lat0 = float(ap["latitude_deg"]); lng0 = float(ap["longitude_deg"])
    mx = 111320 * math.cos(math.radians(lat0)); my = 110540
    big = ap["type"] == "large_airport"
    radius = 320 if big else 160
    pts = []
    for r in rws:
        for end in ("le", "he"):
            x = (float(r[f"{end}_longitude_deg"]) - lng0) * mx
            y = (float(r[f"{end}_latitude_deg"]) - lat0) * my
            for k in range(16):
                t = 2 * math.pi * k / 16
                pts.append((x + radius * math.cos(t), y + radius * math.sin(t)))
    ring = hull([(round(p[0], 1), round(p[1], 1)) for p in pts])
    coords = [[round(lng0 + x / mx, 5), round(lat0 + y / my, 5)] for x, y in ring]
    coords.append(coords[0])
    lngs = [c[0] for c in coords]; lats = [c[1] for c in coords]
    slug = code.lower()
    features.append({
        "type": "Feature",
        "id": slug,
        "properties": {"slug": slug, "ident": ap["ident"], "bbox": [min(lngs), min(lats), max(lngs), max(lats)]},
        "geometry": {"type": "Polygon", "coordinates": [coords]},
    })
    report.append(f"{code}: {ap['ident']} {ap['name']} ({len(rws)} runways)")

with open(out_path, "w") as f:
    json.dump({"type": "FeatureCollection", "features": features}, f, separators=(",", ":"))
print("\n".join(report))
