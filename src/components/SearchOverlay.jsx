import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { searchProducts, formatPrice } from "../lib/shopify";
import styles from "./SearchOverlay.module.css";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 280);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }
    setLoading(true);
    searchProducts(debouncedQuery)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={styles.panel}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Search input */}
            <div className={styles.inputRow}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search jewellery…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className={styles.input}
                autoComplete="off"
              />
              {query && (
                <button className={styles.clearBtn} onClick={() => setQuery("")}>✕</button>
              )}
              <button className={styles.closeBtn} onClick={onClose}>Close</button>
            </div>

            {/* Results */}
            <div className={styles.results}>
              {loading && (
                <div className={styles.loading}>
                  <div className={styles.loadingBar} />
                </div>
              )}

              {!loading && query.length > 1 && results.length === 0 && (
                <p className={styles.noResults}>No pieces found for "{query}"</p>
              )}

              {results.length > 0 && (
                <motion.div
                  className={styles.resultGrid}
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                  {results.map(product => (
                    <motion.div
                      key={product.id}
                      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                    >
                      <Link
                        to={`/products/${product.handle}`}
                        className={styles.resultCard}
                        onClick={onClose}
                      >
                        <img src={product.image} alt={product.title} className={styles.resultImage} />
                        <div className={styles.resultInfo}>
                          <p className={styles.resultType}>{product.productType}</p>
                          <p className={styles.resultTitle}>{product.title}</p>
                          <p className={styles.resultPrice}>{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {!query && (
                <div className={styles.hint}>
                  <p className={styles.hintText}>Try searching for rings, earrings, necklaces…</p>
                  <div className={styles.hintTags}>
                    {["Bestseller", "Bridal", "Diamond", "Heritage", "New"].map(tag => (
                      <button key={tag} className={styles.hintTag} onClick={() => setQuery(tag)}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <div className={styles.backdrop} onClick={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
