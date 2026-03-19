// components/ui/dashboard/FinancialAccountCreate.tsx
"use client"

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { createFinancialAccount } from "@/lib/actions";

const ACCOUNT_TYPES = ["BANK", "CREDIT", "CASH", "INVESTMENT"] as const;

export default function FinancialAccountCreate() {
  const [open, setOpen] = useState(false);

  // Note: If you want to use useActionState to handle error messages or auto-closing, 
  // you need to update createFinancialAccount to return a `{ success: boolean, message: string }`
  // object. But for now, we can manually close it onSubmit or let Server Actions revalidate the page.

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Create Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white p-0">
        <Card className="bg-transparent border-0 w-full shadow-xl">
          <CardHeader className="border-b border-slate-800/50 pb-6">
            <CardTitle className="text-white text-xl">
              Create New Account
            </CardTitle>
            <CardDescription className="text-slate-400">
              Add a new financial account to track your balances.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={async (formData) => {
               await createFinancialAccount(formData);
               setOpen(false); // Close dialog gracefully after server action finishes
            }} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-slate-300 font-medium">
                  Account Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Main Checking, Chase Visa"
                  className="bg-slate-800 border-slate-700 text-white shadow-sm w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="type" className="text-slate-300 font-medium">
                  Account Type
                </Label>
                <select
                  id="type"
                  name="type"
                  required
                  defaultValue="BANK"
                  className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-full"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="balance" className="text-slate-300 font-medium">
                    Initial Balance
                  </Label>
                  <Input
                    id="balance"
                    name="balance"
                    type="number"
                    step="0.01"
                    defaultValue="0"
                    className="bg-slate-800 border-slate-700 text-white shadow-sm w-full font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="currency" className="text-slate-300 font-medium">
                    Currency
                  </Label>
                  <Input
                    id="currency"
                    name="currency"
                    type="text"
                    defaultValue="USD"
                    maxLength={6}
                    className="bg-slate-800 border-slate-700 text-white shadow-sm w-full"
                  />
                </div>
              </div>

               <div className="flex justify-end pt-4 border-t border-slate-800/100 mt-4">
                  <Button type="button" variant="ghost" className="text-slate-400 hover:text-white mr-2" onClick={() => setOpen(false)}>
                     Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                     Create Selected Account
                  </Button>
               </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}