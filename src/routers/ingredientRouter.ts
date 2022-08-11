import { Router } from "express";
import { ingredientController } from "../controllers/ingredientController.js";

const ingredientRouter = Router();

ingredientRouter.get("/ingredients", ingredientController.getIngredients);
ingredientRouter.post("/recipes-ingredients");

export default ingredientRouter;
