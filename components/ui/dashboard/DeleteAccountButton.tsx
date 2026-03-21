"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteFinancialAccount } from "@/lib/actions";
import { toast } from "sonner";

export default function DeleteAccountButton({ accountId }: { accountId: string }) {
   const [isPending, startTransition] = useTransition();

   const handleDelete = () => {
      startTransition(async () => {
         try {
            await deleteFinancialAccount(accountId);
            toast.success("Account deleted successfully!");
         } catch (error) {
            toast.error("Failed to delete account.");
         }
      });
   };

   return (
      <Button 
         variant="destructive" 
         size="sm" 
         onClick={handleDelete}
         disabled={isPending}
      >
         {isPending ? "Deleting..." : "Delete"}
      </Button>
   );
}