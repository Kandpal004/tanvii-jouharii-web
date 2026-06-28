import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./BrandStatement.module.css";

export default function BrandStatement({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const text = data?.text || "Tanvii Jouharii is a fine jewellery brand rooted in a century of heritage.";
  const subtext =
    data?.subtext ||
    "Founded by Tanvi Jouhari — descendant of the trusted jewellers to the royal estates of Kashi, Vizianagaram, Sarguja, and the Royals of Nepal — the brand carries forward a legacy of purity, craftsmanship, and quiet distinction that began in 1909.";
  const tagline = data?.tagline || "Each piece is personal. Each creation, a continuation of history.";

  return (
    <section ref={ref} className={styles.section}>
      <motion.div
        className={styles.divider}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.p
        className={styles.mainText}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.p>

      <motion.p
        className={styles.subText}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
      >
        {subtext}
      </motion.p>

      <motion.div
        className={styles.taglineRow}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <div className={styles.taglineBar} />
        <p className={styles.tagline}>{tagline}</p>
        <div className={styles.taglineBar} />
      </motion.div>
    </section>
  );
}
