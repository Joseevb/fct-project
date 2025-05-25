import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Formats a date to a string in the format "YYYY-MM-DD".
 */
export function formatDate(date: Date): string {
	// ... (implementation using local dates) ...
	if (!(date instanceof Date) || isNaN(date.getTime())) {
		return "invalid-date";
	}
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * Waits for a specified number of milliseconds.
 */
export function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
