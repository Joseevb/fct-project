import { z } from "zod";

export const addCourseSchema = z.object({
	startDate: z.string().trim(),
	endDate: z.string().trim(),
	enrollmentPrice: z
		.number()
		.min(1, "El precio de inscripción debe ser mayor a 1"),
	categoryId: z.coerce
		.number({
			required_error: "Por favor seleccione una categoría",
			invalid_type_error: "Por favor seleccione una categoría",
		})
		.int("Por favor seleccione una categoría"),
	description: z
		.string()
		.nonempty("La descripción no puede estar vacía")
		.trim(),
});

export type AddCourseSchema = z.infer<typeof addCourseSchema>;
