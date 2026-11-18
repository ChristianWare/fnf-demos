// Which demo a request is for, from its host. Safe anywhere (no database).
//
//   copper-state.demo.fontsandfooters.com  → "copper-state"
//   copper-state.localhost:3000            → "copper-state" (local testing)
//   anything else (fnf-demos.vercel.app,
//   localhost:3000)                        → null: the main site, set up
//                                            by the DEMO_MARKET env var.

/** The domain every demo lives under. */
export const DEMO_ROOT_DOMAIN = (
  process.env.DEMO_ROOT_DOMAIN || "demo.fontsandfooters.com"
).toLowerCase();

const SLUG = /^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$/;

export function demoSlugFromHost(
  host: string | null | undefined,
): string | null {
  if (!host) return null;
  const name = host.toLowerCase().split(":")[0];
  for (const root of [DEMO_ROOT_DOMAIN, "localhost"]) {
    if (name.endsWith(`.${root}`)) {
      const slug = name.slice(0, -(root.length + 1));
      return SLUG.test(slug) ? slug : null;
    }
  }
  return null;
}

export const isValidDemoSlug = (slug: string) => SLUG.test(slug);

/** A demo's public address. */
export const demoUrl = (slug: string) => `https://${slug}.${DEMO_ROOT_DOMAIN}`;
