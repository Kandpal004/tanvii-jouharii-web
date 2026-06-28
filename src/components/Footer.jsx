import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCollections } from "../lib/shopify";
import styles from "./Footer.module.css";

const EXPLORE = [
  { label: "Home", to: "/" },
  { label: "Shop All", to: "/shop" },
  { label: "Our Story", to: "/about" },
  { label: "Heritage", to: "/about#heritage" },
];

const BRAND_VALUES = ["Heritage", "Craft", "Intimacy", "Legacy"];

export default function Footer() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getCollections().then(setCollections).catch(() => {});
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandLineTop} />
          <p className={styles.brandName}>Tanvii Jouharii</p>
          <p className={styles.brandTagline}>Fine Jewellery · Est. 1909</p>
        </div>

        {/* Link columns */}
        <div className={styles.columns}>
          <div className={styles.col}>
            <h4 className={styles.colHeading}>Explore</h4>
            {EXPLORE.map((i) => (
              <div key={i.label} className={styles.linkItem}>
                <Link to={i.to} className={styles.navLink}>{i.label}</Link>
              </div>
            ))}
          </div>

          <div className={styles.col}>
            <h4 className={styles.colHeading}>Shop</h4>
            {collections.map((c) => (
              <div key={c.handle} className={styles.linkItem}>
                <Link to={`/collections/${c.handle}`} className={styles.navLink}>
                  {c.title}
                </Link>
              </div>
            ))}
          </div>

          <div className={styles.col}>
            <h4 className={styles.colHeading}>The Brand</h4>
            {BRAND_VALUES.map((v) => (
              <div key={v} className={styles.linkItem}>
                <span className={styles.pillarsText}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2025 Tanvii Jouharii. All rights reserved.</p>
          <p className={styles.closing}>A story of purity. Honesty. Craftsmanship.</p>
        </div>
      </div>
    </footer>
  );
}
