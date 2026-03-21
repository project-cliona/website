import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
  return (
    <div className="card-warm">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20 rounded-md mt-2" />
      <Skeleton className="h-5 w-16 rounded-full mt-3" />
    </div>
  );
}
