// One demo, for the F&F admin: its status, views and what they did (GET),
// more time (PATCH { days }), or delete it now (DELETE).

import { NextResponse } from "next/server";
import { demoJson, platformAuthorized, unauthorized } from "@/lib/platform/api";
import { demoById, demoEvents } from "@/lib/platform/registry";
import { DemoInputError, endDemo, extendDemo } from "@/lib/platform/provision";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () =>
  NextResponse.json({ error: "No preview with that id." }, { status: 404 });

export async function GET(req: Request, { params }: Ctx) {
  if (!platformAuthorized(req)) return unauthorized();
  const { id } = await params;
  const demo = await demoById(id);
  if (!demo) return notFound();
  return NextResponse.json({ demo: demoJson(demo, await demoEvents(id)) });
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!platformAuthorized(req)) return unauthorized();
  const { id } = await params;
  const demo = await demoById(id);
  if (!demo) return notFound();
  const body = await req.json().catch(() => ({}));
  const days = Number(body?.days);
  if (!Number.isFinite(days) || days <= 0) {
    return NextResponse.json(
      { error: "Say how many days to add." },
      { status: 400 },
    );
  }
  try {
    await extendDemo(demo, days);
  } catch (e) {
    if (e instanceof DemoInputError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }
  return NextResponse.json({ demo: demoJson((await demoById(id))!) });
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!platformAuthorized(req)) return unauthorized();
  const { id } = await params;
  const demo = await demoById(id);
  if (!demo) return notFound();
  if (demo.status === "live" || demo.status === "creating") {
    await endDemo(demo, "deleted");
  }
  return NextResponse.json({ demo: demoJson((await demoById(id))!) });
}
