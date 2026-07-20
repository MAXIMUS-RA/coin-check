/**
 * Balance arithmetic tests for transaction server actions.
 *
 * These assert the exact `increment` values sent to financialAccount.update,
 * which is where money bugs would silently corrupt user balances.
 */

// NOTE: jest.mock factories are hoisted, so they must not close over
// variables declared later. We build the mocks inside the factories and
// grab references to them after importing.
jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/prisma", () => ({
   prisma: {
      $transaction: jest.fn(),
      transaction: {
         create: jest.fn(),
         update: jest.fn(),
         delete: jest.fn(),
         findUnique: jest.fn(),
      },
      financialAccount: {
         update: jest.fn(),
      },
   },
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("next/navigation", () => ({ redirect: jest.fn() }));

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTransaction, editTransaction, deleteTransaction } from "@/lib/actions/transaction-actions";

const mockAuth = auth as unknown as jest.Mock;
const mockPrisma = prisma as unknown as {
   $transaction: jest.Mock;
   transaction: { create: jest.Mock; update: jest.Mock; delete: jest.Mock; findUnique: jest.Mock };
   financialAccount: { update: jest.Mock };
};

const USER_ID = "user-1";
const ACCOUNT_A = "account-a";
const ACCOUNT_B = "account-b";

function buildFormData(overrides: Record<string, string> = {}) {
   const data: Record<string, string> = {
      amount: "100",
      type: "EXPENSE",
      description: "Groceries",
      accountId: ACCOUNT_A,
      date: "2026-07-20",
      ...overrides,
   };

   const formData = new FormData();
   for (const [key, value] of Object.entries(data)) formData.set(key, value);
   return formData;
}

/** Returns the `increment` values passed to financialAccount.update, keyed by account id. */
function balanceUpdates() {
   return mockPrisma.financialAccount.update.mock.calls.map((call) => ({
      accountId: call[0].where.id,
      increment: call[0].data.balance.increment,
   }));
}

function existingTransaction(overrides: Record<string, unknown> = {}) {
   mockPrisma.transaction.findUnique.mockResolvedValue({
      id: "txn-1",
      userId: USER_ID,
      accountId: ACCOUNT_A,
      type: "EXPENSE",
      amount: 100,
      ...overrides,
   });
}

beforeEach(() => {
   jest.clearAllMocks();
   mockAuth.mockResolvedValue({ user: { id: USER_ID } });
   mockPrisma.$transaction.mockResolvedValue([]);
});

describe("createTransaction balance arithmetic", () => {
   it("decreases the account balance for an EXPENSE", async () => {
      await createTransaction(buildFormData({ type: "EXPENSE", amount: "100" }));

      expect(balanceUpdates()).toEqual([{ accountId: ACCOUNT_A, increment: -100 }]);
   });

   it("increases the account balance for INCOME", async () => {
      await createTransaction(buildFormData({ type: "INCOME", amount: "250.5" }));

      expect(balanceUpdates()).toEqual([{ accountId: ACCOUNT_A, increment: 250.5 }]);
   });

   it("records the transaction against the signed-in user", async () => {
      await createTransaction(buildFormData());

      expect(mockPrisma.transaction.create).toHaveBeenCalledWith(
         expect.objectContaining({
            data: expect.objectContaining({ userId: USER_ID, accountId: ACCOUNT_A }),
         }),
      );
   });
});

describe("editTransaction balance arithmetic — same account", () => {
   it("applies only the delta when the amount changes", async () => {
      existingTransaction({ type: "EXPENSE", amount: 100 });

      // old effect -100, new effect -150 => delta -50
      await editTransaction("txn-1", buildFormData({ type: "EXPENSE", amount: "150" }));

      expect(balanceUpdates()).toEqual([{ accountId: ACCOUNT_A, increment: -50 }]);
   });

   it("reverses and reapplies when the type flips EXPENSE -> INCOME", async () => {
      existingTransaction({ type: "EXPENSE", amount: 100 });

      // old effect -100, new effect +100 => delta +200
      await editTransaction("txn-1", buildFormData({ type: "INCOME", amount: "100" }));

      expect(balanceUpdates()).toEqual([{ accountId: ACCOUNT_A, increment: 200 }]);
   });

   it("produces a zero delta when nothing money-related changed", async () => {
      existingTransaction({ type: "EXPENSE", amount: 100 });

      await editTransaction("txn-1", buildFormData({ type: "EXPENSE", amount: "100" }));

      expect(balanceUpdates()).toEqual([{ accountId: ACCOUNT_A, increment: 0 }]);
   });
});

