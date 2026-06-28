import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Timeline.module.css";

const defaultTimeline = [
  { year: "1909", event: "Great-great-grandfather establishes the jewellery firm in Varanasi" },
  { year: "1946", event: "V.D. Kakad & Co. founded — expanding the family legacy into industry" },
  { year: "Today", event: "Tanvii Jouharii carries the legacy into fine jewellery, crafted with heritage and heart" },
];

function TimelineItem({ item, index, total }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = index % 2 === 0;

  const topLineStyle = {
    background: index === 0 ? "transparent" : "linear-gradient(180deg, transparent, rgba(201,169,110,0.3))",
  };
  const bottomLineStyle = {
    background: index === total - 1 ? "transparent" : "linear-gradient(180deg, rgba(201,169,110,0.3), transparent)",
  };

  return (
    <motion.div
      ref={ref}
      className={styles.item}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.leftSide} style={{ opacity: isLeft ? 1 : 0.3 }}>
        {isLeft && (
          <>
            <div className={styles.year}>{item.year}</div>
            <p className={styles.event}>{item.event}</p>
          </>
        )}
      </div>

      <div className={styles.spine}>
        <div className={styles.spineLineTop} style={topLineStyle} />
        <motion.div
          className={styles.dot}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
        />
        <div className={styles.spineLineBottom} style={bottomLineStyle} />
      </div>

      <div className={styles.rightSide} style={{ opacity: !isLeft ? 1 : 0.3 }}>
        {!isLeft && (
          <>
            <div className={styles.year}>{item.year}</div>
            <p className={styles.event}>{item.event}</p>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function Timeline({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const items = data && data.length ? data : defaultTimeline;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div ref={ref} className={styles.heading}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            Through Time
          </motion.p>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            A Century of Legacy
          </motion.h2>
        </div>

        <div>
          {items.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} total={items.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
