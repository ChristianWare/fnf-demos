// The four bookings a new demo starts with, so every screen has something
// on it the first time it's opened, and each one shows a different part of
// the job:
//
//   1. Last week: an airport pickup, driven and paid (reports, earnings,
//      the rider's trip history).
//   2. Tomorrow evening: an hourly booking, paid, driver assigned (the
//      driver app's next trip).
//   3. In two days: a group airport drop-off, paid, no driver yet (assign
//      one on the call).
//   4. In four days: a guest's request waiting for a yes (approve it on the
//      call).
//
// The places come from the market (src/markets), the times are the
// market's local time. Prices are worked out from the demo's own sample
// rates, roughly as the booking tool would.

import {
  BookingStatus,
  PaymentStatus,
  type Prisma,
  type ServiceType,
  type Vehicle,
} from "@prisma/client";
import { db } from "@/lib/db";
import { formatPhone } from "@/lib/phone";
import { localToUtcIso, toLocalParts } from "@/lib/timezone";
import type { Market, MarketPlace } from "@/markets";

type Spot = { address: string; lat: number; lng: number };

const spot = (p: MarketPlace | Market["airports"][number]): Spot => ({
  address: `${p.name}, ${p.address}`,
  lat: p.lat,
  lng: p.lng,
});

/** Road miles between two points: straight line plus a quarter. */
function roadMiles(a: Spot, b: Spot) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const miles = 2 * 3958.8 * Math.asin(Math.sqrt(h));
  return Math.max(1, Math.round(miles * 1.25 * 10) / 10);
}

function price(
  service: ServiceType,
  vehicle: Vehicle,
  miles: number,
  hours: number | null,
) {
  if (hours) {
    return hours * (service.perHourCents + vehicle.perHourCents);
  }
  const ride = Math.max(
    service.minFareCents,
    service.baseFeeCents + Math.round(service.perMileCents * miles),
  );
  return (
    ride + vehicle.baseFareCents + Math.round(vehicle.perMileCents * miles)
  );
}

/** A local time `days` from today in the market's time zone. */
function localAt(market: Market, days: number, time: string) {
  const today = toLocalParts(new Date(), market.timeZone);
  const day = new Date(Date.UTC(today.y, today.m, today.d + days));
  const iso = day.toISOString().slice(0, 10);
  return new Date(localToUtcIso(iso, time, market.timeZone));
}

const hoursBefore = (at: Date, hours: number) =>
  new Date(at.getTime() - hours * 3_600_000);

