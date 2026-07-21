import React from "react";
import { Button } from "../button";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export default function SubmitBtn({
   label = "Save",
   pendingLabel = "Saving...",
   className,
}: {
   label?: string;
   pendingLabel?: string;
   className?: string;
}) {
   const { pending } = useFormStatus();

   return (
      <Button
         type="submit"
         disabled={pending}
         className={cn("bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer h-10", className)}
      >
         {pending ? pendingLabel : label}
      </Button>
   );
}
