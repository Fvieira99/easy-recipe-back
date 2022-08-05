import Joi from "joi";
import { LoginUserData } from "../services/userService.js";

const signInSchema = Joi.object<LoginUserData>({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export default signInSchema;
