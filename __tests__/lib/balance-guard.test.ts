import { checkProjectedBalance } from "@/lib/balance-guard";

describe("checkProjectedBalance", () => {
   it("allows any account type to stay at or above zero", () => {
      for (const type of ["BANK", "CREDIT", "CASH", "INVESTMENT"] as const) {
         expect(checkProjectedBalance(type, 0, "Acc", "USD")).toEqual({ status: "ok" });
         expect(checkProjectedBalance(type, 150.25, "Acc", "USD")).toEqual({ status: "ok" });
      }
   });

   it("forbids a negative CASH balance — you cannot spend cash you do not have", () => {
      const result = checkProjectedBalance("CASH", -4800, "Wallet", "USD");

      expect(result.status).toBe("forbidden");
      expect(result).toMatchObject({ message: expect.stringContaining("Wallet") });
      expect(result).toMatchObject({ message: expect.stringContaining("-4800.00 USD") });
   });

   it("asks for confirmation when a BANK account would be overdrawn", () => {
      const result = checkProjectedBalance("BANK", -50, "Checking", "EUR");

      expect(result.status).toBe("confirm");
      expect(result).toMatchObject({ message: expect.stringContaining("-50.00 EUR") });
   });

   it("asks for confirmation for CREDIT — a negative balance is normal debt", () => {
      expect(checkProjectedBalance("CREDIT", -1200, "Visa", "USD").status).toBe("confirm");
   });

   it("asks for confirmation for INVESTMENT", () => {
      expect(checkProjectedBalance("INVESTMENT", -1, "Brokerage", "USD").status).toBe("confirm");
   });

   it("treats exactly zero as allowed, not an overdraft", () => {
      expect(checkProjectedBalance("CASH", 0, "Wallet", "USD")).toEqual({ status: "ok" });
   });
});
