// Empties the trash: bookings deleted more than TRASH_RETENTION_DAYS ago
// are removed for good, except ones with a payment record (accounting
// history stays in the trash). Runs against the current schema: the main
// site's from its own cron, each demo's from the daily demo job.

import { db } from "@/lib/db";

export const TRASH_RETENTION_DAYS = 7;

export async function purgeTrash() {
  const cutoff = new Date(
    Date.now() - TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );

  const purged = await db.booking.deleteMany({
    where: { deletedAt: { lt: cutoff }, payment: { is: null } },
  });

  const retainedWithPayments = await db.booking.count({
    where: { deletedAt: { lt: cutoff } },
  });

  return { purged: purged.count, retainedWithPayments };
}
