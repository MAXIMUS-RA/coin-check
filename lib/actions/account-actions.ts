"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FinancialAccountSchema } from "@/lib/zod-schemas";

export type AccountActionResult =
  | { success: true; message?: string }
  | { success: false; message: string };

export async function createFinancialAccount(formData: FormData): Promise<AccountActionResult> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const validatedFields = FinancialAccountSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    balance: formData.get("balance") ?? 0,
    currency: formData.get("currency") || "USD",
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return { success: false, message: firstError || "Invalid financial account data" };
  }

  const { name, type, balance, currency } = validatedFields.data;

  try {
    await prisma.financialAccount.create({
      data: {
        name,
        type,
        balance,
        currency,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Error creating financial account:", error);
    return { success: false, message: "Failed to create financial account." };
  }

  revalidatePath("/dashboard/financial-accounts");
  revalidatePath("/dashboard/transactions/create");
  revalidatePath("/dashboard/categories");

  return { success: true, message: "Account created successfully!" };
}

export async function editFinancialAccount(id: string, formData: FormData): Promise<AccountActionResult> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const validatedFields = FinancialAccountSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    balance: formData.get("balance") ?? 0,
    currency: formData.get("currency") || "USD",
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return { success: false, message: firstError || "Invalid financial account data" };
  }

  const { name, type, balance, currency } = validatedFields.data;

  try {
    await prisma.financialAccount.updateMany({
      where: { id, userId: session.user.id },
      data: {
        name,
        type,
        balance,
        currency,
      },
    });
  } catch (error) {
    console.error("Error updating financial account:", error);
    return { success: false, message: "Failed to update financial account." };
  }

  revalidatePath("/dashboard/financial-accounts");
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/transactions/create");
  revalidatePath("/dashboard/categories");

  return { success: true, message: "Account updated successfully!" };
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
