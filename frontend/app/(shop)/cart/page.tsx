"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function CartPage() {
  const { cart, update, remove, applyDiscount, removeDiscount } = useCartStore();
  const [code, setCode] = React.useState("");
  const [msg, setMsg] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const subtotal = Number(cart?.subtotal ?? 0);
  const discount = Number(cart?.discount_amount ?? 0);
  const shipping = Number(cart?.shipping_cost ?? 0);
  const total = Number(cart?.total ?? 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const onApply = async () => {
    if (!code) return;
    setPending(true);
    const res = await applyDiscount(code);
    setPending(false);
    setMsg(res.ok ? "Code applied." : res.message ?? "Invalid code.");
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-tight flex min-h-[50vh] flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="eyebrow">Your bag</p>
        <h1 className="font-heading text-4xl md:text-5xl">Your bag is empty.</h1>
        <p className="max-w-md text-secondary">
          A clean canvas. Discover formulas designed for visible, measurable
          results.
        </p>
        <Button asChild>
          <Link href="/products">Shop products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-tight py-12">
      <header className="border-b border-border pb-6">
        <p className="eyebrow">Your bag</p>
        <h1 className="mt-2 font-heading text-4xl md:text-5xl">Bag summary</h1>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="border-b border-border pb-4">
            {remaining > 0 ? (
              <p className="text-sm text-secondary">
                Add{" "}
                <span className="font-medium text-primary">
                  {formatPrice(remaining)}
                </span>{" "}
                more for free shipping.
              </p>
            ) : (
              <p className="text-sm text-success">
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

          <ul className="divide-y divide-border">
            {cart.items.map((item) => (
              <li key={item.id} className="flex gap-4 py-6">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative block h-28 w-28 flex-none overflow-hidden bg-border"
                >
                  {item.product.primary_image?.url && (
                    <Image
                      src={item.product.primary_image.url}
                      alt={item.product.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-secondary">
                        {item.product.tagline}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label="Remove item"
                      className="text-secondary hover:text-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
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
                      <span className="w-10 text-center text-sm">
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
                    <p className="font-medium">
                      {formatPrice(Number(item.line_total))}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit border border-border bg-surface p-6">
          <h2 className="font-heading text-2xl">Order summary</h2>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-secondary">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-success">
                <span>Discount {cart.discount_code ? `(${cart.discount_code})` : ""}</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-secondary">Shipping</span>
              <span>
                {shipping > 0 ? formatPrice(shipping) : "Calculated at checkout"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(total || subtotal - discount + shipping)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">
              Discount code
            </p>
            <div className="flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="WELCOME10"
                aria-label="Discount code"
              />
              <Button
                type="button"
                onClick={onApply}
                loading={pending}
                size="sm"
                variant="outline"
              >
                Apply
              </Button>
            </div>
            {cart.discount_code && (
              <button
                type="button"
                onClick={() => removeDiscount()}
                className="text-xs text-secondary underline-offset-2 hover:underline"
              >
                Remove {cart.discount_code}
              </button>
            )}
            {msg && <p className="text-xs text-secondary">{msg}</p>}
          </div>

          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/checkout">Checkout</Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
