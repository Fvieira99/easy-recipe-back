import Joi from "joi";

import { InputRatingData } from "../services/ratingService.js";

const ratingSchema = Joi.object<InputRatingData>({
	rating: Joi.number().required(),
	comment: Joi.string().required(),
	recipeId: Joi.number().required(),
});

export default ratingSchema;
