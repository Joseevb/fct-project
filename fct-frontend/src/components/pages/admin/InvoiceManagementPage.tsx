import AdminInvoiceDetails from "@/components/ui/admin/AdminInvoiceDetails";
import AdminInvoiceTable from "@/components/ui/admin/AdminInvoiceTable";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { TypographyH3 } from "@/components/ui/typography";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const invoiceManagementViews = [
	{ value: "history", label: "Historial" },
	{ value: "paid", label: "Pagadas" },
	{ value: "unpaid", label: "No pagadas" },
] as const;

type InvoiceManagementView = (typeof invoiceManagementViews)[number]["value"];
export type InvoiceView = InvoiceManagementView | "details";

export default function InvoiceManagementPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();

	// Get the 'id' search parameter from the URL
	const invoiceId = searchParams.get("id");

	// If invoiceId exists, the view is 'details', otherwise it's a management view
	const currentView: InvoiceView = invoiceId
		? "details"
		: invoiceManagementViews.find((view) =>
				location.pathname.includes(`/admin/invoices/${view.value}`),
			)?.value || "history";

	// Helper function to navigate to a management view
	const handleManagementViewSelect = (view: InvoiceManagementView) => {
		navigate(`/admin/invoices/${view}`);
		if (invoiceId) {
			navigate({
				pathname: location.pathname,
				search: "",
			});
		}
	};

	const navigationViews = [
		...invoiceManagementViews,
		{ value: "details", label: "Detalles", disabled: !invoiceId },
	];

	return (
		<section className="flex flex-col gap-4">
			<header>
				<TypographyH3 className="mb-10">Facturas</TypographyH3>
				<NavigationMenu>
					<NavigationMenuList>
						{navigationViews.map((view) => (
							<NavigationMenuItem key={view.value}>
								{view.value === "details" ? (
									<Button
										variant={
											currentView === "details"
												? "default"
												: "ghost"
										}
										disabled={view.disabled}
									>
										{view.label}
									</Button>
								) : (
									<Button
										variant={
											currentView === view.value
												? "default"
												: "ghost"
										}
										onClick={() =>
											handleManagementViewSelect(
												view.value as InvoiceManagementView,
											)
										}
									>
										{view.label}
									</Button>
								)}
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</header>

			<main>
				{/* Conditional rendering based on the currentView derived from the URL */}
				{currentView === "details" && invoiceId ? (
					<AdminInvoiceDetails invoiceId={Number(invoiceId)} />
				) : currentView === "history" ? (
					<AdminInvoiceTable view="history" />
				) : currentView === "paid" ? (
					<AdminInvoiceTable view="paid" />
				) : currentView === "unpaid" ? (
					<AdminInvoiceTable view="unpaid" />
				) : (
					<div>
						<p>Select a view.</p>
					</div>
				)}
			</main>
		</section>
	);
}
