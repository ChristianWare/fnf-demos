// The list of demos: one row per demo in the platform's own tables
// ("platform" schema), next to the demos' schemas in the same database.
// The tables are made the first time they're needed, so a fresh database
// needs no setup step.
//
// Read through the main client, never through `db` (which would point at
// the current demo's own schema).

import { randomBytes } from "node:crypto";
import { prismaBase } from "./prismaBase";

export type DemoStatus = "creating" | "live" | "expired" | "deleted" | "failed";

export type DemoRecord = {
  id: string;
  /** Who it's for in the F&F admin (the prospect's id). */
  ref: string;
  slug: string;
  schemaName: string;
  business: string;
  marketId: string;
  contactName: string;
  email: string;
  phone: string;
  heroUrl: string | null;
  aboutUrl: string | null;
  /** The logins made for the demo (one password for all three). */
  adminEmail: string;
  driverEmail: string;
  riderEmail: string;
  loginPassword: string;
  status: DemoStatus;
  createdAt: Date;
  expiresAt: Date;
  views: number;
  firstOpenedAt: Date | null;
  lastSeenAt: Date | null;
};

export type DemoEvent = {
  id: number;
  demoId: string;
  at: Date;
  kind: "view" | "login" | "booking" | "signup";
  detail: string;
};

const DDL = [
  `CREATE SCHEMA IF NOT EXISTS platform`,
  `CREATE TABLE IF NOT EXISTS platform.demos (
    id text PRIMARY KEY,
    ref text NOT NULL DEFAULT '',
    slug text NOT NULL,
    schema_name text NOT NULL UNIQUE,
    business text NOT NULL,
    market_id text NOT NULL,
    contact_name text NOT NULL DEFAULT '',
    email text NOT NULL DEFAULT '',
    phone text NOT NULL DEFAULT '',
    hero_url text,
    about_url text,
    admin_email text NOT NULL DEFAULT '',
    driver_email text NOT NULL DEFAULT '',
    rider_email text NOT NULL DEFAULT '',
    login_password text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'creating',
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL,
    views integer NOT NULL DEFAULT 0,
    first_opened_at timestamptz,
    last_seen_at timestamptz
  )`,
  // One live demo per address; an expired or deleted one frees it up.
  `CREATE UNIQUE INDEX IF NOT EXISTS demos_live_slug
    ON platform.demos (slug) WHERE status IN ('creating', 'live')`,
  `CREATE TABLE IF NOT EXISTS platform.demo_events (
    id bigserial PRIMARY KEY,
    demo_id text NOT NULL REFERENCES platform.demos (id) ON DELETE CASCADE,
    at timestamptz NOT NULL DEFAULT now(),
    kind text NOT NULL,
    detail text NOT NULL DEFAULT ''
  )`,
  `CREATE INDEX IF NOT EXISTS demo_events_demo ON platform.demo_events (demo_id, at DESC)`,
];

let ready: Promise<void> | null = null;

