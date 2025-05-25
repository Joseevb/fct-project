import { UseFormSetError, FieldValues, Path } from "react-hook-form";

// Interface for backend errors
interface ValidationError {
	field: string;
	message: string;
}

/**
 * Applies backend validation errors to a react-hook-form instance.
 *
 * @template TFormValues The type representing the form fields (should extend FieldValues).
 * @param {ValidationError[]} errors An array of validation errors from the backend.
 * @param {UseFormSetError<TFormValues>} setError The setError function from react-hook-form's useForm hook.
 */
export function applyValidationErrors<TFormValues extends FieldValues>(
	errors: ValidationError[],
	setError: UseFormSetError<TFormValues>,
): void {
	if (!Array.isArray(errors)) {
		console.warn(
			"applyValidationErrors received non-array errors:",
			errors,
		);
		return;
	}

	errors.forEach(({ field, message }) => {
		if (field && typeof field === "string") {
			setError(field as Path<TFormValues>, { type: "manual", message });
		} else {
			console.warn(
				"Validation error received without a valid field name:",
				{ field, message },
			);
		}
	});
}
