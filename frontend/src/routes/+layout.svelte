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
		'Contemporary furniture in Nairobi, Kenya, including living room, bedroom, office, dining, and outdoor pieces designed for comfort and everyday living.';
	const canonicalUrl = $derived(`${siteUrl}${page.url.pathname}`);
	const structuredData = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FurnitureStore',
		name: siteName,
		url: siteUrl,
		logo: `${siteUrl}${favicon}`,
		image: `${siteUrl}${favicon}`,
		telephone: '+254118091020',
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Ngara Road, Opp. Ngara Post Office',
			addressLocality: 'Nairobi',
			addressCountry: 'KE'
		},
		openingHours: 'Mo-Sa 08:00-18:00'
	});
</script>

<svelte:head>
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
	<meta property="og:image" content={`${siteUrl}${favicon}`} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={siteName} />
	<meta name="twitter:description" content={description} />
	<script type="application/ld+json">
{@html structuredData}
	</script>
</svelte:head>
<Toaster position="top-right" />
<ModeWatcher />
<NavigationLoader />
{@render children()}
