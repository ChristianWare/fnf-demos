"use client";

// The driver dashboard's navigation on tablets and phones (1068px and
// below), where it replaces the side nav: a bar fixed along the bottom of
// the screen with Home, Trips, Schedule and Earnings, and More. More opens
// a sheet from the bottom with Profile, Notifications, Support, the
// customer dashboard and Log out. The current page is in the accent, as
// on desktop.

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import BadgeCount from "@/app/admin/BadgeCount/BadgeCount";
import Arrow from "@/components/shared/icons/Arrow/Arrow";
import {
  DRIVER_NAV_ITEMS,
  DRIVER_TAB_KEYS,
  driverNavBadge,
  isDriverNavActive,
} from "@/components/Driver/DriverSideNav/driverNav";
import styles from "./DriverBottomBar.module.css";

type Props = {
  unreadNotificationsCount?: number;
  tripsNeedAttentionCount?: number;
  documentsAlertCount?: number;
};

export default function DriverBottomBar(counts: Props) {
  const pathname = usePathname() ?? "";

  // The sheet is open only on the page it was opened on, so following a
  // link in it closes it.
  const [sheetOpenOn, setSheetOpenOn] = useState<string | null>(null);
  const sheetOpen = sheetOpenOn === pathname;
  const closeSheet = () => setSheetOpenOn(null);

  const tabs = DRIVER_NAV_ITEMS.filter((i) => DRIVER_TAB_KEYS.includes(i.key));
  const more = DRIVER_NAV_ITEMS.filter((i) => !DRIVER_TAB_KEYS.includes(i.key));
  const moreActive = more.some((i) => isDriverNavActive(pathname, i.href));
  const moreBadge = more.reduce((n, i) => n + driverNavBadge(i.key, counts), 0);

  // Escape closes the sheet; the page behind it doesn't scroll.
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpenOn(null);
    };
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  return (
    <>
      <nav className={styles.bar} aria-label='Driver dashboard' data-driver-bar>
        <ul className={styles.tabs}>
          {tabs.map((t) => {
            const active = isDriverNavActive(pathname, t.href);
            const badge = driverNavBadge(t.key, counts);
            return (
              <li key={t.key}>
                <Link
                  href={t.href}
                  className={`${styles.tab} ${active ? styles.tabActive : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className={styles.icon} aria-hidden='true'>
                    {t.icon}
                    {badge > 0 ? (
                      <span className={styles.badge}>
                        <BadgeCount value={badge} max={99} />
                      </span>
                    ) : null}
                  </span>
                  {t.short}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type='button'
              className={`${styles.tab} ${moreActive || sheetOpen ? styles.tabActive : ""}`}
              onClick={() => setSheetOpenOn(sheetOpen ? null : pathname)}
              aria-expanded={sheetOpen}
              aria-controls='driver-more'
            >
              <span className={styles.icon} aria-hidden='true'>
                <span className={styles.dots}>
                  <span />
                  <span />
                  <span />
                </span>
                {moreBadge > 0 ? (
                  <span className={styles.badge}>
                    <BadgeCount value={moreBadge} max={99} />
                  </span>
                ) : null}
              </span>
              More
            </button>
          </li>
        </ul>
      </nav>

      {/* More: a sheet up from the bottom, over a dimmed page. */}
      <div
        className={`${styles.overlay} ${sheetOpen ? styles.overlayOpen : ""}`}
        onClick={closeSheet}
        aria-hidden='true'
      />
      <div
        id='driver-more'
        className={`${styles.sheet} ${sheetOpen ? styles.sheetOpen : ""}`}
        role='dialog'
        aria-modal='true'
        aria-label='More'
        aria-hidden={!sheetOpen}
        inert={!sheetOpen}
      >
        <span className={styles.handle} aria-hidden='true' />
        <ul className={styles.sheetLinks}>
          {more.map((m) => {
            const active = isDriverNavActive(pathname, m.href);
            const badge = driverNavBadge(m.key, counts);
            return (
              <li key={m.key}>
                <Link
                  href={m.href}
                  className={`${styles.sheetLink} ${active ? styles.sheetLinkActive : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={closeSheet}
                >
                  <span className={styles.sheetIcon} aria-hidden='true'>
                    {m.icon}
                  </span>
                  {m.title}
                  {badge > 0 ? <BadgeCount value={badge} max={99} /> : null}
                  <Arrow className={styles.sheetArrow} aria-hidden='true' />
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href='/dashboard'
              className={styles.sheetLink}
              onClick={closeSheet}
            >
              <span className={styles.sheetIcon} aria-hidden='true' />
              User dashboard
              <Arrow className={styles.sheetArrow} aria-hidden='true' />
            </Link>
          </li>
        </ul>
        <button
          type='button'
          className={styles.logOut}
          onClick={() => {
            closeSheet();
            signOut();
          }}
        >
          Log out
        </button>
      </div>
    </>
  );
}
