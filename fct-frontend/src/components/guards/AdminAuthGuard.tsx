import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleEnum } from "@/api";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { Loader2 } from "lucide-react";

interface AdminAuthGuardProps {
	children: ReactNode;
}

export default function AdminAuthGuard({
	children,
}: Readonly<AdminAuthGuardProps>) {
	const { user, loading: authLoading, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	// Show loading state while auth status is being determined
	if (authLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
			</div>
		);
	}

	const isAuthorized = isAuthenticated && user?.role === RoleEnum.ADMIN;

	if (!isAuthorized) {
		return (
			<ErrorAlert
				title="No esta autorizado a acceder a este recurso"
				description="No cuenta con los permisos necesarios para acceder a este recurso."
				cancelText="Volver"
				actionText="Iniciar Sesión"
				defaultOpen={true}
				handleCancel={() => navigate("/")}
				handleAction={() =>
					navigate("/login", {
						state: { from: "/admin" },
					})
				}
			/>
		);
	}

	return <>{children}</>;
}
