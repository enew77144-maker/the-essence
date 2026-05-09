"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { SectionHeading } from "@/components/common/SectionHeading";

export function CategoryGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: queries.categories,
  });

  return (
    <section className="container-tight py-20">
      <SectionHeading
        eyebrow="Categories"
        title="Find your next staple."
      />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full" />
            ))
          : data?.slice(0, 8).map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-border"
                >
                  {cat.image_url && (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-primary/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                    <h3 className="font-heading text-2xl">{cat.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-80">
                      Shop now
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}