describe("editTransaction balance arithmetic — moving to another account", () => {
   it("reverses the old effect on the old account and applies the new effect on the new one", async () => {
      existingTransaction({ accountId: ACCOUNT_A, type: "EXPENSE", amount: 100 });

      // moving an EXPENSE of 100 from A to B, changing amount to 40
      await editTransaction("txn-1", buildFormData({ accountId: ACCOUNT_B, type: "EXPENSE", amount: "40" }));

      expect(balanceUpdates()).toEqual([
         { accountId: ACCOUNT_A, increment: 100 }, // undo the original -100
         { accountId: ACCOUNT_B, increment: -40 }, // apply the new effect
      ]);
   });

   it("handles a type change across accounts", async () => {
      existingTransaction({ accountId: ACCOUNT_A, type: "INCOME", amount: 200 });

      await editTransaction("txn-1", buildFormData({ accountId: ACCOUNT_B, type: "EXPENSE", amount: "50" }));

      expect(balanceUpdates()).toEqual([
         { accountId: ACCOUNT_A, increment: -200 }, // undo the original +200
         { accountId: ACCOUNT_B, increment: -50 },
      ]);
   });

   it("leaves the two accounts' net change equal to new effect minus old effect", async () => {
      existingTransaction({ accountId: ACCOUNT_A, type: "EXPENSE", amount: 100 });

      await editTransaction("txn-1", buildFormData({ accountId: ACCOUNT_B, type: "EXPENSE", amount: "40" }));

      const net = balanceUpdates().reduce((sum, u) => sum + u.increment, 0);
      expect(net).toBe(60); // -40 applied, +100 refunded
   });

   it("scopes the lookup to the current user", async () => {
      existingTransaction();

      await editTransaction("txn-1", buildFormData());

      expect(mockPrisma.transaction.findUnique).toHaveBeenCalledWith({
         where: { id: "txn-1", userId: USER_ID },
      });
   });
});

describe("deleteTransaction balance arithmetic", () => {
   it("refunds the account when deleting an EXPENSE", async () => {
      existingTransaction({ type: "EXPENSE", amount: 75 });

      await deleteTransaction("txn-1");

      expect(balanceUpdates()).toEqual([{ accountId: ACCOUNT_A, increment: 75 }]);
   });

   it("withdraws from the account when deleting INCOME", async () => {
      existingTransaction({ type: "INCOME", amount: 300 });

      await deleteTransaction("txn-1");

      expect(balanceUpdates()).toEqual([{ accountId: ACCOUNT_A, increment: -300 }]);
   });

   it("throws and touches no balance when the transaction is not the user's", async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(null);

      await expect(deleteTransaction("txn-1")).rejects.toThrow("Failed to delete transaction");
      expect(mockPrisma.financialAccount.update).not.toHaveBeenCalled();
   });
});

describe("round-trip consistency", () => {
   it("create then delete nets to zero for an EXPENSE", async () => {
      await createTransaction(buildFormData({ type: "EXPENSE", amount: "120" }));
      const created = balanceUpdates()[0].increment;

      jest.clearAllMocks();
      mockAuth.mockResolvedValue({ user: { id: USER_ID } });
      mockPrisma.$transaction.mockResolvedValue([]);
      existingTransaction({ type: "EXPENSE", amount: 120 });

      await deleteTransaction("txn-1");
      const deleted = balanceUpdates()[0].increment;

      expect(created + deleted).toBe(0);
   });

   it("create then delete nets to zero for INCOME", async () => {
      await createTransaction(buildFormData({ type: "INCOME", amount: "90" }));
      const created = balanceUpdates()[0].increment;

      jest.clearAllMocks();
      mockAuth.mockResolvedValue({ user: { id: USER_ID } });
      mockPrisma.$transaction.mockResolvedValue([]);
      existingTransaction({ type: "INCOME", amount: 90 });

      await deleteTransaction("txn-1");
      const deleted = balanceUpdates()[0].increment;

      expect(created + deleted).toBe(0);
   });
});
