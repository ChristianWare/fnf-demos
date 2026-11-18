// The demo API's lock and its JSON. Only the F&F admin (fnf_27) calls it,
// with the DEMO_PLATFORM_SECRET both apps share.

import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { demoUrl } from "./hosts";
import type { DemoEvent, DemoRecord } from "./registry";

export function platformAuthorized(req: Request) {
  const secret = process.env.DEMO_PLATFORM_SECRET ?? "";
  if (secret.length < 16) return false;
  const got = (req.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const a = Buffer.from(got);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

/** A demo as the F&F admin sees it. */
export function demoJson(d: DemoRecord, events?: DemoEvent[]) {
  return {
    id: d.id,
    ref: d.ref,
    slug: d.slug,
    url: demoUrl(d.slug),
    business: d.business,
    marketId: d.marketId,
    contactName: d.contactName,
    email: d.email,
    phone: d.phone,
    heroUrl: d.heroUrl,
    aboutUrl: d.aboutUrl,
    status: d.status,
    createdAt: d.createdAt.toISOString(),
    expiresAt: d.expiresAt.toISOString(),
    views: d.views,
    firstOpenedAt: d.firstOpenedAt?.toISOString() ?? null,
    lastSeenAt: d.lastSeenAt?.toISOString() ?? null,
    logins: {
      password: d.loginPassword,
      admin: d.adminEmail,
      driver: d.driverEmail,
      rider: d.riderEmail,
    },
    ...(events && {
      events: events.map((e) => ({
        at: e.at.toISOString(),
        kind: e.kind,
        detail: e.detail,
      })),
    }),
  };
}
