// What a dashboard's navigation is made of. The driver and customer
// dashboards each list their pages in groups (driverNav.tsx,
// customerNav.tsx); PortalSideNav shows them on desktop and, at 1068px
// and below, PortalBottomBar shows the first few as tabs and the rest in
// its More sheet.

import type { ReactNode } from "react";

export type PortalNavItem = {
  key: string;
  title: string;
  /** A shorter name for the bottom bar. */
  short: string;
  href: string;
  icon: ReactNode;
  /** A count to show beside it (unread, waiting…). */
  badge?: number;
};

export type PortalNavGroup = { label: string; items: PortalNavItem[] };

/** A link to another dashboard (driver, customer, admin), under the pages. */
export type PortalExtraLink = { title: string; href: string };

/**
 * The dashboard's home matches only itself; every other page also matches
 * the pages under it (/dashboard/trips/abc is My trips).
 */
export function isPortalNavActive(
  pathname: string,
  href: string,
  rootHref: string,
) {
  return href === rootHref
    ? pathname === rootHref
    : pathname === href || pathname.startsWith(href + "/");
}
