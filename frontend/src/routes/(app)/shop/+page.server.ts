import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { ProductService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async () => {
	try {
		const productPage = await ProductService.fetchPage();

		return {
			products: productPage.webProducts ?? [],
			currentPage: productPage.currentPage,
			totalPages: productPage.totalPages,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				products: [],
				currentPage: 1,
				totalPages: 0,
				error: err.message
			};
		}

		console.error('Failed to fetch items:', err);

		return {
			products: [],
			currentPage: 1,
			totalPages: 0,
			error: 'Failed to load items.'
		};
	}
};
