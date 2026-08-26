"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { createFinancialAccount } from "@/lib/actions";
import { toast } from "sonner";
import SubmitBtn from "./SubmitBtn";
import { CURRENCIES, DEFAULT_CURRENCY, currencyOptionLabel } from "@/lib/currencies";

const ACCOUNT_TYPES = ["BANK", "CREDIT", "CASH", "INVESTMENT"] as const;

export default function FinancialAccountCreate() {
   const [open, setOpen] = useState(false);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">+ Create Account</Button>
         </DialogTrigger>
         <DialogContent className="max-w-md bg-card border-border text-card-foreground p-0">
            <Card className="bg-transparent border-0 w-full shadow-xl">
               <CardHeader className="border-b border-border pb-6">
                  <CardTitle className="text-xl">Create New Account</CardTitle>
                  <CardDescription className="text-muted-foreground">
                     Add a new financial account to track your balances.
                  </CardDescription>
               </CardHeader>
               <CardContent className="pt-6">
                  <form
                     action={async (formData) => {
                        const result = await createFinancialAccount(formData);
                        if (result.success) {
                           setOpen(false);
                           toast.success(result.message || "Account created successfully!");
                        } else {
                           toast.error(result.message);
                        }
                     }}
                     className="flex flex-col gap-5"
                  >
                     <div className="flex flex-col gap-2">
                        <Label htmlFor="create-account-name" className="text-muted-foreground font-medium">
                           Account Name
                        </Label>
                        <Input
                           id="create-account-name"
                           name="name"
                           type="text"
                           required
                           placeholder="e.g. Main Checking, Chase Visa"
                           className="bg-background border-input text-foreground shadow-sm w-full"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label htmlFor="create-account-type" className="text-muted-foreground font-medium">
                           Account Type
                        </Label>
                        <select
                           id="create-account-type"
                           name="type"
                           required
                           defaultValue="BANK"
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
                           <Label htmlFor="create-account-balance" className="text-muted-foreground font-medium">
                              Initial Balance
                           </Label>
                           <Input
                              id="create-account-balance"
                              name="balance"
                              type="number"
                              step="0.01"
                              defaultValue="0"
                              className="bg-background border-input text-foreground shadow-sm w-full font-medium"
                           />
                        </div>

                        <div className="flex flex-col gap-2">
                           <Label htmlFor="create-account-currency" className="text-muted-foreground font-medium">
                              Currency
                           </Label>
                           <select
                              id="create-account-currency"
                              name="currency"
                              required
                              defaultValue={DEFAULT_CURRENCY}
                              className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                           >
                              {CURRENCIES.map((c) => (
                                 <option key={c.code} value={c.code}>
                                    {currencyOptionLabel(c)}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>

                     <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
                        <Button
                           type="button"
                           variant="ghost"
                           className="text-muted-foreground hover:text-foreground"
                           onClick={() => setOpen(false)}
                        >
                           Cancel
                        </Button>
                        <SubmitBtn label="Save Account" pendingLabel="Creating..." />
                     </div>
                  </form>
               </CardContent>
            </Card>
         </DialogContent>
      </Dialog>
   );
}
