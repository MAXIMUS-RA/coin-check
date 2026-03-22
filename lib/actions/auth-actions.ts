"use server";

import { compare, hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { UserProfileSchema, ChangePasswordSchema } from "@/lib/zod-schemas";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
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

  console.log(formData);

  try {
    const result = await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    console.log(result);
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

export async function updateUserProfile(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const validatedFields = UserProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image: formData.get("image"),
    defaultCurrency: formData.get("defaultCurrency"),
    dashboardPeriod: formData.get("dashboardPeriod"),
    themePreference: formData.get("themePreference"),
    hiddenWidgets: formData.getAll("hiddenWidgets").filter(Boolean),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return {
      success: false,
      message: firstError || "Invalid input.",
    };
  }

  const { name, email, image, defaultCurrency, dashboardPeriod, themePreference, hiddenWidgets } = validatedFields.data;

  const existingEmail = await prisma.user.findFirst({
    where: {
      email,
      NOT: { id: session.user.id },
    },
    select: { id: true },
  });

  if (existingEmail) {
    return { success: false, message: "Email is already used by another account." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      email,
      image,
      defaultCurrency,
      dashboardPeriod,
      themePreference,
      hiddenWidgets,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return { success: true, message: "Profile updated successfully." };
}

export async function changePassword(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const validatedFields = ChangePasswordSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return {
      success: false,
      message: firstError || "Invalid password input.",
    };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, password: true },
  });

  if (!user || !user.password) {
    return { success: false, message: "Password update is unavailable for this account." };
  }

  const isCurrentValid = await compare(currentPassword, user.password);
  if (!isCurrentValid) {
    return { success: false, message: "Current password is incorrect." };
  }

  const newHashedPassword = await hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: newHashedPassword },
  });

  return { success: true, message: "Password changed successfully." };
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}
