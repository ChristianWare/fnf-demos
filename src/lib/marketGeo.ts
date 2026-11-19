// Where the booking maps open and which way address search leans: the
// demo's market center (and, for a statewide market, its bounds and a
// wider zoom). MarketProvider sets it before any map or address field
// mounts; until then it's Las Vegas.

import type { Market } from "@/markets";

type LatLng = { lat: number; lng: number };
type Reach = NonNullable<Market["reach"]>;

let center: LatLng = { lat: 36.1147, lng: -115.1728 };
let reach: Reach | null = null;

export function setMarketCenter(c: LatLng, r?: Reach | null) {
  center = c;
  reach = r ?? null;
}

export function marketCenter(): LatLng {
  return center;
}

/** The map's opening zoom for a wide market, else null (the default). */
export function marketZoom(): number | null {
  return reach?.zoom ?? null;
}

/** The area address search should lean toward, for a wide market. */
export function marketBounds(): Reach["bounds"] | null {
  return reach?.bounds ?? null;
}
