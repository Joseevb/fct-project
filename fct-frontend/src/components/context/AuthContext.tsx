import { LoginRequest, LoginResponse, User, UsersApi } from "@/api";
import { AuthContext, AuthContextType } from "@/hooks/useAuth";
import { tryCatch } from "@/lib/tryCatch";
import { authService } from "@/services/authService";
import { LoginError } from "@/types/errors";
import { LoginResult } from "@/types/login";
import { useCallback, useEffect, useState, type ReactNode } from "react";

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

	const login = useCallback(
		async (credentials: LoginRequest): Promise<LoginResult> => {
			setError(null);
			setLoading(true);

			let success: boolean = false;

			const { data, error } = await tryCatch<LoginResponse, LoginError>(
				authService.login(credentials),
			);

			if (error) {
				setError(error);
				setLoading(false);
				console.log(error);
			}

			if (data) {
				const user = await new UsersApi().getUserById(data.userId);
				success = true;
				setUser(user.data);
			}

			setLoading(false);
			return { success, data, error };
		},
		[],
	);

	const logout = () => {
		authService.logout();
		setUser(null);
		setLoading(false);
		window.location.replace("/");
	};

	const updateLoggedUser = (user: User) => {
		setUser(user);
	};

	const providerValue: AuthContextType = {
		isAuthenticated: authService.isAuthenticated(),
		user,
		error,
		loading,
		login,
		logout,
		updateLoggedUser,
	};

	return (
		<AuthContext.Provider value={providerValue}>
			{children}
		</AuthContext.Provider>
	);
}
