// The market this demo is set in, for server components. Client components
// get the same market from useMarket() (MarketProvider, in the root layout).
//
// A demo (src/lib/platform/) has its own market and photos, picked when it
// was made. The main site uses the DEMO_MARKET, DEMO_HERO_IMAGE and
// DEMO_ABOUT_IMAGE env vars.

import { cache } from "react";
import { ABOUT_HERO, marketById, type Market, type Photo } from "@/markets";
import { getDemoContext } from "@/lib/platform/context";

async function currentDemo() {
  const ctx = await getDemoContext();
  return ctx.kind === "demo" ? ctx.demo : null;
}

export const getMarket = cache(async (): Promise<Market> => {
  const demo = await currentDemo();
  return marketById(demo ? demo.marketId : process.env.DEMO_MARKET);
});

/** The two photos a demo can swap: the home hero and the About hero. Each
 *  is the prospect's own upload if there is one, or the default. */
export const getPhotos = cache(
  async (): Promise<{ hero: Photo; aboutHero: Photo }> => {
    const [market, demo] = await Promise.all([getMarket(), currentDemo()]);
    const heroUrl = demo ? demo.heroUrl : process.env.DEMO_HERO_IMAGE;
    const aboutUrl = demo ? demo.aboutUrl : process.env.DEMO_ABOUT_IMAGE;
    return {
      hero: own(heroUrl, market.images.hero, {
        alt: `Black car service in ${market.city}`,
      }),
      aboutHero: own(aboutUrl, ABOUT_HERO, {
        alt: `Chauffeured car service in ${market.city}`,
      }),
    };
  },
);

/** An uploaded photo gets a plain alt: we don't know what's in it. */
function own(
  url: string | null | undefined,
  fallback: Photo,
  upload: { alt: string },
): Photo {
  const src = url?.trim();
  return src ? { src, alt: upload.alt } : fallback;
}
