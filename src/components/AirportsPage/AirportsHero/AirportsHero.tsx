// /airports: the hero. Heading on the left; eyebrow, intro and buttons on
// the right; a wide photo underneath with the airport pickup facts along
// the bottom. The city and its airports come from the market.

import Image from "next/image";
import Link from "next/link";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import PulseEyeBrow from "@/components/shared/PulseEyeBrow/PulseEyeBrow";
import ArrowButton from "@/components/shared/ArrowButton/ArrowButton";
import {
  AIRPORT_FREE_WAIT_MINUTES,
  MEET_AND_GREET_FREE,
} from "@/lib/booking/rules";
import { getMarket } from "@/lib/market";
import { airportBookHref } from "@/markets";
import styles from "./AirportsHero.module.css";

export default async function AirportsHero() {
  const market = await getMarket();
  const facts = [
    {
      value: String(market.airports.length),
      label: "Airports we drive every day",
    },
    {
      value: `${AIRPORT_FREE_WAIT_MINUTES} min`,
      label: "Free wait after landing",
    },
    { value: "Yes", label: "Flight tracking on every pickup" },
    {
      value: MEET_AND_GREET_FREE ? "Free" : "Yes",
      label: "Meet & greet with a name sign",
    },
  ];

  return (
    <section className={styles.section}>
      <LayoutWrapper>
        <div className={styles.top}>
          {/* Two lines, set by the break; they never wrap. */}
          <h1 className={styles.heading}>
            {market.city}
            <br />
            airports
          </h1>

          <div className={styles.side}>
            <PulseEyeBrow text='Airport car service' />
            <p className={styles.copy}>
              The {market.airports.length} airports we drive every day, from{" "}
              {market.airports[0].shortName} to the private jet terminals, with
              flight tracking and a chauffeur waiting when you land.
            </p>
            <div className={styles.actions}>
              <ArrowButton
                href={airportBookHref(market.airports[0])}
                text='Book an airport pickup'
                variant='midnight'
              />
              <Link href='#airports' className={styles.textLink}>
                See the airports
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.media}>
          <Image
            src={market.images.airport.src}
            alt={market.images.airport.alt}
            fill
            priority
            sizes='(max-width: 1344px) 100vw, 1344px'
            className={styles.img}
          />
          <div className={styles.shade} aria-hidden='true' />
          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt className={styles.factLabel}>{f.label}</dt>
                <dd className={styles.factValue}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </LayoutWrapper>
    </section>
  );
}
