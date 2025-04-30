import AdminAppointmentCalendar from "@/components/ui/admin/AdminAppointmentCalendar";
import AdminAppointmentCategoryForm from "@/components/ui/admin/AdminAppointmentCategoryForm";
import AdminAppointmentTable from "@/components/ui/admin/AdminAppointmentTable";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useState } from "react";

const adminAppointmentViews = [
	{ value: "calendar", label: "Calendario" },
	{ value: "add-category", label: "Agregar Categoría" },
	{ value: "appointment-list", label: "Lista de Citas" },
] as const;

type AdminAppointmentView = (typeof adminAppointmentViews)[number]["value"];

export default function AppointmentManagementPage() {
	const [selectedAppointmentView, setSelectedAppointmentView] =
		useState<AdminAppointmentView>("calendar");

	return (
		<section className="flex flex-col gap-4">
			<header className="flex items-center gap-8 mb-5">
				<h2 className="text-2xl font-semibold tracking-tight">Citas</h2>
				<NavigationMenu>
					<NavigationMenuList>
						{adminAppointmentViews.map((view) => (
							<NavigationMenuItem key={view.value}>
								<Button
									variant={
										selectedAppointmentView === view.value
											? "default"
											: "ghost"
									}
									onClick={() =>
										setSelectedAppointmentView(view.value)
									}
								>
									{view.label}
								</Button>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</header>

			{selectedAppointmentView === "calendar" && (
				<AdminAppointmentCalendar />
			)}
			{selectedAppointmentView === "add-category" && (
				<AdminAppointmentCategoryForm />
			)}

			{selectedAppointmentView === "appointment-list" && (
				<AdminAppointmentTable />
			)}
		</section>
	);
}
