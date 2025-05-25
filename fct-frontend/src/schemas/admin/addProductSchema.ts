import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

export const addProductSchema = z.object({
	name: z.string().trim().min(1, "Name cannot be empty"),
	description: z
		.string()
		.nonempty("La descripción no puede estar vacía")
		.trim(),
	price: z.coerce.number().min(0.01, "El precio debe ser mayor a 0"),
	productCategoryId: z.coerce
		.number({
			required_error: "Por favor seleccione una categoría",
			invalid_type_error: "Por favor seleccione una categoría",
		})
		.int("Por favor seleccione una categoría")
		.positive("Por favor seleccione una categoría"),
	stock: z.coerce.number().min(0, "El stock debe ser mayor a 0"),
	image: z
		.instanceof(File, {
			message: "Se requiere una imagen.",
		})
		.refine((file) => file.size > 0, "Se requiere una imagen.")
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			`Solo se admiten formatos ${ACCEPTED_IMAGE_TYPES.join(", ")}.`,
		),
});

export type AddProductSchema = z.infer<typeof addProductSchema>;
