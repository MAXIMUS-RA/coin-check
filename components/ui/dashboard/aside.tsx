"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Tag,
  PiggyBank,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Overview",     href: "/dashboard",              icon: LayoutDashboard },
  { name: "Accounts",     href: "/dashboard/accounts",     icon: Wallet },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Categories",   href: "/dashboard/categories",   icon: Tag },
];

export default function Aside() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`relative z-10 flex flex-col gap-1 bg-slate-900 h-screen p-3
                  transition-[width] duration-300 ease-out
                  ${expanded ? "w-52" : "w-16"}`}
    >
      <div className="flex items-center gap-3 px-2 py-2.5 mb-2 overflow-hidden">
        <span className="size-5 shrink-0 rounded-full bg-indigo-500" />
        <span
          className={`text-white font-semibold text-sm whitespace-nowrap
                      transition-[opacity,transform] duration-200
                      ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}`}
        >
          CoinCheck
        </span>
      </div>

      <div className="h-px bg-slate-700 mx-1 mb-2" />

      {links.map((el) => {
        const isActive = pathname === el.href;
        return (
          <Link
            key={el.href}
            href={el.href}
            aria-current={isActive ? "page" : undefined}
            title={!expanded ? el.name : undefined}
            className={`flex items-center gap-3 rounded-lg px-2 py-2.5 overflow-hidden
                        transition-colors duration-150
                        ${isActive
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
          >
            <el.icon className="size-5 shrink-0" />
            <span
              className={`whitespace-nowrap text-sm font-medium
                          transition-[opacity,transform] duration-200
                          ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
            >
              {el.name}
            </span>
          </Link>
        );
      })}

      <div className="flex-1" />

      <button
        onClick={() => setExpanded((v) => !v)}
        title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-slate-400
                   hover:bg-slate-800 hover:text-white transition-colors duration-150"
      >
        {expanded
          ? <ChevronsLeft className="size-5 shrink-0" />
          : <ChevronsRight className="size-5 shrink-0" />
        }
        <span
          className={`whitespace-nowrap text-sm font-medium
                      transition-[opacity,transform] duration-200
                      ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
        >
          Collapse
        </span>
      </button>
    </aside>
  );
}
