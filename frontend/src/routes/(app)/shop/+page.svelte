<script lang="ts">
	import { matchesProduct } from '$lib/catalogue';
	import ProductCard from '$lib/components/common/ProductCard.svelte';
	import type { PageProps } from './$types';
	import { categoryName, unitPrice } from '$lib/commerce';
	import { resolve } from '$app/paths';
	import { formatPrice } from '$lib/utils';
	import hero from '$lib/assets/images/office_elegance.webp';
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
	const categories = $derived([...new Set(products.map((p) => categoryName(p.category)))].sort());
	const colours = $derived(
		[...new Set(products.flatMap((p) => (p.colours ?? []).map((c) => c.toLowerCase())))].sort()
	);
	const categoryCounts = $derived(
		Object.fromEntries(
			categories.map((c) => [
				c,
				products.filter((p) => categoryName(p.category) === c && matches(p, 'category')).length
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
<section class="relative overflow-hidden bg-foreground px-6 pt-44 pb-20 text-white">
	<img src={hero} alt="" fetchpriority="high" class="absolute inset-0 h-full w-full object-cover" />
	<div class="relative min-h-20 w-full overflow-hidden bg-transparent sm:min-h-30">
		<div class="relative z-10 mx-auto max-w-full flex-col justify-center">
			<div class="flex max-w-full flex-col items-center justify-center gap-5 text-center">
				<h1 class=" text-3xl font-bold tracking-tight text-white">Shop Now</h1>
			</div>
		</div>
	</div>
</section>
<section class="mx-auto max-w-7xl px-1 py-6 sm:px-1">
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
		<div class="flex w-full items-start gap-2">
			<div class="h-auto w-[22%] shrink-0 space-y-2 border bg-card p-2">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<button aria-label="l" class="display-none"></button>
					<button onclick={reset} class="cursor-pointer text-sm underline" disabled={!activeCount}
						>Clear filters{activeCount ? ` (${activeCount})` : ''}</button
					>
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-sm font-medium"
						>Search<input
							class="mt-2 w-full rounded border bg-background p-3"
							type="search"
							placeholder="Name, room or style"
							bind:value={query}
						/></label
					>
					<label class="text-sm font-medium"
						>Room / category<select
							class="mt-2 w-full rounded border bg-background p-3"
							bind:value={category}
							><option value="All">All categories</option>{#each categories as c (c)}<option
									value={c}
									disabled={!categoryCounts[c] && category !== c}>{c} ({categoryCounts[c]})</option
								>{/each}</select
						></label
					>
					<label class="text-sm font-medium"
						>Colour<select
							class="mt-2 w-full rounded border bg-background p-3 capitalize"
							bind:value={colour}
							><option value="All">All colours</option>{#each colours as c (c)}<option
									value={c}
									disabled={!colourCounts[c] && colour !== c}>{c} ({colourCounts[c]})</option
								>{/each}</select
						></label
					>
					<label class="text-sm font-medium"
						>Availability<select
							class="mt-2 w-full rounded border bg-background p-3"
							bind:value={availability}
							><option value="all">All items</option><option value="stock"
								>Confirmed in stock</option
							></select
						></label
					>
					<label class="text-sm font-medium"
						>Minimum price (KES)<input
							class="mt-2 w-full rounded border bg-background p-3"
							type="number"
							min="0"
							placeholder="No minimum"
							bind:value={minPrice}
						/></label
					>
					<label class="text-sm font-medium"
						>Maximum price (KES)<input
							class="mt-2 w-full rounded border bg-background p-3"
							type="number"
							min="0"
							placeholder="No maximum"
							bind:value={maxPrice}
						/></label
					>
					<label class="text-sm font-medium"
						>Sort by<select class="mt-2 w-full rounded border bg-background p-3" bind:value={sort}
							><option value="featured">Featured order</option><option value="price-asc"
								>Price: low to high</option
							><option value="price-desc">Price: high to low</option><option value="name"
								>Name: A to Z</option
							></select
						></label
					>
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

			<div class="flex-1">
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
