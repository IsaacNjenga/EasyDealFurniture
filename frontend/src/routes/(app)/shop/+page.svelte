<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	const backgrounds = [
		'https://images.unsplash.com/photo-1758630737900-a28682c5aa69?w=1600',
		'https://images.unsplash.com/photo-1787496994477-e260648f7af4?w=1600',
		'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=1600'
	];

	const categories = [
		{
			img: 'https://images.unsplash.com/photo-1705909770198-7e83c24e1616?w=1600',
			title: 'Office Furniture'
		},
		{
			img: 'https://images.unsplash.com/photo-1632829401795-2745c905ac77?w=1600',
			title: 'Bedroom Furniture'
		},
		{
			img: 'https://images.unsplash.com/photo-1632583824020-937ae9564495?w=1600',
			title: 'Kitchen Furniture'
		},
		{
			img: 'https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?w=1600',
			title: 'Outdoor Furniture'
		},
		{
			img: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=1600',
			title: 'Living Room Furniture'
		},
		{
			img: 'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=1600',
			title: 'Second-Hand Items'
		}
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

<svelte:head>
	<title>Shop | EasyDeal Furniture</title>
</svelte:head>
<div class="relative min-h-90 w-full overflow-hidden bg-background sm:min-h-150">
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
			<span class="mt-56 text-lg font-bold tracking-widest text-primary uppercase sm:mt-70">
				Shop Now
			</span>
		</div>
	</div>
</div>

<div>
	<section class="py-12">
		<div class="mx-8 grid grid-cols-2 gap-1 px-2 sm:mx-4 sm:grid-cols-3 lg:grid-cols-6 lg:px-10">
			{#each categories as item (item.title)}
				<div class="flex flex-col items-center justify-center">
					<!-- Circle Image Container -->
					<div
						class="group relative flex aspect-square w-full max-w-42 items-center justify-center overflow-hidden rounded-md shadow-md transition-all duration-300 hover:cursor-pointer hover:border-primary hover:shadow-xl"
					>
						<!-- Image with Blur Transition -->
						<img
							src={item.img}
							alt={item.title}
							class="h-full w-full object-cover transition-all duration-300 hover:scale-110 hover:blur-lg"
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
