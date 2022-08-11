import Joi from "joi";
import { InputRecipeData } from "../services/recipeService";

const recipeSchema = Joi.object<InputRecipeData>({
	title: Joi.string().required(),
	howToPrepare: Joi.string().required(),
	mealFor: Joi.number().required(),
	time: Joi.number().required(),
	image: Joi.string().required(),
});

export default recipeSchema;
