<script lang="ts">
	import { matchesProduct } from '$lib/catalogue';
	import ProductCard from '$lib/components/common/ProductCard.svelte';
	import type { PageProps } from './$types';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { categoryName, unitPrice } from '$lib/commerce';
	import { resolve } from '$app/paths';
	import { formatPrice } from '$lib/utils';
	import hero from '$lib/assets/images/image_7.webp';
	let { data }: PageProps = $props();
	let category = $state('All');
	let colour = $state('All');
	let query = $state('');
	let minPrice = $state<number | undefined>();
	let maxPrice = $state<number | undefined>();
	let availability = $state('all');
	let sort = $state('featured');
	let visibleCount = $state(24);
	const products = $derived(data.products ?? []);
	const filters = $derived({ category, colour, query, minPrice, maxPrice, availability });
	const matches = (product: (typeof products)[number], omit = '') =>
		matchesProduct(product, filters, omit);
	const categories = $derived([...new Set(products.map((p) => categoryName(p.category.name)))].sort());
	const colours = $derived(
		[...new Set(products.flatMap((p) => (p.colours ?? []).map((c) => c.toLowerCase())))].sort()
	);
	const categoryCounts = $derived(
		Object.fromEntries(
			categories.map((c) => [
				c,
				products.filter((p) => categoryName(p.category.name) === c && matches(p, 'category')).length
			])
		)
	);
	const colourCounts = $derived(
		Object.fromEntries(
			colours.map((c) => [
				c,
				products.filter(
					(p) => (p.colours ?? []).some((v) => v.toLowerCase() === c) && matches(p, 'colour')
				).length
			])
		)
	);
	const filtered = $derived.by(() => {
		const result = products.filter((p) => matches(p));
		if (sort === 'price-asc') result.sort((a, b) => unitPrice(a) - unitPrice(b));
		if (sort === 'price-desc') result.sort((a, b) => unitPrice(b) - unitPrice(a));
		if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
		return result;
	});
	const activeCount = $derived(
		Number(category !== 'All') +
			Number(colour !== 'All') +
			Number(!!query.trim()) +
			Number(minPrice != null) +
			Number(maxPrice != null) +
			Number(availability !== 'all')
	);
	$effect(() => {
		void category;
		void colour;
		void query;
		void minPrice;
		void maxPrice;
		void availability;
		void sort;
		visibleCount = 24;
	});
	function reset() {
		category = 'All';
		colour = 'All';
		query = '';
		minPrice = undefined;
		maxPrice = undefined;
		availability = 'all';
	}
</script>

<svelte:head>
	<title>Shop</title>
	<meta
		name="description"
		content="Find furniture for your home and office in Nairobi. Filter by room, colour and budget, then build an itemised estimate with EasyDeal Furniture."
	/>
</svelte:head>

<div
	class="relative flex min-h-128 w-full items-center justify-center overflow-hidden bg-background pt-20"
>
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url({hero});"
	>
		<div class="absolute inset-0 bg-black/30 dark:bg-black/40"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
		<h1 class="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
			Shop Now
		</h1>
	</div>
</div>


