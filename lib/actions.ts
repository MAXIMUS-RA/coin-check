"use server";

import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { hash } from "bcryptjs";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { Form } from "radix-ui";
import { CategorySchema, FinancialAccountSchema, TransactionSchema } from "./zod-schemas";

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

export async function createCategory(prevState: any, formData: FormData) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const name = formData.get("name") as string;
   const type = formData.get("type") as "INCOME" | "EXPENSE";
   const icon = formData.get("icon") as string | null;
   const color = formData.get("color") as string | null;
   const accountId = formData.get("accountId") as string;

   const rqwData = {
      name,
      type,
      icon,
      color,
      accountId,
   };
   const validatedData = CategorySchema.safeParse(rqwData);
   if (!validatedData.success) {
      console.error("Category validation failed:", validatedData.error.flatten().fieldErrors);
      throw new Error("Invalid category data provided");
   }
   try {
      await prisma.category.create({
         data: {
            name,
            type,
            icon: icon || null,
            color: color || null,
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

   const rqwData = {
      name: formData.get("name") as string,
      type: formData.get("type") as "INCOME" | "EXPENSE",
      icon: formData.get("icon") as string | null,
      color: formData.get("color") as string | null,
   };
   const validatedData = CategorySchema.safeParse(rqwData);
   if (!validatedData.success) {
      console.error("Category validation failed:", validatedData.error.flatten().fieldErrors);
      throw new Error("Invalid category data provided");
   }
   try {
      await prisma.category.updateMany({
         where: { id, userId: session.user.id },
         data: {
            name: validatedData.data.name,
            type: validatedData.data.type,
            icon: validatedData.data.icon || null,
            color: validatedData.data.color || null,
         },
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
