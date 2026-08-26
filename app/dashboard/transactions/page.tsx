import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
   TrendingUp,
   TrendingDown,
   ArrowLeftRight,
   Receipt,
   ChevronLeft,
   ChevronRight,
   X,
} from "lucide-react";
import {
   getPaginatedUserTransactions,
   getTransactionStats,
   getUserAccounts,
   getUserCategories,
} from "@/lib/data/transactions";
import TransactionCreate from "@/components/ui/dashboard/TransactionCreate";
import DeleteTransactionButton from "@/components/ui/dashboard/DeleteTransactionButton";
import TransactionEdit from "@/components/ui/dashboard/TransactionEdit";

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
   return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function fmtDate(date: Date) {
   return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
   }).format(date);
}

export default async function TransactionsPage({
   searchParams,
}: {
   searchParams?: Promise<{ page?: string; categoryId?: string }>;
}) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const params = await searchParams;
   const currentPage = Math.max(1, Number(params?.page) || 1);
   const selectedCategoryId = params?.categoryId;
   const pageSize = 10;

   const [paginatedData, stats, accounts, categories] = await Promise.all([
      getPaginatedUserTransactions({
         userId: session.user.id,
         page: currentPage,
         pageSize,
         categoryId: selectedCategoryId,
      }),
      getTransactionStats(session.user.id),
      getUserAccounts(session.user.id),
      getUserCategories(session.user.id),
   ]);

   const { transactions, totalCount, totalPages } = paginatedData;
   const { totalIncome, totalExpenses, net } = stats;

   const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

   const createPageUrl = (pageNumber: number) => {
      const urlParams = new URLSearchParams();
      if (pageNumber > 1) urlParams.set("page", pageNumber.toString());
      if (selectedCategoryId) urlParams.set("categoryId", selectedCategoryId);
      const query = urlParams.toString();
      return `/dashboard/transactions${query ? `?${query}` : ""}`;
   };

   return (
      <div className="min-h-screen bg-background p-4 text-foreground sm:p-6">
         <div className="mb-2 flex w-full flex-col gap-3 sm:mb-0 sm:flex-row sm:items-start sm:justify-between">
            <div className="mb-6">
               <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
               <p className="text-sm text-muted-foreground mt-1">Your full transaction history</p>
            </div>
            <div>
               <TransactionCreate accounts={accounts} categories={categories} />
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-border text-card-foreground gap-3">
               <CardHeader>
                  <CardDescription className="text-muted-foreground flex items-center gap-1.5">
                     <TrendingUp className="size-4 text-emerald-400" /> Total Income
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-emerald-400">{fmt(totalIncome)}</CardTitle>
               </CardHeader>
            </Card>

            <Card className="bg-card border-border text-card-foreground gap-3">
               <CardHeader>
                  <CardDescription className="text-muted-foreground flex items-center gap-1.5">
                     <TrendingDown className="size-4 text-red-400" /> Total Expenses
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-red-400">{fmt(totalExpenses)}</CardTitle>
               </CardHeader>
            </Card>

            <Card className="bg-card border-border text-card-foreground gap-3">
               <CardHeader>
                  <CardDescription className="text-muted-foreground flex items-center gap-1.5">
                     <Receipt className="size-4 text-indigo-400" /> Net Balance
                  </CardDescription>
                  <CardTitle className={`text-2xl font-bold ${net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                     {fmt(net)}
                  </CardTitle>
               </CardHeader>
            </Card>
         </div>

         {selectedCategory && (
            <div className="mb-4 flex items-center gap-2">
               <span className="text-sm text-muted-foreground">Filtered by category:</span>
               <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-foreground">
                  {selectedCategory.icon && <span>{selectedCategory.icon}</span>}
                  {selectedCategory.name}
                  <Link
                     href="/dashboard/transactions"
                     className="ml-1 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
                     title="Clear filter"
                  >
                     <X className="size-3" />
                  </Link>
               </span>
            </div>
         )}

         <Card className="bg-card border-border gap-0 overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
               <CardTitle>All Transactions</CardTitle>
               <CardDescription className="text-muted-foreground">
                  {totalCount} transaction{totalCount !== 1 ? "s" : ""} found
               </CardDescription>
            </CardHeader>

            {transactions.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Receipt className="size-12 mb-3 opacity-30" />
                  <p className="font-medium">No transactions found</p>
                  <p className="text-sm mt-1">
                     {selectedCategoryId ? "Try clearing the category filter." : "Add your first transaction to get started."}
                  </p>
               </div>
            ) : (
               <>
                  <div className="overflow-x-auto">
                     <table className="w-full min-w-190 text-sm">
                        <thead>
                           <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
                              <th className="text-left px-6 py-3 font-medium">Description</th>
                              <th className="text-left px-6 py-3 font-medium">Category</th>
                              <th className="text-left px-6 py-3 font-medium">Account</th>
                              <th className="text-left px-6 py-3 font-medium">Date</th>
                              <th className="text-left px-6 py-3 font-medium">Type</th>
                              <th className="text-right px-6 py-3 font-medium">Amount</th>
                              <th className="text-right px-6 py-3 font-medium">Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           {transactions.map((tx) => {
                              const { label, cls, Icon } = TYPE_STYLES[tx.type];
                              return (
                                 <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                       <p className="font-medium text-foreground">{tx.description}</p>
                                       {tx.notes && (
                                          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{tx.notes}</p>
                                       )}
                                    </td>
                                    <td className="px-6 py-4 text-foreground/85">
                                       {tx.category ? (
                                          <Link
                                             href={`/dashboard/transactions?categoryId=${tx.categoryId}`}
                                             className="inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                                             title="Filter by this category"
                                          >
                                             {tx.category.icon && <span>{tx.category.icon}</span>}
                                             {tx.category.name}
                                          </Link>
                                       ) : (
                                          <span className="text-muted-foreground">—</span>
                                       )}
                                    </td>
                                    <td className="px-6 py-4 text-foreground/85">{tx.account.name}</td>
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{fmtDate(tx.date)}</td>
                                    <td className="px-6 py-4">
                                       <span
                                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}
                                       >
                                          <Icon className="size-3" />
                                          {label}
                                       </span>
                                    </td>
                                    <td
                                       className={`px-6 py-4 text-right font-semibold tabular-nums ${
                                          tx.type === "INCOME"
                                             ? "text-emerald-400"
                                             : tx.type === "EXPENSE"
                                             ? "text-red-400"
                                             : "text-blue-400"
                                       }`}
                                    >
                                       {tx.type === "EXPENSE" ? "−" : "+"}
                                       {fmt(tx.amount, tx.account.currency)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <div className="flex items-center justify-end gap-2">
                                          <TransactionEdit transaction={tx} accounts={accounts} categories={categories} />
                                          <DeleteTransactionButton transactionId={tx.id} />
                                       </div>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border px-6 py-4">
                     <p className="text-xs text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium text-foreground">
                           {(currentPage - 1) * pageSize + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-foreground">
                           {Math.min(currentPage * pageSize, totalCount)}
                        </span>{" "}
                        of <span className="font-medium text-foreground">{totalCount}</span> transactions
                     </p>

                     <div className="flex items-center gap-2">
                        {currentPage > 1 ? (
                           <Link href={createPageUrl(currentPage - 1)}>
                              <Button variant="outline" size="sm" className="h-8 gap-1 border-input">
                                 <ChevronLeft className="size-4" />
                                 Previous
                              </Button>
                           </Link>
                        ) : (
                           <Button variant="outline" size="sm" className="h-8 gap-1 border-input opacity-50" disabled>
                              <ChevronLeft className="size-4" />
                              Previous
                           </Button>
                        )}

                        <span className="text-xs text-muted-foreground px-2">
                           Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
                           <span className="font-medium text-foreground">{totalPages}</span>
                        </span>

                        {currentPage < totalPages ? (
                           <Link href={createPageUrl(currentPage + 1)}>
                              <Button variant="outline" size="sm" className="h-8 gap-1 border-input">
                                 Next
                                 <ChevronRight className="size-4" />
                              </Button>
                           </Link>
                        ) : (
                           <Button variant="outline" size="sm" className="h-8 gap-1 border-input opacity-50" disabled>
                              Next
                              <ChevronRight className="size-4" />
                           </Button>
                        )}
                     </div>
                  </div>
               </>
            )}
         </Card>
      </div>
   );
}

