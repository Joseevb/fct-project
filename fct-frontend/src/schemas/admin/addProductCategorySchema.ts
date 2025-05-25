import { z } from "zod";

export const addProductCategorySchema = z.object({
	name: z.string().nonempty("El nombre no puede estar vacío").trim(),
	vatPercentage: z
		.number()
		.min(0, "El porcentaje de IVA debe ser mayor a 0")
		.max(1, "El porcentaje de IVA debe ser menor a 1"),
});

export type AddProductCategorySchema = z.infer<typeof addProductCategorySchema>;
