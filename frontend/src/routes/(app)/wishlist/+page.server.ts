import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { ProductService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async () => {
    try {
        const products = await ProductService.fetch();

        return { products, error: null };
    } catch (err) {
        if (err instanceof ApiError) {
            return {
                products: [],
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
