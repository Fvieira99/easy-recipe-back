/*
  Warnings:

  - Added the required column `image` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "image" TEXT NOT NULL;
