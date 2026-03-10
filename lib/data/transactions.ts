import { prisma } from "../prisma";

export async function getUserTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { userId: userId! },
    include: { account: true, category: true },
    orderBy: { date: "desc" },
  });
}
