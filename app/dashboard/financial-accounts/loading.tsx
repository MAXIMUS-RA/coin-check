import { PageHeaderSkeleton, StatCardsSkeleton, TableSkeleton } from "@/components/ui/dashboard/skeletons";

/** Accounts: header + 3 summary cards + accounts table. */
export default function FinancialAccountsLoading() {
   return (
      <div className="p-4 text-foreground sm:p-6">
         <PageHeaderSkeleton />
         <StatCardsSkeleton count={3} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3" />
         <TableSkeleton rows={6} columns={5} />
      </div>
   );
}
