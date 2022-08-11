import { prisma } from "../database/database.js";

async function getIngredients() {
	return await prisma.ingredient.findMany();
}

export const ingredientRepository = {
	getIngredients,
};
