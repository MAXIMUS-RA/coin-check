"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteTransaction } from "@/lib/actions";
import { toast } from "sonner";

export default function DeleteTransactionButton({ transactionId }: { transactionId: string }) {
   const [isPending, startTransition] = useTransition();

   const handleDelete = () => {
      startTransition(async () => {
         try {
            await deleteTransaction(transactionId);
            toast.success("Transaction deleted successfully!");
         } catch (error) {
            toast.error("Failed to delete transaction.");
         }
      });
   };

   return (
      <Button
         variant="destructive"
         size="sm"
         onClick={handleDelete}
         disabled={isPending}
         className="h-8 shadow-sm cursor-pointer"
      >
         {isPending ? "..." : "Delete"}
      </Button>
   );
}
