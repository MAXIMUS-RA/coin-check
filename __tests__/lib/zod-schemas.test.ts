import {
   CategorySchema,
   ChangePasswordSchema,
   FinancialAccountSchema,
   LoginSchema,
   RegisterSchema,
   TransactionSchema,
   UserProfileSchema,
} from "@/lib/zod-schemas";

describe("zod schemas", () => {
   describe("TransactionSchema", () => {
      it("parses valid payload", () => {
         const parsed = TransactionSchema.parse({
            amount: "100.5",
            type: "INCOME",
            description: "Salary",
            accountId: "acc_1",
            categoryId: null,
            date: "2026-04-02",
            notes: "April salary",
         });

         expect(parsed.amount).toBe(100.5);
         expect(parsed.type).toBe("INCOME");
      });

      it("rejects negative amount", () => {
         const result = TransactionSchema.safeParse({
            amount: -10,
            type: "EXPENSE",
            description: "Bad",
            accountId: "acc_1",
            date: "2026-04-02",
         });

         expect(result.success).toBe(false);
      });
   });

   describe("FinancialAccountSchema", () => {
      it("uppercases and validates currency", () => {
         const parsed = FinancialAccountSchema.parse({
            name: "Cash",
            type: "CASH",
            balance: "50",
            currency: "usd",
         });

         expect(parsed.currency).toBe("USD");
         expect(parsed.balance).toBe(50);
      });

      it("rejects invalid account type", () => {
         const result = FinancialAccountSchema.safeParse({
            name: "Account",
            type: "OTHER",
            balance: 0,
            currency: "USD",
         });

         expect(result.success).toBe(false);
      });
   });

   describe("CategorySchema", () => {
      it("accepts optional icon and color", () => {
         const parsed = CategorySchema.parse({
            name: "Groceries",
            type: "EXPENSE",
            icon: "🛒",
            color: "#34d399",
         });

         expect(parsed.name).toBe("Groceries");
      });

      it("rejects invalid hex color", () => {
         const result = CategorySchema.safeParse({
            name: "Salary",
            type: "INCOME",
            color: "green",
         });

         expect(result.success).toBe(false);
      });
   });

   describe("UserProfileSchema", () => {
      it("normalizes profile fields", () => {
         const parsed = UserProfileSchema.parse({
            name: "  Max  ",
            email: "MAX@MAIL.COM",
            image: "",
            defaultCurrency: "eur",
            dashboardPeriod: "90",
            themePreference: "system",
            hiddenWidgets: ["cashflow"],
         });

         expect(parsed.email).toBe("max@mail.com");
         expect(parsed.defaultCurrency).toBe("EUR");
         expect(parsed.dashboardPeriod).toBe(90);
      });

      it("rejects unsupported dashboard period", () => {
         const result = UserProfileSchema.safeParse({
            name: "Max",
            email: "max@mail.com",
            image: "",
            defaultCurrency: "USD",
            dashboardPeriod: 15,
            themePreference: "dark",
         });

         expect(result.success).toBe(false);
      });
   });

   describe("Auth schemas", () => {
      it("validates login payload", () => {
         const parsed = LoginSchema.parse({
            email: "user@mail.com",
            password: "secret",
         });

         expect(parsed.email).toBe("user@mail.com");
      });

      it("rejects short register password", () => {
         const result = RegisterSchema.safeParse({
            name: "User",
            email: "user@mail.com",
            password: "123",
         });

         expect(result.success).toBe(false);
      });

      it("rejects mismatched new passwords", () => {
         const result = ChangePasswordSchema.safeParse({
            currentPassword: "old-password",
            newPassword: "new-password",
            confirmPassword: "different-password",
         });

         expect(result.success).toBe(false);
      });
   });
});
