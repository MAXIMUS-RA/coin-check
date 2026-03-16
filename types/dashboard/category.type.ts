type CategoryWithTransactions = {
   id: string;
   name: string;
   icon: string | null;
   type: string;
   color: string | null;
   accountId: string;
   _count: { transactions: number };
   transactions: {
      id: string;
      amount: number;
      description: string;
      date: Date;
      type: string;
   }[];
};