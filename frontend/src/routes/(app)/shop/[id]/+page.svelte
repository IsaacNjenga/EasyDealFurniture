<script lang="ts">
	import type { PageProps } from './$types';
	import type { Product } from '$lib/services/product/product.types';
	import { formatPrice } from '$lib/utils';
	import { Tag, ChevronLeft, ChevronRight, Heart } from '@lucide/svelte';
	import ChatButton from '$lib/components/common/ChatButton.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import ProductCard from '$lib/components/common/ProductCard.svelte';
	import { ApiError } from '$lib/services/api/errors';
	import { ProductService } from '$lib/services/product/product.service';
	import { Button } from '$lib/components/ui/button';
	import { wishlist } from '$lib/stores/wishlist.svelte';

	let { data }: PageProps = $props();

	let product = $derived(data.product);
	let error = $derived(data.error);

	let selectedImgIndex = $state(0);
	let relatedProducts = $state<Product[]>([]);
	let isLoadingRelated = $state(false);
	let relatedQueryId = 0;

	const isLiked = $derived(wishlist.isFavorited(product._id));

	const images = $derived(
		product ? (Array.isArray(product.image) ? product.image : [product.image]) : []
	);
	const hasDiscount = $derived(product ? product.discount > 0 : false);
	const discountedPrice = $derived(
		product && hasDiscount ? product.price * (1 - product.discount / 100) : (product?.price ?? 0)
	);

	$effect(() => {
		if (error) {
			toast.error('Failed to load item', { description: error });
		}
	});

	$effect(() => {
		if (product) {
			selectedImgIndex = 0;
			loadRelatedProducts(product);
		}
	});

	async function loadRelatedProducts(currentProduct: Product) {
		const queryId = ++relatedQueryId;
		isLoadingRelated = true;

		try {
			const results = await ProductService.getRelated(currentProduct);
			if (queryId === relatedQueryId) relatedProducts = results;
		} catch (err) {
			if (queryId !== relatedQueryId) return;
			relatedProducts = [];
			if (!(err instanceof ApiError)) console.error('Failed to fetch related items:', err);
		} finally {
			if (queryId === relatedQueryId) isLoadingRelated = false;
		}
	}
</script>

