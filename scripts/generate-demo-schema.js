// Writes src/generated/demo-schema.sql: the SQL that builds every table in
// prisma/schema.prisma from nothing. Making a demo runs it inside the
// demo's own Postgres schema (src/lib/platform/provision.ts).
//
// Runs in `npm run build` and `npm run db:demo-schema`. Needs no database.

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const out = path.join(root, "src", "generated", "demo-schema.sql");

const sql = execFileSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "prisma",
    "migrate",
    "diff",
    "--from-empty",
    "--to-schema-datamodel",
    "prisma/schema.prisma",
    "--script",
  ],
  { cwd: root, encoding: "utf8" },
);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, sql);
console.log(`✓ Demo schema SQL (${sql.split(";").length - 1} statements)`);
