"use client";

// On every page of a demo: a small "Preview" tag in the bottom-left corner
// that opens to "Preview for … by Fonts & Footers" (and can be hidden for
// the visit), and the visit counter.
//
// Visits are sent from the browser, so link previews in texts and emails
// (which don't run scripts) never count. Opening a demo with ?ff=owner
// marks that browser as Chris's, and its visits stop counting.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./DemoBadge.module.css";

const OWNER_COOKIE = "ff_owner";

function isOwner() {
  return document.cookie.split("; ").some((c) => c === `${OWNER_COOKIE}=1`);
}

export default function DemoBadge({ business }: { business: string }) {
  const pathname = usePathname();
  const [shown, setShown] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("ff") === "owner") {
      document.cookie = `${OWNER_COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
      url.searchParams.delete("ff");
      window.history.replaceState(null, "", url.toString());
      return;
    }
    if (isOwner()) return;
    const body = JSON.stringify({ path: pathname });
    if (!navigator.sendBeacon?.("/api/platform/visit", body)) {
      void fetch("/api/platform/visit", {
        method: "POST",
        body,
        keepalive: true,
      });
    }
  }, [pathname]);

  if (!shown) return null;

  if (!open) {
    return (
      <button
        type='button'
        className={`${styles.badge} ${styles.compact}`}
        aria-label={`Preview for ${business} by Fonts & Footers`}
        onClick={() => setOpen(true)}
      >
        <span className={styles.dot} aria-hidden='true' />
        Preview
      </button>
    );
  }

  return (
    <aside className={styles.badge} aria-label='About this preview'>
      <span className={styles.dot} aria-hidden='true' />
      <span className={styles.text}>
        Preview for <strong>{business}</strong> by{" "}
        <a href='https://fontsandfooters.com' className={styles.link}>
          Fonts &amp; Footers
        </a>
      </span>
      <button
        type='button'
        className={styles.close}
        aria-label='Hide this note'
        onClick={() => setShown(false)}
      >
        ×
      </button>
    </aside>
  );
}
