import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FinancialAccountRow from "@/components/ui/dashboard/FinancialAccountRow";
import type { FinancialAccount } from "@/types/dashboard/financialAccount.types";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
   useRouter: () => ({
      push: pushMock,
   }),
}));

jest.mock("@/components/ui/dashboard/FinancialAccountEdit", () => {
   return function MockFinancialAccountEdit() {
      return <button type="button">Edit</button>;
   };
});

jest.mock("@/components/ui/dashboard/DeleteAccountButton", () => {
   return function MockDeleteAccountButton() {
      return <button type="button">Delete</button>;
   };
});

const account: FinancialAccount = {
   id: "acc_123",
   name: "Main Wallet",
   type: "CASH",
   balance: 1200,
   currency: "USD",
   _count: {
      transactions: 4,
   },
};

describe("FinancialAccountRow", () => {
   beforeEach(() => {
      pushMock.mockClear();
   });

   it("renders account fields", () => {
      render(
         <table>
            <tbody>
               <FinancialAccountRow account={account} />
            </tbody>
         </table>
      );

      expect(screen.getByText("Main Wallet")).toBeInTheDocument();
      expect(screen.getByText("CASH")).toBeInTheDocument();
      expect(screen.getByText("USD")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
   });

   it("navigates to account details on row click", async () => {
      const user = userEvent.setup();

      render(
         <table>
            <tbody>
               <FinancialAccountRow account={account} />
            </tbody>
         </table>
      );

      await user.click(screen.getByText("Main Wallet"));
      expect(pushMock).toHaveBeenCalledWith("/dashboard/financial-accounts/acc_123");
   });

    it("renders negative balance in danger style", () => {
      render(
         <table>
            <tbody>
               <FinancialAccountRow
                  account={{
                     ...account,
                     balance: -99,
                  }}
               />
            </tbody>
         </table>
      );

      expect(screen.getByText(/-\$99\.00/)).toHaveClass("text-red-400");
   });

   it("does not navigate when clicking actions cell", async () => {
      const user = userEvent.setup();

      render(
         <table>
            <tbody>
               <FinancialAccountRow account={account} />
            </tbody>
         </table>
      );

      await user.click(screen.getByText("Edit"));
      expect(pushMock).not.toHaveBeenCalled();
   });
});
