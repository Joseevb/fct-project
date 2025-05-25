import { z } from "zod";

export const registerSchema = z.object({
	username: z
		.string()
		.min(3, "El nombre de usuario debe tener al menos 3 caracteres")
		.trim()
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"El nombre de usuario solo puede contener letras, números y guiones",
		),
	email: z.string().email("El email no es válido").trim(),
	password: z
		.string()
		.min(8, "La contraseña debe tener al menos 8 caracteres")
		.trim(),
	firstName: z.string().nonempty("El nombre no puede estar vacío").trim(),
	lastName: z.string().nonempty("El apellido no puede estar vacío").trim(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
