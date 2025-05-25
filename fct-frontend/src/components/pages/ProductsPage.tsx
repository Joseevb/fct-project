import useProducts from "@/hooks/useProducts";
import { Card, CardContent } from "../ui/card";
import Image from "../ui/Image";
import { Tag } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Input } from "../ui/input";
import { useEffect, useMemo, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Cart, CartsApi, ErrorMessage, FilesApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { tryCatch } from "@/lib/tryCatch";
import { toast } from "sonner";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { TypographyH2, TypographyP } from "../ui/typography";
import useImageFromFile from "@/hooks/useImageFromFile";

const cartsApi = new CartsApi();

const filesApi = new FilesApi();

export default function ProductsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState<
		number | "all"
	>("all");
	const [images, setImages] = useState<
		{ id: number; image: File | undefined }[]
	>([]);
	const [error, setError] = useState<string | null>(null);

	const { products, productCategories } = useProducts();

	const { getImageByName } = useImageFromFile({ filesApi, setError });

	const { user } = useAuth();
	const navigate = useNavigate();

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			// Filter by search term (case-insensitive)
			const matchesSearch = product.description
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

			// Filter by category
			const matchesCategory =
				selectedCategoryId === "all" ||
				product.productCategory.id === selectedCategoryId;

			return matchesSearch && matchesCategory;
		});
	}, [products, searchTerm, selectedCategoryId]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	// Handle category select change
	const handleCategoryChange = (value: string) => {
		setSelectedCategoryId(value === "all" ? "all" : parseInt(value, 10));
	};

	async function handleAddToCart(productId: number) {
		if (!user) {
			navigate("/login");
			return;
		}

		const { error } = await tryCatch<
			AxiosResponse<Cart>,
			AxiosError<ErrorMessage>
		>(cartsApi.addCart(user.id, productId));

		if (error) {
			toast.error(`Error al añadir al carrito: ${error.message}`, {
				richColors: true,
			});
			return;
		}

		toast.success("Producto añadido al carrito", { richColors: true });
	}

	useEffect(() => {
		async function fetchImages() {
			try {
				const imageResults = await Promise.all(
					products.map(async (product) => {
						console.log(product.imageName);
						const image = await getImageByName(product.imageName);
						return { id: product.id, image };
					}),
				);
				console.log(imageResults);

				if (imageResults.length !== products.length) {
					console.error("Error fetching images");
					return;
				}

				setImages(imageResults);
			} catch (error) {
				setError(
					(error as AxiosError<ErrorMessage>).response?.data
						.message || "Error al obtener las imágenes",
				);
				console.error("Error fetching images:", error);
			}
		}

		if (products.length > 0) {
			fetchImages();
		}
	}, [getImageByName, products]);

	return (
		<div className="my-15 mx-20">
			{error && (
				<TypographyP className="text-red-500 mb-4">{error}</TypographyP>
			)}
			<TypographyH2 className="mb-10">Productos disponibles</TypographyH2>

			{/* Filter Section */}
			<div className="flex space-x-4 mb-6">
				<Input
					placeholder="Buscar cursos..."
					value={searchTerm}
					onChange={handleSearchChange}
					className="max-w-sm"
				/>
				<Select
					onValueChange={handleCategoryChange}
					value={selectedCategoryId.toString()}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Seleccionar categoría" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">
							Todas las categorías
						</SelectItem>
						{productCategories.map((category) => (
							<SelectItem
								key={category.id}
								value={category.id.toString()}
							>
								{category.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-15 auto-rows-fr w-3/4 mx-auto">
				{filteredProducts.map((product, index) => (
					<div key={product.id} className="flex">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.3,
								delay: index * 0.05,
								scale: {
									duration: 0.3,
									ease: "easeInOut",
								},
								boxShadow: {
									duration: 0.2,
									ease: "easeInOut",
								},
							}}
							whileHover={{
								scale: 1.02,
								boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
							}}
							className="w-full rounded"
						>
							<Card className="flex flex-col h-full overflow-hidden shadow-md dark:shadow-accent/10 hover:shadow-lg border-primary/10 hover:border-primary/30 transition-all duration-300">
								{/* Image Container */}
								<div className="relative w-full h-58 md:h-80 overflow-hidden">
									<Image
										file={
											images.find(
												({ id }) => product.id === id,
											)?.image
										}
										className="rounded object-fill"
									/>
								</div>

								{/* Content Container */}
								<CardContent className="flex flex-col flex-grow p-4">
									<h3 className="text-xl font-semibold mb-2">
										{product.name}
									</h3>
									<p className="text-sm text-gray-500 flex items-center mb-4">
										<Tag className="mr-1 h-4 w-4" />{" "}
										Categoría:{" "}
										{product.productCategory.name}
									</p>
									<div className="flex flex-col gap-2 mb-4">
										<p className="text-sm text-gray-500">
											Descripción: {product.description}
										</p>
									</div>
									<div className="mt-auto">
										<Button
											className={cn(
												buttonVariants({
													variant: "default",
												}),
											)}
											onClick={() =>
												handleAddToCart(product.id)
											}
										>
											Añadir al Carrito
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				))}
			</div>
		</div>
	);
}
