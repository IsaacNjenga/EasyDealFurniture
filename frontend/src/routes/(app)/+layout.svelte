<script lang="ts">
    import AppMenubar from '$lib/components/layout/AppMenubar.svelte';
    let { children } = $props();
</script>

<div class="relative flex min-h-screen w-full flex-col">
    <!-- Fixed overlay navbar across all viewport scrolls -->
    <div class="fixed inset-x-0 top-0 z-50 w-full">
        <AppMenubar />
    </div>

    <!-- Main page content rendering behind navbar -->
    <main class="flex-1 w-full">
        {@render children()}
    </main>
</div>