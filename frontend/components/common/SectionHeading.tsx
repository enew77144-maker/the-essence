"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  align = "left",
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:gap-4",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className={cn("flex flex-col gap-2", align === "center" && "items-center")}
      >
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="max-w-2xl font-heading text-3xl md:text-5xl">{title}</h2>
        {description && (
          <p className="max-w-xl text-secondary">{description}</p>
        )}
      </motion.div>
      {href && ctaLabel && (
        <Link
          href={href}
          className="link-underline inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-secondary hover:text-primary"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
