// The home page hero: full-height photo in a 10px frame, the heading and
// subhead bottom left, the mini booking tool bottom right.

import Image from "next/image";
import { db } from "@/lib/db";
import HeroBooking, { type HeroService } from "../HeroBooking/HeroBooking";
import styles from "./Hero.module.css";

/** The services the booking tool offers, in its order. */
async function bookableServices(): Promise<HeroService[]> {
  try {
    return await db.serviceType.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    });
  } catch {
    // No services: the form shows just the date and passengers.
    return [];
  }
}

export default async function Hero() {
  const services = await bookableServices();

  return (
    <section id='hero' className={styles.hero}>
      <div className={styles.frame}>
        <Image
          src='/images/other/herov.jpg'
          alt='Black car waiting for a rider in Las Vegas'
          fill
          priority
          sizes='100vw'
          className={styles.img}
        />
        <div className={styles.overlay} aria-hidden='true' />
      </div>

      <div className={styles.content}>
        <div className={styles.copy}>
          <h1 className={styles.heading}>
            {/* The quiet way <br />
            through Las Vegas. */}
            Executive Black Car <br className={styles.br} />
            Service in Las Vegas
          </h1>
          <p className={styles.subhead}>
            Black car service in Las Vegas, from Harry Reid International to the
            Strip, Henderson, Summerlin and beyond. Your price shows before you
            book, and your chauffeur tracks your flight.
          </p>
        </div>
        <HeroBooking services={services} />
      </div>
    </section>
  );
}
