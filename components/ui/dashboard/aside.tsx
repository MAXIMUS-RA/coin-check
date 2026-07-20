"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, ArrowLeftRight, Tag, UserRound, ChevronsLeft, ChevronsRight, Coins } from "lucide-react";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import ThemeSwitcher from "@/components/ui/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

const links = [
   { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
   { name: "Accounts", href: "/dashboard/financial-accounts", icon: Wallet },
   { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
   { name: "Categories", href: "/dashboard/categories", icon: Tag },
   { name: "Profile", href: "/dashboard/profile", icon: UserRound },
];

export default function Aside({ userImage }: { userImage?: string | null }) {
   const pathname = usePathname();
   const { state, toggleSidebar } = useSidebar();
   const expanded = state === "expanded";

   return (
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
         <SidebarHeader className="bg-sidebar">
            <div className="flex items-center gap-2.5 px-2 py-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
               <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                  <Coins className="size-4.5" />
               </span>
               <span className="truncate text-base font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  CoinCheck
               </span>
            </div>
         </SidebarHeader>

         <SidebarContent className="bg-sidebar">
            <SidebarGroup className="gap-1">
               <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
                  Menu
               </SidebarGroupLabel>
               <SidebarMenu className="gap-1">
                  {links.map((el) => {
                     const isActive = pathname === el.href;

                     return (
                        <SidebarMenuItem key={el.href}>
                           <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={el.name}
                              className="relative h-10 rounded-lg text-[13px] font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-sm lg:h-11 lg:text-sm"
                           >
                              <Link href={el.href}>
                                 {isActive && (
                                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary-foreground/90 group-data-[collapsible=icon]:hidden" />
                                 )}
                                 {el.href === "/dashboard/profile" ? (
                                    <Avatar className="size-5.5">
                                       <AvatarImage src={userImage || "https://github.com/shadcn.png"} alt="User Avatar" />
                                       <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                 ) : (
                                    <el.icon className="size-5 lg:size-5.5" />
                                 )}
                                 <span>{el.name}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     );
                  })}
               </SidebarMenu>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter className="gap-2 border-t border-sidebar-border/60 bg-sidebar pt-2">
            <div className="px-2 group-data-[collapsible=icon]:hidden">
               <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50">Theme</p>
               <ThemeSwitcher />
            </div>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton
                     onClick={toggleSidebar}
                     tooltip={expanded ? "Collapse sidebar" : "Expand sidebar"}
                     className="h-10 rounded-lg text-[13px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:h-11 lg:text-sm"
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
