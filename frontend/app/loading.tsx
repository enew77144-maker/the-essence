import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-tight py-24 space-y-10">
      <Skeleton className="h-12 w-3/4 max-w-xl" />
      <Skeleton className="h-6 w-1/2 max-w-md" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5] w-full" />
        ))}
      </div>
    </div>
  );
}
