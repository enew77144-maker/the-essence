"use client";

import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { SectionHeading } from "@/components/common/SectionHeading";

export function BestSellers() {
  const { data, isLoading } = useQuery({
    queryKey: ["bestsellers"],
    queryFn: queries.bestsellers,
  });

  return (
    <section className="container-tight py-20">
      <SectionHeading
        eyebrow="Best Sellers"
        title="The most-loved formulas."
        href="/products?sort=bestselling"
        ctaLabel="Shop best sellers"
      />
      <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : data?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}
