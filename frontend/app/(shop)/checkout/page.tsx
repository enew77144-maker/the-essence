"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";

import { AddressForm, emptyAddress, type AddressInput } from "@/components/checkout/AddressForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { DevPaymentForm, PaymentForm } from "@/components/checkout/PaymentForm";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { getStripe, hasUsableStripeKey } from "@/lib/stripe";
import { cn } from "@/lib/utils";

const stripePromise = hasUsableStripeKey() ? getStripe() : null;

type Step = "address" | "payment" | "review";
const STEPS: Step[] = ["address", "payment", "review"];

const STEP_LABELS: Record<Step, string> = {
  address: "Address",
  payment: "Payment",
  review: "Review",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = React.useState<Step>("address");
  const [address, setAddress] = React.useState<AddressInput>({
    ...emptyAddress,
    email: user?.email ?? "",
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
  });
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user?.email) {
      setAddress((a) => ({
        ...a,
        email: a.email || user.email,
        first_name: a.first_name || user.first_name || "",
        last_name: a.last_name || user.last_name || "",
      }));
    }
  }, [user]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-tight flex min-h-[50vh] flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="font-heading text-4xl">Your bag is empty.</h1>
        <Button asChild>
          <Link href="/products">Shop products</Link>
        </Button>
      </div>
    );
  }

  const goNextFromAddress = async () => {
    setError(null);
    setPending(true);
    try {
      const { data } = await api.post<{
        client_secret: string | null;
        payment_intent_id: string | null;
        dev_mode?: boolean;
      }>("/payments/create-intent/", { email: address.email });
      setClientSecret(data.client_secret);
      setPaymentIntentId(data.payment_intent_id);
      setStep("payment");
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const detail = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      if (status === 400 && detail) {
        setError(detail);
      } else {
        setError(
          "We couldn't initialize payment. Please check your details and try again.",
        );
      }
    } finally {
      setPending(false);
    }
  };

  const placeOrder = async () => {
    setError(null);
    setPending(true);
    try {
      const { data } = await api.post<{ order_number: string }>("/orders/", {
        shipping_address: address,
        billing_address: address,
        payment_intent_id: paymentIntentId,
      });
      router.push(`/checkout/success?order=${data.order_number}`);
    } catch (err) {
      setError(
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Could not place order.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="container-tight py-12">
      <header className="border-b border-border pb-6">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-2 font-heading text-4xl md:text-5xl">Review and pay</h1>
      </header>

      <div className="mt-8 flex items-center gap-6 text-xs uppercase tracking-[0.18em]">
        {STEPS.map((s, idx) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              const currentIdx = STEPS.indexOf(step);
              if (idx <= currentIdx) setStep(s);
            }}
            className={cn(
              "flex items-center gap-2",
              s === step ? "text-primary" : "text-secondary",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center border",
                s === step ? "border-primary" : "border-border",
              )}
            >
              {idx + 1}
            </span>
            {STEP_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <AnimatePresence mode="wait">
            {step === "address" && (
              <motion.div
                key="address"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-heading text-2xl">Shipping address</h2>
                <div className="mt-6">
                  <AddressForm value={address} onChange={setAddress} />
                </div>
                {error && <p className="mt-4 text-sm text-error">{error}</p>}
                <Button
                  onClick={goNextFromAddress}
                  loading={pending}
                  size="lg"
                  className="mt-6"
                >
                  Continue to payment
                </Button>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-heading text-2xl">Payment</h2>
                <p className="mt-2 text-sm text-secondary">
                  All transactions are secured with TLS and processed by Stripe.
                </p>
                <div className="mt-6">
                  {clientSecret && stripePromise ? (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: { theme: "stripe" },
                      }}
                    >
                      <PaymentForm
                        pending={pending}
                        errorMessage={error}
                        onPay={async () => {
                          setStep("review");
                        }}
                      />
                    </Elements>
                  ) : (
                    <DevPaymentForm
                      pending={pending}
                      errorMessage={error}
                      onPay={async () => {
                        setStep("review");
                      }}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-heading text-2xl">Review order</h2>
                <div className="mt-6 space-y-4 border border-border bg-surface p-5 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                      Shipping to
                    </p>
                    <p className="mt-1 font-medium">
                      {address.first_name} {address.last_name}
                    </p>
                    <p className="text-secondary">{address.email}</p>
                    <p className="text-secondary">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                    </p>
                    <p className="text-secondary">
                      {address.postal_code} {address.city}, {address.country}
                    </p>
                  </div>
                </div>
                {error && <p className="mt-4 text-sm text-error">{error}</p>}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("payment")}
                  >
                    Back
                  </Button>
                  <Button onClick={placeOrder} loading={pending} size="lg">
                    Place order
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <OrderSummary />
      </div>
    </div>
  );
}
