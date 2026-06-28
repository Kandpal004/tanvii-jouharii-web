import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProductByHandle, getProducts, formatPrice } from "../lib/shopify";
import { useCart } from "../context/CartContext";
import styles from "./ProductDetail.module.css";

const METAL_OPTIONS = [
  { label: "9K Gold", available: true },
  { label: "14K Gold", available: false },
  { label: "18K Gold", available: false },
  { label: "22K Gold", available: false },
];
const STAR = "★";
const STAR_EMPTY = "☆";

function StarRating({ rating = 4.8 }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= Math.round(rating) ? styles.starFilled : styles.starEmpty}>
          {n <= Math.round(rating) ? STAR : STAR_EMPTY}
        </span>
      ))}
      <span className={styles.ratingNum}>{rating}</span>
    </div>
  );
}

function RelatedCard({ product }) {
  const discount = product.compareAtPrice
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100)
    : null;
  return (
    <div className={styles.relCard}>
      <Link to={`/products/${product.handle}`} className={styles.relImageLink}>
        <div className={styles.relImageWrap}>
          <img src={product.image} alt={product.title} className={styles.relImage} />
          {product.tags && product.tags[0] && (
            <span className={styles.relTag}>{product.tags[0]}</span>
          )}
          {discount && <span className={styles.relDiscount}>−{discount}%</span>}
          <span className={styles.relView}>View Details</span>
        </div>
      </Link>
      <div className={styles.relInfo}>
        <p className={styles.relType}>{product.productType}</p>
        <Link to={`/products/${product.handle}`} className={styles.relTitleLink}>
          <h3 className={styles.relTitle}>{product.title}</h3>
        </Link>
        <div className={styles.relPriceRow}>
          <span className={styles.relPrice}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className={styles.relCompare}>{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetal, setSelectedMetal] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);
  const [addedToBag, setAddedToBag] = useState(false);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getProductByHandle(handle).then(async (prod) => {
      setProduct(prod);
      setAddedToBag(false);
      setActiveThumb(0);
      setQty(1);
      if (prod) {
        const all = await getProducts({ limit: 20 });
        const related = all.filter(p => p.id !== prod.id && p.productType === prod.productType).slice(0, 4);
        setRelated(related.length >= 2 ? related : all.filter(p => p.id !== prod.id).slice(0, 4));
      }
      setLoading(false);
    });
  }, [handle]);

  function handleAddToBag() {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        variantId: product.variantId,
        productId: product.id,
        title: product.title,
        handle: product.handle,
        image: product.image,
        price: product.price,
      });
    }
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2200);
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>This piece is not available.</p>
        <Link to="/shop" className={styles.notFoundLink}>Browse All Jewellery →</Link>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100)
    : null;

  // Real product images from Shopify (fall back to the single cover image)
  const thumbs = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main product layout */}
      <div className={styles.container}>
        <div className={styles.main}>

          {/* ── LEFT: Image gallery ── */}
          <div className={styles.galleryCol}>
            {/* Thumbnails (only when there are multiple images) */}
            {thumbs.length > 1 && (
              <div className={styles.thumbCol}>
                {thumbs.map((src, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${activeThumb === i ? styles.thumbActive : ""}`}
                    onClick={() => setActiveThumb(i)}
                  >
                    <img src={src} alt={`${product.title} view ${i + 1}`} className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className={styles.mainImage}>
              {product.tags[0] && (
                <span className={styles.imageBadge}>{product.tags[0]}</span>
              )}
              <img
                src={thumbs[activeThumb]}
                alt={product.title}
                className={styles.productImage}
              />
            </div>
          </div>

          {/* ── RIGHT: Product info ── */}
          <div className={styles.infoCol}>

            {/* Rating row */}
            <div className={styles.ratingRow}>
              <StarRating rating={4.8} />
              <span className={styles.reviewCount}>124 Reviews</span>
              <span className={styles.ratingDot}>·</span>
              <span className={styles.soldCount}>500+ sold</span>
            </div>

            {/* Title */}
            <h1 className={styles.title}>{product.title}</h1>

            {/* Type */}
            <p className={styles.type}>{product.productType} · Certified Fine Jewellery</p>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Price */}
            <div className={styles.priceBlock}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className={styles.mrp}>{formatPrice(product.compareAtPrice)}</span>
                  <span className={styles.discountChip}>{discount}% OFF</span>
                </>
              )}
            </div>
            <p className={styles.taxNote}>Inclusive of all taxes</p>

            {/* Metal selector */}
            <div className={styles.selectorBlock}>
              <p className={styles.selectorLabel}>
                Metal: <strong>{METAL_OPTIONS[selectedMetal].label}</strong>
              </p>
              <div className={styles.metalOptions}>
                {METAL_OPTIONS.map((m, i) => (
                  <button
                    key={m.label}
                    className={`${styles.metalBtn} ${selectedMetal === i ? styles.metalBtnActive : ""} ${!m.available ? styles.metalBtnDisabled : ""}`}
                    onClick={() => m.available && setSelectedMetal(i)}
                    disabled={!m.available}
                    title={m.available ? "" : "Coming soon"}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty selector */}
            <div className={styles.qtyBlock}>
              <p className={styles.selectorLabel}>Quantity</p>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className={styles.qtyNum}>{qty}</span>
                <button className={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <div className={styles.ctaBlock}>
              <button
                className={`${styles.addBagBtn} ${addedToBag ? styles.addedState : ""}`}
                onClick={handleAddToBag}
                disabled={!product.availableForSale}
              >
                {!product.availableForSale ? "Sold Out" : addedToBag ? "✓ Added to Bag" : "Add to Bag"}
              </button>
              <button className={styles.buyNowBtn} onClick={handleAddToBag}>
                Buy Now
              </button>
            </div>

            {/* Offers strip */}
            <div className={styles.offersStrip}>
              <p className={styles.offersTitle}>◆ Available Offers</p>
              {[
                "Free shipping on orders above ₹5,000",
                "Easy 15-day exchange policy",
                "Certified hallmarked gold — BIS verified",
              ].map(offer => (
                <p key={offer} className={styles.offerItem}>
                  <span className={styles.offerCheck}>✓</span> {offer}
                </p>
              ))}
            </div>

            {/* Delivery info */}
            <div className={styles.deliveryBlock}>
              <div className={styles.deliveryItem}>
                <span className={styles.deliveryIcon}>📦</span>
                <div>
                  <p className={styles.deliveryTitle}>Free Delivery</p>
                  <p className={styles.deliverySub}>Estimated in 5–7 business days</p>
                </div>
              </div>
              <div className={styles.deliveryItem}>
                <span className={styles.deliveryIcon}>↩</span>
                <div>
                  <p className={styles.deliveryTitle}>Easy Returns</p>
                  <p className={styles.deliverySub}>15-day hassle-free exchange</p>
                </div>
              </div>
            </div>

            {/* Description accordion */}
            {product.description && (
              <details className={styles.accordion}>
                <summary className={styles.accordionTitle}>Product Description</summary>
                <p className={styles.accordionBody}>{product.description}</p>
              </details>
            )}

            <details className={styles.accordion}>
              <summary className={styles.accordionTitle}>Material & Certification</summary>
              <p className={styles.accordionBody}>
                Crafted in BIS hallmarked gold. Diamonds are certified by internationally accredited laboratories.
                All pieces come with a Certificate of Authenticity.
              </p>
            </details>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className={styles.related}>
            <div className={styles.relatedHeader}>
              <span className={styles.relatedEyebrow}>Curated For You</span>
              <h2 className={styles.relatedTitle}>You May Also Like</h2>
              <div className={styles.relatedOrnament}>
                <span className={styles.ornLine} />
                <span className={styles.ornDiamond}>✦</span>
                <span className={styles.ornLine} />
              </div>
            </div>
            <div className={styles.relatedGrid}>
              {related.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
