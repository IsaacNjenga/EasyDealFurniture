<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import ProductCard from '$lib/components/common/ProductCard.svelte';
	import type { Product } from '$lib/types/product.types';
	import ProductDetails from '$lib/components/common/ProductDetails.svelte';
	// import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Modal from '$lib/components/common/Modal.svelte';
	import { toast } from 'svelte-sonner';
	import {
		bestSellingProducts as bestSellers,
		freshDesignProducts as freshDesigns
	} from '$lib/data/data';

	const backgrounds = [
		'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600',
		'https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?w=1600',
		'https://images.unsplash.com/photo-1688578735352-9a6f2ac3b70a?w=1600',
		'https://images.unsplash.com/photo-1681418659069-eef28d44aeab?w=1600'
	];
	const featuredCollection = [
		{
			img: 'https://images.unsplash.com/photo-1693578616322-c8abe6c7393d?w=1600',
			title: 'Modern Living'
		},
		{
			img: 'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?w=1600',
			title: 'Office Elegance'
		},
		{
			img: 'https://images.unsplash.com/photo-1600210492090-a159ffa3aeaf?w=1600',
			title: 'Outdoor Comfort'
		},
		{
			img: 'https://plus.unsplash.com/premium_photo-1688125414593-391cf90f3103?w=1600',
			title: 'Classic Touch'
		}
	];

	let currentSlide = $state(0);
	let intervalId: ReturnType<typeof setInterval>;
	let isDetailModalOpen = $state(false);

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

	const handleQuickView = (product: Product) => {
		selectedProduct = product;
		isDetailModalOpen = true;
	};

	const handleWishlistToggle = (product: Product, isWishlisted: boolean) => {
		if (isWishlisted) {
			toast.success(`Added to your wishlist.`);
		} else {
			toast.error(`Removed from wishlist.`);
		}
	};

	const handleAddToCartToggle = (product: Product, isCarted: boolean) => {
		if (isCarted) {
			toast.success(`Added to your cart.`);
		} else {
			toast.error(`Removed from cart.`);
		}
	};
</script>

<svelte:head>
	<title>Home | EasyDeal Furniture</title>
</svelte:head>
<div class="relative min-h-screen w-full overflow-hidden bg-background">
	<!-- Carousel Background Images -->
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

	<!-- Both Content Sections Displayed Simultaneously -->
	<div
		class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 px-5 pt-32 pb-16 sm:px-6 sm:pt-40 lg:px-8"
	>
		<!-- Section 1: Top Left -->
		<div class="flex max-w-xl flex-col gap-3 self-start text-white">
			<p class="text-md font-bold tracking-widest text-primary uppercase">
				MINIMAL MEETS FUNCTIONAL
			</p>
			<h1 class="font-roboto text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl">
				Modern Furniture for Every Space
			</h1>
			<p class="text-base text-slate-100 md:text-lg">
				Discover curated pieces that blend artistry, emotion, and everyday comfort.
			</p>
			<div>
				<Button
					class="rounded-md bg-black px-6 py-5 text-sm font-medium text-white shadow-lg hover:bg-slate-900"
					href={resolve('/shop')}
				>
					Explore <ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>

		<!-- Section 2: Bottom Right -->
		<div
			class="flex max-w-xl flex-col items-start gap-3 self-start text-left text-white sm:items-end sm:self-end sm:text-right"
		>
			<p class="text-md font-bold tracking-widest text-primary uppercase">TIMELESS ELEGANCE</p>
			<h1 class="font-roboto text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl">
				Redefine Comfort and Luxury
			</h1>
			<p class="text-base text-slate-100 md:text-lg">
				Thoughtfully designed pieces that evoke sophistication and emotional depth.
			</p>
			<div>
				<Button
					class="rounded-md bg-black px-6 py-5 text-sm font-medium text-white shadow-lg hover:bg-slate-900"
					href={resolve('/shop')}
				>
					Shop the Collection
				</Button>
			</div>
		</div>
	</div>
</div>

