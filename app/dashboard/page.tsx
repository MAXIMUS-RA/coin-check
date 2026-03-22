import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OverviewDashboard from "@/components/ui/dashboard/OverviewDashboard";

const CATEGORY_COLORS = [
  "#38bdf8",
  "#818cf8",
  "#34d399",
  "#f59e0b",
  "#fb7185",
  "#22d3ee",
  "#a78bfa",
  "#f97316",
];

function monthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const now = new Date();

  const userPrefs = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      defaultCurrency: true,
      dashboardPeriod: true,
      hiddenWidgets: true,
    },
  });

  const dashboardPeriod = userPrefs?.dashboardPeriod ?? 30;
  const defaultCurrency = userPrefs?.defaultCurrency ?? "USD";
  const hiddenWidgets = userPrefs?.hiddenWidgets ?? [];

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [accounts, recentTransactions, sixMonthTransactions, expenseByCategoryRaw] = await Promise.all([
    prisma.financialAccount.findMany({
      where: { userId },
      orderBy: { balance: "desc" },
    }),
    prisma.transaction.findMany({
      where: { userId },
      include: {
        account: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { date: "desc" },
      take: 6,
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: sixMonthsAgo },
      },
      include: {
        category: { select: { name: true } },
      },
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 6,
    }),
  ]);

  const totalNetWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const monthTransactions = sixMonthTransactions.filter((tx) => tx.date >= monthStart && tx.date < nextMonthStart);
  const monthIncome = monthTransactions.filter((tx) => tx.type === "INCOME").reduce((sum, tx) => sum + tx.amount, 0);
  const monthExpense = monthTransactions.filter((tx) => tx.type === "EXPENSE").reduce((sum, tx) => sum + tx.amount, 0);
  const savingsRate = monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome) * 100 : 0;

  const monthBuckets = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: monthLabel(d),
      income: 0,
      expense: 0,
    };
  });

  const bucketMap = new Map(monthBuckets.map((m) => [m.key, m]));

  for (const tx of sixMonthTransactions) {
    const key = `${tx.date.getFullYear()}-${tx.date.getMonth()}`;
    const bucket = bucketMap.get(key);
    if (!bucket) continue;

    if (tx.type === "INCOME") {
      bucket.income += tx.amount;
    } else if (tx.type === "EXPENSE") {
      bucket.expense += tx.amount;
    }
  }

  const cashflowData = monthBuckets.map((b) => ({
    month: b.month,
    income: Number(b.income.toFixed(2)),
    expense: Number(b.expense.toFixed(2)),
  }));

  const expenseCategoryIds = expenseByCategoryRaw.map((c) => c.categoryId).filter(Boolean) as string[];
  const categories = expenseCategoryIds.length
    ? await prisma.category.findMany({
        where: { id: { in: expenseCategoryIds }, userId },
        select: { id: true, name: true },
      })
    : [];
  const categoryNameMap = new Map(categories.map((c) => [c.id, c.name]));

  const expenseByCategory = expenseByCategoryRaw
    .map((row, idx) => ({
      name: row.categoryId ? categoryNameMap.get(row.categoryId) || "Uncategorized" : "Uncategorized",
      value: Number((row._sum.amount || 0).toFixed(2)),
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }))
    .filter((entry) => entry.value > 0);

  const totalExpenseAll = expenseByCategory.reduce((sum, c) => sum + c.value, 0);
  const topSpending = expenseByCategory.slice(0, 4).map((item) => ({
    ...item,
    amount: item.value,
    percent: totalExpenseAll > 0 ? (item.value / totalExpenseAll) * 100 : 0,
  }));

  const accountBalances = accounts.slice(0, 6).map((acc) => ({
    name: acc.name.length > 12 ? `${acc.name.slice(0, 12)}...` : acc.name,
    balance: Number(acc.balance.toFixed(2)),
  }));

  const overviewRecent = recentTransactions.map((tx) => ({
    id: tx.id,
    description: tx.description,
    amount: tx.amount,
    type: tx.type,
    date: tx.date.toISOString(),
    accountName: tx.account.name,
    categoryName: tx.category?.name ?? null,
  }));

  return (
    <OverviewDashboard
      kpis={{
        netWorth: totalNetWorth,
        monthIncome,
        monthExpense,
        savingsRate,
      }}
      defaultCurrency={defaultCurrency}
      dashboardPeriod={dashboardPeriod}
      hiddenWidgets={hiddenWidgets}
      cashflowData={cashflowData}
      expenseByCategory={expenseByCategory}
      accountBalances={accountBalances}
      recentTransactions={overviewRecent}
      topSpending={topSpending}
    />
  );
}
