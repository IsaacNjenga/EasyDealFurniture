<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	type Props = {
		open?: boolean;
		title?: string;
		description?: string;
		children?: Snippet;
		footer?: Snippet;
	};

	let { open = $bindable(false), title, description, children, footer }: Props = $props();
</script>

<Dialog.Root bind:open
	<Dialog.Content class="flex max-h-[95dvh] w-[calc(100%-1rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:w-[calc(100%-2rem)]">
		{#if title || description}
			<Dialog.Header class="border-b border-border px-5 py-4 pr-12 sm:px-8 sm:py-5">
				{#if title}<Dialog.Title>{title}</Dialog.Title>{/if}
				{#if description}<Dialog.Description>{description}</Dialog.Description>{/if}
			</Dialog.Header>
		{/if}
		<div class="no-scrollbar min-h-0 overflow-y-auto">
			{@render children?.()}
		</div>

		{#if footer}
			<Dialog.Footer class="border-t border-border px-5 py-4 sm:px-8">
				{@render footer()}
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
