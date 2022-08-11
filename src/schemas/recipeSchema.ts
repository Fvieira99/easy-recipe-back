import Joi from "joi";
import {
	InputRecipeData,
	InputRecipe_IngredientData,
} from "../services/recipeService";

export interface RecipeSchemaData {
	title: string;
	howToPrepare: string;
	mealFor: number;
	time: number;
	image: string;
	ingredients: InputRecipe_IngredientData[];
}

const recipe_ingredientSchema = Joi.object<InputRecipe_IngredientData>({
	ingredientId: Joi.number().required(),
	ingredientQty: Joi.string().required(),
});

const recipeSchema = Joi.object<RecipeSchemaData>({
	title: Joi.string().required(),
	howToPrepare: Joi.string().required(),
	mealFor: Joi.string().required(),
	time: Joi.string().required(),
	image: Joi.string().uri().required(),
	ingredients: Joi.array().items(recipe_ingredientSchema).required(),
});

export default recipeSchema;
