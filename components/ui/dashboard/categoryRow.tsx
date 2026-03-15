"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../button";
import { SquarePen, Trash } from "lucide-react";
import { deleteCategory } from "@/lib/actions";
import CategoryEdit from "./CategoryEdit";
import { useState } from "react";

export default function CategoryRow({ category }: { category: CategoryWithTransactions }) {
   const totalAmount = category.transactions.reduce((acc, val) => acc + val.amount, 0);

   const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirm("Are you sure you want to delete this category?")) {
         await deleteCategory(category.id);
      }
   };

   const [isDetailsOpen, setIsDetailsOpen] = useState(false);

   return (
      <>
         <TableRow
            className="cursor-pointer hover:bg-slate-800/50 transition-colors"
            onClick={() => setIsDetailsOpen(true)}
         >
            <TableCell className="text-xl">{category.icon || "📁"}</TableCell>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell>
               <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                     category.type === "EXPENSE"
                        ? "bg-red-900/30 text-red-300"
                        : category.type === "INCOME"
                          ? "bg-green-900/30 text-green-300"
                          : "bg-blue-900/30 text-blue-300"
                  }`}
               >
                  {category.type}
               </span>
            </TableCell>
            <TableCell>{category._count.transactions}</TableCell>
            <TableCell>{category._count.budgets}</TableCell>
            <TableCell className="font-medium">${totalAmount.toFixed(2)}</TableCell>

            <TableCell className="text-right ">
               <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <CategoryEdit category={category} />
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                     <Trash />
                  </Button>
               </div>
            </TableCell>
         </TableRow>
         <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-2xl bg-slate-900 text-white border-slate-700">
               <DialogHeader>
                  <DialogTitle>Transactions for {category.name}</DialogTitle>
               </DialogHeader>

               <div className="mt-4 max-h-[60vh] overflow-y-auto">
                  {category.transactions.length === 0 ? (
                     <p className="text-slate-400">No transactions recorded for this category yet.</p>
                  ) : (
                     <ul className="space-y-3">
                        {category.transactions.map((tx) => (
                           <li key={tx.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-md">
                              <div>
                                 <p className="font-medium">{tx.description}</p>
                                 <p className="text-xs text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                              </div>
                              <span
                                 className={`font-semibold ${tx.type === "EXPENSE" ? "text-red-400" : "text-green-400"}`}
                              >
                                 {tx.type === "EXPENSE" ? "-" : "+"}${tx.amount.toFixed(2)}
                              </span>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
