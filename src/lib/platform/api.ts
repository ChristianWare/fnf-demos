// The demo API's lock and its JSON. Only the F&F admin (fnf_27) calls it,
// with the DEMO_PLATFORM_SECRET both apps share.

import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { demoUrl } from "./hosts";
import type { DemoEvent, DemoRecord } from "./registry";

/** The shared secret, ignoring spaces or quotes pasted around it. */
export function platformSecret() {
  return (process.env.DEMO_PLATFORM_SECRET ?? "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
}

const SECRET_MIN = 16;

export function platformAuthorized(req: Request) {
  const secret = platformSecret();
  if (secret.length < SECRET_MIN) return false;
  const got = (req.headers.get("authorization") ?? "")
    .replace(/^Bearer\s+/i, "")
    .trim();
  const a = Buffer.from(got);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** 401 for a wrong secret; 503 when this site has none set, so the F&F
 *  admin can tell the two apart. */
export const unauthorized = () =>
  platformSecret().length < SECRET_MIN
    ? NextResponse.json(
        {
          error:
            "The demo platform has no DEMO_PLATFORM_SECRET yet (or it's under 16 characters). Add it in fnf-demos' settings on Vercel and redeploy fnf-demos.",
        },
        { status: 503 },
      )
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
