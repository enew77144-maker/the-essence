"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AddressInput = {
  email: string;
  first_name: string;
  last_name: string;
  line1: string;
  line2: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
};

export const emptyAddress: AddressInput = {
  email: "",
  first_name: "",
  last_name: "",
  line1: "",
  line2: "",
  city: "",
  postal_code: "",
  country: "France",
  phone: "",
};

export function AddressForm({
  value,
  onChange,
  errors,
}: {
  value: AddressInput;
  onChange: (next: AddressInput) => void;
  errors?: Partial<Record<keyof AddressInput, string>>;
}) {
  const set = (k: keyof AddressInput, v: string) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={value.email}
          onChange={(e) => set("email", e.target.value)}
        />
        {errors?.email && <p className="text-xs text-error">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="first_name">First name</Label>
        <Input
          id="first_name"
          required
          value={value.first_name}
          onChange={(e) => set("first_name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="last_name">Last name</Label>
        <Input
          id="last_name"
          required
          value={value.last_name}
          onChange={(e) => set("last_name", e.target.value)}
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="line1">Address</Label>
        <Input
          id="line1"
          required
          value={value.line1}
          onChange={(e) => set("line1", e.target.value)}
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="line2">Apartment, suite (optional)</Label>
        <Input
          id="line2"
          value={value.line2}
          onChange={(e) => set("line2", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          required
          value={value.city}
          onChange={(e) => set("city", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="postal_code">Postal code</Label>
        <Input
          id="postal_code"
          required
          value={value.postal_code}
          onChange={(e) => set("postal_code", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          required
          value={value.country}
          onChange={(e) => set("country", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={value.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </div>
    </div>
  );
}
