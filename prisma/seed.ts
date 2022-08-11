import { prisma } from "../src/database/database.js";
import { Ingredient } from "@prisma/client";

type CreateIngredientData = Omit<Ingredient, "id">;

async function main() {
	const ingredients: CreateIngredientData[] = [
		{ name: "feijão" },
		{ name: "arroz" },
		{ name: "leite" },
		{ name: "cebola" },
		{ name: "farinha" },
		{ name: "alho" },
		{ name: "manteiga" },
		{ name: "macarrão" },
		{ name: "molho de tomate" },
		{ name: "batata" },
		{ name: "carne bovina" },
		{ name: "peixe" },
		{ name: "frango" },
		{ name: "carne suína" },
		{ name: "linguiça" },
		{ name: "salsinha" },
		{ name: "sal" },
		{ name: "açúcar" },
		{ name: "cenoura" },
	];

	await prisma.ingredient.createMany({ data: ingredients });
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
