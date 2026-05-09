"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  const hydrate = useAuthStore((s) => s.hydrate);
  const fetchCart = useCartStore((s) => s.fetch);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("te_access_token")) {
      void hydrate();
    } else {
      useAuthStore.setState({ user: null, loading: false });
    }
    void fetchCart();
  }, [hydrate, fetchCart]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
