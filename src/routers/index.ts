import { Router } from "express";
import userRouter from "./userRouter.js";
import recipeRouter from "./recipeRouter.js";
import ingredientRouter from "./ingredientRouter.js";

const router = Router();

router.use(userRouter);
router.use(recipeRouter);
router.use(ingredientRouter);

export default router;
