"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ProductFilters, type Filters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSort } from "@/components/products/ProductSort";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { queries } from "@/lib/queries";

type ListParams = Record<string, string | number | undefined>;

export default function ProductsPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: Filters = React.useMemo(
    () => ({
      category: sp.get("category") ?? undefined,
      concern: sp.get("concern") ?? undefined,
      tag: sp.get("tag") ?? undefined,
      min: sp.get("min") ?? undefined,
      max: sp.get("max") ?? undefined,
    }),
    [sp],
  );
  const sort = sp.get("sort") ?? "featured";
  const page = Number(sp.get("page") ?? "1");

  const setQuery = (next: Partial<Filters & { sort: string; page: number }>) => {
    const merged: Record<string, string | number | undefined> = {
      ...Object.fromEntries(sp.entries()),
      ...filters,
      ...next,
    };
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const params: ListParams = {
    category: filters.category,
    concern: filters.concern,
    tag: filters.tag,
    min_price: filters.min ? Number(filters.min) : undefined,
    max_price: filters.max ? Number(filters.max) : undefined,
    sort,
    page,
    page_size: 12,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", params],
    queryFn: () => queries.products(params),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: queries.categories,
  });
  const { data: concerns = [] } = useQuery({
    queryKey: ["concerns"],
    queryFn: queries.concerns,
  });

  const pageSize = 12;
  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="container-tight py-12">
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Shop</p>
        <h1 className="mt-2 font-heading text-4xl md:text-6xl">All products</h1>
        <p className="mt-3 max-w-xl text-secondary">
          Single-active formulas. Disclosed in full. Use the filters to find a
          serum, cream, or cleanser for your routine.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <ProductFilters
            categories={categories}
            concerns={concerns}
            filters={filters}
            onChange={(f) =>
              setQuery({
                category: f.category,
                concern: f.concern,
                tag: f.tag,
                min: f.min,
                max: f.max,
                page: 1,
              })
            }
          />
        </div>

        <div>
          <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-secondary">
              {isLoading
                ? "Loading…"
                : `Showing ${data?.results.length ?? 0} of ${total} products`}
            </p>
            <ProductSort value={sort} onChange={(v) => setQuery({ sort: v, page: 1 })} />
          </div>

          {isLoading ? (
            <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <ProductGrid products={data?.results ?? []} />
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setQuery({ page: page - 1 })}
              >
                Previous
              </Button>
              <span className="text-sm text-secondary">
                Page {page} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setQuery({ page: page + 1 })}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