export async function seedSampleBookings(
  market: Market,
  people: { adminId: string; driverId: string; riderId: string },
) {
  const services = await db.serviceType.findMany();
  const vehicles = await db.vehicle.findMany();
  const service = (slug: string) => services.find((s) => s.slug === slug);
  const vehicle = (slug: string) => vehicles.find((v) => v.fleetSlug === slug);

  const airport =
    market.airports.find((a) => a.kind === "commercial") ?? market.airports[0];
  const [hotel, secondHotel, venue] = market.places;
  const phone = (last4: string) => formatPhone(`${market.areaCode}555${last4}`);

  type Sample = {
    service: string;
    vehicle: string;
    from: Spot;
    to: Spot;
    pickupAt: Date;
    /** When it was booked. */
    bookedAt: Date;
    hours?: number;
    passengers: number;
    luggage: number;
    status: BookingStatus;
    paid: boolean;
    driver: boolean;
    rider: boolean;
    guest?: { name: string; email: string; phone: string };
    flight?: { airline: string; number: string };
    specialRequests?: string;
  };

  const lastWeek = localAt(market, -6, "10:30");
  const tomorrow = localAt(market, 1, "18:30");
  const inTwoDays = localAt(market, 2, "07:00");
  const inFourDays = localAt(market, 4, "14:15");

  const samples: Sample[] = [
    {
      service: "airport-pickup",
      vehicle: "luxury-suv",
      from: spot(airport),
      to: spot(hotel),
      pickupAt: lastWeek,
      bookedAt: hoursBefore(lastWeek, 72),
      passengers: 2,
      luggage: 3,
      status: BookingStatus.COMPLETED,
      paid: true,
      driver: true,
      rider: true,
      flight: { airline: "Southwest", number: "WN1842" },
    },
    {
      service: "hourly",
      vehicle: "luxury-suv",
      from: spot(hotel),
      to: spot(secondHotel),
      pickupAt: tomorrow,
      bookedAt: hoursBefore(new Date(), 30),
      hours: 3,
      passengers: 4,
      luggage: 0,
      status: BookingStatus.ASSIGNED,
      paid: true,
      driver: true,
      rider: true,
      specialRequests: "Dinner for four, then back to the hotel around 9:30.",
    },
    {
      service: "airport-dropoff",
      vehicle: "executive-sprinter",
      from: spot(venue),
      to: spot(airport),
      pickupAt: inTwoDays,
      bookedAt: hoursBefore(new Date(), 20),
      passengers: 9,
      luggage: 9,
      status: BookingStatus.CONFIRMED,
      paid: true,
      driver: false,
      rider: false,
      guest: {
        name: "Morgan Reyes",
        email: "morgan.reyes@example.com",
        phone: phone("0142"),
      },
      specialRequests: "Team of nine heading home after the conference.",
    },
    {
      service: "point-to-point",
      vehicle: "executive-sedan",
      from: spot(secondHotel),
      to: spot(venue),
      pickupAt: inFourDays,
      bookedAt: hoursBefore(new Date(), 2),
      passengers: 1,
      luggage: 1,
      status: BookingStatus.PENDING_REVIEW,
      paid: false,
      driver: false,
      rider: false,
      guest: {
        name: "Taylor Brooks",
        email: "taylor.brooks@example.com",
        phone: phone("0187"),
      },
    },
  ];

  for (const s of samples) {
    const svc = service(s.service);
    const veh = vehicle(s.vehicle);
    if (!svc || !veh) continue;

    const miles = roadMiles(s.from, s.to);
    const minutes = Math.round((miles / 32) * 60 + 8);
    const total = price(svc, veh, miles, s.hours ?? null);
    const confirmedAt = new Date(s.bookedAt.getTime() + 25 * 60_000);
    const assignedAt = new Date(s.bookedAt.getTime() + 3 * 3_600_000);

    const events: Prisma.BookingStatusEventCreateWithoutBookingInput[] = [
      {
        status: BookingStatus.PENDING_REVIEW,
        eventType: "STATUS_CHANGE",
        createdAt: s.bookedAt,
      },
    ];
    if (s.paid) {
      events.push({
        status: BookingStatus.CONFIRMED,
        eventType: "PAYMENT_RECEIVED",
        metadata: { method: "card", amountCents: total, currency: "usd" },
        createdAt: confirmedAt,
      });
    }
    if (s.driver) {
      events.push({
        status: BookingStatus.ASSIGNED,
        eventType: "DRIVER_ASSIGNED",
        metadata: { driverId: people.driverId, driverName: "Sample Driver" },
        createdBy: { connect: { id: people.adminId } },
        createdAt: assignedAt,
      });
    }
    if (s.status === BookingStatus.COMPLETED) {
      events.push({
        status: BookingStatus.COMPLETED,
        eventType: "STATUS_CHANGE",
        createdBy: { connect: { id: people.driverId } },
        createdAt: new Date(s.pickupAt.getTime() + (minutes + 15) * 60_000),
      });
    }

    await db.booking.create({
      data: {
        user: s.rider ? { connect: { id: people.riderId } } : undefined,
        guestName: s.guest?.name,
        guestEmail: s.guest?.email,
        guestPhone: s.guest?.phone,
        serviceType: { connect: { id: svc.id } },
        vehicle: { connect: { id: veh.id } },
        status: s.status,
        pickupAt: s.pickupAt,
        passengers: s.passengers,
        luggage: s.luggage,
        hoursRequested: s.hours ?? null,
        hoursBilled: s.hours ?? null,
        pickupAddress: s.from.address,
        pickupLat: s.from.lat,
        pickupLng: s.from.lng,
        dropoffAddress: s.to.address,
        dropoffLat: s.to.lat,
        dropoffLng: s.to.lng,
        distanceMiles: miles,
        durationMinutes: minutes,
        specialRequests: s.specialRequests ?? null,
        flightAirline: s.flight?.airline ?? null,
        flightNumber: s.flight?.number ?? null,
        flightScheduledAt: s.flight ? s.pickupAt : null,
        subtotalCents: total,
        totalCents: total,
        routeApproved: s.status !== BookingStatus.PENDING_REVIEW,
        priceApproved: s.status !== BookingStatus.PENDING_REVIEW,
        createdAt: s.bookedAt,
        statusEvents: { create: events },
        payment: s.paid
          ? {
              create: {
                status: PaymentStatus.PAID,
                amountSubtotalCents: total,
                amountTotalCents: total,
                amountPaidCents: total,
                currency: "usd",
                paidAt: confirmedAt,
              },
            }
          : undefined,
        assignment: s.driver
          ? {
              create: {
                driver: { connect: { id: people.driverId } },
                assignedBy: { connect: { id: people.adminId } },
                driverPaymentCents: Math.round(total * 0.6),
                assignedAt,
              },
            }
          : undefined,
      },
    });
  }
}
