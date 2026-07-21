import { Skeleton } from "@/components/ui/skeleton";

/** Page title + subtitle, with an optional action button on the right. */
export function PageHeaderSkeleton({ withAction = true }: { withAction?: boolean }) {
   return (
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
         <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
         </div>
         {withAction && <Skeleton className="h-10 w-36 shrink-0" />}
      </div>
   );
}

/** A row of summary/KPI cards. */
export function StatCardsSkeleton({ count = 3, className }: { count?: number; className?: string }) {
   return (
      <div className={className ?? "mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"}>
         {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
               <Skeleton className="mb-3 h-4 w-24" />
               <Skeleton className="h-8 w-32" />
            </div>
         ))}
      </div>
   );
}

/** A table with a header row and placeholder body rows. */
export function TableSkeleton({ rows = 6, columns = 6 }: { rows?: number; columns?: number }) {
   return (
      <div className="overflow-hidden rounded-xl border border-border bg-card">
         <div className="flex gap-4 border-b border-border p-4">
            {Array.from({ length: columns }).map((_, i) => (
               <Skeleton key={i} className="h-4 flex-1" />
            ))}
         </div>
         <div className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, r) => (
               <div key={r} className="flex items-center gap-4 p-4">
                  {Array.from({ length: columns }).map((_, c) => (
                     <Skeleton key={c} className="h-5 flex-1" />
                  ))}
               </div>
            ))}
         </div>
      </div>
   );
}

/** A card-shaped placeholder for a chart. */
export function ChartCardSkeleton({ className }: { className?: string }) {
   return (
      <div className={`rounded-xl border border-border bg-card p-4 ${className ?? ""}`}>
         <Skeleton className="mb-2 h-5 w-40" />
         <Skeleton className="mb-4 h-3 w-56" />
         <Skeleton className="h-[240px] w-full" />
      </div>
   );
}
