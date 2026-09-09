<script lang="ts">
	import AppMenubar from '$lib/components/layout/AppMenubar.svelte';
	import AppFooter from '$lib/components/layout/AppFooter.svelte';
	let { children } = $props();
</script>

<div class="relative flex min-h-screen w-full flex-col">
	<!-- Fixed overlay navbar across all viewport scrolls -->
	<div class="fixed inset-x-0 top-0 z-50 w-full">
		<AppMenubar />
	</div>

	<!-- Main page content rendering behind navbar -->
	<main class="w-full flex-1">
		{@render children()}
	</main>

	<div class="w-full">
		<AppFooter />
	</div>
</div>
