<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import NavigationLoader from '$lib/components/common/NavigationLoader.svelte';
	import AnalyticsConsentBanner from '$lib/components/common/ConsentBanner.svelte';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { hasAnalyticsConsent } from '$lib/consent';
	import { trackEvent } from '$lib/services/analytics/track-event';

	let { children } = $props();
	let lastTrackedPagePath: string | null = null;

	const pendingPageViews = new SvelteSet<string>();

	async function recordPageView(force = false): Promise<void> {
		if (!hasAnalyticsConsent()) return;

		const pagePath = window.location.pathname;

		// Avoid duplicate events when consent is accepted on an
		// already-tracked page.
		if (!force && lastTrackedPagePath === pagePath) return;

		// Avoid sending the same page view twice while a request is pending.
		if (pendingPageViews.has(pagePath)) return;

		pendingPageViews.add(pagePath);

		try {
			const success = await trackEvent({
				eventName: 'page_view',
				pagePath,
				entityType: 'PAGE'
			});

			if (success) {
				lastTrackedPagePath = pagePath;
			}
		} finally {
			pendingPageViews.delete(pagePath);
		}
	}

	// Initial page load and subsequent SvelteKit navigation.
	afterNavigate(() => {
		void recordPageView(true);
	});

	// Handle consent changes without requiring a page reload.
	onMount(() => {
		function handleConsentChange(event: Event) {
			const consent = (event as CustomEvent<'accepted' | 'rejected'>).detail;

			if (consent === 'rejected') {
				lastTrackedPagePath = null;
				return;
			}

			if (consent === 'accepted') {
				void recordPageView();
			}
		}

		window.addEventListener('analytics-consent-changed', handleConsentChange);

		return () => {
			window.removeEventListener('analytics-consent-changed', handleConsentChange);
		};
	});

	const siteUrl = 'https://easydealfurniture.co.ke';
	const siteName = 'EasyDeal Furniture';
	const description =
		'Furniture for home and office in Nairobi. Explore the EasyDeal collection, plan your budget with a quote and visit our Ngara Road showroom.';
	const canonicalUrl = $derived(`${siteUrl}${page.url.pathname}`);
</script>

<svelte:head>
	<meta name="google-site-verification" content="_w4wwsi4aw_brrrQZ88HoTyA_15GVitk1wdXWdJ-up4" />
	<title>{siteName} | Modern Furniture in Nairobi</title>
	<meta name="description" content={description} />
	<meta name="theme-color" content="#f8f5ef" />
	<meta
		name="robots"
		content={['/quote', '/wishlist', '/search'].includes(page.url.pathname)
			? 'noindex, follow'
			: 'index, follow'}
	/>
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
<AnalyticsConsentBanner />
{@render children()}
