// A photo for a vehicle category in the booking tool when the admin hasn't
// uploaded one: the matching website fleet photo (a cut-out on a plain
// background, src/lib/fleetDetails.ts). Matched by the category's fleet
// page link first, then by its name, then by how many people it seats.

const BY_SLUG: Record<string, string> = {
  "executive-sedan": "/vehicles/mercedesSedanii.png",
  "luxury-suv": "/vehicles/escalade.png",
  "executive-sprinter": "/vehicles/sprint.png",
  "stretch-limousine": "/vehicles/limoii.png",
  "motor-coach-bus": "/vehicles/bus.png",
};

const BY_NAME: [RegExp, string][] = [
  [/limo/i, "stretch-limousine"],
  [/sprinter|van/i, "executive-sprinter"],
  [/coach|bus/i, "motor-coach-bus"],
  [/suv|escalade|suburban|yukon|tahoe|navigator/i, "luxury-suv"],
  [/sedan|car\b/i, "executive-sedan"],
];

export function vehicleImage(v: {
  imageUrl: string | null;
  fleetSlug: string | null;
  name: string;
  capacity: number;
}): string {
  if (v.imageUrl) return v.imageUrl;
  if (v.fleetSlug && BY_SLUG[v.fleetSlug]) return BY_SLUG[v.fleetSlug];
  const byName = BY_NAME.find(([re]) => re.test(v.name));
  if (byName) return BY_SLUG[byName[1]];
  if (v.capacity <= 3) return BY_SLUG["executive-sedan"];
  if (v.capacity <= 7) return BY_SLUG["luxury-suv"];
  if (v.capacity <= 14) return BY_SLUG["executive-sprinter"];
  return BY_SLUG["motor-coach-bus"];
}
