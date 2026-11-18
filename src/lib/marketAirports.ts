// The airports the booking tools list, for the demo's market.
//
// The database's airports (Admin → Airports) are shared by every demo for
// now, so the lists keep only the ones in this market: its own airports
// (by code) and any other airport the admin added in the same state. Any of
// the market's airports that aren't in the database yet are added from the
// market file (src/markets/), so a Phoenix demo lists Sky Harbor even if
// the database only has Las Vegas airports.
//
// Airport ids only live in the browser (they fill in the address and the
// map pin); bookings store the address. So an added airport's id doesn't
// need a database row.

import type { Market } from "@/markets";

export type BookingAirport = {
  id: string;
  name: string;
  iata: string;
  address: string;
  placeId: string | null;
  lat: number | null;
  lng: number | null;
};

export function marketAirports(
  rows: BookingAirport[],
  market: Market,
): BookingAirport[] {
  const codes = new Set(market.airports.map((a) => a.code));
  // "…, AZ 85034": an address in this market's state.
  const inState = new RegExp(`,\\s*${market.stateCode}\\s+\\d{5}`);

  const fromDb = rows
    .filter((a) => codes.has(a.iata.toUpperCase()) || inState.test(a.address))
    .map((a) => ({
      id: a.id,
      name: a.name,
      iata: a.iata,
      address: a.address,
      placeId: a.placeId ?? null,
      lat: a.lat,
      lng: a.lng,
    }));
  const have = new Set(fromDb.map((a) => a.iata.toUpperCase()));

  const fromMarket = market.airports
    // Air-tour fields aren't pickup airports.
    .filter((a) => a.kind !== "tours" && !have.has(a.code))
    .map((a) => ({
      id: `market-${a.code}`,
      name: a.name,
      iata: a.code,
      address: a.address,
      placeId: null,
      lat: a.lat,
      lng: a.lng,
    }));

  // The market's airports in its order, then the admin's own extras.
  const rank = (iata: string) => {
    const i = market.airports.findIndex((a) => a.code === iata.toUpperCase());
    return i < 0 ? market.airports.length : i;
  };
  return [...fromDb, ...fromMarket].sort((a, b) => rank(a.iata) - rank(b.iata));
}

/** The same list for every airport service; non-airport services keep
 *  their (empty) list. */
export function withMarketAirports<
  S extends { airportLeg: string; airports: BookingAirport[] },
>(services: S[], market: Market): S[] {
  return services.map((s) =>
    s.airportLeg === "NONE"
      ? s
      : { ...s, airports: marketAirports(s.airports, market) },
  );
}

/** Select for db.airport.findMany when the rows go through marketAirports. */
export const AIRPORT_ROW = {
  id: true,
  name: true,
  iata: true,
  address: true,
  placeId: true,
  lat: true,
  lng: true,
} as const;

/** marketAirports for rows straight from the database (Decimal lat/lng). */
export function marketAirportRows(
  rows: {
    id: string;
    name: string;
    iata: string;
    address: string;
    placeId: string | null;
    lat: unknown;
    lng: unknown;
  }[],
  market: Market,
): BookingAirport[] {
  const num = (v: unknown) => (v == null ? null : Number(v));
  return marketAirports(
    rows.map((a) => ({ ...a, lat: num(a.lat), lng: num(a.lng) })),
    market,
  );
}
