import { ingredientRepository } from "../repositories/ingredientRepository.js";

async function getIngredients() {
	return await ingredientRepository.getIngredients();
}

export const ingredientService = { getIngredients };
