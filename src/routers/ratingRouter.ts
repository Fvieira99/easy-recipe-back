import { Router } from "express";
import { ratingController } from "../controllers/ratingController.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import validateToken from "../middlewares/validateTokenMiddleware.js";
import ratingSchema from "../schemas/ratingSchema.js";

const ratingRouter = Router();

ratingRouter.use(validateToken);

ratingRouter.delete("/ratings/:ratingId", ratingController.deleteRating);
ratingRouter.post(
	"/ratings",
	validateSchema(ratingSchema),
	ratingController.createRating
);

export default ratingRouter;
