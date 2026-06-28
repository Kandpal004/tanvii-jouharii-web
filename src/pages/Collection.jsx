import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProducts, getCollectionByHandle, formatPrice } from "../lib/shopify";
import { useCart } from "../context/CartContext";
import styles from "./Collection.module.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

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

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.handle}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <img src={product.image} alt={product.title} className={styles.image} />
          <div className={styles.imgOverlay} />
          {product.tags[0] && <span className={styles.tag}>{product.tags[0]}</span>}
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
        <p className={styles.price}>{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}

export default function Collection() {
  const { handle } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCollectionByHandle(handle),
      getProducts({ collectionHandle: handle }),
    ]).then(([col, prods]) => {
      setCollection(col);
      setProducts(prods);
      setLoading(false);
    });
  }, [handle]);

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingBar} />
      </div>
    );
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero banner */}
      <section className={styles.hero}>
        {collection?.image && (
          <>
            <div
              className={styles.heroBg}
              style={{ backgroundImage: `url(${collection.image})` }}
            />
            <div className={styles.heroOverlay} />
          </>
        )}
        <div className={styles.heroInner}>
          <p className={styles.breadcrumb}>
            <Link to="/" className={styles.breadLink}>Home</Link>
            <span> / </span>
            <Link to="/shop" className={styles.breadLink}>Shop</Link>
            <span> / </span>
            <span>{collection?.title || handle}</span>
          </p>
          <span className={styles.heroEyebrow}>The Collection</span>
          <h1 className={styles.heading}>{collection?.title || handle}</h1>
          <div className={styles.heroOrnament}>
            <span className={styles.ornLine} />
            <span className={styles.ornDiamond}>✦</span>
            <span className={styles.ornLine} />
          </div>
          {collection?.description && (
            <p className={styles.desc}>{collection.description}</p>
          )}
          <p className={styles.heroCount}>
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </section>

      <div className={styles.container}>
        {products.length === 0 ? (
          <div className={styles.empty}>
            <p>No pieces in this collection yet.</p>
            <Link to="/shop" className={styles.emptyLink}>Browse All Jewellery →</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
