import AdminAuthGuard from "@/components/guards/AdminAuthGuard";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import AppointmentManagementPage from "@/components/pages/admin/AppointmentManagementPage";

const adminPages = [
	{
		value: "appointments",
		label: "Citas",
	},
	{
		value: "invoices",
		label: "Facturas",
	},
	{
		value: "users",
		label: "Usuarios",
	},
] as const;

type AdminPage = (typeof adminPages)[number]["value"];

export default function AdminPanel() {
	const [selectedPage, setSelectedPage] = useState<AdminPage>("appointments");

	return (
		<AdminAuthGuard>
			<header className="flex items-center p-6 md:p-8 gap-4">
				<h2 className="text-2xl font-semibold tracking-tight">
					Panel de Administración
				</h2>
				<Select
					value={selectedPage}
					onValueChange={(value) =>
						setSelectedPage(value as AdminPage)
					}
				>
					<SelectTrigger className="w-[130px]">
						<SelectValue placeholder="Citas" />
					</SelectTrigger>
					<SelectContent>
						{adminPages.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</header>
			<main className="p-6 md:p-8 space-y-6">
				{selectedPage === "appointments" && (
					<AppointmentManagementPage />
				)}
			</main>
		</AdminAuthGuard>
	);
}
