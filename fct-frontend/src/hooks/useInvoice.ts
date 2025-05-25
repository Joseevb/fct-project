import {
	AddLineItemRequest,
	ErrorMessage,
	Invoice,
	InvoicesApi,
	InvoiceStatusEnum,
	LineItem,
	LineItemsApi,
} from "@/api";
import { tryCatch } from "@/lib/tryCatch";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { TemporaryLineItem } from "@/types/lineItem";
import { useNavigate } from "react-router-dom";
import { PaymentFormData } from "@/schemas/paymentSchema";
import { AxiosResponse, AxiosError, RawAxiosRequestConfig } from "axios";

interface UseInvoiceResult {
	error: string | null;
	invoice: Invoice | null;
	invoices: Invoice[];
	lineItems: LineItem[];
	initInvoice: () => Promise<Invoice | undefined>;
	payInvoice: (
		invoiceId: number,
		paymentData?: PaymentFormData,
	) => Promise<void>;
	addLineItem: (item: TemporaryLineItem, invoiceId?: number) => Promise<void>;
	fetchInvoices: (status?: InvoiceStatusEnum) => Promise<void>;
	downloadInvoice: (invoiceId: number) => Promise<void>;
}

export default function useInvoice(): UseInvoiceResult {
	const [error, setError] = useState<string | null>(null);
	const [lineItems, setLineItems] = useState<LineItem[]>([]);
	const [invoice, setInvoice] = useState<Invoice | null>(null);
	const [invoices, setInvoices] = useState<Invoice[]>([]);

	const { user } = useAuth();

	const navigate = useNavigate();

	useEffect(() => {
		if (!user || user === null) {
			navigate("/login");
		}
	}, [user, navigate]);

	async function initInvoice() {
		if (!user) {
			navigate("/login");
			throw new Error("User not authenticated");
		}

		const api = new InvoicesApi();

		const { data, error } = await tryCatch<
			AxiosResponse<Invoice>,
			AxiosError<ErrorMessage>
		>(api.addInvoice({ userId: user.id, paymentMethod: "" }));

		if (error) {
			setError(error.response?.data.message || "Unknown error");
			return;
		}

		setInvoice(data.data);
		return data.data;
	}

	async function addLineItem(item: TemporaryLineItem, invoiceId?: number) {
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

		const { data, error } = await tryCatch<
			AxiosResponse<LineItem>,
			AxiosError<ErrorMessage>
		>(lineItemApi.addLineItem(request));

		if (error) {
			setError(error.response?.data.message || "Unknown error");
			return;
		}

		setLineItems((arr) => [...arr, data.data]);
	}

	async function payInvoice(
		invoiceId: number,
		paymentData?: PaymentFormData,
	) {
		const api = new InvoicesApi();
		const { data, error } = await tryCatch<
			AxiosResponse<Invoice>,
			AxiosError<ErrorMessage>
		>(
			api.updateInvoice(invoiceId, {
				status: "PAID",
				paymentMethod: JSON.stringify(paymentData) || "",
			}),
		);
		if (error) {
			setError(error.response?.data.message || "Unknown error");
			return;
		}

		setInvoice(data.data);
	}

	async function fetchInvoices(status?: InvoiceStatusEnum) {
		const api = new InvoicesApi();
		const { data, error } = await tryCatch(
			api.getAllInvoices(undefined, status),
		);
		if (error) throw error;
		setInvoices(data.data);
	}

	async function downloadInvoice(invoiceId: number) {
		const api = new InvoicesApi();

		const requestOptions: RawAxiosRequestConfig = {
			responseType: "blob", // <--- THIS IS THE KEY!
		};

		const { data, error } = await tryCatch(
			api.getInvoiceByIdAsPDF(invoiceId, requestOptions),
		);
		if (error) throw error;

		const pdfFile: File = data.data;

		if (pdfFile.size === 0) {
			console.warn("Received empty PDF file.");
		}

		const url = window.URL.createObjectURL(pdfFile);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `invoice-${invoiceId}.pdf`);

		document.body.appendChild(link);
		link.click();
	}

	useEffect(() => {
		async function fetchData() {
			const api = new InvoicesApi();
			const { data, error } = await tryCatch(api.getAllInvoices());
			if (error) throw error;
			setInvoices(data.data);
		}

		fetchData();
	}, []);

	return {
		error,
		invoice,
		invoices,
		lineItems,
		initInvoice,
		downloadInvoice,
		fetchInvoices,
		addLineItem,
		payInvoice,
	};
}
