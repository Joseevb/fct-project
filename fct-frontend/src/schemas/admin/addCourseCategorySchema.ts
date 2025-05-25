import { z } from "zod";

export const addCourseCategorySchema = z.object({
	name: z.string().nonempty("El nombre no puede estar vacío").trim(),
});

export type AddCourseCategorySchema = z.infer<typeof addCourseCategorySchema>;
