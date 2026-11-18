// The Prisma clients behind `db` (src/lib/db.ts), one per database schema.
//
// The main site uses DATABASE_URL as is (the "public" schema). Each demo
// has its own Postgres schema ("demo_<id>") in the same database; its
// client is the same URL with ?schema=demo_<id>, so every query Prisma
// writes is qualified with that schema and no demo can see another's rows.
//
// Demo clients are kept for reuse, a few at a time, each with a small
// connection pool so many demos don't use up the database's connections.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prismaBase?: PrismaClient;
  prismaSchemas?: Map<string, PrismaClient>;
};

/** The main site's client (and the platform's own tables). */
export const prismaBase: PrismaClient =
  globalForPrisma.prismaBase ?? new PrismaClient();

const schemas: Map<string, PrismaClient> =
  globalForPrisma.prismaSchemas ?? new Map();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaBase = prismaBase;
  globalForPrisma.prismaSchemas = schemas;
}

/** How many demo clients to keep open in one server process. */
const MAX_CLIENTS = 12;

export const isDemoSchema = (name: string) =>
  /^demo_[a-z0-9]{6,32}$/.test(name);

function urlForSchema(schema: string) {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("Missing DATABASE_URL");
  const url = new URL(raw);
  url.searchParams.set("schema", schema);
  if (!url.searchParams.has("connection_limit")) {
    url.searchParams.set("connection_limit", "2");
  }
  return url.toString();
}

/** The client for one demo's schema. */
export function prismaForSchema(schema: string): PrismaClient {
  if (!isDemoSchema(schema)) throw new Error(`Not a demo schema: ${schema}`);
  const hit = schemas.get(schema);
  if (hit) {
    // Most recently used goes to the back.
    schemas.delete(schema);
    schemas.set(schema, hit);
    return hit;
  }
  const client = new PrismaClient({ datasourceUrl: urlForSchema(schema) });
  schemas.set(schema, client);
  while (schemas.size > MAX_CLIENTS) {
    const [oldest, old] = schemas.entries().next().value as [
      string,
      PrismaClient,
    ];
    schemas.delete(oldest);
    void old.$disconnect().catch(() => {});
  }
  return client;
}

/** Let go of a demo's client (its schema is being dropped). */
export async function forgetSchema(schema: string) {
  const client = schemas.get(schema);
  schemas.delete(schema);
  await client?.$disconnect().catch(() => {});
}
