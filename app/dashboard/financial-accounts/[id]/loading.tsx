import { PageHeaderSkeleton, StatCardsSkeleton, TableSkeleton } from "@/components/ui/dashboard/skeletons";

/** Single account: header + 3 detail cards + that account's transactions. */
export default function AccountDetailLoading() {
   return (
      <div className="p-4 text-foreground sm:p-6">
         <PageHeaderSkeleton />
         <StatCardsSkeleton count={3} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3" />
         <TableSkeleton rows={6} columns={5} />
      </div>
   );
}
