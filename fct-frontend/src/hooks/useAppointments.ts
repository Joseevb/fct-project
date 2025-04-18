import { useState, useEffect, useCallback } from "react";
import { AppointmentsApi, Appointment, ErrorMessage } from "@/api"; // Adjust path
import { AxiosError } from "axios";
import { toast } from "sonner";
import { tryCatch } from "@/lib/tryCatch";

interface UseAppointmentsResult {
	appointments: Appointment[];
	isLoading: boolean;
	error: string | null;
	fetchAppointments: () => Promise<void>;
}

export function useAppointments(): UseAppointmentsResult {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const fetchAppointments = useCallback(async () => {
		const appointmentsApi = new AppointmentsApi();

		const { data, error } = await tryCatch(
			appointmentsApi.getAllAppointments(),
		);

		if (error) {
			if (error instanceof AxiosError) {
				const axiosError = error as AxiosError<ErrorMessage>;
				console.log("Error", axiosError.response?.data.message);
				setErrorMessage(
					axiosError.response?.data.message || "Unknown error",
				);
			} else {
				setErrorMessage("Unknown error. Please try again.");
			}
			toast.error("Error al cargar citas", {
				// Show toast on error
				richColors: true,
				description: errorMessage,
			});
		}

		if (data) {
			setAppointments(data.data || []);
			console.log(data.data);
		}

		setIsLoading(false);
	}, [errorMessage]);

	useEffect(() => {
		fetchAppointments();
	}, [fetchAppointments]);

	return {
		appointments,
		isLoading,
		error: errorMessage,
		fetchAppointments,
	};
}
