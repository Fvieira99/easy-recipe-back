import { Router } from "express";
import userRouter from "./userRouter.js";
import recipeRouter from "./recipeRouter.js";
import ingredientRouter from "./ingredientRouter.js";
import ratingRouter from "./ratingRouter.js";

const router = Router();

router.use(userRouter);
router.use(recipeRouter);
router.use(ingredientRouter);
router.use(ratingRouter);

export default router;
