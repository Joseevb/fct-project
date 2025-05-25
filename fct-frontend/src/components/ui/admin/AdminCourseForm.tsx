import {
	addCourseSchema,
	AddCourseSchema,
} from "@/schemas/admin/addCourseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import { Form } from "../form";
import { DynamicFormField, FieldConfig } from "../DynamicFormField";
import useCourses from "@/hooks/useCourse";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../card";
import { Button } from "../button";
import { Alert, AlertDescription } from "../alert";
import { z } from "zod";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Course } from "@/api";

interface AdminCourseFormProps {
	courseId?: number;
	courseData?: Course;
}

export default function AdminCourseForm({
	courseId,
	courseData,
}: Readonly<AdminCourseFormProps>) {
	const [isLoading, setIsLoading] = useState(false);

	const {
		courseCategories,
		error,
		fetchCourseCategories,
		addCourse,
		updateCourse,
	} = useCourses();

	const fieldConfigs: Record<string, FieldConfig> = useMemo(() => {
		return {
			startDate: {
				label: "Fecha de inicio",
				placeholder: "Fecha de inicio",
				type: "date",
			},
			endDate: {
				label: "Fecha de fin",
				placeholder: "Fecha de fin",
				type: "date",
			},
			enrollmentPrice: {
				label: "Precio de inscripción",
				placeholder: "Precio de inscripción",
				type: "number",
			},
			categoryId: {
				label: "Categoría",
				placeholder: "Seleccione una categoría",
				type: "select",
				// Compute options based on courseCategories
				options: courseCategories.map((category) => ({
					value: category.id.toString(),
					label: category.name,
				})),
			},
			description: {
				label: "Descripción",
				placeholder: "Descripción",
				type: "textarea",
			},
		} as const;
	}, [courseCategories]);

	const form = useForm<AddCourseSchema>({
		defaultValues: {
			startDate: courseData?.startDate || "",
			endDate: courseData?.endDate || "",
			enrollmentPrice: courseData?.enrollmentPrice || 0,
			categoryId: courseData?.categoryId || 1,
			description: courseData?.description || "",
		},
		resolver: zodResolver(addCourseSchema),
	});

	useEffect(() => {
		fetchCourseCategories();
	}, [fetchCourseCategories]);

	async function onSubmit(data: z.infer<typeof addCourseSchema>) {
		let res;
		setIsLoading(true);
		if (courseId) {
			res = await updateCourse(courseId, data);
		} else {
			res = await addCourse(data, form);
		}
		setIsLoading(false);

		if (res == "SUCCESS")
			toast.success("Curso agregado exitosamente", {
				richColors: true,
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">
							{JSON.stringify(data, null, 2)}
						</code>
					</pre>
				),
			});
		else
			toast.error("Error al agregar el curso", {
				richColors: true,
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
							<DynamicFormField<AddCourseSchema>
								key={fieldName}
								name={fieldName as FieldPath<AddCourseSchema>}
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
