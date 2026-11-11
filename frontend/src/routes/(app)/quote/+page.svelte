<script lang="ts">
	import hero from '$lib/assets/images/outdoor_comfort.webp';
	import { onMount } from 'svelte';
	import { quote } from '$lib/stores/quote.svelte';
	import { formatPrice } from '$lib/utils';
	import { resolve } from '$app/paths';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { SALES_WHATSAPP } from '$lib/commerce';

	let customer = $state('');
	let delivery = $state('');

	onMount(() => quote.init());
	const text = $derived(
		[
			'EasyDeal Furniture — Estimate',
			...quote.items.map(
				(item) =>
					`${item.name}: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}\nhttps://easydealfurniture.co.ke/shop/${encodeURIComponent(item.slug)}`
			),
			`Estimated item subtotal: ${formatPrice(quote.total)}`,
			'Indicative website prices only. Delivery, assembly and any applicable taxes or other charges must be confirmed by the team. Availability and final pricing subject to confirmation.',
			customer.trim() ? `Name: ${customer.trim()}` : '',
			delivery.trim() ? `Delivery / collection: ${delivery.trim()}` : '',
			'Please confirm availability and send a final quotation.'
		]
			.filter(Boolean)
			.join('\n\n')
	);
	function download() {
		const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = 'easydeal-estimate.txt';
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}
</script>

<svelte:head><title>My Quote</title><meta name="robots" content="noindex, follow" /></svelte:head>
<div
	class="relative flex min-h-112 w-full items-center justify-center overflow-hidden bg-background pt-20"
>
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url({hero});"
	>
		<div class="absolute inset-0 bg-black/40 dark:bg-black/45"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
			Your next space, item by item.
		</h1>
		<p class="mt-5 text-lg text-white/80">
			Bring your favourites together, adjust quantities and generate an estimate before you speak to
			our team.
		</p>
	</div>
</div>
<div class="mx-auto max-w-6xl px-2 py-6 sm:px-2">
	<div class="mx-auto max-w-6xl py-4 sm:py-6">
		<p class="text-sm font-bold tracking-widest text-primary uppercase">
			Plan your space. Know your budget.
		</p>
	</div>
	{#if !quote.initialized}<p role="status">Loading your quote…</p>
	{:else if quote.items.length === 0}<div class="border bg-card p-10 text-center">
			<h2 class="text-2xl font-bold">Start with a piece you love.</h2>
			<p class="my-4 text-muted-foreground">
				Choose “Add to quote” on any product to build your estimate.
			</p>
			<a
				class="inline-block rounded-md bg-primary px-5 py-3 text-primary-foreground"
				href={resolve('/shop')}>Explore furniture</a
			>
		</div>
	{:else}
		<div class="grid gap-4 lg:grid-cols-[2fr_1fr]">
			<div class="space-y-2">
				{#each quote.items as item (item.id)}
					<article class="flex flex-wrap items-center justify-between border gap-3 bg-card p-3">
						<div class="ml-3 flex w-auto flex-row items-center gap-4">
							<div>
								{#if item.image.length > 0}
									<img
										class="h-20 w-20 rounded-none object-cover"
										src={item.image[0]}
										alt={item.name}
									/>
								{:else}
									<div
										class="flex h-20 w-20 items-center justify-center rounded bg-muted text-center text-xs text-muted-foreground"
										aria-label={`Image unavailable for ${item.name}`}
									>
										Image unavailable
									</div>
								{/if}
							</div>
							<div>
								<a
									class="font-bold uppercase hover:underline"
									href={resolve(`/shop/${encodeURIComponent(item.slug)}`)}>{item.name}</a
								>
								<p class="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
							</div>
						</div>

						<div class="flex flex-row items-center justify-between gap-6">
							<div class="flex items-center">
								<Label for="search" class="text-sm">Qty</Label>
								<Input
									aria-label={`Quantity for ${item.name}`}
									class="ml-2 w-14 rounded border bg-background p-2"
									type="number"
									min="1"
									max="999"
									value={item.quantity}
									onchange={(event) => {
										quote.update(item.id, event.currentTarget.valueAsNumber);
										event.currentTarget.value = String(item.quantity);
									}}
								/>
							</div>

							<strong>{formatPrice(item.price * item.quantity)}</strong><button
								class="text-sm underline"
								onclick={() => quote.remove(item.id)}
								>Remove<span class="sr-only"> {item.name}</span></button
							>
						</div>
					</article>
				{/each}
				<div class="flex justify-between">
					<a class="underline" href={resolve('/shop')}>Keep browsing</a><button
						class="text-sm underline"
						onclick={() => quote.clear()}>Clear quote</button
					>
				</div>
			</div>
			<aside class="space-y-4 self-start rounded-lg border bg-card p-6">
				<h2 class="text-xl font-bold">Your estimate</h2>
				<p class="flex justify-between gap-4">
					Item subtotal <strong>{formatPrice(quote.total)}</strong>
				</p>
				<p class="text-sm leading-relaxed text-muted-foreground">
					This is an estimate based on saved website prices, not a confirmed order. Our team will
					confirm current prices, stock, delivery, assembly and any other applicable charges.
				</p>
				<label class="block text-sm"
					>Your name (optional)<input
						class="mt-2 w-full rounded border bg-background p-3"
						autocomplete="name"
						maxlength="100"
						bind:value={customer}
					/></label
				>
				<label class="block text-sm"
					>Delivery area or collection (optional)<input
						class="mt-2 w-full rounded border bg-background p-3"
						maxlength="200"
						placeholder="e.g. Westlands, Nairobi"
						bind:value={delivery}
					/></label
				>
				<a
					class="block rounded-md bg-primary p-3 text-center font-bold text-primary-foreground"
					href={`https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(text)}`}
					target="_blank"
					rel="noopener noreferrer">Request final quote on WhatsApp</a
				>
				<button class="w-full rounded-md border p-3 font-semibold" onclick={download}
					>Download estimate (.txt)</button
				>
				<p class="text-xs text-muted-foreground">
					Your items stay in this browser. Contact details are included only when you download or
					share the estimate.
				</p>
			</aside>
		</div>
	{/if}
</div>
