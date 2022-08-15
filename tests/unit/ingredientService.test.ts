import { jest } from "@jest/globals";
import { ingredientRepository } from "../../src/repositories/ingredientRepository";
import { ingredientService } from "../../src/services/ingredientService";

beforeEach(() => {
	jest.clearAllMocks();
	jest.resetAllMocks();
});

describe("Ingredient service unit test suit", () => {
	it("Should return ingredients", async () => {
		const ingredients = [
			{
				id: 1,
				name: "Feijão",
			},
		];

		jest
			.spyOn(ingredientRepository, "getIngredients")
			.mockImplementationOnce((): any => {
				return ingredients;
			});
		const ingredientsReturn = await ingredientService.getIngredients();

		expect(ingredientsReturn.length).toBeGreaterThanOrEqual(1);
		expect(ingredientsReturn[0].name).toEqual("Feijão");
		expect(ingredientRepository.getIngredients).toBeCalledTimes(1);
	});
});
