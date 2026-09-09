<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	// import { formatPrice } from '$lib/utils';
	import { ArrowDown } from '@lucide/svelte';

	import img from '$lib/assets/img.jpg';
	import img3 from '$lib/assets/img3.jpg';
	import img4 from '$lib/assets/img4.jpg';
	import img5 from '$lib/assets/img5.jpg';
	import img6 from '$lib/assets/img6.jpg';
	import img8 from '$lib/assets/img8.jpg';
	import img12 from '$lib/assets/img12.jpg';
	import img13 from '$lib/assets/img13.jpg';

	const backgrounds = [img8, img12];

	const categories = [
		{ img: img, title: 'Office Furniture' },
		{ img: img13, title: 'Bedroom Furniture' },
		{ img: img3, title: 'Kitchen Furniture' },
		{ img: img4, title: 'Outdoor Furniture' },
		{ img: img5, title: 'Living Room Furniture' },
		{ img: img6, title: 'Second-Hand Items' }
	];

	let currentSlide = $state(0);
	let intervalId: ReturnType<typeof setInterval>;

	const nextSlide = () => {
		currentSlide = (currentSlide + 1) % backgrounds.length;
	};

	onMount(() => {
		intervalId = setInterval(nextSlide, 4000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<div class="relative min-h-150 w-full overflow-hidden bg-background">
	{#each backgrounds as bgUrl, i (i)}
		{#if currentSlide === i}
			<div
				class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all"
				style="background-image: url({bgUrl});"
				transition:fade={{ duration: 1200, easing: cubicInOut }}
			>
				<div class="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
			</div>
		{/if}
	{/each}

	<div class="relative z-10 mx-auto max-w-full flex-col justify-center">
		<div class="flex max-w-full flex-col items-center justify-center gap-5 text-center">
			<p class="mt-70 text-lg font-bold tracking-widest text-primary uppercase">
				Shop Now <span><ArrowDown /></span>
			</p>
		</div>
	</div>
</div>

<div>
	<section class="py-12">
		<div class="grid grid-cols-6 gap-2 sm:grid-cols-3 lg:grid-cols-6">
			{#each categories as item (item.title)}
				<div class="flex flex-col items-center justify-center">
					<!-- Circle Image Container -->
					<div
						class="group relative flex h-42 w-42 items-center justify-center overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:border-primary hover:shadow-xl sm:h-42 sm:w-42"
					>
						<!-- Image with Blur Transition -->
						<img
							src={item.img}
							alt={item.title}
							class="h-full w-full object-cover transition-all duration-300 hover:scale-110 hover:blur-md"
						/>

						<!-- Overlay Backdrop + Centered Title -->
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/20 p-4 transition-all duration-300 hover:scale-110"
						>
							<span
								class="text-center font-sans text-sm font-extrabold tracking-wider text-white uppercase sm:text-base"
							>
								{item.title}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
