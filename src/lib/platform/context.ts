// Which demo the current request is for.
//
// In a page, layout, server action or API route, it's the demo at the
// request's host (src/lib/platform/hosts.ts). Work that runs outside a
// page — making a demo, the daily cleanup, a Stripe webhook — names the
// demo itself with runInDemo(); that wins over the host.

import { AsyncLocalStorage } from "node:async_hooks";
import { cache } from "react";
import { headers } from "next/headers";
import { demoSlugFromHost } from "./hosts";
import { demoBySlug, type DemoRecord } from "./registry";

export type DemoContext =
  /** No demo address: the main site (DEMO_MARKET). */
  | { kind: "main" }
  /** A demo's address. Its status says if it's live, ended or still being made. */
  | { kind: "demo"; demo: DemoRecord }
  /** A demo address with no demo behind it. */
  | { kind: "missing"; slug: string };

const forced = new AsyncLocalStorage<{
  schemaName: string;
  demo: DemoRecord | null;
}>();

/** Run `fn` against one demo's schema, whatever the request's host. */
export function runInDemo<T>(
  target: { schemaName: string; demo?: DemoRecord | null },
  fn: () => Promise<T>,
): Promise<T> {
  return forced.run(
    { schemaName: target.schemaName, demo: target.demo ?? null },
    fn,
  );
}

/** The schema runInDemo picked, if any. */
export const forcedSchema = () => forced.getStore()?.schemaName ?? null;

async function requestHost(): Promise<string | null> {
  try {
    const h = await headers();
    return h.get("x-forwarded-host") ?? h.get("host");
  } catch {
    // Outside a request (a script, a build step): the main site.
    return null;
  }
}

const resolve = cache(async (): Promise<DemoContext> => {
  const slug = demoSlugFromHost(await requestHost());
  if (!slug) return { kind: "main" };
  const demo = await demoBySlug(slug);
  return demo ? { kind: "demo", demo } : { kind: "missing", slug };
});

export async function getDemoContext(): Promise<DemoContext> {
  const store = forced.getStore();
  if (store) {
    return store.demo ? { kind: "demo", demo: store.demo } : { kind: "main" };
  }
  return resolve();
}

/** The current demo, if this request is for a live one. */
export async function getLiveDemo(): Promise<DemoRecord | null> {
  const ctx = await getDemoContext();
  return ctx.kind === "demo" && ctx.demo.status === "live" ? ctx.demo : null;
}
