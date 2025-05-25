import AdminAuthGuard from "@/components/guards/AdminAuthGuard";
import AppointmentManagementPage from "@/components/pages/admin/AppointmentManagementPage";
import InvoiceManagementPage from "@/components/pages/admin/InvoiceManagementPage";
import UserManagementPage from "@/components/pages/admin/UserManagementPage";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import CourseManagementPage from "./CourseManagementPage";
import ProductManagementPage from "./ProductManagementPage";
import { TypographyH2 } from "@/components/ui/typography";

const adminPages = [
	{
		value: "appointments",
		label: "Citas",
	},
	{
		value: "courses",
		label: "Cursos",
	},
	{
		value: "products",
		label: "Productos",
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

// type AdminPage = (typeof adminPages)[number]["value"];

export default function AdminPanel() {
	// const [selectedPage, setSelectedPage] = useState<AdminPage>("appointments");

	const navigate = useNavigate();

	const selectedPage =
		adminPages.find(({ value }) =>
			location.pathname.includes(`/admin/${value}`),
		)?.value || "appointments";

	return (
		<AdminAuthGuard>
			<div className="mx-12 my-9">
				<header className="flex items-center gap-4 mb-16">
					<TypographyH2 className="mb-0">
						Panel de Administración
					</TypographyH2>
					<Select
						value={selectedPage}
						onValueChange={(value) => navigate(`/admin/${value}`)}
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
				<main>
					{selectedPage === "appointments" && (
						<AppointmentManagementPage />
					)}

					{selectedPage === "invoices" && <InvoiceManagementPage />}

					{selectedPage === "users" && <UserManagementPage />}

					{selectedPage === "courses" && <CourseManagementPage />}

					{selectedPage === "products" && <ProductManagementPage />}
				</main>
			</div>
		</AdminAuthGuard>
	);
}
