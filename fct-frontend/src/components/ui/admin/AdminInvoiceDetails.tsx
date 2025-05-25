import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import {
	ErrorMessage,
	Invoice,
	InvoicesApi,
	LineItem,
	LineItemsApi,
} from "@/api";
import { tryCatch } from "@/lib/tryCatch";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

const invoiceColumns: ColumnDef<Invoice>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "date",
		header: "Fecha",
	},
	{
		accessorKey: "status",
		header: "Estado",
	},
	{
		accessorKey: "total",
		header: "Total",
	},
	{
		accessorKey: "paymentMethod",
		header: "Método de pago",
	},
	{
		accessorKey: "userId",
		header: "Usuario",
	},
	{
		accessorKey: "createdAt",
		header: "Fecha de creación",
	},
	{
		accessorKey: "updatedAt",
		header: "Fecha de actualización",
	},
] as const;

const detailsColumns: ColumnDef<LineItem>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "quantity",
		header: "Cantidad",
	},
	{
		accessorKey: "subtotal",
		header: "Subtotal",
	},
	{
		header: "Item ID",
		cell: ({ row }) => {
			const item = row.original;
			return (
				item.productId || item.appointmentId || item.courseId || "N/A"
			);
		},
	},
	{
		accessorKey: "invoiceId",
		header: "Factura",
	},
	{
		accessorKey: "createdAt",
		header: "Fecha de creación",
	},
] as const;

interface AdminInvoiceDetailsProps {
	invoiceId: number;
}

export default function AdminInvoiceDetails({
	invoiceId,
}: Readonly<AdminInvoiceDetailsProps>) {
	const [invoice, setInvoice] = useState<Invoice | null>(null);
	const [isInvoiceLoading, setIsInvoiceLoading] = useState(true);

	const [invoiceDetails, setInvoiceDetails] = useState<LineItem[]>([]);
	const [areDetailsLoading, setAreDetailsLoading] = useState(true);

	useEffect(() => {
		async function fetchDataInvoice() {
			const api = new InvoicesApi();
			const { data: res, error } = await tryCatch<
				AxiosResponse<Invoice>,
				AxiosError<ErrorMessage>
			>(api.getInvoiceById(invoiceId));
			setIsInvoiceLoading(true);

			if (error) {
				toast.error("Error al cargar factura", {
					// Show toast on error
					richColors: true,
					description:
						error.response?.data.message ||
						"Error al cargar factura",
				});
				return;
			}

			setInvoice(res.data);
			setIsInvoiceLoading(false);
		}

		async function fetchDataDetails() {
			const api = new LineItemsApi();
			const { data: res, error } = await tryCatch<
				AxiosResponse<LineItem[]>,
				AxiosError<ErrorMessage>
			>(api.getAllLineItems(invoiceId));
			setAreDetailsLoading(true);

			if (error) {
				toast.error("Error al cargar detalles", {
					// Show toast on error
					richColors: true,
					description:
						error.response?.data.message ||
						"Error al cargar detalles",
				});
				return;
			}

			setInvoiceDetails(res.data);
			setAreDetailsLoading(false);
		}

		fetchDataInvoice();
		fetchDataDetails();
	});

	return (
		<div className="space-y-10">
			<section>
				<h3>Factura: {invoiceId}</h3>
				{invoice ? (
					isInvoiceLoading ? (
						<Loader2 className="mr-2 h-10 w-10 animate-spin" />
					) : (
						<DataTable columns={invoiceColumns} data={[invoice]} />
					)
				) : (
					<Alert variant="destructive">
						<AlertDescription>
							Error al cargar la factura
						</AlertDescription>
					</Alert>
				)}
			</section>

			<section>
				<h3>Detalles de la factura</h3>
				{areDetailsLoading ? (
					<Loader2 className="mr-2 h-10 w-10 animate-spin" />
				) : (
					<DataTable columns={detailsColumns} data={invoiceDetails} />
				)}
			</section>
		</div>
	);
}
