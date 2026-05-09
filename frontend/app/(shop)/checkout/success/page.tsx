"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const sp = use(searchParams);
  const orderNumber = sp.order;
  const { data: order, isLoading } = useQuery({
    queryKey: ["order-by-number", orderNumber],
    queryFn: () => queries.orderByNumber(orderNumber as string),
    enabled: !!orderNumber,
  });

  return (
    <div className="container-tight py-20">
      <div className="mx-auto max-w-2xl border border-border bg-surface p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <p className="eyebrow mt-6">Order confirmed</p>
        <h1 className="mt-3 font-heading text-4xl">Thank you for your order.</h1>
        <p className="mt-3 text-secondary">
          A confirmation has been sent to your inbox. Track your shipment from
          your account.
        </p>

        {orderNumber && (
          <p className="mt-6 text-sm">
            Order number:{" "}
            <span className="font-medium">#{orderNumber}</span>
          </p>
        )}

        {isLoading ? (
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
          </div>
        ) : order ? (
          <div className="mt-8 border-t border-border pt-6 text-left">
            <ul className="space-y-3 text-sm">
              {order.items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between gap-4"
                >
                  <span>
                    {it.product_name}{" "}
                    <span className="text-secondary">× {it.quantity}</span>
                  </span>
                  <span>{formatPrice(Number(it.total_price))}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span>Total</span>
              <span className="font-medium">
                {formatPrice(Number(order.total))}
              </span>
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/account/orders">View orders</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
