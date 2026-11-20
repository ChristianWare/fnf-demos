// Home page and /airports: "Airport service". The market's airports on a
// map beside a pill for each (AirportMap). This part only gathers the
// market's airports and words on the server.

import { getMarket } from "@/lib/market";
import { andList } from "@/markets";
import { airportBounds, mapAirportsFor } from "@/lib/airportMap";
import AirportMap from "./AirportMap";

export default async function AirportMapSection() {
  const market = await getMarket();
  const airports = mapAirportsFor(market);
  const names = (kind: string) =>
    andList(
      market.airports.filter((a) => a.kind === kind).map((a) => a.shortName),
    );
  const commercial = names("commercial");
  const privates = names("private");
  const copy = [
    commercial ? `From the terminals at ${commercial}` : "",
    privates
      ? `${commercial ? " to" : "From"} the private jet ramps at ${privates}`
      : "",
  ].join("");

  return (
    <AirportMap
      airports={airports}
      bounds={airportBounds(airports)}
      region={market.region}
      copy={`${copy}, your chauffeur is waiting when you land. Select an airport to zoom in.`}
    />
  );
}
