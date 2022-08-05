import { faker } from "@faker-js/faker";
import { CreateUserData } from "../../src/services/userService.js";

function createData(passwordLength = 5): CreateUserData {
	const user = {
		username: faker.name.firstName(),
		email: faker.internet.email(),
		avatar: faker.internet.avatar(),
		password: faker.internet.password(passwordLength),
	};

	return user;
}

export const userFactory = { createData };
