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
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DynamicFormField,
	FieldConfig,
} from "@/components/ui/DynamicFormField";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { useScreenSize } from "@/hooks/useScreenSize";
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
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { FieldPath, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { TypographyH2, TypographyP } from "../ui/typography";

const fieldConfigs: Record<string, FieldConfig> = {
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

	const size = useScreenSize();

	const navigate = useNavigate();

	const { appointments, isLoading, fetchAppointments } = useAppointments();

	const form = useForm<BookAppointmentFormData>({
		defaultValues: {
			description: "",
			duration: undefined,
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
		return hasAppointment(date) || isPastDay(date);
	};

	useEffect(() => {
		async function getAppointmentCategories() {
			const api = new AppointmentCategoriesApi();
			const { data: categories, error: catErr } = await tryCatch<
				AxiosResponse<AppointmentCategory[]>,
				AxiosError<ErrorMessage>
			>(api.getAllAppointmentCategories());

			if (catErr) {
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
		}

		getAppointmentCategories();
	}, [error]);

	const handleDateSelect = (date: Date | undefined) => {
		setSelectedDate(date);
	};

	const onSubmit = async (data: z.infer<typeof bookAppointmentSchema>) => {
		if (selectedDate === undefined) {
			setError("Seleccione una fecha");
			return;
		}
		if (!user) {
			navigate("/login");
			return;
		}

		setError("");
		setIsUploading(true);
		form.clearErrors();

		const api = new AppointmentsApi();

		const request: AddAppointmentRequest = {
			...data,
			userId: user.id,
			date: selectedDate?.toISOString(),
		};

		console.log(request);

		const { data: res, error: bookError } = await tryCatch<
			AxiosResponse<Appointment>,
			AxiosError<ResponseError>
		>(api.addAppointment(request));

		if (bookError) {
			const errRes = bookError?.response?.data;
			if (errRes && "messages" in errRes) {
				const validationErrors = Object.entries(errRes.messages).map(
					([field, message]) => ({
						field,
						message,
					}),
				);

				applyValidationErrors(validationErrors, form.setError);
			} else if (errRes && "message" in errRes) {
				setError(errRes.message);
			} else {
				setError("Ocurrió un error inesperado.");
			}
			setIsUploading(false);
			return;
		}

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
	};

	// --- Render ---
	return (
		<main className="container mx-auto p-6 md:p-8 space-y-8">
			<div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
				<TypographyH2 className="flex w-full justify-between pb-8">
					Agendar una Cita
					<div className="flex items-center text-muted-foreground text-sm">
						<CalendarIcon className="mr-2 h-4 w-4" />
						<span>Seleccione una fecha disponible</span>
					</div>
				</TypographyH2>
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
						<TypographyP>Error: {error}</TypographyP>
					</div>
				)}

				{/* Calendar and Details View  */}
				{!isLoading && !error && (
					<motion.div layout>
						<div className="flex flex-col md:flex-row items-start justify-center gap-8 lg:gap-12">
							{/* Calendar */}
							<AnimatePresence mode="popLayout">
								<motion.div
									key="calendar"
									layout
									transition={{
										layout: {
											duration: 0.3,
											ease: "easeInOut",
										},
										default: { duration: 0.3 },
									}}
									className="w-fit"
								>
									<Card className="</AnimatePresence>shadow-md border-primary/10 overflow-hidden w-fit ease-out py-5 gap-0">
										<CardHeader className="border-b mb-5">
											<CardTitle className="flex items-center text-foreground">
												<CalendarIcon className="mr-2 h-5 w-5" />
												Calendario
											</CardTitle>
										</CardHeader>
										<CardContent className="px-2">
											<Calendar
												mode="single"
												locale={es}
												disabled={isDateDisabled}
												selected={selectedDate}
												onSelect={handleDateSelect}
												className="rounded-md w-full max-w-none py-0"
												modifiers={{
													booked: (date) =>
														hasAppointment(date),
												}}
												modifiersClassNames={{
													booked: "bg-accent/30 hover:bg-accent/10",
												}}
												classNames={{
													month: "space-y-4 text-foreground",
													caption:
														"flex justify-center pt-1 relative items-center",
													caption_label:
														"text-lg font-semibold text-foreground",
													nav: "space-x-1 flex items-center",
													nav_button:
														"h-9 w-9 bg-primary/10 hover:bg-primary/20 rounded-md flex items-center justify-center",
													nav_button_previous:
														"absolute left-1",
													nav_button_next:
														"absolute right-1",
													table: "w-full border-collapse space-y-1",
													head_row: "flex",
													head_cell:
														"text-muted-foreground rounded-md w-10 md:w-14 font-medium text-sm md:text-base flex-1",
													row: "flex w-full mt-2",
													cell: "text-center text-sm ml-2 md:text-base p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/10",
													day: "h-10 w-10 md:h-14 md:w-14 p-0 font-normal aria-selected:opacity-100 rounded-md flex items-center justify-center hover:bg-primary/15 aria-selected:bg-primary aria-selected:text-primary-foreground",
													day_selected:
														"bg-primary text-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
													day_today:
														"bg-accent/50 text-accent-foreground",
													day_disabled:
														"text-muted-foreground opacity-50 cursor-not-allowed ",
													day_outside:
														"text-muted-foreground opacity-90",
													day_range_middle:
														"aria-selected:bg-accent aria-selected:text-accent-foreground",
													day_hidden: "invisible",
												}}
											/>
										</CardContent>

										<CardFooter>
											<div
												className={cn(
													"text-center h-full w-full p-2 rounded-md bg-primary/5 text-sm text-muted-foreground",
													selectedDate
														? "opacity-100 translate-x-0"
														: "opacity-0 translate-x-4 pointer-events-none",
												)}
											>
												Fecha seleccionada:{" "}
												<span className="font-semibold">
													{new Intl.DateTimeFormat(
														"es-ES",
														{
															day: "numeric",
															month: "long",
															year: "numeric",
														},
													).format(selectedDate)}
												</span>
											</div>
										</CardFooter>
									</Card>
								</motion.div>

								{/* Appointment Details Card */}
								{selectedDate && (
									<motion.div
										key="form"
										initial={
											size === "xs"
												? { opacity: 0, y: -100 }
												: { opacity: 0, x: -100 }
										}
										animate={
											size === "xs"
												? { opacity: 1, y: 0 }
												: { opacity: 1, x: 0 }
										}
										exit={
											size === "xs"
												? { opacity: 0, y: -100 }
												: { opacity: 0, x: -100 }
										}
										transition={{ duration: 0.3 }}
										className="w-full md:w-1/3 lg:w-2/5"
									>
										<Card
											className={cn(
												"w-full rounded-lg shadow-md border-primary/10", // Base styles
												// "animate-in fade-in slide-in-from-right-4 duration-500 ease-in-out", // Animation
											)}
										>
											<CardHeader className="border-b">
												<CardTitle className="text-foreground">
													Detalles de la Cita
												</CardTitle>
											</CardHeader>
											<CardContent>
												<Form {...form}>
													<form
														method="post"
														className="space-y-5"
														onSubmit={form.handleSubmit(
															onSubmit,
														)}
													>
														{Object.keys(
															fieldConfigs,
														).map((fieldName) => (
															<DynamicFormField<BookAppointmentFormData>
																key={fieldName}
																name={
																	fieldName as FieldPath<BookAppointmentFormData>
																}
																fieldConfigs={
																	fieldConfigs
																}
																control={
																	form.control
																}
															/>
														))}

														<div className="pt-2">
															<Button
																type="submit"
																size="lg"
																disabled={
																	isUploading
																}
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
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				)}
			</section>
		</main>
	);
}
