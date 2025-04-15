import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppointmentsApi, Appointment, ErrorMessage, RoleEnum } from "@/api";
import { useNavigate } from "react-router-dom";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function AdminPanel() {
	const [selectedDate, setSelectedDate] = useState<Date>();
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const { user, loading } = useAuth();

	useEffect(() => {
		const getAppointments = async () => {
			try {
				const appointmentsApi = new AppointmentsApi();

				console.log(appointmentsApi);

				const response = await appointmentsApi.getAllAppointments();

				console.log(response.data);
			} catch (err) {
				if (err instanceof AxiosError) {
					const axiosError = err as AxiosError<ErrorMessage>;
					console.log("Error", axiosError.response?.data.message);
					setError(
						axiosError.response?.data.message || "Unknown error",
					);
				} else {
					setError("Unknown error. Please try again.");
				}
			}
		};

		getAppointments();
	}, []);

	useEffect(() => {
		toast.error("Ocurrio un error al cargar los datos", {
			richColors: true,
			description: error,
		});
	}, [error]);

	if (user?.role !== RoleEnum.ADMIN) {
		return (
			<AlertDialog defaultOpen={true}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							No esta autorizado a acceder a este recurso
						</AlertDialogTitle>
						<AlertDialogDescription>
							No cuenta con los permisos necesarios para acceder a
							este recurso.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => navigate("/")}>
							Volver
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								navigate("/login", {
									state: { from: "/admin" },
								})
							}
						>
							Iniciar Sesión
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	return (
		<main>
			<h2>Admin panel</h2>

			<section>
				<h3>Citas</h3>
				<Calendar
					mode="single"
					// disabled={notBookedDays}
					onSelect={(date) => {
						setSelectedDate(date);
						console.log(selectedDate);
					}}
					className="rounded-md border"
				/>
			</section>
		</main>
	);
}
