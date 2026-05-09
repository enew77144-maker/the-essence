"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";

import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlistStore } from "@/store/wishlistStore";
import { queries } from "@/lib/queries";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);

  const all = useQueries({
    queries: [{ queryKey: ["products", { page_size: 200 }], queryFn: () => queries.products({ page_size: 200 }) }],
  });
  const productsQuery = all[0];
  const items: Product[] = (productsQuery.data?.results ?? []).filter((p) =>
    ids.includes(p.id),
  );

  return (
    <div>
      <h2 className="font-heading text-2xl">Wishlist</h2>
      <p className="mt-2 text-sm text-secondary">
        Things you'd like to revisit. Heart any product to add it here.
      </p>

      <div className="mt-6">
        {productsQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-border p-10 text-center">
            <p className="text-secondary">Your wishlist is empty.</p>
            <Button asChild className="mt-4">
              <Link href="/products">Discover products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
