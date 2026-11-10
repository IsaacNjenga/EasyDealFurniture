<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount, onDestroy } from 'svelte';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	import ProductCard from '$lib/components/common/ProductCard.svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';
	import Home_Img from '$lib/assets/images/home_img.webp';
	import Home_Img3 from '$lib/assets/images/home_img3.webp';
	import Home_Img4 from '$lib/assets/images/home_img4.webp';
	import modern_living from '$lib/assets/images/modern_living.webp';
	import office_elegance from '$lib/assets/images/office_elegance.webp';
	import outdoor_comfort from '$lib/assets/images/outdoor_comfort.webp';
	import classic_touch from '$lib/assets/images/classic_touch.webp';

	// const backgrounds = [
	// 	'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600',
	// 	'https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?w=1600',
	// 	'https://images.unsplash.com/photo-1688578735352-9a6f2ac3b70a?w=1600',
	// 	'https://images.unsplash.com/photo-1681418659069-eef28d44aeab?w=1600'
	// ];

	const local_backgrounds = [Home_Img,  Home_Img3, Home_Img4];

	const featuredCollection = [
		{
			// img: 'https://images.unsplash.com/photo-1693578616322-c8abe6c7393d?w=1600',
			img: modern_living,
			title: 'Modern Living'
		},
		{
			// img: 'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?w=1600',
			img: office_elegance,
			title: 'Office Elegance'
		},
		{
			// img: 'https://images.unsplash.com/photo-1600210492090-a159ffa3aeaf?w=1600',
			img: outdoor_comfort,
			title: 'Outdoor Comfort'
		},
		{
			// img: 'https://plus.unsplash.com/premium_photo-1688125414593-391cf90f3103?w=1600',
			img: classic_touch,
			title: 'Classic Touch'
		}
	];

	let { data }: PageProps = $props();

	const bestSellers = $derived(data.bestSellers ?? []);
	const freshDesigns = $derived(data.freshDesigns ?? []);
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load furniture', { description: error });
		}
	});

	let currentSlide = $state(0);
	let intervalId: ReturnType<typeof setInterval>;
