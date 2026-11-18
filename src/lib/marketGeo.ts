// Where the booking maps open and which way address search leans: the
// demo's market center. MarketProvider sets it before any map or address
// field mounts; until then it's Las Vegas.

type LatLng = { lat: number; lng: number };

let center: LatLng = { lat: 36.1147, lng: -115.1728 };

export function setMarketCenter(c: LatLng) {
  center = c;
}

export function marketCenter(): LatLng {
  return center;
}
