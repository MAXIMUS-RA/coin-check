import { prisma } from "../prisma";

export async function getUserTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { userId: userId! },
    include: { account: true, category: true },
    orderBy: { date: "desc" },
  });
}

export async function getUserCategories(userId: string) {
  return prisma.category.findMany({ where: { userId } });
}

export async function getUserAccounts(userId: string) {
  return prisma.financialAccount.findMany({ where: { userId:userId } });
}

