import useProducts, { ProductWithImage } from "@/hooks/useProducts";
import { ColumnDef } from "@tanstack/react-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useMemo, useState } from "react";
import { FilesApi, Product } from "@/api";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import useImageFromFile from "@/hooks/useImageFromFile";
import Image from "@/components/ui/Image";
import { tryCatch } from "@/lib/tryCatch";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminProductForm from "@/components/ui/admin/AdminProductForm";

const filesApi = new FilesApi();

export default function AdminProductTable() {
	const [isImageLoading, setIsImageLoading] = useState(false);

	const [image, setImage] = useState<File | undefined>(undefined);
	const [error, setError] = useState<string | null>(null);

	const [isViewImageDialogOpen, setIsViewImageDialogOpen] = useState(false);
	const [productToViewImage, setProductToViewImage] = useState<
		Product | undefined
	>(undefined);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [productIdToDelete, setProductIdToDelete] = useState<
		number | undefined
	>(undefined);

	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
	const [productToUpdate, setProductToUpdate] = useState<
		ProductWithImage | undefined
	>(undefined);

	const {
		products,
		productsWithImages,
		error: productError,
		deleteProduct,
	} = useProducts();

	const { getImageByName } = useImageFromFile({ filesApi, setError });

	function handleViewImageDialogOpenChange(open: boolean) {
		setIsViewImageDialogOpen(open);

		if (!open) {
			setImage(undefined);
			setProductToViewImage(undefined);
			setError(null);
		}
	}

	function handleUpdateProductDialogOpenChange(open: boolean) {
		setIsUpdateDialogOpen(open);

		if (!open) {
			setProductToUpdate(undefined);
		}
	}

	function handleDeleteProductDialogOpenChange(open: boolean) {
		setIsDeleteDialogOpen(open);

		if (!open) {
			setProductIdToDelete(undefined);
		}
	}

	useEffect(() => {
		async function updateImage() {
			setIsImageLoading(true);
			if (productToViewImage?.imageName) {
				const { data: fetchedImage, error: fetchError } =
					await tryCatch(
						getImageByName(productToViewImage.imageName),
					);

				if (fetchError) {
					setError(fetchError.message);
					return;
				}

				setImage(fetchedImage);
			}
			setIsImageLoading(false);
		}

		updateImage();
	}, [getImageByName, productToViewImage]);

	const columns: ColumnDef<Product>[] = useMemo(() => {
		return [
			{
				id: "actions",
				cell: ({ row }) => {
					const product: Product = row.original;

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
										setProductToUpdate(
											productsWithImages.find(
												(p) => p.id === product.id,
											),
										);
										setIsUpdateDialogOpen(true);
									}}
								>
									Actualizar
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										setProductToViewImage(product);
										setIsViewImageDialogOpen(true);
									}}
								>
									Ver imagen
								</DropdownMenuItem>
								<DropdownMenuItem
									variant="destructive"
									onClick={() => {
										setProductIdToDelete(product.id);
										setIsDeleteDialogOpen(true);
									}}
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
				accessorKey: "description",
				header: "Descripción",
			},
			{
				accessorKey: "price",
				header: "Precio",
			},
			{
				id: "category",
				header: "Categoría",
				cell: ({ row }) => {
					const product: Product = row.original;
					return product.productCategory.name;
				},
			},
			{
				accessorKey: "imageName",
				header: "Imagen",
			},
		] as const;
	}, [productsWithImages]);

	return (
		<div className="container mx-auto py-10">
			{error || productError ? (
				<Alert variant="destructive">
					{error && <AlertDescription>{error}</AlertDescription>}
					{productError && (
						<AlertDescription>{productError}</AlertDescription>
					)}
				</Alert>
			) : (
				<DataTable columns={columns} data={products} />
			)}

			<Dialog
				open={isViewImageDialogOpen}
				onOpenChange={handleViewImageDialogOpenChange}
			>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>
							Ver imagen{" "}
							{productToViewImage?.name
								? `(${productToViewImage.name})`
								: ""}
						</DialogTitle>
					</DialogHeader>
					<div>
						{isImageLoading ? (
							<div>
								<span>
									Cargando imagen...
									<Loader2 className="mr-2 h-10 w-10 animate-spin" />
								</span>
							</div>
						) : image ? (
							<Image file={image} />
						) : (
							<div className="flex items-center justify-center h-[400px] bg-gray-200">
								No se pudo cargar la imagen.
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isUpdateDialogOpen}
				onOpenChange={handleUpdateProductDialogOpenChange}
			>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Actualizar producto</DialogTitle>
					</DialogHeader>
					<AdminProductForm
						productData={productToUpdate}
						productId={productToUpdate?.id}
					/>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={handleDeleteProductDialogOpenChange}
			>
				<AlertDialogContent className="sm:max-w-[600px]">
					<AlertDialogHeader>
						<AlertDialogTitle>
							¿Estás seguro de que quieres borrar el producto{" "}
							{productToViewImage?.name
								? `(${productToViewImage.name})`
								: ""}
							?
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						{productIdToDelete && (
							<AlertDialogAction
								onClick={() => deleteProduct(productIdToDelete)}
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
