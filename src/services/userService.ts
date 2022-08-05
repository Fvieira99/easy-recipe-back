import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { userRepository } from "../repositories/userRepository.js";
import { conflictError, notFoundError } from "../utils/errorUtil.js";

dotenv.config();

export type CreateUserData = Omit<User, "id" | "createAt">;
export type LoginUserData = Omit<CreateUserData, "username">;

async function signup(data: CreateUserData) {
	const existingUser = await userRepository.findByEmailOrUsername(
		data.email,
		data.username
	);
	if (existingUser) {
		throw conflictError("User already exists!");
	}

	const newUser = { ...data, password: encryptPW(data.password) };

	await userRepository.create(newUser);
}

async function signin(data: LoginUserData) {
	const existingUser = await userRepository.findByEmail(data.email);
	if (!existingUser) {
		throw notFoundError("User not found!");
	}
	const token = generateToken(existingUser.id);
	console.log(token);
	return token;
}

function encryptPW(password: string) {
	const SALT = 10;
	return bcrypt.hashSync(password, SALT);
}

function generateToken(id: number) {
	const JWT_DATA = { userId: id };
	const JWT_KEY = process.env.JWT_SECRET;
	const JWT_CONFIG = { expiresIn: 60 * 60 };

	return jwt.sign(JWT_DATA, JWT_KEY, JWT_CONFIG);
}

export const userService = {
	signup,
	signin,
};
