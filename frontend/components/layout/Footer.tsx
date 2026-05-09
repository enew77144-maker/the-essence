"use client";

import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FOOTER_LINKS, SITE } from "@/lib/constants";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail("");
  };

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-tight py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-heading text-2xl uppercase tracking-[0.2em]"
            >
              {SITE.name}
            </Link>
            <p className="mt-4 max-w-xs text-sm text-secondary">
              Science-led skincare. Honest pricing. Formulas you can read.
            </p>
            <div className="mt-6 flex gap-4 text-secondary">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                className="hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs uppercase capitalize tracking-[0.2em] text-secondary">
                {title}
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="link-underline text-foreground hover:text-accent-dark"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 items-end gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-heading text-2xl">Stay informed.</h3>
            <p className="mt-2 max-w-md text-sm text-secondary">
              New formulations, ingredient deep dives, and the rare seasonal offer.
              No noise.
            </p>
          </div>
          <form onSubmit={onSubscribe} className="flex w-full gap-2">
            <Input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              className="flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
        {done && (
          <p className="mt-2 text-xs text-success">Thanks — you're on the list.</p>
        )}
      </div>
      <div className="border-t border-border">
        <div className="container-tight flex flex-col items-center justify-between gap-2 py-4 text-xs text-secondary md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/legal/cookies" className="hover:text-primary">
              Cookies
            </Link>
            <Link href="/legal/terms" className="hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
