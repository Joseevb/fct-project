import { z } from "zod";

export const appointmentCategorySchema = z.object({
	name: z.string().trim().min(1, "El nombre es obligatorio"),
	quotePerHour: z.number().min(1, "La cotización por hora es obligatoria"),
});

export type AppointmentCategoryFormData = z.infer<
	typeof appointmentCategorySchema
>;
