// Home page: where we drive. The market's areas with rough drive times
// (src/markets/), then the road out to the day trips, ending at the
// mountain.

import LayoutWrapper from "@/components/shared/LayoutWrapper";
import PulseEyeBrow from "@/components/shared/PulseEyeBrow/PulseEyeBrow";
import ArrowButton from "@/components/shared/ArrowButton/ArrowButton";
import MountainIcon from "@/components/shared/icons/MountainIcon/MountainIcon";
import { getMarket } from "@/lib/market";
import styles from "./ServiceAreasSection.module.css";

export default async function ServiceAreasSection() {
  const market = await getMarket();
  const fromAirport = `From ${market.airports[0].code}`;
  const fromCenter = `From ${market.center}`;
  return (
    <section className={styles.section}>
      <LayoutWrapper>
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <PulseEyeBrow text='Where we drive' />
            <h2 className={styles.heading}>{market.copy.areas.heading}</h2>
          </div>
          <p className={styles.intro}>{market.copy.areas.intro}</p>
        </div>

        <ul className={styles.areas}>
          {market.areas.map((a) => (
            <li
              key={a.name}
              className={`${styles.area} ${a.tag ? styles.areaFeatured : ""}`}
            >
              {a.tag && <span className={styles.tag}>{a.tag}</span>}
              <h3 className={`${styles.name} h4`}>{a.name}</h3>
              <p className={styles.copy}>{a.copy}</p>
              <p className={`${styles.fig} ${styles.figLas}`}>
                <span className={styles.figLabel}>{fromAirport}</span>
                <span className={styles.figValue}>{a.fromAirport}</span>
              </p>
              <p className={`${styles.fig} ${styles.figStrip}`}>
                <span className={styles.figLabel}>{fromCenter}</span>
                <span className={styles.figValue}>{a.fromCenter}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className={styles.note}>Rough drive times, without traffic.</p>

        <div className={styles.road} aria-hidden='true'>
          <span className={styles.roadLabel}>Day trips</span>
          <span className={styles.roadLine} />
          <MountainIcon className={styles.roadIcon} />
        </div>

        <ul className={styles.trips}>
          {market.copy.roadTrips.map((t) => (
            <li key={t.name} className={styles.trip}>
              <h3 className={styles.tripName}>{t.name}</h3>
              <p className={styles.tripCopy}>{t.copy}</p>
            </li>
          ))}
        </ul>

        <ArrowButton
          href='/locations'
          text='See service areas'
          variant='midnight'
          className={styles.btn}
        />
      </LayoutWrapper>
    </section>
  );
}
