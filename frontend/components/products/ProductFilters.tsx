"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Category, Concern } from "@/lib/types";

export type Filters = {
  category?: string;
  concern?: string;
  tag?: string;
  min?: string;
  max?: string;
};

const TAGS = ["vegan", "fragrance-free", "cruelty-free", "alcohol-free"];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-border py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs uppercase tracking-[0.18em]"
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductFilters({
  categories,
  concerns,
  filters,
  onChange,
}: {
  categories: Category[];
  concerns: Concern[];
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const set = (patch: Partial<Filters>) =>
    onChange({ ...filters, ...patch });

  const reset = () => onChange({});

  return (
    <aside className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-[0.2em] text-secondary">
          Filter
        </h2>
        <button
          type="button"
          onClick={reset}
          className="text-xs uppercase tracking-[0.16em] text-secondary hover:text-primary"
        >
          Clear
        </button>
      </div>

      <FilterSection title="Category">
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() =>
                  set({
                    category: filters.category === c.slug ? undefined : c.slug,
                  })
                }
                className={cn(
                  "block text-left text-sm",
                  filters.category === c.slug
                    ? "font-medium text-primary"
                    : "text-secondary hover:text-primary",
                )}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Skin Concern">
        <ul className="space-y-2">
          {concerns.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() =>
                  set({
                    concern: filters.concern === c.name ? undefined : c.name,
                  })
                }
                className={cn(
                  "block text-left text-sm",
                  filters.concern === c.name
                    ? "font-medium text-primary"
                    : "text-secondary hover:text-primary",
                )}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Attributes">
        <ul className="space-y-2">
          {TAGS.map((t) => (
            <li key={t}>
              <button
                type="button"
                onClick={() =>
                  set({ tag: filters.tag === t ? undefined : t })
                }
                className={cn(
                  "block text-left text-sm capitalize",
                  filters.tag === t
                    ? "font-medium text-primary"
                    : "text-secondary hover:text-primary",
                )}
              >
                {t.replace("-", " ")}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={filters.min ?? ""}
            onChange={(e) => set({ min: e.target.value || undefined })}
            className="w-full border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <span className="text-secondary">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={filters.max ?? ""}
            onChange={(e) => set({ max: e.target.value || undefined })}
            className="w-full border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </FilterSection>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-4 w-full"
        onClick={reset}
      >
        Reset all
      </Button>
    </aside>
  );
}
