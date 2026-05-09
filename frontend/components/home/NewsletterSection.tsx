"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-tight grid grid-cols-1 gap-10 py-20 md:grid-cols-2 md:items-end">
        <div>
          <p className="eyebrow text-primary-foreground/60">The Letter</p>
          <h2 className="mt-3 font-heading text-3xl md:text-5xl">
            New formulas. No noise.
          </h2>
          <p className="mt-3 max-w-md text-primary-foreground/70">
            Get one email a month — ingredient breakdowns, restock alerts, and the
            occasional considered offer.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            setDone(true);
            setEmail("");
          }}
          className="flex w-full flex-col gap-3 md:flex-row"
        >
          <div className="relative flex-1">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email"
              className="border-primary-foreground/20 bg-transparent text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:border-primary-foreground"
            />
          </div>
          <Button type="submit" variant="accent">
            Subscribe
          </Button>
          {done && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-center text-xs text-primary-foreground/70"
            >
              Welcome.
            </motion.span>
          )}
        </form>
      </div>
    </section>
  );
}
