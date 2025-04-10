// src/hooks/useAuth.ts
import { createContext, useContext } from "react";
import { User } from "@/api/models/user";

// Define the shape of the context
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    loading: true,
    login: async () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);
