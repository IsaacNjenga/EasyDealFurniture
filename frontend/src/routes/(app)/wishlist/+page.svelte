<script lang="ts">
	import hero from '$lib/assets/images/image_5.webp';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import ProductCard from '$lib/components/common/ProductCard.svelte';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const products = $derived(data.products ?? []);
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load items', { description: error });
		}
	});

	let favoritedProducts = $derived(
		products.filter((product) => wishlist.items.includes(product._id))
	);
</script>

<svelte:head>
	<title>Wishlist</title>
	<meta
		name="description"
		content="Review your saved EasyDeal Furniture favorites and continue browsing furniture in Nairobi."
	/>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div
	class="relative flex min-h-128 w-full items-center justify-center overflow-hidden bg-background pt-20"
>
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url({hero});"
	>
		<div class="absolute inset-0 bg-black/40 dark:bg-black/45"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
		<h1 class="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
			Good taste deserves a shortlist.
		</h1>
		<p class="mt-5 text-lg text-white/80">
			Keep the pieces you love in one place, plan your next space.
		</p>
	</div>
</div>

<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	{#if favoritedProducts.length > 0}
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each favoritedProducts as item (item._id)}
				<ProductCard {item} />
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
