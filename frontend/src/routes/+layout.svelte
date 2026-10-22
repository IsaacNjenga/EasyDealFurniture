<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import NavigationLoader from '$lib/components/common/NavigationLoader.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const siteUrl = 'https://easydealfurniture.co.ke';
	const siteName = 'EasyDeal Furniture';
	const description =
		"From comfy ergonomic chairs to spacious desks and smart storage solutions, we've got everything you need to stay productive and organized.";
	const canonicalUrl = $derived(`${siteUrl}${page.url.pathname}`);
</script>

<svelte:head>
	<meta name="google-site-verification" content="_w4wwsi4aw_brrrQZ88HoTyA_15GVitk1wdXWdJ-up4" />
	<title>{siteName} | Modern Furniture in Nairobi</title>
	<meta name="description" content={description} />
	<meta name="theme-color" content="#f8f5ef" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={canonicalUrl} />
	<link rel="icon" href={favicon} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={siteName} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={new URL(favicon, siteUrl).href} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={siteName} />
	<meta name="twitter:description" content={description} />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "FurnitureStore",
			"name": "EasyDeal Furniture",
			"url": "https://easydealfurniture.co.ke",
			"telephone": "+254118091020",
			"address": {
				"@type": "PostalAddress",
				"streetAddress": "Ngara Road, Opp. Ngara Post Office",
				"addressLocality": "Nairobi",
				"addressCountry": "KE"
			},
			"openingHoursSpecification": [
				{
					"@type": "OpeningHoursSpecification",
					"dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
					"opens": "08:00",
					"closes": "18:00"
				}
			]
		}
	</script>
</svelte:head>
<Toaster position="top-right" />
<ModeWatcher />
<NavigationLoader />
{@render children()}
