import {
	AddLineItemRequest,
	Invoice,
	InvoicesApi,
	LineItem,
	LineItemsApi,
} from "@/api";
import { tryCatch } from "@/lib/tryCatch";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { TemporaryLineItem } from "@/types/lineItem";
import { useNavigate } from "react-router-dom";
import { PaymentFormData } from "@/schemas/paymentSchema";

interface UseInvoiceResult {
	invoice: Invoice | null;
	lineItems: LineItem[];
	initInvoice: () => Promise<Invoice>;
	addLineItem: (item: TemporaryLineItem, invoiceId?: number) => Promise<void>;
	payInvoice: (
		invoiceId: number,
		paymentData?: PaymentFormData,
	) => Promise<void>;
}

export default function useInvoice(): UseInvoiceResult {
	const [lineItems, setLineItems] = useState<LineItem[]>([]);
	const [invoice, setInvoice] = useState<Invoice | null>(null);

	const { user } = useAuth();

	const navigate = useNavigate();

	useEffect(() => {
		if (!user || user === null) {
			navigate("/login");
		}
	}, [user, navigate]);

	const initInvoice = async () => {
		if (!user) {
			navigate("/login");
			throw new Error("User not authenticated");
		}

		const api = new InvoicesApi();

		const { data, error } = await tryCatch(
			api.addInvoice({ userId: user.id, paymentMethod: "" }),
		);

		if (error) console.error("error", error);
		if (error) throw error;

		console.log("data", data);
		setInvoice(data.data);
		return data.data;
	};

	const addLineItem = async (item: TemporaryLineItem, invoiceId?: number) => {
		let usedInvoice: Invoice | null = invoice;

		if (invoiceId) {
			const invoiceApi = new InvoicesApi();
			const { data: invoiceRes, error: invoiceErr } = await tryCatch(
				invoiceApi.getInvoiceById(invoiceId),
			);

			if (invoiceErr) {
				console.error("Error getting invoice", invoiceErr);
				throw new Error("INVOICE_NOT_FOUND");
			}

			usedInvoice = invoiceRes.data;
		}

		if (!usedInvoice) {
			console.warn("Invoice not initialized. Call initInvoice first.");
			throw new Error("INVOICE_NOT_INITIALIZED");
		}

		const lineItemApi = new LineItemsApi();

		const request: AddLineItemRequest = {
			invoiceId: invoiceId || usedInvoice.id,
			...item,
		};

		const { data, error } = await tryCatch(
			lineItemApi.addLineItem(request),
		);

		if (error) throw error;

		setLineItems((arr) => [...arr, data.data]);
	};

	const payInvoice = async (
		invoiceId: number,
		paymentData?: PaymentFormData,
	) => {
		const api = new InvoicesApi();
		const { data, error } = await tryCatch(
			api.updateInvoice(invoiceId, {
				status: "PAID",
				paymentMethod: JSON.stringify(paymentData) || "",
			}),
		);
		if (error) throw error;
		setInvoice(data.data);
	};

	return {
		invoice,
		lineItems,
		initInvoice,
		addLineItem,
		payInvoice,
	};
}
