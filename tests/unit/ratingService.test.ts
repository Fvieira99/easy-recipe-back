import { jest } from "@jest/globals";
import { ratingRepository } from "../../src/repositories/ratingRepository";
import { recipeRepository } from "../../src/repositories/recipeRepository";
import { ratingService } from "../../src/services/ratingService";

beforeEach(() => {
	jest.clearAllMocks();
	jest.resetAllMocks();
});

describe("Rating service unit test suit", () => {
	jest
		.spyOn(recipeRepository, "getRecipeById")
		.mockImplementation((): any => {});

	jest
		.spyOn(ratingRepository, "getRatingsByRecipeId")
		.mockImplementation((): any => {});

	jest
		.spyOn(ratingRepository, "createRating")
		.mockImplementation((): any => {});

	jest
		.spyOn(ratingRepository, "getRatingById")
		.mockImplementationOnce((): any => {});

	jest
		.spyOn(ratingRepository, "deleteRating")
		.mockImplementationOnce((): any => {});

	it("Should create rating", async () => {
		const rating = {
			recipeId: 1,
			rating: 3,
			comment: "teste",
		};
		const userId = 1;

		jest
			.spyOn(recipeRepository, "getRecipeById")
			.mockImplementationOnce((): any => {
				return {
					id: 1,
				};
			});

		jest
			.spyOn(ratingRepository, "getRatingsByRecipeId")
			.mockImplementationOnce((): any => {
				return [{ user: { id: 2 } }];
			});

		await ratingService.createRating(rating, userId);

		expect(recipeRepository.getRecipeById).toBeCalledTimes(1);
		expect(ratingRepository.getRatingsByRecipeId).toBeCalledTimes(1);
		expect(ratingRepository.createRating).toBeCalledTimes(1);
	});

	it("Should not create rating given nonexisting recipeId", () => {
		const rating = {
			recipeId: 3,
			rating: 4,
			comment: "teste",
		};

		const userId = 1;

		const promise = ratingService.createRating(rating, userId);

		expect(recipeRepository.getRecipeById).toBeCalledTimes(1);
		expect(ratingRepository.getRatingsByRecipeId).toBeCalledTimes(0);
		expect(ratingRepository.createRating).toBeCalledTimes(0);
		expect(promise).rejects.toEqual({
			type: "not_found",
			message: "This recipe does not exist!",
		});
	});

	it("Should not create rating if user already rated recipe", () => {
		const rating = {
			recipeId: 3,
			rating: 4,
			comment: "teste",
		};

		const userId = 1;

		jest
			.spyOn(recipeRepository, "getRecipeById")
			.mockImplementationOnce((): any => {
				return {
					id: 1,
				};
			});

		jest
			.spyOn(ratingRepository, "getRatingsByRecipeId")
			.mockImplementationOnce((): any => {
				return [
					{
						...rating,
						user: { id: 1, avatar: "teste", username: "name" },
					},
				];
			});

		const promise = ratingService.createRating(rating, userId);

		expect(promise).rejects.toEqual({
			type: "conflict",
			message: "You already rated this recipe!",
		});
		expect(recipeRepository.getRecipeById).toBeCalledTimes(1);
		expect(ratingRepository.getRatingsByRecipeId).toBeCalledTimes(0);
		expect(ratingRepository.createRating).toBeCalledTimes(0);
	});

	it("Should delete rating", async () => {
		const userId = 1;
		const ratingId = 1;

		jest
			.spyOn(ratingRepository, "getRatingById")
			.mockImplementationOnce((): any => {
				return {
					recipeId: 3,
					rating: 4,
					comment: "teste",
					userId: 1,
				};
			});

		await ratingService.deleteRating(ratingId, userId);
		expect(ratingRepository.getRatingById).toBeCalledTimes(1);
		expect(ratingRepository.deleteRating).toBeCalledTimes(1);
	});

	it("Should not delete rating given nonexisting ratingId", () => {
		const userId = 1;
		const ratingId = 1;

		const promise = ratingService.deleteRating(ratingId, userId);
		expect(promise).rejects.toEqual({
			type: "not_found",
			message: "Rating does not exist!",
		});
		expect(ratingRepository.getRatingById).toBeCalledTimes(1);
		expect(ratingRepository.deleteRating).toBeCalledTimes(0);
	});

	it("Should not delete rating given wrong user id", () => {
		const userId = 1;
		const ratingId = 1;

		jest
			.spyOn(ratingRepository, "getRatingById")
			.mockImplementationOnce((): any => {
				return {
					recipeId: 3,
					rating: 4,
					comment: "teste",
					userId: 2,
				};
			});

		const promise = ratingService.deleteRating(ratingId, userId);
		expect(promise).rejects.toEqual({
			type: "unauthorized",
			message: "You are not allowed to delete this rating!",
		});
		expect(ratingRepository.getRatingById).toBeCalledTimes(1);
		expect(ratingRepository.deleteRating).toBeCalledTimes(0);
	});
});