const nextSlide = () => {
		currentSlide = (currentSlide + 1) % local_backgrounds.length;
	};

	onMount(() => {
		intervalId = setInterval(nextSlide, 4000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<svelte:head>
	<title>Furniture for You</title>
	<link rel="preload" as="image" href={Home_Img} />
	<meta
		name="description"
		content="Discover modern furniture for every space from EasyDeal Furniture in Nairobi, with curated living, office, bedroom, dining, outdoor and second-hand pieces."
	/>
</svelte:head>
<div class="relative min-h-screen w-full overflow-hidden bg-background">
	<!-- Carousel Background Images -->
	{#each local_backgrounds as bgUrl, i (i)}
		{#if currentSlide === i}
			<div
				class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all"
				style="background-image: url({bgUrl});"
				transition:fade={{ duration: 1250, easing: cubicInOut }}
			>
				<div class="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
			</div>
		{/if}
	{/each}

	<div
		class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 px-5 pt-32 pb-16 sm:px-6 sm:pt-28 lg:px-8"
	>
		<!-- Section 1: Top Left -->
		<div class="flex max-w-xl flex-col gap-3 self-start text-white">
			<p class="text-md font-bold tracking-widest text-primary uppercase">
				MAKE ROOM FOR BETTER LIVING
			</p>
			<h1 class="font-roboto text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl">
				Love the space you come home to.
			</h1>
			<p class="text-base text-slate-100 md:text-lg">
				Create a workspace that reflects your work, find furniture that fits your life,
				your room and your budget.
			</p>
			<div>
				<Button
					class="rounded-md bg-primary px-6 py-5 text-md font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 "
					href={resolve('/shop')}
				>
					Find your next piece
				</Button>
			</div>
		</div>

		<!-- Section 2: Bottom Right -->
		<div class="flex max-w-xl flex-col items-end self-end text-right text-white sm:mt-10">
			<p class="text-md font-bold tracking-widest text-primary uppercase">
				minimal meets functional
			</p>
			<h2 class="font-roboto text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl">
				Build a workspace that means business.
			</h2>
			<p class="text-base text-slate-100 md:text-lg">
				Bring desks, seating and storage together. Shortlist your favourites, choose your quantities
				and start with a clear furniture estimate.
			</p>
			<div>
				<Button
					class="rounded-md bg-primary px-6 py-5 text-md font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
					href={resolve('/quote')}
				>
					Build My Quote
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
								loading="lazy"
								decoding="async"
								width="224"
								height="224"
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
				{#each bestSellers as item (item._id)}
					<ProductCard {item} />
				{/each}
			</div>
		</div>
	</section>
</div>

<div class="relative min-h-screen w-full overflow-hidden bg-background">
	<div class="absolute inset-0 z-0">
		<img
			src={modern_living}
			alt=""
			loading="lazy"
			decoding="async"
			class="absolute inset-0 h-full w-full object-cover"
		/>
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
			<h2 class="font-roboto text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl">
				One room. A fresh perspective.
			</h2>
			<p class="text-base text-slate-100 md:text-lg">
				Explore a new direction for your space. Compare finishes, save your favourites and ask our
				team about the details that matter to you.
			</p>
			<div>
				<Button
					class="rounded-md bg-primary px-6 py-5 text-md font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
					href={resolve('/shop')}
				>
					Browse Our Items
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
					<ProductCard {item} />
				{/each}
			</div>
		</div>
	</section>
	<!-- some images -->
</div>

<div class="relative min-h-screen w-full overflow-hidden bg-background">
	<div class="absolute inset-0 z-0">
		<img
			src={office_elegance}
			alt=""
			loading="lazy"
			decoding="async"
			class="absolute inset-0 h-full w-full object-cover"
		/>
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
				class="rounded-none border border-white bg-transparent px-6 py-5 text-md font-semibold text-white shadow-xs hover:bg-slate-900"
				href={resolve('/contact')}
				>Plan your visit
			</Button>
		</div>
	</div>
</div>

<section class="mx-auto max-w-7xl px-6 py-20">
	<p class="text-sm font-bold tracking-widest text-primary uppercase">From inspiration to a plan</p>
	<h2 class="mt-3 text-3xl font-extrabold">A little planning. A much better fit.</h2>
	<div class="mt-8 grid gap-8 md:grid-cols-3">
		<article>
			<span class="text-sm font-bold text-primary">01 / MEASURE</span>
			<h3 class="mt-3 text-xl font-bold">Start with your space</h3>
			<p class="mt-3 leading-relaxed text-muted-foreground">
				Measure your room and doorways. Leave space for movement, open drawers and pulled-out
				chairs. Ask our team to confirm product dimensions before you order.
			</p>
		</article>
		<article>
			<span class="text-sm font-bold text-primary">02 / CHOOSE</span>
			<h3 class="mt-3 text-xl font-bold">Make a shortlist that works</h3>
			<p class="mt-3 leading-relaxed text-muted-foreground">
				Filter by room, colour and budget. Save favourites while you compare, then add the pieces
				you want to your quote and set the quantities you need.
			</p>
		</article>
		<article>
			<span class="text-sm font-bold text-primary">03 / CONFIRM</span>
			<h3 class="mt-3 text-xl font-bold">Talk through the details</h3>
			<p class="mt-3 leading-relaxed text-muted-foreground">
				Share your estimate with our team to confirm stock, finishes, final pricing and delivery
				arrangements. Prefer to try before choosing? Visit our showroom.
			</p>
		</article>
	</div>
	<a href={resolve("/faqs")} class="mt-8 inline-block font-semibold underline"
		>Read our FAQs</a
	>
</section>
