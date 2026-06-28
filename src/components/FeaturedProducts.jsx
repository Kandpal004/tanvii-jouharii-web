import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useCart } from "../context/CartContext";
import { getProducts, formatPrice } from "../lib/shopify";
import styles from "./FeaturedProducts.module.css";

// Which Shopify collection feeds this section
const SOURCE_COLLECTION = "earrings";
const FALLBACK_IMAGE = "/images/products/ring-1.png";

function ProductCard({ product, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { addToCart } = useCart();

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      variantId: product.variantId,
      productId: product.id,
      title: product.name,
      handle: product.handle,
      image: product.image,
      price: product.price,
    });
  }

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/products/${product.handle}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <img src={product.image || FALLBACK_IMAGE} alt={product.name} className={styles.image} />
          {product.badge && <span className={styles.tag}>{product.badge}</span>}
          {product.discount && (
            <span className={styles.discount}>{product.discount}</span>
          )}
          <button className={styles.quickAdd} onClick={handleAdd}>
            + Add to Cart
          </button>
        </div>
      </Link>
      <div className={styles.info}>
        <p className={styles.type}>{product.type}</p>
        <Link to={`/products/${product.handle}`} className={styles.titleLink}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <div className={styles.priceRow}>
          <span className={styles.price}>{product.priceLabel}</span>
          {product.comparePriceLabel && (
            <span className={styles.comparePrice}>{product.comparePriceLabel}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    getProducts({ collectionHandle: SOURCE_COLLECTION, limit: 8 })
      .then((items) => {
        if (!active) return;
        const mapped = items.map((p) => {
          const hasCompare = p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price);
          return {
            id: p.id,
            handle: p.handle,
            variantId: p.variantId,
            name: p.title,
            type: p.productType || "Earrings",
            price: p.price,
            priceLabel: formatPrice(p.price),
            comparePriceLabel: hasCompare ? formatPrice(p.compareAtPrice) : null,
            discount: hasCompare
              ? "−" + Math.round((1 - Number(p.price) / Number(p.compareAtPrice)) * 100) + "%"
              : null,
            badge: p.tags?.[0] || null,
            image: p.image,
          };
        });
        setProducts(mapped);
      })
      .catch((err) => console.error("Failed to load featured products:", err));
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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.eyebrow}>Bestsellers</p>
          <h2 className={styles.title}>Our Most-Loved Pieces</h2>
          <p className={styles.subtitle}>
            Handpicked customer favourites — certified, BIS-hallmarked &amp; ready to ship.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <motion.div
          className={styles.viewAll}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/shop" className={styles.viewAllBtn}>
            <span className={styles.viewAllFill} />
            <span style={{ position: "relative", zIndex: 1 }}>View All Jewellery</span>
            <span style={{ position: "relative", zIndex: 1 }}>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
