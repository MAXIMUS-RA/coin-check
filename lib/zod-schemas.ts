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

   balance: z.coerce.number({
      message: "Balance must be a number",
   }),

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
