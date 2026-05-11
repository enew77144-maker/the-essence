"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

const PLACEHOLDER_KEY = /^pk_(test|live)_x+$/i;

export function hasUsableStripeKey(): boolean {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  return Boolean(key) && !PLACEHOLDER_KEY.test(key ?? "");
}

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = hasUsableStripeKey()
      ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "")
      : Promise.resolve(null);
  }
  return stripePromise;
}
