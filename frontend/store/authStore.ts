"use client";

import { create } from "zustand";

import { api, clearTokens, setTokens } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  hydrate: async () => {
    try {
      const { data } = await api.get<User>("/auth/me/");
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  login: async (email, password) => {
    const { data } = await api.post<{ access: string; refresh: string }>(
      "/auth/login/",
      { email, password },
    );
    setTokens(data.access, data.refresh);
    const me = await api.get<User>("/auth/me/");
    set({ user: me.data });
  },
  register: async (payload) => {
    const { data } = await api.post<{
      user: User;
      access: string;
      refresh: string;
    }>("/auth/register/", payload);
    setTokens(data.access, data.refresh);
    set({ user: data.user });
  },
  logout: () => {
    clearTokens();
    set({ user: null });
  },
}));
