import { Appointment } from "@/api";
import { useAppointments } from "@/hooks/useAppointments";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

const columns: ColumnDef<Appointment>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "date",
		header: "Fecha",
	},
	{
		accessorKey: "duration",
		header: "Duración",
	},
	{
		accessorKey: "description",
		header: "Descripción",
	},
	{
		accessorKey: "status",
		header: "Estado",
	},
	{
		accessorKey: "price",
		header: "Precio",
	},
] as const;

export default function UserAppointmentsPage() {
	const { userAppointments } = useAppointments();

	return (
		<main>
			<section className="flex items-center justify-center p-6 md:p-8 gap-4 w-full">
				<h2 className="text-2xl font-semibold tracking-tight">
					Mis citas
				</h2>
			</section>

			<section className="p-6 md:p-8 space-y-6">
				<DataTable columns={columns} data={userAppointments} />
			</section>
		</main>
	);
}
