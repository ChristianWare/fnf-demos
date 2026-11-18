// A page view on a demo, sent from the browser (DemoBadge). Counts toward
// the demo's views, first opened and last seen, for the F&F admin, which
// hears about the first visit and about a return after a while away.

import { NextResponse } from "next/server";
import { getLiveDemo } from "@/lib/platform/context";
import { recordView } from "@/lib/platform/registry";
import { isOwnerRequest, sendDemoAlert } from "@/lib/platform/activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Back after this long away counts as a return worth hearing about. */
const AWAY_MS = 12 * 3_600_000;

const BOTS =
  /bot|crawl|spider|preview|facebookexternalhit|slack|whatsapp|telegram|discord|headless/i;

export async function POST(req: Request) {
  const demo = await getLiveDemo();
  if (!demo) return new NextResponse(null, { status: 204 });
  if (
    BOTS.test(req.headers.get("user-agent") ?? "") ||
    (await isOwnerRequest())
  ) {
    return new NextResponse(null, { status: 204 });
  }
  let path = "/";
  try {
    const body = JSON.parse(await req.text());
    if (typeof body?.path === "string") path = body.path.slice(0, 200);
  } catch {
    // An empty or odd body still counts as a view of the home page.
  }
  try {
    const before = await recordView(demo, path);
    if (!before.firstOpenedAt) {
      sendDemoAlert(demo, { kind: "open", detail: path });
    } else if (
      before.lastSeenAt &&
      Date.now() - before.lastSeenAt.getTime() > AWAY_MS
    ) {
      sendDemoAlert(demo, {
        kind: "return",
        detail: path,
        lastSeenAt: before.lastSeenAt,
      });
    }
  } catch (e) {
    console.error("[platform] visit not recorded", e);
  }
  return new NextResponse(null, { status: 204 });
}
