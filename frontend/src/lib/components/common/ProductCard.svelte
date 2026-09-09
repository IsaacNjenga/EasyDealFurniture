<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { formatPrice } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from '@lucide/svelte';

	export type Product = {
		id?: string;
		img: string | string[]; // Accepts a single URL string or an array of image URLs
		name: string;
		price: number;
		discount: number;
		category?: string;
		description?: string;
		dimensions?: string;
		material?: string;
		inStock?: boolean;
	};

	type Props = {
		item: Product;
		isWishlisted?: boolean;
		isCarted?: boolean;
		onToggleAddToCart?: (product: Product, state: boolean) => void;
		handleQuickView?: (product: Product) => void;
		onToggleWishlist?: (product: Product, state: boolean) => void;
	};

	let {
		item,
		isWishlisted = false,
		isCarted = false,
		handleQuickView,
		onToggleWishlist,
		onToggleAddToCart
	}: Props = $props();

	// Svelte 5 Local Reactive State initialized from props
	let inWishlist = $state(false);
	let inCart = $state(false);
	let activeImgIndex = $state(0);
	let isCarouselPaused = $state(false);

	$effect(() => {
		inWishlist = isWishlisted;
		inCart = isCarted;
	});

	const images = $derived(Array.isArray(item.img) ? item.img : [item.img]);
	const hasMultipleImages = $derived(images.length > 1);
	const hasDiscount = $derived(item.discount > 0);
	const discountedPrice = $derived(
		hasDiscount ? item.price * (1 - item.discount / 100) : item.price
	);

	const advanceImage = () => {
		if (images.length > 1) {
			activeImgIndex = (activeImgIndex + 1) % images.length;
		}
	};

	let intervalId: ReturnType<typeof setInterval>;

	onMount(() => {
		intervalId = setInterval(() => {
			if (!isCarouselPaused) advanceImage();
		}, 4500);
	});

	onDestroy(() => clearInterval(intervalId));

	const nextImage = (e: MouseEvent) => {
		e.stopPropagation();
		advanceImage();
	};

	const prevImage = (e: MouseEvent) => {
		e.stopPropagation();
		activeImgIndex = (activeImgIndex - 1 + images.length) % images.length;
	};

	const handleWishlistClick = (e: MouseEvent) => {
		e.stopPropagation();
		inWishlist = !inWishlist;
		onToggleWishlist?.(item, inWishlist);
	};

	const handleAddToCartClick = (e: MouseEvent) => {
		e.stopPropagation();
		inCart = !inCart;
		onToggleAddToCart?.(item, inCart);
	};

	const handleQuickViewClick = () => {
		handleQuickView?.(item);
	};
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-md border border-slate-200/80 bg-card shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-xl dark:border-slate-800"
>
	<!-- Product Image & Carousel Area -->
	<div
		class="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-900"
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
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
				transition:fade={{ duration: 450 }}
			/>
		{/key}

		<!-- Image Carousel Navigation Controls -->
		{#if hasMultipleImages}
			<div
				class="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			>
				<button
					type="button"
					onclick={prevImage}
					aria-label="Previous image"
					class="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black"
				>
					<ChevronLeft class="h-4 w-4" />
				</button>
				<button
					type="button"
					onclick={nextImage}
					aria-label="Next image"
					class="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black"
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
				class="absolute top-3 left-3 z-10 rounded-full bg-primary px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-primary-foreground uppercase shadow-md"
			>
				{item.discount}% OFF
			</span>
		{/if}

		<!-- Action Overlay Icons (Top Right Stack) -->
		<div class="absolute top-3 right-3 z-10 flex flex-col gap-2">
			<button
				type="button"
				onclick={handleWishlistClick}
				aria-label="Add to wishlist"
				class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:text-red-500 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-red-500"
			>
				<Heart
					class="h-4 w-4 transition-colors {inWishlist
						? 'fill-red-500 text-red-500'
						: 'stroke-[2.2]'}"
				/>
			</button>

			<button
				type="button"
				onclick={handleAddToCartClick}
				aria-label="Add to cart"
				class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:text-amber-500 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-amber-500"
			>
				<ShoppingCart
					class="h-4 w-4 transition-colors {inCart
						? 'fill-amber-500 text-amber-500'
						: 'stroke-1.5'}"
				/>
			</button>
		</div>
	</div>

	<!-- Card Body -->
	<div class="flex flex-1 flex-col justify-between p-5">
		<div>
			<h3
				class="line-clamp-1 font-roboto text-base font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100"
			>
				{item.name}
			</h3>

			<!-- Pricing Section -->
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-lg font-extrabold text-slate-900 dark:text-slate-100">
					{formatPrice(discountedPrice)}
				</span>
				{#if hasDiscount}
					<span class="text-sm font-medium text-slate-400 line-through">
						{formatPrice(item.price)}
					</span>
				{/if}
			</div>
		</div>

		<!-- Transparent Action Button -->
		<div class="mt-4">
			<Button
				variant="outline"
				onclick={handleQuickViewClick}
				class="w-full rounded-md border-slate-300 font-semibold text-slate-900 transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground dark:border-slate-700 dark:text-slate-100 dark:hover:bg-primary dark:hover:text-primary-foreground"
			>
				View
			</Button>
		</div>
	</div>
</div>
