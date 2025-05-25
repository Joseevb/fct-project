import useCourses from "@/hooks/useCourse";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useMemo, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { CalendarDays, EuroIcon, Tag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LineItemable, TemporaryLineItem } from "@/types/lineItem";
import { InvoiceType } from "@/components/pages/InvoicePage";
import { Course } from "@/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Image from "@/components/ui/Image";
import { TypographyH2, TypographyP } from "../ui/typography";
import { renderHTML } from "@/lib/htmlParserOptions";

interface CoursesPage {
	setInvoiceObjs: Dispatch<SetStateAction<LineItemable[]>>;
	setLineItemType: Dispatch<SetStateAction<InvoiceType | null>>;
	setTemporaryLineItems: Dispatch<SetStateAction<TemporaryLineItem[]>>;
}

export default function CoursesPage({
	setInvoiceObjs,
	setLineItemType,
	setTemporaryLineItems,
}: Readonly<CoursesPage>) {
	const {
		courses,
		coursesWithImages,
		courseCategories,
		addUserToCourse,
		error,
	} = useCourses();

	const navigate = useNavigate();

	const { user } = useAuth();

	// State for filters
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState<
		number | "all"
	>("all");

	// Memoized filtered courses
	const filteredCourses = useMemo(() => {
		return coursesWithImages.filter((course) => {
			// Filter by search term (case-insensitive)
			const matchesSearch = course.description
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

			// Filter by category
			const matchesCategory =
				selectedCategoryId === "all" ||
				course.categoryId === selectedCategoryId;

			return matchesSearch && matchesCategory;
		});
	}, [coursesWithImages, searchTerm, selectedCategoryId]);

	// Handle search input change
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	// Handle category select change
	const handleCategoryChange = (value: string) => {
		setSelectedCategoryId(value === "all" ? "all" : parseInt(value, 10));
	};

	function enrollCourse(course: Course | undefined) {
		if (!course || !user) return;
		setLineItemType("COURSE");

		const lineItem: TemporaryLineItem = {
			courseId: course.id,
			quantity: 1,
			subtotal: course.enrollmentPrice,
		};

		setInvoiceObjs((arr) => [...arr, course]);
		setTemporaryLineItems((arr) => [...arr, lineItem]);

		addUserToCourse(course.id, user.id);

		navigate("/invoice");
	}

	return (
		<div className="container mx-auto py-8">
			<TypographyH2 className="mb-10 mx-5">Cursos</TypographyH2>

			{/* Filter Section */}
			<div className="flex space-x-4 mb-6 mx-5">
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
						{courseCategories.map((category) => (
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

			{error && (
				<TypographyP className="text-red-500 mb-4">{error}</TypographyP>
			)}

			{/* Course List */}
			<div className="flex flex-col gap-4">
				{filteredCourses.map((course, index) => (
					<div className="mx-5" key={course.id}>
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
							<Card className="h-full flex flex-col md:flex-row overflow-hidden">
								{/* Image Container */}
								<div className="relative rounded w-full h-48 md:h-auto md:w-1/3 flex-shrink-0 overflow-hidden">
									<Image
										file={
											course.imgs &&
											course.imgs.length > 0
												? course.imgs[0]
												: null
										}
									/>
								</div>
								{/* Content Container */}
								<CardContent className="flex flex-col p-4 flex-grow">
									<div>{renderHTML(course.description)}</div>
									<TypographyP className="text-sm text-gray-500 flex items-center mb-4">
										<Tag className="mr-1 h-4 w-4" />{" "}
										Categoría:{" "}
										{courseCategories.find(
											(c) => c.id === course.categoryId,
										)?.name || "Sin categoría"}
									</TypographyP>
									<div className="flex flex-col gap-2 mb-4">
										<span className="flex items-center">
											<CalendarDays className="mr-1 h-4 w-4" />
											<strong>Fecha inicio: </strong>{" "}
											{course.startDate}
										</span>
										<span className="flex items-center">
											<CalendarDays className="mr-1 h-4 w-4" />
											<strong>Fecha fin: </strong>{" "}
											{course.endDate}
										</span>
										<span className="flex items-center">
											<EuroIcon className="mr-1 h-4 w-4" />
											<strong>Precio: </strong>
											{course.enrollmentPrice}€
										</span>
									</div>
									<div className="mt-auto">
										<Button
											className={cn(
												buttonVariants({
													variant: "default",
												}),
											)}
											onClick={() =>
												enrollCourse(
													courses.find(
														(c) =>
															c.id === course.id,
													),
												)
											}
										>
											Inscribirse
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
						<Separator className="my-8" />
					</div>
				))}
			</div>
		</div>
	);
}
