import { Request, Response } from "express";
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
	const data: InputRecipeData = req.body;
	const { userId }: { userId: number } = res.locals.user;
	await recipeService.create(data, userId);
	res.sendStatus(201);
}

async function getUserRecipes(req: Request, res: Response) {
	const userId: number = Number(req.params.userId);
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

export const recipeController = {
	create,
	getRecipes,
	getUserRecipes,
	getRecipeById,
	getRecipesQty,
	getRecipesByTitle,
};
