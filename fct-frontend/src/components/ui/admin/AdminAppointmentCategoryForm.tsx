import { FieldPath, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
	AppointmentCategoryFormData,
	appointmentCategorySchema,
} from "@/schemas/admin/appointmentCategorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	DynamicFormField,
	FieldConfig,
} from "@/components/ui/DynamicFormField";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppointmentCategoriesApi, AppointmentCategory } from "@/api";
import { tryCatch } from "@/lib/tryCatch";
import { ResponseError } from "@/types/errors";
import { AxiosResponse, AxiosError } from "axios";
import { applyValidationErrors } from "@/lib/errorHandlers";
import { toast } from "sonner";

const fieldConfigs: Record<string, FieldConfig> = {
	name: {
		label: "Nombre",
		placeholder: "Introduzca el nombre de la categoría",
		type: "text",
	},
	quotePerHour: {
		label: "Cotización por hora",
		placeholder: "Introduzca la cotización por hora",
		type: "number",
	},
} as const;

export default function AdminAppointmentCategoryForm() {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<AppointmentCategoryFormData>({
		defaultValues: {
			name: "",
			quotePerHour: 0,
		},
		resolver: zodResolver(appointmentCategorySchema),
	});

	const onSubmit = async (
		data: z.infer<typeof appointmentCategorySchema>,
	) => {
		const api = new AppointmentCategoriesApi();
		const { data: res, error: addErr } = await tryCatch<
			AxiosResponse<AppointmentCategory>,
			AxiosError<ResponseError>
		>(api.createAppointmentCategory(data));

		if (addErr) {
			const errRes = addErr.response?.data;

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

		toast.success("Categoría agregada exitosamente", {
			richColors: true,
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">
						{JSON.stringify(res.data, null, 2)}
					</code>
				</pre>
			),
		});

		setError("");
		setIsLoading(false);
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Agregar categoría</CardTitle>
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
							<DynamicFormField<AppointmentCategoryFormData>
								key={fieldName}
								name={
									fieldName as FieldPath<AppointmentCategoryFormData>
								}
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
							{isLoading ? "Agregando..." : "Agregar"}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
