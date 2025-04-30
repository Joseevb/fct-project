import { Invoice, InvoiceStatusEnum } from "@/api";
import { InvoiceView } from "@/components/pages/admin/InvoiceManagementPage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import useInvoice from "@/hooks/useInvoice";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";

const columns: ColumnDef<Invoice>[] = [
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

function mapViewToStatus(view: InvoiceView): InvoiceStatusEnum | undefined {
	switch (view) {
		case "history":
			return undefined;
		case "paid":
			return "PAID";
		case "unpaid":
			return "WAITING";
	}
}

interface AdminInvoiceTableProps {
	view: InvoiceView;
}

export default function AdminInvoiceTable({
	view,
}: Readonly<AdminInvoiceTableProps>) {
	const { invoices, error, fetchInvoices } = useInvoice();
	const data = invoices?.map((invoice) => ({
		...invoice,
	}));

	useEffect(() => {
		fetchInvoices(mapViewToStatus(view));
	}, [view, fetchInvoices]);

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
