"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import FinancialAccountEdit from "./FinancialAccountEdit";
import DeleteAccountButton from "./DeleteAccountButton";
import { useRouter } from "next/navigation";
import type { FinancialAccount } from "@/types/dashboard/financialAccount.types";

function fmt(amount: number, currency = "USD") {
   return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export default function FinancialAccountRow({ account }: { account: FinancialAccount }) {
   const router = useRouter();

   return (
      <TableRow
         key={account.id}
         className="cursor-pointer hover:bg-muted/50"
         onClick={() => router.push(`/dashboard/financial-accounts/${account.id}`)}
      >
         <TableCell className="font-medium">{account.name}</TableCell>
         <TableCell>{account.type}</TableCell>
         <TableCell>{account.currency}</TableCell>
         <TableCell
            className={"text-right font-semibold " + (account.balance >= 0 ? "text-emerald-400" : "text-red-400")}
         >
            {fmt(account.balance, account.currency)}
         </TableCell>
         <TableCell className="text-right">{account._count.transactions}</TableCell>
         <TableCell
            className="text-right"
            onClick={(e) => {
               e.stopPropagation();
            }}
         >
            <div className="flex items-center justify-end gap-2">
               <FinancialAccountEdit account={account} />
               <DeleteAccountButton accountId={account.id} />
            </div>
         </TableCell>
      </TableRow>
   );
}
