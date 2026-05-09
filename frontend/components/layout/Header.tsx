"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const { scrollY } = useScroll();
  const cart = useCartStore((s) => s.cart);
  const openCart = useCartStore((s) => s.open);
  const itemCount = cart?.item_count ?? 0;

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <>
      <motion.header
        className={cn(
          "sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur transition-[height] duration-200",
          scrolled ? "h-14" : "h-20",
        )}
      >
        <div className="container-tight flex h-full items-center justify-between gap-6">
          <div className="flex items-center gap-6 md:flex-1">
            <button
              type="button"
              onClick={() => setOpenMobile(true)}
              aria-label="Open menu"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "link-underline text-xs uppercase tracking-[0.18em] text-secondary transition-colors hover:text-primary",
                    pathname === link.href && "text-primary",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            className="font-heading text-xl tracking-[0.2em] uppercase md:text-2xl"
          >
            {SITE.name}
          </Link>

          <div className="flex flex-1 items-center justify-end gap-4">
            <Link
              href="/products"
              aria-label="Search"
              className="hidden text-secondary hover:text-primary md:block"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden text-secondary hover:text-primary md:block"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="hidden text-secondary hover:text-primary md:block"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label="Open cart"
              className="relative text-secondary hover:text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 600, damping: 18 }}
                  className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={openMobile} onClose={() => setOpenMobile(false)} />
      <CartDrawer />
    </>
  );
}
