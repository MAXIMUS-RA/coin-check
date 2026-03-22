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
import ThemeSwitcher from "@/components/ui/theme-switcher";

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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="bg-sidebar">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="size-5 shrink-0 rounded-full bg-indigo-500" />
          <span className="truncate text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            CoinCheck
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
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
                    className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
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

      <SidebarFooter className="bg-sidebar">
        <div className="px-2 pb-1 group-data-[collapsible=icon]:hidden">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-sidebar-foreground/60">Theme</p>
          <ThemeSwitcher />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={expanded ? "Collapse sidebar" : "Expand sidebar"}
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
