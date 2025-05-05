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
import { es } from "date-fns/locale";
import {
	AlertCircle,
	Calendar as CalendarIcon,
	CheckCircle,
	Loader2,
} from "lucide-react";
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

	// Check if a date is a weekend day
	const isWeekend = (date: Date): boolean => {
		const day = date.getDay();
		return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
	};

	// Check if a date already has appointments
	const hasAppointment = (date: Date): boolean => {
		const dateString = formatDate(date);
		return availableDateStrings.has(dateString);
	};

	// Check if a date is in the past
	const isPastDay = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date.getTime() < today.getTime();
	};

	// Used to disable dates in the calendar
	const isDateDisabled = (date: Date): boolean => {
		return hasAppointment(date) || isWeekend(date) || isPastDay(date);
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
		<main className="container mx-auto p-6 md:p-8 space-y-8">
			<div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between border-b pb-4 mb-6">
				<h2 className="text-3xl font-bold tracking-tight text-primary-foreground">
					Agendar una Cita
				</h2>
				<div className="flex items-center text-muted-foreground text-sm">
					<CalendarIcon className="mr-2 h-4 w-4" />
					<span>Seleccione una fecha disponible</span>
				</div>
			</div>

			<section className="space-y-6">
				{/* Loading State for Initial Fetch */}
				{isLoading && (
					<div className="p-6 border rounded-lg shadow-sm w-full max-w-md mx-auto bg-card">
						<Skeleton className="h-10 w-3/4 mb-6" />
						<Skeleton className="h-80 w-full" />
					</div>
				)}

				{/* Error State for Initial Fetch */}
				{!isLoading && error && (
					<div className="flex items-center space-x-3 text-destructive border border-destructive/50 bg-destructive/10 p-4 rounded-md max-w-md mx-auto shadow-sm">
						<AlertCircle className="h-6 w-6 flex-shrink-0" />
						<p>Error: {error}</p>
					</div>
				)}

				{/* Calendar and Details View  */}
				{!isLoading && !error && (
					<div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
						{/* Calendar */}
						<div>
							<Card className="shadow-md border-primary/10 overflow-hidden w-fit transition-all duration-300 ease-out">
								<CardHeader className="bg-primary/5 border-b">
									<CardTitle className="flex items-center text-primary-foreground">
										<CalendarIcon className="mr-2 h-5 w-5" />
										Calendario
									</CardTitle>
								</CardHeader>
								<CardContent>
									<Calendar
										showOutsideDays={false}
										mode="single"
										locale={es}
										disabled={isDateDisabled}
										selected={selectedDate}
										onSelect={handleDateSelect}
										className="rounded-md w-full max-w-none"
										modifiers={{
											weekend: (date) => isWeekend(date),
											booked: (date) =>
												hasAppointment(date),
										}}
										modifiersClassNames={{
											weekend: "bg-none",
											booked: "bg-accent/30 hover:bg-accent/10 cursor-not-allowed",
										}}
										classNames={{
											month: "space-y-4",
											caption:
												"flex justify-center pt-1 relative items-center",
											caption_label:
												"text-lg font-semibold text-primary-foreground",
											nav: "space-x-1 flex items-center",
											nav_button:
												"h-9 w-9 bg-primary/10 hover:bg-primary/20 rounded-md flex items-center justify-center",
											nav_button_previous:
												"absolute left-1",
											nav_button_next: "absolute right-1",
											table: "w-full border-collapse space-y-1",
											head_row: "flex",
											head_cell:
												"text-muted-foreground rounded-md w-10 md:w-14 font-medium text-sm md:text-base flex-1",
											row: "flex w-full mt-2",
											cell: "text-center text-sm md:text-base p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/10",
											day: "h-10 w-10 md:h-14 md:w-14 p-0 font-normal aria-selected:opacity-100 rounded-md flex items-center justify-center hover:bg-primary/15 aria-selected:bg-primary aria-selected:text-primary-foreground",
											day_selected:
												"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
											day_today:
												"bg-accent/50 text-accent-foreground",
											day_disabled:
												"text-muted-foreground opacity-50 cursor-not-allowed", // Removed bg color as we handle it with modifiers
											day_outside:
												"text-muted-foreground opacity-90",
											day_range_middle:
												"aria-selected:bg-accent aria-selected:text-accent-foreground",
											day_hidden: "invisible",
										}}
									/>
									<div
										className={cn(
											"mt-4 text-center p-2 rounded-md bg-primary/5 text-sm text-muted-foreground",
											selectedDate
												? "opacity-100 translate-x-0"
												: "opacity-0 translate-x-4 pointer-events-none",
										)}
									>
										Fecha seleccionada:{" "}
										<span className="font-semibold">
											{selectedDate &&
												formatDate(selectedDate)}
										</span>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Appointment Details Card */}
						<Card
							className={cn(
								"w-full md:w-1/2 lg:w-2/5 rounded-lg shadow-md border-primary/10", // Base styles
								"transition-all duration-300 ease-out", // Animation
								selectedDate
									? "opacity-100 translate-x-0"
									: "opacity-0 -translate-x-4 pointer-events-none", // Appear/disappear
							)}
						>
							<CardHeader className="bg-primary/5 border-b">
								<CardTitle className="text-primary-foreground">
									Detalles de la Cita
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Form {...form}>
									<form
										method="post"
										className="space-y-5"
										onSubmit={form.handleSubmit(onSubmit)}
									>
										{Object.keys(fieldConfigs).map(
											(fieldName) => (
												<DynamicFormField<BookAppointmentFormData>
													key={fieldName}
													name={
														fieldName as FieldPath<BookAppointmentFormData>
													}
													fieldConfigs={fieldConfigs}
													control={form.control}
												/>
											),
										)}

										<div className="pt-2">
											<Button
												type="submit"
												size="lg"
												disabled={isUploading}
												className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 transition-all duration-200"
											>
												{isUploading ? (
													<Loader2 className="mr-2 h-5 w-5 animate-spin" />
												) : (
													<CheckCircle className="mr-2 h-5 w-5" />
												)}
												Confirmar Cita
											</Button>
										</div>
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
