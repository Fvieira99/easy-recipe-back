/*
  Warnings:

  - Added the required column `ingredientQty` to the `recipes_ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipes_ingredients" ADD COLUMN     "ingredientQty" TEXT NOT NULL;
