import { apiClient } from '$lib/services/api/client';
import type {
	Product,
	ProductListResponse,
	SlugProductResponse,
	AllProductsResponse
} from './product.types';

export const ProductService = {
	async fetch(): Promise<Product[]> {
		const response = await apiClient.get<ProductListResponse>('/catalog/get-catalog-products');
		return response.catalog ?? [];
	},

	async fetchAll(): Promise<Product[]> {
		const response = await apiClient.get<AllProductsResponse>('/catalog/get-all-catalog-products');
		return response.catalog ?? [];
	},

	async fetchPage(page = 1, limit = 10): Promise<ProductListResponse> {
		const params = new URLSearchParams({ page: String(page), limit: String(limit) });
		return await apiClient.get<ProductListResponse>(
			`/catalog/get-catalog-products?${params.toString()}`
		);
	},

	async get(id: string): Promise<Product> {
		return await apiClient.get<Product>(`/catalog/get-catalog-product-by-id/${id}`);
	},

	async getBySlug(slug: string): Promise<SlugProductResponse> {
		return await apiClient.get<SlugProductResponse>(
			`/catalog/get-catalog-product/${encodeURIComponent(slug)}`
		);
	},

	async search(query: string): Promise<Product[]> {
		return await apiClient.get<Product[]>(`/catalog/search?query=${encodeURIComponent(query)}`);
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
		return await apiClient.get<Product[]>('/catalog/get-best-selling-product');
	},

	async getNewArrival(): Promise<Product[]> {
		return await apiClient.get<Product[]>('/catalog/get-new-arrival-product');
	}
};
