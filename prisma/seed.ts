// [prisma/seed.ts](prisma/seed.ts)
import { PrismaClient } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";


async function main() {
  console.log("Seeding database...");

  // 1. Create a Test User
  // Note: For a real app, hash the password using bcryptjs: await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test Setup User",
      password: "password123", // Dummy password for testing
    },
  });

  console.log(`User created: ${user.name} (${user.email})`);

  // 2. Create Initial Categories for the User
  const incomeCategoryInfo = {
    name: "Salary",
    type: "INCOME" as const,
    icon: "💵",
    color: "#10B981",
    userId: user.id,
  };
  const expenseCategoryInfo = {
    name: "Groceries",
    type: "EXPENSE" as const,
    icon: "🛒",
    color: "#EF4444",
    userId: user.id,
  };

  const salaryCategory = await prisma.category.upsert({
    where: { name_userId: { name: "Salary", userId: user.id } },
    update: {},
    create: incomeCategoryInfo,
  });

  const groceriesCategory = await prisma.category.upsert({
    where: { name_userId: { name: "Groceries", userId: user.id } },
    update: {},
    create: expenseCategoryInfo,
  });

  console.log("Categories created: Salary, Groceries");

  // 3. Create a Financial Account
  const checkingAccount = await prisma.financialAccount.create({
    data: {
      name: "Main Checking",
      type: "BANK",
      balance: 1500.0,
      currency: "USD",
      userId: user.id,
    },
  });

  console.log("Financial account created: Main Checking");

  // 4. Create Sample Transactions
  await prisma.transaction.create({
    data: {
      amount: 3000.0,
      type: "INCOME",
      description: "Monthly Salary",
      date: new Date(),
      accountId: checkingAccount.id,
      categoryId: salaryCategory.id,
      userId: user.id,
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 120.5,
      type: "EXPENSE",
      description: "Whole Foods Market",
      date: new Date(),
      accountId: checkingAccount.id,
      categoryId: groceriesCategory.id,
      userId: user.id,
    },
  });

  console.log("Sample transactions created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Seeding finished.");
  });
