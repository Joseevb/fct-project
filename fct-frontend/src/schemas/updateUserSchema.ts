import { z } from "zod";

export const updateUserSchema = z.object({
	username: z
		.string()
		.min(3, "El nombre de usuario debe tener al menos 3 caracteres")
		.optional(),
	firstName: z
		.string()
		.min(1, "el campo nombre no puede estar vacio")
		.optional(),
	lastName: z
		.string()
		.min(1, "El campo apellidos no puede estar vacio")
		.optional(),
	email: z.string().email("Introduzca un email válido").optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
