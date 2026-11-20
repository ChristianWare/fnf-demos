// The airport map (home page and /airports): the market's airports as
// markers, and the map's settings. Each airport's grounds are drawn from
// public/geo/airports.json, built from OurAirports' runway data (public
// domain): every runway's ends, widened and wrapped in one outline so the
// terminals between them are inside it. When a market is added, rebuild
// that file with its airports: see scripts/airport-grounds.py.

import { airportBookHref, type Market } from "@/markets";

export type MapAirport = {
  /** The code in lower case: also the id of its grounds in the GeoJSON. */
  slug: string;
  code: string;
  /** The short name on the pill and the map. */
  name: string;
  /** Its city, under the name on the map. */
  place: string;
  kind: "commercial" | "private" | "tours";
  /** "Book a pickup" there. */
  href: string;
  lng: number;
  lat: number;
};

export const AIRPORT_GROUNDS_GEOJSON = "/geo/airports.json";

/** Free, keyless map tiles (OpenFreeMap): no cost per view. */
export const AIRPORT_MAP_STYLE =
  "https://tiles.openfreemap.org/styles/positron";

/** "6000 N Terminal Pkwy, Atlanta, GA 30320" → "Atlanta". */
const placeOf = (address: string) => {
  const parts = address.split(",").map((p) => p.trim());
  return parts.length >= 3 ? parts[parts.length - 2] : "";
};

export function mapAirportsFor(market: Market): MapAirport[] {
  return market.airports.map((a) => ({
    slug: a.code.toLowerCase(),
    code: a.code,
    name: a.shortName,
    place: placeOf(a.address),
    kind: a.kind,
    href: airportBookHref(a),
    lng: a.lng,
    lat: a.lat,
  }));
}

/** Every airport in view, with a little room: [west, south, east, north]. */
export function airportBounds(
  airports: MapAirport[],
): [number, number, number, number] {
  const lngs = airports.map((a) => a.lng);
  const lats = airports.map((a) => a.lat);
  const padLng = Math.max(0.04, (Math.max(...lngs) - Math.min(...lngs)) * 0.08);
  const padLat = Math.max(0.03, (Math.max(...lats) - Math.min(...lats)) * 0.08);
  return [
    Math.min(...lngs) - padLng,
    Math.min(...lats) - padLat,
    Math.max(...lngs) + padLng,
    Math.max(...lats) + padLat,
  ];
}