<section class="mx-auto max-w-7xl px-1 py-4 sm:px-1">
	<div class="mb-4 flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="text-sm font-bold text-primary uppercase">Furniture that fits your plans</p>
			<h2 class="mt-2 text-3xl font-bold">Explore the collection</h2>
		</div>
	</div>
	{#if data.error}
		<div role="alert" class="rounded-lg border p-8">
			<h3 class="text-xl font-bold">The collection is temporarily unavailable.</h3>
			<p class="my-3 text-muted-foreground">
				Please refresh to try again, or contact our team for help finding a piece.
			</p>
			<a href={resolve('/contact')} class="underline">Contact Us</a>
		</div>
	{:else}
		<div class="flex w-full flex-col gap-2 md:flex-row md:items-start">
			<div class="h-auto w-full shrink-0 space-y-2 border bg-card p-2 md:w-[20%]">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<button aria-label="l" class="display-none"></button>
					<button onclick={reset} class="cursor-pointer text-sm underline" disabled={!activeCount}
						>Clear filters{activeCount ? ` (${activeCount})` : ''}</button
					>
				</div>
				<div
					class="grid h-auto w-full shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 md:flex md:w-auto md:flex-row md:gap-2 lg:flex-col"
				>
					<div class="min-w-0">
						<Label for="search" class="text-sm font-medium">Search</Label>
						<Input
							class="mt-2 w-full rounded border bg-background p-2"
							type="search"
							placeholder="Name, room or style"
							bind:value={query}
						/>
					</div>

					<div class="min-w-0">
						<Label for="category" class="text-sm font-medium">Category</Label>
						<Select.Root type="single" bind:value={category}>
							<Select.Trigger class="mt-2 w-full rounded-none border bg-background p-2 capitalize">
								<Select.Value placeholder="All Categories" />
							</Select.Trigger>
							<Select.Content class="mt-1 w-full rounded-none border bg-background p-1 capitalize">
								<Select.Group>
									<Select.Label>All Categories</Select.Label>
									{#each categories as c (c)}
										<Select.Item value={c} label={c}>
											{c} ({categoryCounts[c]})
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="min-w-0">
						<Label for="colour" class="text-sm font-medium">Colour</Label>
						<Select.Root type="single" bind:value={colour}>
							<Select.Trigger class="mt-2 w-full rounded-none border bg-background p-2 capitalize">
								<Select.Value placeholder="All Colours" />
							</Select.Trigger>
							<Select.Content class="mt-1 w-full rounded-none border bg-background p-1 capitalize">
								<Select.Group
									><Select.Label>All Colours</Select.Label>
									{#each colours as c (c)}
										<Select.Item value={c} label={c}>
											{c} ({colourCounts[c]})
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="min-w-0">
						<Label for="minPrice" class="text-sm font-medium">Maximum price (KES)</Label>
						<Input
							class="mt-2 w-full rounded border bg-background p-2"
							type="number"
							min="0"
							placeholder="No maximum"
							bind:value={maxPrice}
						/>
					</div>

					<div class="min-w-0">
						<Label for="minPrice" class="text-sm font-medium">Minimum price (KES)</Label>
						<Input
							class="mt-2 w-full rounded border bg-background p-2"
							type="number"
							min="0"
							placeholder="No minimum"
							bind:value={minPrice}
						/>
					</div>

					<div class="min-w-0">
						<Label for="sort" class="text-sm font-medium">Sort By</Label>
						<Select.Root type="single" bind:value={sort}>
							<Select.Trigger class="mt-2 w-full rounded-none border bg-background p-2 capitalize">
								<Select.Value placeholder="Featured Order" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="featured">Featured Order</Select.Item>
								<Select.Item value="price-asc">Price: Low to High</Select.Item>
								<Select.Item value="price-desc">Price: High to Low</Select.Item>
								<Select.Item value="name">Name: A to Z</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				{#if minPrice != null && maxPrice != null && minPrice > maxPrice}<p
						role="alert"
						class="text-sm text-destructive"
					>
						Maximum price must be at least the minimum price.
					</p>{/if}
				<p class="text-sm text-muted-foreground" aria-live="polite">
					{filtered.length} of {products.length} items match{category !== 'All'
						? ` in ${category}`
						: ''}.<br />
					{#if filtered.length}
						Prices from {formatPrice(Math.min(...filtered.map(unitPrice)))}.
					{/if}
				</p>
			</div>

			<div class="h-auto w-full md:flex-1">
				{#if filtered.length}
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
						{#each filtered.slice(0, visibleCount) as item (item._id)}<ProductCard {item} />{/each}
					</div>
					{#if visibleCount < filtered.length}<div class="mt-8 text-center">
							<p class="mb-4 text-sm text-muted-foreground">
								Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}
							</p>
							<button
								class="rounded-md border px-6 py-3 font-semibold hover:bg-accent"
								onclick={() => (visibleCount += 24)}>Show more furniture</button
							>
						</div>{/if}
				{:else}<div class="border border-dashed p-12 text-center">
						<h3 class="text-xl font-bold">No pieces match this combination yet.</h3>
						<p class="my-4 text-muted-foreground">
							Try a broader budget, another colour or a different room.
						</p>
						<button
							class="rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground"
							onclick={reset}>Reset filters</button
						>
					</div>{/if}
			</div>
		</div>
	{/if}
</section>
