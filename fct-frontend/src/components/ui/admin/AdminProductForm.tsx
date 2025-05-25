import useProducts, { ProductWithImage } from "@/hooks/useProducts";
import { useMemo, useState } from "react";
import { DynamicFormField, FieldConfig } from "../DynamicFormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import {
	addProductSchema,
	AddProductSchema,
} from "@/schemas/admin/addProductSchema";
import { Card, CardContent } from "../card";
import { Form } from "../form";
import { Button } from "../button";
import { CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../alert";
import z from "zod";
import { ProductCategory } from "@/api";

const getFieldConfigs = (
	categories: ProductCategory[],
): Record<keyof AddProductSchema, FieldConfig> =>
	({
		name: {
			label: "Product Name",
			placeholder: "Enter product name",
			type: "text",
		},
		description: {
			label: "Description",
			placeholder: "Enter product description",
			type: "textarea",
		},
		price: { label: "Price", placeholder: "0.00", type: "number" },
		productCategoryId: {
			label: "Category",
			placeholder: "Select a category",
			type: "select",
			options: categories.map((cat) => ({
				value: String(cat.id),
				label: cat.name,
			})),
		},
		stock: { label: "Stock", placeholder: "0", type: "number" },
		image: { label: "Product Image", type: "file" }, // Configuration for the file input
	}) as const;

interface AdminProductFormProps {
	productId?: number;
	productData?: ProductWithImage;
}

export default function AdminProductForm({
	productId,
	productData,
}: Readonly<AdminProductFormProps>) {
	const [isLoading, setIsLoading] = useState(false);

	const { error, productCategories, createProduct, updateProduct } =
		useProducts();

	const fieldConfigs = useMemo(
		() => getFieldConfigs(productCategories),
		[productCategories],
	);

	const form = useForm<AddProductSchema>({
		defaultValues: {
			name: productData?.name || "",
			description: productData?.description || "",
			price: productData?.price || 0,
			productCategoryId: productData?.productCategory.id || 1,
			stock: productData?.stock || 1,
			image: (productData?.image as File) || undefined,
		},
		resolver: zodResolver(addProductSchema),
	});

	async function onSubmit(formData: z.infer<typeof addProductSchema>) {
		setIsLoading(true);

		if (productCategories) {
			const { image, ...restOfProductData } = formData;
			const dataForCreateProduct = {
				data: restOfProductData,
				image: image as File,
			};

			if (productId) {
				await updateProduct(productId, { ...dataForCreateProduct });
			} else {
				await createProduct(dataForCreateProduct);
			}
		}
		setIsLoading(false);
	}

	return (
		<Card>
			<CardContent>
				{error && (
					<Alert variant={"destructive"} className="mb-8">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<Form {...form}>
					<form
						action=""
						className="space-y-6"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						{Object.keys(fieldConfigs).map((fieldName) => (
							<DynamicFormField<AddProductSchema>
								key={fieldName}
								name={fieldName as FieldPath<AddProductSchema>}
								fieldConfigs={fieldConfigs}
								control={form.control}
							/>
						))}

						<div className="mt-8 w-full flex flex-row gap-4">
							<Button type="submit" variant={"default"}>
								{isLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<CheckCircle className="mr-2 h-4 w-4" />
								)}
								{isLoading ? "Agregando..." : "Agregar"}
							</Button>
							<Button type="reset" variant={"secondary"}>
								Vaciar
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