/** Make the platform's tables if they aren't there yet (once per process). */
export function ensurePlatform(): Promise<void> {
  ready ??= (async () => {
    for (const sql of DDL) await prismaBase.$executeRawUnsafe(sql);
  })().catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

type Row = Record<string, unknown>;

const toRecord = (r: Row): DemoRecord => ({
  id: String(r.id),
  ref: String(r.ref ?? ""),
  slug: String(r.slug),
  schemaName: String(r.schema_name),
  business: String(r.business),
  marketId: String(r.market_id),
  contactName: String(r.contact_name ?? ""),
  email: String(r.email ?? ""),
  phone: String(r.phone ?? ""),
  heroUrl: (r.hero_url as string | null) ?? null,
  aboutUrl: (r.about_url as string | null) ?? null,
  adminEmail: String(r.admin_email ?? ""),
  driverEmail: String(r.driver_email ?? ""),
  riderEmail: String(r.rider_email ?? ""),
  loginPassword: String(r.login_password ?? ""),
  status: String(r.status) as DemoStatus,
  createdAt: new Date(r.created_at as string),
  expiresAt: new Date(r.expires_at as string),
  views: Number(r.views ?? 0),
  firstOpenedAt: r.first_opened_at
    ? new Date(r.first_opened_at as string)
    : null,
  lastSeenAt: r.last_seen_at ? new Date(r.last_seen_at as string) : null,
});

// ── Lookups by address, cached briefly so every page doesn't ask ──

const CACHE_MS = 30_000;
const bySlug = new Map<string, { at: number; demo: DemoRecord | null }>();

/** The newest demo at this address (live, or the last one that ended). */
export async function demoBySlug(slug: string): Promise<DemoRecord | null> {
  const hit = bySlug.get(slug);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.demo;
  await ensurePlatform();
  const rows = await prismaBase.$queryRaw<Row[]>`
    SELECT * FROM platform.demos
    WHERE slug = ${slug} AND status <> 'failed'
    ORDER BY (status IN ('creating', 'live')) DESC, created_at DESC
    LIMIT 1`;
  const demo = rows[0] ? toRecord(rows[0]) : null;
  bySlug.set(slug, { at: Date.now(), demo });
  return demo;
}

const forgetSlug = (slug: string) => bySlug.delete(slug);

export async function demoById(id: string): Promise<DemoRecord | null> {
  await ensurePlatform();
  const rows = await prismaBase.$queryRaw<Row[]>`
    SELECT * FROM platform.demos WHERE id = ${id} LIMIT 1`;
  return rows[0] ? toRecord(rows[0]) : null;
}

export async function listDemos(): Promise<DemoRecord[]> {
  await ensurePlatform();
  const rows = await prismaBase.$queryRaw<Row[]>`
    SELECT * FROM platform.demos
    WHERE status <> 'failed'
    ORDER BY created_at DESC`;
  return rows.map(toRecord);
}

/** Live demos whose time is up. */
export async function demosPastExpiry(now = new Date()): Promise<DemoRecord[]> {
  await ensurePlatform();
  const rows = await prismaBase.$queryRaw<Row[]>`
    SELECT * FROM platform.demos
    WHERE status = 'live' AND expires_at <= ${now}`;
  return rows.map(toRecord);
}

/** Is this address free for a new demo? */
export async function slugTaken(slug: string): Promise<boolean> {
  await ensurePlatform();
  const rows = await prismaBase.$queryRaw<Row[]>`
    SELECT 1 FROM platform.demos
    WHERE slug = ${slug} AND status IN ('creating', 'live') LIMIT 1`;
  return rows.length > 0;
}

/** A new id ("k3v9x2q7md") and the schema it gets ("demo_k3v9x2q7md"). */
export function newDemoId() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(10);
  const id = [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
  return { id, schemaName: `demo_${id}` };
}

export async function insertDemo(
  d: Omit<
    DemoRecord,
    "status" | "createdAt" | "views" | "firstOpenedAt" | "lastSeenAt"
  >,
) {
  await ensurePlatform();
  await prismaBase.$executeRaw`
    INSERT INTO platform.demos (
      id, ref, slug, schema_name, business, market_id, contact_name, email, phone,
      hero_url, about_url, admin_email, driver_email, rider_email,
      login_password, status, expires_at
    ) VALUES (
      ${d.id}, ${d.ref}, ${d.slug}, ${d.schemaName}, ${d.business}, ${d.marketId},
      ${d.contactName}, ${d.email}, ${d.phone}, ${d.heroUrl}, ${d.aboutUrl},
      ${d.adminEmail}, ${d.driverEmail}, ${d.riderEmail}, ${d.loginPassword},
      'creating', ${d.expiresAt}
    )`;
  forgetSlug(d.slug);
}

export async function setDemoStatus(demo: DemoRecord, status: DemoStatus) {
  await prismaBase.$executeRaw`
    UPDATE platform.demos SET status = ${status} WHERE id = ${demo.id}`;
  forgetSlug(demo.slug);
}

export async function setDemoPhotos(
  demo: DemoRecord,
  photos: { heroUrl: string | null; aboutUrl: string | null },
) {
  await prismaBase.$executeRaw`
    UPDATE platform.demos
    SET hero_url = ${photos.heroUrl}, about_url = ${photos.aboutUrl}
    WHERE id = ${demo.id}`;
  forgetSlug(demo.slug);
}

/** The name and contact on the demo's row: the "Preview for …" tag and
 *  the F&F admin's list. */
export async function setDemoDetails(
  demo: DemoRecord,
  details: {
    business: string;
    contactName: string;
    email: string;
    phone: string;
  },
) {
  await prismaBase.$executeRaw`
    UPDATE platform.demos
    SET business = ${details.business},
        contact_name = ${details.contactName},
        email = ${details.email},
        phone = ${details.phone}
    WHERE id = ${demo.id}`;
  forgetSlug(demo.slug);
}

export async function setDemoExpiry(demo: DemoRecord, expiresAt: Date) {
  await prismaBase.$executeRaw`
    UPDATE platform.demos SET expires_at = ${expiresAt} WHERE id = ${demo.id}`;
  forgetSlug(demo.slug);
}

export async function deleteDemoRow(demo: DemoRecord) {
  await prismaBase.$executeRaw`DELETE FROM platform.demos WHERE id = ${demo.id}`;
  forgetSlug(demo.slug);
}

// ── What they did ──

/** A page view: counts it and keeps first-opened and last-seen. */
/** Counts a page view. Returns when the demo was first opened and last
 *  seen before this view (both null on the very first). */
export async function recordView(
  demo: DemoRecord,
  path: string,
): Promise<{ firstOpenedAt: Date | null; lastSeenAt: Date | null }> {
  const rows = await prismaBase.$queryRaw<Row[]>`
    WITH before AS (
      SELECT first_opened_at, last_seen_at FROM platform.demos
      WHERE id = ${demo.id}
      FOR UPDATE
    )
    UPDATE platform.demos d
    SET views = d.views + 1,
        first_opened_at = COALESCE(d.first_opened_at, now()),
        last_seen_at = now()
    FROM before
    WHERE d.id = ${demo.id}
    RETURNING before.first_opened_at AS was_first, before.last_seen_at AS was_last`;
  await recordEvent(demo, "view", path);
  forgetSlug(demo.slug);
  const r = rows[0] ?? {};
  return {
    firstOpenedAt: r.was_first ? new Date(r.was_first as string) : null,
    lastSeenAt: r.was_last ? new Date(r.was_last as string) : null,
  };
}

export async function recordEvent(
  demo: DemoRecord,
  kind: DemoEvent["kind"],
  detail: string,
) {
  await prismaBase.$executeRaw`
    INSERT INTO platform.demo_events (demo_id, kind, detail)
    VALUES (${demo.id}, ${kind}, ${detail.slice(0, 300)})`;
}

/** When this demo last had an event of this kind, if ever. */
export async function lastEventAt(
  demoId: string,
  kind: DemoEvent["kind"],
): Promise<Date | null> {
  const rows = await prismaBase.$queryRaw<Row[]>`
    SELECT max(at) AS at FROM platform.demo_events
    WHERE demo_id = ${demoId} AND kind = ${kind}`;
  const at = rows[0]?.at;
  return at ? new Date(at as string) : null;
}

/** Every demo's events since a time, oldest first: the daily summary. */
export async function eventsSince(since: Date): Promise<DemoEvent[]> {
  await ensurePlatform();
  const rows = await prismaBase.$queryRaw<Row[]>`
    SELECT * FROM platform.demo_events
    WHERE at >= ${since}
    ORDER BY at ASC
    LIMIT 5000`;
  return rows.map(toEvent);
}

export async function demoEvents(
  demoId: string,
  limit = 50,
): Promise<DemoEvent[]> {
  await ensurePlatform();
  const rows = await prismaBase.$queryRaw<Row[]>`
    SELECT * FROM platform.demo_events
    WHERE demo_id = ${demoId}
    ORDER BY at DESC
    LIMIT ${limit}`;
  return rows.map(toEvent);
}

const toEvent = (r: Row): DemoEvent => ({
  id: Number(r.id),
  demoId: String(r.demo_id),
  at: new Date(r.at as string),
  kind: String(r.kind) as DemoEvent["kind"],
  detail: String(r.detail ?? ""),
});
