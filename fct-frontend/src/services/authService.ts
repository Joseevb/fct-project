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
import axios, { AxiosError } from "axios";

export type LoginReturnType =
	| LoginResponse
	| "INVALID_REQUEST"
	| "LOGIN_ERROR"
	| "UNKNOWN_ERROR";

class AuthService {
	#basePath: string;
	#cofiguration: Configuration | undefined;
	#user: User | undefined;

	constructor(basePath: string, configuration?: Configuration) {
		this.#basePath = basePath;
		this.#cofiguration = configuration;
	}

	async login(credentials: LoginRequest): Promise<LoginReturnType> {
		try {
			const api = new DefaultApi(this.#cofiguration, this.#basePath);
			const usersApi = new UsersApi(this.#cofiguration, this.#basePath);

			const loginResponse = await api.login(credentials);
			const userResponse = await usersApi.getUserById(
				loginResponse.data.userId,
			);

			this.#user = userResponse.data;

			storage.setAuthData(
				loginResponse.data.jwt,
				loginResponse.data.refreshToken,
				loginResponse.data.userId.toString(),
			);

			axios.defaults.headers.common["Authorization"] =
				`Bearer ${loginResponse.data.jwt}`;

			return loginResponse.data;
		} catch (err: unknown) {
			console.error("Error logging in:", err);
			if (err instanceof AxiosError) {
				const axiosError = err as AxiosError<ErrorMessage>;

				switch (axiosError.response?.status) {
					case 400:
						throw Error("INVALID_REQUEST");
					case 401:
						throw Error("LOGIN_ERROR");
					default:
						throw Error("UNKNOWN_ERROR");
				}
			} else {
				throw Error("UNKNOWN_ERROR");
			}
		}
	}

	async logout() {
		this.#user = undefined;
		storage.clearAuthTokens();
	}

	get user(): User | null {
		return this.#user ?? null;
	}

	isAuthenticated(): boolean {
		return !!this.#user;
	}
}

// --- Singleton Instance ---
// Ensure BASE_PATH is correctly imported/defined
export const authService = new AuthService(BASE_PATH);
