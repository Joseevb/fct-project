import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldPath, FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { DefaultApi } from "@/api";
import { AxiosError } from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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

type FormSchemaType = z.infer<typeof formSchema>;

const formSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(20)
		.trim()
		.regex(/^[a-zA-Z0-9_]+$/),
	email: z.string().email().trim(),
	password: z.string().min(8).max(20).trim(),
	firstName: z.string().nonempty().trim(),
	lastName: z.string().nonempty().trim(),
});

const schemaKeys = Object.keys(formSchema.shape) as Array<keyof FormSchemaType>;

interface DynamicFormFieldProps<T extends FieldValues> {
	name: FieldPath<T>;
	control: Control<T>;
}

function DynamicFormField({
	name,
	control,
}: Readonly<DynamicFormFieldProps<FormSchemaType>>) {
	const config = fieldConfigs[name];

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{config.label}</FormLabel>
					<FormControl>
						<Input
							placeholder={config.placeholder}
							type={config.type}
							{...field}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export default function Register() {
	const [error, setError] = useState("");

	const { login } = useAuth();
	const navigate = useNavigate();

	const api = new DefaultApi();

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			username: "",
			password: "",
			email: "",
			firstName: "",
			lastName: "",
		},
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setError("");
		console.log("data:", data);

		try {
			const response = await api.register({ ...data });
			console.log("res:", response);

			await login({ username: data.username, password: data.password });
			navigate("/");
		} catch (err) {
			if (err instanceof AxiosError && err.response?.data) {
				const data = err.response.data;

				if ("messages" in data && typeof data.messages === "object") {
					// This is a ValidationErrorMessage
					const validationErrors = Object.entries(data.messages)
						.map(([field, message]) => `${field}: ${message}`)
						.join(", ");
					setError(`Errores de validación: ${validationErrors}`);
				} else if ("message" in data) {
					// This is a general ErrorMessage
					setError(data.message);
				} else {
					setError("Ocurrió un error inesperado.");
				}
			} else {
				setError("Error desconocido.");
			}
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
						{schemaKeys.map((fieldName) => (
							<DynamicFormField
								key={fieldName}
								name={fieldName}
								control={form.control}
							/>
						))}
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full mt-4">
							Submit
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
