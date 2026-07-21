import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton } from "@/components/ui/dashboard/skeletons";

/** Profile: header + the two settings cards (xl:grid-cols-2). */
export default function ProfileLoading() {
   return (
      <div className="p-4 text-foreground sm:p-6">
         <PageHeaderSkeleton withAction={false} />

         <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Personal profile card */}
            <div className="rounded-xl border border-border bg-card p-6">
               <Skeleton className="mb-2 h-6 w-40" />
               <Skeleton className="mb-6 h-4 w-64" />

               <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
               </div>

               {/* Avatar block */}
               <div className="mb-4 flex items-center gap-4 rounded-lg border border-border p-4">
                  <Skeleton className="size-20 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                     <Skeleton className="h-9 w-36" />
                     <Skeleton className="h-3 w-40" />
                  </div>
               </div>

               <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
               </div>

               <Skeleton className="h-28" />
            </div>

            {/* Security card */}
            <div className="rounded-xl border border-border bg-card p-6">
               <Skeleton className="mb-2 h-6 w-28" />
               <Skeleton className="mb-6 h-4 w-72" />

               <div className="space-y-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-10 w-40 self-end" />
               </div>
            </div>
         </div>
      </div>
   );
}
