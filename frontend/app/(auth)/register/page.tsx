"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setPending(true);
    try {
      await register({
        email,
        password,
        first_name: first,
        last_name: last,
      });
      router.push("/account");
    } catch (err) {
      const data =
        (err as { response?: { data?: Record<string, unknown> } })?.response
          ?.data;
      const message =
        typeof data?.detail === "string"
          ? data.detail
          : data
            ? Object.values(data).flat().join(" ")
            : "Could not create account.";
      setError(String(message));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-md border border-border bg-surface p-10">
      <p className="eyebrow">Join</p>
      <h1 className="mt-3 font-heading text-3xl">Create an account.</h1>
      <p className="mt-2 text-sm text-secondary">
        Already have one?{" "}
        <Link href="/login" className="link-underline text-primary">
          Sign in
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input
              id="first"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              autoComplete="given-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input
              id="last"
              value={last}
              onChange={(e) => setLast(e.target.value)}
              autoComplete="family-name"
            />
          </div>
        </div>
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <p className="text-[11px] text-secondary">
            Minimum 8 characters. Use a mix of letters and numbers.
          </p>
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" className="w-full" loading={pending}>
          Create account
        </Button>
        <p className="text-[11px] text-secondary">
          By creating an account, you agree to our{" "}
          <Link href="/legal/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
