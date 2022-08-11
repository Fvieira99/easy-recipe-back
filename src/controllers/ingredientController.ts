import { Request, Response } from "express";
import { ingredientService } from "../services/ingredientService.js";

async function getIngredients(req: Request, res: Response) {
	const ingredients = await ingredientService.getIngredients();
	res.send({ ingredients });
}

export const ingredientController = {
	getIngredients,
};
