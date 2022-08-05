import Joi from "joi";
import { CreateUserData } from "../services/userService.js";

const signUpSchema = Joi.object<CreateUserData>({
	username: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(5).required(),
});

export default signUpSchema;
