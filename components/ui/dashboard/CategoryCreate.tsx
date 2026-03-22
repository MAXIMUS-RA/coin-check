"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import SubmitBtn from "./SubmitBtn";
import { toast } from "sonner";
import { createCategory } from "@/lib/actions";

export default function CategoryCreate() {
   const [open, setOpen] = useState(false);

   const [state, formAction] = useActionState(createCategory, null);

   useEffect(() => {
      if (state?.success) {
         setOpen(false);
      }
   }, [state]);
   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">+ Create Category</Button>
         </DialogTrigger>
         <DialogContent className="max-w-md bg-card border-border text-card-foreground p-0">
            <Card className="bg-transparent border-0 w-full shadow-xl">
               <CardHeader className="border-b border-border pb-6">
                  <CardTitle className="text-xl">Create New Category</CardTitle>
                  <CardDescription className="text-muted-foreground">
                     Add a new category to organize your transactions.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  {state?.success === false && <p className="text-red-500 mb-4 text-sm">{state.message}</p>}

                  <form
                     action={async (formData) => {
                        try {
                           await formAction(formData);
                           toast.success("Category created successfully!");
                        } catch {
                           toast.error("Failed to create category. Please try again.");
                        }
                     }}
                     className="flex flex-col gap-5"
                  >
                     <div className="flex flex-col gap-2">
                        <Label htmlFor="type" className="text-muted-foreground font-medium">
                           Transaction Type
                        </Label>
                        <select
                           id="type"
                           name="type"
                           required
                           className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                        >
                           <option value="EXPENSE">Expense</option>
                           <option value="INCOME">Income</option>
                        </select>
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-muted-foreground font-medium">
                           Category Name
                        </Label>
                        <Input
                           id="name"
                           name="name"
                           type="text"
                           required
                           placeholder="e.g. Groceries, Freelance Salary"
                           className="bg-background border-input text-foreground shadow-sm w-full"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                           <Label htmlFor="icon" className="text-muted-foreground font-medium">
                              Icon (Emoji) <span className="text-muted-foreground font-normal">(optional)</span>
                           </Label>
                           <Input
                              id="icon"
                              name="icon"
                              type="text"
                              maxLength={2}
                              placeholder="e.g. 🛒"
                              className="bg-background border-input text-foreground shadow-sm w-full"
                           />
                        </div>

                        <div className="flex flex-col gap-2">
                           <Label htmlFor="color" className="text-muted-foreground font-medium">
                              Color Badge <span className="text-muted-foreground font-normal">(optional)</span>
                           </Label>
                           <div className="flex items-center gap-3">
                              <Input
                                 id="color"
                                 name="color"
                                 type="color"
                                 defaultValue="#3B82F6"
                                 className="p-1 h-9 w-full bg-background border-input cursor-pointer rounded-md"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="pt-4 mt-2 border-t border-border">
                        <SubmitBtn />
                     </div>
                  </form>
               </CardContent>
            </Card>
         </DialogContent>
      </Dialog>
   );
}
