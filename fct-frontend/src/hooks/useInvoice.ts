import {
	AddLineItemRequest,
	Invoice,
	InvoicesApi,
	LineItem,
	LineItemsApi,
} from "@/api";
import { tryCatch } from "@/lib/tryCatch";
import { useAuth } from "./useAuth";
import { useState } from "react";
import { TemporaryLineItem } from "@/types/lineItem";

interface UseInvoiceResult {
	invoice: Invoice | null;
	lineItems: LineItem[];
	initInvoice: () => Promise<Invoice>;
	addLineItem: (item: TemporaryLineItem) => Promise<void>;
	payInvoice: (invoiceId: number) => Promise<void>;
}

export default function useInvoice(): UseInvoiceResult {
	const [lineItems, setLineItems] = useState<LineItem[]>([]);
	const [invoice, setInvoice] = useState<Invoice | null>(null);

	const { user } = useAuth();

	if (!user) {
		throw new Error("useInvoice must be used within an AuthProvider");
	}

	const initInvoice = async () => {
		const api = new InvoicesApi();

		const { data, error } = await tryCatch(
			api.addInvoice({ userId: user.id, paymentMethod: "" }),
		);

		if (error) throw error;

		setInvoice(data.data);
		return data.data;
	};

	const addLineItem = async (item: TemporaryLineItem) => {
		if (!invoice) {
			console.warn("Invoice not initialized. Call initInvoice first.");
			throw new Error("INVOICE_NOT_INITIALIZED");
		}

		const lineItemApi = new LineItemsApi();

		const request: AddLineItemRequest = {
			invoiceId: invoice.id,
			...item,
		};

		const { data, error } = await tryCatch(
			lineItemApi.addLineItem(request),
		);

		if (error) throw error;

		setLineItems((arr) => [...arr, data.data]);
	};

	const payInvoice = async (invoiceId: number) => {
		const api = new InvoicesApi();
		const { data, error } = await tryCatch(
			api.updateInvoiceStatus(invoiceId, { status: "PAID" }),
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
