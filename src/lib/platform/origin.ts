// The address links should point at. On a demo that's the demo's own
// address (so a payment link opens the demo that has the booking), and
// everywhere else APP_URL.

import { headers } from "next/headers";
import { forcedSchema, getDemoContext } from "./context";
import { demoUrl } from "./hosts";

export async function siteOrigin(): Promise<string> {
  const ctx = await getDemoContext();
  if (ctx.kind === "demo") {
    // In a request, the address it came in on (this also works locally,
    // on slug.localhost); otherwise the demo's public address.
    if (!forcedSchema()) {
      try {
        const h = await headers();
        const host = h.get("x-forwarded-host") ?? h.get("host");
        if (host) {
          const proto =
            h.get("x-forwarded-proto") ??
            (/^(.+\.)?localhost(:\d+)?$/.test(host) ? "http" : "https");
          return `${proto.split(",")[0].trim()}://${host}`;
        }
      } catch {
        // Not in a request after all.
      }
    }
    return demoUrl(ctx.demo.slug);
  }
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
}
