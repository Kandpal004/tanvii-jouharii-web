import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { getCollections } from "../lib/shopify";
import SearchOverlay from "./SearchOverlay";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { count, setIsOpen: openCart } = useCart();
  const isHome = location.pathname === "/";
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getCollections().then(setCollections).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [location]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Our Story", to: "/about" },
    { label: "Heritage", to: "/about#heritage" },
  ];

  // Full menu: Home → Shop All → each collection → Our Story → Heritage
  const menuItems = [
    { label: "Home", to: "/" },
    { label: "Shop All", to: "/shop" },
    ...collections.map((c) => ({ label: c.title, to: `/collections/${c.handle}` })),
    { label: "Our Story", to: "/about" },
    { label: "Heritage", to: "/about#heritage" },
  ];

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : styles.light}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" className={styles.logo}>
          <span className={styles.logoName}>Tanvii Jouharii</span>
          <span className={styles.logoTagline}>Fine Jewellery · Est. 1909</span>
        </Link>

        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.link} ${location.pathname === link.to.split("#")[0] ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button className={styles.iconBtn} onClick={() => openCart(true)} aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && <span className={styles.cartBadge}>{count}</span>}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={styles.hamburger}
            aria-label="Menu"
          >
            {[28, 20, 28].map((w, i) => (
              <span key={i} className={styles.hamburgerLine} style={{ width: `${w}px` }} />
            ))}
          </button>
        </div>
      </motion.nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className={styles.mobileMenuClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>

            {menuItems.map((link, i) => (
              <motion.div
                key={link.label}
                className={styles.mobileLinkWrap}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 + 0.1 }}
              >
                <Link to={link.to} className={styles.mobileLink}>{link.label}</Link>
              </motion.div>
            ))}

            <motion.p
              className={styles.mobileMenuEst}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Tanvii Jouharii · Est. 1909
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
