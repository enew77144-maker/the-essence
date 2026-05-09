"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

type FeaturedItem = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  image: string;
  highlights: string[];
  flip?: boolean;
};

const ITEMS: FeaturedItem[] = [
  {
    eyebrow: "Daily essential",
    title: "Niacinamide 10% + Zinc 1%",
    body: "A high-strength, blemish-balancing serum that visibly evens skin tone in two weeks. Lightweight, layerable, and unscented.",
    href: "/products/niacinamide-10-zinc-1",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1400&q=80",
    highlights: ["Vegan", "Fragrance-free", "Cruelty-free"],
  },
  {
    eyebrow: "Editor pick",
    title: "Hyaluronic Acid 2% + B5",
    body: "Multi-molecular hydration that reaches the surface and below. Plumps, smooths, and reinforces the moisture barrier — at any age.",
    href: "/products/hyaluronic-acid-2-b5",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1400&q=80",
    highlights: ["Hydrating", "Pregnancy-safe", "Layerable"],
    flip: true,
  },
];

export function FeaturedProduct() {
  return (
    <section className="container-tight space-y-20 py-20">
      {ITEMS.map((item) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${item.flip ? "lg:[direction:rtl]" : ""}`}
        >
          <div className="relative aspect-[4/5] overflow-hidden lg:[direction:ltr]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:[direction:ltr]">
            <p className="eyebrow">{item.eyebrow}</p>
            <h3 className="mt-3 font-heading text-3xl md:text-5xl">{item.title}</h3>
            <p className="mt-4 max-w-md text-secondary">{item.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-secondary">
              {item.highlights.map((h) => (
                <li key={h} className="border border-border px-3 py-1">
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild>
                <Link href={item.href}>Shop now</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
