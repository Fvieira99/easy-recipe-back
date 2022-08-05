import { prisma } from "../database/database.js";
import { CreateUserData } from "../services/userService.js";

async function create(data: CreateUserData) {
	await prisma.user.create({ data });
}

async function findByEmailOrUsername(email: string, username: string) {
	return await prisma.user.findFirst({
		where: {
			OR: [{ email }, { username }],
		},
	});
}

async function findByEmail(email: string) {
	return await prisma.user.findUnique({
		where: { email },
	});
}

export const userRepository = {
	create,
	findByEmailOrUsername,
	findByEmail,
};
