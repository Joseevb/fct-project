import {
	AddAppointmentRequest,
	Appointment,
	AppointmentCategoriesApi,
	AppointmentCategory,
	AppointmentsApi,
	ErrorMessage,
} from "@/api";
import { InvoiceType } from "@/components/pages/InvoicePage";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DynamicFormField,
	FieldConfig,
} from "@/components/ui/DynamicFormField";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { applyValidationErrors } from "@/lib/errorHandlers";
import { tryCatch } from "@/lib/tryCatch";
import { cn, formatDate } from "@/lib/utils";
import {
	BookAppointmentFormData,
	bookAppointmentSchema,
} from "@/schemas/bookAppointmentSchema";
import { ResponseError } from "@/types/errors";
import { LineItemable, TemporaryLineItem } from "@/types/lineItem";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { FieldPath, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const fieldConfigs: Record<string, FieldConfig> = {
	date: {
		label: "Fecha",
		placeholder: "Introduzca la fecha de la cita",
		type: "date",
		disabled: true,
	},
	name: {
		label: "Titulo",
		placeholder: "Introduzca el titulo de la cita",
		type: "text",
	},
	description: {
		label: "Descripción",
		placeholder: "Introduzca una descripción de la cita",
		type: "textarea",
	},
	duration: {
		label: "Duración en minutos",
		placeholder: "Introduzca la duración de la cita",
		type: "number",
	},
	categoryId: {
		label: "Categoría",
		placeholder: "Seleccione una categoría",
		type: "select",
		options: [],
	},
};

interface AppointmentBookingPageProps {
	setInvoiceObjs: Dispatch<SetStateAction<LineItemable[]>>;
	setLineItemType: Dispatch<SetStateAction<InvoiceType | null>>;
	setTemporaryLineItems: Dispatch<SetStateAction<TemporaryLineItem[]>>;
}

export default function AppointmentBookingPage({
	setInvoiceObjs,
	setLineItemType,
	setTemporaryLineItems,
}: AppointmentBookingPageProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | undefined>();

	const { user } = useAuth();

	const navigate = useNavigate();

	const { appointments, isLoading, fetchAppointments } = useAppointments();

	const form = useForm<BookAppointmentFormData>({
		defaultValues: {
			name: "",
			description: "",
			duration: 0,
			date: "",
			categoryId: undefined,
		},
		resolver: zodResolver(bookAppointmentSchema),
	});

	const availableDateStrings = useMemo(() => {
		const dateSet = new Set<string>();
		appointments.forEach((app) => {
			const { data: dateObj, error: err } = tryCatch(
				() => new Date(app.date),
			);

			if (err)
				console.warn("Invalid date format in appointment:", app.date);

			if (dateObj) dateSet.add(formatDate(dateObj));
		});
		return dateSet;
	}, [appointments]);

	const isDateDisabled = (date: Date): boolean => {
		const dateString = formatDate(date);
		return availableDateStrings.has(dateString);
	};

	useEffect(() => {
		async function getAppointmentCategories() {
			const api = new AppointmentCategoriesApi();
			const { data: categories, error: catErr } = await tryCatch<
				AxiosResponse<AppointmentCategory[]>,
				AxiosError<ErrorMessage>
			>(api.getAllAppointmentCategories());

			if (catErr) {
				console.error("Error fetching appointment categories:", error);
				setError(
					catErr.response?.data.message ||
						"Error obteniendo las categorias",
				);
				return;
			}

			fieldConfigs.categoryId.options = categories.data.map(
				(category) => ({
					value: category.id.toString(),
					label: category.name,
				}),
			);

			console.log(fieldConfigs.categoryId.options);
		}

		getAppointmentCategories();
	}, [error]);

	useEffect(() => {
		if (selectedDate) {
			form.setValue("date", formatDate(selectedDate));
		}
	}, [selectedDate, form]);

	const handleDateSelect = (date: Date | undefined) => {
		setSelectedDate(date);
	};

	const onSubmit = async (data: z.infer<typeof bookAppointmentSchema>) => {
		if (!user) {
			navigate("/login");
			return;
		}

		setIsUploading(true);

		const api = new AppointmentsApi();

		const request: AddAppointmentRequest = {
			...data,
			userId: user.id,
		};

		const { data: res, error: bookError } = await tryCatch<
			AxiosResponse<Appointment>,
			AxiosError<ResponseError>
		>(api.addAppointment(request));

		const errRes = bookError?.response?.data;

		if (errRes) {
			if ("messages" in errRes) {
				const validationErrors = Object.entries(errRes.messages).map(
					([field, message]) => ({
						field,
						message,
					}),
				);

				applyValidationErrors(validationErrors, form.setError);
			} else if ("message" in errRes) {
				setError(errRes.message);
			} else {
				setError("Ocurrió un error inesperado.");
			}
			setIsUploading(false);
			return;
		}

		if (res) {
			toast.success("Cita agregada exitosamente", { richColors: true });
			fetchAppointments();

			const lineItem: TemporaryLineItem = {
				appointmentId: res.data.id,
				quantity: 1,
				subtotal: res.data.price,
			};

			setInvoiceObjs((arr) => [...arr, res.data]);
			setLineItemType("APPOINTMENT");
			setTemporaryLineItems((arr) => [...arr, lineItem]);

			setIsUploading(false);
			navigate("/invoice");
		}

		setIsUploading(false);
	};

	// --- Render ---
	return (
		<main className="p-6 md:p-8 space-y-6">
			<h2 className="text-2xl font-semibold tracking-tight">
				Agendar una Cita
			</h2>

			<section className="space-y-4">
				{/* Loading State for Initial Fetch */}
				{isLoading && (
					<div className="p-4 border rounded-md w-full max-w-sm mx-auto">
						<Skeleton className="h-8 w-3/4 mb-4" />
						<Skeleton className="h-64 w-full" />
					</div>
				)}

				{/* Error State for Initial Fetch */}
				{!isLoading && error && (
					<div className="flex items-center space-x-2 text-destructive border border-destructive/50 bg-destructive/10 p-3 rounded-md max-w-md mx-auto">
						<AlertCircle className="h-5 w-5" />
						<p className="text-sm">Error: {error}</p>
					</div>
				)}

				{/* Calendar and Details View  */}
				{!isLoading && !error && (
					<div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
						{/* Calendar */}
						<Calendar
							mode="single"
							disabled={isDateDisabled}
							selected={selectedDate}
							onSelect={handleDateSelect}
							className="rounded-md border shadow-sm w-full max-w-fit self-center md:self-start"
						/>

						{/* Appointment Details Card */}
						<Card
							className={cn(
								"w-full md:max-w-md rounded-md", // Base styles
								"transition-all duration-300 ease-out", // Animation
								selectedDate
									? "opacity-100 translate-x-0"
									: "opacity-0 -translate-x-4 pointer-events-none", // Appear/disappear
							)}
						>
							<CardHeader>
								<CardTitle>Detalles de la Cita</CardTitle>
							</CardHeader>
							<CardContent>
								<Form {...form}>
									<form
										method="post"
										className="space-y-4"
										onSubmit={form.handleSubmit(onSubmit)}
									>
										{Object.keys(fieldConfigs)
											// .filter(
											// 	(fieldName) =>
											// 		fieldName !== "categoryId",
											// )
											.map((fieldName) => (
												<DynamicFormField<BookAppointmentFormData>
													key={fieldName}
													name={
														fieldName as FieldPath<BookAppointmentFormData>
													}
													fieldConfigs={fieldConfigs}
													control={form.control}
												/>
											))}

										<Button
											type="submit"
											variant="outline"
											size="lg"
											disabled={isUploading}
											className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700 disabled:opacity-50"
										>
											{isUploading ? (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											) : (
												<CheckCircle className="mr-2 h-4 w-4" />
											)}
											Aceptar
										</Button>
									</form>
								</Form>
							</CardContent>
						</Card>
					</div>
				)}
			</section>
		</main>
	);
}

// <FormField
// 	control={form.control}
// 	name="categoryId"
// 	render={({ field }) => (
// 		<FormItem>
// 			<FormLabel>
// 				Categoría
// 			</FormLabel>
// 			<Select
// 				onValueChange={(
// 					value: string,
// 				) =>
// 					field.onChange(
// 						parseInt(
// 							value,
// 							10,
// 						),
// 					)
// 				}
// 				value={
// 					field.value?.toString() ||
// 					""
// 				}
// 			>
// 				<FormControl>
// 					<SelectTrigger>
// 						<SelectValue placeholder="Seleccione una categoría" />
// 					</SelectTrigger>
// 				</FormControl>
// 				<SelectContent>
// 					{appointmentCategories.map(
// 						(category) => (
// 							<SelectItem
// 								key={
// 									category.id
// 								}
// 								value={category.id.toString()}
// 							>
// 								{
// 									category.name
// 								}
// 							</SelectItem>
// 						),
// 					)}
// 				</SelectContent>
// 			</Select>
// 			<FormMessage />
// 		</FormItem>
// 	)}
// />
