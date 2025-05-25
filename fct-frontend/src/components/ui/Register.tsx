import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
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
import { DefaultApi, RegisterRequest, RegisterResponse } from "@/api";
import { AxiosError, AxiosResponse } from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { tryCatch } from "@/lib/tryCatch";
import { RegisterFormData, registerSchema } from "@/schemas/registerSchema";
import {
	DynamicFormField,
	FieldConfig,
} from "@/components/ui/DynamicFormField";
import { applyValidationErrors } from "@/lib/errorHandlers";
import { ResponseError } from "@/types/errors";

const fieldConfigs: Record<keyof RegisterRequest, FieldConfig> = {
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
} as const;

interface RegisterProps {
	setIsOtp: (isOtp: boolean) => void;
}

export default function Register({ setIsOtp }: Readonly<RegisterProps>) {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const api = new DefaultApi();

	const form = useForm<RegisterFormData>({
		defaultValues: {
			username: "",
			password: "",
			email: "",
			firstName: "",
			lastName: "",
		},
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterFormData) => {
		setError("");
		setIsLoading(true);

		const { error: registerError } = await tryCatch<
			AxiosResponse<RegisterResponse>,
			AxiosError<ResponseError>
		>(api.register({ ...data }));

		if (registerError) {
			const errRes = registerError.response?.data;

			if (errRes) {
				if ("messages" in errRes) {
					const validationErrors = Object.entries(
						errRes.messages,
					).map(([field, message]) => ({
						field,
						message,
					}));

					applyValidationErrors(validationErrors, form.setError);
				} else if ("message" in errRes) {
					setError(errRes.message);
				} else {
					setError("Ocurrió un error inesperado.");
				}
			}

			setIsLoading(false);
			return;
		}

		setIsLoading(false);
		setIsOtp(true);
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Registrarse</CardTitle>
				<CardDescription>Registro de un nuevo usuario</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} method="post">
					<CardContent className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						{Object.keys(fieldConfigs).map((fieldName) => (
							<DynamicFormField<RegisterFormData>
								key={fieldName}
								name={fieldName as FieldPath<RegisterFormData>}
								fieldConfigs={fieldConfigs}
								control={form.control}
							/>
						))}
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
