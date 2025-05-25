import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import { Form } from "../form";
import { DynamicFormField, FieldConfig } from "../DynamicFormField";
import { Card, CardContent } from "../card";
import { Button } from "../button";
import {
	addCourseCategorySchema,
	AddCourseCategorySchema,
} from "@/schemas/admin/addCourseCategorySchema";
import useCourses from "@/hooks/useCourse";
import { z } from "zod";
import { Alert, AlertDescription } from "../alert";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CourseCategory } from "@/api";

const fieldConfigs: Record<string, FieldConfig> = {
	name: {
		label: "Nombre",
		placeholder: "Nombre",
		type: "text",
	},
};

interface AdminCourseFormProps {
	courseId?: number;
	courseData?: CourseCategory;
}

export default function AdminCourseCategoryForm({
	courseId,
	courseData,
}: Readonly<AdminCourseFormProps>) {
	const [isLoading, setIsLoading] = useState(false);

	const { addCourseCategory, updateCourseCategory, error } = useCourses();

	const form = useForm<AddCourseCategorySchema>({
		defaultValues: {
			name: courseData?.name || "",
		},
		resolver: zodResolver(addCourseCategorySchema),
	});

	async function onSubmit(data: z.infer<typeof addCourseCategorySchema>) {
		setIsLoading(true);
		if (courseId) {
			await updateCourseCategory(courseId, data);
		} else {
			await addCourseCategory(data);
		}
		setIsLoading(false);

		if (!error)
			toast.success("Categoría agregada exitosamente", {
				richColors: true,
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">
							{JSON.stringify(data, null, 2)}
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
							<DynamicFormField<AddCourseCategorySchema>
								key={fieldName}
								name={
									fieldName as FieldPath<AddCourseCategorySchema>
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
