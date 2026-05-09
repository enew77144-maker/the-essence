"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuthStore();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div className="container-tight flex min-h-[40vh] items-center justify-center text-secondary">
        Loading…
      </div>
    );
  }

  return (
    <div className="container-tight py-12">
      <header className="border-b border-border pb-6">
        <p className="eyebrow">Account</p>
        <h1 className="mt-2 font-heading text-4xl md:text-5xl">
          Hello, {user.first_name || user.email.split("@")[0]}.
        </h1>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav aria-label="Account">
            <ul className="space-y-1">
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "block border-l-2 px-4 py-2 text-sm transition-colors",
                        active
                          ? "border-primary text-primary"
                          : "border-transparent text-secondary hover:border-border hover:text-primary",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-6 w-full"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Sign out
          </Button>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
