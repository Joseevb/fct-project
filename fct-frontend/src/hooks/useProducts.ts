import {
	AddProductCategoryRequest,
	AddProductRequest,
	ErrorMessage,
	FilesApi,
	Product,
	ProductCategoriesApi,
	ProductCategory,
	ProductsApi,
	UpdateProductCategoryRequest,
	UpdateProductRequest,
} from "@/api";
import { tryCatch } from "@/lib/tryCatch";
import { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import useImageFromFile from "./useImageFromFile";

export type ProductWithImage = Omit<Product, "imageName"> & { image: Blob };

interface UseProductsOptions {
	error: string | null;
	products: Product[];
	productsWithImages: ProductWithImage[];
	productCategories: ProductCategory[];
	fetchProducts: () => void;
	fetchProduct: (
		id: number,
	) => Promise<
		{ product: Product; productWithImage: ProductWithImage } | undefined
	>;
	createProduct: (data: {
		data: AddProductRequest;
		image: File;
	}) => Promise<void>;
	updateProduct: (
		id: number,
		data: {
			data: UpdateProductRequest;
			image: File;
		},
	) => Promise<void>;
	deleteProduct: (id: number) => Promise<void>;
	fetchProductCategories: () => void;
	deleteProductCategory: (id: number) => Promise<void>;
	createProductCategory: (data: AddProductCategoryRequest) => Promise<void>;
	updateProductCategory: (
		id: number,
		data: UpdateProductCategoryRequest,
	) => Promise<void>;
}

const api = new ProductsApi();
const categoryApi = new ProductCategoriesApi();
const filesApi = new FilesApi();

export default function useProducts(): UseProductsOptions {
	const [error, setError] = useState<string | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [productsWithImages, setProductsWithImages] = useState<
		ProductWithImage[]
	>([]);
	const [productCategories, setProductCategories] = useState<
		ProductCategory[]
	>([]);

	const {
		convertToObjectWithImages: convertToProductWithImage,
		convertToObjectsWithImages: convertToProductsWithImage,
	} = useImageFromFile<Product, ProductWithImage>({ filesApi, setError });

	const fetchProducts = useCallback(async () => {
		setError(null);
		const { data, error } = await tryCatch<
			AxiosResponse<Product[]>,
			AxiosError<ErrorMessage>
		>(api.getAllProducts());
		if (error) {
			setError(error.message);
			return;
		}

		const productsWithImages = await convertToProductsWithImage(
			data.data,
			"imageName",
			"image",
		);

		setProducts(data.data);
		setProductsWithImages(productsWithImages);
	}, [convertToProductsWithImage]);

	const fetchProduct = useCallback(
		async (
			id: number,
		): Promise<
			{ product: Product; productWithImage: ProductWithImage } | undefined
		> => {
			setError(null);
			const { data: response, error } = await tryCatch<
				AxiosResponse<Product>,
				AxiosError<ErrorMessage>
			>(api.getProductById(id));

			if (error) {
				setError(error.response?.data?.message || error.message);
				return;
			}

			const product = response.data;
			const { data: productWithImage, error: convertionError } =
				await tryCatch(
					convertToProductWithImage(product, "imageName", "image"),
				);

			if (convertionError) {
				setError(`Error converting image: ${convertionError.message}`);
				return;
			}

			return { product, productWithImage };
		},
		[convertToProductWithImage],
	);

	async function createProduct(data: {
		data: AddProductRequest;
		image: File;
	}) {
		setError(null);
		const { data: createdProduct, error: creationError } = await tryCatch<
			AxiosResponse<Product>,
			AxiosError<ErrorMessage>
		>(api.createProduct(data.data));

		if (creationError) {
			setError(`Error creating product: ${creationError.message}`);
			return;
		}

		const { data: updateImage, error: updateError } = await tryCatch<
			AxiosResponse<Product>,
			AxiosError<ErrorMessage>
		>(api.updateProductImage(createdProduct.data.id, data.image));

		if (updateError) {
			setError(`Error adding product image: ${updateError.message}`);
			return;
		}

		const { data: productWithImage, error: convertionError } =
			await tryCatch(
				convertToProductWithImage(
					updateImage.data,
					"imageName",
					"image",
				),
			);

		if (convertionError) {
			setError(`Error converting image: ${convertionError.message}`);
			return;
		}

		setProducts((arr) => [...arr, updateImage.data]);
		setProductsWithImages((arr) => [...arr, productWithImage]);
	}

	async function updateProduct(
		id: number,
		data: {
			data: UpdateProductRequest;
			image: File;
		},
	) {
		setError(null);
		const { data: updatedProduct, error: updateError } = await tryCatch<
			AxiosResponse<Product>,
			AxiosError<ErrorMessage>
		>(api.updateProduct(id, data.data));

		if (updateError) {
			setError(`Error updating product: ${updateError.message}`);
			return;
		}

		const { data: updateImage, error: updateImageError } = await tryCatch<
			AxiosResponse<Product>,
			AxiosError<ErrorMessage>
		>(api.updateProductImage(updatedProduct.data.id, data.image));

		if (updateImageError) {
			setError(
				`Error updating product image: ${updateImageError.message}`,
			);
			return;
		}

		const { data: productWithImage, error: convertionError } =
			await tryCatch(
				convertToProductWithImage(
					updateImage.data,
					"imageName",
					"image",
				),
			);

		if (convertionError) {
			setError(`Error converting image: ${convertionError.message}`);
			return;
		}

		setProducts((arr) =>
			arr.map((p) => (p.id === id ? updatedProduct.data : p)),
		);
		setProductsWithImages((arr) =>
			arr.map((p) => (p.id === id ? productWithImage : p)),
		);
	}

	async function deleteProduct(id: number) {
		const { error } = await tryCatch<
			AxiosResponse<void>,
			AxiosError<ErrorMessage>
		>(api.deleteProduct(id));
		setError(null);

		if (error) {
			setError(`Error deleting product: ${error.message}`);
			return;
		}

		setProducts((arr) => arr.filter((p) => p.id !== id));
		setProductsWithImages((arr) => arr.filter((p) => p.id !== id));
	}

	const fetchProductCategories = useCallback(async () => {
		const { data, error } = await tryCatch<
			AxiosResponse<ProductCategory[]>,
			AxiosError<ErrorMessage>
		>(categoryApi.getAllProductCategories());
		setError(null);

		if (error) {
			setError(error.response?.data?.message || error.message);
			return;
		}

		setProductCategories(data.data);
	}, []);

	async function deleteProductCategory(id: number) {
		const { error } = await tryCatch<
			AxiosResponse<void>,
			AxiosError<ErrorMessage>
		>(categoryApi.deleteProductCategory(id));
		setError(null);

		if (error) {
			setError(`Error deleting product category: ${error.message}`);
			return;
		}

		setProductCategories((arr) => arr.filter((p) => p.id !== id));
	}

	async function createProductCategory(data: AddProductCategoryRequest) {
		const { data: createdCategory, error: creationError } = await tryCatch<
			AxiosResponse<ProductCategory>,
			AxiosError<ErrorMessage>
		>(categoryApi.createProductCategory(data));
		setError(null);

		if (creationError) {
			setError(
				`Error creating product category: ${creationError.response?.data.message || creationError.message}`,
			);
			return;
		}

		setProductCategories((arr) => [...arr, createdCategory.data]);
	}

	async function updateProductCategory(
		id: number,
		data: UpdateProductCategoryRequest,
	) {
		const { data: updatedCategory, error: updateError } = await tryCatch<
			AxiosResponse<ProductCategory>,
			AxiosError<ErrorMessage>
		>(categoryApi.updateProductCategory(id, data));
		setError(null);

		if (updateError) {
			setError(`Error updating product category: ${updateError.message}`);
			return;
		}

		setProductCategories((arr) =>
			arr.map((p) => (p.id === id ? updatedCategory.data : p)),
		);
	}

	useEffect(() => {
		fetchProducts();
		fetchProductCategories();
	}, [fetchProducts, fetchProductCategories]);

	return {
		error,
		products,
		productsWithImages,
		productCategories,
		fetchProducts,
		fetchProduct,
		createProduct,
		updateProduct,
		deleteProduct,
		fetchProductCategories,
		deleteProductCategory,
		createProductCategory,
		updateProductCategory,
	};
}
