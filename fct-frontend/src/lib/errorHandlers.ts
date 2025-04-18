import { UseFormSetError } from "react-hook-form";
import { RegisterFormData } from "@/schemas/registerSchema";

interface ValidationError {
	field: string;
	message: string;
}

export function applyValidationErrors(
	errors: ValidationError[],
	setError: UseFormSetError<RegisterFormData>,
) {
	errors.forEach(({ field, message }) => {
		setError(field as keyof RegisterFormData, { message });
	});
}
