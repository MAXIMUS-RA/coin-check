"use server";

import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { hash } from "bcryptjs";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { Form } from "radix-ui";

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

export async function createCategory(prevState: any, formData: FormData) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const name = formData.get("name") as string;
   const type = formData.get("type") as "INCOME" | "EXPENSE";
   const icon = formData.get("icon") as string | null;
   const color = formData.get("color") as string | null;
   const accountId = formData.get("accountId") as string;

   if (!accountId) {
      return { success: false, message: "Please select an account." };
   }

   try {
      await prisma.category.create({
         data: {
            name,
            type,
            icon: icon || null,
            color: color || null,
            accountId,
            userId: session.user.id,
         },
      });

      revalidatePath("/dashboard/categories");
      return { success: true, message: "Category created successfully" };
   } catch (error) {
      console.error("Error creating category:", error);
      return { success: false, message: "Failed to create category." };
   }
}

export async function editCategory(id: string, prevState: any, formData: FormData) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const name = formData.get("name") as string;
   const type = formData.get("type") as "INCOME" | "EXPENSE";
   const icon = formData.get("icon") as string | null;
   const color = formData.get("color") as string | null;
   const accountId = formData.get("accountId") as string;

   try {
      await prisma.category.updateMany({
         where: { id, userId: session.user.id },
         data: { name, type, icon: icon || null, color: color || null, accountId },
      });

      revalidatePath("/dashboard/categories");
      return { success: true, message: "Category updated successfully" };
   } catch (error) {
      console.error("Error updating category:", error);
      return { success: false, message: "Failed to update category." };
   }
}

export async function deleteCategory(id: string) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   try {
      await prisma.category.delete({ where: { id, userId: session?.user?.id } });
      revalidatePath("/dashboard/categories");
   } catch (error) {
      console.error("Failed to delete category");
      throw new Error("Failed to delete category");
   }
}

export async function createFinancialAccount(formData: FormData) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const name = (formData.get("name") as string)?.trim();
   const type = formData.get("type") as "BANK" | "CREDIT" | "CASH" | "INVESTMENT";
   const balance = Number(formData.get("balance") ?? 0);
   const currency = ((formData.get("currency") as string) || "USD").toUpperCase();

   if (!name) throw new Error("Account name is required");
   if (!["BANK", "CREDIT", "CASH", "INVESTMENT"].includes(type)) {
      throw new Error("Invalid account type");
   }
   if (!Number.isFinite(balance)) throw new Error("Invalid balance");

   await prisma.financialAccount.create({
      data: {
         name,
         type,
         balance,
         currency,
         userId: session.user.id,
      },
   });

   revalidatePath("/dashboard/accounts");
   revalidatePath("/dashboard/transactions/create");
   revalidatePath("/dashboard/categories");
}

export async function deleteFinancialAccount(id: string) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   await prisma.financialAccount.deleteMany({
      where: { id, userId: session.user.id },
   });

   revalidatePath("/dashboard/accounts");
   revalidatePath("/dashboard/transactions");
   revalidatePath("/dashboard/transactions/create");
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

export async function getCategories(userId: string) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const categories = await prisma.category.findMany({
      where: { userId: session?.user?.id },
      select: {
         id: true,
         name: true,
         icon: true,
         type: true,
         color: true,
         accountId: true,
         _count: { select: { transactions: true } },
         transactions: {
            select: {
               id: true,
               account: true,
               description: true,
               date: true,
               amount: true,
               type: true,
            },
         },
      },
   });

   return categories;
}
