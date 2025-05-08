import { ErrorMessage, ValidationErrorMessage } from "@/api";

export type LoginError =
	| "AUTH_CONTEXT_NOT_INITIALIZED"
	| "INVALID_REQUEST"
	| "CREDENTIAL_ERROR"
	| "UNKNOWN_ERROR";

export type ResponseError = ErrorMessage | ValidationErrorMessage;
