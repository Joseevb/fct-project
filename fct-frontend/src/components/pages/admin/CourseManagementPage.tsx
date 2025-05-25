import AdminCourseCategoriesTable from "@/components/ui/admin/AdminCourseCategoriesTable";
import AdminCourseCategoryForm from "@/components/ui/admin/AdminCourseCategoryForm";
import AdminCourseForm from "@/components/ui/admin/AdminCourseForm";
import AdminCoursesTable from "@/components/ui/admin/AdminCoursesTable";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { TypographyH3 } from "@/components/ui/typography";
import { useState } from "react";

const adminCourseViews = [
	{ value: "list", label: "Lista de Cursos" },
	{ value: "add-course", label: "Agregar Curso" },
	{ value: "category-list", label: "Lista de Categorías" },
	{ value: "add-category", label: "Agregar Categoría" },
] as const;

type AdminCourseView = (typeof adminCourseViews)[number]["value"];

export default function CourseManagementPage() {
	const [selectedCourseView, setSelectedCourseView] =
		useState<AdminCourseView>("list");

	return (
		<section className="flex flex-col gap-4">
			<header>
				<TypographyH3 className="mb-10">Citas</TypographyH3>
				<NavigationMenu>
					<NavigationMenuList>
						{adminCourseViews.map((view) => (
							<NavigationMenuItem key={view.value}>
								<Button
									variant={
										selectedCourseView === view.value
											? "default"
											: "ghost"
									}
									onClick={() =>
										setSelectedCourseView(view.value)
									}
								>
									{view.label}
								</Button>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</header>

			{selectedCourseView === "list" && <AdminCoursesTable />}

			{selectedCourseView === "add-course" && <AdminCourseForm />}

			{selectedCourseView === "category-list" && (
				<AdminCourseCategoriesTable />
			)}

			{selectedCourseView === "add-category" && (
				<AdminCourseCategoryForm />
			)}
		</section>
	);
}
