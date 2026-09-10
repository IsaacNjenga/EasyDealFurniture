<script lang="ts">
	import StoreMap from '$lib/components/common/StoreMap.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Phone, Clock, MapPin } from '@lucide/svelte';

	const contactInfo = [
		{
			title: 'Location',
			info: 'Ngara Road, Nairobi, Kenya',
			info2: 'Opp. Ngara Post Office',
			icon: MapPin
		},
		{
			title: 'Call Us',
			info: '+254 720 731-982',
			info2: '+254 722 528-672',
			icon: Phone
		},
		{
			title: 'Business Hours',
			info: 'Mon - Sat: 8:00 a.m - 6:00 p.m',
			info2: 'Holidays: 9:00 a.m - 5:00 p.m',
			icon: Clock
		}
	];

	const storeLat = -1.276502;
	const storeLng = 36.826517;
</script>

<svelte:head>
	<title>Contact | EasyDeal Furniture</title>
</svelte:head>
<!-- Hero Section with Background Overlay -->
<div
	class="relative flex min-h-112 w-full items-center justify-center overflow-hidden bg-background pt-20"
>
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('https://images.unsplash.com/photo-1691036561573-4b76998b60de?w=900');"
	>
		<div class="absolute inset-0 bg-black/60 dark:bg-black/75"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
		<p class="text-lg font-extrabold tracking-widest text-primary uppercase">Get In Touch</p>
		<p class="mt-4 text-base text-slate-200 sm:text-lg">
			Have questions about custom pieces, delivery, or pricing? Reach out to our team or visit our
			showroom.
		</p>
	</div>
</div>

<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<!-- Contact Cards Grid -->
	<section class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each contactInfo as item (item.title)}
			<div
				class="group flex flex-col items-center rounded-none border border-border bg-card p-8 text-center shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
			>
				<div
					class="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
				>
					<item.icon class="h-6 w-6 stroke-[2.2]" />
				</div>

				<h3 class="mt-4 font-roboto text-lg font-bold tracking-wide text-foreground uppercase">
					{item.title}
				</h3>

				<p class="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
					{item.info}
				</p>
				<p class="text-xs text-muted-foreground">
					{item.info2}
				</p>
			</div>
		{/each}
	</section>
	<!-- Form & Map Side-by-Side Section -->
	<section class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
		<!-- Contact Form -->
		<div
			class="flex flex-col justify-between rounded-none border border-border bg-card p-8 shadow-lg lg:col-span-6"
		>
			<div>
				<p class="text-xs font-bold tracking-widest text-primary uppercase">Send An Email</p>
				<h2 class="mt-1 font-roboto text-3xl font-extrabold tracking-tight text-foreground">
					Drop Us a Message
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
					Thank you for showing interest in our products. We prioritize customer satisfaction above
					all. Please fill out the form and we'll reply as soon as possible.
				</p>
			</div>

			<form class="mt-8 flex flex-col gap-4" onsubmit={(e) => e.preventDefault()}>
				<div>
					<label for="name" class="block text-xs font-bold text-foreground uppercase"
						>Full Name</label
					>
					<input
						id="name"
						type="text"
						class="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						required
					/>
				</div>

				<div>
					<label for="email" class="block text-xs font-bold text-foreground uppercase"
						>Email Address</label
					>
					<input
						id="email"
						type="email"
						class="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						required
					/>
				</div>

				<div>
					<label for="message" class="block text-xs font-bold text-foreground uppercase"
						>Message</label
					>
					<textarea
						id="message"
						rows="4"
						placeholder="Tell us what you're looking for..."
						class="mt-1.5 w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						required></textarea>
				</div>

				<Button
					type="submit"
					class="mt-2 gap-2 rounded-lg bg-black py-6 text-sm font-bold text-white shadow-md hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-primary"
				>
					Send
				</Button>
			</form>
		</div>

		<!-- Interactive Map Container -->
		<div class="flex flex-col gap-4 lg:col-span-6">
			<div>
				<p class="text-xs font-bold tracking-widest text-primary uppercase">Visit Our Showroom</p>
				<h2 class="mt-1 font-roboto text-3xl font-extrabold tracking-tight text-foreground">
					Location & Directions
				</h2>
			</div>
			<div class="h-full">
				<StoreMap {storeLat} {storeLng} />
			</div>
		</div>
	</section>
</div>