<svelte:head>
	{#if product}
		<title>{product.name} | EasyDeal Furniture</title>
		<meta
			name="description"
			content={product.description || `Buy ${product.name} at EasyDeal Furniture.`}
		/>
		<meta property="og:title" content={product.name} />
		<meta
			property="og:description"
			content={product.description || `Buy ${product.name} at EasyDeal Furniture.`}
		/>
		{#if images.length > 0}
			<meta property="og:image" content={images[0]} />
		{/if}
	{:else}
		<title>Product Details | EasyDeal Furniture</title>
	{/if}
</svelte:head>

<main class="container mx-auto max-w-6xl px-4 py-6 sm:py-10">
	<div class="relative min-h-20 w-full overflow-hidden bg-background sm:min-h-20"></div>

	{#if product}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
			<!-- Media Section -->
			<div class="flex h-full min-w-0 flex-col gap-4">
				<div
					class="group relative aspect-4/3 w-full overflow-hidden rounded-none bg-muted shadow-inner md:aspect-square"
				>
					<img
						src={images[selectedImgIndex]}
						alt={product.name}
						class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
					/>
					{#if hasDiscount}
						<span
							class="absolute top-4 left-4 rounded-md bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground uppercase shadow-md"
						>
							{product.discount}% OFF
						</span>
					{/if}

					{#if images.length > 1}
						<button
							type="button"
							onclick={() =>
								(selectedImgIndex = (selectedImgIndex - 1 + images.length) % images.length)}
							aria-label="Previous product image"
							class="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white"
						>
							<ChevronLeft class="size-5" />
						</button>
						<button
							type="button"
							onclick={() => (selectedImgIndex = (selectedImgIndex + 1) % images.length)}
							aria-label="Next product image"
							class="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white"
						>
							<ChevronRight class="size-5" />
						</button>
					{/if}
				</div>

				{#if images.length > 1}
					<div class="flex gap-3 overflow-x-auto pb-1" aria-label="Product images">
						{#each images as img, i (img)}
							<button
								type="button"
								onclick={() => (selectedImgIndex = i)}
								aria-label={`Show image ${i + 1}`}
								class="size-16 shrink-0 overflow-hidden rounded-md border-2 transition-all {selectedImgIndex ===
								i
									? 'border-primary ring-2 ring-primary/20'
									: 'border-transparent opacity-60 hover:opacity-100'}"
							>
								<img src={img} alt="" class="h-full w-full object-cover" />
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Product Information Section -->
			<div class="flex min-w-0 flex-col justify-between">
				<div class="space-y-4">
					<div>
						<span class="text-xs font-bold tracking-widest text-primary uppercase">
							{product.category || 'Furniture'}
						</span>
						<h1
							class="mt-1 font-roboto text-2xl font-extrabold text-foreground capitalize sm:text-3xl lg:text-4xl"
						>
							{product.name}
						</h1>
					</div>

					<!-- Pricing -->
					<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
						<span class="text-4xl font-black text-primary sm:text-4xl">
							{formatPrice(discountedPrice)}
						</span>
						{#if hasDiscount}
							<span class="text-lg text-red-400 line-through">
								{formatPrice(product.price)}
							</span>
						{/if}
					</div>

					<!-- Description -->
					<p class="text-justify text-base leading-relaxed text-muted-foreground">
						{product.description ||
							'Elevate your living space with this expertly crafted piece from EasyDeal Furniture. Modern design meets durable ergonomics.'}
					</p>

					<!-- Key features -->
					{#if product.keyFeatures && product.keyFeatures.length > 0}
						<p class="mb-0 pb-0 text-base leading-relaxed text-primary">Key Features</p>
						<ul class="list-disc pl-4 text-base leading-relaxed text-muted-foreground">
							{#each product.keyFeatures as feature (feature)}
								<li>{feature}</li>
							{/each}
						</ul>
					{/if}

					<!-- Colors -->
					{#if product.colours && product.colours.length > 0}
						<div class="space-y-2">
							<p class="text-base leading-relaxed text-primary">Available Colours</p>

							<div class="flex flex-wrap items-center gap-2">
								{#each product.colours as colour (colour)}
									<div
										class="group relative flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
									>
										<!-- Visual Swatch Dot -->
										<span
											class="size-4 rounded-lg border border-black/10 shadow-sm transition-transform group-hover:scale-110 dark:border-white/20"
											style="background-color: {colour.toLowerCase().replace(/\s+/g, '')};"
										></span>

										<!-- Colour Name Label -->
										<span class="capitalize">{colour}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Tags -->
					{#if product.tags && product.tags.length > 0}
						<div class="flex flex-wrap items-center gap-2">
							<!-- <Tag class="size-4 text-primary" /> -->
							<p class="text-base leading-relaxed text-primary">Tags</p>
							<div class="flex flex-wrap items-center gap-1.5">
								{#each product.tags as tag (tag)}
									<Badge
										variant="outline"
										class="cursor-pointer whitespace-nowrap"
										onclick={() => goto(resolve(`/search?query=${tag}`))}
									>
										<Tag class="size-3 text-foreground" />
										{tag}
									</Badge>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<!-- <div class="mt-2 flex items-end justify-end border-t border-border pt-4"> -->
				<div class="mt-2 flex w-full flex-col items-center gap-2 pt-4 sm:flex-row">
					<ChatButton
						phoneNumber="254714738997"
						message={`Hi EasyDeal Furniture, I'm interested in buying "${product.name}". Is it available?`}
						label="Inquire via WhatsApp"
					/>

					<Button
						variant="outline"
						onclick={() => wishlist.toggleFavorite(product._id)}
						class="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-primary px-3 py-2 text-sm font-semibold transition-all active:scale-95 sm:w-auto sm:flex-1"
					>
						<Heart
							class="h-4 w-4 transition-colors {isLiked
								? 'fill-red-500 text-red-500'
								: 'stroke-[2.2] text-primary'}"
						/>
						<span class="text-primary">
							{isLiked ? 'Added to Wishlist' : 'Add to Wishlist'}
						</span>
					</Button>
				</div>
			</div>
		</div>

		{#if isLoadingRelated || relatedProducts.length > 0}
			<section class="mt-8 border-t border-border pt-10" aria-labelledby="related-items-heading">
				<div class="flex items-end justify-between gap-4">
					<div>
						<p class="text-xs font-bold tracking-widest text-primary uppercase">Keep browsing</p>
						<h2 id="related-items-heading" class="mt-1 text-2xl font-extrabold text-foreground">
							More related items
						</h2>
					</div>
				</div>

				{#if isLoadingRelated}
					<div
						class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4"
						aria-label="Loading related items"
					>
						<!-- eslint-disable-next-line -->
						{#each Array(4) as _}
							<div class="aspect-4/3 animate-pulse bg-muted motion-reduce:animate-none"></div>
						{/each}
					</div>
				{:else if relatedProducts.length > 0}
					<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{#each relatedProducts as item (item._id)}
							<ProductCard {item} />
						{/each}
					</div>
				{/if}
			</section>
		{/if}
	{:else if !error}
		<div class="flex min-h-100 flex-col items-center justify-center text-center">
			<p class="text-lg font-medium text-muted-foreground">Loading product details...</p>
		</div>
	{/if}
</main>
