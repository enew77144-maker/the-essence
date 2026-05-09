import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="font-heading text-4xl md:text-6xl">Page not found.</h1>
      <p className="max-w-md text-secondary">
        The page you were looking for doesn't exist anymore — but our serums still do.
      </p>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
