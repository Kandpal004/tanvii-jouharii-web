import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { getCollections } from "../lib/shopify";
import styles from "./CollectionsGrid.module.css";

// Fallback copy + cover image per handle (used only when Shopify has none set yet)
const DEFAULTS = {
  rings:       { desc: "Solitaires, bands & cocktail rings in 9K–22K gold.",  image: "/images/products/ring-1.png" },
  earrings:    { desc: "Studs, drops & chandeliers for every occasion.",       image: "/images/products/ring-2.png" },
  necklaces:   { desc: "Pendants, chokers & statement chains.",                image: "/images/products/necklace-1.png" },
  bracelets:   { desc: "Bangles, kadas & tennis bracelets.",                   image: "/images/products/bracelet-1.png" },
  mangalsutra: { desc: "Sacred mangalsutras in timeless gold & diamond.",      image: "/images/products/necklace-1.png" },
  pendants:    { desc: "Delicate diamond & gold pendants for every day.",      image: "/images/products/necklace-1.png" },
  bridal:      { desc: "Curated sets for your most cherished moments.",        image: "/images/products/ring-1.png" },
  heritage:    { desc: "Heirlooms inspired by 1909 royal craftsmanship.",      image: "/images/products/bracelet-1.png" },
};

const GENERIC_IMAGE = "/images/products/ring-1.png";

function CategoryTile({ category, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={styles.tile}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={category.href} className={styles.tileLink}>
        <div className={styles.imageWrap}>
          <img alt={category.name} className={styles.image} src={category.image} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{category.name}</h3>
          <div className={styles.divider} />
          <p className={styles.desc}>{category.desc}</p>
          <span className={styles.cta}>Explore Collection &rarr;</span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CollectionsGrid() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    getCollections()
      .then((cols) => {
        if (!active) return;
        const mapped = cols.map((c) => {
          const def = DEFAULTS[c.handle] || {};
          return {
            name: c.title,
            href: `/collections/${c.handle}`,
            image: c.image || def.image || GENERIC_IMAGE,
            desc: c.description || def.desc || "Explore the collection.",
          };
        });
        setCategories(mapped);
      })
      .catch((err) => console.error("Failed to load collections:", err));
    return () => { active = false; };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          ref={headingRef}
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.headingLeft}>
            <p className={styles.eyebrow}>Shop by Category</p>
            <h2 className={styles.title}>Find Your Forever Piece</h2>
          </div>
          <Link className={styles.headingCta} to="/shop">
            View All &rarr;
          </Link>
        </motion.div>

        <div
          className={styles.grid}
          style={{ "--cols": Math.min(4, Math.max(1, categories.length)) }}
        >
          {categories.map((category, i) => (
            <CategoryTile key={category.href} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
