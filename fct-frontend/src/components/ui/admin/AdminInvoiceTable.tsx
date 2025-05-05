import { Invoice, InvoiceStatusEnum } from "@/api";
import { InvoiceView } from "@/components/pages/admin/InvoiceManagementPage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import useInvoice from "@/hooks/useInvoice";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

	const navigate = useNavigate();

	const columns: ColumnDef<Invoice>[] = useMemo(() => {
		return [
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
			{
				id: "actions",
				cell: ({ row }) => {
					const invoice: Invoice = row.original;

					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Acciones</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() =>
										navigate({
											pathname: "/admin/users",
											search: `?id=${invoice.userId}`,
										})
									}
								>
									Ver usuario
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										navigate({
											pathname: "/admin/invoices",
											search: `?id=${invoice.id}`,
										})
									}
								>
									Ver detalles de la factura
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		] as const;
	}, [navigate]);

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
