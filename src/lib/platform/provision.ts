// Making, extending and removing demos.
//
// Making one: a row in platform.demos, a Postgres schema of its own with
// every table (src/generated/demo-schema.sql, from `npm run
// db:demo-schema`), the prospect's photos on Cloudinary, and its starting
// data: their business details, the services, the vehicles with sample
// rates, the market's airports, admin, driver and rider logins, and four
// sample bookings (src/lib/platform/sampleBookings.ts).
//
// Removing one drops its schema (everything in it, at once) and its photos.

import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { AirportLeg, Role, ServicePricingStrategy } from "@prisma/client";
import { db } from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import { formatPhone, phoneDigits } from "@/lib/phone";
import { officeStreet } from "@/lib/brand";
import { marketById, type Market } from "@/markets";
import { forgetSchema, isDemoSchema, prismaBase } from "./prismaBase";
import { runInDemo } from "./context";
import { seedSampleBookings } from "./sampleBookings";
import {
  deleteDemoRow,
  demoById,
  insertDemo,
  newDemoId,
  setDemoDetails,
  setDemoExpiry,
  setDemoPhotos,
  setDemoStatus,
  slugTaken,
  type DemoRecord,
} from "./registry";
import { demoUrl, isValidDemoSlug } from "./hosts";

export type NewDemo = {
  /** Who it's for in the F&F admin (the prospect's id). */
  ref: string;
  slug: string;
  business: string;
  /** Shorter name for the logo and around the site ("Trinbago"); the
   *  full business name stays on invoices and receipts. */
  shortName?: string;
  /** Their office's street address. Without one the site shows only the
   *  market's city. */
  address?: string;
  marketId: string;
  contactName: string;
  email: string;
  phone: string;
  days: number;
  hero?: File | null;
  about?: File | null;
};

export class DemoInputError extends Error {}

// ── The tables, from the Prisma schema ──

function schemaStatements(): string[] {
  const file = path.join(process.cwd(), "src", "generated", "demo-schema.sql");
  if (!fs.existsSync(file)) {
    throw new Error(
      "Missing src/generated/demo-schema.sql. Run `npm run db:demo-schema` (the build runs it too).",
    );
  }
  return fs
    .readFileSync(file, "utf8")
    .split(/;\s*(?:\r?\n|$)/)
    .map((s) => s.trim())
    .filter((s) => s.replace(/^--.*$/gm, "").trim().length > 0);
}

async function createSchema(schemaName: string) {
  if (!isDemoSchema(schemaName)) throw new Error(`Bad schema: ${schemaName}`);
  const statements = schemaStatements();
  await prismaBase.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(`CREATE SCHEMA "${schemaName}"`);
      // Every table, type and index below lands in the new schema.
      await tx.$executeRawUnsafe(`SET LOCAL search_path TO "${schemaName}"`);
      for (const sql of statements) await tx.$executeRawUnsafe(sql);
    },
    { maxWait: 20_000, timeout: 120_000 },
  );
}

export async function dropSchema(schemaName: string) {
  if (!isDemoSchema(schemaName)) throw new Error(`Bad schema: ${schemaName}`);
  await forgetSchema(schemaName);
  await prismaBase.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
  );
}

// ── Photos ──

