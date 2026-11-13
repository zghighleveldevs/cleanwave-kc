# CleanWave KC website

Static multi-page website for CleanWave KC, a commercial cleaning company in Olathe, Kansas, serving the Kansas City metro.

## Pages
- `index.html` — Home
- `services.html`, `industries.html`, `about.html`, `faq.html`
- `quote.html` — Book a walkthrough (multi-step quote form)
- `book.html` — booking calendar (live GoHighLevel widget, same as the funnel). Every quote form on the site opens this page with the visitor's details pre-filled.
- `thank-you.html`, `residential.html`, `privacy-policy.html`, `terms.html`
- `walkthrough.html` — ad landing page (no menu, not indexed by Google). Add `?v=missed|owner|walkthrough|signs|monday` to match the headline to the ad.

Shared styles live in `styles.css`; menu, form and animations in `site.js`. No build step is needed.

## Deploying on Vercel
Import this repo at vercel.com/new. Framework preset: **Other**. Leave the build command and output directory empty.

## Before going live
- Replace the placeholder phone `(816) 000-0000` and email `hello@cleanwavekc.com`
- Replace the testimonial placeholders and the Google reviews link
- Add the effective dates to the Privacy Policy and Terms

## Ad tracking
- The quote form has hidden fields (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`, `ad_variant`, `landing_page`) that fill automatically from the ad link. Map them to hidden fields in the GoHighLevel form.
- Paste the Meta Pixel and Google tag where each page says `TRACKING: paste…`. The thank-you page fires `Lead` / `generate_lead` once per visit.

## Lead flow (same as the walkthrough funnel)
1. The quote form (`/quote` and `/walkthrough`) posts every answer plus ad tracking to the same GoHighLevel inbound webhook as the funnel (`GHL_WEBHOOK_URL` at the top of `site.js`), tagged `source: Website`.
2. The visitor goes to `/book` with name, email, phone and company in the URL, so the GHL calendar is pre-filled.
3. After booking, GHL redirects to the calendar's Redirect URL. `/thank-you` on this site reads `first_name`, `appointment_date` and `appointment_time` if they're passed.

Conversion events: `Lead` fires on `/book` (form submitted), `Schedule` fires on `/thank-you` (walkthrough booked), once the Meta Pixel / Google tag are added.

## cleanwavekc.com/apply (walkthrough funnel)
`/apply` serves the walkthrough funnel (repo `zghighleveldevs/cleanwave-book`, deployed at cleanwave-book.vercel.app) through rewrites in `vercel.json`, so funnel updates appear here automatically.
- The funnel's relative files resolve from the site root: `/funnel.js` is rewritten to the funnel, and `/img/*` falls back to the funnel when this site doesn't have the file.
- After the funnel's quote form, visitors continue to this site's `/book`, the same GoHighLevel calendar. The `Lead` event also fires for visitors arriving from `/apply`.
- If the funnel adds new root-level files (other than images), add a matching rewrite.
