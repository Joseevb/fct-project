interface Success<T> {
	data: T;
	error: null;
}

interface Failure<T> {
	data: null;
	error: T;
}

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
	promise: Promise<T>,
): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (err) {
		return { data: null, error: err as E };
	}
}
