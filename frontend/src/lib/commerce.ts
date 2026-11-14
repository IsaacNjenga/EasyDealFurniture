import type { Product } from '$lib/services/product/product.types';

// Existing contact form destination, shared by all enquiry flows.
export const SALES_WHATSAPP = '254740900061';
export const unitPrice = (product: Pick<Product, 'pricing' | 'discount'>) =>
	Math.round(
		Math.max(0, product.pricing.basePrice) * (1 - Math.min(100, Math.max(0, product.discount || 0)) / 100)
	);

export function categoryName(value = '') {
	return (
		value
			.trim()
			.replace(/\s+furniture$/i, '')
			.replace(/^second[ -]hand(?: items)?$/i, 'Second-hand') || 'Other'
	);
}
