"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { SectionHeading } from "@/components/common/SectionHeading";

export function ConcernsFinder() {
  const { data, isLoading } = useQuery({
    queryKey: ["concerns"],
    queryFn: queries.concerns,
  });

  return (
    <section className="bg-surface">
      <div className="container-tight py-20">
        <SectionHeading
          eyebrow="Routine Builder"
          title="Shop by concern."
          description="Targeted formulas for the things that matter most. Every product is single-active, evidence-based, and disclosed in full."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))
            : data?.slice(0, 6).map((concern, idx) => (
                <motion.div
                  key={concern.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <Link
                    href={`/products?concern=${encodeURIComponent(concern.name)}`}
                    className="group relative block aspect-square overflow-hidden bg-border"
                  >
                    {concern.image_url && (
                      <Image
                        src={concern.image_url}
                        alt={concern.name}
                        fill
                        sizes="(min-width: 768px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-primary/35 transition-colors group-hover:bg-primary/50" />
                    <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                      <span className="font-heading text-xl text-primary-foreground md:text-3xl">
                        {concern.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
