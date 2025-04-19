import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { useAppointments } from "@/hooks/useAppointments";

export default function AppointmentSchedulePage() {
	const [selectedDate, setSelectedDate] = useState<Date>();

	const { appointments } = useAppointments();

	const disabledDates = appointments.map(
		(appointment) => new Date(appointment.date),
	);

	return (
		<main>
			<h2>Seleccione una fecha para agendar una cita:</h2>
			<div>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={setSelectedDate}
					disabled={disabledDates}
					className="rounded-md border shadow-sm w-full max-w-fit self-center md:self-start"
				/>
			</div>
		</main>
	);
}
