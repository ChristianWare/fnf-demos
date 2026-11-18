// The F&F admin's demo API: list every demo, or make a new one.
//
// POST is multipart form data: ref (the prospect's id), slug, business,
// marketId, contactName, email, phone, days, and optional "hero" and
// "about" image files.

import { NextResponse } from "next/server";
import { demoJson, platformAuthorized, unauthorized } from "@/lib/platform/api";
import { listDemos } from "@/lib/platform/registry";
import { createDemo, DemoInputError } from "@/lib/platform/provision";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Making a demo builds its tables and uploads photos: give it time.
export const maxDuration = 60;

export async function GET(req: Request) {
  if (!platformAuthorized(req)) return unauthorized();
  const demos = await listDemos();
  return NextResponse.json({ demos: demos.map((d) => demoJson(d)) });
}

const text = (form: FormData, key: string) => {
  const v = form.get(key);
  return typeof v === "string" ? v : "";
};

const file = (form: FormData, key: string) => {
  const v = form.get(key);
  return v instanceof File && v.size > 0 ? v : null;
};

export async function POST(req: Request) {
  if (!platformAuthorized(req)) return unauthorized();
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Send the demo as form data." },
      { status: 400 },
    );
  }
  try {
    const { demo } = await createDemo({
      ref: text(form, "ref"),
      slug: text(form, "slug"),
      business: text(form, "business"),
      marketId: text(form, "marketId"),
      contactName: text(form, "contactName"),
      email: text(form, "email"),
      phone: text(form, "phone"),
      days: Number(text(form, "days")) || 30,
      hero: file(form, "hero"),
      about: file(form, "about"),
    });
    return NextResponse.json({ demo: demoJson(demo) }, { status: 201 });
  } catch (e) {
    if (e instanceof DemoInputError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error("[platform] demo not made", e);
    return NextResponse.json(
      { error: "The preview couldn't be made. Nothing was kept; try again." },
      { status: 500 },
    );
  }
}
