<script lang="ts">
	import Search from '$lib/components/common/Search.svelte';
	import { productsData as products } from '$lib/data/data';
	import type { Product } from '$lib/services/product/product.types';
	import ProductCard from '$lib/components/common/ProductCard.svelte';
	import ProductDetails from '$lib/components/common/ProductDetails.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import Loader from '$lib/components/common/Loader.svelte';
	// import Separator from '$lib/components/ui/separator/separator.svelte';

	let searchTerm = $state('');

	let isSearching = $state(false);

	let filteredProducts = $derived(
		products.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));
			return matchesSearch;
		})
	);

	let selectedProduct = $state<Product | null>(null);
	let isDetailModalOpen = $state(false);

	const handleQuickView = (product: Product) => {
		selectedProduct = product;
		isDetailModalOpen = true;
	};
</script>

<svelte:head>
	<title>Search | EasyDeal Furniture</title>
</svelte:head>
<div
	class="relative flex min-h-110 w-full items-center justify-center overflow-hidden bg-background pt-20"
>
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('https://images.unsplash.com/photo-1680503397692-cd0da21a0bec?w=1600');"
	>
		<div class="absolute inset-0 bg-black/60 dark:bg-black/75"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
		<Search
			value={searchTerm}
			bind:isLoading={isSearching}
			onChange={(val) => (searchTerm = val)}
		/>
	</div>
</div>

<div class="space-y-4 p-8">
	<div>
		{#if isSearching}
			<div class="align-center flex flex-row items-center justify-center gap-4">
				<Loader size="sm" />
			</div>
		{:else}
			<!-- <Separator class="mb-4" /> -->
			{#if searchTerm}
				<div class="mb-2 text-sm text-muted-foreground">
					Showing results for <b>"{searchTerm}"</b>
				</div>
		
			<section class="px-4 pb-16">
				<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					{#if filteredProducts.length > 0}
						<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{#each filteredProducts as item (item._id)}
								<ProductCard {item} {handleQuickView} />
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center py-16 text-center">
							<p class="text-lg text-muted-foreground">
								No products found in "{searchTerm}".
							</p>
						</div>
					{/if}	
				</div>
			</section>{/if}
		{/if}
	</div>
</div>

<Modal bind:open={isDetailModalOpen}>
	{#if selectedProduct}
		<div>
			<ProductDetails product={selectedProduct} isOpen={isDetailModalOpen} />
		</div>
	{/if}
</Modal>
