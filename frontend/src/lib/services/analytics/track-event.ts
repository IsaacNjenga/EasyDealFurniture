
import { PUBLIC_SERVER_URL } from "$env/static/public";
import { hasAnalyticsConsent } from "$lib/consent";
import { getAnalyticsIdentity } from "$lib/identity";

export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "product_click"
  | "search"
  | "quote_start"
  | "quote_submit";

export interface TrackEventPayload {
  eventName: AnalyticsEventName;

  pagePath?: string;

  entityType?: "CATALOG" | "CATEGORY" | "BANNER" | "PAGE" | "NONE";
  entityId?: string;

  searchQuery?: string;
  searchResultsCount?: number;

  placement?: string;
  position?: number;

  interactionChannel?: "WHATSAPP" | "PHONE" | "WEBSITE" | "OTHER";
}

export async function trackEvent(
  event: TrackEventPayload
): Promise<boolean> {
  // Never track without explicit consent.
  if (!hasAnalyticsConsent()) {
    return false;
  }

  try {
    const identity = getAnalyticsIdentity();

    const payload = {
      ...event,

      eventId: crypto.randomUUID(),

      visitorId: identity.visitorId,
      sessionId: identity.sessionId,

      pagePath: event.pagePath ?? window.location.pathname,

      occurredAt: new Date().toISOString()
    };

    const response = await fetch(
      `${PUBLIC_SERVER_URL.replace(/\/+$/, "")}/analytics/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        keepalive: true,
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      console.warn(
        "Analytics event rejected:",
        response.status
      );

      return false;
    }

    return true;

  } catch (error) {
    // Analytics must never interrupt the shopping experience.
    console.error("Analytics tracking failed:", error);

    return false;
  }
}
