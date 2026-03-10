import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Receipt,
} from "lucide-react";
import { getUserTransactions } from "@/lib/data/transactions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TYPE_STYLES = {
  INCOME: {
    label: "Income",
    cls: "bg-emerald-500/15 text-emerald-400",
    Icon: TrendingUp,
  },
  EXPENSE: {
    label: "Expense",
    cls: "bg-red-500/15 text-red-400",
    Icon: TrendingDown,
  },
  TRANSFER: {
    label: "Transfer",
    cls: "bg-blue-500/15 text-blue-400",
    Icon: ArrowLeftRight,
  },
} as const;

function fmt(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
}

function fmtDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function TransactionsPage() {
  const session = await auth();
  console.log(session?.user);
  if (!session?.user?.id) redirect("/login");

  const transactions = await getUserTransactions(session.user.id);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);

  const net = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="flex w-full justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-slate-400 mt-1">
            Your full transaction history
          </p>
        </div>
        <div>
          <Link href={"./transactions/create"}>
            <Button>Create</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800 text-white gap-3">
          <CardHeader>
            <CardDescription className="text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="size-4 text-emerald-400" /> Total Income
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-400">
              {fmt(totalIncome)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white gap-3">
          <CardHeader>
            <CardDescription className="text-slate-400 flex items-center gap-1.5">
              <TrendingDown className="size-4 text-red-400" /> Total Expenses
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-red-400">
              {fmt(totalExpenses)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white gap-3">
          <CardHeader>
            <CardDescription className="text-slate-400 flex items-center gap-1.5">
              <Receipt className="size-4 text-indigo-400" /> Net Balance
            </CardDescription>
            <CardTitle
              className={`text-2xl font-bold ${net >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {fmt(net)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 gap-0 overflow-hidden">
        <CardHeader className="border-b border-slate-800 pb-4">
          <CardTitle className="text-white">All Transactions</CardTitle>
          <CardDescription className="text-slate-400">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Receipt className="size-12 mb-3 opacity-30" />
            <p className="font-medium">No transactions yet</p>
            <p className="text-sm mt-1">
              Add your first transaction to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">
                    Description
                  </th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Account</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Type</th>
                  <th className="text-right px-6 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((tx) => {
                  const { label, cls, Icon } = TYPE_STYLES[tx.type];
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">
                          {tx.description}
                        </p>
                        {tx.notes && (
                          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                            {tx.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {tx.category ? (
                          <span className="flex items-center gap-1.5">
                            {tx.category.icon && (
                              <span>{tx.category.icon}</span>
                            )}
                            {tx.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {tx.account.name}
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {fmtDate(tx.date)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}
                        >
                          <Icon className="size-3" />
                          {label}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-semibold tabular-nums
                        ${tx.type === "INCOME" ? "text-emerald-400" : tx.type === "EXPENSE" ? "text-red-400" : "text-blue-400"}`}
                      >
                        {tx.type === "EXPENSE" ? "−" : "+"}
                        {fmt(tx.amount, tx.account.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
