"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setFirst(user.first_name ?? "");
      setLast(user.last_name ?? "");
      setEmail(user.email);
    }
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setDone(false);
    try {
      await api.patch("/auth/me/", {
        first_name: first,
        last_name: last,
        email,
      });
      setDone(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-2xl">Account settings</h2>
      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input
              id="first"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input
              id="last"
              value={last}
              onChange={(e) => setLast(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {done && <p className="text-sm text-success">Saved.</p>}
        <Button type="submit" loading={pending}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
