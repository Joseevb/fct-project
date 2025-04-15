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
import { Skeleton } from "../ui/skeleton";

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
				setAppointments(response.data);

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
		if (error != "") {
			toast.error("Ocurrio un error al cargar los datos", {
				richColors: true,
				description: error,
			});
			console.log(error);
		}
	}, [error]);

	const availableDates = appointments.map((app) => new Date(app.date));

	const disabledDays = (date: Date) => {
		const formattedDate = date.toDateString();
		return !availableDates.some((d) => d.toDateString() === formattedDate);
	};

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
		<main className="p-8">
			<h2>Admin panel</h2>

			<section className="flex flex-col w-fit my-10">
				<h3>Citas</h3>
				{loading && <Skeleton />}
				<Calendar
					mode="single"
					disabled={disabledDays}
					selected={selectedDate}
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
