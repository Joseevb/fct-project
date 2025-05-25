import { z } from "zod";

export const bookAppointmentSchema = z.object({
	description: z.string().min(1, "La descripción es obligatoria"),
	duration: z
		.number({
			message: "Por favor ingrese un número válido",
		})
		.int("Por favor ingrese un número válido")
		.min(60, "La duración debe ser mayor a 60 minutos")
		.max(360, "La duración no puede ser mayor a 360 minutos"),
	categoryId: z.coerce
		.number({
			required_error: "Por favor seleccione una categoría",
			invalid_type_error: "Por favor seleccione una categoría",
		})
		.int("Por favor seleccione una categoría"),
});

export type BookAppointmentFormData = z.infer<typeof bookAppointmentSchema>;
