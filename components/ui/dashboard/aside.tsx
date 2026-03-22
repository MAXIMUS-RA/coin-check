"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Tag,
  UserRound,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const links = [
  { name: "Overview",     href: "/dashboard",              icon: LayoutDashboard },
  { name: "Accounts",     href: "/dashboard/financial-accounts",     icon: Wallet },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Categories",   href: "/dashboard/categories",   icon: Tag },
  { name: "Profile",      href: "/dashboard/profile",      icon: UserRound },
];

export default function Aside() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const expanded = state === "expanded";

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-800">
      <SidebarHeader className="bg-slate-900">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="size-5 shrink-0 rounded-full bg-indigo-500" />
          <span className="truncate text-sm font-semibold text-white group-data-[collapsible=icon]:hidden">
            CoinCheck
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-900">
        <SidebarGroup>
          <SidebarMenu>
            {links.map((el) => {
              const isActive = pathname === el.href;

              return (
                <SidebarMenuItem key={el.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={el.name}
                    className="text-slate-300 hover:bg-slate-800 hover:text-white data-[active=true]:bg-indigo-600 data-[active=true]:text-white"
                  >
                    <Link href={el.href}>
                      <el.icon className="size-5" />
                      <span>{el.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-slate-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={expanded ? "Collapse sidebar" : "Expand sidebar"}
              className="text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {expanded ? <ChevronsLeft className="size-5" /> : <ChevronsRight className="size-5" />}
              <span>Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
