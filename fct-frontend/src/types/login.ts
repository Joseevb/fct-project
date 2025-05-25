import { LoginResponse } from "@/api";
import { LoginError } from "@/types/errors";

export interface LoginResult {
	success: boolean;
	data?: LoginResponse | null;
	error?: LoginError | null;
}
