// About page: licensed, insured and safe. The same layout as the home
// page's "How it works": a photo beside a menu-style card.
//
// The state's licensing comes from the market (src/markets/). The
// operator's real details go in CREDENTIALS. Anything left empty is left
// out of the copy rather than shown as a blank, so nothing invented goes
// live. Phone comes from Admin → Company Settings.

import Image from "next/image";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import PulseEyeBrow from "@/components/shared/PulseEyeBrow/PulseEyeBrow";
import ArrowButton from "@/components/shared/ArrowButton/ArrowButton";
import { SITE } from "@/config/site";
import { getCompanySettings } from "../../../../actions/admin/companySettings";
import { getMarket } from "@/lib/market";
import styles from "./AboutLicensed.module.css";

// Fill in with the operator's real details.
const CREDENTIALS = {
  /** State license or permit number, e.g. "1234". Empty: left out. */
  licenseNumber: "",
  /** e.g. "$1.5 million". Empty: the line is kept without the figure. */
  insuranceLimit: "",
  /** e.g. "Progressive Commercial". Empty: the carrier is left out. */
  insuranceCarrier: "",
};

export default async function AboutLicensed() {
  const [s, market] = await Promise.all([getCompanySettings(), getMarket()]);
  const { license } = market.copy;
  const phone = s.dispatchPhone || SITE.phone.display;

  const rows = [
    {
      title: "State license",
      tag: license.tag,
      copy: CREDENTIALS.licenseNumber
        ? `${license.line} License ${CREDENTIALS.licenseNumber}.`
        : license.line,
    },
    {
      title: "Insurance",
      tag: "Every vehicle",
      copy: `Commercial auto liability${
        CREDENTIALS.insuranceLimit ? ` of ${CREDENTIALS.insuranceLimit}` : ""
      } on every vehicle${
        CREDENTIALS.insuranceCarrier
          ? `, from ${CREDENTIALS.insuranceCarrier}`
          : ""
      }. Certificates available for corporate accounts and event venues on request.`,
    },
    {
      title: "Chauffeurs",
      tag: "Checked",
      copy: license.chauffeurs,
    },
    {
      title: "Vehicles",
      tag: "Inspected",
      copy: "Inspected on a set schedule and checked before every ride.",
    },
  ];

  const after = [
    { label: "Wheelchair or mobility aid", value: `Call ${phone} first` },
    { label: "Little ones", value: "Child seats on request" },
  ];

  return (
    <section className={styles.section}>
      <LayoutWrapper>
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <PulseEyeBrow text='Peace of mind' />
            <h2 className={styles.heading}>
              Licensed by the state → Insured for every ride
            </h2>
          </div>
          <p className={styles.intro}>{license.intro}</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.photo}>
            <Image
              src='/img6.jpg'
              alt='Chauffeur standing beside a black car'
              fill
              sizes='(max-width: 1068px) 100vw, 55vw'
              className={styles.img}
            />
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={`${styles.cardTitle} h4`}>Our credentials</h3>
              <span className={styles.cardMeta}>Ask us for proof any time</span>
            </div>

            <ol className={styles.steps}>
              {rows.map((r) => (
                <li key={r.title} className={styles.step}>
                  <div className={styles.stepLine}>
                    <span className={styles.stepTitle}>{r.title}</span>
                    <span className={styles.leader} aria-hidden='true' />
                    <span className={styles.stepNum}>{r.tag}</span>
                  </div>
                  <p className={styles.stepCopy}>{r.copy}</p>
                </li>
              ))}
            </ol>

            <p className={styles.why}>
              <strong>Why it matters.</strong> An unlicensed car is cheaper
              until something goes wrong. If you&apos;re booking for a wedding
              party, a client or your own family, ask any company for{" "}
              {license.ask}. We&apos;ll show you ours.
            </p>

            <dl className={styles.after}>
              {after.map((a) => (
                <div key={a.label} className={styles.afterItem}>
                  <dt className={styles.afterLabel}>{a.label}</dt>
                  <dd className={styles.afterValue}>{a.value}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.link}>
              <ArrowButton
                href='/book'
                text='Book your ride'
                variant='midnight'
              />
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
