import { CartsApi, ErrorMessage, Invoice, LineItem } from "@/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import PaymentForm from "@/components/ui/PaymentForm";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import useCourses from "@/hooks/useCourse";
import useInvoice from "@/hooks/useInvoice";
import { tryCatch } from "@/lib/tryCatch";
import { PaymentFormData, paymentSchema } from "@/schemas/paymentSchema";
import { LineItemable, TemporaryLineItem } from "@/types/lineItem";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { TypographyH2 } from "../ui/typography";

export type InvoiceType = "APPOINTMENT" | "PRODUCT" | "COURSE";

export interface InvoicePageProps {
	objs: LineItemable[];
	data: TemporaryLineItem[];
	itemType: InvoiceType | null;
	clearLineItems: () => void;
}

export default function InvoicePage({
	objs,
	data,
	itemType,
	clearLineItems,
}: Readonly<InvoicePageProps>) {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	console.log("objs", objs);
	console.log("data", data);
	console.log("itemType", itemType);

	const itemTypeTitle =
		itemType === "APPOINTMENT"
			? "Cita(s)"
			: itemType === "COURSE"
				? "Curso(s)"
				: "Producto(s)";

	const subtotal = data.reduce((acc, item) => item.subtotal + acc, 0);

	const { initInvoice, addLineItem, payInvoice, downloadInvoice } =
		useInvoice();

	const { updateUserCourseEnrollmentStatus, error: courseError } =
		useCourses();

	const { user } = useAuth();

	const navigate = useNavigate();

	const form = useForm<PaymentFormData>({
		defaultValues: {
			cardNumber: "",
			expiryDate: "",
			cvc: "",
			cardName: "",
		},
		resolver: zodResolver(paymentSchema),
	});

	// useEffect(() => {
	// 	if (!(objs && data && itemType)) {
	// 		navigate("/");
	// 		return;
	// 	}
	// }, [objs, data, itemType, navigate]);

	// useEffect(() => {
	// 	return () => {
	// 		clearLineItems();
	// 	};
	// }, [clearLineItems]);

	const initializeInvoiceHelper = async () => {
		const { data: invoiceRes, error: initErr } = await tryCatch<
			Invoice | undefined,
			AxiosError<ErrorMessage>
		>(initInvoice());
		if (initErr) {
			setError(
				initErr.response?.data.message ||
					"Error al inicializar la factura",
			);
			setIsLoading(false);
			return;
		}
		return invoiceRes;
	};

	const processLineItems = async (
		data: TemporaryLineItem[],
		invoiceId: number,
	) => {
		try {
			data.forEach(async (item) => await addLineItem(item, invoiceId));
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message || "Error al agregar linea", error);
				setError(err.message || "Error al agregar linea");
				setIsLoading(false);
			}
			return err;
		}
	};

	const onSubmit = async (formData: z.infer<typeof paymentSchema>) => {
		setError("");
		setIsLoading(true);

		const createdInvoice = await initializeInvoiceHelper();
		if (!createdInvoice || !user) {
			setError("Error al inicializar la factura");
			setIsLoading(false);
			return;
		}

		const { error: lineItemErr } = await tryCatch(
			processLineItems(data, createdInvoice.id),
		);
		if (lineItemErr) return;

		await payInvoice(createdInvoice.id, formData);

		if (itemType === "COURSE" && data[0].courseId) {
			await updateUserCourseEnrollmentStatus(
				data[0].courseId,
				user.id,
				"ENROLLED",
			);

			if (courseError) {
				setError(courseError);
				return;
			}
		}

		if (itemType === "PRODUCT") {
			const cartsApi = new CartsApi();
			const promises = await Promise.all(
				objs.map((product) =>
					tryCatch<AxiosResponse<void>, AxiosError<ErrorMessage>>(
						cartsApi.removeProductFromCart(user.id, product.id),
					),
				),
			);

			promises.forEach((promise) => {
				if (promise.error) {
					setError(
						promise.error.response?.data.message ||
							"Error al realizar el pago",
					);
				}
			});
		}
		await downloadInvoice(createdInvoice.id);

		setSuccess("Pago exitoso");
		setIsLoading(false);
		clearLineItems();
		navigate({
			pathname: "/",
			hash: "#main",
			search: "?paymentStatus=success",
		});
	};

	return (
		<main className="container mx-auto max-w-4xl p-4 md:p-8">
			<TypographyH2 className="mb-6">
				Resumen de Compra y Pago
			</TypographyH2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<section className="space-y-4">
					<h3 className="text-xl font-medium">Detalles del Pedido</h3>
					<Card>
						<CardHeader>
							<CardTitle>Resumen ({itemTypeTitle})</CardTitle>
							<CardDescription>
								Revisa los detalles de tu pedido.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* --- Render Item Details --- */}
							{(data as LineItem[]).map(
								(item: LineItem, index) => (
									<div
										key={index}
										className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0"
									>
										<p className="text-sm text-muted-foreground">
											{
												objs.find((obj) => {
													switch (itemType) {
														case "APPOINTMENT":
															return (
																obj.id ===
																item.appointmentId
															);
														case "COURSE":
															return (
																obj.id ===
																item.courseId
															);
														case "PRODUCT":
															return (
																obj.id ===
																item.productId
															);
													}
												})?.description
											}
										</p>
										<p className="text-sm font-semibold text-right">
											{item.subtotal.toFixed(2)}
										</p>
									</div>
								),
							)}

							<Separator className="my-4" />

							{/* --- Totals --- */}
							<div className="space-y-1 text-sm">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>€{subtotal.toFixed(2)}</span>
									{/* TODO: Calculate Subtotal */}
								</div>
								{/*
                                 TODO: Calculate Tax 
								<div className="flex justify-between">
									 <span>IVA (e.g., 21%)</span> 
									<span>€XX.XX</span>{" "}
								</div>
                                */}
								<Separator className="my-2" />
								<div className="flex justify-between font-semibold text-base">
									<span>Total</span>
									<span>€{subtotal.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Section 2: Payment Information Form */}
				<PaymentForm
					form={form}
					error={error}
					success={success}
					subtotal={subtotal}
					onSubmit={onSubmit}
					isLoading={isLoading}
				/>
			</div>
		</main>
	);
}
