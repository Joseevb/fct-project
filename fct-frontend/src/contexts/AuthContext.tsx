// src/contexts/AuthContext.tsx
import { useEffect, useState, ReactNode } from "react";
import { User } from "@/api/models/user"; // Import the generated User type
import { authService } from "@/services/authServiceUtils";
import { AuthContext } from "@/hooks/useAuth";

interface AuthProviderProps {
	children: ReactNode;
}

// Create the provider component
export default function AuthProvider({
	children,
}: Readonly<AuthProviderProps>) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// Check authentication status on mount
	useEffect(() => {
		const checkAuth = async () => {
			try {
				if (authService.isAuthenticated()) {
					const userInfo = await authService.getUserInfo();
					setUser(userInfo); // Make sure types match
				}
			} catch (error) {
				console.error("Failed to get user info:", error);
				authService.logout();
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (username: string, password: string) => {
		setLoading(true);
		try {
			const userInfo = await authService.login(username, password);
			setUser(userInfo); // Make sure types match
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		authService.logout();
		setUser(null);
	};

	const value = {
		isAuthenticated: !!user,
		user,
		loading,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}
