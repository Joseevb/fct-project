import { CourseCategory } from "@/api";
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
} from "../dropdown-menu";
import { Button } from "../button";
import { MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
import AdminCourseCategoryForm from "./AdminCourseCategoryForm";

export default function AdminCoursesTable() {
	const { courseCategories, deleteCourseCategory, error } = useCourses();

	const [isOpen, setIsOpen] = useState(false);
	const [courseId, setCourseId] = useState<number | undefined>();

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setCourseId(undefined);
		}
	};

	const columns: ColumnDef<CourseCategory>[] = useMemo(() => {
		return [
			{
				id: "actions",
				cell: ({ row }) => {
					const course: CourseCategory = row.original;

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
										setIsOpen(true);
										setCourseId(course.id);
									}}
								>
									Actualizar
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										deleteCourseCategory(course.id)
									}
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
		];
	}, [deleteCourseCategory]);

	return (
		<div className="container mx-auto py-10">
			{error ? (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : (
				<DataTable columns={columns} data={courseCategories} />
			)}

			<Dialog open={isOpen} onOpenChange={handleOpenChange}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Actualiar Curso</DialogTitle>
					</DialogHeader>
					<AdminCourseCategoryForm
						courseId={courseId}
						courseData={courseCategories.find(
							(c) => c.id === courseId,
						)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
