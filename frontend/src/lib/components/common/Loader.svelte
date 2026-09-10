<script lang="ts">
	import { Loader } from '@lucide/svelte';

	type Props = {
		size?: 'sm' | 'md' | 'lg';
		speed?: 'fast' | 'normal' | 'slow';
	};

	let { size = 'md', speed = 'normal' }: Props = $props();

	// Map size variants
	const sizeClasses = {
		sm: 'h-4 w-4',
		md: 'h-8 w-8',
		lg: 'h-12 w-12'
	};

	// Map custom spin durations
	const speedClasses = {
		fast: 'animate-[spin_0.5s_linear_infinite]',
		normal: 'animate-[spin_1s_linear_infinite]',
		slow: 'animate-[spin_2s_linear_infinite]'
	};
</script>

<div class="flex items-center justify-center p-4">
	<Loader class="{sizeClasses[size]} {speedClasses[speed]} text-primary" />
</div>
