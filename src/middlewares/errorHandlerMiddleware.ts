import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errorUtil.js";

const typeToStatusCode = {
	conflict: 409,
	not_found: 404,
	unauthorized: 401,
	wrong_schema: 422,
};

export function errorHandler(
	error: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log(error);
	if (error.type) {
		return res.status(typeToStatusCode[error.type]).send(error.message);
	}
	res.sendStatus(500);
}
