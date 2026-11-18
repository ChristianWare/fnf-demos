// What a demo address shows once its preview has ended (or if there was
// never one there): who made it and how to get in touch.

import MountainIcon from "@/components/shared/icons/MountainIcon/MountainIcon";
import styles from "./DemoEnded.module.css";

export default function DemoEnded({ business }: { business: string | null }) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <MountainIcon className={styles.icon} />
        <p className={styles.eyebrow}>Preview ended</p>
        <h1 className={styles.heading}>This preview isn&apos;t live anymore</h1>
        <p className={styles.copy}>
          {business
            ? `The preview made for ${business} has ended.`
            : "There's no preview at this address."}{" "}
          To see it again, or to talk about a site of your own, get in touch
          with Fonts &amp; Footers.
        </p>
        <a href='https://fontsandfooters.com' className={styles.link}>
          fontsandfooters.com
        </a>
      </div>
    </main>
  );
}
