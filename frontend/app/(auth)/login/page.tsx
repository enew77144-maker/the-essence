"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/account";

  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(email, password);
      router.push(next);
    } catch (err) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Could not sign in.";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-md border border-border bg-surface p-10">
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-3 font-heading text-3xl">Sign in.</h1>
      <p className="mt-2 text-sm text-secondary">
        New here?{" "}
        <Link
          href="/register"
          className="link-underline text-primary"
        >
          Create an account
        </Link>
      </p>

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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" className="w-full" loading={pending}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/forgot-password"
          className="text-xs uppercase tracking-[0.18em] text-secondary hover:text-primary"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
