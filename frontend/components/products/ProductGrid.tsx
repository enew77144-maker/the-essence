"use client";

import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-border py-20 text-center">
        <p className="font-heading text-2xl">No products found.</p>
        <p className="mt-2 text-sm text-secondary">
          Try adjusting your filters or browse all products.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
