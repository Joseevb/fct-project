import { User, UsersApi } from "@/api";
import {
	DynamicFormField,
	FieldConfig,
} from "@/components/ui/DynamicFormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { applyValidationErrors } from "@/lib/errorHandlers";
import { tryCatch } from "@/lib/tryCatch";
import {
	UpdateUserFormData,
	updateUserSchema,
} from "@/schemas/updateUserSchema";
import { ResponseError } from "@/types/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAddresses } from "@/components/ui/UserAddresses";
import { Separator } from "@/components/ui/separator";

const fieldConfigs: Record<string, FieldConfig> = {
	username: {
		label: "Nombre de usuario",
		placeholder: "Introduzca su nombre de usuario",
		type: "text",
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
	email: {
		label: "Correo electrónico",
		placeholder: "Introduzca su correo electrónico",
		type: "email",
	},
} as const;

export default function ProfilePage() {
	const [isEditEnabled, setIsEditEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const { user, updateLoggedUser } = useAuth();

	const form = useForm({
		defaultValues: {
			username: user?.username || "",
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			email: user?.email || "",
		},
		resolver: zodResolver(updateUserSchema),
	});

	const onSubmit = async (data: z.infer<typeof updateUserSchema>) => {
		setIsLoading(true);
		setError("");

		if (!user) {
			setError("No se puede actualizar el perfil sin iniciar sesión");
			setIsLoading(false);
			return;
		}

		const api = new UsersApi();

		const { data: updatedUser, error: updateError } = await tryCatch<
			AxiosResponse<User>,
			AxiosError<ResponseError>
		>(api.updateUser(user?.id, data));

		if (updateError) {
			const errRes = updateError.response?.data;

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

		updateLoggedUser(updatedUser.data);
		setIsLoading(false);
	};

	return (
		<main className="container mx-auto py-6 space-y-6">
			<Card>
				<CardHeader className="flex items-center justify-between">
					<div>
						<CardTitle>Perfil de usuario</CardTitle>
						<CardDescription>
							Actualice su información de perfil
						</CardDescription>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="editEnabled"
							onCheckedChange={() =>
								setIsEditEnabled(!isEditEnabled)
							}
						/>
						<label
							htmlFor="editEnabled"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Editar
						</label>
					</div>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							{Object.keys(fieldConfigs).map((fieldName) => (
								<DynamicFormField<UpdateUserFormData>
									key={fieldName}
									name={fieldName as keyof UpdateUserFormData}
									fieldConfigs={fieldConfigs}
									control={form.control}
									disabled={isLoading || !isEditEnabled}
								/>
							))}
							<Button
								type="submit"
								variant="outline"
								size="sm"
								disabled={isLoading || !isEditEnabled}
								className="disabled:opacity-50"
							>
								{isLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<CheckCircle className="mr-2 h-4 w-4" />
								)}
								{isLoading ? "Actualizando..." : "Actualizar"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			{user && (
				<>
					<Separator className="my-6" />
					<UserAddresses userId={user.id} />
				</>
			)}
		</main>
	);
}
