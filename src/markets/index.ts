// Every market a demo can be set in. Add a city: copy a market file, fill
// it in, add it here, and put its hero photo in /public/markets/<id>/.

import type { Market } from "./types";
import { LAS_VEGAS } from "./las-vegas";
import { PHOENIX } from "./phoenix";
import { LOS_ANGELES } from "./los-angeles";
import { ATLANTA } from "./atlanta";
import { WASHINGTON_DC } from "./washington-dc";
import { FLORIDA } from "./florida";

export type {
  Market,
  MarketAirport,
  MarketArea,
  MarketPlace,
  Photo,
} from "./types";

export const MARKETS: Record<string, Market> = {
  [LAS_VEGAS.id]: LAS_VEGAS,
  [PHOENIX.id]: PHOENIX,
  [LOS_ANGELES.id]: LOS_ANGELES,
  [ATLANTA.id]: ATLANTA,
  [WASHINGTON_DC.id]: WASHINGTON_DC,
  [FLORIDA.id]: FLORIDA,
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

/** "A", "A and B", "A, B and C". */
export function andList(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** The main airport plus the private-aviation ones: where we meet jets. */
export function fboAirports(market: Market) {
  const [main, ...rest] = market.airports;
  return [main, ...rest.filter((a) => a.kind === "private")];
}

/** Questions for the /airports page, built from the market's airports so
 *  they only say what the cards say. */
export function airportFaqs(
  market: Market,
  rules: { freeWaitMinutes: number },
): { topic: string; question: string; answer: string }[] {
  const [main] = market.airports;
  const all = andList(market.airports.map((a) => `${a.shortName} (${a.code})`));
  const privates = market.airports.filter((a) => a.kind === "private");
  return [
    {
      topic: market.city,
      question: `Which airports do you drive to in ${market.city}?`,
      answer: `${all}, every day. Long-distance rides to other airports are available by quote: call us with the route and the date.`,
    },
    {
      topic: "Pickups",
      question: `Where do I meet my chauffeur at ${main.shortName}?`,
      answer:
        "Inside baggage claim, holding a sign with your name. They'll help with your bags and walk you to the car.",
    },
    {
      topic: "Pickups",
      question: "What if my flight is delayed?",
      answer: `We track your flight and move your pickup time with it. You get ${rules.freeWaitMinutes} minutes of free wait after landing, so a slow bag carousel never costs you.`,
    },
    ...(privates.length
      ? [
          {
            topic: "Private aviation",
            question: `Can I fly private into ${market.city}?`,
            answer: `Yes. Private jets use the FBOs at ${andList(fboAirports(market).map((a) => a.shortName))}. Give us your tail number when you book and we'll meet the aircraft at the FBO.`,
          },
        ]
      : []),
  ];
}
