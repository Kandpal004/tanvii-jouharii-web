import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useContent } from "../hooks/useContent";
import Gallery from "../components/Gallery";
import GrandmotherQuote from "../components/GrandmotherQuote";
import Pillars from "../components/Pillars";
import styles from "./About.module.css";

/* ─── Reusable building blocks ─────────────────────────────────────────────── */

function SectionHeading({ label, title }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={styles.sectionHeading}>
      <motion.p
        className={styles.sectionEyebrow}
        initial={{ opacity: 0, y: 15 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {label}
      </motion.p>
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.15 }}
      >
        {title}
      </motion.h2>
      <motion.div
        className={styles.sectionTitleBar}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.35 }}
      />
    </div>
  );
}

function AnimatedParagraph({ text, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.p
      ref={ref}
      className={styles.paragraph}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.p>
  );
}

function RoyalEstateItem({ name, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.p
      ref={ref}
      className={styles.royalItem}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {name}
    </motion.p>
  );
}

function ValueItem({ text, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className={styles.valueItem}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }}
    >
      <span className={styles.valueDiamond}>◆</span>
      <span className={styles.valueText}>{text}</span>
    </motion.div>
  );
}

function GoldDivider() {
  return <div className={styles.goldDivider} />;
}

/* ─── About page hero banner ─────────────────────────────────────────────────  */
function AboutHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroTopLine} />

      <div className={styles.heroGrid}>
        {/* LEFT — text */}
        <div className={styles.heroLeft}>
          <motion.p
            className={styles.heroEyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Our Heritage
          </motion.p>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            The Story Behind
            <br />
            <span className={styles.heroTitleAccent}>Tanvi Jouhari</span>
          </motion.h1>

          <motion.div
            className={styles.heroDivider}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
          />

          <motion.p
            className={styles.heroSubtext}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            Descendant of trusted jewellers to the royal courts of Kashi, Vizianagaram, Sarguja, and the Royals of Nepal — carrying a legacy that began in 1909.
          </motion.p>
        </div>

        {/* RIGHT — founder photo */}
        <motion.div
          className={styles.portraitWrap}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.portraitFrame} />
          <div className={styles.portraitInner}>
            <img
              src="/images/tanvii-portrait.jpg"
              alt="Tanvi Jouhari"
              className={styles.portraitImg}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.querySelector(".photo-placeholder").style.display = "flex";
              }}
            />
            <div className="photo-placeholder" className={styles.portraitPlaceholder} style={{ display: "none" }}>
              <span className={styles.portraitPlaceholderIcon}>◆</span>
              <p className={styles.portraitPlaceholderText}>
                Tanvi Jouhari<br />Founder Portrait
              </p>
            </div>
            <div className={styles.portraitGradient} />
          </div>

          <motion.div
            className={styles.portraitCaption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <p className={styles.portraitName}>Tanvi Jouhari</p>
            <p className={styles.portraitTitle}>Founder & Creative Director</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────────  */
export default function About() {
  const { data: about, loading } = useContent("/content/about");
  const { data: pillarsData } = useContent("/content/pillars");
  const { data: galleryData } = useContent("/content/gallery");

  if (loading) {
    return (
      <div className={styles.loading}>
        <motion.div
          className={styles.loadingText}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tanvii Jouharii
        </motion.div>
      </div>
    );
  }

  const openingParagraphs = about?.opening?.paragraphs || [];
  const originParagraphs = about?.origin?.paragraphs || [];
  const royalEstates = about?.origin?.royalEstates || [];
  const enterpriseParagraphs = about?.enterprise?.paragraphs || [];
  const journeyParagraphs = about?.journey?.paragraphs || [];
  const journeyValues = about?.journey?.values || [];
  const journeyClosing = about?.journey?.closing || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <AboutHero />

      <section className={styles.textSection}>
        <SectionHeading label="The Beginning" title="Growing up, I didn't just inherit jewellery." />
        {openingParagraphs.map((p, i) => (
          <AnimatedParagraph key={i} text={p} delay={i * 0.1} />
        ))}
      </section>

      <GoldDivider />

      <section id="heritage" className={styles.textSection}>
        <SectionHeading label="The Origin" title="Where It All Began — 1909" />
        {originParagraphs.map((p, i) => (
          <AnimatedParagraph key={i} text={p} delay={i * 0.1} />
        ))}

        {royalEstates.length > 0 && (
          <div className={styles.royalList}>
            <p className={styles.royalListLabel}>Jeweller of Choice for</p>
            {royalEstates.map((estate, i) => (
              <RoyalEstateItem key={i} name={estate} index={i} />
            ))}
          </div>
        )}

        {about?.origin?.closingLine && (
          <AnimatedParagraph text={about.origin.closingLine} />
        )}
      </section>

      <GoldDivider />

      <Gallery data={galleryData} />

      <GrandmotherQuote data={about?.grandmotherQuote} />

      <section className={styles.textSection}>
        <SectionHeading label="The Enterprise" title="A Legacy of Enterprise" />
        {enterpriseParagraphs.map((p, i) => (
          <AnimatedParagraph key={i} text={p} delay={i * 0.1} />
        ))}
      </section>

      <GoldDivider />

      <section className={styles.darkSection}>
        <div className={styles.darkSectionInner}>
          <SectionHeading label="A New Chapter" title="Where My Journey Begins" />
          {journeyParagraphs.map((p, i) => (
            <AnimatedParagraph key={i} text={p} delay={i * 0.1} />
          ))}

          {journeyValues.length > 0 && (
            <div className={styles.valuesGrid}>
              {journeyValues.map((val, i) => (
                <ValueItem key={i} text={val} index={i} />
              ))}
            </div>
          )}

          {journeyClosing.map((p, i) => (
            <AnimatedParagraph key={i} text={p} delay={i * 0.1} />
          ))}

          {about?.journey?.finalLine && (
            <motion.p
              className={styles.finalLine}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              {about.journey.finalLine}
            </motion.p>
          )}
        </div>
      </section>

      <Pillars data={pillarsData} />
    </motion.div>
  );
}
