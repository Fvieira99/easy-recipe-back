import { Request, Response } from "express";
import { InputRatingData, ratingService } from "../services/ratingService.js";

async function createRating(req: Request, res: Response) {
	const data: InputRatingData = req.body;
	const { userId }: { userId: number } = res.locals.user;

	await ratingService.createRating(data, userId);
	res.sendStatus(201);
}

async function deleteRating(req: Request, res: Response) {
	const ratingId: number = Number(req.params.ratingId);

	const { userId }: { userId: number } = res.locals.user;

	await ratingService.deleteRating(ratingId, userId);

	res.sendStatus(204);
}

export const ratingController = {
	createRating,
	deleteRating,
};
