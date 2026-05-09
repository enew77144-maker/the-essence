"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";

import { ProductGrid } from "@/components/products/ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: category } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => queries.category(slug),
  });
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", { category: slug, page_size: 24 }],
    queryFn: () => queries.products({ category: slug, page_size: 24 }),
  });

  return (
    <div className="container-tight py-12">
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Category</p>
        <h1 className="mt-2 font-heading text-4xl md:text-6xl">
          {category?.name ?? "—"}
        </h1>
        {category?.description && (
          <p className="mt-3 max-w-2xl text-secondary">{category.description}</p>
        )}
      </header>

      <div className="mt-10">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={products?.results ?? []} />
        )}
      </div>
    </div>
  );
}
