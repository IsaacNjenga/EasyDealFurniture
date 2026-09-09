<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import herobg1 from '$lib/assets/hero-bg-1.jpg';
	import herobg2 from '$lib/assets/hero-bg-2.jpg';
	import ProductCard, { type Product } from '$lib/components/common/ProductCard.svelte';
	import ProductDetails from '$lib/components/common/ProductDetails.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import img from '$lib/assets/img.jpg';
	import img2 from '$lib/assets/img2.jpg';
	import img3 from '$lib/assets/img3.jpg';
	import img4 from '$lib/assets/img4.jpg';
	import img5 from '$lib/assets/img5.jpg';
	import img6 from '$lib/assets/img6.jpg';
	import img7 from '$lib/assets/img7.jpg';
	import img8 from '$lib/assets/img8.jpg';
	import img9 from '$lib/assets/img9.jpg';
	import img10 from '$lib/assets/img10.jpg';
	import img11 from '$lib/assets/img11.jpg';
	import img12 from '$lib/assets/img12.jpg';
	import img13 from '$lib/assets/img13.jpg';
	import { toast } from 'svelte-sonner';

	const backgrounds = [herobg1, herobg2, img3, img6];
	const featuredCollection = [
		{ img: img5, title: 'Modern Living' },
		{ img: img8, title: 'Office Elegance' },
		{ img: img13, title: 'Outdoor Comfort' },
		{ img: img11, title: 'Classic Touch' }
	];

	const bestSellers = [
		{
			img: [img7, img5],
			name: 'Ergonomic Office Chair',
			price: 4600,
			discount: 10
		},
		{
			img: img8,
			name: 'Scandinavian Velvet Sofa',
			price: 18500,
			discount: 15
		},
		{
			img: img9,
			name: 'Minimalist Wooden Dining Table',
			price: 12000,
			discount: 0
		},
		{
			img: img10,
			name: 'Modern Accent Armchair',
			price: 8900,
			discount: 5
		}
	];

	const freshDesigns = [
		{
			img: [img, img11],
			name: 'Ergonomic Office Chair',
			price: 4600,
			discount: 10
		},
		{
			img: img2,
			name: 'Scandinavian Velvet Sofa',
			price: 18500,
			discount: 0
		},
		{
			img: [img4, img8],
			name: 'Minimalist Wooden Dining Table',
			price: 12000,
			discount: 0
		},
		{
			img: img12,
			name: 'Modern Accent Armchair',
			price: 8900,
			discount: 5
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
			toast.success(`Added ${product.name} to your wishlist.`);
		} else {
			toast.info(`Removed ${product.name} from wishlist.`);
		}
	};

	const handleAddToCartToggle = (product: Product, isCarted: boolean) => {
		if (isCarted) {
			toast.success(`Added ${product.name} to your cart.`);
		} else {
			toast.info(`Removed ${product.name} from cart.`);
		}
	};
</script>

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
		style="background-image: url({img11});"
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
		style="background-image: url({img11});"
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

<Dialog.Root bind:open={isDetailModalOpen}>
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
</Dialog.Root>
