import { z } from "zod";

export const bookAppointmentSchema = z.object({
	description: z.string().min(1, "La descripción es obligatoria"),
	duration: z.number().min(1, "La duración debe ser mayor a 0"),
	categoryId: z.coerce
		.number({
			required_error: "Por favor seleccione una categoría",
			invalid_type_error: "Por favor seleccione una categoría",
		})
		.int("Por favor seleccione una categoría"),
});

export type BookAppointmentFormData = z.infer<typeof bookAppointmentSchema>;
