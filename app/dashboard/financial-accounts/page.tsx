import { auth } from "@/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Wallet, CreditCard, Landmark } from "lucide-react";
import FinancialAccountCreate from "@/components/ui/dashboard/FinancialAccountCreate";
import FinancialAccountRow from "@/components/ui/dashboard/FinancialAccountRow";

function fmt(amount: number, currency = "USD") {
   return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

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
      <div className="p-4 text-foreground sm:p-6">
         <div className="mb-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
               <p className="text-sm text-muted-foreground mt-1">Manage your wallets, bank accounts, and cards</p>
            </div>

            <div>
               <FinancialAccountCreate />
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-card border-border text-card-foreground gap-3">
               <CardHeader>
                  <CardDescription className="text-muted-foreground flex items-center gap-1.5">
                     <Wallet className="size-4 text-emerald-400" /> Total Balance
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-emerald-400">{fmt(totalBalance)}</CardTitle>
               </CardHeader>
            </Card>

            <Card className="bg-card border-border text-card-foreground gap-3">
               <CardHeader>
                  <CardDescription className="text-muted-foreground flex items-center gap-1.5">
                     <CreditCard className="size-4 text-red-400" /> Credit Debt
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-red-400">{fmt(debt)}</CardTitle>
               </CardHeader>
            </Card>

            <Card className="bg-card border-border text-card-foreground gap-3">
               <CardHeader>
                  <CardDescription className="text-muted-foreground flex items-center gap-1.5">
                     <Landmark className="size-4 text-blue-400" /> Accounts
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-blue-400">{accounts.length}</CardTitle>
               </CardHeader>
            </Card>
         </div>

         <Table className="text-foreground">
            <TableCaption className="text-muted-foreground">
               {accounts.length} account{accounts.length === 1 ? "" : "s"} found
            </TableCaption>

            <TableHeader>
               <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>

            <TableBody>
               {accounts.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No accounts yet. Create your first account above.
                     </TableCell>
                  </TableRow>
               ) : (
                  accounts.map((acc) => (
                     <FinancialAccountRow account={acc} key={acc.id}></FinancialAccountRow>
                  ))
               )}
            </TableBody>
         </Table>
      </div>
   );
}
