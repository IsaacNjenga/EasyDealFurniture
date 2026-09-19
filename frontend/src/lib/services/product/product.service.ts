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

	async search(query: string): Promise<Product[]> {
		return await apiClient.get<Product[]>(`/web-product/search?query=${encodeURIComponent(query)}`);
	},
	async getRelated(product: Product): Promise<Product[]> {
		const queryParts = [product.category, ...(product.tags ?? []).slice(0, 2)].filter(Boolean);
		const results = await this.search(queryParts.join(' '));

		return results
			.filter((item) => item._id !== product._id)
			.map((item) => ({
				item,
				score:
					(item.category && product.category && item.category === product.category ? 2 : 0) +
					(item.tags ?? []).filter((tag) => (product.tags ?? []).includes(tag)).length
			}))
			.sort((a, b) => b.score - a.score)
			.slice(0, 4)
			.map(({ item }) => item);
	},
	async getBestSelling(): Promise<Product[]> {
		return await apiClient.get<Product[]>('/web-product/get-best-selling-product');
	},

	async getNewArrival(): Promise<Product[]> {
		return await apiClient.get<Product[]>('/web-product/get-new-arrival-product');
	}
};