async function uploadPhoto(file: File, demoId: string, name: string) {
  if (!file.type.startsWith("image/")) {
    throw new DemoInputError(`${name} photo isn't an image.`);
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new DemoInputError(`${name} photo is over 15 MB.`);
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const result = await cloudinary.uploader.upload(
    `data:${file.type};base64,${bytes.toString("base64")}`,
    {
      folder: `demos/${demoId}`,
      public_id: name,
      overwrite: true,
      transformation: [
        { width: 2400, crop: "limit", quality: "auto", format: "jpg" },
      ],
    },
  );
  return result.secure_url as string;
}

async function deletePhoto(demoId: string, name: string) {
  try {
    await cloudinary.uploader.destroy(`demos/${demoId}/${name}`);
  } catch {
    // Already gone, or no Cloudinary keys: nothing to do.
  }
}

async function deletePhotos(demoId: string) {
  try {
    await cloudinary.api.delete_resources_by_prefix(`demos/${demoId}/`);
    await cloudinary.api.delete_folder(`demos/${demoId}`);
  } catch {
    // Photos that are already gone, or no Cloudinary keys: nothing to do.
  }
}

// ── Starting data ──

/** Easy to read out on a call: no 0/O or 1/l. */
function newPassword() {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return [...randomBytes(12)]
    .map((b) => alphabet[b % alphabet.length])
    .join("");
}

async function seed(
  demo: DemoRecord,
  market: Market,
  extra: { shortName: string; address: string },
) {
  const digits = phoneDigits(demo.phone);
  const name = extra.shortName || demo.business;

  await db.companySettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      companyName: name,
      companyTagline: `Black car service in ${market.city}`,
      dispatchPhone: digits ? formatPhone(digits) : null,
      dispatchPhoneRaw: digits || null,
      emergencyPhone: digits ? formatPhone(digits) : null,
      emergencyPhoneRaw: digits || null,
      supportEmail: demo.email || null,
      officeName: demo.business,
      officeAddress: extra.address || null,
      officeCity: market.label,
      timezone: market.timeZone,
      emailSenderName: name,
      emailReplyTo: demo.email || null,
      checkPayableTo: demo.business,
    },
  });

  const services = [
    {
      slug: "airport-pickup",
      name: "Airport Pickup",
      pricingStrategy: ServicePricingStrategy.POINT_TO_POINT,
      airportLeg: AirportLeg.PICKUP,
      minFareCents: 8500,
      baseFeeCents: 2500,
      perMileCents: 350,
      sortOrder: 1,
    },
    {
      slug: "airport-dropoff",
      name: "Airport Drop-off",
      pricingStrategy: ServicePricingStrategy.POINT_TO_POINT,
      airportLeg: AirportLeg.DROPOFF,
      minFareCents: 8500,
      baseFeeCents: 2500,
      perMileCents: 350,
      sortOrder: 2,
    },
    {
      slug: "point-to-point",
      name: "Point to Point",
      pricingStrategy: ServicePricingStrategy.POINT_TO_POINT,
      airportLeg: AirportLeg.NONE,
      minFareCents: 6500,
      baseFeeCents: 2000,
      perMileCents: 350,
      sortOrder: 3,
    },
    {
      slug: "hourly",
      name: "Hourly Chauffeur",
      pricingStrategy: ServicePricingStrategy.HOURLY,
      airportLeg: AirportLeg.NONE,
      minHours: 2,
      perHourCents: 9500,
      sortOrder: 4,
    },
  ];
  for (const s of services) await db.serviceType.create({ data: s });

  // Sample rates, linked to the website's fleet pages.
  const vehicles = [
    {
      name: "Executive Sedan",
      description:
        "Up to 3 passengers. Executive sedan for airport runs and corporate travel.",
      capacity: 3,
      luggageCapacity: 3,
      baseFareCents: 0,
      perMileCents: 0,
      perHourCents: 0,
      sortOrder: 1,
      fleetSlug: "executive-sedan",
    },
    {
      name: "Luxury SUV",
      description:
        "Up to 6 passengers. Full-size SUV with room for luggage and groups.",
      capacity: 6,
      luggageCapacity: 6,
      baseFareCents: 1500,
      perMileCents: 50,
      perHourCents: 2000,
      sortOrder: 2,
      fleetSlug: "luxury-suv",
    },
    {
      name: "Executive Sprinter",
      description:
        "Up to 14 passengers. Sprinter van for groups, events and crew transfers.",
      capacity: 14,
      luggageCapacity: 12,
      baseFareCents: 5000,
      perMileCents: 150,
      perHourCents: 6000,
      sortOrder: 3,
      fleetSlug: "executive-sprinter",
    },
  ];
  for (const v of vehicles) await db.vehicle.create({ data: v });

  const airportServices = await db.serviceType.findMany({
    where: { airportLeg: { not: AirportLeg.NONE } },
    select: { id: true },
  });
  const pickupAirports = market.airports.filter((a) => a.kind !== "tours");
  for (const [i, a] of pickupAirports.entries()) {
    await db.airport.create({
      data: {
        iata: a.code,
        name: a.name,
        address: a.address,
        lat: a.lat,
        lng: a.lng,
        sortOrder: i + 1,
        services: { connect: airportServices },
      },
    });
  }

  const password = await bcrypt.hash(demo.loginPassword, 10);
  const people = [
    {
      email: demo.adminEmail,
      name: `${demo.contactName || demo.business} (admin)`,
      roles: [Role.ADMIN],
    },
    { email: demo.driverEmail, name: "Sample Driver", roles: [Role.DRIVER] },
    { email: demo.riderEmail, name: "Sample Rider", roles: [Role.USER] },
  ];
  const ids: string[] = [];
  for (const p of people) {
    const user = await db.user.create({
      data: { ...p, password, emailVerified: new Date() },
      select: { id: true },
    });
    ids.push(user.id);
  }

  const [adminId, driverId, riderId] = ids;
  await seedSampleBookings(market, { adminId, driverId, riderId });
}

// ── Make, extend, remove ──

