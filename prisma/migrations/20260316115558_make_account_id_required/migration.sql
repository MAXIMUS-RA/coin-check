/*
  Warnings:

  - Made the column `accountId` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "accountId" SET NOT NULL;
