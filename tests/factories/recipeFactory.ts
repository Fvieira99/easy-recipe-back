import { faker, FakerError } from "@faker-js/faker";
import { InputRecipeData } from "../../src/services/recipeService";

function createRecipe(): InputRecipeData {
	const recipe = {
		title: faker.lorem.slug(),
		image: faker.internet.avatar(),
		mealFor: 2,
		time: 15,
		howToPrepare: faker.lorem.sentences(),
	};

	return recipe;
}

export const recipeFactory = {
	createRecipe,
};
