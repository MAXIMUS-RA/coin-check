"use server";

import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { hash } from "bcryptjs";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  console.log(existingUser);

  if (existingUser) {
    throw new Error("User alredy exist");
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  redirect("/login");
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as "INCOME" | "EXPENSE" | "TRANSFER";
  const description = formData.get("description") as string;
  const accountId = formData.get("accountId") as string;
  const categoryId = formData.get("categoryId") as string | null;
  const date = formData.get("date") as string;
  const notes = formData.get("notes") as string | null;

  try {
    await prisma.transaction.create({
      data: {
        amount,
        type,
        description,
        accountId,
        categoryId: categoryId || null,
        date: new Date(date),
        notes: notes || null,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }

  redirect("/dashboard/transactions");
}
