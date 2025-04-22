import AdminPanel from "@/components/pages/AdminPanel";
import AuthPage from "@/components/pages/AuthPage";
import HomePage from "@/components/pages/HomePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/ui/Header";
import { Toaster } from "@/components/ui/sonner";
import ScrollToHashElement from "@cascadia-code/scroll-to-hash-element";
import { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppointmentBookingPage from "@/components/pages/AppointmentBookingPage";
import InvoicePage, { InvoiceType } from "@/components/pages/InvoicePage";
import { TemporaryLineItem } from "@/types/lineItem";
import { LineItemable } from "@/types/lineItem";

export default function App() {
	const [temporaryLineItems, setTemporaryLineItems] = useState<
		TemporaryLineItem[]
	>([]);
	const [invoiceObjs, setInvoiceObjs] = useState<LineItemable[]>([]);
	const [invoiceType, setInvoiceType] = useState<InvoiceType>("APPOINTMENT");

	const headerRef = useRef<HTMLDivElement>(null);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<ScrollToHashElement behavior="smooth" />
			<Header ref={headerRef} />
			<Routes>
				{["/", "/home", "/index"].map((path, idx) => (
					<Route
						key={idx}
						path={path}
						element={<HomePage headerRef={headerRef} />}
					/>
				))}
				<Route path="/login" element={<AuthPage />} />

				<Route path="/admin" element={<ProtectedRoute />}>
					<Route index element={<AdminPanel />} />
				</Route>

				<Route path="/appointments" element={<ProtectedRoute />}>
					<Route
						index
						element={
							<AppointmentBookingPage
								setInvoiceObjs={setInvoiceObjs}
								setLineItemType={setInvoiceType}
								setTemporaryLineItems={setTemporaryLineItems}
							/>
						}
					/>
				</Route>

				<Route path="/invoice" element={<ProtectedRoute />}>
					<Route
						index
						element={
							<InvoicePage
								objs={invoiceObjs}
								data={temporaryLineItems}
								itemType={invoiceType}
							/>
						}
					/>
				</Route>
			</Routes>
			<Toaster />
		</ThemeProvider>
	);
}
