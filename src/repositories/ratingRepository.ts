import { prisma } from "../database/database.js";
import { CreateRatingData } from "../services/ratingService.js";

async function getRatingsByRecipeId(recipeId: number) {
	return await prisma.rating.findMany({
		select: {
			id: true,
			user: {
				select: {
					avatar: true,
					id: true,
					username: true,
				},
			},
			rating: true,
			comment: true,
		},
		where: {
			recipeId,
		},
	});
}

async function createRating(data: CreateRatingData) {
	await prisma.rating.create({
		data,
	});
}

async function getRatingById(id: number) {
	return await prisma.rating.findUnique({
		where: {
			id,
		},
	});
}

async function deleteRating(id: number) {
	await prisma.rating.delete({
		where: {
			id,
		},
	});
}

export const ratingRepository = {
	getRatingsByRecipeId,
	createRating,
	getRatingById,
	deleteRating,
};
