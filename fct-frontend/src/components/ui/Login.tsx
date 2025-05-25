import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
	username: z
		.string()
		.nonempty("El nombre de usuario no puede estar vacío")
		.trim()
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"El nombre de usuario solo puede contener letras, números y guiones",
		),
	password: z.string().nonempty("La contraseña no puede estar vacía").trim(),
});

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Get the path the user was trying to access
	const from = location.state?.from?.pathname || "/";

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			username: "",
			password: "",
		},
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setError("");
		setIsLoading(true);

		const { error: loginError } = await login({
			username: data.username,
			password: data.password,
		});

		if (loginError) {
			switch (loginError) {
				case "CREDENTIAL_ERROR":
					setError("Credenciales incorrectas");
					break;
				case "INVALID_REQUEST":
					setError("Error en la solicitud");
					break;
				case "UNKNOWN_ERROR":
					setError("Ha ocurrido un error desconocido");
					break;
			}
			setIsLoading(false);
			return;
		}

		setIsLoading(false);
		navigate(from, { replace: true });
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Iniciar Sesión</CardTitle>
				<CardDescription>
					Introduzca sus credenciales para acceder a su cuenta
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
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre de usuario</FormLabel>
									<FormControl>
										<Input
											placeholder="Introduzca su nombre de usuario"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contraseña</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Introduzca su contraseña"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full mt-4"
							disabled={isLoading}
						>
							{isLoading
								? "Iniciando sesión..."
								: "Iniciar sesión"}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
