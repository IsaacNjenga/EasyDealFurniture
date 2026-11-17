import { hasAnalyticsConsent } from '$lib/consent';
import { trackEvent, type TrackEventPayload } from './track-event';

export type ProductPlacement =
	| 'home_best_sellers'
	| 'home_fresh_designs'
	| 'shop_listing'
	| 'search_results'
	| 'wishlist'
	| 'product_related';

// Matches EasyManager's analytics.types.ts. Keep the existing transport unchanged.
type WebsiteEvent = Omit<TrackEventPayload, 'eventName'> & {
	eventName:
		| TrackEventPayload['eventName']
		| 'category_click'
		| 'product_impression'
		| 'quote_whatsapp_click'
		| 'quote_phone_click';
};

export function recordWebsiteEvent(event: WebsiteEvent): Promise<boolean> {
	// Also contain consent/storage errors: analytics must never break an action.
	try {
		return trackEvent(event as TrackEventPayload).catch(() => false);
	} catch {
		return Promise.resolve(false);
	}
}

export function recordSearch(query: string, count: number, placement: string) {
	const normalized = query
		.trim()
		// Backend rejects control characters in search text.
		// eslint-disable-next-line no-control-regex
		.replace(/[\u0000-\u001f\u007f]/g, ' ')
		.replace(/\s+/g, ' ')
		.slice(0, 200)
		.trim();
	if (!normalized) return Promise.resolve(false);
	return recordWebsiteEvent({
		eventName: 'search',
		entityType: 'NONE',
		searchQuery: normalized,
		searchResultsCount: count,
		placement,
		interactionChannel: 'WEBSITE'
	});
}

type SearchResult = { query: string; count: number; ready: boolean; placement: string };

export function searchResults(_node: HTMLElement, initial: SearchResult) {
	let details = initial;
	let lastRecorded = '';
	let generation = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;
	function schedule() {
		clearTimeout(timer);
		const current = ++generation;
		const snapshot = details;
		if (!snapshot.ready || !snapshot.query.trim()) {
			lastRecorded = '';
			return;
		}
		const key = JSON.stringify([snapshot.query.trim(), snapshot.count, snapshot.placement]);
		if (key === lastRecorded) return;
		timer = setTimeout(async () => {
			const success = await recordSearch(snapshot.query, snapshot.count, snapshot.placement);
			if (current === generation && success) lastRecorded = key;
		}, 500);
	}
	function consentChanged(event: Event) {
		if ((event as CustomEvent).detail === 'rejected') lastRecorded = '';
		schedule();
	}
	schedule();
	window.addEventListener('analytics-consent-changed', consentChanged);
	return {
		update(next: SearchResult) {
			details = next;
			schedule();
		},
		destroy() {
			generation++;
			clearTimeout(timer);
			window.removeEventListener('analytics-consent-changed', consentChanged);
		}
	};
}

type Impression = { entityId: string; placement: ProductPlacement; position: number };

// One impression per mounted product and placement after 1s at least 50% visible.
// No historical impressions are replayed when consent is granted.
export function productImpression(node: HTMLElement, initial: Impression) {
	let details = initial;
	let visible = false;
	let sent = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	const cancel = () => {
		clearTimeout(timer);
		timer = undefined;
	};
	function schedule() {
		cancel();
		if (sent || !visible || document.visibilityState !== 'visible') return;
		try {
			if (!hasAnalyticsConsent()) return;
		} catch {
			return;
		}
		timer = setTimeout(() => {
			sent = true;
			void recordWebsiteEvent({
				eventName: 'product_impression',
				entityType: 'CATALOG',
				...details
			});
		}, 1000);
	}
	const observer =
		typeof IntersectionObserver === 'undefined'
			? null
			: new IntersectionObserver(
					([entry]) => {
						visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
						schedule();
					},
					{ threshold: [0, 0.5] }
				);
	observer?.observe(node);
	window.addEventListener('analytics-consent-changed', schedule);
	document.addEventListener('visibilitychange', schedule);
	return {
		update(next: Impression) {
			if (next.entityId !== details.entityId || next.placement !== details.placement) sent = false;
			details = next;
			schedule();
		},
		destroy() {
			cancel();
			observer?.disconnect();
			window.removeEventListener('analytics-consent-changed', schedule);
			document.removeEventListener('visibilitychange', schedule);
		}
	};
}
