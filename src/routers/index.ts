import { Router } from "express";
import userRouter from "./userRouter.js";
import recipeRouter from "./recipeRouter.js";

const router = Router();

router.use(userRouter);
router.use(recipeRouter);

export default router;
