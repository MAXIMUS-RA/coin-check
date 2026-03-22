"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { toast } from "sonner"; 
import { createTransaction } from "@/lib/actions";
import SubmitBtn from "./SubmitBtn";

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
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">+ Create</Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-card border-border text-card-foreground p-0">
        <Card className="bg-transparent border-0 w-full shadow-xl">
          <CardHeader className="border-b border-border pb-6 mb-6">
            <CardTitle className="text-xl">Transaction Details</CardTitle>
            <CardDescription className="text-muted-foreground">
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
                  <Label htmlFor="create-transaction-type" className="text-muted-foreground font-medium">Type</Label>
                  <select
                    id="create-transaction-type"
                    name="type"
                    required
                    className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                    <option value="TRANSFER">Transfer</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="create-transaction-date" className="text-muted-foreground font-medium">Date</Label>
                  <Input
                    id="create-transaction-date"
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="bg-background border-input text-foreground w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="create-transaction-amount" className="text-muted-foreground font-medium">Amount</Label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="create-transaction-amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="0.00"
                      className="bg-background border-input text-foreground pl-7 font-medium w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="create-transaction-accountId" className="text-muted-foreground font-medium">Account</Label>
                  <select
                    id="create-transaction-accountId"
                    name="accountId"
                    required
                    className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                  >
                    {accounts.length ? accounts.map((a) => (
                      <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>
                    )) : <option value="">No Accounts Available</option>}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="create-transaction-categoryId" className="text-muted-foreground font-medium">
                    Category <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <select
                    id="create-transaction-categoryId"
                    name="categoryId"
                    className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
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
                <Label htmlFor="create-transaction-description" className="text-muted-foreground font-medium">Description</Label>
                <Input
                  id="create-transaction-description"
                  name="description"
                  required
                  placeholder="e.g. Starbucks, Grocery Run"
                  className="bg-background border-input text-foreground w-full"
                />
              </div>

              <div className="flex flex-col gap-2 w-full mb-2">
                <Label htmlFor="create-transaction-notes" className="text-muted-foreground font-medium">
                  Notes <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <textarea
                  id="create-transaction-notes"
                  name="notes"
                  rows={2}
                  placeholder="Additional details..."
                  className="bg-background border border-input text-foreground rounded-md px-3 py-2 text-sm resize-y focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                  <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground mr-2" onClick={() => setOpen(false)}>
                     Cancel
                  </Button>
                  <SubmitBtn />
               </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}