/*
  Warnings:

  - You are about to drop the column `createAt` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "saved_recipes" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
