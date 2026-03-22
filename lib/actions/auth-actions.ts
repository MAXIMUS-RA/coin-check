"use server";

import { compare, hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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

export async function updateUserProfile(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const image = (formData.get("image") as string)?.trim() || null;
  const defaultCurrency = ((formData.get("defaultCurrency") as string) || "USD").trim().toUpperCase();
  const dashboardPeriod = Number(formData.get("dashboardPeriod") || 30);
  const themePreference = ((formData.get("themePreference") as string) || "dark").trim().toLowerCase();
  const hiddenWidgets = formData
    .getAll("hiddenWidgets")
    .map((v) => String(v))
    .filter(Boolean);

  if (!name || name.length < 2) {
    return { success: false, message: "Name must be at least 2 characters." };
  }

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please provide a valid email." };
  }

  if (defaultCurrency.length !== 3) {
    return { success: false, message: "Currency must be exactly 3 letters." };
  }

  if (![30, 90, 365].includes(dashboardPeriod)) {
    return { success: false, message: "Invalid dashboard period selected." };
  }

  if (!["dark", "light", "system"].includes(themePreference)) {
    return { success: false, message: "Invalid theme selected." };
  }

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

  const currentPassword = (formData.get("currentPassword") as string) || "";
  const newPassword = (formData.get("newPassword") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";

  if (newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match." };
  }

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
