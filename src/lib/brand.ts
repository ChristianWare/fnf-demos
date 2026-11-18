// The operator's name and logo, for server components. They come from
// Admin → Company Settings (falling back to src/config/site.ts), so a demo
// shows the prospect's own business without a code change. Client
// components get the same from useBrand() (BrandProvider, root layout).

import { cache } from "react";
import { SITE } from "@/config/site";
import type { Market } from "@/markets";
import { getCompanySettings } from "../../actions/admin/companySettings";

export type Brand = {
  /** "SS Black Car". */
  name: string;
  /** An uploaded logo (Company Settings → Branding), or "" for none. */
  logoUrl: string;
};

export const getBrand = cache(async (): Promise<Brand> => {
  // If the database can't be reached, the site still renders with the
  // name from src/config/site.ts.
  const s = await getCompanySettings().catch(() => null);
  return {
    name: s?.companyName?.trim() || SITE.name,
    logoUrl: s?.logoUrl?.trim() || "",
  };
});

/** The office's city line: the one in Company Settings, unless it's still
 *  the template's placeholder (src/config/site.ts), then the market's
 *  ("Las Vegas, NV"), so a demo never shows another city. */
export function officeCity(saved: string | null | undefined, market: Market) {
  const placeholder = `${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}`;
  return saved && saved !== placeholder ? saved : market.label;
}
