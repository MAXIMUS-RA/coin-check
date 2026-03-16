import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createBudget, deleteBudget } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

function fmt(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function BudgetsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [categories, budgets] = await Promise.all([
    prisma.category.findMany({
      where: { userId, type: "EXPENSE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, icon: true },
    }),
    prisma.budget.findMany({
      where: { userId },
      include: {
        category: {
          select: { id: true, name: true, icon: true },
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    }),
  ]);

  const rows = await Promise.all(
    budgets.map(async (budget) => {
      const monthStart = new Date(Date.UTC(budget.year, budget.month - 1, 1));
      const nextMonthStart = new Date(Date.UTC(budget.year, budget.month, 1));

      const spentAgg = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          type: "EXPENSE",
          date: {
            gte: monthStart,
            lt: nextMonthStart,
          },
        },
        _sum: { amount: true },
      });

      const spent = spentAgg._sum.amount ?? 0;
      const remaining = budget.amount - spent;
      const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return {
        ...budget,
        spent,
        remaining,
        percentUsed,
      };
    }),
  );

  return (
    <div className="p-6 text-white">
      <div className="w-full flex justify-between gap-6 flex-wrap">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Budgets</h1>
          <p className="text-sm text-slate-400 mt-1">
            Set monthly limits and track your category spending
          </p>
        </div>

        <form action={createBudget} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-wrap items-end gap-3 min-w-[300px]">
          <div className="flex flex-col gap-1">
            <label htmlFor="categoryId" className="text-xs text-slate-400">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              required
              className="bg-slate-800 border border-slate-700 rounded-md px-3 h-10 text-sm text-white min-w-[160px]"
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {(cat.icon ? cat.icon + " " : "") + cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="amount" className="text-xs text-slate-400">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="500"
              className="bg-slate-800 border border-slate-700 rounded-md px-3 h-10 text-sm text-white w-[120px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="month" className="text-xs text-slate-400">Month</label>
            <select
              id="month"
              name="month"
              defaultValue={String(currentMonth)}
              className="bg-slate-800 border border-slate-700 rounded-md px-3 h-10 text-sm text-white w-[130px]"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="year" className="text-xs text-slate-400">Year</label>
            <input
              id="year"
              name="year"
              type="number"
              min="2000"
              max="3000"
              defaultValue={currentYear}
              className="bg-slate-800 border border-slate-700 rounded-md px-3 h-10 text-sm text-white w-[100px]"
            />
          </div>

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-10">
            Create Budget
          </Button>
        </form>
      </div>

      <Table className="text-white">
        <TableCaption className="text-slate-400">
          {rows.length} budget{rows.length === 1 ? "" : "s"} found
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Category</TableHead>
            <TableHead className="text-white">Period</TableHead>
            <TableHead className="text-white text-right">Budget</TableHead>
            <TableHead className="text-white text-right">Spent</TableHead>
            <TableHead className="text-white text-right">Remaining</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-gray-600 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-slate-400">
                No budgets yet. Create your first budget above.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((budget) => {
              const isOver = budget.remaining < 0;
              const statusLabel = isOver ? "Over Budget" : "On Track";
              const statusClass = isOver
                ? "bg-red-900/30 text-red-300"
                : "bg-emerald-900/30 text-emerald-300";

              return (
                <TableRow key={budget.id} className="hover:bg-slate-800/50">
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-2">
                      <span>{budget.category.icon || "🏷️"}</span>
                      <span>{budget.category.name}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    {MONTHS[budget.month - 1]?.label || "Unknown"} {budget.year}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{fmt(budget.amount)}</TableCell>
                  <TableCell className="text-right text-red-300">{fmt(budget.spent)}</TableCell>
                  <TableCell
                    className={
                      "text-right font-semibold " +
                      (budget.remaining >= 0 ? "text-emerald-300" : "text-red-300")
                    }
                  >
                    {fmt(budget.remaining)}
                  </TableCell>
                  <TableCell>
                    <span className={"px-2 py-1 rounded text-xs font-semibold " + statusClass}>
                      {statusLabel} ({Math.round(budget.percentUsed)}%)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={deleteBudget.bind(null, budget.id)}>
                      <Button type="submit" variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}