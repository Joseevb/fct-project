import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import { z } from "zod";
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
import { DefaultApi, ErrorMessage, ValidationErrorMessage } from "@/api";
import { AxiosError } from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { tryCatch } from "@/lib/tryCatch";
import { RegisterFormData, registerSchema } from "@/schemas/registerSchema";
import { DynamicFormField } from "@/components/ui/DynamicFormField";
import { applyValidationErrors } from "@/lib/errorHandlers";

const fieldConfigs = {
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

type ResponseError = ErrorMessage | ValidationErrorMessage;

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

	const onSubmit = async (data: z.infer<typeof registerSchema>) => {
		setError("");
		setIsLoading(true);

		const { data: registerData, error: registerError } = await tryCatch(
			api.register({ ...data }),
		);
		console.log("res:", registerData);

		if (registerError) {
			console.log(registerError);

			if (registerError instanceof AxiosError) {
				const errRes: ResponseError = registerError.response?.data;

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
			} else {
				setError("Error desconocido.");
			}
			setIsLoading(false);
		}

		if (registerData) {
			setIsLoading(false);
			setIsOtp(true);
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>
					Enter your credentials to access your account
				</CardDescription>
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
