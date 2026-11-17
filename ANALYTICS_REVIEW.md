# Website analytics review

EasyManager's backend was inspected read-only at `../EasyManager3.0/backend/src/modules/Website/Analytics/`. No backend scripts, consent engine, identity engine, middleware or existing event transport were edited. No visual design changes were needed.

## Event definitions

| Event | Website trigger | Context |
| --- | --- | --- |
| `page_view` | Initial route and pathname changes, including back/forward | `PAGE`, pathname only, placement `page` |
| `product_impression` | At least half a product card visible for one continuous second while the document is visible and consent is accepted | `CATALOG`, product ID, list placement and position |
| `product_click` | Activate View details or a product link in the quote | `CATALOG`, product ID, placement and position |
| `product_view` | Product details successfully loaded, or consent granted while viewing them | `CATALOG`, product ID, `product_detail` |
| `category_click` | Select a category in the shop filter | `CATEGORY`, real category ID, `shop_category_filter` |
| `search` | Successful current search results, or settled shop text filtering, after a 500ms quiet period | Normalized query, full result count (including zero), `search_results` or `shop_listing` |
| `quote_start` | First product added to an empty quote | `CATALOG`, product ID, source placement, `WEBSITE` |
| `quote_whatsapp_click` | Activate a product enquiry, quote summary handoff, or valid contact form | Product or page context, source placement, `WHATSAPP` |
| `quote_phone_click` | Activate a phone link in Contact or the footer | `PAGE`, `contact_details` or `footer_contact`, `PHONE` |

Product-list placements are `home_best_sellers`, `home_fresh_designs`, `shop_listing`, `search_results`, `wishlist`, and `product_related`. Positions are **zero based** in the current displayed list, after filtering/sorting; loading more preserves the position in that list. Quote product links use `quote_items`.

## Counting and interpretation

- Product impressions are attempted once per mounted product and placement. A card rendered below the viewport does not count. Navigation/remounting can produce another impression; filtering/reordering a mounted card does not automatically count another. This is an exposure count, not unique reach.
- Query-string edits and hash jumps do not inflate page views. Returning from another pathname counts another visit. Navigation guards prevent slow earlier requests from overwriting current visit state.
- Search counts reflect all matching products, not only rendered cards. Superseded and failed requests do not generate successful-search events. Granting consent can record current completed results; prior clicks and quote actions are not replayed.
- Search text is trimmed, control characters are replaced, whitespace is normalized and length is capped at the backend's 200-character limit. Customer names, messages, delivery areas and prepared WhatsApp text are never included in event payloads. Free-text search remains user supplied.
- Quote starts describe empty-to-nonempty quote transitions, not every added item or every quote-page visit. Restored quotes do not generate a new start.
- Contact clicks describe intent. They cannot prove a call connected, a message was sent, a quotation was submitted, or a sale occurred. `quote_submit` is intentionally unused until a submission endpoint can acknowledge success. Estimate downloads are not submissions.
- Home images and collection tiles are local presentation assets, not EasyManager banner/category records or actionable category links. No fabricated banner IDs, banner clicks or category clicks are emitted for those elements. Actual backend-managed banner integration would need their real IDs and destinations.

## Reliability boundaries and validation

The existing transport still gates every send on consent and uses credentialed, keepalive requests. The integration contains transport/storage errors so analytics cannot interrupt interactions. It does not add automatic retries: the existing tracker creates a fresh event ID on every call, so blind retries after ambiguous network failures could double count accepted events. Delivery remains best effort; blocked/failed requests and visitors who decline consent are not measured. Do not interpret counts as all site traffic.

`website-events.ts` mirrors the additional event names supported by the backend while reusing the untouched tracker. Its single type assertion bridges the tracker's narrower event-name type. Reconcile this adapter with the backend contract when that contract changes.

Run from `frontend`:

```text
npm run check
npm run test:analytics
npm run test:commerce
npm run build
```

Analytics checks use a fake browser, clock and transport to cover consent gating, storage failures, visibility thresholds, interrupted dwell, hidden tabs, impression deduplication, normalized/bounded search terms, zero results, superseded searches, late consent, revocation and cleanup. They do not prove production event ingestion or dashboard aggregation. Live backend/dashboard and desktop/mobile browser verification remain necessary before claiming end-to-end delivery.

The quote store's existing `product.image` access was corrected to `product.images`; commerce fixtures now match the current `pricing`, `category` and `images` model. An obsolete stock assertion was removed from those checks because the current catalogue model/filter does not expose or enforce stock availability; catalogue filtering behavior itself was not changed.

Local verification: Svelte check passed with zero errors/warnings; analytics and commerce checks passed; ESLint passed for the changed files after resolving intentional control-character handling and existing resolved-URL/external-phone lint annotations. Client and server production compilation passed. Cloudflare packaging failed twice, including outside the sandbox, with `EPERM` replacing the root `.svelte-kit/cloudflare` directory. An existing project Vite development process was running; it was left running. No deployment was performed.
