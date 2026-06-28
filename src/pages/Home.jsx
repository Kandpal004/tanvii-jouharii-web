import { useContent } from "../hooks/useContent";
import CategoryCircles from "../components/CategoryCircles";
import ShopHero from "../components/ShopHero";
import Hero from "../components/Hero";
import BrandStatement from "../components/BrandStatement";
import Pillars from "../components/Pillars";
import Timeline from "../components/Timeline";
import Gallery from "../components/Gallery";
import CollectionsGrid from "../components/CollectionsGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import ShopByCategory from "../components/ShopByCategory";
import SparklingDiamond from "../components/SparklingDiamond";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useInView } from "framer-motion";

function DiscoverSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section style={{ background: "var(--ivory-alt)", padding: "10px 1.5rem", textAlign: "center" }}>
      <div ref={ref} style={{ maxWidth: "640px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", justifyContent: "center", marginBottom: "1.2rem" }}
        >
          <SparklingDiamond size={48} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.1rem, 4.2vw, 3.2rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}
        >
          A Story That Began in 1909
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            fontWeight: 400,
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            marginBottom: "2rem",
          }}
        >
          From the royal courts of Kashi to the world of fine jewellery — discover the legacy, the values, and the vision behind Tanvii Jouharii.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link
            to="/about"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#ffffff",
              textDecoration: "none",
              padding: "1rem 2.2rem",
              background: "var(--ink)",
              borderRadius: "2px",
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            Read Our Story →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data, loading } = useContent("/content");

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1.5rem",
      }}>
        <p style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.5rem",
          fontWeight: 300,
          letterSpacing: "0.3em",
          color: "var(--gold)",
          textTransform: "uppercase",
        }}>
          Tanvii Jouharii
        </p>
        <div style={{
          width: "100px",
          height: "1px",
          background: "var(--border)",
          overflow: "hidden",
          position: "relative",
        }}>
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, background: "var(--gold)" }}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <CategoryCircles />
      <ShopHero />
      <CollectionsGrid />
      <FeaturedProducts />
      <ShopByCategory />
      <BrandStatement data={data?.brandStatement} />
      <Pillars data={data?.pillars} />
      <DiscoverSection />
      <Timeline data={data?.timeline} />
      <Gallery data={data?.about?.gallery} />
    </motion.div>
  );
}
