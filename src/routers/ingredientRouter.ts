import { Router } from "express";
import { ingredientController } from "../controllers/ingredientController.js";

const ingredientRouter = Router();

ingredientRouter.get("/ingredients", ingredientController.getIngredients);

export default ingredientRouter;
