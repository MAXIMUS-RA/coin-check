import React from "react";
import { Button } from "../button";
import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer h-10"
    >
      {pending ? "Creating..." : "Save Category"}
    </Button>
  );
}
