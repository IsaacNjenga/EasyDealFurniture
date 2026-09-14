import { apiClient } from '$lib/services/api/client';
import type { Product, ProductListResponse } from './product.types';

export const ProductService = {
    async fetch(): Promise<Product[]> {
        const response = await apiClient.get<ProductListResponse>('/web-product/get-web-products');
        return response.webProducts ?? [];
    },

};
