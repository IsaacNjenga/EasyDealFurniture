import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { ApiError } from './errors';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const headers = new Headers(options.headers);

	// Simple GETs need no JSON Content-Type (which triggers a CORS preflight).
	if (options.body) headers.set('Content-Type', 'application/json');

	const response = await fetch(`${env.PUBLIC_SERVER_URL}${path}`, {
		...options,
		headers,
		signal: options.signal ?? AbortSignal.timeout(12000)
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

// Public catalogue data only; never cache failures or authenticated responses.
// Store resolved values on the server: Cloudflare must not share in-flight I/O
// between request contexts. Browser requests can safely share the same promise.
const cache = new Map<string, { expires: number; value: unknown }>();
const pending = new Map<string, Promise<unknown>>();
const TTL = 30_000;

export const apiClient = {
	async get<T>(path: string): Promise<T> {
		if (!path.startsWith('/web-product/')) return request<T>(path, { method: 'GET' });
		const key = `${env.PUBLIC_SERVER_URL}${path}`;
		const existing = cache.get(key);
		if (existing && existing.expires > Date.now()) return existing.value as T;
		const inFlight = browser ? pending.get(key) : undefined;
		if (inFlight) return inFlight as Promise<T>;
		const value = request<T>(path, { method: 'GET' })
			.then((data) => {
				if (cache.size >= 100) cache.delete(cache.keys().next().value!);
				cache.set(key, { expires: Date.now() + TTL, value: data });
				return data;
			})
			.finally(() => {
				if (browser) pending.delete(key);
			});
		if (browser) pending.set(key, value);
		return value;
	}
};
