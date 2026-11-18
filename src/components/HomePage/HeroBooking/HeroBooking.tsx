"use client";

// The hero's mini booking tool: a service, a date and a passenger count,
// then "Book now" opens the full booking tool with all three filled in. It
// hands them over the same way the booking tool already reads a prefill
// (sessionStorage "booking_prefill", read once on /book).
//
// The date opens the site's own calendar (HeroCalendar) above the form.
// The service and passengers use the browser's own lists, under the styled
// fields.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Arrow from "@/components/shared/icons/Arrow/Arrow";
import { SITE } from "@/config/site";
import HeroCalendar from "./HeroCalendar";
import styles from "./HeroBooking.module.css";

const MAX_PASSENGERS = 14;

export type HeroService = { id: string; name: string };

/** The earliest date the booking tool accepts (lead time from site config). */
function earliestDate(): string {
  const d = new Date(Date.now() + SITE.booking.leadHours * 60 * 60 * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const noopSubscribe = () => () => {};

/** "2026-11-09" → "Mon, Nov 9" */
function formatDate(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return "Pick a date";
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function HeroBooking({
  services = [],
}: {
  services?: HeroService[];
}) {
  const router = useRouter();
  // The earliest date is read in the browser only (the server's clock and
  // time zone can differ), so the first render matches on both sides.
  const minDate = useSyncExternalStore(noopSubscribe, earliestDate, () => "");
  const [picked, setPicked] = useState("");
  const date = picked || minDate;
  const [serviceId, setServiceId] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dateFieldRef = useRef<HTMLDivElement>(null);
  const dateBtnRef = useRef<HTMLButtonElement>(null);

  const service = services.find((s) => s.id === serviceId);

  const closeCalendar = (refocus = true) => {
    setCalendarOpen(false);
    if (refocus) dateBtnRef.current?.focus();
  };

  // A click or tap outside the date field and its calendar closes it.
  useEffect(() => {
    if (!calendarOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!dateFieldRef.current?.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [calendarOpen]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sessionStorage.setItem(
        "booking_prefill",
        JSON.stringify({
          serviceTypeId: serviceId || undefined,
          pickupAtDate: date || undefined,
          passengers,
        }),
      );
    } catch {
      // Private mode or storage blocked: the booking tool just opens empty.
    }
    router.push("/book");
  };

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      aria-label='Quick booking'
    >
      {services.length > 0 && (
        <>
          <div className={`${styles.field} ${styles.fieldService}`}>
            <label htmlFor='hero-service' className={styles.label}>
              Service
            </label>
            <span className={styles.value}>
              <span className={styles.valueText}>
                {service ? service.name : "Choose a service"}
              </span>
              <Chevron />
            </span>
            <select
              id='hero-service'
              className={styles.select}
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value=''>Choose a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`${styles.divider} ${styles.dividerService}`}
            aria-hidden='true'
          />
        </>
      )}

      <div ref={dateFieldRef} className={styles.dateField}>
        <button
          ref={dateBtnRef}
          type='button'
          className={`${styles.field} ${styles.fieldButton}`}
          aria-haspopup='dialog'
          aria-expanded={calendarOpen}
          aria-controls={calendarOpen ? "hero-calendar" : undefined}
          onClick={() => setCalendarOpen((o) => !o)}
        >
          <span className={styles.label}>Date</span>
          <span className={styles.value}>
            <span className={styles.valueText}>
              {date ? formatDate(date) : "Pick a date"}
            </span>
            <Chevron open={calendarOpen} />
          </span>
        </button>

        {calendarOpen && minDate && (
          <HeroCalendar
            id='hero-calendar'
            value={date}
            min={minDate}
            onSelect={(v) => {
              setPicked(v);
              closeCalendar();
            }}
            onClose={() => closeCalendar()}
          />
        )}
      </div>

      <div className={styles.divider} aria-hidden='true' />

      <div className={styles.field}>
        <label htmlFor='hero-passengers' className={styles.label}>
          Passengers
        </label>
        <span className={styles.value}>
          <span className={styles.valueText}>
            {passengers} {passengers === 1 ? "passenger" : "passengers"}
          </span>
          <Chevron />
        </span>
        <select
          id='hero-passengers'
          className={styles.select}
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
        >
          {Array.from({ length: MAX_PASSENGERS }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "passenger" : "passengers"}
            </option>
          ))}
        </select>
      </div>

      <button type='submit' className={styles.btn}>
        Book now
        <span className={styles.btnBox} aria-hidden='true'>
          <Arrow className={styles.btnArrow} />
        </span>
      </button>
    </form>
  );
}

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg
      className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
      viewBox='0 0 24 24'
      width='14'
      height='14'
      aria-hidden='true'
    >
      <path
        d='M6 9l6 6 6-6'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
