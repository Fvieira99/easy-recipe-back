import jwt, { JsonWebTokenError } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { unauthorizedError } from "../utils/errorUtil.js";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET;

export default function validateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authorization = req.headers["authorization"];
	const token = authorization?.replace("Bearer ", "");
	if (!token) {
		throw unauthorizedError("You don't have a token!");
	}

	const user = jwt.verify(token, JWT_SECRET_KEY, verifyIfTokenIsValid);
	res.locals.user = user;
	next();
}

function verifyIfTokenIsValid(err: JsonWebTokenError, decoded) {
	if (err) {
		throw unauthorizedError("Your token is not valid!");
	}

	return decoded;
}
