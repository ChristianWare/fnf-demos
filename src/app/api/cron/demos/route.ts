// Daily: ends every demo past its date (its data and photos are deleted
// and its address shows the "preview ended" page), then does each live
// demo's daily upkeep, which the main site's own crons only do for the
// main site: emptying the trash, and clearing the notification queue
// (demos send no emails or texts, so this only marks them handled).

import { NextResponse } from "next/server";
import { demosPastExpiry, listDemos } from "@/lib/platform/registry";
import { endDemo } from "@/lib/platform/provision";
import { runInDemo } from "@/lib/platform/context";
import { purgeTrash } from "@/lib/trash/purgeTrash";
import { processPendingNotificationJobs } from "@/lib/notifications/process";

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

  const upkeep: Record<string, string> = {};
  const live = (await listDemos()).filter((d) => d.status === "live");
  for (const demo of live) {
    try {
      await runInDemo({ schemaName: demo.schemaName, demo }, async () => {
        const trash = await purgeTrash();
        const jobs = await processPendingNotificationJobs({ limit: 100 });
        upkeep[demo.slug] =
          `${trash.purged} purged, ${jobs.processed ?? 0} notifications`;
      });
    } catch (e) {
      upkeep[demo.slug] = "failed";
      console.error(`[platform] upkeep failed for ${demo.slug}`, e);
    }
  }

  return NextResponse.json({ ended, upkeep });
}

export const GET = handle;
export const POST = handle;
