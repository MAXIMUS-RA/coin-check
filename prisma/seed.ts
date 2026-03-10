// [prisma/seed.ts](prisma/seed.ts)
import { PrismaClient } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// Ensure we initialize the client correctly (your setup might vary depending on how you export it in lib/prisma.ts)

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

  // 2. Create Multiple Categories for the User
  const categories = [
    { name: "Salary", type: "INCOME" as const, icon: "💵", color: "#10B981" },
    { name: "Groceries", type: "EXPENSE" as const, icon: "🛒", color: "#EF4444" },
    { name: "Dining Out", type: "EXPENSE" as const, icon: "🍔", color: "#F59E0B" },
    { name: "Entertainment", type: "EXPENSE" as const, icon: "🎬", color: "#8B5CF6" },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { name_userId: { name: cat.name, userId: user.id } },
      update: {},
      create: { ...cat, userId: user.id },
    });
    createdCategories[cat.name] = created.id;
  }

  console.log("Categories created:", Object.keys(createdCategories).join(", "));

  // 3. Create Multiple Financial Accounts
  const checkingAccount = await prisma.financialAccount.create({
    data: {
      name: "Main Checking",
      type: "BANK",
      balance: 1500.0,
      currency: "USD",
      userId: user.id,
    },
  });

  const creditCard = await prisma.financialAccount.create({
    data: {
      name: "Travel Credit Card",
      type: "CREDIT",
      balance: -350.0, // Credit cards often have negative or tracked differently, depending on logic
      currency: "USD",
      userId: user.id,
    },
  });

  console.log("Financial accounts created: Main Checking, Travel Credit Card");

  // 4. Create Sample Transactions
  const now = new Date();
  
  await prisma.transaction.createMany({
    data: [
      {
        amount: 3000.0,
        type: "INCOME",
        description: "Monthly Salary",
        date: new Date(now.getFullYear(), now.getMonth(), 1), // 1st of current month
        accountId: checkingAccount.id,
        categoryId: createdCategories["Salary"],
        userId: user.id,
      },
      {
        amount: 120.5,
        type: "EXPENSE",
        description: "Whole Foods Market",
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        accountId: checkingAccount.id,
        categoryId: createdCategories["Groceries"],
        userId: user.id,
      },
      {
        amount: 45.0,
        type: "EXPENSE",
        description: "Pizza Hut",
        date: new Date(now.getFullYear(), now.getMonth(), 8),
        accountId: creditCard.id,
        categoryId: createdCategories["Dining Out"],
        userId: user.id,
      },
      {
        amount: 15.99,
        type: "EXPENSE",
        description: "Netflix Subscription",
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        accountId: creditCard.id,
        categoryId: createdCategories["Entertainment"],
        userId: user.id,
      }
    ],
  });

  console.log("Sample transactions created");

  // 5. Create Sample Budgets for current month
  const currentMonth = now.getMonth() + 1; // Prisma Int 1-12
  const currentYear = now.getFullYear();

  // Try/catch for budgets since composite unique constraints mean createMany won't ignore duplicates easily without skipDuplicates in Postgres
  const budgetsToCreate = [
    { amount: 500.0, categoryId: createdCategories["Groceries"] },
    { amount: 200.0, categoryId: createdCategories["Dining Out"] },
    { amount: 100.0, categoryId: createdCategories["Entertainment"] },
  ];

  for (const b of budgetsToCreate) {
    try {
      await prisma.budget.upsert({
        where: {
          userId_categoryId_month_year: {
             userId: user.id,
             categoryId: b.categoryId,
             month: currentMonth,
             year: currentYear
          }
        },
        update: {},
        create: {
          amount: b.amount,
          month: currentMonth,
          year: currentYear,
          userId: user.id,
          categoryId: b.categoryId,
        }
      });
    } catch (e) {
      console.log(`Failed to create/upsert budget for category ${b.categoryId}`);
    }
  }

  console.log("Sample budgets created for current month");
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
