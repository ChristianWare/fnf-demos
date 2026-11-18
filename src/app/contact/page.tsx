import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { getMarket } from "@/lib/market";
import SiteNav from "@/components/shared/SiteNav/SiteNav";
import ContactHero from "@/components/ContactPage/ContactHero/ContactHero";
import ContactDesks from "@/components/ContactPage/ContactDesks/ContactDesks";
import ContactWhere from "@/components/ContactPage/ContactWhere/ContactWhere";
import ContactWrite from "@/components/ContactPage/ContactWrite/ContactWrite";

export async function generateMetadata(): Promise<Metadata> {
  const [brand, market] = await Promise.all([getBrand(), getMarket()]);
  return {
    title: "Contact",
    description: `Contact ${brand.name}: dispatch answers any time, plus reservations, corporate accounts and weddings. Phone, email and how pickups work at ${market.airports[0].shortName}.`,
    alternates: { canonical: "/contact" },
  };
}

export default function Page() {
  return (
    <>
      {/* The white bar from the start: no hero to sit over on this page. */}
      <SiteNav variant='solid' />
      <main>
        <ContactHero />
        <ContactDesks />
        <ContactWhere />
        <ContactWrite />
      </main>
    </>
  );
}
