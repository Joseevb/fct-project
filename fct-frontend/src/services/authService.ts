// src/services/authService.ts
import axios, { AxiosInstance } from "axios";
import {
    DefaultApi,
    DefaultApiInterface,
    LoginResponse,
    User,
    UsersApi,
    UsersApiInterface,
} from "../api";
import { BASE_PATH } from "@/api/base";

export default class AuthService {
    #api: DefaultApiInterface;
    #userApi: UsersApiInterface;
    #axiosInstance: AxiosInstance;
    #tokenKey = "auth_token";
    #refreshTokenKey = "refresh_token";
    #userIdKey = "user_id";

    constructor(url?: string) {
        const baseURL = url ? url : BASE_PATH;

        // Create an axios instance
        this.#axiosInstance = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Set up request interceptor to add auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token && config.headers) {
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        // Set up response interceptor to handle token refresh
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If the error is not 401 or the request has already been retried, reject
                if (error.response.status !== 401 || originalRequest._retry) {
                    return Promise.reject(error);
                }

                // Mark the request as retried
                originalRequest._retry = true;

                try {
                    // Try to refresh the token
                    const refreshToken = this.getRefreshToken();
                    if (!refreshToken) {
                        // No refresh token available, logout
                        this.logout();
                        return Promise.reject(error);
                    }

                    // Call refresh token endpoint
                    const response = await this.api.refreshSession({
                        refreshToken,
                    });

                    // Save the new tokens
                    this.setAuthData(response.data);

                    // Update the Authorization header
                    originalRequest.headers["Authorization"] =
                        `Bearer ${response.data.jwt}`;

                    // Retry the original request
                    return this.axiosInstance(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, logout
                    this.logout();
                    return Promise.reject(refreshError);
                }
            },
        );

        // Initialize DefaultApi with our axios instance
        this.#api = new DefaultApi(undefined, baseURL, this.axiosInstance);
        this.#userApi = new UsersApi(undefined, baseURL, this.axiosInstance);
    }

    // Get the API instance with auth headers configured
    get api(): DefaultApiInterface {
        return this.#api;
    }

    get userApi(): UsersApiInterface {
        return this.#userApi;
    }

    get axiosInstance(): AxiosInstance {
        return this.#axiosInstance;
    }

    get tokenKey(): string {
        return this.#tokenKey;
    }

    get refreshTokenKey(): string {
        return this.#refreshTokenKey;
    }

    get userIdKey(): string {
        return this.#userIdKey;
    }

    // Login method - call your login API endpoint
    async login(username: string, password: string): Promise<User> {
        try {
            // Replace with your actual login endpoint
            const response = await this.api.login({ username, password });

            // Save auth data to localStorage
            this.setAuthData(response.data);

            // Return user info or fetch user details
            return this.getUserInfo();
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    // Logout method
    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userIdKey);
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Get current user info
    async getUserInfo(): Promise<User> {
        const userId = this.getUserId();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        // Replace with your actual user endpoint
        const response = await this.userApi.getUserById(Number(userId));
        return response.data;
    }

    // Store auth data in localStorage
    private setAuthData(authResponse: LoginResponse): void {
        localStorage.setItem(this.tokenKey, authResponse.jwt);
        localStorage.setItem(this.refreshTokenKey, authResponse.refreshToken);
        localStorage.setItem(this.userIdKey, authResponse.userId.toString());
    }

    // Get stored token
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // Get stored refresh token
    private getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    // Get stored user ID
    private getUserId(): string | null {
        return localStorage.getItem(this.userIdKey);
    }
}
