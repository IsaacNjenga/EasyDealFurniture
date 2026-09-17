<script lang="ts">
	import type { PageProps } from './$types';
	import { formatPrice } from '$lib/utils';
	import { Tag, ChevronLeft, ChevronRight,  } from '@lucide/svelte';
	import ChatButton from '$lib/components/common/ChatButton.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { toast } from 'svelte-sonner';

	let { data }: PageProps = $props();

	let product = $derived(data.product);
	let error = $derived(data.error);

	let selectedImgIndex = $state(0);

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
		}
	});
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
					class="group relative aspect-4/3 w-full overflow-hidden rounded-none bg-slate-100 shadow-inner md:aspect-square dark:bg-slate-800"
				>
					<img
						src={images[selectedImgIndex]}
						alt={product.name}
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
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
							class="mt-1 font-roboto text-2xl font-extrabold text-foreground sm:text-3xl lg:text-4xl"
						>
							{product.name}
						</h1>
					</div>

					<!-- Pricing -->
					<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
						<span class="text-3xl font-black text-foreground sm:text-4xl">
							{formatPrice(discountedPrice)}
						</span>
						{#if hasDiscount}
							<span class="text-lg text-muted-foreground line-through">
								{formatPrice(product.price)}
							</span>
						{/if}
					</div>

					<!-- Description -->
					<p class="text-base leading-relaxed text-muted-foreground">
						{product.description ||
							'Elevate your living space with this expertly crafted piece from EasyDeal Furniture. Modern design meets durable ergonomics.'}
					</p>

					<!-- Tags -->
					{#if product.tags && product.tags.length > 0}
						<div class="flex flex-wrap items-center gap-2 pt-2">
							<Tag class="size-4 text-primary" />
							<div class="flex flex-wrap items-center gap-1.5">
								{#each product.tags as tag (tag)}
									<Badge variant="outline" class="whitespace-nowrap">
										{tag}
									</Badge>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Colors -->
					{#if product.colours && product.colours.length > 0}
						<p class="text-sm leading-relaxed text-muted-foreground">
							Available Colours:
							<span class="font-medium text-foreground capitalize">
								{product.colours.join(', ')}
							</span>
						</p>
					{/if}

					<!-- Stock Status -->
					<div class="pt-2 text-sm">
						<p class="flex items-center gap-1.5 font-semibold text-emerald-600">
							In Stock & Ready for delivery
						</p>
					</div>
				</div>

				<!-- Call to Action -->
				<div class="mt-2 border-t border-border pt-4">
					<ChatButton
						phoneNumber="254714738997"
						message={`Hi EasyDeal Furniture, I'm interested in buying "${product.name}". Is it available?`}
						label="Inquire via WhatsApp"
					/>
				</div>
			</div>
		</div>
	{:else if !error}
		<div class="flex min-h-100 flex-col items-center justify-center text-center">
			<p class="text-lg font-medium text-muted-foreground">Loading product details...</p>
		</div>
	{/if}
</main>
