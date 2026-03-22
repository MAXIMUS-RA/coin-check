import Aside from "@/components/ui/dashboard/aside";
import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false} className="min-h-screen bg-background text-foreground">
      <Aside />
      <SidebarInset className="min-h-screen bg-background text-foreground">
        <div className="flex h-12 items-center border-b border-border px-3 md:hidden">
          <SidebarTrigger className="text-muted-foreground hover:bg-accent hover:text-accent-foreground" />
        </div>
        <div className="h-full w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
