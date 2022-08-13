import { Router } from "express";

import validateToken from "../middlewares/validateTokenMiddleware.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import { recipeController } from "../controllers/recipeController.js";
import recipeSchema from "../schemas/recipeSchema.js";

const recipeRouter = Router();

recipeRouter.use(validateToken);

recipeRouter.post(
	"/recipes",
	validateSchema(recipeSchema),
	recipeController.create
);

recipeRouter.get("/recipes", recipeController.getRecipes);

recipeRouter.get("/profile/recipes", recipeController.getUserRecipes);

recipeRouter.delete("/recipes/recipe/:recipeId", recipeController.deleteRecipe);

recipeRouter.get("/recipes/recipe/:recipeId", recipeController.getRecipeById);

recipeRouter.get("/recipes/search", recipeController.getRecipesByTitle);

recipeRouter.get("/recipes/quantity", recipeController.getRecipesQty);

export default recipeRouter;
