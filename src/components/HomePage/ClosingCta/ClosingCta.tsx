// Home page: the last call to book, over a photo. The phone number comes
// from Admin → Company Settings (falls back to src/config/site.ts).

import Image from "next/image";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import ArrowButton from "@/components/shared/ArrowButton/ArrowButton";
import { SITE } from "@/config/site";
import { getCompanySettings } from "../../../../actions/admin/companySettings";
import { getMarket } from "@/lib/market";
import styles from "./ClosingCta.module.css";

export default async function ClosingCta() {
  const [s, market] = await Promise.all([getCompanySettings(), getMarket()]);
  const phone = s.dispatchPhone || SITE.phone.display;
  const phoneTel = s.dispatchPhoneRaw
    ? `+1${s.dispatchPhoneRaw}`
    : SITE.phone.tel;

  return (
    <section className={styles.section}>
      <LayoutWrapper>
        <div className={styles.box}>
          <Image
            src={market.images.closing.src}
            alt={market.images.closing.alt}
            fill
            sizes='100vw'
            className={styles.img}
          />
          <div className={styles.shade} aria-hidden='true' />

          <div className={styles.content}>
            <h2 className={styles.heading}>{market.copy.closingHeading}</h2>
            <p className={styles.copy}>
              Book online in two minutes, or call us any time.
            </p>
            <div className={styles.actions}>
              <ArrowButton href='/book' text='Book your ride' />
              <a href={`tel:${phoneTel}`} className={styles.call}>
                or call {phone}
              </a>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
