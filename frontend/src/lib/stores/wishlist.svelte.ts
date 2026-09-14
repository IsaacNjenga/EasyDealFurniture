import { getCookie, setCookie } from './cookies';
import { toast } from 'svelte-sonner';

const WISHLIST_COOKIE = 'easydeal_wishlist';

// Helper to load array from cookie
function loadWishlistFromCookie(): string[] {
	const raw = getCookie(WISHLIST_COOKIE);
	if (!raw) return [];
	try {
		return JSON.parse(raw);
	} catch {
		return [];
	}
}

class WishlistState {
	// Array of favorited Product IDs
	items = $state<string[]>([]);
	initialized = $state(false);

	constructor() {
		// Initialize on client mount
		if (typeof window !== 'undefined') {
			this.items = loadWishlistFromCookie();
			this.initialized = true;
		}
	}

	toggleFavorite(productId: string) {
		if (this.items.includes(productId)) {
			this.items = this.items.filter((id) => id !== productId);
			toast.info(`Removed from wishlist.`);
		} else {
			this.items = [...this.items, productId];
			toast.success('Saved!', { description: `Added to your wishlist.` });
		}
		// Save stringified IDs to cookie
		setCookie(WISHLIST_COOKIE, JSON.stringify(this.items), 30);
	}

	isFavorited(productId: string): boolean {
		return this.items.includes(productId);
	}
}

export const wishlist = new WishlistState();
