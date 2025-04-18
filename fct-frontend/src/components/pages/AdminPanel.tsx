import { useState, useMemo } from "react";
import AdminAuthGuard from "@/components/guards/AdminAuthGuard";
import { useAppointments } from "@/hooks/useAppointments";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Appointment } from "@/api";
import { tryCatch } from "@/lib/tryCatch";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Formats a date to YYYY-MM-DD format string
 * @param date The date to format
 * @returns The formatted date
 */
function formatDate(date: Date): string {
	if (!(date instanceof Date) || isNaN(date.getTime())) {
		console.warn("formatDate received invalid Date object:", date);
		return "invalid-date";
	}
	// Use methods that respect the local timezone representation of the Date object
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth is 0-indexed
	const day = String(date.getDate()).padStart(2, "0"); // getDate is local day
	const result = `${year}-${month}-${day}`;
	console.log(`formatDate Input: ${date.toString()}, Output: ${result}`); // Optional Debug
	return result;
}

export default function AdminPanel() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [selectedAppointment, setSelectedAppointment] = useState<
		Appointment | undefined
	>();

	const { language } = useLanguage("es");

	const {
		appointments,
		isLoading,
		error: appointmentsError,
	} = useAppointments();

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
		console.log("Available date strings:", dateSet);
		return dateSet;
	}, [appointments]);

	// Check if a date should be disabled (has NO appointments)
	const isDateDisabled = (date: Date): boolean =>
		!availableDateStrings.has(formatDate(date));

	// Handle date selection from the calendar
	const handleDateSelect = (date: Date | undefined) => {
		setSelectedDate(date);
		console.log(availableDateStrings);
		if (date) {
			setSelectedAppointment(
				appointments.find(
					(app) =>
						formatDate(new Date(app.date)) === formatDate(date),
				),
			);
			console.log("Selected Date:", formatDate(date));
		} else {
			setSelectedAppointment(undefined);
			console.log("Date selection cleared.");
		}
	};

	return (
		<AdminAuthGuard>
			{/* Wrap content in the authorization guard */}
			<main className="p-6 md:p-8 space-y-6">
				<h2 className="text-2xl font-semibold tracking-tight">
					Panel de Administración
				</h2>

				<section className="space-y-4">
					<h3 className="text-lg font-medium">Citas Programadas</h3>

					{/* Conditional Rendering for Calendar section */}
					{isLoading && ( // Show skeleton while loading appointments
						<div className="p-4 border rounded-md w-full max-w-sm mx-auto">
							<Skeleton className="h-8 w-3/4 mb-4" />
							<Skeleton className="h-64 w-full" />{" "}
							{/* Skeleton for Calendar */}
						</div>
					)}

					{/* Show error message if fetching failed */}
					{!isLoading && appointmentsError && (
						<div className="flex items-center space-x-2 text-destructive border border-destructive/50 bg-destructive/10 p-3 rounded-md max-w-md mx-auto">
							<AlertCircle className="h-5 w-5" />
							<p className="text-sm">
								Error al cargar citas: {appointmentsError}
							</p>
						</div>
					)}

					{/* Show Calendar only if not loading and no error */}
					{!isLoading && !appointmentsError && (
						// Use Fragment if no extra div needed, or div with relative if needed for absolute positioning *within* this flex container
						<div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
							{/* Calendar */}
							<Calendar
								mode="single"
								disabled={isDateDisabled}
								selected={selectedDate}
								onSelect={handleDateSelect}
								className="rounded-md border shadow-sm w-full max-w-fit self-center md:self-start" // Max width, centering on small screens
							/>

							<Card
								className={cn(
									// Base styling for the card
									"w-full md:max-w-md", // Responsive width
									"rounded-md",
									// Base transition classes
									"transition-all duration-300 ease-out", // Faster duration? Adjust as needed
									// Conditional classes for appear/disappear animation
									selectedAppointment // Condition based on whether details should be shown
										? "opacity-100 translate-x-0" // Visible: Opaque, original position
										: "opacity-0 -translate-x-4 pointer-events-none", // Hidden: Transparent, shifted left slightly, non-interactive
								)}
							>
								<CardHeader>
									<CardTitle>Detalles de la Cita</CardTitle>
								</CardHeader>
								<CardContent>
									{selectedAppointment && (
										<ul className="space-y-2 text-sm">
											<li>
												<strong>Fecha y Hora: </strong>
												{new Date(
													selectedAppointment.date,
												).toLocaleString(language, {
													dateStyle: "long",
													timeStyle: "short",
												})}
											</li>
											<li>
												<strong>Duración: </strong>
												{
													selectedAppointment.duration
												}{" "}
												minutos
											</li>
											{selectedAppointment.description && (
												<li>
													<strong>
														Descripción:{" "}
													</strong>
													{
														selectedAppointment.description
													}
												</li>
											)}
											{/* TODO: Add patient/user details if available */}
											{/* Example: */}
											{/* <li>
                                                  <strong>Cliente: </strong>
                                                  {selectedAppointment.user?.firstName} {selectedAppointment.user?.lastName}
                                             </li> */}
										</ul>
									)}
								</CardContent>
							</Card>
						</div>
					)}
				</section>

				{/* TODO: Add other admin panel sections here */}
			</main>
		</AdminAuthGuard>
	);
}
