"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { queries } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: queries.orders,
  });

  return (
    <div>
      <h2 className="font-heading text-2xl">Your orders</h2>
      <p className="mt-2 text-sm text-secondary">
        Track shipments, view invoices, and reorder favourites.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !data || data.results.length === 0 ? (
          <div className="border border-dashed border-border p-10 text-center">
            <p className="text-secondary">You haven't placed any orders yet.</p>
            <Button asChild className="mt-4">
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border border border-border bg-surface">
            {data.results.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm"
              >
                <div>
                  <Link
                    href={`/account/orders/${o.id}`}
                    className="font-medium hover:underline"
                  >
                    #{o.order_number}
                  </Link>
                  <p className="text-xs text-secondary">
                    {new Date(o.created_at).toLocaleDateString()} · {o.items.length} item{o.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="rounded-sm border border-border px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-secondary">
                  {o.status}
                </span>
                <span className="font-medium">{formatPrice(Number(o.total))}</span>
                <Link
                  href={`/account/orders/${o.id}`}
                  className="text-xs uppercase tracking-[0.18em] hover:text-primary"
                >
                  Details →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
