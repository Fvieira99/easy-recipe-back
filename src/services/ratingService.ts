import { ratingRepository } from "../repositories/ratingRepository.js";
import { Rating } from "@prisma/client";
import {
	conflictError,
	notFoundError,
	unauthorizedError,
} from "../utils/errorUtil.js";
import { recipeRepository } from "../repositories/recipeRepository.js";

export type CreateRatingData = Omit<Rating, "createdAt" | "id">;
export type InputRatingData = Omit<CreateRatingData, "userId">;
interface rating {
	id: number;
	rating: number;
	comment: string;
	user: {
		id: number;
		avatar: string;
		username: string;
	};
}

async function createRating(data: InputRatingData, userId: number) {
	const existingRecipe = await recipeRepository.getRecipeById(data.recipeId);
	if (!existingRecipe) {
		throw notFoundError("This recipe does not exist!");
	}

	const ratings = await ratingRepository.getRatingsByRecipeId(data.recipeId);

	if (verifyIfUserHasRating(ratings, userId)) {
		throw conflictError("You already rated this recipe!");
	}
	return await ratingRepository.createRating({ ...data, userId });
}

async function deleteRating(ratingId: number, userId: number) {
	const existingRating = await ratingRepository.getRatingById(ratingId);
	if (!existingRating) {
		throw notFoundError("Rating does not exist!");
	}
	if (existingRating.userId !== userId) {
		throw unauthorizedError("You are not allowed to delete this rating!");
	}
	await ratingRepository.deleteRating(ratingId);
}

function verifyIfUserHasRating(ratings: rating[], userId: number) {
	const filteredRatings = ratings.filter((rating) => rating.user.id === userId);

	if (filteredRatings.length === 0) {
		return false;
	}

	return true;
}

export const ratingService = {
	createRating,
	deleteRating,
};
