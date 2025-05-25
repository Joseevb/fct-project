import { ErrorMessage, FilesApiInterface } from "@/api";
import { tryCatch } from "@/lib/tryCatch";
import { AxiosError, AxiosResponse } from "axios";
import { useCallback } from "react";

interface ImageFromFileHookProps {
	filesApi: FilesApiInterface;
	setError: (error: string) => void;
}

interface UseImageFromFileOptions<T, R = T> {
	getImageByName: (name: string) => Promise<File | undefined>;
	convertToObjectWithImages: <K extends keyof T>(
		object: T,
		imageNamesProperty: K,
		targetImagesProperty?: string,
	) => Promise<R>;
	convertToObjectsWithImages: <K extends keyof T>(
		objects: T[],
		imageNamesProperty: K,
		targetImagesProperty?: string,
	) => Promise<R[]>;
}

export default function useImageFromFile<T, R = T>({
	filesApi,
	setError,
}: ImageFromFileHookProps): UseImageFromFileOptions<T, R> {
	const getImageByName = useCallback(
		async (name: string): Promise<File | undefined> => {
			const { data: response, error } = await tryCatch<
				AxiosResponse<Blob>,
				AxiosError<ErrorMessage>
			>(filesApi.downloadFile(name, { responseType: "blob" }));

			if (error) {
				setError(
					error.response?.data?.message ||
						`Error loading image ${name}: ${error.message}`,
				);
				console.log(error);
				return undefined;
			}

			const imageBlob = response.data as unknown as Blob;

			if (imageBlob && imageBlob.size > 0) {
				console.log(error);
				return new File([imageBlob], name, {
					type: imageBlob.type,
				});
			} else {
				console.log(error);
				setError(`No data received for image: ${name}`);
				return undefined;
			}
		},
		[filesApi, setError],
	);

	const convertToObjectWithImages = useCallback(
		async <K extends keyof T>(
			object: T,
			imageNamesProperty: K,
			targetImagesProperty: string = "imgs",
		): Promise<R> => {
			// Check if the property exists and is an array
			if (
				!object[imageNamesProperty] ||
				!Array.isArray(object[imageNamesProperty])
			) {
				return object as unknown as R;
			}

			// Cast the property to string[]
			const imageNames = object[
				imageNamesProperty
			] as unknown as string[];

			// Fetch all image files in parallel
			const imageFiles = await Promise.all(
				imageNames.map((name) => getImageByName(name)),
			);

			// Filter out undefined results
			const validFiles = imageFiles.filter(
				(file): file is File => file !== undefined,
			);

			// Create a new object without the image names property using dynamic key
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [imageNamesProperty]: _, ...objectWithoutImages } = object;

			// Return the new object with the image blobs added under the target property
			return {
				...objectWithoutImages,
				[targetImagesProperty]: validFiles,
			} as unknown as R;
		},
		[getImageByName],
	);

	const convertToObjectsWithImages = useCallback(
		async <K extends keyof T>(
			objects: T[],
			imageNamesProperty: K,
			targetImagesProperty: string = "imgs",
		): Promise<R[]> => {
			if (!objects || objects.length === 0) {
				return [] as R[];
			}

			const objectWithImagesPromises = objects.map((object) =>
				convertToObjectWithImages(
					object,
					imageNamesProperty,
					targetImagesProperty,
				),
			);

			return Promise.all(objectWithImagesPromises);
		},
		[convertToObjectWithImages],
	);

	return {
		getImageByName,
		convertToObjectWithImages,
		convertToObjectsWithImages,
	};
}
