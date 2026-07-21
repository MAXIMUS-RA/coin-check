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
import SubmitBtn from "./SubmitBtn";
import { CURRENCIES, currencyOptionLabel } from "@/lib/currencies";

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
          className="h-8 text-foreground border-input bg-background hover:bg-accent"
          title="Edit account"
          onClick={(e) => e.stopPropagation()}
        >
          <SquarePen className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-card border-border text-card-foreground p-0">
        <Card className="bg-transparent border-0 w-full shadow-xl">
          <CardHeader className="border-b border-border pb-6">
            <CardTitle className="text-xl">Edit Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Update account information and current balance.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form action={handleEdit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-name" className="text-muted-foreground font-medium">
                  Account Name
                </Label>
                <Input
                  id="edit-account-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={account.name}
                  className="bg-background border-input text-foreground shadow-sm w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-type" className="text-muted-foreground font-medium">
                  Account Type
                </Label>
                <select
                  id="edit-account-type"
                  name="type"
                  required
                  defaultValue={account.type}
                  className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
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
                  <Label htmlFor="edit-account-balance" className="text-muted-foreground font-medium">
                    Balance
                  </Label>
                  <Input
                    id="edit-account-balance"
                    name="balance"
                    type="number"
                    step="0.01"
                    defaultValue={account.balance}
                    className="bg-background border-input text-foreground shadow-sm w-full font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-account-currency" className="text-muted-foreground font-medium">
                    Currency
                  </Label>
                  <select
                    id="edit-account-currency"
                    name="currency"
                    required
                    defaultValue={account.currency}
                    className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                  >
                    {/* Keep any legacy value selectable so editing never silently changes it */}
                    {!CURRENCIES.some((c) => c.code === account.currency) && (
                      <option value={account.currency}>{account.currency}</option>
                    )}
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {currencyOptionLabel(c)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground mr-2"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <SubmitBtn label="Update Account" pendingLabel="Updating..." />
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
