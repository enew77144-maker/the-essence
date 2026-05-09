"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

const TIMELINE = ["pending", "processing", "shipped", "delivered"] as const;

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => queries.order(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <p className="text-secondary">Order not found.</p>
        <Link href="/account/orders" className="mt-4 inline-block link-underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  const stepIdx = TIMELINE.indexOf(order.status as (typeof TIMELINE)[number]);

  return (
    <div className="space-y-8">
      <Link
        href="/account/orders"
        className="text-xs uppercase tracking-[0.18em] text-secondary hover:text-primary"
      >
        ← All orders
      </Link>

      <div>
        <h2 className="font-heading text-3xl">Order #{order.order_number}</h2>
        <p className="mt-1 text-sm text-secondary">
          Placed {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      <ol className="grid grid-cols-4 gap-2 text-xs uppercase tracking-[0.16em]">
        {TIMELINE.map((step, idx) => {
          const active = idx <= stepIdx;
          return (
            <li key={step} className="space-y-2">
              <div
                className={`h-1 w-full ${active ? "bg-primary" : "bg-border"}`}
              />
              <p className={active ? "text-primary" : "text-secondary"}>
                {step}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="border border-border bg-surface">
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <span>
                {item.product_name}{" "}
                <span className="text-secondary">× {item.quantity}</span>
              </span>
              <span>{formatPrice(Number(item.total_price))}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-border px-4 py-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-secondary">Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Shipping</span>
            <span>{formatPrice(Number(order.shipping_cost))}</span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div className="flex items-center justify-between text-success">
              <span>Discount</span>
              <span>−{formatPrice(Number(order.discount_amount))}</span>
            </div>
          )}
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="border border-border bg-surface p-4 text-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary">
          Shipping address
        </p>
        <pre className="mt-2 whitespace-pre-wrap font-body text-foreground/80">
          {Object.entries(order.shipping_address)
            .map(([k, v]) => `${k}: ${v as string}`)
            .join("\n")}
        </pre>
      </div>
    </div>
  );
}
