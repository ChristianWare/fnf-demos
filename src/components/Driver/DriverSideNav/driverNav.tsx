// The driver dashboard's pages, grouped. The desktop side nav and, at
// 1068px and below, the bottom bar (first four) and its More sheet (the
// rest) both list them from here.

import type { ReactNode } from "react";
import House from "@/components/shared/icons/House/House";
import Calendar from "@/components/shared/icons/Calendar/Calendar";
import Bell from "@/components/shared/icons/Bell/Bell";
import Users from "@/components/shared/icons/Users/Users";
import Cog from "@/components/shared/icons/Cog/Cog";
import Appointments from "@/components/shared/icons/Appointments/Appointments";
import Money from "@/components/shared/icons/Money/Money";

export type DriverNavKey =
  | "overview"
  | "trips"
  | "schedule"
  | "earnings"
  | "profile"
  | "notifications"
  | "support";

export type DriverNavItem = {
  title: string;
  /** A shorter name for the bottom bar. */
  short: string;
  href: string;
  key: DriverNavKey;
  icon: ReactNode;
};

export const DRIVER_NAV_GROUPS: { label: string; items: DriverNavItem[] }[] = [
  {
    label: "Driving",
    items: [
      {
        title: "Overview",
        short: "Home",
        href: "/driver-dashboard",
        key: "overview",
        icon: <House />,
      },
      {
        title: "Trips",
        short: "Trips",
        href: "/driver-dashboard/trips",
        key: "trips",
        icon: <Appointments />,
      },
      {
        title: "Schedule",
        short: "Schedule",
        href: "/driver-dashboard/schedule",
        key: "schedule",
        icon: <Calendar />,
      },
    ],
  },
  {
    label: "Pay",
    items: [
      {
        title: "Earnings",
        short: "Earnings",
        href: "/driver-dashboard/earnings",
        key: "earnings",
        icon: <Money />,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile",
        short: "Profile",
        href: "/driver-dashboard/profile",
        key: "profile",
        icon: <Users />,
      },
      {
        title: "Notifications",
        short: "Alerts",
        href: "/driver-dashboard/notifications",
        key: "notifications",
        icon: <Bell />,
      },
      {
        title: "Support",
        short: "Support",
        href: "/driver-dashboard/support",
        key: "support",
        icon: <Cog />,
      },
    ],
  },
];

export const DRIVER_NAV_ITEMS = DRIVER_NAV_GROUPS.flatMap((g) => g.items);

/** The bottom bar's tabs; the rest go in its More sheet. */
export const DRIVER_TAB_KEYS: DriverNavKey[] = [
  "overview",
  "trips",
  "schedule",
  "earnings",
];

/** Overview only matches the dashboard itself; the rest match sub-pages. */
export function isDriverNavActive(pathname: string, href: string) {
  return href === "/driver-dashboard"
    ? pathname === "/driver-dashboard"
    : pathname === href || pathname.startsWith(href + "/");
}

/** The count badge for a page, if any. */
export function driverNavBadge(
  key: DriverNavKey,
  counts: {
    unreadNotificationsCount?: number;
    tripsNeedAttentionCount?: number;
    documentsAlertCount?: number;
  },
) {
  if (key === "notifications") return counts.unreadNotificationsCount ?? 0;
  if (key === "trips") return counts.tripsNeedAttentionCount ?? 0;
  if (key === "profile") return counts.documentsAlertCount ?? 0;
  return 0;
}
