import { Request, Response } from "express";
import {
	userService,
	CreateUserData,
	LoginUserData,
} from "../services/userService.js";

async function signup(req: Request, res: Response) {
	const data: CreateUserData = req.body;
	await userService.signup(data);
	res.sendStatus(201);
}

async function signin(req: Request, res: Response) {
	const data: LoginUserData = req.body;
	const user = await userService.signin(data);
	res.status(200).send(user);
}

export const userController = {
	signup,
	signin,
};
