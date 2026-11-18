// What a prospect does in their demo: signing in, making an account,
// booking a test ride. Each one is saved with the demo's events (the
// "What they did" list in the F&F admin), and the ones worth a heads-up are
// sent to the F&F admin (DEMO_ALERT_URL), which emails Chris.
//
// Chris's own visits (a browser opened with ?ff=owner) aren't counted.
// Nothing here ever throws: a missed event must not break a sign-in or a
// booking.

import { after } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getLiveDemo } from "./context";
import { demoUrl } from "./hosts";
import { platformSecret } from "./api";
import {
  lastEventAt,
  recordEvent,
  type DemoEvent,
  type DemoRecord,
} from "./registry";

/** The cookie DemoBadge sets for ?ff=owner. */
export const OWNER_COOKIE = "ff_owner";

export async function isOwnerRequest() {
  try {
    return (await cookies()).get(OWNER_COOKIE)?.value === "1";
  } catch {
    return false;
  }
}

export type DemoAlertKind = "open" | "return" | "login" | "booking" | "signup";

/** Tells the F&F admin, after the response is sent. */
export function sendDemoAlert(
  demo: DemoRecord,
  alert: {
    kind: DemoAlertKind;
    detail: string;
    /** For "return": when they were last here. */
    lastSeenAt?: Date | null;
  },
) {
  const url = (process.env.DEMO_ALERT_URL ?? "").trim();
  const secret = platformSecret();
  if (!url || secret.length < 16) return;
  const send = async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          demoId: demo.id,
          ref: demo.ref,
          business: demo.business,
          contactName: demo.contactName,
          phone: demo.phone,
          url: demoUrl(demo.slug),
          kind: alert.kind,
          detail: alert.detail,
          lastSeenAt: alert.lastSeenAt?.toISOString() ?? null,
          at: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        console.error(`[platform] alert not taken: ${res.status}`);
      }
    } catch (e) {
      console.error("[platform] alert not sent", e);
    }
  };
  try {
    after(send);
  } catch {
    // Outside a request: send it now.
    void send();
  }
}

/** How long after one alert of a kind before the next one is sent. */
const QUIET_MS: Record<Exclude<DemoEvent["kind"], "view">, number> = {
  login: 12 * 3_600_000,
  booking: 3_600_000,
  signup: 0,
};

/** Saves something the prospect did, and alerts Chris when it's news. */
export async function noteDemoActivity(
  kind: Exclude<DemoEvent["kind"], "view">,
  detail: string,
) {
  try {
    const demo = await getLiveDemo();
    if (!demo || (await isOwnerRequest())) return;
    const last = await lastEventAt(demo.id, kind);
    await recordEvent(demo, kind, detail);
    if (!last || Date.now() - last.getTime() > QUIET_MS[kind]) {
      sendDemoAlert(demo, { kind, detail });
    }
  } catch (e) {
    console.error(`[platform] ${kind} not recorded`, e);
  }
}

const ROLE_NAMES: [role: string, name: string][] = [
  ["ADMIN", "admin"],
  ["DRIVER", "driver"],
  ["CORPORATE", "corporate"],
];

/** A sign-in, as the role it lands in ("admin", "driver", "rider"). */
export function noteDemoLogin(roles: unknown) {
  const list = Array.isArray(roles) ? roles.map(String) : [];
  const name = ROLE_NAMES.find(([r]) => list.includes(r))?.[1] ?? "rider";
  return noteDemoActivity("login", name);
}

/** A test booking: "Airport Pickup, Luxury SUV, as a guest". */
export async function noteDemoBooking(bookingIds: string[], how: string) {
  try {
    if (!(await getLiveDemo()) || !bookingIds.length) return;
    const first = await db.booking.findUnique({
      where: { id: bookingIds[0] },
      select: {
        serviceType: { select: { name: true } },
        vehicle: { select: { name: true } },
      },
    });
    const parts = [
      bookingIds.length > 1 ? `${bookingIds.length} rides` : "",
      first?.serviceType?.name ?? "",
      first?.vehicle?.name ?? "",
      how,
    ].filter(Boolean);
    await noteDemoActivity("booking", parts.join(", "));
  } catch (e) {
    console.error("[platform] booking not recorded", e);
  }
}