<div>
	<section class="py-12">
		<div class="mx-auto max-w-7xl px-4 text-center">
			<!-- Section Headers -->
			<p class="text-md font-bold tracking-widest text-primary uppercase">
				Furniture for every style
			</p>
			<h2
				class="mt-1 font-roboto text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
			>
				Featured Collection
			</h2>

			<!-- Grid Container -->
			<div class="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
				{#each featuredCollection as item (item.title)}
					<div class="flex flex-col items-center justify-center">
						<!-- Circle Image Container -->
						<div
							class="group border-0.5 relative flex aspect-square w-full max-w-56 items-center justify-center overflow-hidden rounded-full shadow-md transition-all duration-300 hover:border-primary hover:shadow-xl"
						>
							<!-- Image with Blur Transition -->
							<img
								src={item.img}
								alt={item.title}
								class="h-full w-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:blur-sm"
							/>

							<!-- Overlay Backdrop + Centered Title -->
							<div
								class="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 p-4 opacity-0 backdrop-blur-xs transition-all duration-300 group-hover:opacity-100"
							>
								<span
									class="text-center font-sans text-sm font-extrabold tracking-wider text-white uppercase sm:text-base"
								>
									{item.title}
								</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>

<div>
	<section class="py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<!-- Section Header -->
			<div class="text-center">
				<p class="text-md font-bold tracking-widest text-primary uppercase">
					Crafted For Your Comfort
				</p>
				<h2
					class="mt-1 font-roboto text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
				>
					Our Best Sellers
				</h2>
			</div>

			<!-- Product Grid -->
			<div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each bestSellers as item (item.name)}
					<ProductCard
						{item}
						{handleQuickView}
						onToggleWishlist={handleWishlistToggle}
						onToggleAddToCart={handleAddToCartToggle}
					/>
				{/each}
			</div>
		</div>
	</section>
</div>

<div class="relative min-h-screen w-full overflow-hidden bg-background">
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all"
		style="background-image: url('https://images.unsplash.com/photo-1704655295066-681e61ecca6b?w=1600');"
	>
		<div class="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
	</div>

	<div
		class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 px-5 pt-32 pb-16 sm:px-6 sm:pt-40 lg:px-8"
	>
		<div
			class="flex max-w-xl flex-col items-start gap-3 self-start text-left text-white sm:items-end sm:self-end sm:text-right"
		>
			<p class="text-md font-bold tracking-widest text-primary uppercase">
				PREMIUM QUALITY PRODUCTS
			</p>
			<h1 class="font-roboto text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl">
				Unique Designs For Every Space
			</h1>
			<p class="text-base text-slate-100 md:text-lg">
				Elevate your style with our curated essentials. Limited-time offers on new arrivals.
			</p>
			<div>
				<Button
					class="rounded-md bg-black px-6 py-5 text-sm font-medium text-white shadow-lg hover:bg-slate-900"
					href={resolve('/shop')}
				>
					View Items <ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
</div>

<div>
	<section class="py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<!-- Section Header -->
			<div class="text-center">
				<p class="text-md font-bold tracking-widest text-primary uppercase">
					FRESH DESIGNS JUST LANDED
				</p>
				<h2
					class="mt-1 font-roboto text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
				>
					Our New Arrivals
				</h2>
			</div>

			<!-- Product Grid -->
			<div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each freshDesigns as item (item.name)}
					<ProductCard
						{item}
						{handleQuickView}
						onToggleWishlist={handleWishlistToggle}
						onToggleAddToCart={handleAddToCartToggle}
					/>
				{/each}
			</div>
		</div>
	</section>
	<!-- some images -->
</div>

<div class="relative min-h-screen w-full overflow-hidden bg-background">
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all"
		style="background-image: url('https://images.unsplash.com/photo-1705909772783-64f1c22befcf?w=1600');"
	>
		<div class="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
	</div>

	<div
		class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 sm:px-6"
	>
		<div class="flex max-w-full flex-col items-center justify-center gap-5 text-center text-white">
			<p class="text-xl font-bold text-primary uppercase">Quality Designs For Modern Living</p>
			<p class="max-w-xl text-base font-bold text-slate-100 md:text-lg">
				Maximise your space with versatile, sleek furniture.
				<span>Built to last, styled to impress</span>
			</p>

			<Button
				class="rounded-none border border-white bg-transparent px-6 py-5 text-sm font-medium text-white shadow-lg hover:bg-slate-900"
				href={resolve('/shop')}
				>Discover now
			</Button>
		</div>
	</div>
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
	<!-- {#snippet footer()}
		<div class="flex w-full flex-row items-center justify-end gap-2">
			<Button
				size="xs"
				variant="default"
				disabled={transferStore.items.length === 0 || isSubmitting}
				onclick={executeTransferAction}
				>{#if isSubmitting}
					<Loader2Icon class="size-4 animate-spin" /> Transferring...
				{:else}Initiate Transfer
				{/if}</Button
			>
			<Dialog.Close class={buttonVariants({ variant: 'outline', size: 'xs' })}>Close</Dialog.Close>
		</div>
	{/snippet} -->
</Modal>

<!-- <Dialog.Root bind:open={isDetailModalOpen}>
	<Dialog.Content
		class="flex max-h-[95dvh] max-w-full flex-col gap-0 overflow-hidden p-0 sm:w-[calc(100%-2rem)]"
	>
		{#if selectedProduct}
			<div class="no-scrollbar min-h-0 overflow-y-auto">
				<ProductDetails
					product={selectedProduct}
					isOpen={isDetailModalOpen}
					onClose={() => (isDetailModalOpen = false)}
				/>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root> -->
