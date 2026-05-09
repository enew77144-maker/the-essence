"use client";

import * as React from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";

export function PaymentForm({
  onPay,
  pending,
  errorMessage,
}: {
  onPay: (paymentMethodId?: string) => Promise<void>;
  pending: boolean;
  errorMessage?: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (stripe && elements) {
        const { error: submitErr } = await elements.submit();
        if (submitErr) {
          throw submitErr;
        }
      }
      await onPay();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {stripe && elements ? (
        <PaymentElement options={{ layout: "tabs" }} />
      ) : (
        <div className="border border-dashed border-border bg-surface p-4 text-sm text-secondary">
          Payment provider unavailable in development — your order will be marked
          as paid for testing purposes.
        </div>
      )}
      {errorMessage && <p className="text-sm text-error">{errorMessage}</p>}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={submitting || pending}
      >
        Place order
      </Button>
    </form>
  );
}
