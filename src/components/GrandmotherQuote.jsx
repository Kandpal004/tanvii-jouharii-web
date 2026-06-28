import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./GrandmotherQuote.module.css";

export default function GrandmotherQuote({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const quote = data?.quote || "In our home, greatness was always welcomed with humility. We never sought important people — they found their way to us, because my husband's word was his bond, and everyone knew it.";
  const attribution = data?.attribution || "My grandmother, who at over 90 years old, still remembers every face in these photographs.";

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.glow} />

      <div className={styles.inner}>
        <motion.span
          className={styles.openQuote}
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          "
        </motion.span>

        <motion.blockquote
          className={styles.quote}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {quote}
        </motion.blockquote>

        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        />

        <motion.p
          className={styles.attribution}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.1 }}
        >
          — {attribution}
        </motion.p>
      </div>
    </section>
  );
}
