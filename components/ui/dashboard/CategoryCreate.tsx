"use client";

import { useActionState, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import SubmitBtn from "./SubmitBtn";
import { toast } from "sonner";
import { createCategory } from "@/lib/actions";
import { CUSTOM_CATEGORY, presetsForType } from "@/lib/category-presets";

export default function CategoryCreate() {
   const [open, setOpen] = useState(false);
   const [type, setType] = useState("EXPENSE");
   const [preset, setPreset] = useState(CUSTOM_CATEGORY);
   const [customName, setCustomName] = useState("");
   const [icon, setIcon] = useState("");

   const presets = presetsForType(type);
   const isCustom = preset === CUSTOM_CATEGORY;

   const [state, formAction] = useActionState(createCategory, null);

   useEffect(() => {
      if (state?.success) {
         setOpen(false);
      }
   }, [state?.success]);

   // Reset the suggestion when switching type — the two lists don't overlap.
   function handleTypeChange(nextType: string) {
      setType(nextType);
      setPreset(CUSTOM_CATEGORY);
      setIcon("");
   }

   // Picking a suggestion fills in its emoji too, but the user can still edit it.
   function handlePresetChange(nextPreset: string) {
      setPreset(nextPreset);
      const match = presets.find((p) => p.name === nextPreset);
      if (match) setIcon(match.icon);
   }
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
                           formAction(formData);
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
                           value={type}
                           onChange={(e) => handleTypeChange(e.target.value)}
                           className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                        >
                           <option value="EXPENSE">Expense</option>
                           <option value="INCOME">Income</option>
                        </select>
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label htmlFor="preset" className="text-muted-foreground font-medium">
                           Category Name
                        </Label>
                        <select
                           id="preset"
                           value={preset}
                           onChange={(e) => handlePresetChange(e.target.value)}
                           className="bg-background border border-input text-foreground rounded-md px-3 h-10 text-sm focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-colors w-full"
                        >
                           <option value={CUSTOM_CATEGORY}>✏️ Write my own…</option>
                           <optgroup label={type === "INCOME" ? "Common income" : "Common expenses"}>
                              {presets.map((p) => (
                                 <option key={p.name} value={p.name}>
                                    {p.icon} {p.name}
                                 </option>
                              ))}
                           </optgroup>
                        </select>

                        {isCustom ? (
                           <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              autoFocus
                              value={customName}
                              onChange={(e) => setCustomName(e.target.value)}
                              placeholder="e.g. Groceries, Freelance Salary"
                              className="bg-background border-input text-foreground shadow-sm w-full"
                           />
                        ) : (
                           // A preset is selected — submit its name without an extra field.
                           <input type="hidden" name="name" value={preset} />
                        )}
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
                              value={icon}
                              onChange={(e) => setIcon(e.target.value)}
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
                        <SubmitBtn label="Save Category" pendingLabel="Creating..." className="w-full" />
                     </div>
                  </form>
               </CardContent>
            </Card>
         </DialogContent>
      </Dialog>
   );
}
