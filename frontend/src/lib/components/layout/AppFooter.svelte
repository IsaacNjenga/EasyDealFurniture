<script lang="ts">
	import { MapPin, Phone, Mail, Clock, 
        // Send
     } from '@lucide/svelte';
	// import Button from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';
	// import { toast } from 'svelte-sonner';

	// let newsletterEmail = $state('');

	// const handleSubscribe = (e: SubmitEvent) => {
	// 	e.preventDefault();
	// 	if (!newsletterEmail) return;

	// 	toast.success('Thank you for subscribing to our newsletter!');
	// 	newsletterEmail = '';
	// };

	const quickLinks = [
		{ name: 'Home', href: '/home' },
		{ name: 'Shop', href: '/shop' },
		{ name: 'My Wishlist', href: '/wishlist' },
		{ name: 'Contact Us', href: '/contact' }
	];

	// const customerCare = [
	// 	{ name: 'Shipping & Delivery', href: '/shipping' },
	// 	{ name: 'Return Policy', href: '/returns' },
	// 	{ name: 'Custom Furniture FAQs', href: '/faqs' },
	// 	{ name: 'Terms of Service', href: '/terms' },
	// 	{ name: 'Privacy Policy', href: '/privacy' }
	// ];
</script>

<footer class="border-t border-border bg-slate-980 text-slate-200">
	<!-- Main Footer Content -->
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Column 1: Brand Info -->
			<div class="lg:col-span-2">
				<div class="flex items-center gap-2">
					<span class="font-sans text-2xl font-black tracking-tight text-white">
						EASYDEAL <span class="text-primary">FURNITURE</span>
					</span>
				</div>
				<p class="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
					Crafting premium ergonomic office chairs, velvet living room sets, and handcrafted dining
					tables in Nairobi. Quality furniture engineered for comfort and modern aesthetic.
				</p>

				<!-- Newsletter Subscription Form
				<div class="mt-6 max-w-sm">
					<p class="text-xs font-bold tracking-wider text-slate-300 uppercase">
						Subscribe to Get Offers
					</p>
					<form onsubmit={handleSubscribe} class="mt-2.5 flex items-center gap-2">
						<input
							type="email"
							bind:value={newsletterEmail}
							placeholder="Enter your email"
							required
							class="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
						/>
						<Button
							type="submit"
							size="icon"
							class="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
						>
							<Send class="h-4 w-4" />
						</Button>
					</form>
				</div> -->
			</div>

			<!-- Column 2: Quick Links -->
			<div>
				<h3 class="text-xs font-extrabold tracking-widest text-primary uppercase">Quick Links</h3>
				<ul class="mt-4 space-y-2.5 text-sm">
					{#each quickLinks as link (link.name)}
						<li>
							<a
								href={resolve(link.href)}
								class="text-slate-400 transition-colors hover:text-white"
							>
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Column 3: Customer Care -->
			<!-- <div>
				<h3 class="text-xs font-extrabold tracking-widest text-primary uppercase">Customer Care</h3>
				<ul class="mt-4 space-y-2.5 text-sm">
					{#each customerCare as item (item.name)}
						<li>
							<a
								href={resolve(item.href)}
								class="text-slate-400 transition-colors hover:text-white"
							>
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</div> -->

			<!-- Column 4: Contact & Store Details -->
			<div>
				<h3 class="text-xs font-extrabold tracking-widest text-primary uppercase">Showroom Info</h3>
				<ul class="mt-4 space-y-3 text-sm text-slate-400">
					<li class="flex items-start gap-2.5">
						<MapPin class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
						<span>Ngara Road, Opp. Ngara Post Office, Nairobi</span>
					</li>
					<li class="flex items-center gap-2.5">
						<Phone class="h-4 w-4 shrink-0 text-primary" />
						<div class="flex flex-col">
							<a href="tel:+254720731982" class="hover:text-white">+254 720 731-982</a>
							<a href="tel:+254722528672" class="hover:text-white">+254 722 528-672</a>
						</div>
					</li>
					<li class="flex items-center gap-2.5">
						<Mail class="h-4 w-4 shrink-0 text-primary" />
						<a href="mailto:info@easydealfurniture.co.ke" class="hover:text-white"
							>info@easydealfurniture.co.ke</a
						>
					</li>
					<li class="flex items-start gap-2.5 pt-1">
						<Clock class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
						<div class="text-xs leading-tight">
							<p class="font-semibold text-slate-300">Mon - Sat: 8:00 AM - 6:00 PM</p>
							<p class="mt-0.5 text-slate-400">Holidays: 9:00 AM - 5:00 PM</p>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Bar: Socials & Rights -->
		<div
			class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row"
		>
			<p class="text-xs text-slate-500">
				&copy; {new Date().getFullYear()} EasyDeal Furniture. All rights reserved.
			</p>

			<!-- Social Links -->
			<div class="flex items-center gap-4 text-slate-400">
				<a
					href="https://facebook.com"
					target="_blank"
					aria-label="Facebook"
					class="transition-colors hover:text-white"
				>
					<!-- <Facebook class="h-5 w-5" /> -->
				</a>
				<a
					href="https://instagram.com"
					target="_blank"
					aria-label="Instagram"
					class="transition-colors hover:text-white"
				>
					<!-- <Instagram class="h-5 w-5" /> -->
				</a>
				<a
					href="https://twitter.com"
					target="_blank"
					aria-label="Twitter"
					class="transition-colors hover:text-white"
				>
					<!-- <Twitter class="h-5 w-5" /> -->
				</a>
			</div>
		</div>
	</div>
</footer>
