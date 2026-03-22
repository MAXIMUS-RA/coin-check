import Aside from "@/components/ui/dashboard/aside";
import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false} className="min-h-screen bg-slate-950 text-white">
      <Aside />
      <SidebarInset className="min-h-screen bg-slate-950 text-white">
        <div className="flex h-12 items-center border-b border-slate-800 px-3 md:hidden">
          <SidebarTrigger className="text-slate-200 hover:bg-slate-800 hover:text-white" />
        </div>
        <div className="h-full w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
