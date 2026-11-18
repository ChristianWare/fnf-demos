/**
 * Example services. One entry = one /services/[slug] page (plus the sitemap,
 * llms.txt, and the services hub). Replace per client.
 *
 * The lines here don't name a city; servicesFor(market) adds the local
 * details for the pages a rider sees.
 */
import { andList, type Market } from "@/markets";

export type ServiceEntry = {
  slug: string;
  title: string;
  /** One sentence: who it's for and what it is */
  copy: string;
};

export const servicesData: readonly ServiceEntry[] = [
  { slug: "airport-transfers", title: "Airport Transfers", copy: "Private rides to and from the airport, with flight tracking and meet & greet." },
  { slug: "hourly-chauffeur", title: "Hourly Chauffeur", copy: "Keep your car and chauffeur for dinner, a show and the night out, billed by the hour with a minimum." },
  { slug: "corporate-travel", title: "Corporate Travel", copy: "Conventions, client pickups and executive travel on one monthly invoice." },
  { slug: "weddings", title: "Weddings", copy: "Ceremony to reception, with time for photos on the way and shuttles for guests." },
  { slug: "nightlife-events", title: "Nightlife & Events", copy: "Door drop-off and pickup at the stadiums, arenas and the clubs." },
  { slug: "group-transportation", title: "Group Transportation", copy: "Executive Sprinters for bachelor parties, golf trips and conference teams." },
  { slug: "point-to-point", title: "Point-to-Point Rides", copy: "One private ride, door to door, anywhere in town." },
  { slug: "day-trips", title: "Day Trips", copy: "Day trips out of the city by private car, with a chauffeur who waits." },
];

/** servicesData with the market's airports, venues, area and day trips. */
export function servicesFor(market: Market): ServiceEntry[] {
  const p = market.copy.pages;
  const local: Record<string, string> = {
    "airport-transfers": `Private rides to and from ${andList(
      market.airports
        .filter((a) => a.kind !== "tours")
        .map((a) => a.name.replace(/ Airport$/, "")),
    )}, with flight tracking and meet & greet.`,
    weddings: `${p.weddingCardSub}, with time for photos on the way and shuttles for guests.`,
    "nightlife-events": `Door drop-off and pickup at ${p.eventVenues.join(", ")} and the clubs.`,
    "point-to-point": `One private ride, door to door, anywhere in ${market.region}.`,
    "day-trips": `${andList(market.copy.roadTrips.map((t) => t.name))} by private car.`,
  };
  return servicesData.map((s) => ({ ...s, copy: local[s.slug] ?? s.copy }));
}
