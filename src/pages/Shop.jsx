import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { getProducts, formatPrice } from "../lib/shopify";
import { useCart } from "../context/CartContext";
import styles from "./Shop.module.css";

const FILTERS = ["All", "Ring", "Earrings", "Pendant", "Chain", "Bracelet"];
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  function handleAdd(e) {
    e.preventDefault();
    addToCart({
      variantId: product.variantId,
      productId: product.id,
      title: product.title,
      handle: product.handle,
      image: product.image,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const discount = product.compareAtPrice
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100)
    : null;

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/products/${product.handle}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <img src={product.image} alt={product.title} className={styles.image} />
          <div className={styles.imgOverlay} />
          {product.tags[0] && <span className={styles.tag}>{product.tags[0]}</span>}
          {discount && <span className={styles.discount}>−{discount}%</span>}
          <button
            className={`${styles.quickAdd} ${added ? styles.addedState : ""}`}
            onClick={handleAdd}
          >
            {added ? "✓ Added" : "+ Add to Cart"}
          </button>
        </div>
      </Link>
      <div className={styles.info}>
        <p className={styles.type}>{product.productType}</p>
        <Link to={`/products/${product.handle}`} className={styles.titleLink}>
          <h3 className={styles.name}>{product.title}</h3>
        </Link>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 50 }).then(data => {
      setProducts(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = activeFilter === "All"
      ? [...products]
      : products.filter(p => p.productType === activeFilter);

    if (sortBy === "price_asc") result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sortBy === "price_desc") result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    setFiltered(result);
  }, [activeFilter, sortBy, products]);

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero banner */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.breadcrumb}>
            <Link to="/" className={styles.breadLink}>Home</Link>
            <span> / </span>
            <span>Shop</span>
          </p>
          <span className={styles.heroEyebrow}>The Collection</span>
          <h1 className={styles.heading}>All Jewellery</h1>
          <div className={styles.heroOrnament}>
            <span className={styles.ornLine} />
            <span className={styles.ornDiamond}>✦</span>
            <span className={styles.ornLine} />
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className={styles.sortRow}>
            <span className={styles.sortLabel}>Sort:</span>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className={styles.resultCount}>{filtered.length} pieces</span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingBar} />
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
