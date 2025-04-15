import { useState, useEffect, useMemo, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { ErrorMessage, LoginRequest, User } from "@/api";
import { AxiosError } from "axios";
import { AuthContext } from "@/hooks/useAuth";

interface AuthProviderProps {
	children: ReactNode;
}

export default function AuthProvider({
	children,
}: Readonly<AuthProviderProps>) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	// Check authentication status on initial mount and fetch user info
	const initializeAuth = useCallback(async () => {
		setLoading(true);
		setError(null);
		if (authService.isAuthenticated()) {
			try {
				console.log("AuthProvider: Checking initial auth status...");
				const userInfo = authService.user();
				// fetchUserInfo now returns null if it fails or logs out internally
				if (userInfo) {
					console.log(
						"AuthProvider: User authenticated, info:",
						userInfo,
					);
					setUser(userInfo);
				} else {
					console.log(
						"AuthProvider: User info fetch failed or cleared, logging out state.",
					);
					setUser(null); // Ensure user state is null if fetch failed/cleared data
					// Optional: Redirect if fetch fails critically? Depends on desired UX
					// navigate("/login", { replace: true });
				}
			} catch (initError) {
				// This catch might be redundant if fetchUserInfo handles errors well
				console.error(
					"AuthProvider: Error during initial auth check:",
					initError,
				);
				setUser(null);
				// authService might have already cleared tokens if error was critical
			} finally {
				setLoading(false);
			}
		} else {
			console.log("AuthProvider: No initial token found.");
			setUser(null);
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	const login = useCallback(
		async (credentials: LoginRequest): Promise<boolean> => {
			setLoading(true);
			setError(null);
			try {
				const loggedInUser = await authService.login(credentials);
				setUser(loggedInUser);
				return true;
			} catch (loginError: unknown) {
				console.error("AuthProvider: Login failed", loginError);
				let errorMessage = "Login failed. Please check credentials.";
				if (loginError instanceof AxiosError) {
					const axiosError = loginError as AxiosError<ErrorMessage>;
					errorMessage =
						axiosError.response?.data?.message ||
						axiosError.message ||
						errorMessage;
				} else if (loginError instanceof Error) {
					errorMessage = loginError.message;
				}
				setError(errorMessage);
				setUser(null);
				authService.logout(); // Call the service logout which clears tokens
				return false; // Indicate failure
			} finally {
				// Ensure loading is always set to false
				setLoading(false);
			}
		},
		[],
	);

	const logout = useCallback(() => {
		console.log("AuthProvider: Logging out...");
		authService.clearAuthData();
		setUser(null);
		setError(null);
		navigate("/login", { replace: true });
	}, [navigate]);

	// Memoize the context value to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({
			isAuthenticated: !!user,
			user,
			loading,
			error, // Provide error state
			login,
			logout,
		}),
		[user, loading, error, login, logout],
	);

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}
