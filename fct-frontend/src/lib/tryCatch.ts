interface Success<T> {
	data: T;
	error: null;
}

interface Failure<E> {
	data: null;
	error: E;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;

// Overload signatures
export function tryCatch<T, E = Error>(
	promise: Promise<T>,
): Promise<Result<T, E>>;
export function tryCatch<T, E = Error>(func: () => T): Result<T, E>;

// Implementation
export function tryCatch<T, E = Error>(
	input: Promise<T> | (() => T),
): Promise<Result<T, E>> | Result<T, E> {
	if (input instanceof Promise) {
		return input
			.then((data): Result<T, E> => ({ data, error: null }))
			.catch((err): Result<T, E> => ({ data: null, error: err as E }));
	} else {
		try {
			const data = input();
			return { data, error: null };
		} catch (err) {
			return { data: null, error: err as E };
		}
	}
}
