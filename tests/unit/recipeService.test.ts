import { recipeService } from "../../src/services/recipeService";
import { recipeRepository } from "../../src/repositories/recipeRepository";
import { jest } from "@jest/globals";
import { recipeFactory } from "../factories/recipeFactory";
import { ratingRepository } from "../../src/repositories/ratingRepository";

beforeEach(() => {
	jest.clearAllMocks();
	jest.resetAllMocks();
});

describe("Recipe Unit Test!", () => {
	jest
		.spyOn(recipeRepository, "createRecipe")
		.mockImplementation((): any => {});

	jest
		.spyOn(recipeRepository, "getRecipeByTitleAndUserId")
		.mockImplementation((): any => {});

	jest
		.spyOn(recipeRepository, "createManyRecipe_Ingredient")
		.mockImplementation((): any => {});

	jest
		.spyOn(recipeRepository, "deleteRecipes_Ingredients")
		.mockImplementation((): any => {});

	jest
		.spyOn(recipeRepository, "deleteRecipe")
		.mockImplementation((): any => {});

	jest
		.spyOn(ratingRepository, "deleteRecipeRatings")
		.mockImplementationOnce((): any => {});

	it("Should create recipe", async () => {
		const recipe = recipeFactory.createRecipe();
		const userId = 1;

		jest
			.spyOn(recipeRepository, "createRecipe")
			.mockImplementationOnce((): any => {
				return {
					...recipe,
					userId,
				};
			});

		const createdRecipe = await recipeService.createRecipe(recipe, userId);

		expect(createdRecipe).not.toBeNull();
		expect(createdRecipe.userId).toEqual(userId);
		expect(recipeRepository.getRecipeByTitleAndUserId).toBeCalledTimes(1);
		expect(recipeRepository.createRecipe).toBeCalledTimes(1);
	});

	it("Should not create recipe if user already has one with same title", () => {
		const recipe = recipeFactory.createRecipe();
		const userId = 1;

		jest
			.spyOn(recipeRepository, "getRecipeByTitleAndUserId")
			.mockImplementationOnce((): any => {
				return {
					...recipe,
					userId,
				};
			});

		const promise = recipeService.createRecipe(recipe, userId);

		expect(recipeRepository.getRecipeByTitleAndUserId).toBeCalledTimes(1);
		expect(promise).rejects.toEqual({
			type: "conflict",
			message: "Already exists a recipe with the same title!",
		});
		expect(recipeRepository.createRecipe).not.toBeCalled();
	});

	it("Should get recipes with avg", async () => {
		jest
			.spyOn(recipeRepository, "getRecipes")
			.mockImplementationOnce((): any => {
				return [{ ratings: [{ rating: 4 }, { rating: 3 }] }];
			});

		const recipes = await recipeService.getRecipes(1);
		expect(recipes[0].ratings.ratingAVG).toBe(3.5);
		expect(recipes[0].ratings.ratingsCount).toBe(2);
		expect(recipes).not.toBeNull();
		expect(recipeRepository.getRecipes).toBeCalledTimes(1);
	});

	it("Should get recipes avg with zero ratings", async () => {
		jest
			.spyOn(recipeRepository, "getRecipes")
			.mockImplementationOnce((): any => {
				return [{ ratings: [] }];
			});

		const recipes = await recipeService.getRecipes(1);
		expect(recipes[0].ratings.ratingAVG).toBe(0);
		expect(recipes[0].ratings.ratingsCount).toBe(0);
		expect(recipes).not.toBeNull();
		expect(recipeRepository.getRecipes).toBeCalledTimes(1);
	});

	it("Should get user recipes with avg", async () => {
		const userId = 1;
		jest
			.spyOn(recipeRepository, "getUserRecipes")
			.mockImplementationOnce((): any => {
				return [{ user: { id: 1 }, ratings: [{ rating: 4 }, { rating: 3 }] }];
			});

		const recipes = await recipeService.getUserRecipes(1);
		expect(recipes[0].ratings.ratingAVG).toBe(3.5);
		expect(recipes[0].user.id).toBe(userId);
		expect(recipes).not.toBeNull();
		expect(recipeRepository.getUserRecipes).toBeCalledTimes(1);
	});

	it("Should get recipe given recipe id", async () => {
		const recipeId = 1;

		jest
			.spyOn(recipeRepository, "getRecipeById")
			.mockImplementationOnce((): any => {
				return {
					id: 1,
					ratings: [{ rating: 4 }, { rating: 3 }],
				};
			});

		jest
			.spyOn(ratingRepository, "getRatingsByRecipeId")
			.mockImplementation((): any => {
				return [{ rating: 4 }, { rating: 3 }];
			});

		const recipe = await recipeService.getRecipeById(recipeId);

		expect(recipe.ratings.ratingAVG).toBe(3.5);
		expect(recipe.ratings.ratingsCount).toBe(2);
		expect(recipe.ratings.recipeRatings.length).toBe(2);
		expect(recipeRepository.getRecipeById).toBeCalledTimes(1);
		expect(ratingRepository.getRatingsByRecipeId).toBeCalledTimes(1);
	});

	it("Should not get recipe given nonexisting recipe id", () => {
		const recipeId = 1;

		const promise = recipeService.getRecipeById(recipeId);

		expect(recipeRepository.getRecipeById).toBeCalledTimes(1);
		expect(ratingRepository.getRatingsByRecipeId).toBeCalledTimes(0);
		expect(promise).rejects.toEqual({
			type: "not_found",
			message: "Recipe does not exist",
		});
	});

	it("Should get recipes by title", async () => {
		const title = "Title";

		jest
			.spyOn(recipeRepository, "getRecipesByTitle")
			.mockImplementationOnce((): any => {
				return [
					{
						title,
					},
				];
			});

		const recipes = await recipeService.getRecipesByTitle(title);

		expect(recipes.length).toBeGreaterThan(0);
		expect(recipes[0].title).toEqual(title);
		expect(recipeRepository.getRecipesByTitle).toBeCalledTimes(1);
	});

	it("Should get recipes quantity", async () => {
		jest
			.spyOn(recipeRepository, "getRecipesQty")
			.mockImplementationOnce((): any => {
				return 1;
			});

		const recipesQty = await recipeService.getRecipesQty();

		expect(recipesQty).toEqual(1);
		expect(recipeRepository.getRecipesQty).toBeCalledTimes(1);
	});

	it("Should create many Recipe_Ingredient", async () => {
		const recipeId = 1;
		const ingredients = [
			{ ingredientId: 1, ingredientQty: "100g" },
			{ ingredientId: 1, ingredientQty: "300g" },
			{ ingredientId: 3, ingredientQty: "200g" },
		];

		await recipeService.createManyRecipe_Ingredient(recipeId, ingredients);

		expect(recipeRepository.createManyRecipe_Ingredient).toBeCalledTimes(1);
	});

	it("Should delete recipe", async () => {
		const recipeId = 1;
		const userId = 1;

		jest
			.spyOn(recipeRepository, "getRecipeById")
			.mockImplementationOnce((): any => {
				return {
					user: {
						id: 1,
					},
				};
			});

		await recipeService.deleteRecipe(recipeId, userId);

		expect(recipeRepository.deleteRecipes_Ingredients).toBeCalledTimes(1);
		expect(ratingRepository.deleteRecipeRatings).toBeCalledTimes(1);
		expect(recipeRepository.deleteRecipe).toBeCalledTimes(1);
	});

	it("Should not delete recipe given nonexisting recipeId", () => {
		const recipeId = 1;
		const userId = 1;

		const promise = recipeService.deleteRecipe(recipeId, userId);

		expect(promise).rejects.toEqual({
			type: "not_found",
			message: "Recipe does not exist!",
		});
		expect(recipeRepository.deleteRecipes_Ingredients).toBeCalledTimes(0);
		expect(ratingRepository.deleteRecipeRatings).toBeCalledTimes(0);
		expect(recipeRepository.deleteRecipe).toBeCalledTimes(0);
	});

	it("Should not delete recipe given nonexisting recipeId", () => {
		const recipeId = 1;
		const userId = 1;

		jest
			.spyOn(recipeRepository, "getRecipeById")
			.mockImplementationOnce((): any => {
				return {
					user: {
						id: 2,
					},
				};
			});

		const promise = recipeService.deleteRecipe(recipeId, userId);

		expect(promise).rejects.toEqual({
			type: "unauthorized",
			message: "You are not allowed to delete this recipe!",
		});
		expect(recipeRepository.deleteRecipes_Ingredients).toBeCalledTimes(0);
		expect(ratingRepository.deleteRecipeRatings).toBeCalledTimes(0);
		expect(recipeRepository.deleteRecipe).toBeCalledTimes(0);
	});
});
