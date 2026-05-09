"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={ref}
      className="relative grid min-h-[88vh] grid-cols-1 overflow-hidden border-b border-border lg:grid-cols-2"
    >
      <div className="relative z-10 flex flex-col justify-center gap-6 px-6 py-16 md:px-14 lg:py-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow"
        >
          The Essence — Edition 01
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-heading text-5xl leading-[1.05] md:text-7xl"
        >
          Formulated.
          <br /> Not fabricated.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-md text-base text-secondary"
        >
          Single-active formulas, transparent ingredient lists, and pricing that
          respects you. Skincare, finally without the theatre.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg">
            <Link href="/products">Shop the range</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">Our science</Link>
          </Button>
        </motion.div>
      </div>

      <motion.div style={{ y }} className="relative h-full min-h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80"
          alt="Editorial product shot of The Essence serums"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}
