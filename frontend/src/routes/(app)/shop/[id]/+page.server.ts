import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { ProductService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		const product = await ProductService.get(id);

		return {
			product,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading product: ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
