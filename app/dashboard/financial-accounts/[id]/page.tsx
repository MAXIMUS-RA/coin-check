import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type DetailFinAccProps = {
   params: Promise<{
      id: string;
   }>;
};

function fmt(amount: number, currency = "USD") {
   return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

async function DetailFinAcc({ params }: DetailFinAccProps) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const { id } = await params;

   const account = await prisma.financialAccount.findFirst({
      where: {
         id,
         userId: session.user.id,
      },
      include: {
         transactions: {
            orderBy: { date: "desc" },
            take: 10,
            include: {
               category: true,
            },
         },
      },
   });

   if (!account) notFound();

   return (
      <div className="space-y-6 p-6 text-foreground">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold">{account.name}</h1>
               <p className="text-sm text-muted-foreground">Account details and latest transactions</p>
            </div>
            <Link href="/dashboard/financial-accounts" className="text-sm text-blue-400 hover:underline">
               Back to accounts
            </Link>
         </div>

         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
               <CardHeader>
                  <CardDescription>Type</CardDescription>
                  <CardTitle>{account.type}</CardTitle>
               </CardHeader>
            </Card>

            <Card>
               <CardHeader>
                  <CardDescription>Currency</CardDescription>
                  <CardTitle>{account.currency}</CardTitle>
               </CardHeader>
            </Card>

            <Card>
               <CardHeader>
                  <CardDescription>Balance</CardDescription>
                  <CardTitle className={account.balance >= 0 ? "text-emerald-400" : "text-red-400"}>
                     {fmt(account.balance, account.currency)}
                  </CardTitle>
               </CardHeader>
            </Card>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>Latest Transactions</CardTitle>
               <CardDescription>Showing the 10 most recent transactions for this account</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {account.transactions.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={4} className="text-center text-muted-foreground">
                              No transactions yet for this account.
                           </TableCell>
                        </TableRow>
                     ) : (
                        account.transactions.map((tx) => (
                           <TableRow key={tx.id}>
                              <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                              <TableCell>{tx.type}</TableCell>
                              <TableCell>{tx.category?.name ?? "Uncategorized"}</TableCell>
                              <TableCell className="text-right">{fmt(tx.amount, account.currency)}</TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </div>
   );
}

export default DetailFinAcc;
