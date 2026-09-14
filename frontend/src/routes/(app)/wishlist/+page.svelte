<script lang="ts">
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import { productsData } from '$lib/data/data';
	import ProductCard from '$lib/components/common/ProductCard.svelte';
	import { resolve } from '$app/paths';
	import ProductDetails from '$lib/components/common/ProductDetails.svelte';
	import type { Product } from '$lib/services/product.types';
	import Modal from '$lib/components/common/Modal.svelte';

	// Derive favorited items dynamically
	let favoritedProducts = $derived(
		productsData.filter((product) => wishlist.items.includes(product._id))
	);

	let selectedProduct = $state<Product | null>(null);
	let isDetailModalOpen = $state(false);

	const handleQuickView = (product: Product) => {
		selectedProduct = product;
		isDetailModalOpen = true;
	};
</script>

<svelte:head>
	<title>Wishlist | EasyDeal Furniture</title>
</svelte:head>

<div
	class="relative flex min-h-112 w-full items-center justify-center overflow-hidden bg-background pt-20"
>
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('https://images.unsplash.com/photo-1762731411174-c32be7811ab3?w=1600');"
	>
		<div class="absolute inset-0 bg-black/60 dark:bg-black/75"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
		<p class="text-lg font-extrabold tracking-widest text-primary uppercase">
			Your Saved Favorites
		</p>
	</div>
</div>

<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	{#if favoritedProducts.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each favoritedProducts as item (item._id)}
				<ProductCard {item} {handleQuickView} />
			{/each}
		</div>
	{:else}
		<div class="py-16 text-center">
			<p class="text-muted-foreground">You haven't added any products to your wishlist yet.</p>
			<a
				href={resolve('/shop')}
				class="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
			>
				Browse The Shop
			</a>
		</div>
	{/if}
</div>

<Modal bind:open={isDetailModalOpen}>
	{#if selectedProduct}
		<div class="no-scrollbar min-h-0 overflow-y-auto">
			<ProductDetails product={selectedProduct} isOpen={isDetailModalOpen} />
		</div>
	{/if}
</Modal>
