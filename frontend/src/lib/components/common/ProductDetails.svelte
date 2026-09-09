<script lang="ts">
	import type { Product } from './ProductCard.svelte';
	import { formatPrice } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		ShoppingCart,
		Check,
		Truck,
		ShieldCheck,
		ChevronLeft,
		ChevronRight
	} from '@lucide/svelte';

	type Props = {
		product: Product | null;
		isOpen: boolean;
		onClose: () => void;
		onAddToCart?: (product: Product, quantity: number) => void;
	};

	let { product, isOpen, onClose, onAddToCart }: Props = $props();

	let selectedImgIndex = $state(0);
	let quantity = $state(1);

	const images = $derived(
		product ? (Array.isArray(product.img) ? product.img : [product.img]) : []
	);
	const hasDiscount = $derived(product ? product.discount > 0 : false);
	const discountedPrice = $derived(
		product && hasDiscount ? product.price * (1 - product.discount / 100) : (product?.price ?? 0)
	);

	$effect(() => {
		if (product) {
			selectedImgIndex = 0;
			quantity = 1;
		}
	});

	const handleAddToCart = () => {
		if (product) {
			onAddToCart?.(product, quantity);
			onClose();
		}
	};
</script>

{#if isOpen && product}
	<div class="relative grid grid-cols-1 gap-6 p-4 sm:gap-8 sm:p-8 md:grid-cols-2">
		<div class="flex min-w-0 flex-col gap-3">
			<div
				class="group relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 shadow-inner dark:bg-slate-800"
			>
				<img
					src={images[selectedImgIndex]}
					alt={product.name}
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
				/>
				{#if hasDiscount}
					<span
						class="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground uppercase shadow-md"
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
						class="absolute top-1/2 left-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white"
					>
						<ChevronLeft class="size-4" />
					</button>
					<button
						type="button"
						onclick={() => (selectedImgIndex = (selectedImgIndex + 1) % images.length)}
						aria-label="Next product image"
						class="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white"
					>
						<ChevronRight class="size-4" />
					</button>
				{/if}
			</div>

			{#if images.length > 1}
				<div class="flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
					{#each images as img, i (img)}
						<button
							type="button"
							onclick={() => (selectedImgIndex = i)}
							aria-label={`Show image ${i + 1}`}
							class="size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:size-16 {selectedImgIndex ===
							i
								? 'border-primary'
								: 'border-transparent opacity-60 hover:opacity-100'}"
						>
							<img src={img} alt="" class="h-full w-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex min-w-0 flex-col justify-between">
			<div>
				<span class="text-xs font-bold tracking-widest text-primary uppercase">
					{product.category || 'Furniture'}
				</span>
				<h2 class="mt-1 pr-10 font-roboto text-xl font-extrabold text-foreground sm:text-2xl">
					{product.name}
				</h2>

				<!-- Price -->
				<div class="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span class="text-2xl font-black text-foreground sm:text-3xl">
						{formatPrice(discountedPrice)}
					</span>
					{#if hasDiscount}
						<span class="text-base text-muted-foreground line-through">
							{formatPrice(product.price)}
						</span>
					{/if}
				</div>

				<!-- Description & Specs -->
				<p class="mt-4 text-sm leading-relaxed text-muted-foreground">
					{product.description ||
						'Elevate your living space with this expertly crafted piece from EasyDeal Furniture. Modern design meets durable ergonomics.'}
				</p>

				<div class="mt-4 space-y-2 text-xs text-foreground/80">
					{#if product.dimensions}
						<p><span class="font-bold text-foreground">Dimensions:</span> {product.dimensions}</p>
					{/if}
					{#if product.material}
						<p><span class="font-bold text-foreground">Material:</span> {product.material}</p>
					{/if}
					<p class="flex items-center gap-1.5 font-semibold text-emerald-600">
						<Check class="h-4 w-4" /> In Stock & Ready for Nairobi Delivery
					</p>
				</div>
			</div>

			<!-- Quantity & Action -->
			<div class="mt-6 border-t border-border pt-5 sm:pt-6">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
					<div class="flex h-11 w-fit items-center rounded-md border border-border">
						<button
							type="button"
							onclick={() => (quantity = Math.max(1, quantity - 1))}
							class="flex h-full w-10 items-center justify-center text-sm font-bold text-muted-foreground hover:text-foreground"
							>-</button
						>
						<span class="min-w-10 text-center text-sm font-bold">{quantity}</span>
						<button
							type="button"
							onclick={() => (quantity = quantity + 1)}
							class="flex h-full w-10 items-center justify-center text-sm font-bold text-muted-foreground hover:text-foreground"
							>+</button
						>
					</div>

					<Button
						onclick={handleAddToCart}
						class="flex-1 gap-2 rounded-md bg-primary font-bold text-primary-foreground hover:bg-primary/90"
					>
						<ShoppingCart class="h-4 w-4" />
						Add to Cart
					</Button>
				</div>

				<div class="mt-4 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
					<span class="flex items-center gap-1"
						><Truck class="size-3.5 shrink-0 text-primary" /> Fast Doorstep Delivery</span
					>
					<span class="flex items-center gap-1"
						><ShieldCheck class="size-3.5 shrink-0 text-primary" /> Quality Guarantee</span
					>
				</div>
			</div>
		</div>
	</div>
{/if}
