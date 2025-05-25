import { Appointment, Course, LineItem, Product } from "@/api";

export type TemporaryLineItem = Omit<
	LineItem,
	"id" | "invoiceId" | "createdAt"
>;
export type LineItemable = Appointment | Course | Product;
