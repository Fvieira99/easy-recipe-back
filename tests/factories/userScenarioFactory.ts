import { prisma } from "../../src/database/database.js";
import { CreateUserData } from "../../src/services/userService.js";
import bcrypt from "bcrypt";

async function existingUserScenario(data: CreateUserData) {
	return await prisma.user.create({
		data: { ...data, password: bcrypt.hashSync(data.password, 10) },
	});
}

export const userScenarioFactory = {
	existingUserScenario,
};
