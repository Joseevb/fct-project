export const TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_ID_KEY = "user_id";

export const storage = {
	getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
	setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
	removeToken: (): void => localStorage.removeItem(TOKEN_KEY),

	getRefreshToken: (): string | null =>
		localStorage.getItem(REFRESH_TOKEN_KEY),
	setRefreshToken: (token: string): void =>
		localStorage.setItem(REFRESH_TOKEN_KEY, token),
	removeRefreshToken: (): void => localStorage.removeItem(REFRESH_TOKEN_KEY),

	getUserId: (): string | null => localStorage.getItem(USER_ID_KEY),
	setUserId: (userId: string): void =>
		localStorage.setItem(USER_ID_KEY, userId),
	removeUserId: (): void => localStorage.removeItem(USER_ID_KEY),

	clearAuthTokens: (): void => {
		storage.removeToken();
		storage.removeRefreshToken();
		storage.removeUserId();
	},

	setAuthData: (
		token: string,
		refreshToken: string,
		userId: string,
	): void => {
		storage.setToken(token);
		storage.setRefreshToken(refreshToken);
		storage.setUserId(userId);
	},
};
