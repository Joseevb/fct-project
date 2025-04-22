import { z } from "zod";

const isValidLuhn = (value: string): boolean => {
	if (!/^\d+$/.test(value)) {
		return false;
	}

	let sum = 0;
	let shouldDouble = false;
	for (let i = value.length - 1; i >= 0; i--) {
		let digit = parseInt(value.charAt(i), 10);

		if (shouldDouble) {
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}

		sum += digit;
		shouldDouble = !shouldDouble;
	}

	return sum % 10 === 0;
};

export const paymentSchema = z.object({
	cardNumber: z
		.string()
		.min(1, "El número de tarjeta es obligatorio")
		.transform((val) => val.replace(/[\s-]/g, ""))
		.refine((val) => /^\d+$/.test(val), {
			message: "El número de tarjeta solo debe contener dígitos",
		})
		.refine((val) => val.length >= 13 && val.length <= 19, {
			message: "Longitud inválida para número de tarjeta",
		})
		.refine(isValidLuhn, {
			message: "El número de tarjeta no es válido (checksum)",
		}),

	expiryDate: z
		.string()
		// .regex(
		// 	/^(0[1-9]|1[0-2])\s?\/\s?(\d{2}|\d{4})$/,
		// 	"Formato inválido (MM/YY o MM/YYYY)",
		// )
		.min(1, "La fecha de caducidad es obligatoria"),

	cvc: z
		.string()
		.min(3, "El CVC debe tener al menos 3 dígitos")
		.max(4, "El CVC no puede tener más de 4 dígitos")
		.regex(/^\d+$/, "El CVC solo debe contener dígitos"),

	cardName: z.string().min(1, "El nombre en la tarjeta es obligatorio"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
