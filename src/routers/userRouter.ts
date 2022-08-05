import { Router } from "express";
import { userController } from "../controllers/userController.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import signInSchema from "../schemas/signInSchema.js";
import signUpSchema from "../schemas/signUpSchema.js";

const userRouter = Router();

userRouter.post("/signup", validateSchema(signUpSchema), userController.signup);
userRouter.post("/signin", validateSchema(signInSchema), userController.signin);

export default userRouter;
