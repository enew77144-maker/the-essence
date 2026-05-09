"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      await api.post("/auth/password/reset/", { email });
    } catch {
      // Silently no-op — server returns success regardless
    } finally {
      setDone(true);
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-md border border-border bg-surface p-10">
      <p className="eyebrow">Account recovery</p>
      <h1 className="mt-3 font-heading text-3xl">Reset password.</h1>
      <p className="mt-2 text-sm text-secondary">
        Enter your email and we'll send you a reset link.
      </p>

      {done ? (
        <div className="mt-8 border border-border bg-bg p-5 text-sm">
          If an account exists for that email, a password reset link has been
          sent. Please check your inbox.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <Button type="submit" className="w-full" loading={pending}>
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-xs uppercase tracking-[0.18em] text-secondary">
        Remembered?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
