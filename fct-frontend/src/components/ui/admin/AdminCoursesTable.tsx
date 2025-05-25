import { Course } from "@/api";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import useCourses from "@/hooks/useCourse";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../button";
import { MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import AdminCourseForm from "@/components/ui/admin/AdminCourseForm";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import AdminCourseImageForm from "./AdmiCourseImageForm";

export default function AdminCoursesTable() {
	const { courses, deleteCourse, error } = useCourses();
	const [isImgFormOpen, setIsImgFormOpen] = useState(false);
	const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
	const [courseId, setCourseId] = useState<number | undefined>();

	const handleUpdateOpenChange = (open: boolean) => {
		setIsUpdateFormOpen(open);
		if (!open) {
			setCourseId(undefined);
		}
	};

	const handleImageOpenChange = (open: boolean) => {
		setIsImgFormOpen(open);
		if (!open) {
			setCourseId(undefined);
		}
	};

	const columns: ColumnDef<Course>[] = useMemo(() => {
		return [
			{
				id: "actions",
				cell: ({ row }) => {
					const course: Course = row.original;

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
										setIsUpdateFormOpen(true);
										setCourseId(course.id);
									}}
								>
									Actualizar
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										setIsImgFormOpen(true);
										setCourseId(course.id);
									}}
								>
									Actualizar Imagenes
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => deleteCourse(course.id)}
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
				accessorKey: "startDate",
				header: "Fecha de inicio",
			},
			{
				accessorKey: "endDate",
				header: "Fecha de fin",
			},
			{
				accessorKey: "enrollmentPrice",
				header: "Precio de inscripción",
			},
			{
				accessorKey: "categoryId",
				header: "Categoría",
			},
			{
				accessorKey: "description",
				header: "Descripción",
			},
			{
				accessorKey: "imgNames",
				header: "Imágenes",
			},
		];
	}, [deleteCourse]);

	return (
		<div className="container mx-auto py-10">
			{error ? (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : (
				<DataTable columns={columns} data={courses} />
			)}

			<Dialog
				open={isUpdateFormOpen}
				onOpenChange={handleUpdateOpenChange}
			>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Actualiar Curso</DialogTitle>
					</DialogHeader>
					<AdminCourseForm
						courseId={courseId}
						courseData={courses.find((c) => c.id === courseId)}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={isImgFormOpen} onOpenChange={handleImageOpenChange}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Actualiar Imagenes</DialogTitle>
					</DialogHeader>
					{courseId && <AdminCourseImageForm courseId={courseId} />}
				</DialogContent>
			</Dialog>
		</div>
	);
}
