import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Pillars.module.css";

const defaultPillars = [
  { id: 1, title: "Heritage", description: "A lineage of trust dating to 1909, built in the courts of India's most distinguished royal estates." },
  { id: 2, title: "Craft", description: "Fine jewellery designed with intention — where every detail carries meaning." },
  { id: 3, title: "Intimacy", description: "Each piece is personal. Created for milestones, memories, and the people who matter most." },
  { id: 4, title: "Legacy", description: "Jewellery that will be passed down, just as the values behind it have been." },
];

function PillarCard({ pillar, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.topAccent} />
      <div className={styles.number}>{String(index + 1).padStart(2, "0")}</div>
      <h3 className={styles.cardTitle}>{pillar.title}</h3>
      <p className={styles.description}>{pillar.description}</p>
    </motion.div>
  );
}

export default function Pillars({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const pillars = data || defaultPillars;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div ref={ref} className={styles.heading}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            The Pillars
          </motion.p>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            What We Stand For
          </motion.h2>
          <motion.div
            className={styles.divider}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          />
        </div>

        <div className={styles.grid}>
          {pillars.map((p, i) => (
            <PillarCard key={p.id || i} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
