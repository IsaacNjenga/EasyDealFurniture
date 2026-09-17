<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	let {
		value = '',
		isLoading = $bindable(false),
		onChange
	}: {
		value?: string;
		isLoading?: boolean;
		onChange?: (value: string) => void;
	} = $props();

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		onChange?.(input.value);
	}
</script>

<div class="w-120 max-w-2xl">
	<InputGroup.Root class="w-full">
		<InputGroup.Input placeholder="Search..." oninput={handleInput} {value} class="w-full" />
		<InputGroup.Addon>
			{#if isLoading}
				<Loader2Icon class="animate-spin" />
			{:else}
				<SearchIcon />
			{/if}
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
