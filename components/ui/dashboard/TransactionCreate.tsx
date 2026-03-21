"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { createTransaction } from "@/lib/actions";
import { toast } from "sonner"; 

export default function TransactionCreate({ 
  accounts, 
  categories 
}: { 
  accounts: any[]; 
  categories: any[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ Create</Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-[#0f172a] border-slate-800 text-white p-0">
        <Card className="bg-transparent border-0 w-full shadow-xl">
          <CardHeader className="border-b border-slate-800/50 pb-6 mb-6">
            <CardTitle className="text-white text-xl">Transaction Details</CardTitle>
            <CardDescription className="text-slate-400">
              Fill in the details below to add a new record.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (formData) => {
               try {
                  await createTransaction(formData);
                  setOpen(false); 
                  toast.success("Transaction created successfully!");
               } catch (error) {
                  toast.error("Failed to create transaction.");
               }
            }} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="type" className="text-slate-300 font-medium">Type</Label>
                  <select
                    id="type"
                    name="type"
                    required
                    className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-full"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                    <option value="TRANSFER">Transfer</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="date" className="text-slate-300 font-medium">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="bg-slate-800 border-slate-700 text-white w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="amount" className="text-slate-300 font-medium">Amount</Label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="0.00"
                      className="bg-slate-800 border-slate-700 text-white pl-7 font-medium w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="accountId" className="text-slate-300 font-medium">Account</Label>
                  <select
                    id="accountId"
                    name="accountId"
                    required
                    className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-full"
                  >
                    {accounts.length ? accounts.map((a) => (
                      <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>
                    )) : <option value="">No Accounts Available</option>}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="categoryId" className="text-slate-300 font-medium">
                    Category <span className="text-slate-500 font-normal">(optional)</span>
                  </Label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-full"
                  >
                    <option value="">— None —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon ? `${c.icon} ` : ""}{c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="description" className="text-slate-300 font-medium">Description</Label>
                <Input
                  id="description"
                  name="description"
                  required
                  placeholder="e.g. Starbucks, Grocery Run"
                  className="bg-slate-800 border-slate-700 text-white w-full"
                />
              </div>

              <div className="flex flex-col gap-2 w-full mb-2">
                <Label htmlFor="notes" className="text-slate-300 font-medium">
                  Notes <span className="text-slate-500 font-normal">(optional)</span>
                </Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  placeholder="Additional details..."
                  className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm resize-y focus:ring-1 focus:ring-blue-500 outline-none w-full"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800/100">
                  <Button type="button" variant="ghost" className="text-slate-400 hover:text-white mr-2" onClick={() => setOpen(false)}>
                     Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                     Save Transaction
                  </Button>
               </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}