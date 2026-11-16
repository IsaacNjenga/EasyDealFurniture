
import { hasAnalyticsConsent } from "../../consent";

export type AnalyticsEventName =
  | "page_view"
  | "product_impression"
  | "product_click"
  | "product_view"
  | "banner_impression"
  | "banner_click"
  | "category_click"
  | "search"
  | "quote_start"
  | "quote_submit"
  | "quote_whatsapp_click"
  | "quote_phone_click";

export interface TrackEventPayload {
  eventName: AnalyticsEventName;
  pagePath: string;
  entityType?: "CATALOG" | "CATEGORY" | "BANNER" | "PAGE" | "NONE";
  entityId?: string;
  searchQuery?: string;
  searchResultsCount?: number;
  placement?: string;
  position?: number;
  interactionChannel?: "WHATSAPP" | "PHONE" | "WEBSITE" | "OTHER";
  occurredAt?: string;
}

export async function trackEvent(
  event: TrackEventPayload
): Promise<void> {
  // Central consent check: deny by default.
  if (!hasAnalyticsConsent()) {
    return;
  }

  try {
    await fetch("/api/analytics/events", { //placeholder for the actual endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...event,
        occurredAt: event.occurredAt ?? new Date().toISOString()
      })
    });
  } catch (error) {
    // Analytics should never interrupt the shopping experience.
    console.error("Analytics event could not be sent:", error);
  }
}
