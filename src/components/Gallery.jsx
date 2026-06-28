import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Gallery.module.css";

const defaultItems = [
  {
    id: 1,
    src: "/images/gallery/radhakrishnan.jpg",
    name: "Dr. Sarvepalli Radhakrishnan",
    caption:
      "A moment preserved in our family archive — Dr. Sarvepalli Radhakrishnan, philosopher, statesman, and President of India, photographed with our family. His visits to our home were a reflection of the respect our family commanded in Varanasi's most distinguished circles.",
  },
  {
    id: 2,
    src: "/images/gallery/IMG_8172.jpg",
    name: "Morarji Desai",
    caption:
      "Shri Morarji Desai, Prime Minister of India, with our family. These were not formal occasions — they were the natural gatherings of people who shared values of integrity, discipline, and service.",
  },
  {
    id: 3,
    src: "/images/gallery/nargis-dutt.jpg",
    name: "Nargis Dutt",
    caption:
      "The legendary Nargis Dutt — actress, humanitarian, and one of India's most beloved cultural icons — with my grandmother, who remembers her warmth to this day. My grandmother, now in her nineties, is a living bridge between this extraordinary past and our present.",
  },
  {
    id: 4,
    src: "/images/gallery/asrani-govinda.jpeg",
    name: "Asrani & Govinda",
    caption:
      "Asrani and Govinda at a community event hosted by our family in Madras — a glimpse into the cultural richness that surrounded our home across generations.",
  },
  {
    id: 5,
    src: "/images/gallery/kapil-dev.jpg",
    name: "Kapil Dev",
    caption:
      "Cricket legend Kapil Dev, felicitated by our family at a community gathering. Our family has always believed in celebrating excellence — in every form.",
  },
  {
    id: 6,
    src: "/images/gallery/kashi-naresh.jpg",
    name: "Kashi Naresh — Vibhuti Narayan Singh",
    caption:
      "Perhaps the most intimate photograph in our archive. His Highness Vibhuti Narayan Singh, the Kashi Naresh — King of Kashi — gifting me personally as the youngest in the room. This moment, more than any other, reminds me of who I come from, and why I do what I do.",
  },
  {
    id: 7,
    src: "/images/gallery/IMG_8180.jpg",
    name: "The Ancestral Palace",
    caption:
      "Our ancestral estate in Varanasi — where history was not read about, but lived.",
  },
];

function GalleryCard({ item, index, total }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isWide = index === 0 || index === total - 1;

  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${isWide ? styles.cardWide : ""}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`${styles.imageWrap} ${
          isWide ? styles.imageWrapWide : styles.imageWrapNormal
        }`}
      >
        <img src={item.src} alt={item.name} className={styles.image} />
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.caption}>
        <p className={styles.name}>{item.name}</p>
        <div className={styles.goldBar} />
        <p className={styles.text}>{item.caption}</p>
      </div>
    </motion.div>
  );
}

export default function Gallery({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const galleryData = data || {};
  const items =
    (Array.isArray(galleryData.items) && galleryData.items.length && galleryData.items) ||
    (Array.isArray(galleryData.images) && galleryData.images.length && galleryData.images) ||
    defaultItems;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div ref={ref} className={styles.heading}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            {galleryData.eyebrow || "Family Archive"}
          </motion.p>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            {galleryData.title || "A Home Where History Visited"}
          </motion.h2>
          <motion.p
            className={styles.intro}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            {galleryData.intro ||
              "Across the decades that followed, our family home in Varanasi became a place where India's most remarkable figures felt welcome."}
          </motion.p>
          <motion.p
            className={styles.subIntro}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.55 }}
          >
            {galleryData.subIntro ||
              "Our family archives hold photographs that speak quietly of a world few can claim connection to."}
          </motion.p>
        </div>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <GalleryCard key={item.id || i} item={item} index={i} total={items.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
