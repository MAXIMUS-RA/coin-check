"use client";

import React, { useActionState, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import SubmitBtn from "./SubmitBtn";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { editCategory } from "@/lib/actions";

export default function CategoryEdit({ category }: { category: CategoryWithTransactions }) {
   const [open, setOpen] = useState(false);
   const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
   };

   const updateCategoryWithId = editCategory.bind(null, category.id);
   const [state, formAction] = useActionState(updateCategoryWithId, {
      success: false,
      message: "",
   });

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button
               variant="outline"
               size="sm"
               onClick={handleEditClick}
               className="text-foreground border-input bg-background hover:bg-accent"
            >
               <SquarePen className="w-4 h-4" />
            </Button>
         </DialogTrigger>
         <DialogContent
            className="max-w-md bg-card border-border text-card-foreground p-0 shadow-lg"
            onClick={(e) => e.stopPropagation()}
         >
            <Card className="bg-transparent border-0 w-full shadow-xl">
               <CardHeader className="border-b border-border pb-6">
                  <CardTitle className="text-xl">Edit Category</CardTitle>
                  <CardDescription className="text-muted-foreground">Update your category details.</CardDescription>
               </CardHeader>
               <CardContent>
                  {state?.success === false && state.message && (
                     <p className="text-red-500 mb-4 text-sm font-medium">{state.message}</p>
                  )}

                  <form
                     action={async (formData) => {
                        await formAction(formData);
                        toast.success("Category updated successfully!");
                     }}
                     className="flex flex-col gap-5 pt-4"
                  >
                     <div className="flex flex-col gap-2">
                        <Label htmlFor="type" className="text-muted-foreground font-medium">
                           Transaction Type
                        </Label>
                        <select
                           id="type"
                           name="type"
                           required
                           defaultValue={category.type} // Set Default Value
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
                           defaultValue={category.name} // Set default value
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
                              defaultValue={category.icon || ""} // Set default value
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
                                 defaultValue={category.color || "#3B82F6"} // Set Default Value
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
