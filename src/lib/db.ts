/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PrismaClient } from "@prisma/client";
import { prismaBase, prismaForSchema } from "@/lib/platform/prismaBase";
import { forcedSchema, getDemoContext } from "@/lib/platform/context";

/**
 * Soft-delete guard for bookings.
 * Every top-level booking read (findMany / findFirst / count / aggregate /
 * groupBy) automatically excludes trashed rows (deletedAt != null) UNLESS
 * the query itself mentions `deletedAt` — which is how the Trash view and
 * the purge cron opt out. findUnique is intentionally NOT filtered so the
 * booking detail page still opens for trashed bookings.
 */
function mentionsDeletedAt(where: unknown): boolean {
  if (!where) return false;
  try {
    return JSON.stringify(where).includes('"deletedAt"');
  } catch {
    return false;
  }
}

function withSoftDelete(client: PrismaClient) {
  return client.$extends({
    name: "bookingSoftDelete",
    query: {
      booking: {
        async findMany({ args, query }) {
          if (!mentionsDeletedAt(args.where))
            args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findFirst({ args, query }) {
          if (!mentionsDeletedAt(args.where))
            args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async count({ args, query }) {
          if (!mentionsDeletedAt(args.where))
            args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async aggregate({ args, query }) {
          if (!mentionsDeletedAt(args.where))
            args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async groupBy({ args, query }) {
          if (!mentionsDeletedAt(args.where))
            args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
      },
    },
  });
}

type Db = ReturnType<typeof withSoftDelete>;

// ── One database, a schema per demo ──
//
// `db` looks and types like a Prisma client, so none of the code that uses
// it changes. Each call is sent to the right schema when it runs: the
// current demo's (src/lib/platform/context.ts), or the main site's when
// the request isn't for a demo. A demo address with no live demo behind
// it gets an error rather than the main site's data.

const extended = new WeakMap<PrismaClient, Db>();
function softDeleting(client: PrismaClient): Db {
  let hit = extended.get(client);
  if (!hit) {
    hit = withSoftDelete(client);
    extended.set(client, hit);
  }
  return hit;
}

export class DemoUnavailableError extends Error {
  constructor() {
    super("This preview has ended or doesn't exist.");
    this.name = "DemoUnavailableError";
  }
}

// An ended or missing demo's pages only show the "preview ended" page, but
// their parts may still load data while it renders: reads find nothing,
// and any write is refused.
const READS: Record<string, unknown> = {
  findUnique: null,
  findUniqueOrThrow: null,
  findFirst: null,
  findFirstOrThrow: null,
  findMany: [],
  groupBy: [],
  count: 0,
  aggregate: { _sum: {}, _count: {}, _avg: {}, _min: {}, _max: {} },
};
const noDemo = new Proxy({} as Db, {
  get(_t, prop) {
    if (typeof prop !== "string" || prop === "then") return undefined;
    if (prop === "$queryRaw" || prop === "$queryRawUnsafe")
      return async () => [];
    if (prop.startsWith("$")) {
      return async () => {
        throw new DemoUnavailableError();
      };
    }
    return new Proxy(
      {},
      {
        get: (_m, method) => async () => {
          if (typeof method === "string" && method in READS) {
            if (method.endsWith("OrThrow")) throw new DemoUnavailableError();
            return READS[method];
          }
          throw new DemoUnavailableError();
        },
      },
    );
  },
});

/** The client for the current request. */
export async function currentDb(): Promise<Db> {
  const schema = forcedSchema();
  if (schema) return softDeleting(prismaForSchema(schema));
  const ctx = await getDemoContext();
  if (ctx.kind === "main") return softDeleting(prismaBase);
  if (ctx.kind === "demo" && ctx.demo.status === "live") {
    return softDeleting(prismaForSchema(ctx.demo.schemaName));
  }
  return noDemo;
}

/**
 * One call on `db` (db.booking.findMany(…), db.$queryRaw`…`), run once
 * awaited, like Prisma's own. Inside db.$transaction([...]) it's turned
 * into the real Prisma call on the same client.
 */
class DbCall<T = unknown> implements PromiseLike<T> {
  private running?: Promise<T>;
  constructor(
    private readonly model: string | null,
    private readonly method: string,
    private readonly args: unknown[],
  ) {}

  /** The Prisma call itself, on `client`. */
  on(client: Db): unknown {
    const target = (this.model ? (client as any)[this.model] : client) as any;
    return target[this.method](...this.args);
  }

  private run(): Promise<T> {
    this.running ??= currentDb().then((c) => this.on(c) as Promise<T>);
    return this.running;
  }

  then<A = T, B = never>(
    ok?: ((v: T) => A | PromiseLike<A>) | null,
    fail?: ((e: unknown) => B | PromiseLike<B>) | null,
  ): Promise<A | B> {
    return this.run().then(ok, fail);
  }

  catch<B = never>(fail?: ((e: unknown) => B | PromiseLike<B>) | null) {
    return this.run().catch(fail);
  }

  finally(fn?: (() => void) | null) {
    return this.run().finally(fn);
  }

  get [Symbol.toStringTag]() {
    return "DbCall";
  }
}

async function transaction(arg: unknown, options?: unknown) {
  const client = await currentDb();
  if (Array.isArray(arg)) {
    const calls = arg.map((x) => (x instanceof DbCall ? x.on(client) : x));
    return (client as any).$transaction(calls, options);
  }
  return (client as any).$transaction(arg, options);
}

const models = new Map<string, unknown>();
function model(name: string) {
  let m = models.get(name);
  if (!m) {
    m = new Proxy(
      {},
      {
        get: (_t, method) =>
          typeof method === "string"
            ? (...args: unknown[]) => new DbCall(name, method, args)
            : undefined,
      },
    );
    models.set(name, m);
  }
  return m;
}

export const db = new Proxy({} as Db, {
  get(_t, prop) {
    if (typeof prop !== "string") return undefined;
    // Promise checks (await db) must not treat db as a promise.
    if (prop === "then") return undefined;
    if (prop === "$transaction") return transaction;
    if (prop.startsWith("$")) {
      return (...args: unknown[]) => new DbCall(null, prop, args);
    }
    return model(prop);
  },
}) as Db;
