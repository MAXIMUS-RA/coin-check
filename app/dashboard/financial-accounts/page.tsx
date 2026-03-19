import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createFinancialAccount, deleteFinancialAccount } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Wallet, CreditCard, Landmark } from "lucide-react";
import FinancialAccountCreate from "@/components/ui/dashboard/FinancialAccountCreate";

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
         {/* Top Header Row */}
         <div className="w-full flex justify-between items-center mb-6">
            <div>
               <h1 className="text-2xl font-bold text-white">Accounts</h1>
               <p className="text-sm text-slate-400 mt-1">Manage your wallets, bank accounts, and cards</p>
            </div>

            {/* Replaced ugly inline form with shiny new Dialog Button */}
            <div>
               <FinancialAccountCreate />
            </div>
         </div> {/* <--- CLOSE THE TOP ROW FLEX DIV HERE */}

         {/* Stats Cards Row */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"> {/* Changed my-6 to mb-6 */}
            <Card className="bg-slate-900 border-slate-800 text-white gap-3">
                  <CardHeader>
                     <CardDescription className="text-slate-400 flex items-center gap-1.5">
                        <Wallet className="size-4 text-emerald-400" /> Total Balance
                     </CardDescription>
                     <CardTitle className="text-2xl font-bold text-emerald-400">{fmt(totalBalance)}</CardTitle>
                  </CardHeader>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-white gap-3">
                  <CardHeader>
                     <CardDescription className="text-slate-400 flex items-center gap-1.5">
                        <CreditCard className="size-4 text-red-400" /> Credit Debt
                     </CardDescription>
                     <CardTitle className="text-2xl font-bold text-red-400">{fmt(debt)}</CardTitle>
                  </CardHeader>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-white gap-3">
                  <CardHeader>
                     <CardDescription className="text-slate-400 flex items-center gap-1.5">
                        <Landmark className="size-4 text-blue-400" /> Accounts
                     </CardDescription>
                     <CardTitle className="text-2xl font-bold text-blue-400">{accounts.length}</CardTitle>
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
