"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export function CartDrawer() {
  const { isOpen, close, cart, update, remove } = useCartStore();
  const subtotal = Number(cart?.subtotal ?? 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && close()}>
      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader>
          <SheetTitle>Your bag</SheetTitle>
          <p className="mt-1 text-xs text-secondary">
            {cart?.item_count ?? 0} item{(cart?.item_count ?? 0) === 1 ? "" : "s"}
          </p>
        </SheetHeader>

        <div className="border-b border-border px-6 py-4">
          {remaining > 0 ? (
            <p className="text-xs text-secondary">
              Add{" "}
              <span className="font-medium text-primary">
                {formatPrice(remaining)}
              </span>{" "}
              more for free shipping.
            </p>
          ) : (
            <p className="text-xs text-success">
              You've unlocked free shipping.
            </p>
          )}
          <div className="mt-2 h-1 w-full bg-border">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="font-heading text-xl">Your bag is empty.</p>
              <p className="max-w-xs text-sm text-secondary">
                Discover formulas designed for visible results.
              </p>
              <Button asChild onClick={close}>
                <Link href="/products">Shop products</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <Link
                    href={`/products/${item.product.slug}`}
                    onClick={close}
                    className="relative block h-20 w-20 flex-none overflow-hidden bg-border"
                  >
                    {item.product.primary_image?.url && (
                      <Image
                        src={item.product.primary_image.url}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={close}
                        className="text-sm font-medium hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label="Remove item"
                        className="text-secondary hover:text-primary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-secondary">
                      {item.product.tagline}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            update(item.id, Math.max(1, item.quantity - 1))
                          }
                          aria-label="Decrease quantity"
                          className="p-2 hover:bg-border/40"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => update(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-2 hover:bg-border/40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(Number(item.line_total))}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <SheetFooter className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <Button asChild size="lg" className="w-full" onClick={close}>
              <Link href="/checkout">Checkout</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full"
              onClick={close}
            >
              <Link href="/cart">View bag</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
