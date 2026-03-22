import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import CategoryCreate from "@/components/ui/dashboard/CategoryCreate";
import CategoryRow from "@/components/ui/dashboard/categoryRow";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
   const session = await auth();

   const categories = await prisma.category.findMany({
      where: { userId: session?.user?.id },
      include: {
         _count: {
            select: { transactions: true },
         },
         transactions: {
            select: {
               id: true,
               account: true,
               description: true,
               date: true,
               amount: true,
               type: true,
            },
         },
      },
   });

   return (
      <div className="p-6 text-foreground">
         <div className=" w-full flex justify-between">
            <div className="mb-6">
               <h1 className="text-2xl font-bold">Categories</h1>
               <p className="text-sm text-muted-foreground mt-1">Manage your expense and income categories</p>
            </div>
            <CategoryCreate />
         </div>
         <Table className="text-foreground">
            <TableCaption className="text-muted-foreground">{categories.length} categories found</TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {categories.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No categories yet. Create one to get started!
                     </TableCell>
                  </TableRow>
               ) : (
                  categories.map((cat) => <CategoryRow key={cat.id} category={cat} />)
               )}
            </TableBody>
         </Table>
      </div>
   );
}
