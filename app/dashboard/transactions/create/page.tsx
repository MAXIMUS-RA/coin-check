import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserAccounts, getUserCategories } from "@/lib/data/transactions";
import { createTransaction } from "@/lib/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { accumulateMetadata } from "next/dist/lib/metadata/resolve-metadata";

export default async function CreateTransactionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [accounts, categories] = await Promise.all([
    getUserAccounts(session.user.id),
    getUserCategories(session.user.id),
  ]);

  console.log("Logged in ID:", session.user.id);
  console.log("Found accounts:", accounts);

  return (
    <div className="w-full flex flex-col items-center p-6 pt-5 pb-16">
      <div className="w-full max-w-2xl mb-2 text-center">
        <h1 className="text-3xl font-bold text-white">New Transaction</h1>
        <p className="text-sm text-slate-400 mt-2">
          Record a new transaction to track your spending
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800 w-full max-w-2xl shadow-xl">
        <CardHeader className="border-b border-slate-800/50 pb-6 mb-6">
          <CardTitle className="text-white text-xl">
            Transaction Details
          </CardTitle>
          <CardDescription className="text-slate-400">
            Fill in the details below to add a new record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTransaction} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="flex flex-col gap-2">
                <Label htmlFor="type" className="text-slate-300 font-medium">
                  Type
                </Label>
                <select
                  id="type"
                  name="type"
                  required
                  className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-9 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-full"
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="text-slate-300 font-medium">
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="bg-slate-800 border-slate-700 text-white shadow-sm w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="amount" className="text-slate-300 font-medium">
                  Amount
                </Label>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    className="bg-slate-800 border-slate-700 text-white pl-7 shadow-sm font-medium w-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="accountId"
                  className="text-slate-300 font-medium"
                >
                  Account
                </Label>
                <select
                  id="accountId"
                  name="accountId"
                  required
                  className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-9 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors shadow-sm w-full"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="categoryId"
                  className="text-slate-300 font-medium"
                >
                  Category{" "}
                  <span className="text-slate-500 font-normal">(optional)</span>
                </Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-9 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors shadow-sm w-full"
                >
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon ? `${c.icon} ` : ""}
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Label
                htmlFor="description"
                className="text-slate-300 font-medium"
              >
                Description
              </Label>
              <Input
                id="description"
                name="description"
                required
                placeholder="e.g. Starbucks, Grocery Run"
                className="bg-slate-800 border-slate-700 text-white shadow-sm w-full"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="notes" className="text-slate-300 font-medium">
                Notes{" "}
                <span className="text-slate-500 font-normal">(optional)</span>
              </Label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Additional details..."
                className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm resize-y focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors shadow-sm w-full"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer h-10"
              >
                Save Transaction
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
