import type { Metadata } from "next";
import { AIRPORT_FREE_WAIT_MINUTES } from "@/lib/booking/rules";
import { getMarket } from "@/lib/market";
import { airportFaqs, andList } from "@/markets";
import SiteNav from "@/components/shared/SiteNav/SiteNav";
import AirportsHero from "@/components/AirportsPage/AirportsHero/AirportsHero";
import AirportsServed from "@/components/AirportsPage/AirportsServed/AirportsServed";
import AirportsAviation from "@/components/AirportsPage/AirportsAviation/AirportsAviation";
import FleetFaq from "@/components/FleetPage/FleetFaq/FleetFaq";
import ClosingCta from "@/components/HomePage/ClosingCta/ClosingCta";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getMarket();
  const codes = market.airports.map((a) => a.code);
  return {
    title: {
      absolute: `${market.city} Airport Car Service: ${codes.join(", ")}`,
    },
    description: `Black car service to and from ${andList(market.airports.map((a) => `${a.shortName} (${a.code})`))}, with flight tracking, meet & greet and ${AIRPORT_FREE_WAIT_MINUTES} minutes of free wait after landing.`,
    alternates: { canonical: "/airports" },
  };
}

export default async function Page() {
  const market = await getMarket();
  const faqs = airportFaqs(market, {
    freeWaitMinutes: AIRPORT_FREE_WAIT_MINUTES,
  });

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Airports we drive in ${market.city}`,
      numberOfItems: market.airports.length,
      itemListElement: market.airports.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Airport",
          name: a.name,
          iataCode: a.code,
          address: {
            "@type": "PostalAddress",
            addressRegion: market.stateCode,
          },
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* The white bar from the start: no hero to sit over on this page. */}
      <SiteNav variant='solid' />
      <main>
        <AirportsHero />
        <AirportsServed />
        <AirportsAviation />
        <FleetFaq
          heading={`Questions about ${market.city} airports`}
          items={faqs}
        />
        <ClosingCta />
      </main>
    </>
  );
}
