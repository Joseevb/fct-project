import useCourses, { CourseWithImage } from "@/hooks/useCourse";
import { useEffect, useState } from "react";
import Image from "@/components/ui/Image";
import { CheckCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface AdminCourseImageFormProps {
	courseId: number;
}

const schema = z.object({
	file: z
		.instanceof(File)
		.refine(
			(file) => ["image/jpeg", "image/png"].includes(file.type),
			"Only JPEG or PNG files are allowed",
		),
});

type AddImageSchema = z.infer<typeof schema>;

export default function AdminCourseImageForm({
	courseId,
}: Readonly<AdminCourseImageFormProps>) {
	const [course, setCourse] = useState<CourseWithImage | undefined>();
	const [isLoading, setIsLoading] = useState(false);

	const {
		courses,
		coursesWithImages,
		updateCourseImage,
		removeCourseImage,
		fetchCourses,
	} = useCourses();

	const form = useForm<AddImageSchema>({
		defaultValues: {
			file: undefined,
		},
		resolver: zodResolver(schema),
	});

	useEffect(() => {
		setCourse(coursesWithImages.find((c) => c.id === courseId));
	}, [courseId, coursesWithImages]);

	async function removeImage(idx: number) {
		const imgName = courses.find((c) => c.id === courseId)?.imgNames[idx];
		if (!imgName) return;
		await removeCourseImage(courseId, imgName);
		window.location.reload();
	}

	async function onSubmit(data: z.infer<typeof schema>) {
		setIsLoading(true);

		await updateCourseImage(courseId, data.file);

		setIsLoading(false);
		fetchCourses();
	}

	return (
		<Form {...form}>
			<form
				className="container mx-auto py-10"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				{course?.imgs.map((img, idx) => (
					<div className="relative w-fit" key={idx}>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0 absolute top-2 right-2"
							type="button"
							onClick={() => removeImage(idx)}
						>
							<X className="h-4 w-4" />
						</Button>
						<Image file={img} />
					</div>
				))}

				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem className="mt-10">
							<FormLabel>Seleccione una Imagen</FormLabel>
							<FormControl>
								<Input
									placeholder="Seleccione una imagen"
									type="file"
									onChange={(e) => {
										const files = e.target.files;
										field.onChange(
											files && files.length > 0
												? files[0]
												: null,
										);
									}}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLoading} className="mt-10">
					{isLoading ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<CheckCircle className="mr-2 h-4 w-4" />
					)}
					{isLoading ? "Actualizando..." : "Actualizar"}
				</Button>
			</form>
		</Form>
	);
}
