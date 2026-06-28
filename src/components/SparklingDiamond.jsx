import { motion } from "framer-motion";

/**
 * SparklingDiamond
 * size      — px size of the diamond (default 64)
 * glowSize  — spread of the outer glow (default 2x size)
 */
export default function SparklingDiamond({ size = 64, className = "" }) {
  const s = size;
  const half = s / 2;

  // Sparkle ray positions around the diamond (8 directions)
  const rays = [
    { angle: 0,    len: 0.55 },
    { angle: 45,   len: 0.35 },
    { angle: 90,   len: 0.55 },
    { angle: 135,  len: 0.35 },
    { angle: 180,  len: 0.55 },
    { angle: 225,  len: 0.35 },
    { angle: 270,  len: 0.55 },
    { angle: 315,  len: 0.35 },
  ];

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: s * 3,
        height: s * 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer ambient glow */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [1, 1.25, 1],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: s * 2.2,
          height: s * 2.2,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(201,169,110,0.22) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Sparkle rays */}
      {rays.map((ray, i) => {
        const rad = (ray.angle * Math.PI) / 180;
        const rayLen = s * ray.len;
        const x2 = Math.cos(rad) * rayLen;
        const y2 = Math.sin(rad) * rayLen;
        return (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "1px",
              height: rayLen,
              background:
                ray.len > 0.4
                  ? "linear-gradient(180deg, rgba(201,169,110,0.8), transparent)"
                  : "linear-gradient(180deg, rgba(201,169,110,0.5), transparent)",
              transformOrigin: "0 0",
              left: "50%",
              top: "50%",
              transform: `rotate(${ray.angle + 90}deg)`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2.4,
              delay: i * 0.28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Diamond SVG with facets */}
      <motion.div
        animate={{ rotate: [0, 0, 0] }}
        style={{ position: "relative", zIndex: 2 }}
      >
        <motion.svg
          width={s}
          height={s}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{
            filter: [
              "drop-shadow(0 0 4px rgba(201,169,110,0.5))",
              "drop-shadow(0 0 12px rgba(201,169,110,0.9))",
              "drop-shadow(0 0 4px rgba(201,169,110,0.5))",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Outer shape */}
          <polygon
            points="50,2 98,38 50,98 2,38"
            fill="none"
            stroke="rgba(201,169,110,0.9)"
            strokeWidth="1.2"
          />

          {/* Top facet left */}
          <line x1="50" y1="2"  x2="26" y2="38" stroke="rgba(201,169,110,0.45)" strokeWidth="0.8" />
          {/* Top facet right */}
          <line x1="50" y1="2"  x2="74" y2="38" stroke="rgba(201,169,110,0.45)" strokeWidth="0.8" />

          {/* Middle horizontal */}
          <line x1="2"  y1="38" x2="98" y2="38" stroke="rgba(201,169,110,0.55)" strokeWidth="0.9" />

          {/* Lower left facet */}
          <line x1="26" y1="38" x2="50" y2="98" stroke="rgba(201,169,110,0.35)" strokeWidth="0.8" />
          {/* Lower right facet */}
          <line x1="74" y1="38" x2="50" y2="98" stroke="rgba(201,169,110,0.35)" strokeWidth="0.8" />

          {/* Center cross-lines */}
          <line x1="50" y1="2"  x2="50" y2="38" stroke="rgba(245,240,232,0.25)" strokeWidth="0.6" />
          <line x1="26" y1="38" x2="74" y2="38" stroke="rgba(245,240,232,0.15)" strokeWidth="0.6" />

          {/* Inner shimmer highlight — animated */}
          <motion.polygon
            points="50,12 88,38 50,88 12,38"
            fill="url(#shimmer)"
            animate={{ opacity: [0.06, 0.18, 0.06] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <defs>
            <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#E8D5B0" stopOpacity="0" />
              <stop offset="45%"  stopColor="#E8D5B0" stopOpacity="1" />
              <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>
      </motion.div>

      {/* Center twinkle dot */}
      <motion.div
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1.4, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        style={{
          position: "absolute",
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#E8D5B0",
          boxShadow: "0 0 6px 2px rgba(232,213,176,0.8)",
          zIndex: 3,
        }}
      />
    </div>
  );
}
