import { Recipe_Ingredient } from "@prisma/client";
import { Recipe } from "@prisma/client";
import { ratingRepository } from "../repositories/ratingRepository.js";
import { recipeRepository } from "../repositories/recipeRepository.js";

import {
	conflictError,
	notFoundError,
	unauthorizedError,
} from "../utils/errorUtil.js";

export type InputRecipeData = Omit<CreateRecipeData, "userId">;
export type CreateRecipeData = Omit<Recipe, "id" | "createdAt">;

export type CreateRecipe_ingredientData = Omit<Recipe_Ingredient, "id">;
export type InputRecipe_IngredientData = Omit<
	CreateRecipe_ingredientData,
	"recipeId"
>;

export interface RecipesWithoutAvgRating {
	ratings: {
		rating: number;
	}[];
	id: number;
	user: {
		id: number;
		avatar: string;
		username: string;
	};
}

export interface RecipesWithAvgRating {
	ratings: { ratingAVG: number; ratingsCount: number };
	id: number;
	user: {
		id: number;
		avatar: string;
		username: string;
	};
}

async function createRecipe(data: InputRecipeData, userId: number) {
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
	return await recipeRepository.createRecipe(recipe);
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

	if (!recipe) {
		throw notFoundError("Recipe does not exist");
	}

	const recipeRatings = await ratingRepository.getRatingsByRecipeId(recipeId);

	const recipeWithAvgRating = calculateRatingAVG(recipe);
	return {
		...recipeWithAvgRating,
		ratings: { ...recipeWithAvgRating.ratings, recipeRatings },
	};
}

async function getRecipesByTitle(title: string) {
	const recipes = await recipeRepository.getRecipesByTitle(title);
	return recipes;
}

async function getRecipesQty() {
	const quantity = await recipeRepository.getRecipesQty();
	return quantity;
}

async function createManyRecipe_Ingredient(
	recipeId: number,
	ingredients: InputRecipe_IngredientData[]
) {
	const filteredIngredients = filterRepeatedIngredients(ingredients);

	const ingredientsWithRecipeId = filteredIngredients.map((ingredient) => {
		return {
			...ingredient,
			recipeId,
		};
	});

	await recipeRepository.createManyRecipe_Ingredient(ingredientsWithRecipeId);
}

async function deleteRecipe(recipeId: number, userId: number) {
	const existingRecipe = await recipeRepository.getRecipeById(recipeId);

	if (!existingRecipe) {
		throw notFoundError("Recipe does not exist!");
	}

	if (existingRecipe.user.id !== userId) {
		throw unauthorizedError("You are not allowed to delete this recipe!");
	}

	await recipeRepository.deleteRecipes_Ingredients(recipeId);
	await ratingRepository.deleteRecipeRatings(recipeId);
	await recipeRepository.deleteRecipe(recipeId);
}

function calculateRatingAVG(
	recipe: RecipesWithoutAvgRating
): RecipesWithAvgRating {
	const ratingsCount = recipe.ratings.length;
	const ratingsTotal = recipe.ratings.reduce((acc, cur) => acc + cur.rating, 0);
	const AVG = ratingsCount === 0 ? 0 : ratingsTotal / ratingsCount;
	return {
		...recipe,
		ratings: { ratingAVG: AVG, ratingsCount: ratingsCount },
	};
}

function filterRepeatedIngredients(ingredients: InputRecipe_IngredientData[]) {
	const hash = {};

	ingredients.forEach((ingredient) => {
		if (!hash[ingredient.ingredientId]) {
			hash[ingredient.ingredientId] = ingredient.ingredientQty;
		}
	});

	const hashEntries = Object.entries(hash);
	const filteredIngredients = hashEntries.map((entry) => {
		return {
			ingredientId: Number(entry[0]),
			ingredientQty: String(entry[1]),
		};
	});
	return filteredIngredients;
}

export const recipeService = {
	createRecipe,
	getRecipes,
	getUserRecipes,
	getRecipeById,
	getRecipesByTitle,
	getRecipesQty,
	createManyRecipe_Ingredient,
	deleteRecipe,
};
