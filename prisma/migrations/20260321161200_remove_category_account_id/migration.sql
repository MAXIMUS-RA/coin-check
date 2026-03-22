/*
  Warnings:

  - You are about to drop the column `accountId` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,userId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_accountId_fkey";

-- DropIndex
DROP INDEX "Category_name_userId_accountId_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "accountId";

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");
