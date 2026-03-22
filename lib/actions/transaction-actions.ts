"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionSchema } from "@/lib/zod-schemas";

export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rawData = {
    amount: formData.get("amount"),
    type: formData.get("type"),
    description: formData.get("description"),
    accountId: formData.get("accountId"),
    categoryId: formData.get("categoryId") || null,
    date: formData.get("date"),
    notes: formData.get("notes") || null,
  };

  const validatedFields = TransactionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    throw new Error("Invalid transaction data provided");
  }

  const { amount, type, description, accountId, categoryId, date, notes } = validatedFields.data;

  try {
    const balanceAdjustment = type === "EXPENSE" ? -amount : amount;

    await prisma.$transaction([
      prisma.transaction.create({
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
      }),
      prisma.financialAccount.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: balanceAdjustment,
          },
        },
      }),
    ]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }

  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/financial-accounts");
  revalidatePath("/dashboard/categories");
}

export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!transaction) throw new Error("Transaction not found");

    const balanceAdjustment = transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount;

    await prisma.$transaction([
      prisma.transaction.delete({
        where: { id },
      }),
      prisma.financialAccount.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: balanceAdjustment,
          },
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to delete transaction", error);
    throw new Error("Failed to delete transaction");
  }

  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/financial-accounts");
  revalidatePath("/dashboard/categories");
}
