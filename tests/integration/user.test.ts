import { prisma } from "../../src/database/database.js";
import supertest from "supertest";

import app from "../../src/app.js";
import { userFactory } from "../factories/userFactory.js";
import { userRepository } from "../../src/repositories/userRepository.js";
import { userScenarioFactory } from "../factories/userScenarioFactory.js";

const agent = supertest(app);

beforeEach(async () => {
	await prisma.$executeRaw`TRUNCATE users CASCADE`;
});

describe("POST /signup", () => {
	it("Should create user and return code 201", async () => {
		const user = userFactory.createData();

		const response = await agent.post("/signup").send(user);
		expect(response.statusCode).toBe(201);

		const createdUser = await prisma.user.findUnique({
			where: { email: user.email },
		});
		expect(createdUser).not.toBeNull();
	});

	it("Should not create user if it already exists and return code 409", async () => {
		const userData = userFactory.createData();
		const existingUser = await userScenarioFactory.existingUserScenario(
			userData
		);
		const newUser = {
			username: existingUser.username,
			email: existingUser.email,
			password: "randompassword",
			avatar: existingUser.avatar,
		};

		const response = await agent.post("/signup").send(newUser);
		expect(response.statusCode).toBe(409);
	});

	it("Should not create user and return code 422 if input schema is wrong", async () => {
		const user = userFactory.createData(2);

		const response = await agent
			.post("/signup")
			.send({ email: "not an email", password: user.password });

		expect(response.statusCode).toBe(422);
	});
});

describe("POST /signin", () => {
	it("Should sign in and return token", async () => {
		const userData = userFactory.createData();
		await userScenarioFactory.existingUserScenario(userData);

		const response = await agent
			.post("/signin")
			.send({ email: userData.email, password: userData.password });
		expect(response.statusCode).toBe(200);
		expect(response.body.token).not.toBeNull();
	});

	it("Should not sign in and return code 401(unauthorized), given wrong credentials", async () => {
		const userData = userFactory.createData();
		await userScenarioFactory.existingUserScenario(userData);

		const response = await agent
			.post("/signin")
			.send({ email: "wrongemail", password: "wrongpassword" });
	});
});
