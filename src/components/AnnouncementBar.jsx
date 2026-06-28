import styles from "./AnnouncementBar.module.css";

const MESSAGES = [
  "BIS Hallmarked · Certified Natural Diamonds",
  "Free Insured Shipping Across India",
  "Lifetime Exchange & Buyback",
  "Handcrafted in India · Since 1909",
];

export default function AnnouncementBar() {
  return (
    <div className={styles.bar} aria-hidden="true">
      <div className={styles.track}>
        {[...MESSAGES, ...MESSAGES, ...MESSAGES].map((m, i) => (
          <span key={i} className={styles.item}>
            {m}
            <span className={styles.sep}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
