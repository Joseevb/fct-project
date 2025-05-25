import { useState, useMemo, useEffect } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Appointment, AppointmentStatusEnum } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/tryCatch";
import { TypographyH3, TypographyList } from "../typography";

export default function AdminAppointmentCalendar() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [selectedAppointment, setSelectedAppointment] =
		useState<Appointment | null>(null);
	const [isUpdating, setIsUpdating] = useState(false); // Loading state for Accept/Cancel actions

	const {
		appointments,
		isLoading,
		error: appointmentsError,
		acceptAppointment,
		cancelAppointment,
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
		return dateSet;
	}, [appointments]);

	const isDateDisabled = (date: Date): boolean => {
		const dateString = formatDate(date);
		return !availableDateStrings.has(dateString);
	};

	useEffect(() => {
		if (selectedDate) {
			const dateString = formatDate(selectedDate);
			const foundApp = appointments.find(
				(app) => formatDate(new Date(app.date)) === dateString,
			);
			setSelectedAppointment(foundApp || null); // Set to null if not found
		} else {
			setSelectedAppointment(null);
		}
	}, [selectedDate, appointments]);

	const handleDateSelect = (date: Date | undefined) => {
		setSelectedDate(date);
	};

	const handleAppointmentChange = async (kind: "accept" | "decline") => {
		if (!selectedAppointment?.id) return;
		setIsUpdating(true);

		const action =
			kind === "accept" ? acceptAppointment : cancelAppointment;
		await action(selectedAppointment.id).then();

		setIsUpdating(false);
	};

	return (
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
							selectedAppointment
								? "opacity-100 translate-x-0"
								: "opacity-0 -translate-x-4 pointer-events-none", // Appear/disappear
						)}
					>
						<CardHeader>
							<CardTitle>
								<TypographyH3>Detalles de la Cita</TypographyH3>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Use selectedAppointment state which is updated by useEffect */}
							{selectedAppointment && (
								<div className="space-y-3">
									<TypographyList>
										<li>
											<strong className="text-foreground">
												Fecha y Hora:{" "}
											</strong>
											{new Date(
												selectedAppointment.date,
											).toLocaleString("es", {
												dateStyle: "long",
												timeStyle: "short",
											})}
										</li>
										<li>
											<strong className="text-foreground">
												Duración:{" "}
											</strong>
											{selectedAppointment.duration}{" "}
											minutos
										</li>
										{selectedAppointment.description && (
											<li>
												<strong className="text-foreground">
													Descripción:{" "}
												</strong>
												{
													selectedAppointment.description
												}
											</li>
										)}
										<li>
											<strong className="text-foreground">
												Estado:{" "}
											</strong>
											<span
												className={cn(
													"font-medium",
													selectedAppointment.status ===
														AppointmentStatusEnum.ACCEPTED &&
														"text-green-600",
													selectedAppointment.status ===
														AppointmentStatusEnum.DECLINED &&
														"text-red-600",
													selectedAppointment.status ===
														AppointmentStatusEnum.WAITING &&
														"text-yellow-600",
													// Add other statuses as needed
												)}
											>
												{selectedAppointment.status}
											</span>
										</li>
										{/* Optional: Add user details here */}
									</TypographyList>
									<div className="flex items-center space-x-3 pt-2">
										{/* Accept Button */}
										<Button
											type="button"
											variant="outline"
											size="sm" // Smaller buttons often fit better here
											onClick={() =>
												handleAppointmentChange(
													"accept",
												)
											}
											// Disable if already accepted OR while updating
											disabled={
												isUpdating ||
												selectedAppointment.status ===
													AppointmentStatusEnum.ACCEPTED
											}
											className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700 disabled:opacity-50"
										>
											{isUpdating ? (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											) : (
												<CheckCircle className="mr-2 h-4 w-4" />
											)}
											Aceptar
										</Button>
										{/* Cancel/Decline Button */}
										<Button
											type="button"
											variant="destructive"
											size="sm"
											onClick={() =>
												handleAppointmentChange(
													"decline",
												)
											}
											// Disable if already declined OR while updating
											disabled={
												isUpdating ||
												selectedAppointment.status ===
													AppointmentStatusEnum.DECLINED
											}
											className="disabled:opacity-50"
										>
											{isUpdating ? (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											) : (
												<XCircle className="mr-2 h-4 w-4" />
											)}
											{selectedAppointment.status ===
											AppointmentStatusEnum.DECLINED
												? "Rechazada"
												: "Rechazar"}
										</Button>
									</div>
									{/* Optional: Show action error locally */}
									{/* {actionError && <p className="text-sm text-destructive mt-2">{actionError}</p>} */}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</section>
	);
}
