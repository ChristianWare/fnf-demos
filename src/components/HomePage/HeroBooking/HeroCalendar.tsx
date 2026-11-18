"use client";

// The hero's date picker: a month of day boxes in a small panel, styled
// like the booking tool's calendar. Open days are white boxes, days before
// the earliest bookable date and the days around the month are faded, today
// has a gold dot, and the chosen day is filled in midnight.
//
// Arrow keys move between days (a week at a time up and down), Page Up and
// Page Down change the month, Enter picks, and Escape closes.

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Arrow from "@/components/shared/icons/Arrow/Arrow";
import styles from "./HeroCalendar.module.css";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Calendar days are local dates: their key is just y-m-d. */
const ymd = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

function parseYmd(value: string): Date | null {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function addDays(date: Date, n: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n);
  return copy;
}

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

/** The Monday on or before d. */
function startOfWeekMonday(d: Date) {
  const res = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return addDays(res, -((res.getDay() + 6) % 7));
}

/** The same day n months on, kept inside the month (Jan 31 → Feb 28). */
function addMonths(d: Date, n: number) {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  return new Date(
    first.getFullYear(),
    first.getMonth(),
    Math.min(d.getDate(), last.getDate()),
  );
}

function dayLabel(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function HeroCalendar({
  id,
  value,
  min,
  onSelect,
  onClose,
}: {
  id: string;
  /** The chosen day, "2026-11-20". */
  value: string;
  /** The earliest day that can be picked. */
  min: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const today = ymd(new Date());
  const minDate = parseYmd(min) ?? new Date();

  // The day that has keyboard focus, and the month on show.
  const [active, setActive] = useState(() => {
    const v = parseYmd(value);
    return v && ymd(v) >= min ? v : minDate;
  });
  const [month, setMonth] = useState(() => startOfMonth(active));
  const gridRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const opened = useRef(false);

  // Monday of the week the month starts in, to Sunday of the week it ends in.
  const days = useMemo(() => {
    const first = startOfMonth(month);
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
    const end = addDays(startOfWeekMonday(last), 6);
    const list: Date[] = [];
    for (let d = startOfWeekMonday(first); d <= end; d = addDays(d, 1)) {
      list.push(d);
    }
    return list;
  }, [month]);

  const canGoPrev = startOfMonth(month) > startOfMonth(minDate);

  // Focus the active day when the panel opens and after each arrow key
  // (not after the month buttons, so they can be clicked again).
  useEffect(() => {
    if (!opened.current || moved.current) {
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-day="${ymd(active)}"]`)
        ?.focus({ preventScroll: true });
    }
    opened.current = true;
    moved.current = false;
  }, [active, month]);

  const goMonth = (n: number) => {
    const next = startOfMonth(addMonths(month, n));
    setMonth(next);
    // Keep the focusable day inside the month on show.
    const target = addMonths(active, n);
    setActive(ymd(target) < min ? minDate : target);
  };

  const moveTo = (next: Date) => {
    if (ymd(next) < min) return;
    moved.current = true;
    setActive(next);
    if (
      next.getMonth() !== month.getMonth() ||
      next.getFullYear() !== month.getFullYear()
    ) {
      setMonth(startOfMonth(next));
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => Date> = {
      ArrowLeft: () => addDays(active, -1),
      ArrowRight: () => addDays(active, 1),
      ArrowUp: () => addDays(active, -7),
      ArrowDown: () => addDays(active, 7),
      PageUp: () => addMonths(active, -1),
      PageDown: () => addMonths(active, 1),
      Home: () => startOfWeekMonday(active),
      End: () => addDays(startOfWeekMonday(active), 6),
    };
    const next = keys[e.key];
    if (!next) return;
    e.preventDefault();
    moveTo(next());
  };

  const monthLabel = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      id={id}
      className={styles.panel}
      role='dialog'
      aria-label='Choose a date'
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <div className={styles.head}>
        <button
          type='button'
          className={styles.navBtn}
          onClick={() => goMonth(-1)}
          disabled={!canGoPrev}
          aria-label='Previous month'
        >
          <Arrow className={styles.prevIcon} />
        </button>
        <p className={styles.month} aria-live='polite'>
          {monthLabel}
        </p>
        <button
          type='button'
          className={styles.navBtn}
          onClick={() => goMonth(1)}
          aria-label='Next month'
        >
          <Arrow className={styles.nextIcon} />
        </button>
      </div>

      <div ref={gridRef} className={styles.grid} onKeyDown={onKeyDown}>
        {WEEKDAYS.map((d) => (
          <span key={d} className={styles.dow} aria-hidden='true'>
            {d.slice(0, 2)}
          </span>
        ))}

        {days.map((d) => {
          const key = ymd(d);
          const inMonth = d.getMonth() === month.getMonth();

          // Days around the month are just faded numbers.
          if (!inMonth) {
            return (
              <span
                key={key}
                className={`${styles.day} ${styles.dayFaded}`}
                aria-hidden='true'
              >
                {d.getDate()}
              </span>
            );
          }

          const disabled = key < min;
          const isSelected = key === value;
          const isToday = key === today;
          const cls = [
            styles.day,
            disabled ? styles.dayFaded : styles.dayOpen,
            isSelected ? styles.daySelected : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={key}
              type='button'
              data-day={key}
              className={cls}
              disabled={disabled}
              tabIndex={key === ymd(active) ? 0 : -1}
              aria-pressed={isSelected}
              aria-label={`${dayLabel(d)}${isToday ? ", today" : ""}`}
              onClick={() => onSelect(key)}
            >
              {isToday && <span className={styles.todayDot} />}
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
