import { Button } from "@/components/ui/button";
import CategoryCreate from "@/components/ui/dashboard/CategoryCreate";
import CategoryRow from "@/components/ui/dashboard/categoryRow";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { transactions: true, budgets: true },
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
    <div className="p-6">
      <div className=" w-full flex justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your expense and income categories
          </p>
        </div>
        <CategoryCreate />
      </div>
      <Table className="text-white">
        <TableCaption className="text-slate-400">
          {categories.length} categories found
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Icon</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Type</TableHead>
            <TableHead className="text-white">Transactions</TableHead>
            <TableHead className="text-white">Budgets</TableHead>
            <TableHead className="text-white">Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-slate-400">
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
