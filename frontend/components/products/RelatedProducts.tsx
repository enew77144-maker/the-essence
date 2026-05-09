"use client";

import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/common/SectionHeading";
import { queries } from "@/lib/queries";

export function RelatedProducts({ slug }: { slug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["related", slug],
    queryFn: () => queries.related(slug),
  });
  return (
    <section className="mt-20">
      <SectionHeading
        eyebrow="Complete your routine"
        title="You might also like."
      />
      <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          : data?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}
