import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import SparklingDiamond from "./SparklingDiamond";
import styles from "./Hero.module.css";

function SplitText({ text, delay = 0 }) {
  const words = text.split(" ");
  return (
    <span style={{ display: "inline" }}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.25em" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.1, delay: delay + wi * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero({ data }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const quote = data?.quote || "Growing up, I didn't just inherit jewellery. I inherited history.";
  const author = data?.author || "Tanvii Jouharii";
  const cta = data?.cta || "Discover the Legacy";

  const cornerStyles = [
    { top: "10%", left: "5%", borderTop: "1px solid rgba(201,169,110,0.3)", borderLeft: "1px solid rgba(201,169,110,0.3)" },
    { top: "10%", right: "5%", borderTop: "1px solid rgba(201,169,110,0.3)", borderRight: "1px solid rgba(201,169,110,0.3)" },
    { bottom: "10%", left: "5%", borderBottom: "1px solid rgba(201,169,110,0.3)", borderLeft: "1px solid rgba(201,169,110,0.3)" },
    { bottom: "10%", right: "5%", borderBottom: "1px solid rgba(201,169,110,0.3)", borderRight: "1px solid rgba(201,169,110,0.3)" },
  ];

  return (
    <section ref={ref} className={styles.section}>
      {/* Background with parallax */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y,
          scale,
          background: `
            radial-gradient(ellipse at 50% 30%, rgba(201, 169, 110, 0.06) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 40%, rgba(201,169,110,0.05) 0%, transparent 60%),
            var(--warm-black)
          `,
        }}
      />

      <div className={styles.grain} />

      <motion.div
        className={styles.horizontalLine}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />

      {cornerStyles.map((pos, i) => (
        <motion.div
          key={i}
          className={styles.corner}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2 + i * 0.1 }}
          style={pos}
        />
      ))}

      {/* Main content */}
      <motion.div className={styles.content} style={{ opacity }}>
        <motion.div
          className={styles.diamondTop}
          initial={{ opacity: 0, scale: 0, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <SparklingDiamond size={90} />
        </motion.div>

        <motion.div
          className={styles.estLine}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className={styles.estInner}>
            <div className={`${styles.estBar} ${styles.estBarLeft}`} />
            <span className={styles.estText}>Est. 1909</span>
            <div className={`${styles.estBar} ${styles.estBarRight}`} />
          </div>
        </motion.div>

        <h1 className={styles.quote}>
          <SplitText text={quote} delay={0.5} />
        </h1>

        <motion.div
          className={styles.diamondMid}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <SparklingDiamond size={42} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.9 }}
        >
          <Link to="/about" className={styles.ctaLink}>
            <span className={styles.ctaFill} />
            <span className={styles.ctaText}>{cta}</span>
            <span className={styles.ctaArrow}>â†’</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <motion.div
          className={styles.scrollLine}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
