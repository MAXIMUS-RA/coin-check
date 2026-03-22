"use client";

import React, { useState, useTransition } from "react";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { editTransaction } from "@/lib/actions";

function toDateInputValue(value: Date | string) {
   const date = new Date(value);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
}

type TransactionLike = {
   id: string;
   amount: number;
   type: "INCOME" | "EXPENSE" | "TRANSFER";
   description: string;
   accountId: string;
   categoryId: string | null;
   date: Date | string;
   notes: string | null;
};

type OptionLike = {
   id: string;
   name: string;
   currency?: string;
   icon?: string | null;
};

export default function TransactionEdit({
   transaction,
   accounts,
   categories,
}: {
   transaction: TransactionLike;
   accounts: OptionLike[];
   categories: OptionLike[];
}) {
   const [open, setOpen] = useState(false);
   const [isPending, startTransition] = useTransition();

   const handleEdit = (formData: FormData) => {
      startTransition(async () => {
         try {
            await editTransaction(transaction.id, formData);
            setOpen(false);
            toast.success("Transaction updated successfully!");
         } catch {
            toast.error("Failed to update transaction.");
         }
      });
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()} title="Edit transaction" className="text-slate-200 border-slate-700 bg-slate-800 hover:bg-slate-700">
               <SquarePen className="size-4" />
            </Button>
         </DialogTrigger>

         <DialogContent className="max-w-2xl bg-[#0f172a] border-slate-800 text-white p-0">
            <Card className="bg-transparent border-0 w-full shadow-xl">
               <CardHeader className="border-b border-slate-800/50 pb-6 mb-6">
                  <CardTitle className="text-white text-xl">Edit Transaction</CardTitle>
                  <CardDescription className="text-slate-400">Update your transaction details.</CardDescription>
               </CardHeader>

               <CardContent>
                  <form action={handleEdit} className="flex flex-col gap-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <div className="flex flex-col gap-2">
                           <Label htmlFor="edit-type" className="text-slate-300 font-medium">
                              Type
                           </Label>
                           <select
                              id="edit-type"
                              name="type"
                              required
                              defaultValue={transaction.type}
                              className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-full"
                           >
                              <option value="EXPENSE">Expense</option>
                              <option value="INCOME">Income</option>
                              <option value="TRANSFER">Transfer</option>
                           </select>
                        </div>

                        <div className="flex flex-col gap-2">
                           <Label htmlFor="edit-date" className="text-slate-300 font-medium">
                              Date
                           </Label>
                           <Input
                              id="edit-date"
                              name="date"
                              type="date"
                              required
                              defaultValue={toDateInputValue(transaction.date)}
                              className="bg-slate-800 border-slate-700 text-white w-full"
                           />
                        </div>

                        <div className="flex flex-col gap-2">
                           <Label htmlFor="edit-amount" className="text-slate-300 font-medium">
                              Amount
                           </Label>
                           <div className="relative w-full">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                              <Input
                                 id="edit-amount"
                                 name="amount"
                                 type="number"
                                 step="0.01"
                                 min="0.01"
                                 required
                                 defaultValue={transaction.amount}
                                 className="bg-slate-800 border-slate-700 text-white pl-7 font-medium w-full"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col gap-2">
                           <Label htmlFor="edit-accountId" className="text-slate-300 font-medium">
                              Account
                           </Label>
                           <select
                              id="edit-accountId"
                              name="accountId"
                              required
                              defaultValue={transaction.accountId}
                              className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-full"
                           >
                              {accounts.length ? (
                                 accounts.map((a) => (
                                    <option key={a.id} value={a.id}>
                                       {a.name} {a.currency ? `(${a.currency})` : ""}
                                    </option>
                                 ))
                              ) : (
                                 <option value="">No Accounts Available</option>
                              )}
                           </select>
                        </div>

                        <div className="flex flex-col gap-2">
                           <Label htmlFor="edit-categoryId" className="text-slate-300 font-medium">
                              Category <span className="text-slate-500 font-normal">(optional)</span>
                           </Label>
                           <select
                              id="edit-categoryId"
                              name="categoryId"
                              defaultValue={transaction.categoryId || ""}
                              className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-full"
                           >
                              <option value="">- None -</option>
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
                        <Label htmlFor="edit-description" className="text-slate-300 font-medium">
                           Description
                        </Label>
                        <Input
                           id="edit-description"
                           name="description"
                           required
                           defaultValue={transaction.description}
                           className="bg-slate-800 border-slate-700 text-white w-full"
                        />
                     </div>

                     <div className="flex flex-col gap-2 w-full mb-2">
                        <Label htmlFor="edit-notes" className="text-slate-300 font-medium">
                           Notes <span className="text-slate-500 font-normal">(optional)</span>
                        </Label>
                        <textarea
                           id="edit-notes"
                           name="notes"
                           rows={2}
                           defaultValue={transaction.notes || ""}
                           className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm resize-y focus:ring-1 focus:ring-blue-500 outline-none w-full"
                        />
                     </div>

                     <div className="flex justify-end pt-4 border-t border-slate-800">
                        <Button
                           type="button"
                           variant="ghost"
                           className="text-slate-400 hover:text-white mr-2"
                           onClick={() => setOpen(false)}
                        >
                           Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
                           {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                     </div>
                  </form>
               </CardContent>
            </Card>
         </DialogContent>
      </Dialog>
   );
}
