import { Course } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import useCourses from "@/hooks/useCourse";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import { TypographyH2 } from "../ui/typography";

const columns: ColumnDef<Course>[] = [
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
] as const;

export default function UserCoursesPage() {
	const { fetchUserCourses } = useCourses();
	const [courses, setCourses] = useState<Course[]>([]);

	const { user } = useAuth();

	useEffect(() => {
		async function getCourses() {
			if (!user) return;
			const c = await fetchUserCourses(user.id);
			if (!c) return;
			setCourses(c);
		}

		getCourses();
	}, [fetchUserCourses, user]);

	return (
		<>
			<section className="flex items-center justify-center p-6 md:p-8 gap-4 w-full">
				<TypographyH2>Mis cursos</TypographyH2>
			</section>

			<section className="p-6 md:p-8 space-y-6">
				<DataTable columns={columns} data={courses} />
			</section>
		</>
	);
}
