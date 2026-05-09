"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

import { SectionHeading } from "@/components/common/SectionHeading";

const reviews = [
  {
    quote:
      "I've tried a dozen serums for my hyperpigmentation. The Essence actually delivered visible change in three weeks. The price-to-result ratio is unmatched.",
    name: "Amelia R.",
    location: "Paris, FR",
    rating: 5,
  },
  {
    quote:
      "Honest formulas. No fragrance. No theatre. Reading the label feels like reading a peer-reviewed paper, and that's the point.",
    name: "Joaquín D.",
    location: "Madrid, ES",
    rating: 5,
  },
  {
    quote:
      "My dermatologist recommended I simplify my routine — these are the only three products I now use morning and night. Skin barrier is restored.",
    name: "Hayley M.",
    location: "London, UK",
    rating: 5,
  },
  {
    quote:
      "I'm not someone who reviews. But I had to. The Hyaluronic + B5 quietly transformed my skin's bounce in under a month.",
    name: "Marta S.",
    location: "Berlin, DE",
    rating: 5,
  },
];

export function ReviewsBanner() {
  return (
    <section className="container-tight py-20">
      <SectionHeading
        eyebrow="Customer Letters"
        title="Why people stay."
      />
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="border border-border bg-surface p-8"
          >
            <div className="flex items-center gap-1 text-accent-dark">
              {Array.from({ length: r.rating }).map((_, idx) => (
                <Star key={idx} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 font-heading text-lg leading-snug md:text-xl">
              "{r.quote}"
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-secondary">
              <span className="font-medium text-primary">{r.name}</span>
              <span>·</span>
              <span>{r.location}</span>
              <span>·</span>
              <span className="text-success">Verified</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
