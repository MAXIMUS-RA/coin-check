import Aside from "@/components/ui/dashboard/aside";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="w-16">
        <Aside />
      </div>
      <div className="flex-3/4">{children}</div>
    </div>
  );
}
