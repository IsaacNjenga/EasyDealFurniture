import { apiClient } from '$lib/services/api/client';
import type { Product, ProductListResponse } from './product.types';

export const ProductService = {
	async fetch(): Promise<Product[]> {
		const response = await apiClient.get<ProductListResponse>('/web-product/get-web-products');
		return response.webProducts ?? [];
	},

	async get(id: string): Promise<Product> {
		return await apiClient.get<Product>(`/web-product/get-web-product/${id}`);
	},

	async getBestSelling(): Promise<Product[]> {
		return await apiClient.get<Product[]>('/web-product/get-best-selling-product');
	},

	async getNewArrival(): Promise<Product[]> {
		return await apiClient.get<Product[]>('/web-product/get-new-arrival-product');
	}
};
