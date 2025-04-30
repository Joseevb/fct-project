import AdminInvoiceTable from "@/components/ui/admin/AdminInvoiceTable";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useState } from "react";

const invoiceViews = [
	{ value: "history", label: "Historial" },
	{ value: "paid", label: "Pagadas" },
	{ value: "unpaid", label: "No pagadas" },
];

export type InvoiceView = (typeof invoiceViews)[number]["value"];

export default function InvoiceManagementPage() {
	const [selectedView, setSelectedView] = useState<InvoiceView>("history");

	return (
		<section className="flex flex-col gap-4">
			<header className="flex items-center gap-8 mb-5">
				<h2 className="text-2xl font-semibold tracking-tight">
					Facturas
				</h2>
				<NavigationMenu>
					<NavigationMenuList>
						{invoiceViews.map((view) => (
							<NavigationMenuItem key={view.value}>
								<Button
									variant={
										selectedView === view.value
											? "default"
											: "ghost"
									}
									onClick={() => setSelectedView(view.value)}
								>
									{view.label}
								</Button>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</header>

			<AdminInvoiceTable view={selectedView} />
		</section>
	);
}
