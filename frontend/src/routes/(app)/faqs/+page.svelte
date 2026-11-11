<script lang="ts">
	import { resolve } from '$app/paths';
	import hero from '$lib/assets/images/home_img.webp';

	const faqs = [
		{
			question: 'How do I build a furniture quote?',
			answer:
				'Choose Add to quote on a product, then open My Quote. Adjust quantities to see an estimated item subtotal. Download the estimate or open a WhatsApp message to request a final quotation. Adding an item does not reserve stock or place an order.'
		},
		{
			question: 'Does my estimate include delivery and assembly?',
			answer:
				'The estimate shows saved website item prices. Delivery, assembly and any applicable taxes or other charges must be confirmed by our team. Share your delivery area and access details so the team can advise on the final quotation.'
		},
		{
			question: 'How do I check whether an item is available?',
			answer:
				'Ask our team to confirm the exact item, quantity and finish before ordering. The shop’s Confirmed in stock filter shows products marked in stock in the catalogue; availability may change.'
		},
		{
			question: 'What should I measure before buying furniture?',
			answer:
				'Measure the available floor space, doorways, stairs and lifts. Allow clearance for chair movement, doors and drawers. Confirm the product’s exact dimensions with the team, especially for larger desks, sofas and storage units.'
		},
		{
			question: 'Can I discuss a different colour, size or finish?',
			answer:
				'Send the product name or link together with your preferred finish and measurements. Our team can explain the options available for that item and confirm any price or lead-time differences before you decide.'
		},
		{
			question: 'Can you help me furnish an office or several rooms?',
			answer:
				'Build one quote with all the pieces and quantities you need. Include your room measurements, intended use, budget and delivery area when you share it, so our team has the information needed to discuss your setup.'
		},
		{
			question: 'Where can I see the furniture in person?',
			answer:
				'Visit EasyDeal Furniture on Ngara Road, opposite Ngara Post Office in Nairobi. Listed hours are Monday to Saturday, 8:00 a.m. to 6:00 p.m., and holidays, 9:00 a.m. to 5:00 p.m. Contact us before travelling to check hours and whether a particular piece is on display.'
		},
		{
			question: 'What should I confirm about returns, warranties and care?',
			answer:
				'Ask for the terms that apply to your chosen item before payment, including returns, warranty coverage and recommended care. These details can vary by product; our team should confirm them with your final quotation.'
		},
		{
			question: 'Will my saved quote stay up to date?',
			answer:
				'Your quote is stored in this browser using the item price shown when you added it. Prices and stock can change. Adding the item again refreshes its saved price and increases its quantity. Always request confirmation from our team before purchasing.'
		}
	];
</script>

<svelte:head
	><title>Furniture Buying FAQs | EasyDeal Furniture</title><meta
		name="description"
		content="Plan your furniture purchase: quotes, measuring your space, availability, delivery questions and visiting EasyDeal Furniture on Ngara Road, Nairobi."
	/></svelte:head
>

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
			Great furniture. Clearer answers.
		</h1>
		<p class="mt-5 text-lg text-white/80">From measuring your room to building your quote, here’s what to know before you make your next
			move.
		</p>
	</div>
</div>

<section class="mx-auto max-w-4xl space-y-4 px-6 py-16" aria-label="Frequently asked questions">
<div class="mx-auto max-w-4xl">
		<p class="text-sm font-bold tracking-widest text-primary uppercase">
			A little clarity goes a long way
		</p>
	</div>
	{#each faqs as faq (faq)}<details class="rounded-lg border bg-card p-5">
			<summary class="cursor-pointer text-lg font-bold">{faq.question}</summary>
			<p class="mt-4 leading-relaxed text-muted-foreground">{faq.answer}</p>
		</details>{/each}
	<div class="mt-10 rounded-lg bg-accent p-8">
		<h2 class="text-2xl font-bold">Have a question about your space?</h2>
		<p class="mt-3 text-muted-foreground">
			Bring your measurements, shortlist or ideas. We’ll help you work through the next step.
		</p>
		<a
			href={resolve("/contact")}
			class="mt-5 inline-block rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground"
			>Talk to our team</a
		>
	</div>
</section>
