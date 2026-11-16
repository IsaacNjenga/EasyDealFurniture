import { PUBLIC_SERVER_URL } from '$env/static/public';
import { clearAnalyticsIdentity } from './identity';

const CONSENT_KEY = 'easydeal_analytics_consent';

export type AnalyticsConsent = 'accepted' | 'rejected';

export function getAnalyticsConsent(): AnalyticsConsent | null {
	if (typeof window === 'undefined') return null;

	const value = localStorage.getItem(CONSENT_KEY);

	if (value === 'accepted' || value === 'rejected') {
		return value;
	}

	return null;
}

export function hasAnalyticsConsent(): boolean {
	return getAnalyticsConsent() === 'accepted';
}

function saveLocalConsent(consent: AnalyticsConsent): void {
	localStorage.setItem(CONSENT_KEY, consent);

	window.dispatchEvent(
		new CustomEvent('analytics-consent-changed', {
			detail: consent
		})
	);
}

export async function updateAnalyticsConsent(consent: AnalyticsConsent): Promise<void> {
	if (typeof window === 'undefined') return;

	// Fail closed immediately when the visitor rejects.
	if (consent === 'rejected') {
		saveLocalConsent('rejected');
		clearAnalyticsIdentity();
	}

	const response = await fetch(`${PUBLIC_SERVER_URL.replace(/\/+$/, '')}/analytics/consent`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			granted: consent === 'accepted'
		})
	});

	if (!response.ok) {
		throw new Error(`Could not update analytics consent (${response.status})`);
	}

	// Only enable tracking after the backend confirms acceptance.
	if (consent === 'accepted') {
		saveLocalConsent('accepted');
	}
}
