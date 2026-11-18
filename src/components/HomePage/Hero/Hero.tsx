// The home page hero: full-height photo in a 10px frame, the heading and
// subhead bottom left, the mini booking tool bottom right.

import Image from "next/image";
import { db } from "@/lib/db";
import { getMarket, getPhotos } from "@/lib/market";
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
  const [services, market, photos] = await Promise.all([
    bookableServices(),
    getMarket(),
    getPhotos(),
  ]);
  const [line1, line2] = market.copy.hero.heading;

  return (
    <section id='hero' className={styles.hero}>
      <div className={styles.frame}>
        <Image
          src={photos.hero.src}
          alt={photos.hero.alt}
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
            {line1} <br className={styles.br} />
            {line2}
          </h1>
          <p className={styles.subhead}>{market.copy.hero.subhead}</p>
        </div>
        <HeroBooking services={services} />
      </div>
    </section>
  );
}
