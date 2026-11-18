"use client";

// A small "Open now / Closed, opens at …" line with a dot, live in the
// market's time. Empty on the server and for the first paint.

import type { Hours } from "@/lib/contact";
import { useMarket } from "@/components/Providers/MarketProvider";
import { deskStatus, useLocalTime } from "./useLocalTime";
import styles from "./DeskStatus.module.css";

export default function DeskStatus({
  hours,
  className = "",
}: {
  hours: Hours;
  className?: string;
}) {
  const now = useLocalTime();
  if (!now) return <span className={`${styles.status} ${className}`} />;
  const s = deskStatus(hours, now);
  return (
    <span className={`${styles.status} ${className}`}>
      <span
        className={`${styles.dot} ${s.open ? styles.open : ""}`}
        aria-hidden='true'
      />
      {s.text}
    </span>
  );
}

/** "In Las Vegas it is 18:18 on Monday". */
export function LocalClock({ className = "" }: { className?: string }) {
  const { city } = useMarket();
  const now = useLocalTime();
  return (
    <span className={className}>
      {now ? (
        <>
          In {city} it is <strong>{now.label}</strong>
        </>
      ) : (
        " "
      )}
    </span>
  );
}
