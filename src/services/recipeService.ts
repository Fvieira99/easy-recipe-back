import { Recipe } from "@prisma/client";
import { recipeRepository } from "../repositories/recipeRepository.js";
import { conflictError } from "../utils/errorUtil.js";

export type InputRecipeData = Omit<CreateRecipeData, "userId">;
export type CreateRecipeData = Omit<Recipe, "id" | "createdAt">;
interface RecipesWithoutAvgRating {
	ratings: { rating: number }[];
	id: number;
	user: {
		id: number;
		avatar: string;
		username: string;
	};
}

interface RecipesWithAvgRating {
	ratings: number;
	id: number;
	user: {
		id: number;
		avatar: string;
		username: string;
	};
}

async function create(data: InputRecipeData, userId: number) {
	const existingRecipe = await recipeRepository.getRecipeByTitleAndUserId(
		data.title,
		userId
	);
	if (existingRecipe) {
		throw conflictError("Already exists a recipe with the same title!");
	}
	const recipe = {
		...data,
		userId,
	};
	await recipeRepository.create(recipe);
}

async function getRecipes(pageNumber: number) {
	const skip = 10 * (pageNumber - 1);
	const recipes = await recipeRepository.getRecipes(skip);
	const recipesWithAvgRating = recipes.map((recipe) => {
		return calculateRatingAVG(recipe);
	});
	return recipesWithAvgRating;
}

async function getUserRecipes(userId: number) {
	const recipes = await recipeRepository.getUserRecipes(userId);
	const recipesWithAvgRating = recipes.map((recipe) => {
		return calculateRatingAVG(recipe);
	});
	return recipesWithAvgRating;
}

async function getRecipeById(recipeId: number) {
	const recipe = await recipeRepository.getRecipeById(recipeId);
	const recipeWithAvgRating = calculateRatingAVG(recipe);
	return recipeWithAvgRating;
}

async function getRecipesByTitle(title: string) {
	const recipes = await recipeRepository.getRecipesByTitle(title);
	return recipes;
}

async function getRecipesQty() {
	const quantity = await recipeRepository.getRecipesQty();
	return quantity;
}

function calculateRatingAVG(
	recipe: RecipesWithoutAvgRating
): RecipesWithAvgRating {
	const ratingsCount = recipe.ratings.length;
	const ratingsTotal = recipe.ratings.reduce((acc, cur) => acc + cur.rating, 0);
	const AVG = ratingsCount === 0 ? 0 : ratingsTotal / ratingsCount;
	return {
		...recipe,
		ratings: AVG,
	};
}

export const recipeService = {
	create,
	getRecipes,
	getUserRecipes,
	getRecipeById,
	getRecipesByTitle,
	getRecipesQty,
};
