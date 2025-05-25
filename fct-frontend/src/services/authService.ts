// src/services/authService.ts

import {
	Configuration,
	DefaultApi,
	ErrorMessage,
	LoginRequest,
	LoginResponse,
	User,
	UsersApi,
} from "@/api";
import { BASE_PATH } from "@/api/base";
import { storage } from "@/lib/localStorageUtils";
import { tryCatch } from "@/lib/tryCatch";
import axios, {
	AxiosError,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

class AuthService {
	#basePath: string;
	#cofiguration: Configuration | undefined;
	#user: User | undefined;

	constructor(basePath: string, configuration?: Configuration) {
		this.#basePath = basePath;
		this.#cofiguration = configuration;

		this.#setupAxiosInterceptors();
	}

	async login(credentials: LoginRequest): Promise<LoginResponse> {
		try {
			const api = new DefaultApi(this.#cofiguration, this.#basePath);
			const usersApi = new UsersApi(this.#cofiguration, this.#basePath);

			const loginResponse = await api.login(credentials);
			const userResponse = await usersApi.getUserById(
				loginResponse.data.userId,
				{
					headers: {
						Authorization: `Bearer ${loginResponse.data.jwt}`,
					},
				},
			);

			this.#user = userResponse.data;

			storage.setAuthData(
				loginResponse.data.jwt,
				loginResponse.data.refreshToken,
				loginResponse.data.userId.toString(),
			);

			// Adds global Authorization header to every request
			axios.defaults.headers.common["Authorization"] =
				`Bearer ${loginResponse.data.jwt}`;

			return loginResponse.data;
		} catch (err: unknown) {
			console.error(err);
			if (err instanceof AxiosError) {
				switch (err.response?.status) {
					case 400:
						throw "INVALID_REQUEST";
					case 401:
						throw "CREDENTIAL_ERROR";
					default:
						throw "UNKNOWN_ERROR";
				}
			}
			throw "UNKNOWN_ERROR";
		}
	}

	async restoreSession(): Promise<User | null> {
		const token = storage.getToken();
		const userId = storage.getUserId();

		if (!token || !userId) return null;

		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

		try {
			const usersApi = new UsersApi(this.#cofiguration, this.#basePath);
			const userResponse = await usersApi.getUserById(Number(userId));
			this.#user = userResponse.data;
			return this.#user;
		} catch (err) {
			console.error(err);
			this.logout();
			return null;
		}
	}

	async logout(): Promise<void> {
		this.#user = undefined;
		storage.clearAuthTokens();

		// Removes the Authorization header from every request
		delete axios.defaults.headers.common["Authorization"];
	}

	// Add to authService.ts
	async refreshToken(): Promise<boolean> {
		const refreshToken = storage.getRefreshToken();
		if (!refreshToken) return false;

		const api = new DefaultApi(this.#cofiguration, this.#basePath);

		const { data: response, error } = await tryCatch<
			AxiosResponse<LoginResponse>,
			AxiosError<ErrorMessage>
		>(api.refreshSession({ refreshToken }));

		if (error) {
			console.error(error);
			this.logout();
			return false;
		}

		storage.setAuthData(
			response.data.jwt,
			response.data.refreshToken,
			storage.getUserId() || "",
		);

		axios.defaults.headers.common["Authorization"] =
			`Bearer ${response.data.jwt}`;
		return true;
	}

	// Add to authService.ts constructor
	#setupAxiosInterceptors(): void {
		axios.interceptors.response.use(
			(response) => response,
			async (error: AxiosError<ErrorMessage>) => {
				const originalRequest = error.config as
					| CustomAxiosRequestConfig
					| undefined;

				if (error && originalRequest) {
					if (
						error.response &&
						!error.response?.data.message.startsWith("File")
					) {
						toast.error(`Error: ${error.response?.data.message}`);
					}
					// If error is 401 and we haven't tried to refresh token yet
					if (
						error.response?.status === 401 &&
						!originalRequest._retry
					) {
						originalRequest._retry = true;

						if (await this.refreshToken()) {
							// Retry the original request with new token
							return axios(originalRequest);
						}
					}
				}

				return Promise.reject(error);
			},
		);
	}

	get user(): User | null {
		return this.#user ?? null;
	}

	isAuthenticated(): boolean {
		return !!this.#user || !!storage.getToken();
	}
}

// --- Singleton Instance ---
export const authService = new AuthService(BASE_PATH);
