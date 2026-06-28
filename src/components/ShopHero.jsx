import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import styles from "./ShopHero.module.css";

const SLIDES = [
  {
    eyebrow: "The Bridal Edit",
    title: ["Heirlooms for", "the Big Day"],
    sub: "Hand-set bridal sets in 22K gold & certified diamonds — crafted to be passed down for generations.",
    cta: { label: "Shop Bridal", to: "/collections/bridal" },
    image: "/images/products/necklace-1.jpg",
  },
  {
    eyebrow: "Bestsellers",
    title: ["Everyday", "Brilliance"],
    sub: "Certified solitaire rings designed for daily wear — effortless, timeless, forever you.",
    cta: { label: "Shop Rings", to: "/collections/rings" },
    image: "/images/products/ring-1.jpg",
  },
  {
    eyebrow: "Just Arrived",
    title: ["Drops That", "Dazzle"],
    sub: "Featherlight statement earrings that move with you, from studs to chandeliers.",
    cta: { label: "Shop Earrings", to: "/collections/earrings" },
    image: "/images/products/pendant-1.jpg",
  },
  {
    eyebrow: "Heritage · Est. 1909",
    title: ["The Kashi", "Legacy"],
    sub: "Five generations of master craftsmanship, from the royal courts of Kashi to your hands.",
    cta: { label: "Our Story", to: "/about" },
    image: "/images/products/bracelet-1.jpg",
  },
  {
    eyebrow: "The Gifting Edit",
    title: ["Made to Be", "Treasured"],
    sub: "Curated pendants & keepsakes for the moments that matter most.",
    cta: { label: "Shop Gifts", to: "/shop" },
    image: "/images/products/necklace-1.jpg",
  },
];

const MARQUEE_ITEMS = [
  "Handcrafted in India",
  "Certified Natural Diamonds",
  "BIS Hallmarked Gold",
  "Five Generations · Since 1909",
  "Lifetime Exchange",
  "Free Insured Shipping",
];

const INTERVAL = 6000;

export default function ShopHero() {
  const [active, setActive] = useState(0);
  const slide = SLIDES[active];

  const next = useCallback(() => {
    setActive((i) => (i + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next, active]);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.imageCol}>
          <img
            key={slide.image}
            src={slide.image}
            alt=""
            aria-hidden="true"
            className={styles.heroImg}
          />
          <div className={styles.imageVignette} />
        </div>

        <div className={styles.textCol}>
          <div className={styles.textInner}>
            <div key={active}>
              <span className={styles.eyebrow}>{slide.eyebrow}</span>
              <h1 className={styles.title}>
                {slide.title.map((line, i) => (
                  <span key={i} className={styles.titleLine}>{line}</span>
                ))}
              </h1>
              <div className={styles.ornament}>
                <span className={styles.ornLine} />
                <span className={styles.ornDiamond}>✦</span>
                <span className={styles.ornLine} />
              </div>
              <p className={styles.sub}>{slide.sub}</p>
              <div className={styles.ctaRow}>
                <Link className={styles.ctaPrimary} to={slide.cta.to}>
                  {slide.cta.label}
                  <span className={styles.ctaArrow}>→</span>
                </Link>
                <Link className={styles.ctaSecondary} to="/shop">
                  View All Jewellery
                </Link>
              </div>
            </div>

            <div className={styles.controls}>
              <div className={styles.dots}>
                {SLIDES.map((s, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                    aria-label={`Go to ${s.eyebrow}`}
                    onClick={() => setActive(i)}
                  >
                    <span className={styles.dotFill} />
                  </button>
                ))}
              </div>
              <div className={styles.counter}>
                <span className={styles.counterNum}>
                  {String(active + 1).padStart(2, "0")}
                </span>
                <span className={styles.counterSep}>/</span>
                <span className={styles.counterTotal}>
                  {String(SLIDES.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={styles.item}>
              {item}
              <span className={styles.sep}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
