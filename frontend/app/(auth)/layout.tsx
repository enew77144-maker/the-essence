import Link from "next/link";

import { SITE } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border">
        <div className="container-tight flex items-center justify-between py-5">
          <Link
            href="/"
            className="font-heading text-xl uppercase tracking-[0.2em]"
          >
            {SITE.name}
          </Link>
          <Link
            href="/products"
            className="text-xs uppercase tracking-[0.18em] text-secondary hover:text-primary"
          >
            Continue shopping
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        {children}
      </main>
    </div>
  );
}
