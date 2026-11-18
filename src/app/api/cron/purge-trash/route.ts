import { NextResponse } from "next/server";
import { purgeTrash } from "@/lib/trash/purgeTrash";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // Hard-delete expired trash, but NEVER a booking that has a payment
  // record. Those are accounting history; they stay in the trash.
  const result = await purgeTrash();

  return NextResponse.json({ ok: true, ...result });
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
