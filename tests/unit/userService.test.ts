import { userRepository } from "../../src/repositories/userRepository.js";
import { userService } from "../../src/services/userService.js";
import { jest } from "@jest/globals";
import { userFactory } from "../factories/userFactory.js";

beforeEach(() => {
	jest.clearAllMocks();
	jest.resetAllMocks();
});

describe("User Service Unit Test", () => {
	jest
		.spyOn(userRepository, "findByEmailOrUsername")
		.mockImplementation((): any => {});

	jest.spyOn(userRepository, "create").mockImplementation((): any => {});

	jest.spyOn(userRepository, "findByEmail").mockImplementation((): any => {});

	it("Should create user", async () => {
		const user = userFactory.createData();

		await userService.signup(user);
		expect(userRepository.findByEmailOrUsername).toBeCalledTimes(1);
		expect(userRepository.create).toBeCalledTimes(1);
	});

	it("Should not create user if it already exists", () => {
		const user = userFactory.createData();

		jest
			.spyOn(userRepository, "findByEmailOrUsername")
			.mockImplementationOnce((): any => {
				return {
					name: user.username,
					email: user.email,
					password: user.password,
				};
			});

		const promise = userService.signup(user);
		expect(userRepository.findByEmailOrUsername).toBeCalledTimes(1);
		expect(promise).rejects.toEqual({
			type: "conflict",
			message: "User already exists!",
		});
		expect(userRepository.create).toBeCalledTimes(0);
	});

	it("Should sign in", async () => {
		const user = userFactory.createData();

		jest
			.spyOn(userRepository, "findByEmail")
			.mockImplementationOnce((): any => {
				return {
					id: 1,
					username: user.username,
					email: user.email,
					password: userService.encryptPassword(user.password),
					createdAt: "timezone",
				};
			});

		const token = await userService.signin({
			email: user.email,
			password: user.password,
		});
		expect(token).not.toBeNull();
		expect(userRepository.findByEmail).toBeCalledTimes(1);
	});

	it("Should not sign in if email is not correct", () => {
		const user = userFactory.createData();

		const promise = userService.signin({
			email: user.email,
			password: user.password,
		});
		expect(promise).rejects.toEqual({
			type: "unauthorized",
			message: "Invalid credentials!",
		});
		expect(userRepository.findByEmail).toBeCalledTimes(1);
	});

	it("Should not sign in if password is not correct", () => {
		const user = userFactory.createData();

		jest
			.spyOn(userRepository, "findByEmail")
			.mockImplementationOnce((): any => {
				return {
					id: 1,
					username: user.username,
					email: user.email,
					password: "anotherPassword",
					createdAt: "timezone",
				};
			});
		const promise = userService.signin({
			email: user.email,
			password: user.password,
		});

		expect(promise).rejects.toEqual({
			type: "unauthorized",
			message: "Invalid credentials!",
		});
		expect(userRepository.findByEmail).toBeCalledTimes(1);
	});
});
