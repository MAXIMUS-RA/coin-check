"use client";

import React, { useState, useTransition } from "react";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { editFinancialAccount } from "@/lib/actions";

const ACCOUNT_TYPES = ["BANK", "CREDIT", "CASH", "INVESTMENT"] as const;

type AccountLike = {
  id: string;
  name: string;
  type: (typeof ACCOUNT_TYPES)[number];
  balance: number;
  currency: string;
};

export default function FinancialAccountEdit({ account }: { account: AccountLike }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await editFinancialAccount(account.id, formData);
        setOpen(false);
        toast.success("Account updated successfully!");
      } catch {
        toast.error("Failed to update account.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-slate-200 border-slate-700 bg-slate-800 hover:bg-slate-700"
          title="Edit account"
          onClick={(e) => e.stopPropagation()}
        >
          <SquarePen className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white p-0">
        <Card className="bg-transparent border-0 w-full shadow-xl">
          <CardHeader className="border-b border-slate-800/50 pb-6">
            <CardTitle className="text-white text-xl">Edit Account</CardTitle>
            <CardDescription className="text-slate-400">
              Update account information and current balance.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form action={handleEdit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-name" className="text-slate-300 font-medium">
                  Account Name
                </Label>
                <Input
                  id="edit-account-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={account.name}
                  className="bg-slate-800 border-slate-700 text-white shadow-sm w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-type" className="text-slate-300 font-medium">
                  Account Type
                </Label>
                <select
                  id="edit-account-type"
                  name="type"
                  required
                  defaultValue={account.type}
                  className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-full"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-account-balance" className="text-slate-300 font-medium">
                    Balance
                  </Label>
                  <Input
                    id="edit-account-balance"
                    name="balance"
                    type="number"
                    step="0.01"
                    defaultValue={account.balance}
                    className="bg-slate-800 border-slate-700 text-white shadow-sm w-full font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-account-currency" className="text-slate-300 font-medium">
                    Currency
                  </Label>
                  <Input
                    id="edit-account-currency"
                    name="currency"
                    type="text"
                    maxLength={3}
                    defaultValue={account.currency}
                    className="bg-slate-800 border-slate-700 text-white shadow-sm w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800 mt-4">
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
