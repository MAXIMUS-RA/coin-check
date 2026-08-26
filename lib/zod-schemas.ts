import { z } from "zod";

export const TransactionSchema = z.object({
   amount: z.coerce
      .number({
         message: "Amount must be a number",
      })
      .positive("Amount must be greater than 0"),
   type: z.enum(["INCOME", "EXPENSE", "TRANSFER"], {
      message: "Invalid transaction type selected.",
   }),

   description: z.string().min(1, "Description is required").max(100),
   accountId: z.string().min(1, "Please select an account"),
   categoryId: z.string().nullable().optional(),
   date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
   }),
   notes: z.string().max(500, "Notes cannot exceed 500 characters").nullable().optional(),
});

export const FinancialAccountSchema = z.object({
   name: z.string().min(1, "Account name is required").max(50),
   type: z.enum(["BANK", "CREDIT", "CASH", "INVESTMENT"], {
      message: "Invalid account type selected.",
   }),
   balance: z.coerce
      .number({
         message: "Balance must be a number",
      })
      .positive("Balance must be greater than 0"),
   currency: z.string().length(3, "Currency must be exactly 3 letters (e.g., USD)").toUpperCase(),
});

export const CategorySchema = z.object({
   name: z.string().min(1, "Category name is required").max(50),

   type: z.enum(["INCOME", "EXPENSE"], {
      message: "Invalid category type.",
   }),

   icon: z.string().max(4, "Icon must be an emoji").nullable().optional(),
   color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color")
      .nullable()
      .optional(),
});

export const UserProfileSchema = z.object({
   name: z.string().trim().min(2, "Name must be at least 2 characters."),
   email: z.string().trim().toLowerCase().email("Please provide a valid email."),
   image: z.string().trim().url().nullable().or(z.literal("")).optional(),
   defaultCurrency: z.string().trim().length(3, "Currency must be exactly 3 letters.").toUpperCase(),
   dashboardPeriod: z.coerce.number().refine((val) => [30, 90, 365].includes(val), {
      message: "Invalid dashboard period selected.",
   }),
   themePreference: z.enum(["dark", "light", "system"], {
      message: "Invalid theme selected.",
   }),
   hiddenWidgets: z.array(z.string()).optional().default([]),
});

export const LoginSchema = z.object({
   email: z.string().trim().email("Invalid email address."),
   password: z.string().min(1, "Password is required."),
});

export const RegisterSchema = z.object({
   name: z.string().trim().min(2, "Name must be at least 2 characters."),
   email: z.string().trim().email("Invalid email address."),
   password: z.string().min(8, "Password must be at least 8 characters."),
});

export const ChangePasswordSchema = z
   .object({
      currentPassword: z.string().min(1, "Current password is required."),
      newPassword: z.string().min(8, "New password must be at least 8 characters."),
      confirmPassword: z.string().min(1, "Please confirm your new password."),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: "New passwords do not match.",
      path: ["confirmPassword"],
   });
