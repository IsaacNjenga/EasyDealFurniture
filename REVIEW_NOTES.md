# EasyDeal review notes

These changes are local and have not been deployed.

## What to review
- Home, Shop, Contact, Search and Wishlist have stronger hero messages. The previously empty FAQs page now explains measuring, quotes, availability, delivery questions and showroom visits.
- Shop filters cover the entire catalogue. Combine room/category, colour, search, minimum/maximum discounted price and confirmed stock; facet counts adapt to the other selections. Sorting and rendering in batches of 24 do not make extra catalogue requests.
- Add items from a card or product page, then open My Quote. Change quantities, remove items, download a text estimate, or review a prepared WhatsApp request. Estimates do not reserve stock, place orders or assume delivery/tax terms.
- Quotes persist in the current browser. Adding the same item again updates its saved website price and increases quantity. The final quotation still needs confirmation by the business.
- Existing contact-form WhatsApp destination (+254 740 900061) is now shared by all enquiry flows via src/lib/commerce.ts. Product enquiries previously used +254 714 738997. Please verify the chosen sales number during your review.

## Performance and discovery
- Preserved the existing local WebP assets and used them on more pages. No source images were re-encoded or overwritten.
- Card galleries and home inspiration images advance only when selected. Lower home banners and collection images load lazily. The first home image is preloaded.
- Contact map code and tile requests load only after Load interactive map is clicked. Direct Google Maps directions remain available.
- Public product responses have a bounded 30-second in-memory cache. Simultaneous browser requests are combined. Server caches hold resolved data, so Cloudflare request contexts do not share in-flight I/O. Failed responses are not cached.
- GET requests no longer set an unnecessary JSON Content-Type header, avoiding that source of cross-origin preflight requests. Requests have a timeout.
- /llms.txt documents public pages and purchase facts. It is a discovery aid and cannot guarantee inclusion in AI answers or search summaries.

## Tradeoffs and follow-up
- Complete client-side filtering uses the existing get-all-web-products endpoint. This removes sequential product-page requests but increases the initial metadata payload versus a single paginated page. For a much larger catalogue, backend filtering and facet endpoints should replace it. Product images are still requested only as cards are rendered and become visible.
- No measured Core Web Vitals or before/after speed claim is made. Browser visual and mobile interaction review remains necessary.
- Run npm run check, npm run test:commerce and npm run build from frontend. The commerce checks cover discounted totals, combined filters, facet counts, unknown stock, quote quantity limits, persistence and invalid saved data.

## Verification
- Svelte check: 0 errors and 0 warnings.
- Commerce functional checks: passed.
- Production build, including Cloudflare packaging: passed after stopping an existing dev worker that locked the generated output. The development server was restarted afterward.
- The build still reports a large dependency chunk; the map and routing code is loaded on demand. No Core Web Vitals improvement has been measured.
- Visual browser automation timed out, so desktop/mobile visual and interaction review remains pending.

Local servers were restored at http://127.0.0.1:5173/ (development) and http://127.0.0.1:4173/ (compiled preview). The static llms.txt endpoint returned HTTP 200. Dynamic page smoke requests timed out during local verification, so their runtime response and client interactions are not claimed as verified.
