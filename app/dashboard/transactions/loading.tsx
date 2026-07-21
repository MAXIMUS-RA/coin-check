import { PageHeaderSkeleton, StatCardsSkeleton, TableSkeleton } from "@/components/ui/dashboard/skeletons";

/** Transactions: header + 3 summary cards + transactions table. */
export default function TransactionsLoading() {
   return (
      <div className="p-4 text-foreground sm:p-6">
         <PageHeaderSkeleton />
         <StatCardsSkeleton count={3} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3" />
         <TableSkeleton rows={8} columns={6} />
      </div>
   );
}
