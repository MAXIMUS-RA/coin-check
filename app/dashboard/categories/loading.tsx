import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/dashboard/skeletons";

/** Categories: header + table (no summary cards on this page). */
export default function CategoriesLoading() {
   return (
      <div className="p-4 text-foreground sm:p-6">
         <PageHeaderSkeleton />
         <TableSkeleton rows={8} columns={6} />
      </div>
   );
}
