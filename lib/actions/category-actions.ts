"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CategorySchema } from "@/lib/zod-schemas";

export async function createCategory(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rawData = {
    name: formData.get("name") as string,
    type: formData.get("type") as "INCOME" | "EXPENSE",
    icon: formData.get("icon") as string | null,
    color: formData.get("color") as string | null,
    accountId: formData.get("accountId") as string,
  };

  const validatedData = CategorySchema.safeParse(rawData);
  if (!validatedData.success) {
    console.error("Category validation failed:", validatedData.error.flatten().fieldErrors);
    throw new Error("Invalid category data provided");
  }

  try {
    await prisma.category.create({
      data: {
        name: validatedData.data.name,
        type: validatedData.data.type,
        icon: validatedData.data.icon || null,
        color: validatedData.data.color || null,
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

  const rawData = {
    name: formData.get("name") as string,
    type: formData.get("type") as "INCOME" | "EXPENSE",
    icon: formData.get("icon") as string | null,
    color: formData.get("color") as string | null,
  };

  const validatedData = CategorySchema.safeParse(rawData);
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
    await prisma.category.delete({ where: { id, userId: session.user.id } });
    revalidatePath("/dashboard/categories");
  } catch (error) {
    console.error("Failed to delete category", error);
    throw new Error("Failed to delete category");
  }
}

export async function getCategories(userId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
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
