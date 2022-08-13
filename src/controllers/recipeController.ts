import { Request, Response } from "express";
import { RecipeSchemaData } from "../schemas/recipeSchema.js";
import { InputRecipeData, recipeService } from "../services/recipeService.js";

async function getRecipes(req: Request, res: Response) {
	const pageNumber: number = Number(req.query.page);

	const recipes = await recipeService.getRecipes(pageNumber);

	res.send(recipes);
}

async function getRecipesQty(req: Request, res: Response) {
	const quantity = await recipeService.getRecipesQty();
	res.send({ quantity });
}

async function create(req: Request, res: Response) {
	const {
		title,
		howToPrepare,
		image,
		mealFor,
		time,
		ingredients,
	}: RecipeSchemaData = req.body;

	const { userId }: { userId: number } = res.locals.user;

	const recipeData = {
		title,
		howToPrepare,
		image,
		mealFor: Number(mealFor),
		time: Number(time),
	};
	const createdRecipe = await recipeService.createRecipe(recipeData, userId);

	await recipeService.createManyRecipe_Ingredient(
		createdRecipe.id,
		ingredients
	);

	res.sendStatus(201);
}

async function getUserRecipes(req: Request, res: Response) {
	const { userId }: { userId: number } = res.locals.user;
	const recipes = await recipeService.getUserRecipes(userId);
	res.send(recipes);
}

async function getRecipeById(req: Request, res: Response) {
	const recipeId: number = Number(req.params.recipeId);
	const recipe = await recipeService.getRecipeById(recipeId);
	res.send(recipe);
}

async function getRecipesByTitle(req: Request, res: Response) {
	const title: string = req.query.name.toString();
	const recipes = await recipeService.getRecipesByTitle(title);
	res.send(recipes);
}

async function deleteRecipe(req: Request, res: Response) {
	const recipeId: number = Number(req.params.recipeId);

	console.log(recipeId);

	const { userId }: { userId: number } = res.locals.user;

	await recipeService.deleteRecipe(recipeId, userId);
	res.sendStatus(204);
}

export const recipeController = {
	create,
	getRecipes,
	getUserRecipes,
	getRecipeById,
	getRecipesQty,
	getRecipesByTitle,
	deleteRecipe,
};
