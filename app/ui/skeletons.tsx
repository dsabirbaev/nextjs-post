import { Skeleton } from '@/components/ui/skeleton';

export function CardSkeleton() {
  return (
    <div className="border border-gray-100 rounded-xl p-6 animate-pulse">
      {/* Title */}
      <div className="h-5 w-4/5 bg-gray-100 rounded mb-2" />
      <div className="h-5 w-3/5 bg-gray-100 rounded mb-4" />
      {/* Content */}
      <div className="h-3.5 w-full bg-gray-100 rounded mb-2" />
      <div className="h-3.5 w-4/5 bg-gray-100 rounded mb-4" />
      {/* Date */}
      <div className="h-3 w-24 bg-gray-100 rounded" />
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function TablesSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
