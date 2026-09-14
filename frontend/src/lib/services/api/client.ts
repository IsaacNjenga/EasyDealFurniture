import { env } from '$env/dynamic/public';
import { ApiError } from './errors';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const headers = new Headers(options.headers);

	headers.set('Content-Type', 'application/json');

	const response = await fetch(`${env.PUBLIC_SERVER_URL}${path}`, {
		...options,
		headers
	});

	let data: unknown = null;

	try {
		data = await response.json();
	} catch {
		// Response has no JSON body
	}

	if (!response.ok) {
		const message =
			typeof data === 'object' &&
			data !== null &&
			'message' in data &&
			typeof data.message === 'string'
				? data.message
				: 'An unexpected API error occurred.';

		throw new ApiError(response.status, message, data);
	}

	if (typeof data === 'object' && data !== null && 'data' in data) {
		return data.data as T;
	}

	return data as T;
}

export const apiClient = {
	get<T>(path: string) {
		return request<T>(path, {
			method: 'GET'
		});
	}
};
