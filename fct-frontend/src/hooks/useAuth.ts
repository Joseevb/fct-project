// src/hooks/useAuth.ts
import { createContext, useContext } from "react";
import { LoginRequest, User } from "@/api";
import { LoginError } from "@/types/errors";
import { LoginResult } from "@/types/login";

// Define the shape of the context
export interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	loading: boolean;
	error: LoginError | null;
	login: (credentials: LoginRequest) => Promise<LoginResult>;
	logout: () => void;
	updateLoggedUser: (user: User) => void;
}

// Create the context with a default value that's enough to prevent crashes
export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	user: null,
	loading: false,
	error: null,
	login: async () => ({
		success: false,
		error: "AUTH_CONTEXT_NOT_INITIALIZED",
	}),
	logout: () => {},
	updateLoggedUser: () => {},
});

// Custom hook to consume the context safely
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
