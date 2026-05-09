"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { ProductImages } from "@/components/products/ProductImages";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductTabs } from "@/components/products/ProductTabs";
import { ProductReviews } from "@/components/products/ProductReviews";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => queries.product(slug),
  });

  if (isError) {
    return (
      <div className="container-tight py-24 text-center">
        <h1 className="font-heading text-4xl">Product not found.</h1>
        <p className="mt-3 text-secondary">
          It may have been discontinued. Browse the rest of the range.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block link-underline text-sm uppercase tracking-[0.18em]"
        >
          Back to all products
        </Link>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="container-tight py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const ldjson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline ?? product.description?.slice(0, 160),
    sku: product.sku,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: "The Essence" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.price,
      availability:
        product.stock_qty > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.rating_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(product.rating_avg ?? 0),
            reviewCount: product.rating_count,
          }
        : undefined,
  };

  return (
    <div className="container-tight py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-xs uppercase tracking-[0.16em] text-secondary"
      >
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        {" / "}
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        {" / "}
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductImages images={product.images} alt={product.name} />
        <ProductInfo product={product} />
      </div>

      <div className="mt-16">
        <ProductTabs product={product} />
      </div>

      <div className="mt-16">
        <ProductReviews product={product} />
      </div>

      <RelatedProducts slug={product.slug} />
    </div>
  );
}
