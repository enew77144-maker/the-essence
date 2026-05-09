"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = React.useState(false);
  const add = useCartStore((s) => s.add);
  const toggle = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.ids.includes(product.id));

  const onAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await add(product.id, 1);
    } finally {
      setAdding(false);
    }
  };

  const onToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

  const onSale =
    product.compare_price && Number(product.compare_price) > Number(product.price);

  const primary = product.primary_image;

  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group flex flex-col"
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface p-3"
      >
        {primary?.url ? (
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full w-full"
          >
            <Image
              src={primary.url}
              alt={primary.alt_text || product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
          </motion.div>
        ) : (
          <div className="h-full w-full bg-border" />
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.is_bestseller && <Badge>Bestseller</Badge>}
          {product.is_new && <Badge variant="new">New</Badge>}
          {onSale && <Badge variant="sale">Sale</Badge>}
        </div>

        <button
          type="button"
          onClick={onToggleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          className={cn(
            "absolute right-3 top-3 rounded-full bg-surface/85 p-2 text-secondary backdrop-blur transition hover:text-error",
            inWishlist && "text-error",
          )}
        >
          <Heart
            className={cn("h-4 w-4", inWishlist && "fill-current")}
          />
        </button>

        <motion.div
          variants={{
            rest: { y: "100%", opacity: 0 },
            hover: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-0 hidden p-3 md:block"
        >
          <Button
            type="button"
            size="sm"
            className="w-full"
            onClick={onAdd}
            loading={adding}
          >
            Quick add
          </Button>
        </motion.div>
      </Link>

      <div className="mt-3 flex flex-col gap-1">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium hover:underline"
        >
          {product.name}
        </Link>
        {product.tagline && (
          <p className="text-xs text-secondary line-clamp-1">{product.tagline}</p>
        )}
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-medium">{formatPrice(Number(product.price))}</span>
          {onSale && product.compare_price && (
            <span className="text-xs text-muted line-through">
              {formatPrice(Number(product.compare_price))}
            </span>
          )}
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="mt-3 md:hidden"
        onClick={onAdd}
        loading={adding}
      >
        Add to bag
      </Button>
    </motion.div>
  );
}
