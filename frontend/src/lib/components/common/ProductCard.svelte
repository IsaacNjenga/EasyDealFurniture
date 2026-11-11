<script lang="ts">
	import { quote } from '$lib/stores/quote.svelte';
	import { unitPrice } from '$lib/commerce';
	import { fade } from 'svelte/transition';
	import { formatPrice } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		Heart,
		// ShoppingCart,
		ChevronLeft,
		ChevronRight
	} from '@lucide/svelte';
	import type { Product } from '$lib/services/product/product.types';
	// import { actionStore } from '$lib/stores/actions.svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte';

	type Props = {
		item: Product;
		// handleQuickView?: (product: Product) => void;
	};

	let {
		item
		// handleQuickView
	}: Props = $props();

	// Svelte 5 Local Reactive State initialized from props
	// let isWishlisted = $state(false);
	// let isCarted = $state(false);
	let activeImgIndex = $state(0);
	let isCarouselPaused = $state(false);

	const isLiked = $derived(wishlist.isFavorited(item._id));
	const isInQuote = $derived(quote.isAdded(item._id));

	const images = $derived(Array.isArray(item.image) ? item.image : [item.image]);
	const hasMultipleImages = $derived(images.length > 1);
	const hasDiscount = $derived(item.discount > 0);
	const discountedPrice = $derived(unitPrice(item));

	const advanceImage = () => {
		if (images.length > 1) {
			activeImgIndex = (activeImgIndex + 1) % images.length;
		}
	};

	const nextImage = (e: MouseEvent) => {
		e.stopPropagation();
		advanceImage();
	};

	const prevImage = (e: MouseEvent) => {
		e.stopPropagation();
		activeImgIndex = (activeImgIndex - 1 + images.length) % images.length;
	};

	// async function toggleWishlist() {
	// 	isWishlisted = !isWishlisted;
	// 	await actionStore.handleWishlistToggle(isWishlisted);
	// }

	// async function toggleCart() {
	// 	isCarted = !isCarted;
	// 	await actionStore.handleAddToCartToggle(isCarted);
	// }

	// const handleQuickViewClick = () => {
	// 	handleQuickView?.(item);
	// };
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-none border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xs"
>
	<!-- Product Image & Carousel Area -->
	<div
		class="relative aspect-4/4 w-full overflow-hidden bg-muted"
		role="group"
		aria-label={`${item.name} image carousel`}
		onmouseenter={() => (isCarouselPaused = true)}
		onmouseleave={() => (isCarouselPaused = false)}
		onfocusin={() => (isCarouselPaused = true)}
		onfocusout={() => (isCarouselPaused = false)}
	>
		{#key images[activeImgIndex]}
			<img
				src={images[activeImgIndex]}
				alt={item.name}
				loading="lazy"
				decoding="async"
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
				transition:fade={{ duration: 450 }}
			/>
		{/key}

		<!-- Image Carousel Navigation Controls -->
		{#if hasMultipleImages}
			<div
				class="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100 max-sm:opacity-100"
			>
				<button
					type="button"
					onclick={prevImage}
					aria-label="Previous image"
					class="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-xs hover:bg-black"
				>
					<ChevronLeft class="h-4 w-4" />
				</button>
				<button
					type="button"
					onclick={nextImage}
					aria-label="Next image"
					class="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-xs hover:bg-black"
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>

			<!-- Dots Indicator -->
			<div class="absolute inset-x-0 bottom-2 flex justify-center gap-1">
				{#each images as image, i (image)}
					<span
						class="h-1.5 rounded-full transition-all {i === activeImgIndex
							? 'w-4 bg-primary'
							: 'w-1.5 bg-white/60'}"
					></span>
				{/each}
			</div>
		{/if}

		<!-- Discount Badge (Top Left) -->
		{#if hasDiscount}
			<span
				class="absolute top-3 left-3 z-10 rounded-md bg-primary px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-primary-foreground uppercase shadow-md"
			>
				{item.discount}% OFF
			</span>
		{/if}

		<!-- Action Overlay Icons (Top Right Stack) -->
		<div class="absolute top-3 right-3 z-10 flex flex-col gap-2">
			<button
				type="button"
				// onclick={toggleWishlist}
				onclick={() => wishlist.toggleFavorite(item._id)}
				aria-label={isLiked ? `Remove ${item.name} from wishlist` : `Save ${item.name} to wishlist`}
				aria-pressed={isLiked}
				class="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md backdrop-blur-xs transition-all hover:bg-card hover:text-red-500"
			>
				<Heart
					class="h-4 w-4 transition-colors {isLiked ? 'fill-red-500 text-red-500' : 'stroke-[2.2]'}"
				/>
			</button>

			<!-- <button
				type="button"
				onclick={toggleCart}
				aria-label="Add to cart"
				class="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md backdrop-blur-xs transition-all hover:bg-card hover:text-amber-500"
			>
				<ShoppingCart
					class="h-4 w-4 transition-colors {isCarted
						? 'fill-amber-500 text-amber-500'
						: 'stroke-1.5'}"
				/>
			</button> -->
		</div>
	</div>

	<!-- Card Body -->
	<div class="flex flex-1 flex-col justify-between p-3">
		<div>
			<h3
				class="line-clamp-1 font-roboto text-base font-bold text-foreground capitalize transition-colors group-hover:text-primary"
			>
				{item.name}
			</h3>

			<!-- Pricing Section -->
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-lg font-extrabold text-primary">
					{formatPrice(discountedPrice)}
				</span>
				{#if hasDiscount}
					<span class="text-sm font-medium text-muted-foreground line-through">
						{formatPrice(item.price)}
					</span>
				{/if}
			</div>
		</div>

		<!-- Transparent Action Button -->
		<div class="mt-4 space-y-2">
			<Button
				variant="outline"
				// onclick={handleQuickViewClick}
				href={`/shop/${item.slug}`}
				class="w-full rounded-none border-border bg-transparent font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
			>
				View details
			</Button>
			<Button onclick={() => quote.add(item)} class="w-full rounded-none font-semibold">
				{isInQuote ? 'Added to quote' : 'Add to quote'}
			</Button>
		</div>
	</div>
</div>
