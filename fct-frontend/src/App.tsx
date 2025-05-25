import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/ui/Header";
import { Toaster } from "@/components/ui/sonner";
import ScrollToHashElement from "@cascadia-code/scroll-to-hash-element";
import ProtectedRoute from "@/components/ProtectedRoute";

import { TemporaryLineItem } from "@/types/lineItem";
import { LineItemable } from "@/types/lineItem";
import { InvoiceType } from "@/components/pages/InvoicePage";
import { Loader2 } from "lucide-react";

const AdminPanel = lazy(() => import("@/components/pages/admin/AdminPanel"));
const AuthPage = lazy(() => import("@/components/pages/AuthPage"));
const HomePage = lazy(() => import("@/components/pages/HomePage"));
const AppointmentBookingPage = lazy(
	() => import("@/components/pages/AppointmentBookingPage"),
);
const InvoicePage = lazy(() => import("@/components/pages/InvoicePage"));
const ProfilePage = lazy(() => import("@/components/pages/ProfilePage"));
const UserAppointmentsPage = lazy(
	() => import("@/components/pages/UserAppointmentsPage"),
);
const CoursesPage = lazy(() => import("@/components/pages/CoursesPage"));
const UserCoursesPage = lazy(
	() => import("@/components/pages/UserCoursesPage"),
);
const ProductsPage = lazy(() => import("./components/pages/ProductsPage"));
const CartPage = lazy(() => import("@/components/pages/CartPage"));

const PageLoader = () => (
	<div className="flex items-center justify-center h-screen">
		<Loader2 className="animate-spin w-20 h-20" />
	</div>
);

export default function App() {
	const [temporaryLineItems, setTemporaryLineItems] = useState<
		TemporaryLineItem[]
	>([]);
	const [invoiceObjs, setInvoiceObjs] = useState<LineItemable[]>([]);
	const [invoiceType, setInvoiceType] = useState<InvoiceType | null>(null);

	const headerRef = useRef<HTMLDivElement>(null);

	const clearLineItems = useCallback(() => {
		setInvoiceObjs([]);
		setTemporaryLineItems([]);
		setInvoiceType(null);
	}, []);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<ScrollToHashElement behavior="smooth" />
			<Header ref={headerRef} />
			<div className="pt-15">
				{" "}
				{/* Make sure this class provides enough padding for the fixed header */}
				<Suspense fallback={<PageLoader />}>
					<Routes>
						{["/", "/home", "/index"].map((path, idx) => (
							<Route
								key={idx}
								path={path}
								element={
									<HomePage
										headerRef={headerRef}
										clearLineItems={clearLineItems}
									/>
								}
							/>
						))}
						<Route path="/login" element={<AuthPage />} />

						<Route path="/admin/*" element={<ProtectedRoute />}>
							{/* AdminPanel is now lazy-loaded, so it's fine inside ProtectedRoute */}
							<Route path="*" element={<AdminPanel />} />
						</Route>

						<Route
							path="/appointments"
							element={<ProtectedRoute />}
						>
							<Route
								index
								element={
									<AppointmentBookingPage
										setInvoiceObjs={setInvoiceObjs}
										setLineItemType={setInvoiceType}
										setTemporaryLineItems={
											setTemporaryLineItems
										}
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
										clearLineItems={clearLineItems}
									/>
								}
							/>
						</Route>

						<Route path="/profile" element={<ProtectedRoute />}>
							<Route index element={<ProfilePage />} />
						</Route>

						<Route
							path="/user/appointments"
							element={<ProtectedRoute />}
						>
							<Route index element={<UserAppointmentsPage />} />
						</Route>

						<Route
							path="/courses"
							element={
								<CoursesPage
									setInvoiceObjs={setInvoiceObjs}
									setLineItemType={setInvoiceType}
									setTemporaryLineItems={
										setTemporaryLineItems
									}
								/>
							}
						/>
						<Route
							path="/user/courses"
							element={<ProtectedRoute />}
						>
							<Route index element={<UserCoursesPage />} />
						</Route>

						<Route path="/products" element={<ProductsPage />} />

						<Route path="/cart" element={<ProtectedRoute />}>
							<Route
								index
								element={
									<CartPage
										setInvoiceObjs={setInvoiceObjs}
										setLineItemType={setInvoiceType}
										setTemporaryLineItems={
											setTemporaryLineItems
										}
									/>
								}
							/>
						</Route>
					</Routes>
				</Suspense>
			</div>
			<Toaster />
		</ThemeProvider>
	);
}
