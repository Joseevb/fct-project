import { z } from "zod";

export const registerSchema = z.object({
	username: z
		.string()
		.min(3, "El nombre de usuario debe tener al menos 3 caracteres")
		.max(20)
		.trim()
		.regex(/^[a-zA-Z0-9_]+$/),
	email: z.string().email().trim(),
	password: z.string().min(8).max(20).trim(),
	firstName: z.string().nonempty().trim(),
	lastName: z.string().nonempty().trim(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
