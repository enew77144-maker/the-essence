"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="font-heading text-3xl md:text-5xl">A small disruption.</h1>
      <p className="max-w-md text-secondary">
        Our science team is on it. Try again, or refresh the page.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
