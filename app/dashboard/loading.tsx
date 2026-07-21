import { PageHeaderSkeleton, StatCardsSkeleton, ChartCardSkeleton } from "@/components/ui/dashboard/skeletons";

/** Overview: 4 KPI cards, then two rows of charts (xl:grid-cols-3). */
export default function DashboardLoading() {
   return (
      <div className="p-4 text-foreground sm:p-6">
         <PageHeaderSkeleton withAction={false} />

         <StatCardsSkeleton count={4} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" />

         <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartCardSkeleton className="xl:col-span-2" />
            <ChartCardSkeleton />
         </div>

         <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
            <ChartCardSkeleton />
         </div>
      </div>
   );
}
