// A page view on a demo, sent from the browser (DemoBadge). Counts toward
// the demo's views, first opened and last seen, for the F&F admin.

import { NextResponse } from "next/server";
import { getLiveDemo } from "@/lib/platform/context";
import { recordView } from "@/lib/platform/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOTS =
  /bot|crawl|spider|preview|facebookexternalhit|slack|whatsapp|telegram|discord|headless/i;

export async function POST(req: Request) {
  const demo = await getLiveDemo();
  if (!demo) return new NextResponse(null, { status: 204 });
  if (BOTS.test(req.headers.get("user-agent") ?? "")) {
    return new NextResponse(null, { status: 204 });
  }
  let path = "/";
  try {
    const body = JSON.parse(await req.text());
    if (typeof body?.path === "string") path = body.path.slice(0, 200);
  } catch {
    // An empty or odd body still counts as a view of the home page.
  }
  await recordView(demo, path).catch((e) =>
    console.error("[platform] visit not recorded", e),
  );
  return new NextResponse(null, { status: 204 });
}
