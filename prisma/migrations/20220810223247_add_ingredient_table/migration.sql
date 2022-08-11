/*
  Warnings:

  - You are about to drop the column `ingredients` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "ingredients";

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes_ingredients" (
    "id" SERIAL NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "recipes_ingredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "recipes_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "recipes_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
