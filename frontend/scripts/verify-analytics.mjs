import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

let consent = false;
let storageError = false;
const events = [];
globalThis.analyticsTest = {
	consent() {
		if (storageError) throw Error('storage unavailable');
		return consent;
	},
	async track(event) {
		if (!globalThis.analyticsTest.consent()) return false;
		events.push(event);
		return true;
	}
};
const source = (
	await readFile(
		new URL('../src/lib/services/analytics/website-events.ts', import.meta.url),
		'utf8'
	)
)
	.replace(
		/import .* from '\$lib\/consent';/,
		'const hasAnalyticsConsent = globalThis.analyticsTest.consent;'
	)
	.replace(
		/import .* from '\.\/track-event';/,
		'const trackEvent = globalThis.analyticsTest.track;'
	);
const code = ts.transpileModule(source, {
	compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
}).outputText;
const { recordWebsiteEvent, recordSearch, productImpression, searchResults } = await import(
	`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
);

// Fake browser and clock: exercise visibility, consent changes and cleanup deterministically.
globalThis.window = new EventTarget();
globalThis.document = Object.assign(new EventTarget(), { visibilityState: 'visible' });
let observer;
globalThis.IntersectionObserver = class {
	constructor(callback) {
		this.callback = callback;
		// Capture the constructed fake observer so tests can simulate visibility.
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		observer = this;
	}
	observe() {}
	disconnect() {
		this.disconnected = true;
	}
	show(ratio) {
		this.callback([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]);
	}
};
const timers = new Map();
let timerId = 0;
globalThis.setTimeout = (fn) => {
	timers.set(++timerId, fn);
	return timerId;
};
globalThis.clearTimeout = (id) => timers.delete(id);
const flush = async () => {
	const pending = [...timers.values()];
	timers.clear();
	for (const fn of pending) await fn();
};
const changeConsent = (granted) => {
	consent = granted;
	window.dispatchEvent(
		new CustomEvent('analytics-consent-changed', { detail: granted ? 'accepted' : 'rejected' })
	);
};

assert.equal(await recordWebsiteEvent({ eventName: 'quote_phone_click' }), false);
storageError = true;
assert.equal(await recordWebsiteEvent({ eventName: 'quote_start' }), false);
storageError = false;
const impression = productImpression(
	{},
	{ entityId: 'chair', placement: 'shop_listing', position: 0 }
);
observer.show(1);
await flush();
assert.equal(events.length, 0);
changeConsent(true);
observer.show(0.4);
await flush();
assert.equal(events.length, 0);
observer.show(0.5);
observer.show(0);
await flush();
assert.equal(events.length, 0);
observer.show(1);
document.visibilityState = 'hidden';
document.dispatchEvent(new Event('visibilitychange'));
await flush();
assert.equal(events.length, 0);
document.visibilityState = 'visible';
document.dispatchEvent(new Event('visibilitychange'));
await flush();
assert.equal(events.length, 1);
assert.deepEqual(events[0], {
	eventName: 'product_impression',
	entityType: 'CATALOG',
	entityId: 'chair',
	placement: 'shop_listing',
	position: 0
});
observer.show(1);
await flush();
assert.equal(events.length, 1);
impression.destroy();
assert.equal(observer.disconnected, true);

await recordSearch('  office\n chair  ', 0, 'search_results');
assert.equal(events.at(-1).searchQuery, 'office chair');
assert.equal(events.at(-1).searchResultsCount, 0);
await recordSearch('x'.repeat(250), 1, 'search_results');
assert.equal(events.at(-1).searchQuery.length, 200);
events.length = 0;
changeConsent(false);
const search = searchResults(
	{},
	{ query: 'chair', count: 0, ready: true, placement: 'search_results' }
);
await flush();
assert.equal(events.length, 0);
changeConsent(true);
await flush();
assert.equal(events.length, 1);
changeConsent(true);
await flush();
assert.equal(events.length, 1);
search.update({ query: 'chair', count: 5, ready: false, placement: 'search_results' });
await flush();
assert.equal(events.length, 1);
search.update({ query: 'desk', count: 2, ready: true, placement: 'search_results' });
search.update({ query: 'table', count: 3, ready: true, placement: 'search_results' });
await flush();
assert.equal(events.length, 2);
assert.equal(events.at(-1).searchQuery, 'table');
search.update({ query: 'sofa', count: 4, ready: true, placement: 'search_results' });
changeConsent(false);
await flush();
assert.equal(events.length, 2);
search.destroy();
assert.equal(timers.size, 0);
console.log(
	'Passed: consent gating, storage failure isolation, visible impressions, deduplication, search normalization, zero results, stale searches, revocation and cleanup.'
);
