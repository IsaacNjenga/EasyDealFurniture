import { toast } from 'svelte-sonner';

export class ActionStore {
	/**
	 * Handles toast feedback when toggling a product in the wishlist.
	 * @param isWishlisted Current state after toggle
	 */
	async handleWishlistToggle(isWishlisted: boolean) {
		if (isWishlisted) {
			toast.success('Saved!', { description: `Added to your wishlist.` });
		} else {
			toast.info(`Removed from wishlist.`);
		}
	}

	/**
	 * Handles toast feedback when toggling cart status.
	 * @param isCarted Current state after toggle
	 */
	async handleAddToCartToggle(isCarted: boolean) {
		if (isCarted) {
			toast.success(`Added to your cart.`);
		} else {
			toast.info(`Removed from cart.`);
		}
	}
}

// Export a single singleton instance for app-wide use
export const actionStore = new ActionStore();
