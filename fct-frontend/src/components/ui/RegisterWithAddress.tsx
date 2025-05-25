import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerSchema } from "@/schemas/registerSchema";
import { addressSchema } from "@/schemas/addressSchema";
import {
	DynamicFormField,
	FieldConfig,
} from "@/components/ui/DynamicFormField";
import { applyValidationErrors } from "@/lib/errorHandlers";
import { AddressFields } from "@/components/ui/AddressFields";
import { AddressTypeEnum } from "@/api/models";
import { z } from "zod";
import { registrationService } from "@/services/registrationService";

// Combine the schemas
const registerWithAddressSchema = registerSchema.extend({
	address: addressSchema,
});

type RegisterWithAddressFormData = z.infer<typeof registerWithAddressSchema>;

const userFieldConfigs: Record<string, FieldConfig> = {
	username: {
		label: "Nombre de usuario",
		placeholder: "Introduzca su nombre de usuario",
		type: "text",
	},
	email: {
		label: "Correo electrónico",
		placeholder: "Introduzca su correo electrónico",
		type: "email",
	},
	password: {
		label: "Contraseña",
		placeholder: "Introduzca su contraseña",
		type: "password",
	},
	firstName: {
		label: "Nombre",
		placeholder: "Introduzca su nombre",
		type: "text",
	},
	lastName: {
		label: "Apellido",
		placeholder: "Introduzca su apellido",
		type: "text",
	},
};

interface RegisterWithAddressProps {
	setIsOtp: (isOtp: boolean) => void;
}

export default function RegisterWithAddress({
	setIsOtp,
}: Readonly<RegisterWithAddressProps>) {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<RegisterWithAddressFormData>({
		defaultValues: {
			username: "",
			password: "",
			email: "",
			firstName: "",
			lastName: "",
			address: {
				street: "",
				city: "",
				state: "",
				zipCode: "",
				country: "",
				addressType: AddressTypeEnum.PRIMARY,
			},
		},
		resolver: zodResolver(registerWithAddressSchema),
	});

	const onSubmit = async (data: RegisterWithAddressFormData) => {
		setError("");
		setIsLoading(true);

		const result = await registrationService.registerWithAddress(data);

		if (!result.success) {
			if (result.validationErrors) {
				applyValidationErrors(result.validationErrors, form.setError);
			} else if (result.error) {
				setError(result.error);
			} else {
				setError("Ocurrió un error inesperado durante el registro.");
			}
			setIsLoading(false);
			return;
		}

		// Registration successful
		setIsLoading(false);
		setIsOtp(true);
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Registrarse</CardTitle>
				<CardDescription>
					Registro de un nuevo usuario con dirección
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} method="post">
					<CardContent className="space-y-6">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-4">
							<h3 className="text-lg font-medium">
								Información Personal
							</h3>
							{Object.keys(userFieldConfigs).map((fieldName) => (
								<DynamicFormField<RegisterWithAddressFormData>
									key={fieldName}
									name={
										fieldName as keyof RegisterWithAddressFormData
									}
									fieldConfigs={userFieldConfigs}
									control={form.control}
								/>
							))}
						</div>

						<AddressFields form={form} />
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full mt-4"
							disabled={isLoading}
						>
							{isLoading ? "Registrando..." : "Registrarse"}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
