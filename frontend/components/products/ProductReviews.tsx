"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { cn } from "@/lib/utils";
import type { ProductDetail, Review } from "@/lib/types";

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (n: number) => void;
}) {
  const [hover, setHover] = React.useState(0);
  const display = hover || value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => setHover(0)}
          className={cn(
            "transition-transform",
            onChange && "hover:scale-110",
          )}
          disabled={!onChange}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "h-5 w-5",
              n <= display
                ? "fill-accent-dark text-accent-dark"
                : "text-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ product }: { product: ProductDetail }) {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", product.slug],
    queryFn: () => queries.reviews(product.slug),
  });

  const ratings: Review[] = reviews ?? [];
  const dist = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: ratings.filter((r) => r.rating === stars).length,
  }));
  const total = ratings.length || 1;

  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post(`/products/${product.slug}/reviews/`, {
        rating,
        title,
        body,
      });
    },
    onSuccess: () => {
      setTitle("");
      setBody("");
      setRating(5);
      qc.invalidateQueries({ queryKey: ["reviews", product.slug] });
      qc.invalidateQueries({ queryKey: ["product", product.slug] });
    },
    onError: (err) => {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Could not submit review.";
      setError(message);
    },
  });

  return (
    <section id="reviews" className="border-t border-border pt-12">
      <h2 className="font-heading text-3xl">Reviews</h2>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-5xl">
              {Number(product.rating_avg ?? 0).toFixed(1)}
            </span>
            <StarRating value={Math.round(Number(product.rating_avg ?? 0))} />
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-secondary">
            {product.rating_count} verified reviews
          </p>
          <ul className="mt-4 space-y-2">
            {dist.map((d) => (
              <li key={d.stars} className="flex items-center gap-3 text-xs">
                <span className="w-6 text-secondary">{d.stars}★</span>
                <div className="flex-1 bg-border">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(d.count / total) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="h-1 bg-primary"
                  />
                </div>
                <span className="w-8 text-right text-secondary">{d.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          ) : ratings.length === 0 ? (
            <p className="text-secondary">
              No reviews yet. Be the first to share your results.
            </p>
          ) : (
            <ul className="space-y-8">
              {ratings.slice(0, 12).map((review: Review) => (
                <li key={review.id} className="border-b border-border pb-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <StarRating value={review.rating} />
                    <span className="text-xs uppercase tracking-[0.18em] text-secondary">
                      {review.user_name}
                    </span>
                    {review.verified_purchase && (
                      <span className="text-xs uppercase tracking-[0.18em] text-success">
                        Verified
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <p className="mt-2 font-medium">{review.title}</p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {review.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-12 max-w-2xl border border-border p-6">
        <h3 className="font-heading text-2xl">Write a review</h3>
        {!user ? (
          <p className="mt-2 text-sm text-secondary">
            Please sign in to leave a review.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              mutation.mutate();
            }}
            className="mt-4 space-y-4"
          >
            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Your review</Label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={5}
                className="w-full border border-border bg-surface p-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
            <Button type="submit" loading={mutation.isPending}>
              Submit review
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
