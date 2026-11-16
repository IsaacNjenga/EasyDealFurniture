
const CONSENT_KEY = "easydeal_analytics_consent";

export type AnalyticsConsent = "accepted" | "rejected";

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(CONSENT_KEY);

  if (value === "accepted" || value === "rejected") {
    return value;
  }

  return null;
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === "accepted";
}

export function saveAnalyticsConsent(
  consent: AnalyticsConsent
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(CONSENT_KEY, consent);

  // Notify the application that the preference changed.
  window.dispatchEvent(
    new CustomEvent("analytics-consent-changed", {
      detail: consent,
    })
  );
}
