import Aside from "@/components/ui/dashboard/aside";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <div className="w-16 h-full shrink-0 border-r border-slate-800 bg-slate-950/50">
        <Aside />
      </div>
      <div className="flex-1 h-full o w-full">{children}</div>
    </div>
  );
}
