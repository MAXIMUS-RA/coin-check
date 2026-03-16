import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createFinancialAccount, deleteFinancialAccount } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Wallet, CreditCard, Landmark } from "lucide-react";

function fmt(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const ACCOUNT_TYPES = ["BANK", "CREDIT", "CASH", "INVESTMENT"] as const;

export default async function AccountsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const accounts = await prisma.financialAccount.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          transactions: true,
          categories: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const debt = accounts
    .filter((a) => a.type === "CREDIT" && a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  return (
    <div className="p-6 text-white">
      <div className="w-full flex justify-between gap-6 flex-wrap">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-white">Accounts</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your wallets, bank accounts, and cards
          </p>
        </div>

        <form
          action={createFinancialAccount}
          className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-wrap items-end gap-3 min-w-[300px]"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-xs text-slate-400">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Main Checking"
              className="bg-slate-800 border border-slate-700 rounded-md px-3 h-10 text-sm text-white min-w-[160px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-xs text-slate-400">Type</label>
            <select
              id="type"
              name="type"
              defaultValue="BANK"
              className="bg-slate-800 border border-slate-700 rounded-md px-3 h-10 text-sm text-white"
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="balance" className="text-xs text-slate-400">Balance</label>
            <input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              defaultValue="0"
              className="bg-slate-800 border border-slate-700 rounded-md px-3 h-10 text-sm text-white w-[120px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="currency" className="text-xs text-slate-400">Currency</label>
            <input
              id="currency"
              name="currency"
              type="text"
              defaultValue="USD"
              maxLength={6}
              className="bg-slate-800 border border-slate-700 rounded-md px-3 h-10 text-sm text-white w-[100px]"
            />
          </div>

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-10">
            Create Account
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <Card className="bg-slate-900 border-slate-800 text-white gap-3">
          <CardHeader>
            <CardDescription className="text-slate-400 flex items-center gap-1.5">
              <Wallet className="size-4 text-emerald-400" /> Total Balance
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-400">
              {fmt(totalBalance)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white gap-3">
          <CardHeader>
            <CardDescription className="text-slate-400 flex items-center gap-1.5">
              <CreditCard className="size-4 text-red-400" /> Credit Debt
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-red-400">
              {fmt(debt)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white gap-3">
          <CardHeader>
            <CardDescription className="text-slate-400 flex items-center gap-1.5">
              <Landmark className="size-4 text-blue-400" /> Accounts
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-400">
              {accounts.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Table className="text-white">
        <TableCaption className="text-slate-400">
          {accounts.length} account{accounts.length === 1 ? "" : "s"} found
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Type</TableHead>
            <TableHead className="text-white">Currency</TableHead>
            <TableHead className="text-white text-right">Balance</TableHead>
            <TableHead className="text-white text-right">Transactions</TableHead>
            <TableHead className="text-white text-right">Categories</TableHead>
            <TableHead className="text-gray-600 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-slate-400">
                No accounts yet. Create your first account above.
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((acc) => (
              <TableRow key={acc.id} className="hover:bg-slate-800/50">
                <TableCell className="font-medium">{acc.name}</TableCell>
                <TableCell>{acc.type}</TableCell>
                <TableCell>{acc.currency}</TableCell>
                <TableCell
                  className={
                    "text-right font-semibold " + (acc.balance >= 0 ? "text-emerald-400" : "text-red-400")
                  }
                >
                  {fmt(acc.balance, acc.currency)}
                </TableCell>
                <TableCell className="text-right">{acc._count.transactions}</TableCell>
                <TableCell className="text-right">{acc._count.categories}</TableCell>
                <TableCell className="text-right">
                  <form action={deleteFinancialAccount.bind(null, acc.id)}>
                    <Button type="submit" variant="destructive" size="sm">
                      Delete
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}