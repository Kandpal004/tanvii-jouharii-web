import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import styles from "./ShopByCategory.module.css";

const CATEGORIES = [
  {
    label: "Rings",
    handle: "rings",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <circle cx="20" cy="24" r="11" />
        <path d="M20 7l-4.2 6h8.4z" fill="currentColor" stroke="none" />
        <path d="M15.8 13l4.2-6 4.2 6" />
      </svg>
    ),
  },
  {
    label: "Earrings",
    handle: "earrings",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 8c-3.4 0-5 2.2-5 4.6 0 2.1 1.6 3.4 3 4.4" />
        <path d="M18 17l-3 8.5a2.4 2.4 0 104.6 1.4L22 18" />
        <circle cx="20.6" cy="30.4" r="2.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Pendants",
    handle: "pendants",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 9c2.5 9 7 13 12 13s9.5-4 12-13" />
        <path d="M20 22l-2.4 4 2.4 4 2.4-4z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Chains",
    handle: "chains",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="14" cy="15" rx="3.4" ry="5.4" transform="rotate(-32 14 15)" />
        <ellipse cx="21" cy="21" rx="3.4" ry="5.4" transform="rotate(-32 21 21)" />
        <ellipse cx="28" cy="27" rx="3.4" ry="5.4" transform="rotate(-32 28 27)" />
      </svg>
    ),
  },
  {
    label: "Bracelets",
    handle: "bracelets",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4">
        <ellipse cx="20" cy="20" rx="13" ry="9" />
        <ellipse cx="20" cy="20" rx="13" ry="9" transform="rotate(0 20 20)" opacity="0" />
        <circle cx="20" cy="11" r="2.1" fill="currentColor" stroke="none" />
        <path d="M14 13.4l2 2M26 13.4l-2 2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Bridal",
    handle: "bridal",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M11 16h18l-9 13z" />
        <path d="M11 16l3-5h12l3 5" />
        <path d="M16 16l4 13 4-13M11 16h18" />
      </svg>
    ),
  },
  {
    label: "Heritage",
    handle: "heritage",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M9 28h22l-2-13-5 5-4-8-4 8-5-5z" />
        <path d="M9 28h22" />
        <circle cx="20" cy="9" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function ShopByCategory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className={styles.section}>
      <div ref={ref} className={styles.container}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          Shop by Type
        </motion.p>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Find Your Piece
        </motion.h2>

        <div className={styles.grid}>
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.handle}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 + 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/collections/${cat.handle}`} className={styles.tile}>
                <div className={styles.iconWrap}>
                  <span className={styles.icon}>{cat.icon}</span>
                  <div className={styles.iconRing} />
                </div>
                <p className={styles.label}>{cat.label}</p>
                <div className={styles.bar} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
