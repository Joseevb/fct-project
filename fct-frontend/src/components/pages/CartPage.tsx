import { Cart, CartsApi, ErrorMessage } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import useProducts, { ProductWithImage } from "@/hooks/useProducts";
import { tryCatch } from "@/lib/tryCatch";
import { AxiosError, AxiosResponse } from "axios";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";
import Image from "@/components/ui/Image";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineItemable, TemporaryLineItem } from "@/types/lineItem";
import { InvoiceType } from "./InvoicePage";
import { useNavigate } from "react-router-dom";

interface CartProductCombination {
	cart: Cart;
	product: ProductWithImage;
}

const api = new CartsApi();

interface CartPageProps {
	setInvoiceObjs: Dispatch<SetStateAction<LineItemable[]>>;
	setLineItemType: Dispatch<SetStateAction<InvoiceType | null>>;
	setTemporaryLineItems: Dispatch<SetStateAction<TemporaryLineItem[]>>;
}

export default function CartPage({
	setInvoiceObjs,
	setLineItemType,
	setTemporaryLineItems,
}: Readonly<CartPageProps>) {
	const [error, setError] = useState<string | null>(null);
	const [products, setProducts] = useState<CartProductCombination[]>([]);
	const [taxTotal, setTaxTotal] = useState<number>(0);
	const [subtotal, setSubtotal] = useState<number>(0);
	const [priceBeforeTax, setPriceBeforeTax] = useState<number>(0);
	const [isCartLoading, setIsCartLoading] = useState(false);
	const [isUpdatingAmount, setIsUpdatingAmount] = useState<number[]>([]);

	const { user } = useAuth();

	const { products: dbProducts, productsWithImages } = useProducts();

	const navigate = useNavigate();

	/** Fetches the cart info and calcualtes the subtotal */
	const fetchCartInfo = useCallback(async () => {
		if (!user || !productsWithImages || productsWithImages.length === 0) {
			setProducts([]);
			setSubtotal(0);
			setTaxTotal(0);
			setError(null);
			setIsCartLoading(false); // Ensure loading is false
			return;
		}
		setIsCartLoading(true); // Start loading

		const { data: cartsResponse, error: cartsError } = await tryCatch<
			AxiosResponse<Cart[]>,
			AxiosError<ErrorMessage>
		>(api.getAllCarts(user?.id));

		if (cartsError) {
			setProducts([]);
			setSubtotal(0);
			setTaxTotal(0);
			setError(null);
			setIsCartLoading(false); // Ensure loading is false
			setError(
				`Error obteniendo informacion del carrito: ${cartsError.response?.data?.message || cartsError.message}`,
			);
			return;
		}
		const carts = cartsResponse.data;

		const productMap: Map<number, ProductWithImage> = new Map(
			productsWithImages.map((product): [number, ProductWithImage] => [
				product.id,
				product,
			]),
		);

		const {
			combinedItems,
			calculatedPriceBeforeTax,
			calculatedTaxTotal,
			calculatedPriceAfterTax,
		} = carts.reduce(
			(acc, cart) => {
				const product = productMap.get(cart.productId);

				if (product) {
					const vatRate = product.productCategory?.vatPercentage || 0;
					const basePricePerUnit = product.price;
					const quantity = cart.quantity;

					const itemPriceBeforeTax = basePricePerUnit * quantity;
					const itemTaxAmount = itemPriceBeforeTax * vatRate;
					const itemPriceAfterTax =
						itemPriceBeforeTax + itemTaxAmount;

					return {
						combinedItems: [
							...acc.combinedItems,
							{ cart, product },
						],
						calculatedPriceBeforeTax:
							acc.calculatedPriceBeforeTax + itemPriceBeforeTax,
						calculatedTaxTotal:
							acc.calculatedTaxTotal + itemTaxAmount,
						calculatedPriceAfterTax:
							acc.calculatedPriceAfterTax + itemPriceAfterTax,
					};
				}
				return acc;
			},
			{
				combinedItems: [] as CartProductCombination[],
				calculatedPriceBeforeTax: 0,
				calculatedTaxTotal: 0,
				calculatedPriceAfterTax: 0,
			},
		);
		// --- End Functional Reduce ---

		setProducts(combinedItems);
		setPriceBeforeTax(calculatedPriceBeforeTax);
		setTaxTotal(calculatedTaxTotal);
		setSubtotal(calculatedPriceAfterTax);
		setIsCartLoading(false);
	}, [productsWithImages, user]);

	useEffect(() => {
		fetchCartInfo();
	}, [fetchCartInfo]);

	async function updateCartAmount(productId: number, amount: number) {
		if (!user) {
			setProducts([]);
			setSubtotal(0);
			setError(null);
			return;
		}
		if (amount < 0) return;
		setIsUpdatingAmount((prev) => [...prev, productId]);

		const { error } = await tryCatch<
			AxiosResponse<Cart>,
			AxiosError<ErrorMessage>
		>(api.updateCart(user.id, productId, amount));

		if (error) {
			setError(
				`Error al actualizar el cantidad: ${error.response?.data?.message || error.message}`,
			);
			return;
		}

		await fetchCartInfo();
		setIsUpdatingAmount((prev) => prev.filter((p) => p !== productId));
	}

	function processCart() {
		setLineItemType("PRODUCT");

		const lineItems: TemporaryLineItem[] = products.map((product) => {
			const vatRate = product.product.productCategory?.vatPercentage || 0;
			const basePricePerUnit = product.product.price;
			const quantity = product.cart.quantity;

			return {
				productId: product.product.id,
				quantity: product.cart.quantity,
				subtotal: basePricePerUnit * (1 + vatRate) * quantity,
			};
		});

		const saveableProducts = () => {
			const ids = new Set(products.map((item) => item.product.id));
			return dbProducts.filter((item) => ids.has(item.id));
		};

		setInvoiceObjs((arr) => [...arr, ...saveableProducts()]);
		setTemporaryLineItems((arr) => [...arr, ...lineItems]);
		navigate("/invoice");
	}

	return (
		<div className="container mt-15 mx-auto max-w-8xl p-4 md:p-8">
			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<section className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Carrito</CardTitle>
							<CardDescription>
								Revisa los detalles de tu pedido.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* --- Render Item Details --- */}
							{isCartLoading ? (
								<Loader2 className="animate-spin" />
							) : products.length === 0 && !isCartLoading ? (
								<p className="text-center text-muted-foreground py-4">
									Tu carrito está vacío.
								</p>
							) : (
								products.map(({ cart, product }) => {
									const isProductDisabled =
										isUpdatingAmount.includes(product.id);
									return (
										<div
											key={product.id} // Use product.id as key, it's more stable
											className="flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0"
										>
											{product.image && (
												<div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-gray-100">
													<Image
														file={product.image}
														className="object-cover w-full h-full"
													/>
												</div>
											)}
											<div className="flex-grow">
												<p className="font-medium">
													{product.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{product.description}
												</p>
												<p className="text-sm text-muted-foreground">
													Precio unitario: €
													{product.price.toFixed(2)}
												</p>
												{/* Price including VAT for clarity */}
												<p className="text-sm font-semibold">
													Subtotal de artículo: €
													{(
														product.price *
														(1 +
															(product
																.productCategory
																?.vatPercentage ||
																0)) *
														cart.quantity
													).toFixed(2)}
												</p>
											</div>

											{/* Quantity Controls */}
											<div className="flex items-center space-x-2">
												<Button
													variant="outline"
													size="icon"
													onClick={() =>
														updateCartAmount(
															cart.productId,
															cart.quantity - 1,
														)
													}
													disabled={
														cart.quantity <= 1 ||
														isProductDisabled
													} // Disable if quantity is 1 or less
												>
													<Minus className="h-4 w-4" />
													<span className="sr-only">
														Disminuir cantidad
													</span>
												</Button>
												<span className="w-8 text-center font-medium">
													{isProductDisabled ? (
														<Loader2 className="animate-spin" />
													) : (
														cart.quantity
													)}
												</span>
												<Button
													variant="outline"
													size="icon"
													onClick={() =>
														updateCartAmount(
															cart.productId,
															cart.quantity + 1,
														)
													}
													disabled={isProductDisabled}
												>
													<Plus className="h-4 w-4" />
													<span className="sr-only">
														Aumentar cantidad
													</span>
												</Button>
											</div>
										</div>
									);
								})
							)}
						</CardContent>
					</Card>
				</section>
				{/* --- Totals --- */}
				<Card className="h-fit">
					<CardHeader>
						<CardTitle>Total</CardTitle>
						<CardDescription>
							Revisa los detalles de tu pedido.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-10 justify-between">
						<div>
							<span>Subtotal: </span>
							<span>€{priceBeforeTax.toFixed(2)}</span>
						</div>
						<div>
							<span>IVA: </span>
							<span>€{taxTotal.toFixed(2)}</span>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col items-end justify-between gap-6 font-semibold text-base mt-auto">
						<Separator className="mt-auto px-3" />
						<div className="space-x-10">
							<span>Precio final: </span>
							<span>€{subtotal.toFixed(2)}</span>
							<Button onClick={processCart}>
								Procesar pedido
							</Button>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
