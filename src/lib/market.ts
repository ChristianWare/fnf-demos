// The market this demo is set in, for server components. Client components
// get the same market from useMarket() (MarketProvider, in the root layout).
//
// For now it comes from the DEMO_MARKET env var. When demos come from the
// F&F admin, this is the one place that changes: it will look the demo up
// from the request instead. Both functions are async for that reason.

import { cache } from "react";
import { ABOUT_HERO, marketById, type Market, type Photo } from "@/markets";

export const getMarket = cache(async (): Promise<Market> => {
  return marketById(process.env.DEMO_MARKET);
});

/** The two photos a demo can swap: the home hero and the About hero. Each
 *  is the prospect's own upload if there is one, or the default. */
export const getPhotos = cache(
  async (): Promise<{ hero: Photo; aboutHero: Photo }> => {
    const market = await getMarket();
    return {
      hero: own(process.env.DEMO_HERO_IMAGE, market.images.hero, {
        alt: `Black car service in ${market.city}`,
      }),
      aboutHero: own(process.env.DEMO_ABOUT_IMAGE, ABOUT_HERO, {
        alt: `Chauffeured car service in ${market.city}`,
      }),
    };
  },
);

/** An uploaded photo gets a plain alt: we don't know what's in it. */
function own(
  url: string | undefined,
  fallback: Photo,
  upload: { alt: string },
): Photo {
  const src = url?.trim();
  return src ? { src, alt: upload.alt } : fallback;
}
