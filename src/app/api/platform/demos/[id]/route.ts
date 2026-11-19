// One demo, for the F&F admin: its status, views, what they did and what
// its site shows now (GET), more time (PATCH JSON { days }), new details
// and photos (PATCH form data: business, shortName, contactName, phone,
// email, address, and "hero"/"about" as a file or "default"), or delete it
// now (DELETE).

import { NextResponse } from "next/server";
import { demoJson, platformAuthorized, unauthorized } from "@/lib/platform/api";
import { demoById, demoEvents } from "@/lib/platform/registry";
import {
  DemoInputError,
  demoSiteDetails,
  editDemo,
  endDemo,
  extendDemo,
  type DemoEdit,
} from "@/lib/platform/provision";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// New photos are uploaded to Cloudinary: give it time.
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

const notFound = () =>
  NextResponse.json({ error: "No preview with that id." }, { status: 404 });

export async function GET(req: Request, { params }: Ctx) {
  if (!platformAuthorized(req)) return unauthorized();
  const { id } = await params;
  const demo = await demoById(id);
  if (!demo) return notFound();
  const [events, site] = await Promise.all([
    demoEvents(id),
    demoSiteDetails(demo).catch(() => null),
  ]);
  return NextResponse.json({ demo: { ...demoJson(demo, events), site } });
}

const badInput = (e: unknown) => {
  if (e instanceof DemoInputError) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
  throw e;
};

/** A photo field: a new file, "default", or nothing (keep it). */
function photoField(form: FormData, key: string): DemoEdit["hero"] {
  const v = form.get(key);
  if (v instanceof File && v.size > 0) return v;
  return v === "default" ? "default" : undefined;
}

async function editFromForm(req: Request, id: string) {
  const demo = await demoById(id);
  if (!demo) return notFound();
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Send the changes as form data." },
      { status: 400 },
    );
  }
  const text = (key: string) => {
    const v = form.get(key);
    return typeof v === "string" ? v : "";
  };
  try {
    await editDemo(demo, {
      business: text("business"),
      shortName: text("shortName"),
      contactName: text("contactName"),
      phone: text("phone"),
      email: text("email"),
      address: text("address"),
      hero: photoField(form, "hero"),
      about: photoField(form, "about"),
    });
  } catch (e) {
    return badInput(e);
  }
  return NextResponse.json({ demo: demoJson((await demoById(id))!) });
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!platformAuthorized(req)) return unauthorized();
  const { id } = await params;
  if ((req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
    return editFromForm(req, id);
  }
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
    return badInput(e);
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
