import AdminProductCategoryForm from "@/components/ui/admin/AdminProductCategoryForm";
import AdminProductCategoryTable from "@/components/ui/admin/AdminProductCategoryTable";
import AdminProductForm from "@/components/ui/admin/AdminProductForm";
import AdminProductTable from "@/components/ui/admin/AdminProductTable";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { TypographyH3 } from "@/components/ui/typography";
import { useState } from "react";

const adminProductViews = [
	{ value: "list", label: "Lista de Productos" },
	{ value: "add-product", label: "Agregar Producto" },
	{ value: "category-list", label: "Lista de Categorías" },
	{ value: "add-category", label: "Agregar Categoría" },
] as const;

type AdminProductView = (typeof adminProductViews)[number]["value"];

export default function ProductManagementPage() {
	const [selectedProductView, setSelectedProductView] =
		useState<AdminProductView>("list");

	return (
		<section className="flex flex-col gap-4">
			<header>
				<TypographyH3 className="mb-10">Productos</TypographyH3>
				<NavigationMenu>
					<NavigationMenuList>
						{adminProductViews.map((view) => (
							<NavigationMenuItem key={view.value}>
								<Button
									variant={
										selectedProductView === view.value
											? "default"
											: "ghost"
									}
									onClick={() =>
										setSelectedProductView(view.value)
									}
								>
									{view.label}
								</Button>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</header>

			{selectedProductView === "list" && <AdminProductTable />}

			{selectedProductView === "add-product" && <AdminProductForm />}

			{selectedProductView === "category-list" && (
				<AdminProductCategoryTable />
			)}

			{selectedProductView === "add-category" && (
				<AdminProductCategoryForm />
			)}
		</section>
	);
}
