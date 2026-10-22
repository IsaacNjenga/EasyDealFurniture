import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { ProductService } from '$lib/services/product/product.service';
import type { Product } from '$lib/services/product/product.types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	let product: Product;

	try {
		product = (await ProductService.getBySlug(slug)) as unknown as Product;
	} catch (err) {
		if (err instanceof ApiError) {
			console.error('Product API error:', {
				requestedSlug: slug,
				status: err.status,
				message: err.message
			});

			error(err.status, err.message);
		}

		console.error(`Unexpected error loading product "${slug}":`, err);
		error(500, 'Server is currently unreachable');
	}

	if (product.slug && product.slug !== slug) {
		redirect(308, `/shop/${product.slug}`);
	}

	return { product };
};