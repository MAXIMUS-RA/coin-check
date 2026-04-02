export interface FinancialAccount {
   id: string;
   name: string;
   type: "CASH" | "CREDIT" | "BANK" | "INVESTMENT";
   balance: number;
   currency: string;
   _count: {
      transactions: number;
   };
}