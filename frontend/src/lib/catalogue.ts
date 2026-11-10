import type { Product } from '$lib/services/product/product.types';
import { categoryName, unitPrice } from '$lib/commerce';

export type Filters = {
	category: string;
	colour: string;
	query: string;
	minPrice?: number;
	maxPrice?: number;
	availability: string;
};
export function matchesProduct(product: Product, filters: Filters, omit = '') {
	const { category, colour, query, minPrice, maxPrice, availability } = filters;
	const price = unitPrice(product);
	const searchable = [product.name, product.category, ...(product.tags ?? [])]
		.join(' ')
		.toLowerCase();
	return (
		(!query.trim() || searchable.includes(query.trim().toLowerCase())) &&
		(omit === 'category' || category === 'All' || categoryName(product.category) === category) &&
		(omit === 'colour' ||
			colour === 'All' ||
			(product.colours ?? []).some((c) => c.toLowerCase() === colour)) &&
		(minPrice == null || price >= minPrice) &&
		(maxPrice == null || price <= maxPrice) &&
		(availability !== 'stock' || product.inStock === true)
	);
}
