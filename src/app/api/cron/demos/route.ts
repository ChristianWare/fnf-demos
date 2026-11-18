// Daily: ends every demo past its date. Its data and photos are deleted
// and its address shows the "preview ended" page.

import { NextResponse } from "next/server";
import { demosPastExpiry } from "@/lib/platform/registry";
import { endDemo } from "@/lib/platform/provision";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: Request) {
  if (process.env.NODE_ENV === "development") return true;
  const auth = req.headers.get("authorization") || "";
  const cronSecret = process.env.CRON_SECRET || "";
  return Boolean(cronSecret) && auth === `Bearer ${cronSecret}`;
}

async function handle(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const due = await demosPastExpiry();
  const ended: string[] = [];
  for (const demo of due) {
    try {
      await endDemo(demo, "expired");
      ended.push(demo.slug);
    } catch (e) {
      console.error(`[platform] couldn't end ${demo.slug}`, e);
    }
  }
  return NextResponse.json({ ended });
}

export const GET = handle;
export const POST = handle;
