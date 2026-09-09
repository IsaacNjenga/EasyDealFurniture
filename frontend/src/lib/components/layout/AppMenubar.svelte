<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationItems } from '$lib/config/navigation';
	import { toggleMode } from 'mode-watcher';
	import { Search, ShoppingCart, MoonIcon, SunIcon } from '@lucide/svelte';

	import icon from '$lib/assets/icon-white.png';

	// Track scroll state for shrink & opacity animation
	let isScrolled = $state(false);

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="w-full transition-all duration-300 ease-in-out {isScrolled
		? 'bg-amber-900/30 py-2.5 shadow-md backdrop-blur-md'
		: 'bg-transparent py-5'}"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
		<!-- Left: Brand Logo & Title -->
		<a href={resolve('/home')} class="group text-decoration-none flex items-center gap-3">
			<div
				class="relative overflow-hidden rounded-full bg-primary p-2 shadow-sm transition-transform duration-300 group-hover:scale-105"
			>
				<img
					src={icon}
					alt="EasyDeal Furniture Logo"
					class="h-10 w-10 object-cover transition-all duration-300 {isScrolled
						? 'h-9 w-9'
						: 'h-14 w-14'}"
				/>
			</div>
			<span
				class="font-sans text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-amber-600 dark:text-amber-50"
			>
				EasyDeal <span
					class="-mt-1 block font-sans text-xl font-extrabold tracking-widest text-amber-600 uppercase"
					>Furniture</span
				>
			</span>
		</a>

		<!-- Center: Navigation Menu -->
		<NavigationMenu.Root class="relative z-10 flex max-w-max flex-1 items-center justify-center">
			<NavigationMenu.List
				class="group flex flex-1 list-none items-center justify-center gap-1 sm:gap-2"
			>
				{#each navigationItems as item (item.href)}
					{@const href = resolve(item.href)}
					{@const isActive =
						page.url.pathname === item.href || page.url.pathname.startsWith(`${item.href}/`)}

					<NavigationMenu.Item>
						{#snippet child({ props })}
							<a
								{href}
								{...props}
								class="relative inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-bold tracking-wider uppercase transition-all duration-200 ease-in-out hover:text-amber-600
                                {isActive
									? 'font-extrabold text-amber-600'
									: 'text-slate-800 hover:bg-amber-50/50 dark:text-slate-200 dark:hover:bg-slate-800/50'}"
							>
								<span>{item.title}</span>
								{#if isActive}
									<span class="absolute right-3 bottom-0 left-3 h-0.5 rounded-full bg-amber-600"
									></span>
								{/if}
							</a>
						{/snippet}
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<!-- Right: Action Buttons (Search & Cart) -->
		<div class="flex items-center gap-2 sm:gap-4">
			<button
				type="button"
				aria-label="Search"
				class="rounded-full p-2 text-slate-700 transition-all duration-200 hover:bg-amber-100/60 hover:text-amber-600 dark:text-slate-200 dark:hover:bg-slate-800"
			>
				<Search class="h-5 w-5 stroke-[2.2]" />
			</button>

			<button
				type="button"
				aria-label="Shopping Cart"
				class="relative rounded-full p-2 text-slate-700 transition-all duration-200 hover:bg-amber-100/60 hover:text-amber-600 dark:text-slate-200 dark:hover:bg-slate-800"
			>
				<ShoppingCart class="h-5 w-5 stroke-[2.2]" />
				<!-- Optional Cart Badge Indicator -->
				<span class="absolute top-1 right-1 flex h-2 w-2">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"
					></span>
					<span class="relative inline-flex h-2 w-2 rounded-full bg-amber-600"></span>
				</span>
			</button>

			<button class="cursor-pointer gap-2" onclick={toggleMode}>
				<div class="relative flex size-4 shrink-0 items-center justify-center">
					<SunIcon class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<MoonIcon
						class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
					/>
				</div></button
			>
		</div>
	</div>
</header>
