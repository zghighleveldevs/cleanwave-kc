# CleanWave KC website

Static multi-page website for CleanWave KC, a commercial cleaning company in Olathe, Kansas, serving the Kansas City metro.

## Pages
- `index.html` — Home
- `services.html`, `industries.html`, `about.html`, `faq.html`
- `quote.html` — Book a walkthrough (multi-step quote form)
- `thank-you.html`, `residential.html`, `privacy-policy.html`, `terms.html`

Shared styles live in `styles.css`; menu, form and animations in `site.js`. No build step is needed.

## Deploying on Vercel
Import this repo at vercel.com/new. Framework preset: **Other**. Leave the build command and output directory empty.

## Before going live
- Replace the placeholder phone `(816) 000-0000` and email `hello@cleanwavekc.com`
- Replace the testimonial placeholders and the Google reviews link
- Paste the GoHighLevel form embed in `quote.html` (look for `GHL FORM EMBED HERE`)
- Paste the GoHighLevel calendar embed in `thank-you.html` (look for `GHL CALENDAR EMBED HERE`)
- Add the effective dates to the Privacy Policy and Terms
