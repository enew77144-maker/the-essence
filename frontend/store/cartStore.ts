"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { api, getCartSessionId, setCartSessionId } from "@/lib/api";
import type { Cart } from "@/lib/types";

type CartState = {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  fetch: () => Promise<void>;
  add: (productId: number, quantity?: number) => Promise<void>;
  update: (itemId: number, quantity: number) => Promise<void>;
  remove: (itemId: number) => Promise<void>;
  applyDiscount: (code: string) => Promise<{ ok: boolean; message?: string }>;
  removeDiscount: () => Promise<void>;
};

async function persistSessionFromCart(cart: Cart) {
  if (cart.session_id) setCartSessionId(cart.session_id);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      fetch: async () => {
        set({ isLoading: true });
        try {
          const sid = getCartSessionId();
          const { data } = await api.get<Cart>("/cart/", {
            params: sid ? { session: sid } : undefined,
          });
          await persistSessionFromCart(data);
          set({ cart: data });
        } finally {
          set({ isLoading: false });
        }
      },
      add: async (productId, quantity = 1) => {
        const { data } = await api.post("/cart/items/", {
          product_id: productId,
          quantity,
        });
        // refetch full cart after item add
        await get().fetch();
        set({ isOpen: true });
        return data;
      },
      update: async (itemId, quantity) => {
        const { data } = await api.patch<Cart>(`/cart/items/${itemId}/`, {
          quantity,
        });
        set({ cart: data });
      },
      remove: async (itemId) => {
        const { data } = await api.delete<Cart>(`/cart/items/${itemId}/`);
        set({ cart: data });
      },
      applyDiscount: async (code: string) => {
        try {
          const { data } = await api.post<Cart>("/cart/apply-discount/", { code });
          set({ cart: data });
          return { ok: true };
        } catch (err) {
          const message =
            (err as { response?: { data?: { detail?: string } } })?.response
              ?.data?.detail || "Could not apply code.";
          return { ok: false, message };
        }
      },
      removeDiscount: async () => {
        const { data } = await api.delete<Cart>("/cart/discount/");
        set({ cart: data });
      },
    }),
    {
      name: "te-cart-store",
      partialize: () => ({}),
    },
  ),
);
