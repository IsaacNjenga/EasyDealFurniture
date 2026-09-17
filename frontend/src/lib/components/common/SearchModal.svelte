<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import XIcon from '@lucide/svelte/icons/x';

	type SearchResultItem = {
		id: string;
		title: string;
		subtitle?: string;
		type: 'product' | 'category' | 'user';
		href: string;
	};

	let value = $state('');
	let isLoading = $state(false);
	let isOpen = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Mock search results grouped by category
	let results = $state<SearchResultItem[]>([]);

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		value = input.value;

		if (!value.trim()) {
			results = [];
			isOpen = false;
			isLoading = false;
			return;
		}

		isLoading = true;
		isOpen = true;

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {}, 300);
	}

	function clearSearch() {
		value = '';
		results = [];
		isOpen = false;
	}
</script>

<div class="relative w-full h-full max-w-lg">
	<InputGroup.Root>
		<InputGroup.Input
			id="universal-search-input"
			placeholder="Search products, categories..."
			oninput={handleInput}
			onfocus={() => {
				if (value.trim()) isOpen = true;
			}}
			{value}
			// class="pr-16"
		/>
		<InputGroup.Addon class="flex items-center gap-1">
			{#if value}
				<button
					type="button"
					onclick={clearSearch}
					class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<XIcon class="size-4" />
				</button>
			{/if}

			{#if isLoading}
				<Loader2Icon class="size-4 animate-spin text-primary" />
			{:else}
				<SearchIcon class="size-4 text-muted-foreground" />
			{/if}
		</InputGroup.Addon>
	</InputGroup.Root>

	<!-- Dropdown Results Box -->
	{#if isOpen && value.trim()}
		<button
			type="button"
			class="fixed inset-0 z-40 bg-transparent"
			onclick={() => (isOpen = false)}
			aria-label="Close search dropdown"
		></button>

		<div
			class="absolute top-full left-0 z-50 mt-2 w-full animate-in rounded-lg border bg-popover text-popover-foreground shadow-lg fade-in-0 outline-none zoom-in-95"
		>
			{#if isLoading && results.length === 0}
				<div class="p-6 text-center text-sm text-muted-foreground">Searching...</div>
			{:else if results.length === 0}
				<div class="p-6 text-center text-sm text-muted-foreground">
					No results found for "<span class="font-medium text-foreground">{value}</span>"
				</div>
			{/if}
		</div>
	{/if}
</div>
