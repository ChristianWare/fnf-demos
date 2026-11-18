import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { getBrand } from "@/lib/brand";
import { getMarket } from "@/lib/market";

// Served at /manifest.webmanifest — Next.js injects the <link rel="manifest"> tag.
// The name is the operator's (Admin → Company Settings).
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [{ name }, market] = await Promise.all([getBrand(), getMarket()]);
  return {
    name,
    short_name: name.length > 12 ? name.split(" ")[0] : name,
    description: `${name} – Black car service in ${market.city}`,
    start_url: "/",
    display: "standalone",
    background_color: SITE.themeColor,
    theme_color: SITE.themeColor,
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Admin Dashboard", url: "/admin", description: "Open admin dashboard" },
      { name: "Driver Dashboard", url: "/driver-dashboard", description: "Open driver dashboard" },
    ],
  };
}
