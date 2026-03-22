"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FinancialAccountSchema } from "@/lib/zod-schemas";

export async function createFinancialAccount(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const validatedFields = FinancialAccountSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    balance: formData.get("balance") || 0,
    currency: formData.get("currency") || "USD",
  });

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten());
    throw new Error("Invalid financial account data");
  }

  const { name, type, balance, currency } = validatedFields.data;

  await prisma.financialAccount.create({
    data: {
      name,
      type,
      balance,
      currency,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/financial-accounts");
  revalidatePath("/dashboard/transactions/create");
  revalidatePath("/dashboard/categories");
}

export async function editFinancialAccount(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const validatedFields = FinancialAccountSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    balance: formData.get("balance") || 0,
    currency: formData.get("currency") || "USD",
  });

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten());
    throw new Error("Invalid financial account data");
  }

  const { name, type, balance, currency } = validatedFields.data;

  await prisma.financialAccount.updateMany({
    where: { id, userId: session.user.id },
    data: {
      name,
      type,
      balance,
      currency,
    },
  });

  revalidatePath("/dashboard/financial-accounts");
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/transactions/create");
  revalidatePath("/dashboard/categories");
}

export async function deleteFinancialAccount(id: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await prisma.financialAccount.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/financial-accounts");
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/transactions/create");
  revalidatePath("/dashboard/categories");
}
