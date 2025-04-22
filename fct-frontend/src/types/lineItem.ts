import { Appointment, LineItem } from "@/api";

export type TemporaryLineItem = Omit<
	LineItem,
	"id" | "invoiceId" | "createdAt"
>;
export type LineItemable = Appointment; // | Product | Course;
