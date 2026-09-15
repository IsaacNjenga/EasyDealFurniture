import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { ProductService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async () => {
	try {
		const bestSellingProducts = ProductService.getBestSelling();
		const newArrivalProducts = ProductService.getNewArrival();

		const [bestSellingData, newArrivalData] = await Promise.all([
			bestSellingProducts,
			newArrivalProducts
		]);

		return {
			bestSellers: bestSellingData,
			freshDesigns: newArrivalData,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				bestSellingProducts: [],
				newArrivalProducts: [],
				error: err.message
			};
		}

		console.error('Failed to fetch items:', err);

		return {
			warehouses: [],
			error: 'Failed to load items.'
		};
	}
};
