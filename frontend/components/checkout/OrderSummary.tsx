"use client";

import Image from "next/image";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export function OrderSummary() {
  const { cart } = useCartStore();
  if (!cart) return null;
  const subtotal = Number(cart.subtotal);
  const discount = Number(cart.discount_amount ?? 0);
  const shipping = Number(cart.shipping_cost ?? 0);
  const total = Number(cart.total ?? subtotal - discount + shipping);

  return (
    <aside className="h-fit border border-border bg-surface p-6">
      <h2 className="font-heading text-xl">Order summary</h2>
      <ul className="mt-6 divide-y divide-border">
        {cart.items.map((item) => (
          <li key={item.id} className="flex gap-3 py-4">
            <div className="relative h-16 w-16 flex-none overflow-hidden bg-border">
              {item.product.primary_image?.url && (
                <Image
                  src={item.product.primary_image.url}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 flex-col text-sm">
              <span className="font-medium">{item.product.name}</span>
              <span className="text-xs text-secondary">
                {item.product.tagline}
              </span>
              <span className="mt-auto">
                {formatPrice(Number(item.line_total))}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-secondary">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-success">
            <span>Discount</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-secondary">Shipping</span>
          <span>{shipping > 0 ? formatPrice(shipping) : "Free"}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 font-medium">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </aside>
  );
}
