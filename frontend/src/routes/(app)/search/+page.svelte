<script lang="ts">
	import type { Product } from '$lib/services/product/product.types';
	import ProductCard from '$lib/components/common/ProductCard.svelte';
	import Loader from '$lib/components/common/Loader.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { ApiError } from '$lib/services/api/errors';
	import { ProductService } from '$lib/services/product/product.service';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { SvelteURL } from 'svelte/reactivity';
	import { getCookie, setCookie } from '$lib/stores/cookies';

	const SEARCH_HISTORY_COOKIE = 'easydeal_search_history';
	const MAX_SEARCH_HISTORY = 5;
	let searchHistory = $state<string[]>([]);

	function loadSearchHistory() {
		const raw = getCookie(SEARCH_HISTORY_COOKIE);
		if (!raw) return;

		try {
			const history = JSON.parse(raw);
			if (Array.isArray(history)) {
				searchHistory = history.filter((item): item is string => typeof item === 'string');
			}
		} catch {
			searchHistory = [];
		}
	}

	function saveSearch(query: string) {
		const normalizedQuery = query.trim();
		if (!normalizedQuery) return;

		searchHistory = [
			normalizedQuery,
			...searchHistory.filter((item) => item.toLowerCase() !== normalizedQuery.toLowerCase())
		].slice(0, MAX_SEARCH_HISTORY);
		setCookie(SEARCH_HISTORY_COOKIE, JSON.stringify(searchHistory));
	}

	function useSearchHistory(query: string) {
		searchTerm = query;
		const searchUrl = new SvelteURL(page.url);
		searchUrl.pathname = resolve('/search');
		searchUrl.searchParams.set('query', query);
		goto(searchUrl, { replaceState: true, keepFocus: true, noScroll: true });
	}

	$effect(() => {
		if (typeof document !== 'undefined') loadSearchHistory();
	});

	let searchTerm = $state(page.url.searchParams.get('query') ?? '');
	let isSearching = $state(false);
	let searchResults = $state<Product[]>([]);

	let debounceTimer: ReturnType<typeof setTimeout>;
	let activeQueryId = 0;
	let lastSearchedQuery = '';

	$effect(() => {
		const query = page.url.searchParams.get('query')?.trim() ?? '';

		if (!query) {
			lastSearchedQuery = '';
			searchResults = [];
			isSearching = false;
			return;
		}

		searchTerm = query;
		if (query !== lastSearchedQuery) {
			lastSearchedQuery = query;
			isSearching = true;
			executeSearch(query);
		}
	});

	function handleInput(e: Event) {
		const input = e.target as HTMLInputElement;
		searchTerm = input.value;

		clearTimeout(debounceTimer);

		const query = searchTerm.trim();
		if (!query) {
			activeQueryId++;
			goto(resolve('/search'), { replaceState: true, keepFocus: true, noScroll: true });
			searchResults = [];
			isSearching = false;
			return;
		}

		isSearching = true;

		debounceTimer = setTimeout(() => {
			const searchUrl = new SvelteURL(page.url);
			searchUrl.pathname = resolve('/search');
			searchUrl.searchParams.set('query', query);
			goto(searchUrl, { replaceState: true, keepFocus: true, noScroll: true });
		}, 300);
	}

	async function executeSearch(query: string) {
		const currentQueryId = ++activeQueryId;
		saveSearch(query);

		try {
			const res = await ProductService.search(query);

			// Ignore response if a newer query has been fired
			if (currentQueryId !== activeQueryId) return;

			searchResults = res;
		} catch (err) {
			if (currentQueryId !== activeQueryId) return;

			if (err instanceof ApiError) {
				toast.error(err.message);
			} else {
				console.error('Failed to fetch items:', err);
				toast.error('Failed to fetch items.');
			}
		} finally {
			if (currentQueryId === activeQueryId) {
				isSearching = false;
			}
		}
	}
</script>

<svelte:head>
	<title
		>{searchTerm
			? `${searchTerm} | Search | EasyDeal Furniture`
			: 'Search | EasyDeal Furniture'}</title
	>
	<meta
		name="description"
		content="Search EasyDeal Furniture by product name, category, or tag and find pieces available in Nairobi."
	/>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div
	class="relative flex min-h-110 w-full items-center justify-center overflow-hidden bg-background pt-20"
>
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('https://images.unsplash.com/photo-1680503397692-cd0da21a0bec?w=1600');"
	>
		<div class="absolute inset-0 bg-black/60 dark:bg-black/75"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
		<h1 class="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Search furniture</h1>
		<div class="w-120 max-w-2xl">
			<InputGroup.Root class="w-full">
				<InputGroup.Input
					placeholder="Search furniture by name, tag, or category..."
					oninput={handleInput}
					value={searchTerm}
					class="w-full"
				/>
				<InputGroup.Addon>
					{#if isSearching}
						<Loader2Icon class="animate-spin" />
					{:else}
						<SearchIcon />
					{/if}
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
		{#if !searchTerm.trim() && searchHistory.length > 0}
			<div class="mt-5 flex flex-wrap items-center justify-center gap-2 text-left">
				<span class="text-xs font-semibold text-white/70">Recent</span>
				{#each searchHistory as query (query)}
					<button
						type="button"
						onclick={() => useSearchHistory(query)}
						class="rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs text-white transition hover:bg-white/20"
					>
						{query}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<div class="space-y-4 p-8">
	{#if isSearching && searchResults.length === 0}
		<div class="flex items-center justify-center py-12">
			<Loader size="sm" />
		</div>
	{:else if searchTerm.trim()}
		{#if searchResults.length > 0}
			<div class="mb-2 text-sm text-muted-foreground">
				Showing results for <b>"{searchTerm.trim()}"</b>
			</div>
		{/if}

		<section class="pb-16">
			<div class="mx-auto max-w-7xl">
				{#if searchResults.length > 0}
					<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{#each searchResults as item (item._id)}
							<ProductCard {item} />
						{/each}
					</div>
				{:else if !isSearching}
					<div class="flex flex-col items-center justify-center py-16 text-center">
						<p class="text-lg text-muted-foreground">
							No products found matching "{searchTerm.trim()}".
						</p>
					</div>
				{/if}
			</div>
		</section>
	{/if}
</div>
