// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
	const { isAuthenticated, loading } = useAuth();
	const location = useLocation();

	// Show loading state while checking authentication
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="mr-2 h-10 w-10 animate-spin" />
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Render the protected content
	return <Outlet />;
}
