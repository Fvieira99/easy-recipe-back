import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userRepository } from "../repositories/userRepository.js";
import { conflictError, unauthorizedError } from "../utils/errorUtil.js";

dotenv.config();

export type CreateUserData = Omit<User, "id" | "createAt">;
export type LoginUserData = Omit<CreateUserData, "username" | "avatar">;

async function signup(data: CreateUserData) {
	const existingUser = await userRepository.findByEmailOrUsername(
		data.email,
		data.username
	);
	if (existingUser) {
		throw conflictError("User already exists!");
	}

	const newUser = { ...data, password: encryptPassword(data.password) };

	await userRepository.create(newUser);
}

async function signin(data: LoginUserData) {
	const existingUser = await userRepository.findByEmail(data.email);
	if (
		!existingUser ||
		!isCorrectPassword(data.password, existingUser.password)
	) {
		throw unauthorizedError("Invalid credentials!");
	}
	const token = generateToken(existingUser.id);

	return token;
}

function encryptPassword(password: string) {
	const SALT = 10;
	return bcrypt.hashSync(password, SALT);
}

function generateToken(id: number) {
	const JWT_DATA = { userId: id };
	const JWT_KEY = process.env.JWT_SECRET;
	const JWT_CONFIG = { expiresIn: 60 * 60 };

	return jwt.sign(JWT_DATA, JWT_KEY, JWT_CONFIG);
}

function isCorrectPassword(inputPassword: string, userPassword: string) {
	return bcrypt.compareSync(inputPassword, userPassword);
}

export const userService = {
	signup,
	signin,
	encryptPassword,
};
