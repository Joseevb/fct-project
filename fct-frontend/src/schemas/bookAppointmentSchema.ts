import { z } from "zod";

export const bookAppointmentSchema = z.object({
	name: z.string().min(1, "El título es obligatorio"),
	description: z.string().min(1, "La descripción es obligatoria"),
	duration: z.number().min(1, "La duración debe ser mayor a 0"),
	date: z.string().min(1, "La fecha es obligatoria"),
	categoryId: z.number({
		required_error: "Por favor seleccione una categoría",
	}),
});

export type BookAppointmentFormData = z.infer<typeof bookAppointmentSchema>;
