import { useState, useEffect, useCallback } from "react";
import {
	AppointmentsApi,
	Appointment,
	ErrorMessage,
	AppointmentStatusEnum,
} from "@/api"; // Adjust path
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { tryCatch } from "@/lib/tryCatch";
import { useAuth } from "./useAuth";

interface UseAppointmentsResult {
	appointments: Appointment[];
	userAppointments: Appointment[];
	isLoading: boolean;
	error: string | null;
	fetchAppointments: () => Promise<void>;
	fetchUserAppointments: () => Promise<void>;
	acceptAppointment: (id: number | undefined) => Promise<boolean>;
	cancelAppointment: (id: number | undefined) => Promise<boolean>;
}

export function useAppointments(): UseAppointmentsResult {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { user } = useAuth();

	const fetchAppointments = useCallback(async () => {
		const appointmentsApi = new AppointmentsApi();

		const { data: res, error } = await tryCatch<
			AxiosResponse<Appointment[]>,
			ErrorMessage
		>(appointmentsApi.getAllAppointments());

		if (error) {
			if (error instanceof AxiosError) {
				const axiosError = error as AxiosError<ErrorMessage>;
				console.error("Error", axiosError.response?.data.message);
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
			return;
		}

		setAppointments(res.data || []);

		setIsLoading(false);
	}, [errorMessage]);

	const fetchUserAppointments = useCallback(async () => {
		const appointmentsApi = new AppointmentsApi();

		const { data: res, error } = await tryCatch<
			AxiosResponse<Appointment[]>,
			ErrorMessage
		>(appointmentsApi.getAllAppointments(user?.id));

		if (error) {
			if (error instanceof AxiosError) {
				const axiosError = error as AxiosError<ErrorMessage>;
				console.error("Error", axiosError.response?.data.message);
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
			return;
		}

		setUserAppointments(res.data || []);

		setIsLoading(false);
	}, [errorMessage, user?.id]);

	const updateAppointmentStatus = useCallback(
		async (id: number, status: AppointmentStatusEnum) => {
			const api = new AppointmentsApi();
			const { data, error } = await tryCatch(
				api.updateAppointmentStatus(id, { status }),
			);

			if (data) {
				toast.success("Estado de la cita actualizado con exito", {
					richColors: true,
				});
				await fetchAppointments();
				return appointments.find((app) => app.id === id);
			}

			if (error) {
				if (error instanceof AxiosError) {
					const axiosError = error as AxiosError<ErrorMessage>;
					console.error("Error", axiosError.response?.data.message);
					setErrorMessage(
						axiosError.response?.data.message || "Unknown error",
					);
				} else {
					setErrorMessage("Unknown error. Please try again.");
				}
				toast.error("Error al actualizar la cita", {
					// Show toast on error
					richColors: true,
					description: errorMessage,
				});
			}
		},
		[appointments, errorMessage, fetchAppointments],
	);

	const acceptAppointment = useCallback(
		async (id: number | undefined) => {
			if (id === undefined) {
				console.warn("acceptAppointment called with undefined id.");
				setErrorMessage("No se proporcionó ID para aceptar la cita.");
				return false;
			}
			const updated = await updateAppointmentStatus(
				id,
				AppointmentStatusEnum.ACCEPTED,
			);
			return !!updated;
		},
		[updateAppointmentStatus],
	);

	const cancelAppointment = useCallback(
		async (id: number | undefined) => {
			if (id === undefined) {
				console.warn("acceptAppointment called with undefined id.");
				setErrorMessage("No se proporcionó ID para aceptar la cita.");
				return false;
			}
			const updated = await updateAppointmentStatus(
				id,
				AppointmentStatusEnum.DECLINED,
			);
			return !!updated;
		},
		[updateAppointmentStatus],
	);

	useEffect(() => {
		fetchAppointments();
		fetchUserAppointments();
	}, [fetchAppointments, fetchUserAppointments]);

	return {
		appointments,
		userAppointments,
		isLoading,
		error: errorMessage,
		fetchAppointments,
		fetchUserAppointments,
		acceptAppointment,
		cancelAppointment,
	};
}
