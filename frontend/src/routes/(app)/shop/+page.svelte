<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import ProductCard from '$lib/components/common/ProductCard.svelte';
	// import Loader from '$lib/components/common/Loader.svelte';
	import { productsData } from '$lib/data/data';
	import type { Product } from '$lib/types/product.types';
	import ProductDetails from '$lib/components/common/ProductDetails.svelte';
	import Modal from '$lib/components/common/Modal.svelte';

	const backgrounds = [
		'https://images.unsplash.com/photo-1758630737900-a28682c5aa69?w=1600',
		'https://images.unsplash.com/photo-1787496994477-e260648f7af4?w=1600',
		'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=1600'
	];

	// Added explicit rawCategory values matching product data structure
	const categories = [
		{
			img: 'https://images.unsplash.com/photo-1705909770198-7e83c24e1616?w=1600',
			title: 'Office Furniture',
			rawCategory: 'Office'
		},
		{
			img: 'https://images.unsplash.com/photo-1632829401795-2745c905ac77?w=1600',
			title: 'Bedroom Furniture',
			rawCategory: 'Bedroom'
		},
		{
			img: 'https://images.unsplash.com/photo-1632583824020-937ae9564495?w=1600',
			title: 'Kitchen Furniture',
			rawCategory: 'Kitchen'
		},
		{
			img: 'https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?w=1600',
			title: 'Outdoor Furniture',
			rawCategory: 'Outdoor'
		},
		{
			img: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=1600',
			title: 'Living Room Furniture',
			rawCategory: 'Living Room'
		},
		{
			img: 'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=1600',
			title: 'Second-Hand Items',
			rawCategory: 'Second-Hand'
		}
	];

	let currentSlide = $state(0);
	let intervalId: ReturnType<typeof setInterval>;

	// Category filter state ('All' default)
	let selectedCategory = $state<string>('All');

	// Reactive filtering using Svelte 5 $derived
	let filteredProducts = $derived(
		selectedCategory === 'All'
			? productsData
			: productsData.filter(
					(p) =>
						p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
						p.category?.toLowerCase().includes(selectedCategory.toLowerCase())
				)
	);

	const toggleCategory = (rawCategory: string) => {
		if (selectedCategory === rawCategory) {
			selectedCategory = 'All'; // Deselect if clicked twice
		} else {
			selectedCategory = rawCategory;
		}
	};

	const nextSlide = () => {
		currentSlide = (currentSlide + 1) % backgrounds.length;
	};

	onMount(() => {
		intervalId = setInterval(nextSlide, 4000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});

	let selectedProduct = $state<Product | null>(null);
	let isDetailModalOpen = $state(false);

	const handleQuickView = (product: Product) => {
		selectedProduct = product;
		isDetailModalOpen = true;
	};
</script>

<svelte:head>
	<title>Shop | EasyDeal Furniture</title>
</svelte:head>

<div class="relative min-h-90 w-full overflow-hidden bg-background sm:min-h-150">
	{#each backgrounds as bgUrl, i (i)}
		{#if currentSlide === i}
			<div
				class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all"
				style="background-image: url({bgUrl});"
				transition:fade={{ duration: 1200, easing: cubicInOut }}
			>
				<div class="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
			</div>
		{/if}
	{/each}

	<div class="relative z-10 mx-auto max-w-full flex-col justify-center">
		<div class="flex max-w-full flex-col items-center justify-center gap-5 text-center">
			<span class="mt-56 text-lg font-bold tracking-widest text-primary uppercase sm:mt-70">
				Shop Now
			</span>
		</div>
	</div>
</div>

<div>
	<section class="py-8">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-8 pb-4">
			<h2 class="text-xl font-bold tracking-tight">Browse Categories</h2>
			{#if selectedCategory !== 'All'}
				<button
					onclick={() => (selectedCategory = 'All')}
					class="text-xs font-semibold text-primary hover:underline"
				>
					Clear Filter ({selectedCategory})
				</button>
			{/if}
		</div>

		<div class="mx-8 grid grid-cols-2 gap-1 px-2 sm:mx-4 sm:grid-cols-3 lg:grid-cols-6 lg:px-10">
			{#each categories as item (item.title)}
				{@const isActive = selectedCategory === item.rawCategory}
				<button
					type="button"
					onclick={() => toggleCategory(item.rawCategory)}
					class="flex flex-col items-center justify-center text-left focus:outline-hidden"
				>
					<!-- Circle Image Container -->
					<div
						class="group relative flex aspect-square w-full max-w-40 items-center justify-center overflow-hidden rounded-md border shadow-md transition-all duration-300 hover:cursor-pointer hover:shadow-xl {isActive
							? 'border-primary ring-1 ring-primary/20'
							: 'border-transparent hover:border-primary/50'}"
					>
						<img
							src={item.img}
							alt={item.title}
							class="h-full w-full object-cover transition-all duration-300 group-hover:scale-110 {isActive
								? 'brightness-85'
								: 'group-hover:blur-xs'}"
						/>

						<!-- Overlay Backdrop + Centered Title -->
						<div
							class="absolute inset-0 flex items-center justify-center p-4 transition-all duration-300 {isActive
								? 'bg-primary/40'
								: 'bg-black/30 group-hover:bg-black/50'}"
						>
							<span
								class="text-center font-sans text-sm font-extrabold tracking-wider text-white uppercase sm:text-base"
							>
								{item.title}
							</span>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</section>
</div>

<!-- <div class="m-auto flex flex-col w-full items-center justify-center">
	<Loader size='lg' speed="normal" />
	<p class='text-primary'>
	Loading...</p>
</div> -->

<div>
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
					<p class="text-lg text-muted-foreground">No products found in "{selectedCategory}".</p>
					<button
						onclick={() => (selectedCategory = 'All')}
						class="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						View All Products
					</button>
				</div>
			{/if}
		</div>
	</section>
</div>

<Modal bind:open={isDetailModalOpen}>
	{#if selectedProduct}
		<div class="no-scrollbar min-h-0 overflow-y-auto">
			<ProductDetails
				product={selectedProduct}
				isOpen={isDetailModalOpen}
				onClose={() => (isDetailModalOpen = false)}
			/>
		</div>
	{/if}
</Modal>
