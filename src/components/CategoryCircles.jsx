import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCollections } from "../lib/shopify";
import styles from "./CategoryCircles.module.css";

// Fallback circle image per handle (used until a collection image is set in Shopify)
const FALLBACK = {
  rings: "/images/products/ring-1.png",
  earrings: "/images/products/ring-2.png",
  necklaces: "/images/products/necklace-1.png",
  bracelets: "/images/products/bracelet-1.png",
  mangalsutra: "/images/products/necklace-1.png",
  pendants: "/images/products/necklace-1.png",
  bridal: "/images/products/ring-1.png",
  heritage: "/images/products/bracelet-1.png",
};
const GENERIC = "/images/products/ring-1.png";
const SHOP_ALL_IMG = "/images/products/necklace-1.png";

function Circle({ to, image, label }) {
  return (
    <Link to={to} className={styles.item}>
      <span className={styles.ring}>
        <img src={image} alt={label} className={styles.img} loading="lazy" />
      </span>
      <span className={styles.label}>{label}</span>
    </Link>
  );
}

export default function CategoryCircles() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getCollections().then(setCollections).catch(() => {});
  }, []);

  return (
    <nav className={styles.strip} aria-label="Shop by category">
      <div className={styles.row}>
        <Circle to="/shop" image={SHOP_ALL_IMG} label="Shop All" />
        {collections.map((c) => (
          <Circle
            key={c.handle}
            to={`/collections/${c.handle}`}
            image={c.image || FALLBACK[c.handle] || GENERIC}
            label={c.title}
          />
        ))}
      </div>
    </nav>
  );
}
