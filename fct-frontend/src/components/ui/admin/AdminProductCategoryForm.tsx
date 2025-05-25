import { ProductCategory } from "@/api";
import {
	addProductCategorySchema,
	AddProductCategorySchema,
} from "@/schemas/admin/addProductCategorySchema";
import {
	DynamicFormField,
	FieldConfig,
} from "@/components/ui/DynamicFormField";
import { useState } from "react";
import { FieldPath, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useProducts from "@/hooks/useProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const fieldConfigs: Record<keyof AddProductCategorySchema, FieldConfig> = {
	name: {
		label: "Nombre",
		placeholder: "Nombre",
		type: "text",
	},
	vatPercentage: {
		label: "IVA",
		placeholder: "IVA",
		type: "number",
	},
} as const;

interface AdminProductCategoryFormProps {
	categoryId?: number;
	categoryData?: ProductCategory;
}

export default function AdminProductCategoryForm({
	categoryId,
	categoryData,
}: Readonly<AdminProductCategoryFormProps>) {
	const [isLoading, setIsLoading] = useState(false);

	const { error, createProductCategory, updateProductCategory } =
		useProducts();

	const form = useForm<AddProductCategorySchema>({
		defaultValues: {
			name: categoryData?.name || "",
			vatPercentage: categoryData?.vatPercentage || 0,
		},
		resolver: zodResolver(addProductCategorySchema),
	});

	async function onSubmit(formData: AddProductCategorySchema) {
		setIsLoading(true);

		if (categoryId) {
			await updateProductCategory(categoryId, formData);
		} else {
			await createProductCategory(formData);
		}
		setIsLoading(false);

		if (!error)
			toast.success("Categoria creada exitosamente", {
				richColors: true,
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">
							{JSON.stringify(formData, null, 2)}
						</code>
					</pre>
				),
			});
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
							<DynamicFormField<AddProductCategorySchema>
								key={fieldName}
								name={
									fieldName as FieldPath<AddProductCategorySchema>
								}
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
