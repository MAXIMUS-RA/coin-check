import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function CategoriesPage() {
  const session = await auth();
  
  const categories = await prisma.category.findMany({
    
    include: {
      _count: {
        select: { transactions: true, budgets: true },
      },
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your expense and income categories
        </p>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-400">
                No categories yet. Create one to get started!
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="text-xl">{cat.icon || "📁"}</TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    cat.type === "EXPENSE" ? "bg-red-900/30 text-red-300" :
                    cat.type === "INCOME" ? "bg-green-900/30 text-green-300" :
                    "bg-blue-900/30 text-blue-300"
                  }`}>
                    {cat.type}
                  </span>
                </TableCell>
                <TableCell>{cat._count.transactions}</TableCell>
                <TableCell>{cat._count.budgets}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}