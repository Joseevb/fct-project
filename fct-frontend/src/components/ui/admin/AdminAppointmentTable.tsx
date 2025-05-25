import {
	Appointment,
	ErrorMessage,
	Invoice,
	InvoicesApi,
	InvoiceStatusEnum,
} from "@/api";
import { useAppointments } from "@/hooks/useAppointments";
import { tryCatch } from "@/lib/tryCatch";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";

type AppointmentTableData = Appointment & {
	invoiceStatus: InvoiceStatusEnum | "N/A";
};

const columns: ColumnDef<AppointmentTableData>[] = [
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
		accessorKey: "name",
		header: "Título",
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
	{
		accessorKey: "invoiceStatus",
		header: "Estado de la factura",
	},
	{
		accessorKey: "userId",
		header: "Usuario",
	},
];

export default function AdminAppointmentTable() {
	const [data, setData] = useState<AppointmentTableData[]>([]);
	const [error, setError] = useState<string | null>(null);

	const { appointments } = useAppointments();

	const getInvoiceStatusByAppointmentId = async (id: number) => {
		const invoiceApi = new InvoicesApi();
		const { data: invoice, error: invoiceError } = await tryCatch<
			AxiosResponse<Invoice[]>,
			AxiosError<ErrorMessage>
		>(invoiceApi.getAllInvoices(undefined, undefined, id));

		if (invoiceError) {
			throw invoiceError;
		}

		return invoice.data[0] ? invoice.data[0].status : "N/A";
	};

	useEffect(() => {
		const fetchAppointmentsWithInvoiceStatus = async () => {
			const result: AppointmentTableData[] = [];

			for (const appointment of appointments) {
				const { data: invoiceStatus, error: invoiceError } =
					await tryCatch<
						InvoiceStatusEnum | "N/A",
						AxiosError<ErrorMessage>
					>(getInvoiceStatusByAppointmentId(appointment.id));

				if (invoiceError) {
					setError(
						invoiceError.response?.data.message || "Unknown error",
					);
					return; // Early return on error
				}

				result.push({ ...appointment, invoiceStatus });
			}

			setData(result);
		};

		fetchAppointmentsWithInvoiceStatus();
	}, [appointments]);

	return (
		<div className="container mx-auto py-10">
			{error ? (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : (
				<DataTable columns={columns} data={data} />
			)}
		</div>
	);
}
