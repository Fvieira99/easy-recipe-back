import { Prisma } from "@prisma/client";
import { prisma } from "../database/database.js";
import {
	CreateRecipeData,
	CreateRecipe_ingredientData,
} from "../services/recipeService.js";

async function getRecipeById(recipeId: number) {
	return await prisma.recipe.findFirst({
		select: {
			user: {
				select: { id: true, avatar: true, username: true },
			},
			id: true,
			ratings: {
				select: { rating: true },
			},
			title: true,
		},
		where: {
			id: recipeId,
		},
	});
}

async function getRecipes(skip: number) {
	return await prisma.recipe.findMany({
		select: {
			user: {
				select: { id: true, avatar: true, username: true },
			},
			id: true,
			ratings: {
				select: { rating: true },
			},
			title: true,
		},
		skip,
		take: 10,
		orderBy: { createdAt: "desc" },
	});
}

async function getUserRecipes(userId: number) {
	return await prisma.recipe.findMany({
		select: {
			user: {
				select: { id: true, avatar: true, username: true },
			},
			id: true,
			ratings: {
				select: { rating: true },
			},
			title: true,
		},
		orderBy: { createdAt: "desc" },
		where: {
			userId,
		},
	});
}

async function getRecipeByTitleAndUserId(title: string, userId: number) {
	return await prisma.recipe.findFirst({
		where: { userId, title },
	});
}

async function createRecipe(data: CreateRecipeData) {
	return await prisma.recipe.create({ data });
}

async function createManyRecipe_Ingredient(
	data: CreateRecipe_ingredientData[]
) {
	await prisma.recipe_Ingredient.createMany({ data });
}

async function getRecipesByTitle(title: string) {
	return await prisma.recipe.findMany({
		where: {
			title: {
				startsWith: title,
				mode: "insensitive",
			},
		},
	});
}

async function getRecipesQty() {
	return await prisma.recipe.count();
}

export const recipeRepository = {
	createRecipe,
	getRecipes,
	getUserRecipes,
	getRecipeById,
	getRecipeByTitleAndUserId,
	getRecipesByTitle,
	getRecipesQty,
	createManyRecipe_Ingredient,
};
