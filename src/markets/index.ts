// Every market a demo can be set in. Add a city: copy a market file, fill
// it in, add it here, and put its hero photo in /public/markets/<id>/.

import type { Market } from "./types";
import { LAS_VEGAS } from "./las-vegas";
import { PHOENIX } from "./phoenix";
import { LOS_ANGELES } from "./los-angeles";

export type { Market, MarketAirport, MarketArea, Photo } from "./types";

export const MARKETS: Record<string, Market> = {
  [LAS_VEGAS.id]: LAS_VEGAS,
  [PHOENIX.id]: PHOENIX,
  [LOS_ANGELES.id]: LOS_ANGELES,
};

export const DEFAULT_MARKET_ID = LAS_VEGAS.id;

/** The market with this id, or Las Vegas for anything unknown. */
export function marketById(id: string | null | undefined): Market {
  return (id && MARKETS[id.trim()]) || MARKETS[DEFAULT_MARKET_ID];
}

/** The photo shared by every market at the top of the About page. */
export const ABOUT_HERO = {
  src: "/markets/about-hero.jpg",
  alt: "Chauffeur driving a rider in the back of a black SUV",
};

/** Where an airport's "Book a pickup" goes. Air-tour fields aren't in the
 *  booking tool's airport list, so those open the plain booking tool. */
export function airportBookHref(a: Market["airports"][number]): string {
  return a.kind === "tours"
    ? "/book"
    : `/book?trip=from-airport&airport=${encodeURIComponent(a.code)}`;
}
