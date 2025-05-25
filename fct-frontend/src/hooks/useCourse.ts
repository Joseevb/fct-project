import {
	AddCourseCategoryRequest,
	AddCourseRequest,
	Course,
	CourseCategoriesApi,
	CourseCategory,
	CoursesApi,
	CourseUser,
	ErrorMessage,
	FilesApi,
	UpdateCourseCategoryRequest,
	UpdateCourseRequest,
	UserCourseEnrollmentStatusEnum,
} from "@/api";
import { tryCatch } from "@/lib/tryCatch";
import { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import useImageFromFile from "./useImageFromFile";
import { marked } from "marked";
import TurndownService from "turndown";
import { UseFormReturn } from "react-hook-form";
import { AddCourseSchema } from "@/schemas/admin/addCourseSchema";
import { applyValidationErrors } from "@/lib/errorHandlers";
import { ResponseError } from "@/types/errors";

export type CourseWithImage = Omit<Course, "imgNames"> & { imgs: Blob[] };

interface UseCoursesOptions {
	courses: Course[];
	coursesWithImages: CourseWithImage[];
	courseCategories: CourseCategory[];
	error: string | null;
	addCourse: (
		data: AddCourseRequest,
		form: UseFormReturn<AddCourseSchema>,
	) => Promise<"SUCCESS" | "FAILURE">;
	addCourseCategory: (data: AddCourseCategoryRequest) => Promise<void>;
	addUserToCourse: (courseId: number, userId: number) => Promise<void>;
	updateCourse: (
		id: number,
		data: UpdateCourseRequest,
	) => Promise<"SUCCESS" | "FAILURE">;
	updateCourseCategory: (
		id: number,
		data: UpdateCourseCategoryRequest,
	) => Promise<void>;
	updateUserCourseEnrollmentStatus: (
		courseId: number,
		userId: number,
		status: UserCourseEnrollmentStatusEnum,
	) => Promise<void>;
	updateCourseImage: (courseId: number, file: File) => Promise<void>;
	fetchCourses: () => void;
	fetchCourseCategories: () => void;
	fetchUserCourses: (userId: number) => Promise<Course[] | undefined>;
	deleteCourse: (id: number) => Promise<void>;
	deleteCourseCategory: (id: number) => Promise<void>;
	removeCourseImage: (courseId: number, name: string) => Promise<void>;
}

const filesApi = new FilesApi();
const coursesApi = new CoursesApi();
const courseCategoriesApi = new CourseCategoriesApi();

const turndownService = new TurndownService();

export default function useCourses(): UseCoursesOptions {
	const [error, setError] = useState<string | null>(null);
	const [courses, setCourses] = useState<Course[]>([]);
	const [coursesWithImages, setCoursesWithImages] = useState<
		CourseWithImage[]
	>([]);
	const [courseCategories, setCourseCategories] = useState<CourseCategory[]>(
		[],
	);

	const {
		convertToObjectWithImages: convertToCourseWithImages,
		convertToObjectsWithImages: convertToCoursesWithImages,
	} = useImageFromFile<Course, CourseWithImage>({
		filesApi,
		setError,
	});

	const fetchCourses = useCallback(async () => {
		const { data, error } = await tryCatch<
			AxiosResponse<Course[]>,
			AxiosError<ErrorMessage>
		>(coursesApi.getAllCourses());

		if (error) {
			setError(
				error.response?.data.message || "Error al cargar los cursos",
			);
			return;
		}

		const coursesWithImages: CourseWithImage[] =
			await convertToCoursesWithImages(data.data, "imgNames", "imgs");

		data.data.forEach(
			(c) => (c.description = turndownService.turndown(c.description)),
		);
		setCourses(data.data);
		setCoursesWithImages(coursesWithImages);
	}, [convertToCoursesWithImages]);

	const fetchCourseCategories = useCallback(async () => {
		const { data, error } = await tryCatch<
			AxiosResponse<CourseCategory[]>,
			AxiosError<ErrorMessage>
		>(courseCategoriesApi.getAllCourseCategories());

		if (error) {
			setError(
				error.response?.data.message ||
					"Error al cargar las categorías",
			);
			return;
		}

		setCourseCategories(data.data);
	}, []);

	async function addCourse(
		data: AddCourseRequest,
		form: UseFormReturn<AddCourseSchema>,
	) {
		data.description = await marked(data.description);
		const { data: course, error } = await tryCatch<
			AxiosResponse<Course>,
			AxiosError<ResponseError>
		>(coursesApi.addCourse(data));

		if (error) {
			const errRes = error.response?.data;

			if (errRes) {
				if ("messages" in errRes) {
					const validationErrors = Object.entries(
						errRes.messages,
					).map(([field, message]) => ({
						field,
						message,
					}));

					applyValidationErrors(validationErrors, form.setError);
				} else if ("message" in errRes) {
					setError(errRes.message);
				} else {
					setError("Ocurrió un error inesperado.");
				}
			}
			return "FAILURE";
		}

		const courseWithImages = await convertToCourseWithImages(
			course.data,
			"imgNames",
			"imgs",
		);

		setCourses((arr) => [...arr, course.data]);
		setCoursesWithImages((arr) => [...arr, courseWithImages]);
		return "SUCCESS";
	}

	async function addCourseCategory(data: AddCourseCategoryRequest) {
		const { data: category, error } = await tryCatch<
			AxiosResponse<CourseCategory>,
			AxiosError<ErrorMessage>
		>(courseCategoriesApi.createCourseCategory(data));

		if (error) {
			setError(
				error.response?.data.message || "Error al agregar la categoría",
			);
			return;
		}

		setCourseCategories((arr) => [...arr, category.data]);
	}

	async function updateCourse(id: number, data: UpdateCourseRequest) {
		if (data.description) {
			data.description = await marked(data.description);
		}
		const { data: course, error } = await tryCatch<
			AxiosResponse<Course>,
			AxiosError<ErrorMessage>
		>(coursesApi.updateCourse(id, data));

		if (error) {
			setError(
				error.response?.data.message || "Error al actualizar el curso",
			);
			return "FAILURE";
		}

		const courseWithImages = await convertToCourseWithImages(
			course.data,
			"imgNames",
			"imgs",
		);

		setCourses((arr) => [...arr, course.data]);
		setCoursesWithImages((arr) =>
			arr.map((c) => (c.id === id ? courseWithImages : c)),
		);
		return "SUCCESS";
	}

	async function updateCourseCategory(
		id: number,
		data: UpdateCourseCategoryRequest,
	) {
		const { data: category, error } = await tryCatch<
			AxiosResponse<CourseCategory>,
			AxiosError<ErrorMessage>
		>(courseCategoriesApi.updateCourseCategory(id, data));

		if (error) {
			setError(
				error.response?.data.message ||
					"Error al actualizar la categoría",
			);
			return;
		}

		setCourseCategories((arr) =>
			arr.map((c) => (c.id === id ? category.data : c)),
		);
	}

	async function deleteCourse(id: number) {
		const { error } = await tryCatch<
			AxiosResponse<void>,
			AxiosError<ErrorMessage>
		>(coursesApi.deleteCourse(id));

		if (error) {
			setError(
				error.response?.data.message || "Error al eliminar el curso",
			);
			return;
		}

		setCourses((arr) => arr.filter((c) => c.id !== id));
	}

	async function deleteCourseCategory(id: number) {
		const { error } = await tryCatch<
			AxiosResponse<void>,
			AxiosError<ErrorMessage>
		>(courseCategoriesApi.deleteCourseCategory(id));

		if (error) {
			setError(
				error.response?.data.message ||
					"Error al eliminar la categoría",
			);
			return;
		}

		setCourseCategories((arr) => arr.filter((c) => c.id !== id));
	}

	async function addUserToCourse(courseId: number, userId: number) {
		const { error } = await tryCatch<
			AxiosResponse<CourseUser>,
			AxiosError<ErrorMessage>
		>(coursesApi.addUserToCourse(courseId, userId));

		if (error) {
			setError(
				error.response?.data.message || "Error al agregar al curso",
			);
			return;
		}
	}

	async function updateUserCourseEnrollmentStatus(
		courseId: number,
		userId: number,
		status: UserCourseEnrollmentStatusEnum,
	) {
		const { error } = await tryCatch<
			AxiosResponse<CourseUser>,
			AxiosError<ErrorMessage>
		>(coursesApi.updateUserStatusOnCourse(courseId, userId, { status }));

		if (error) {
			setError(
				error.response?.data.message || "Error al actualizar el estado",
			);
			return;
		}
	}

	async function fetchUserCourses(userId: number) {
		const { data, error } = await tryCatch<
			AxiosResponse<Course[]>,
			AxiosError<ErrorMessage>
		>(coursesApi.getAllCourses(userId));

		if (error) {
			setError(
				error.response?.data.message ||
					"Error al cargar los cursos del usuario",
			);
			return;
		}

		return data.data;
	}

	async function updateCourseImage(courseId: number, file: File) {
		const { error } = await tryCatch<
			AxiosResponse<Course>,
			AxiosError<ErrorMessage>
		>(coursesApi.updateCourseImage(courseId, file));

		if (error) {
			setError(
				error.response?.data.message || "Error al actualizar la imagen",
			);
			return;
		}
	}

	async function removeCourseImage(courseId: number, name: string) {
		const { error } = await tryCatch<
			AxiosResponse<void>,
			AxiosError<ErrorMessage>
		>(coursesApi.removeCourseImage(courseId, name));

		if (error) {
			setError(
				error.response?.data.message || "Error al eliminar la imagen",
			);
			return;
		}
	}

	useEffect(() => {
		fetchCourses();
		fetchCourseCategories();
	}, [fetchCourses, fetchCourseCategories]);

	return {
		courses,
		coursesWithImages,
		courseCategories,
		error,
		addCourse,
		addCourseCategory,
		addUserToCourse,
		updateCourse,
		updateCourseCategory,
		updateUserCourseEnrollmentStatus,
		updateCourseImage,
		fetchCourses,
		fetchCourseCategories,
		fetchUserCourses,
		deleteCourse,
		deleteCourseCategory,
		removeCourseImage,
	};
}
