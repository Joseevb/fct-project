import { AppointmentCategoriesApi, AppointmentCategory } from "@/api";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/hooks/useAppointments";
import { tryCatch } from "@/lib/tryCatch";
import { cn, formatDate } from "@/lib/utils";
import {
	BookAppointmentFormData,
	bookAppointmentSchema,
} from "@/schemas/bookAppointmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FieldPath, useForm } from "react-hook-form";
import { DynamicFormField } from "@/components/ui/DynamicFormField";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { z } from "zod";

const fieldConfigs = {
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
		label: "Duración",
		placeholder: "Introduzca la duración de la cita",
		type: "number",
	},
	date: {
		label: "Fecha",
		placeholder: "Introduzca la fecha de la cita",
		type: "date",
	},
	categoryId: {
		label: "Categoría",
		placeholder: "Seleccione una categoría",
		type: "select",
	},
} as const;

export default function AppointmentBookingPage() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [isUploading, setIsUploading] = useState(false);
	const [appointmentCategories, setAppointmentCategories] = useState<
		AppointmentCategory[]
	>([]);

	const {
		appointments,
		isLoading,
		error: appointmentsError,
	} = useAppointments();

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
		const getAppointmentCategories = async () => {
			const api = new AppointmentCategoriesApi();
			const { data: categories, error } = await tryCatch(
				api.getAllAppointmentCategories(),
			);

			if (error)
				console.error("Error fetching appointment categories:", error);

			if (categories) setAppointmentCategories(categories.data);
		};

		getAppointmentCategories();
	}, []);

	useEffect(() => {
		if (selectedDate) {
			form.setValue("date", formatDate(selectedDate));
		}
	}, [selectedDate, form]);

	const handleDateSelect = (date: Date | undefined) => {
		setSelectedDate(date);
	};

	const onSubmit = async (data: z.infer<typeof bookAppointmentSchema>) => {
		setIsUploading(true);
		console.log("data:", data);
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
				{!isLoading && appointmentsError && (
					<div className="flex items-center space-x-2 text-destructive border border-destructive/50 bg-destructive/10 p-3 rounded-md max-w-md mx-auto">
						<AlertCircle className="h-5 w-5" />
						<p className="text-sm">Error: {appointmentsError}</p>
					</div>
				)}

				{/* Calendar and Details View  */}
				{!isLoading && !appointmentsError && (
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
										<FormField
											control={form.control}
											name="date"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Fecha</FormLabel>
													<FormControl>
														<Input
															{...field}
															type="date"
															disabled={true}
															// Don't override the value here!
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{Object.keys(fieldConfigs)
											.filter(
												(fieldName) =>
													fieldName !== "date" &&
													fieldName !== "categoryId",
											)
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
										<FormField
											control={form.control}
											name="categoryId"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Categoría
													</FormLabel>
													<Select
														onValueChange={(
															value,
														) =>
															field.onChange(
																parseInt(
																	value,
																	10,
																),
															)
														}
														value={
															field.value?.toString() ||
															""
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Seleccione una categoría" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{appointmentCategories.map(
																(category) => (
																	<SelectItem
																		key={
																			category.id
																		}
																		value={category.id.toString()}
																	>
																		{
																			category.name
																		}
																	</SelectItem>
																),
															)}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button
											type="submit"
											variant="outline"
											size="sm"
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
