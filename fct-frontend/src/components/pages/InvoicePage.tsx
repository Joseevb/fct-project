import { LineItem } from "@/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import PaymentForm from "@/components/ui/PaymentForm";
import { Separator } from "@/components/ui/separator";
import useInvoice from "@/hooks/useInvoice";
import { tryCatch } from "@/lib/tryCatch";
import { PaymentFormData, paymentSchema } from "@/schemas/paymentSchema";
import { LineItemable, TemporaryLineItem } from "@/types/lineItem";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type InvoiceType = "APPOINTMENT" | "PRODUCT" | "COURSE";

export interface InvoicePageProps {
	objs: LineItemable[];
	data: TemporaryLineItem[];
	itemType: InvoiceType;
}

export default function InvoicePage({
	objs,
	data,
	itemType,
}: Readonly<InvoicePageProps>) {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const itemTypeTitle =
		itemType === "APPOINTMENT"
			? "Cita(s)"
			: itemType === "COURSE"
				? "Curso(s)"
				: "Producto(s)";

	const subtotal = data.reduce((acc, item) => item.subtotal + acc, 0);

	const { initInvoice, addLineItem, payInvoice } = useInvoice();

	const form = useForm<PaymentFormData>({
		defaultValues: {
			cardNumber: "",
			expiryDate: "",
			cvc: "",
			cardName: "",
		},
		resolver: zodResolver(paymentSchema),
	});

	const onSubmit = async (formData: z.infer<typeof paymentSchema>) => {
		setError("");
		setIsLoading(true);

		const { data: invoice, error: invoiceErr } =
			await tryCatch(initInvoice());

		if (invoiceErr) {
			setError(invoiceErr.message);
			return;
		}

		const res = data.map((item) => tryCatch(addLineItem(item)));

		const resolvedRes = await Promise.all(res);

		if (resolvedRes.some((res) => res.error)) {
			setError(
				resolvedRes.find((res) => res.error)?.error?.message ||
					"Error al agregar linea",
			);
			return;
		}

		payInvoice(invoice.id);

		console.log(
			"payment data",
			formData,
			"\nitems:",
			data,
			"\nobjs:",
			objs,
		);
		setIsLoading(false);
	};

	return (
		<main className="container mx-auto max-w-4xl p-4 md:p-8">
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
				Resumen de Compra y Pago
			</h2>

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
										{itemType !== "APPOINTMENT" && (
											<p className="font-medium"></p>
										)}
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
											{item.subtotal}
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
					subtotal={subtotal}
					onSubmit={onSubmit}
					isLoading={isLoading}
				/>
			</div>
		</main>
	);
}
