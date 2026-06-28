import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Products.module.css";

const products = [
  { id: 1, name: "Eternal Bloom Ring", category: "9K Diamond Ring", price: 27500, image: "/images/products/ring-1.png", tag: "Bestseller" },
  { id: 2, name: "Lumière Solitaire", category: "9K Diamond Ring", price: 29800, image: "/images/products/ring-2.png", tag: "New" },
  { id: 3, name: "Stardust Drop Earrings", category: "9K Diamond Necklace", price: 28500, image: "/images/products/necklace-1.png", tag: "Heritage" },
  { id: 4, name: "Timeless Kara Bracelet", category: "9K Diamond Necklace", price: 30000, image: "/images/products/bracelet-1.png", tag: "Exclusive" },
  { id: 5, name: "Stardust Drop Earrings", category: "9K Diamond Earrings", price: 25500, image: "/images/products/necklace-1.png", tag: "New" },
  { id: 6, name: "Timeless Kara Bracelet", category: "9K Diamond Bracelet", price: 27000, image: "/images/products/bracelet-1.png", tag: "Heritage" },
];

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

function ProductCard({ product, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 5) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.name} className={styles.image} />
        <div className={styles.overlay} />
        {product.tag && (
          <div className={styles.tag}>
            <span className={styles.tagText}>{product.tag}</span>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.goldBar} />
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <button className={styles.buyBtn}>Buy Now</button>
      </div>
    </motion.div>
  );
}

function ProductCardSimple({ product }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.name} className={styles.image} />
        <div className={styles.overlay} />
        {product.tag && (
          <div className={styles.tag}>
            <span className={styles.tagText}>{product.tag}</span>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.goldBar} />
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <button className={styles.buyBtn}>Buy Now</button>
      </div>
    </div>
  );
}

function MobileSlider() {
  const [current, setCurrent] = useState(0);
  const total = products.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className={styles.sliderWrap}>
      <div
        className={styles.sliderTrack}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {products.map((p) => (
          <div key={p.id} className={styles.sliderSlide}>
            <ProductCardSimple product={p} />
          </div>
        ))}
      </div>

      <div className={styles.sliderNav}>
        <button className={styles.sliderBtn} onClick={prev}>←</button>
        <div className={styles.sliderDots}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
        <button className={styles.sliderBtn} onClick={next}>→</button>
      </div>
    </div>
  );
}

export default function Products() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div ref={ref} className={styles.heading}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            The Collection
          </motion.p>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
          >
            9K Diamond Jewellery
          </motion.h2>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Each piece is personal. Each creation, a continuation of history.
          </motion.p>
          <motion.div
            className={styles.divider}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          />
        </div>

        {/* Desktop grid */}
        <div className={styles.grid}>
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        {/* Mobile slider */}
        <MobileSlider />

        <motion.p
          className={styles.note}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          All pieces crafted in 9K gold with certified diamonds · Prices inclusive of making charges
        </motion.p>
      </div>
    </section>
  );
}
