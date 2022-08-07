import Joi from "joi";
import { InputRecipeData } from "../services/recipeService";

const recipeSchema = Joi.object<InputRecipeData>({
	title: Joi.string().required(),
	howToPrepare: Joi.string().required(),
	ingredients: Joi.array().items(Joi.string()).required(),
	mealFor: Joi.number().required(),
	time: Joi.number().required(),
});

export default recipeSchema;
