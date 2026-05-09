"use client";

import { motion } from "framer-motion";

const messages = [
  "Free delivery on orders over €30",
  "Fragrance-Free",
  "Vegan",
  "Cruelty-Free",
  "Dermatologist-Reviewed Formulas",
  "Carbon-Neutral Shipping",
];

export function AnnouncementBar() {
  const loop = [...messages, ...messages];
  return (
    <div className="relative overflow-hidden border-b border-primary/10 bg-primary text-primary-foreground">
      <motion.div
        className="flex whitespace-nowrap py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {loop.map((msg, i) => (
          <span
            key={`${msg}-${i}`}
            className="mx-8 text-[11px] uppercase tracking-[0.22em]"
          >
            {msg}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
