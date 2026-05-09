"use client";

import Link from "next/link";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="flex flex-col p-0">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl tracking-[0.18em] uppercase">
            {SITE.name}
          </SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-6 py-6"
        >
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block border-b border-border py-3 text-sm uppercase tracking-[0.18em] hover:text-accent-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/account"
                onClick={onClose}
                className="block border-b border-border py-3 text-sm uppercase tracking-[0.18em]"
              >
                Account
              </Link>
            </li>
            <li>
              <Link
                href="/account/wishlist"
                onClick={onClose}
                className="block border-b border-border py-3 text-sm uppercase tracking-[0.18em]"
              >
                Wishlist
              </Link>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
