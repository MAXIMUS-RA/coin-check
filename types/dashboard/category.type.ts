type CategoryWithTransactions = {
   id: string;
   name: string;
   icon: string | null;
   type: string;
   color: string | null;
   _count: { transactions: number; budgets: number };
   transactions: {
      id: string;
      amount: number;
      description: string;
      date: Date;
      type: string;
   }[];
};
