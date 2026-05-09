"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn, formatPrice } from "@/lib/utils";
import type { ProductDetail } from "@/lib/types";

export function ProductInfo({ product }: { product: ProductDetail }) {
  const [quantity, setQuantity] = React.useState(1);
  const [adding, setAdding] = React.useState(false);
  const add = useCartStore((s) => s.add);
  const toggle = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.ids.includes(product.id));

  const onSale =
    product.compare_price && Number(product.compare_price) > Number(product.price);

  const onAdd = async () => {
    setAdding(true);
    try {
      await add(product.id, quantity);
    } finally {
      setAdding(false);
    }
  };

  const stars = Math.round(Number(product.rating_avg ?? 0));

  return (
    <div className="flex flex-col gap-5">
      {product.category_name && (
        <p className="eyebrow">{product.category_name}</p>
      )}
      <h1 className="font-heading text-3xl md:text-5xl">{product.name}</h1>
      {product.tagline && (
        <p className="text-secondary">{product.tagline}</p>
      )}

      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < stars ? "fill-accent-dark text-accent-dark" : "text-border",
              )}
            />
          ))}
        </div>
        <span className="text-secondary">
          {Number(product.rating_avg ?? 0).toFixed(1)} · {product.rating_count} reviews
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-heading text-3xl">
          {formatPrice(Number(product.price))}
        </span>
        {onSale && product.compare_price && (
          <span className="text-sm text-muted line-through">
            {formatPrice(Number(product.compare_price))}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {product.tags?.map((t) => (
          <Badge key={t} variant="outline" className="capitalize">
            {t.replace("-", " ")}
          </Badge>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <div className="flex items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="p-3 hover:bg-border/40"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="p-3 hover:bg-border/40"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <Button
          type="button"
          size="lg"
          onClick={onAdd}
          loading={adding}
          className="flex-1"
          disabled={product.stock_qty === 0}
        >
          {product.stock_qty === 0 ? "Out of stock" : "Add to bag"}
        </Button>
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "border border-border p-3 transition-colors hover:text-error",
            inWishlist && "text-error",
          )}
        >
          <motion.span
            animate={inWishlist ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="block"
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          </motion.span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-4 text-center">
        <div>
          <p className="font-medium text-sm">Vegan</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-secondary">
            certified
          </p>
        </div>
        <div>
          <p className="font-medium text-sm">Cruelty-Free</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-secondary">
            Leaping Bunny
          </p>
        </div>
        <div>
          <p className="font-medium text-sm">Fragrance-Free</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-secondary">
            no parfum
          </p>
        </div>
      </div>
    </div>
  );
}
