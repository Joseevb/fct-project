import { ErrorMessage, ValidationErrorMessage } from "@/api";

export type LoginError =
	| "INVALID_REQUEST"
	| "CREDENTIAL_ERROR"
	| "UNKNOWN_ERROR";

export type ResponseError = ErrorMessage | ValidationErrorMessage;
