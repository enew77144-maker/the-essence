"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { queries } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export default function AccountOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const wishCount = useWishlistStore((s) => s.ids.length);
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: queries.orders,
    enabled: !!user,
  });

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border border-border bg-surface p-6">
          <p className="eyebrow">Orders</p>
          <p className="mt-3 font-heading text-3xl">{orders?.count ?? 0}</p>
          <Link
            href="/account/orders"
            className="mt-4 inline-block text-xs uppercase tracking-[0.18em] hover:text-primary"
          >
            View orders →
          </Link>
        </div>
        <div className="border border-border bg-surface p-6">
          <p className="eyebrow">Wishlist</p>
          <p className="mt-3 font-heading text-3xl">{wishCount}</p>
          <Link
            href="/account/wishlist"
            className="mt-4 inline-block text-xs uppercase tracking-[0.18em] hover:text-primary"
          >
            View wishlist →
          </Link>
        </div>
        <div className="border border-border bg-surface p-6">
          <p className="eyebrow">Email</p>
          <p className="mt-3 truncate text-sm">{user?.email}</p>
          <Link
            href="/account/settings"
            className="mt-4 inline-block text-xs uppercase tracking-[0.18em] hover:text-primary"
          >
            Edit profile →
          </Link>
        </div>
      </div>

      <section>
        <h2 className="font-heading text-2xl">Recent orders</h2>
        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !orders || orders.results.length === 0 ? (
            <div className="border border-dashed border-border p-8 text-center">
              <p className="text-secondary">No orders yet.</p>
              <Button asChild className="mt-4">
                <Link href="/products">Start shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border border border-border bg-surface">
              {orders.results.slice(0, 5).map((o) => (
                <li
                  key={o.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div>
                    <Link
                      href={`/account/orders/${o.id}`}
                      className="font-medium hover:underline"
                    >
                      #{o.order_number}
                    </Link>
                    <p className="text-xs text-secondary">
                      {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-secondary">
                    {o.status}
                  </span>
                  <span className="font-medium">
                    {formatPrice(Number(o.total))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
