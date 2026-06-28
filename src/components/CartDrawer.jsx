import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice, createCheckout, getProducts } from "../lib/shopify";
import styles from "./CartDrawer.module.css";

function UpsellCard({ product, onAdd }) {
  return (
    <div className={styles.upsellCard}>
      <img src={product.image} alt={product.title} className={styles.upsellImage} />
      <div className={styles.upsellInfo}>
        <p className={styles.upsellTitle}>{product.title}</p>
        <p className={styles.upsellPrice}>{formatPrice(product.price)}</p>
      </div>
      <button className={styles.upsellAdd} onClick={() => onAdd(product)} aria-label="Add to cart">+</button>
    </div>
  );
}

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, total, count, isOpen, setIsOpen, addToCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Fetch real products for upsell (so added items have valid Shopify variants)
  useEffect(() => {
    getProducts({ limit: 8 }).then(setAllProducts).catch(() => {});
  }, []);

  // Pick 2 upsell products not in cart
  const cartVariantIds = new Set(items.map(i => i.variantId));
  const upsellProducts = allProducts.filter(p => !cartVariantIds.has(p.variantId)).slice(0, 2);

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      await createCheckout(items);
    } catch (e) {
      console.error("Checkout failed:", e);
      alert("Checkout could not start. Please try again.\n(" + e.message + ")");
    } finally {
      setCheckingOut(false);
    }
  }

  function handleAddUpsell(product) {
    addToCart({
      variantId: product.variantId,
      productId: product.id,
      title: product.title,
      handle: product.handle,
      image: product.image,
      price: product.price,
    });
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.drawer}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div>
                <h2 className={styles.title}>Your Cart</h2>
                {count > 0 && <span className={styles.countBadge}>{count} item{count !== 1 ? "s" : ""}</span>}
              </div>
              <button className={styles.close} onClick={() => setIsOpen(false)} aria-label="Close cart">✕</button>
            </div>

            <div className={styles.body}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>◇</div>
                  <p className={styles.emptyText}>Your cart is empty</p>
                  <Link to="/shop" className={styles.emptyLink} onClick={() => setIsOpen(false)}>
                    Explore Collection →
                  </Link>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className={styles.items}>
                    {items.map(item => (
                      <motion.div
                        key={item.variantId}
                        className={styles.item}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <Link to={`/products/${item.handle}`} onClick={() => setIsOpen(false)}>
                          <img src={item.image} alt={item.title} className={styles.itemImage} />
                        </Link>
                        <div className={styles.itemDetails}>
                          <p className={styles.itemTitle}>{item.title}</p>
                          <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                          <div className={styles.qty}>
                            <button className={styles.qtyBtn} onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>−</button>
                            <span className={styles.qtyNum}>{item.quantity}</span>
                            <button className={styles.qtyBtn} onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                        <button className={styles.remove} onClick={() => removeFromCart(item.variantId)} aria-label="Remove">✕</button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Upsell */}
                  {upsellProducts.length > 0 && (
                    <div className={styles.upsell}>
                      <p className={styles.upsellHeading}>You may also love</p>
                      {upsellProducts.map(p => (
                        <UpsellCard key={p.id} product={p} onAdd={handleAddUpsell} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotal}>
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className={styles.taxNote}>Taxes & shipping calculated at checkout</p>
                <button
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? "Redirecting…" : "Proceed to Checkout"}
                </button>
                <button className={styles.continueBtn} onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
