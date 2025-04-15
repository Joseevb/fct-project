// src/services/authService.ts

import {
	Configuration,
	DefaultApi,
	LoginRequest,
	LoginResponse,
	User,
	UsersApi,
} from "@/api";
import { BASE_PATH } from "@/api/base";
import { storage } from "@/lib/localStorageUtils";
import axios, { AxiosError } from "axios";

class AuthService {
	#basePath: string;
	#cofiguration: Configuration | undefined;
	#user: User | undefined;

	constructor(basePath: string, configuration?: Configuration) {
		this.#basePath = basePath;
		this.#cofiguration = configuration;
	}

	async login(credentials: LoginRequest): Promise<LoginResponse> {
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

	async logout() {
		this.#user = undefined;
		storage.clearAuthTokens();
	}

	get user(): User | null {
		return this.#user ?? null;
	}

	isAuthenticated(): boolean {
		return !!this.#user || !!storage.getToken();
	}
}

// --- Singleton Instance ---
// Ensure BASE_PATH is correctly imported/defined
export const authService = new AuthService(BASE_PATH);
