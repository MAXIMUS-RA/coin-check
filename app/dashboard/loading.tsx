import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44 bg-slate-800" />
          <Skeleton className="h-4 w-72 bg-slate-800/80" />
        </div>
        <Skeleton className="h-10 w-36 bg-slate-800" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 rounded-xl border border-slate-800 bg-slate-900" />
        <Skeleton className="h-28 rounded-xl border border-slate-800 bg-slate-900" />
        <Skeleton className="h-28 rounded-xl border border-slate-800 bg-slate-900" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <Skeleton className="h-14 rounded-none border-b border-slate-800 bg-slate-900/80" />
        <div className="space-y-3 p-4">
          <Skeleton className="h-10 bg-slate-800/90" />
          <Skeleton className="h-10 bg-slate-800/80" />
          <Skeleton className="h-10 bg-slate-800/70" />
          <Skeleton className="h-10 bg-slate-800/60" />
          <Skeleton className="h-10 bg-slate-800/50" />
        </div>
      </div>
    </div>
  );
}