import AdminPanel from "@/components/pages/AdminPanel";
import AuthPage from "@/components/pages/AuthPage";
import HomePage from "@/components/pages/HomePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/ui/Header";
import { Toaster } from "@/components/ui/sonner";
import ScrollToHashElement from "@cascadia-code/scroll-to-hash-element";
import { useRef } from "react";
import { Route, Routes } from "react-router-dom";
import AppointmentBookingPage from "./components/pages/AppointmentBookingPage";

export default function App() {
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

				<Route
					path="/appointments"
					element={<AppointmentBookingPage />}
				/>
			</Routes>
			<Toaster />
		</ThemeProvider>
	);
}
