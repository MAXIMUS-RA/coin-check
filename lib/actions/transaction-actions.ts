"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionSchema } from "@/lib/zod-schemas";
import { checkProjectedBalance, type GuardAccountType } from "@/lib/balance-guard";

/** Result returned to the client. Server actions must RETURN errors, not throw:
 *  Next.js masks thrown error messages in production. */
export type TransactionActionResult =
  | { success: true }
  | { success: false; status: "forbidden" | "confirm" | "error"; message: string };

export async function createTransaction(formData: FormData): Promise<TransactionActionResult> {
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
    return { success: false, status: "error", message: "Invalid transaction data provided" };
  }

  const { amount, type, description, accountId, categoryId, date, notes } = validatedFields.data;
  const confirmedOverdraft = formData.get("confirmOverdraft") === "true";

  try {
    const balanceAdjustment = type === "EXPENSE" ? -amount : amount;

    const account = await prisma.financialAccount.findUnique({
      where: { id: accountId, userId: session.user.id },
    });

    if (!account) {
      return { success: false, status: "error", message: "Account not found" };
    }

    const guard = checkProjectedBalance(
      account.type as GuardAccountType,
      account.balance + balanceAdjustment,
      account.name,
      account.currency,
    );

    if (guard.status === "forbidden") {
      return { success: false, status: "forbidden", message: guard.message };
    }
    if (guard.status === "confirm" && !confirmedOverdraft) {
      return { success: false, status: "confirm", message: guard.message };
    }

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
    return { success: false, status: "error", message: "Failed to create transaction" };
  }

  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/financial-accounts");
  revalidatePath("/dashboard/categories");

  return { success: true };
}

export async function editTransaction(id: string, formData: FormData): Promise<TransactionActionResult> {
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
    return { success: false, status: "error", message: "Invalid transaction data provided" };
  }

  const { amount, type, description, accountId, categoryId, date, notes } = validatedFields.data;
  const confirmedOverdraft = formData.get("confirmOverdraft") === "true";

  try {
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingTransaction) {
      return { success: false, status: "error", message: "Transaction not found" };
    }

    const oldEffect = existingTransaction.type === "EXPENSE" ? -existingTransaction.amount : existingTransaction.amount;
    const newEffect = type === "EXPENSE" ? -amount : amount;

    // Guard every account whose balance changes. When a transaction moves between
    // accounts, the source account is refunded (-oldEffect) and the target takes
    // the new effect, so both need checking.
    const affected =
      existingTransaction.accountId === accountId
        ? [{ id: accountId, delta: newEffect - oldEffect }]
        : [
            { id: existingTransaction.accountId, delta: -oldEffect },
            { id: accountId, delta: newEffect },
          ];

    for (const { id: affectedId, delta } of affected) {
      const account = await prisma.financialAccount.findUnique({
        where: { id: affectedId, userId: session.user.id },
      });

      if (!account) {
        return { success: false, status: "error", message: "Account not found" };
      }

      const guard = checkProjectedBalance(
        account.type as GuardAccountType,
        account.balance + delta,
        account.name,
        account.currency,
      );

      if (guard.status === "forbidden") {
        return { success: false, status: "forbidden", message: guard.message };
      }
      if (guard.status === "confirm" && !confirmedOverdraft) {
        return { success: false, status: "confirm", message: guard.message };
      }
    }

    if (existingTransaction.accountId === accountId) {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id },
          data: {
            amount,
            type,
            description,
            accountId,
            categoryId: categoryId || null,
            date: new Date(date),
            notes: notes || null,
          },
        }),
        prisma.financialAccount.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: newEffect - oldEffect,
            },
          },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id },
          data: {
            amount,
            type,
            description,
            accountId,
            categoryId: categoryId || null,
            date: new Date(date),
            notes: notes || null,
          },
        }),
        prisma.financialAccount.update({
          where: { id: existingTransaction.accountId },
          data: {
            balance: {
              increment: -oldEffect,
            },
          },
        }),
        prisma.financialAccount.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: newEffect,
            },
          },
        }),
      ]);
    }
  } catch (error) {
    console.error("Failed to edit transaction", error);
    return { success: false, status: "error", message: "Failed to edit transaction" };
  }

  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/financial-accounts");
  revalidatePath("/dashboard/categories");

  return { success: true };
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
