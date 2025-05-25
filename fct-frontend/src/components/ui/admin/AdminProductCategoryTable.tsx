import { ProductCategory } from "@/api";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";
import { MoreHorizontal } from "lucide-react";
import useProducts from "@/hooks/useProducts";
import { DataTable } from "../data-table";
import { Alert, AlertDescription } from "../alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../alert-dialog";
import AdminProductCategoryForm from "./AdminProductCategoryForm";

export default function AdminProductCategoryTable() {
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
	const [categoryToUpdate, setCategoryToUpdate] = useState<
		ProductCategory | undefined
	>(undefined);

	function handleUpdateCategoryDialogOpenChange(open: boolean) {
		setIsUpdateDialogOpen(open);

		if (!open) {
			setCategoryToUpdate(undefined);
		}
	}

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [categoryIdToDelete, setCategoryIdToDelete] = useState<
		number | undefined
	>(undefined);

	function handleDeleteCategoryDialogOpenChange(open: boolean) {
		setIsDeleteDialogOpen(open);

		if (!open) {
			setCategoryIdToDelete(undefined);
		}
	}

	const { error, productCategories, deleteProductCategory } = useProducts();

	const columns: ColumnDef<ProductCategory>[] = useMemo(() => {
		return [
			{
				id: "actions",
				cell: ({ row }) => {
					const category: ProductCategory = row.original;

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
									onClick={() => {
										setIsUpdateDialogOpen(true);
										setCategoryToUpdate(category);
									}}
								>
									Actualizar
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										setIsDeleteDialogOpen(true);
										setCategoryIdToDelete(category.id);
									}}
									variant="destructive"
								>
									Borrar
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
			{
				accessorKey: "id",
				header: "ID",
			},
			{
				accessorKey: "name",
				header: "Nombre",
			},
			{
				accessorKey: "vatPercentage",
				header: "IVA",
			},
		] as const;
	}, []);

	return (
		<div className="container mx-auto py-10">
			{error ? (
				<Alert variant="destructive">
					{error && <AlertDescription>{error}</AlertDescription>}
				</Alert>
			) : (
				<DataTable columns={columns} data={productCategories} />
			)}

			<Dialog
				open={isUpdateDialogOpen}
				onOpenChange={handleUpdateCategoryDialogOpenChange}
			>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Actualizar producto</DialogTitle>
					</DialogHeader>
					<AdminProductCategoryForm
						categoryData={categoryToUpdate}
						categoryId={categoryToUpdate?.id}
					/>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={handleDeleteCategoryDialogOpenChange}
			>
				<AlertDialogContent className="sm:max-w-[600px]">
					<AlertDialogHeader>
						<AlertDialogTitle>
							¿Estás seguro de que quieres borrar la categoria?
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						{categoryIdToDelete && (
							<AlertDialogAction
								onClick={() =>
									deleteProductCategory(categoryIdToDelete)
								}
							>
								Borrar
							</AlertDialogAction>
						)}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
