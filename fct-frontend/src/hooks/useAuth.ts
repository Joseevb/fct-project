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
	login: (credentials: LoginRequest) => Promise<LoginResult>;
	logout: () => void;
	error: LoginError | null;
}

// Create the context with a default undefined value initially
export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

// Custom hook to consume the context safely
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
