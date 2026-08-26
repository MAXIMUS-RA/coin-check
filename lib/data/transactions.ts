import { prisma } from "../prisma";

export async function getUserTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { account: true, category: true },
    orderBy: { date: "desc" },
  });
}

export type PaginatedTransactionsParams = {
  userId: string;
  page?: number;
  pageSize?: number;
  categoryId?: string;
};

export async function getPaginatedUserTransactions({
  userId,
  page = 1,
  pageSize = 10,
  categoryId,
}: PaginatedTransactionsParams) {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * pageSize;
  const where = {
    userId,
    ...(categoryId ? { categoryId } : {}),
  };

  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { account: true, category: true },
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    currentPage: safePage,
    pageSize,
  };
}

export async function getTransactionStats(userId: string) {
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: "INCOME" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: "EXPENSE" },
    }),
  ]);

  const totalIncome = incomeAgg._sum.amount ?? 0;
  const totalExpenses = expenseAgg._sum.amount ?? 0;
  const net = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, net };
}

export async function getUserCategories(userId: string) {
  return prisma.category.findMany({ where: { userId } });
}

export async function getUserAccounts(userId: string) {
  return prisma.financialAccount.findMany({ where: { userId } });
}