export async function createDemo(input: NewDemo) {
  const slug = input.slug.trim().toLowerCase();
  const business = input.business.trim();
  if (!business) throw new DemoInputError("Add their business name.");
  if (!isValidDemoSlug(slug)) {
    throw new DemoInputError(
      "The address can only use letters, numbers and dashes.",
    );
  }
  const market = marketById(input.marketId);
  if (market.id !== input.marketId) throw new DemoInputError("Unknown market.");
  if (await slugTaken(slug)) {
    throw new DemoInputError(
      `${slug} is already a live preview. Pick another address.`,
    );
  }
  const days = Math.min(Math.max(Math.round(input.days) || 30, 1), 90);

  const { id, schemaName } = newDemoId();
  const loginPassword = newPassword();
  const login = (who: string) => `${who}@${slug}.example`;
  await insertDemo({
    id,
    ref: input.ref.trim().slice(0, 100),
    slug,
    schemaName,
    business,
    marketId: market.id,
    contactName: input.contactName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    heroUrl: null,
    aboutUrl: null,
    adminEmail: login("admin"),
    driverEmail: login("driver"),
    riderEmail: login("rider"),
    loginPassword,
    expiresAt: new Date(Date.now() + days * 86_400_000),
  });

  const demo = await demoById(id);
  if (!demo) throw new Error("The new preview wasn't saved.");

  try {
    const [heroUrl, aboutUrl] = await Promise.all([
      input.hero ? uploadPhoto(input.hero, id, "hero") : null,
      input.about ? uploadPhoto(input.about, id, "about") : null,
    ]);
    if (heroUrl || aboutUrl) await setDemoPhotos(demo, { heroUrl, aboutUrl });

    await createSchema(schemaName);
    await runInDemo({ schemaName, demo }, () =>
      seed(demo, market, {
        shortName: (input.shortName ?? "").trim().slice(0, 60),
        address: (input.address ?? "").trim().slice(0, 200),
      }),
    );
    await setDemoStatus(demo, "live");
  } catch (e) {
    // Leave nothing half-made behind.
    await dropSchema(schemaName).catch(() => {});
    await deletePhotos(id);
    await setDemoStatus(demo, "failed").catch(() => {});
    throw e;
  }

  const live = (await demoById(id))!;
  return { demo: live, url: demoUrl(live.slug) };
}

// ── Edit ──

/** What the demo's site shows now (its Company Settings), for the F&F
 *  admin's Edit form. The prospect or Chris may have changed these in the
 *  demo's own admin since it was made. */
export async function demoSiteDetails(demo: DemoRecord) {
  if (demo.status !== "live") return null;
  const s = await runInDemo({ schemaName: demo.schemaName, demo }, () =>
    db.companySettings.findUnique({ where: { id: "default" } }),
  );
  return {
    name: s?.companyName?.trim() || demo.business,
    address: officeStreet(s?.officeAddress),
    phone: s?.dispatchPhone?.trim() || demo.phone,
    email: s?.supportEmail?.trim() || demo.email,
  };
}

export type DemoEdit = {
  business: string;
  /** "" for none: the logo shows the business name. */
  shortName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  /** A new photo, "default" for the market's, or undefined to keep it. */
  hero?: File | "default";
  about?: File | "default";
};

/** Changes a live demo's name, contact details and photos in place: its
 *  link, logins, bookings and events stay. */
export async function editDemo(demo: DemoRecord, edit: DemoEdit) {
  if (demo.status !== "live") {
    throw new DemoInputError("Only a live preview can be edited.");
  }
  const business = edit.business.trim().slice(0, 200);
  if (!business) throw new DemoInputError("Add their business name.");
  const name = edit.shortName.trim().slice(0, 60) || business;
  const digits = phoneDigits(edit.phone);
  const email = edit.email.trim();

  const photo = async (
    choice: DemoEdit["hero"],
    key: "hero" | "about",
    current: string | null,
  ) => {
    if (choice === undefined) return current;
    if (choice === "default") {
      await deletePhoto(demo.id, key);
      return null;
    }
    return uploadPhoto(choice, demo.id, key);
  };
  const [heroUrl, aboutUrl] = await Promise.all([
    photo(edit.hero, "hero", demo.heroUrl),
    photo(edit.about, "about", demo.aboutUrl),
  ]);

  await runInDemo({ schemaName: demo.schemaName, demo }, () =>
    db.companySettings.update({
      where: { id: "default" },
      data: {
        companyName: name,
        emailSenderName: name,
        officeName: business,
        checkPayableTo: business,
        officeAddress: edit.address.trim().slice(0, 200) || null,
        dispatchPhone: digits ? formatPhone(digits) : null,
        dispatchPhoneRaw: digits || null,
        emergencyPhone: digits ? formatPhone(digits) : null,
        emergencyPhoneRaw: digits || null,
        supportEmail: email || null,
        emailReplyTo: email || null,
      },
    }),
  );
  await setDemoDetails(demo, {
    business,
    contactName: edit.contactName.trim().slice(0, 200),
    email,
    phone: edit.phone.trim(),
  });
  if (heroUrl !== demo.heroUrl || aboutUrl !== demo.aboutUrl) {
    await setDemoPhotos(demo, { heroUrl, aboutUrl });
  }
}

export async function extendDemo(demo: DemoRecord, days: number) {
  if (demo.status !== "live")
    throw new DemoInputError("Only a live preview can be extended.");
  const from = Math.max(demo.expiresAt.getTime(), Date.now());
  const expiresAt = new Date(
    from + Math.min(Math.max(days, 1), 90) * 86_400_000,
  );
  await setDemoExpiry(demo, expiresAt);
  return expiresAt;
}

/** Ends a demo: its data and photos are deleted; the address shows the
 *  "preview ended" page. `forget` also removes its row (and its visits). */
export async function endDemo(
  demo: DemoRecord,
  how: "expired" | "deleted",
  { forget = false } = {},
) {
  await dropSchema(demo.schemaName);
  await deletePhotos(demo.id);
  if (forget) await deleteDemoRow(demo);
  else await setDemoStatus(demo, how);
}
