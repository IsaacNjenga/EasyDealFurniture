import type { Product } from '$lib/services/product/product.types';
import { unitPrice } from '$lib/commerce';
import { toast } from 'svelte-sonner';

type QuoteItem = {
	id: string;
	image: string[];
	name: string;
	slug: string;
	price: number;
	quantity: number;
};
type SavedQuoteItem = Omit<QuoteItem, 'image'> & { image?: unknown };
const KEY = 'easydeal_quote_v1';

function isSavedQuoteItem(item: unknown): item is SavedQuoteItem {
	return (
		typeof item === 'object' &&
		item !== null &&
		'id' in item &&
		typeof item.id === 'string' &&
		'name' in item &&
		typeof item.name === 'string' &&
		'slug' in item &&
		typeof item.slug === 'string' &&
		'price' in item &&
		typeof item.price === 'number' &&
		Number.isFinite(item.price) &&
		item.price >= 0 &&
		'quantity' in item &&
		typeof item.quantity === 'number' &&
		Number.isInteger(item.quantity) &&
		item.quantity > 0 &&
		item.quantity <= 999
	);
}

function normalizeImages(image: unknown): string[] {
	if (typeof image === 'string') return image.trim() ? [image] : [];
	if (!Array.isArray(image)) return [];
	return image.filter((value): value is string => typeof value === 'string' && value.trim() !== '');
}

class Quote {
	items = $state<QuoteItem[]>([]);
	initialized = $state(false);
	init() {
		if (this.initialized || typeof localStorage === 'undefined') return;
		try {
			const saved: unknown = JSON.parse(localStorage.getItem(KEY) || '[]');
			if (Array.isArray(saved))
				this.items = saved.filter(isSavedQuoteItem).map((item) => ({
					id: item.id,
					image: normalizeImages(item.image),
					name: item.name,
					slug: item.slug,
					price: item.price,
					quantity: item.quantity
				}));
		} catch {
			/* Storage may be unavailable or contain an older format. */
		}
		this.initialized = true;
	}
	persist() {
		try {
			localStorage.setItem(KEY, JSON.stringify(this.items));
		} catch {
			/* Keep the current session usable. */
		}
	}
	add(product: Product) {
		this.init();
		const existing = this.items.find((item) => item.id === product._id);
		if (existing) {
			existing.quantity = Math.min(999, existing.quantity + 1);
			existing.price = unitPrice(product);
		} else
			this.items.push({
				id: product._id,
				image: normalizeImages(product.image),
				name: product.name,
				slug: product.slug,
				price: unitPrice(product),
				quantity: 1
			});
		this.persist();
		toast.success('Added to your quote');
	}
	update(id: string, quantity: number) {
		const item = this.items.find((item) => item.id === id);
		if (!item || !Number.isFinite(quantity)) return;
		item.quantity = Math.min(999, Math.max(1, Math.floor(quantity)));
		this.persist();
	}
	remove(id: string) {
		this.items = this.items.filter((item) => item.id !== id);
		this.persist();
	}
	clear() {
		this.items = [];
		this.persist();
	}
	get total() {
		return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
	}
	get count() {
		return this.items.reduce((total, item) => total + item.quantity, 0);
	}
	isAdded(productId: string): boolean {
		return this.items.some((item) => item.id === productId);
	}
}

export const quote = new Quote();
