/*
  Warnings:

  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,userId,accountId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_userId_fkey";

-- DropIndex
DROP INDEX "Category_name_userId_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "accountId" TEXT;

-- DropTable
DROP TABLE "Budget";

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_userId_accountId_key" ON "Category"("name", "userId", "accountId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
