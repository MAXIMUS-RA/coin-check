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
import SubmitBtn from "./SubmitBtn";

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
            <Button
               variant="outline"
               size="sm"
               onClick={(e) => e.stopPropagation()}
               title="Edit transaction"
               className="text-foreground border-input bg-background hover:bg-accent"
            >
               <SquarePen className="size-4" />
            </Button>
         </DialogTrigger>

         <DialogContent className="max-w-2xl bg-card border-border text-card-foreground p-0">
            <Card className="bg-transparent border-0 w-full shadow-xl">
               <CardHeader className="border-b border-border pb-6 mb-6">
                  <CardTitle className="text-xl">Edit Transaction</CardTitle>
                  <CardDescription className="text-muted-foreground">Update your transaction details.</CardDescription>
               </CardHeader>

               <CardContent>
                  <form action={handleEdit} className="flex flex-col gap-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <div className="flex flex-col gap-2">
                           <Label htmlFor="edit-transaction-type" className="text-muted-foreground font-medium">
                              Type
                           </Label>
                           <select
                              id="edit-transaction-type"
                              name="type"
                              required
                              defaultValue={transaction.type}
                              className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                           >
                              <option value="EXPENSE">Expense</option>
                              <option value="INCOME">Income</option>
                              <option value="TRANSFER">Transfer</option>
                           </select>
                        </div>

                        <div className="flex flex-col gap-2">
                           <Label htmlFor="edit-transaction-date" className="text-muted-foreground font-medium">
                              Date
                           </Label>
                           <Input
                              id="edit-transaction-date"
                              name="date"
                              type="date"
                              required
                              defaultValue={toDateInputValue(transaction.date)}
                              className="bg-background border-input text-foreground w-full shadow-sm"
                           />
                        </div>

                        <div className="flex flex-col gap-2">
                           <Label htmlFor="edit-transaction-amount" className="text-muted-foreground font-medium">
                              Amount
                           </Label>
                           <div className="relative w-full">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                              <Input
                                 id="edit-transaction-amount"
                                 name="amount"
                                 type="number"
                                 step="0.01"
                                 min="0.01"
                                 required
                                 defaultValue={transaction.amount}
                                 className="bg-background border-input text-foreground pl-7 font-medium w-full shadow-sm"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col gap-2">
                           <Label htmlFor="edit-transaction-accountId" className="text-muted-foreground font-medium">
                              Account
                           </Label>
                           <select
                              id="edit-transaction-accountId"
                              name="accountId"
                              required
                              defaultValue={transaction.accountId}
                              className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
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
                           <Label htmlFor="edit-transaction-categoryId" className="text-muted-foreground font-medium">
                              Category <span className="text-muted-foreground font-normal">(optional)</span>
                           </Label>
                           <select
                              id="edit-transaction-categoryId"
                              name="categoryId"
                              defaultValue={transaction.categoryId || ""}
                              className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
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
                        <Label htmlFor="edit-transaction-description" className="text-muted-foreground font-medium">
                           Description
                        </Label>
                        <Input
                           id="edit-transaction-description"
                           name="description"
                           required
                           defaultValue={transaction.description}
                           className="bg-background border-input text-foreground w-full shadow-sm"
                        />
                     </div>

                     <div className="flex flex-col gap-2 w-full mb-2">
                        <Label htmlFor="edit-transaction-notes" className="text-muted-foreground font-medium">
                           Notes <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <textarea
                           id="edit-transaction-notes"
                           name="notes"
                           rows={2}
                           defaultValue={transaction.notes || ""}
                           className="bg-background border border-input text-foreground rounded-md px-3 py-2 text-sm resize-y focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                        />
                     </div>

                     <div className="flex justify-end pt-4 border-t border-border">
                        <Button
                           type="button"
                           variant="ghost"
                           className="text-muted-foreground hover:text-foreground mr-2"
                           onClick={() => setOpen(false)}
                        >
                           Cancel
                        </Button>
                        <SubmitBtn label="Update Transaction" pendingLabel="Updating..." />
                     </div>
                  </form>
               </CardContent>
            </Card>
         </DialogContent>
      </Dialog>
   );
}
