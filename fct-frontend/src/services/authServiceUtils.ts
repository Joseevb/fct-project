// src/services/authServiceUtils.ts
import AuthService from "@/services/authService";

// Create the API URL from environment or hardcode it for development
const API_URL = "http://localhost:8080/api/v1";

// Create a singleton instance of AuthService
export const authService = new AuthService(API_URL);

// Export utility function
export const getAuthService = () => authService;
