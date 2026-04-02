"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CashflowPoint = {
  month: string;
  income: number;
  expense: number;
};

type PiePoint = {
  name: string;
  value: number;
  color: string;
};

type AccountPoint = {
  name: string;
  balance: number;
};

type RecentTransaction = {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  date: string;
  accountName: string;
  categoryName: string | null;
};

type SpendingCategory = {
  name: string;
  amount: number;
  percent: number;
  color: string;
};

type OverviewProps = {
  kpis: {
    netWorth: number;
    monthIncome: number;
    monthExpense: number;
    savingsRate: number;
  };
  defaultCurrency: string;
  dashboardPeriod: number;
  hiddenWidgets: string[];
  cashflowData: CashflowPoint[];
  expenseByCategory: PiePoint[];
  accountBalances: AccountPoint[];
  recentTransactions: RecentTransaction[];
  topSpending: SpendingCategory[];
};

function fmtCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function fmtCompactCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

function fmtDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function OverviewDashboard({
  kpis,
  defaultCurrency,
  dashboardPeriod,
  hiddenWidgets,
  cashflowData,
  expenseByCategory,
  accountBalances,
  recentTransactions,
  topSpending,
}: OverviewProps) {
  const isHidden = (widget: string) => hiddenWidgets.includes(widget);

  return (
    <div className="min-h-screen bg-background p-4 text-foreground sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your personal finance cockpit at a glance ({dashboardPeriod}d focus).</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Link href="/dashboard/transactions" className="w-full sm:w-auto">
            <Button className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700 sm:w-auto sm:justify-center">
              <ArrowLeftRight className="size-4" />
              Add Transaction
            </Button>
          </Link>
          <Link href="/dashboard/financial-accounts" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full justify-start border-border bg-card text-foreground hover:bg-accent sm:w-auto sm:justify-center">
              <Wallet className="size-4" />
              Accounts
            </Button>
          </Link>
          <Link href="/dashboard/categories" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full justify-start border-border bg-card text-foreground hover:bg-accent sm:w-auto sm:justify-center">
              <Tag className="size-4" />
              Categories
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-emerald-900/50 bg-linear-to-br from-emerald-950/60 to-slate-900 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-emerald-300">
              <PiggyBank className="size-4" /> Net Worth
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-300">{fmtCurrency(kpis.netWorth, defaultCurrency)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-emerald-400/90">Across all tracked accounts</CardContent>
        </Card>

        <Card className="border-emerald-900/40 bg-linear-to-br from-emerald-950/50 to-slate-900 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-emerald-300">
              <ArrowUpRight className="size-4" /> This Month Income
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-300">{fmtCurrency(kpis.monthIncome, defaultCurrency)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-emerald-400/90">Money flowing in this month</CardContent>
        </Card>

        <Card className="border-rose-900/40 bg-linear-to-br from-rose-950/45 to-slate-900 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-rose-300">
              <ArrowDownRight className="size-4" /> This Month Expenses
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-rose-300">{fmtCurrency(kpis.monthExpense, defaultCurrency)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-rose-300/90">Spending this month</CardContent>
        </Card>

        <Card className="border-blue-900/40 bg-linear-to-br from-blue-950/50 to-slate-900 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-blue-300">
              <CreditCard className="size-4" /> Savings Rate
            </CardDescription>
            <CardTitle className={`text-3xl font-bold ${kpis.savingsRate >= 0 ? "text-blue-300" : "text-rose-300"}`}>
              {kpis.savingsRate.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">(income - expense) / income</CardContent>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {!isHidden("cashflow") && (
        <Card className="xl:col-span-2 border-border bg-card/90 text-card-foreground">
          <CardHeader>
            <CardTitle>Cashflow Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Income vs expenses over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => fmtCompactCurrency(Number(v))}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(value) => fmtCurrency(Number(value ?? 0), defaultCurrency)}
                />
                <Area type="monotone" dataKey="income" stroke="#34d399" fill="url(#incomeFill)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#fb7185" fill="url(#expenseFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        )}

        {!isHidden("expenseBreakdown") && (
        <Card className="border-border bg-card/90 text-card-foreground">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription className="text-muted-foreground">Where your money went</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-55">
              {expenseByCategory.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No expense data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {expenseByCategory.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        color: "var(--popover-foreground)",
                      }}
                      formatter={(value) => fmtCurrency(Number(value ?? 0), defaultCurrency)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {expenseByCategory.slice(0, 5).map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-medium text-foreground">{fmtCurrency(item.value, defaultCurrency)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {!isHidden("accountBalances") && (
        <Card className="border-border bg-card/90 text-card-foreground xl:col-span-1">
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
            <CardDescription className="text-muted-foreground">Top accounts by current balance</CardDescription>
          </CardHeader>
          <CardContent className="h-72.5">
            {accountBalances.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No accounts yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accountBalances} layout="vertical" margin={{ left: 15, right: 12, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={90} stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      color: "var(--popover-foreground)",
                    }}
                    formatter={(value) => fmtCurrency(Number(value ?? 0), defaultCurrency)}
                  />
                  <Bar dataKey="balance" fill="#38bdf8" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        )}

        {!isHidden("topSpending") && (
        <Card className="border-border bg-card/90 text-card-foreground xl:col-span-1">
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription className="text-muted-foreground">Share of total expense</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSpending.length === 0 ? (
              <p className="text-sm text-muted-foreground">No spending data this period.</p>
            ) : (
              topSpending.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium text-foreground">{fmtCurrency(item.amount, defaultCurrency)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(item.percent, 4)}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <p className="text-right text-xs text-muted-foreground">{item.percent.toFixed(1)}%</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        )}

        {!isHidden("recentTransactions") && (
        <Card className="border-border bg-card/90 text-card-foreground xl:col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription className="text-muted-foreground">Latest activity in your ledger</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{tx.description}</p>
                    <p
                      className={`shrink-0 text-sm font-semibold ${
                        tx.type === "INCOME"
                          ? "text-emerald-400"
                          : tx.type === "EXPENSE"
                            ? "text-rose-400"
                            : "text-blue-400"
                      }`}
                    >
                      {tx.type === "EXPENSE" ? "-" : "+"}
                      {fmtCurrency(tx.amount, defaultCurrency)}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">{tx.accountName}{tx.categoryName ? ` • ${tx.categoryName}` : ""}</span>
                    <span>{fmtDate(tx.date)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
