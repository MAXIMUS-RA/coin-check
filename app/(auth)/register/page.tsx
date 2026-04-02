"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/actions";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, undefined);

  return (
    <form action={formAction} className="w-full max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your username"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {state?.message && (
              <div className="flex items-center gap-2 p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in zoom-in duration-300">
                <AlertCircle className="size-4" />
                <span>{state.message}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" type="button" className="w-full sm:w-auto">Cancel</Button>
          <Button type="submit" className="w-full sm:w-auto">Register</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
