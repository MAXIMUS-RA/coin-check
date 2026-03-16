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

export async function createCategory(prevState: any, formData: FormData) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const name = formData.get("name") as string;
   const type = formData.get("type") as "INCOME" | "EXPENSE";
   const icon = formData.get("icon") as string | null;
   const color = formData.get("color") as string | null;

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

export async function editCategory(id: string, prevState: any, formData: FormData) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const name = formData.get("name") as string;
   const type = formData.get("type") as "INCOME" | "EXPENSE";
   const icon = formData.get("icon") as string | null;
   const color = formData.get("color") as string | null;

   try {
      // Use updateMany so we can filter by both id and userId without requiring a compound unique index
      const result = await prisma.category.update({
         where: { id },
         data: { name, type, icon: icon || null, color: color || null },
      });

      

      revalidatePath("/dashboard/categories");
      return { success: true, message: "Category updated successfully" };
   } catch (error) {
      console.error("Error updating category:", error);
      return { success: false, message: "Failed to update category." };
   }
}

export async function createBudget(formData: FormData) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   const amount = Number(formData.get("amount"));
   const month = Number(formData.get("month"));
   const year = Number(formData.get("year"));
   const categoryId = formData.get("categoryId") as string;

   if (!categoryId || !Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid budget data");
   }

   if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error("Invalid month");
   }

   if (!Number.isInteger(year) || year < 2000 || year > 3000) {
      throw new Error("Invalid year");
   }

   try {
      await prisma.budget.create({
         data: {
            amount,
            month,
            year,
            categoryId,
            userId: session.user.id,
         },
      });
   } catch (error: any) {
      if (error?.code === "P2002") {
         throw new Error("A budget already exists for this category and month.");
      }
      console.error("Error creating budget:", error);
      throw new Error("Failed to create budget");
   }

   revalidatePath("/dashboard/budgets");
   revalidatePath("/dashboard/categories");
}

export async function deleteBudget(id: string) {
   const session = await auth();
   if (!session?.user?.id) redirect("/login");

   try {
      await prisma.budget.deleteMany({
         where: {
            id,
            userId: session.user.id,
         },
      });
   } catch (error) {
      console.error("Failed to delete budget:", error);
      throw new Error("Failed to delete budget");
   }

   revalidatePath("/dashboard/budgets");
   revalidatePath("/dashboard/categories");
}
