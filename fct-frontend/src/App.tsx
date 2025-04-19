import { Route, Routes } from "react-router-dom";
import Header from "@/components/ui/Header";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/components/pages/HomePage";
import { ThemeProvider } from "@/components/theme-provider";
import AuthPage from "@/components/pages/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { useRef } from "react";
import ScrollToHashElement from "@cascadia-code/scroll-to-hash-element";
import AdminPanel from "@/components/pages/AdminPanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppointmentSchedulePage from "./components/pages/AppointmentSchedulePage";

export default function App() {
	const { user } = useAuth();

	console.log("user:", user);

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
					element={<AppointmentSchedulePage />}
				/>
			</Routes>
			<Toaster />
		</ThemeProvider>
	);
}
