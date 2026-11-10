import type { PageServerLoad } from './$types';
import { ProductService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async () => {
	try {
		// Fetch metadata once so every filter covers the entire catalogue. Render images in batches.
		return { products: await ProductService.fetchAll(), error: null };
	} catch (err) {
		console.error('Failed to fetch catalogue:', err);
		return { products: [], error: 'The collection is temporarily unavailable.' };
	}
};
