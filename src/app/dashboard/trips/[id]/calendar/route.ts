// GET /dashboard/trips/[id]/calendar: the ride as an .ics file, for "Add to
// calendar" (Apple Calendar, Outlook, most phones). Only the person who
// booked the ride can download it.

import { auth } from "../../../../../../auth";
import { db } from "@/lib/db";
import { buildIcs } from "@/lib/calendar";
import { rideCalendarEvent } from "@/components/Dashboard/AddToCalendar/rideEvent";
import { getCompanySettings } from "../../../../../../actions/admin/companySettings";
import { SITE } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return new Response("Not signed in", { status: 401 });

  const booking = await db.booking.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      pickupAt: true,
      pickupAddress: true,
      dropoffAddress: true,
      durationMinutes: true,
      hoursRequested: true,
      flightAirline: true,
      flightNumber: true,
      serviceType: { select: { name: true } },
      vehicle: { select: { name: true } },
    },
  });
  if (!booking || booking.userId !== userId) {
    return new Response("Not found", { status: 404 });
  }

  const settings = await getCompanySettings();
  const companyName = settings.companyName || SITE.name;
  const ics = buildIcs(
    rideCalendarEvent(
      {
        id: booking.id,
        pickupAt: booking.pickupAt,
        pickupAddress: booking.pickupAddress,
        dropoffAddress: booking.dropoffAddress,
        serviceName: booking.serviceType?.name ?? "Ride",
        vehicleName: booking.vehicle?.name ?? null,
        durationMinutes: booking.durationMinutes,
        hoursRequested: booking.hoursRequested,
        flight: booking.flightNumber
          ? [booking.flightAirline, booking.flightNumber]
              .filter(Boolean)
              .join(" ")
          : null,
      },
      {
        name: companyName,
        dispatchPhone: settings.dispatchPhone,
        siteUrl: SITE.url,
      },
    ),
    companyName,
  );

  const code = booking.id.slice(0, 8).toUpperCase();
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="ride-${code}.ics"`,
      "Cache-Control": "private, no-store",
    },
  });
}
