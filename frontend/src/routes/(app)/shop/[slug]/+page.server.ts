import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { ProductService } from '$lib/services/product/product.service';
import type { Product } from '$lib/services/product/product.types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	let product: Product;

	try {
		product = /^[a-f\d]{24}$/i.test(slug)
			? await ProductService.get(slug)
			: await ProductService.getBySlug(slug);
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading product: ${slug}:`, err);
		error(500, 'Server is currently unreachable');
	}

	if (product.slug !== slug) {
		redirect(308, `/shop/${product.slug}`);
	}

	return {
		product,
		error: null
	};
};
