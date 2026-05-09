"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/types";

export function ProductImages({
  images,
  alt,
}: {
  images: ProductImage[];
  alt: string;
}) {
  const [active, setActive] = React.useState(0);
  const main = images[active];

  if (!main) {
    return <div className="aspect-square w-full bg-border" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[80px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:gap-3">
        {images.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(idx)}
            aria-label={`Show image ${idx + 1}`}
            className={cn(
              "relative h-16 w-16 flex-none overflow-hidden border bg-surface p-1 transition",
              idx === active ? "border-primary" : "border-border hover:border-secondary",
            )}
          >
            <Image
              src={img.url}
              alt={img.alt_text || alt}
              fill
              sizes="64px"
              className="object-contain"
            />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-square overflow-hidden bg-surface p-4 md:order-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={main.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={main.url}
              alt={main.alt_text || alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
