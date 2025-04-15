import { LoginRequest, LoginResponse, User } from "@/api";
import { AuthContext, AuthContextType } from "@/hooks/useAuth";
import { tryCatch } from "@/lib/tryCatch";
import { authService } from "@/services/authService";
import { LoginError } from "@/types/errors";
import { useEffect, useState, type ReactNode } from "react";

export interface AuthContextProps {
	children: ReactNode;
}

export default function AuthProvider({ children }: AuthContextProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<LoginError | null>(null);

	useEffect(() => {
		setUser(authService.user);

		const restore = async () => {
			setLoading(true);
			const restoredUser = await authService.restoreSession();
			if (restoredUser) {
				setUser(restoredUser);
			}
			setLoading(false);
		};

		restore();
	}, []);

	const login = async (
		credentials: LoginRequest,
	): Promise<LoginResponse | undefined> => {
		setLoading(true);
		const { data, error } = await tryCatch<LoginResponse, LoginError>(
			authService.login(credentials),
		);

		if (data) {
			setLoading(false);
			return data;
		}

		if (error) {
			setError(error);
			setLoading(false);
			return;
		}

		console.log(data, error);
		setLoading(false);
	};

	const logout = () => {
		authService.logout();
		setUser(null);
		setLoading(false);
	};

	const providerValue: AuthContextType = {
		isAuthenticated: authService.isAuthenticated(),
		user: user,
		login: login,
		logout: logout,
		loading: loading,
		error,
	};

	return (
		<AuthContext.Provider value={providerValue}>
			{children}
		</AuthContext.Provider>
	);
}
