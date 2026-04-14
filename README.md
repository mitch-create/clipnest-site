# ClipNest Website Bundle

This folder contains a production-facing static website for ClipNest with:

- `index.html`
- `privacy.html`
- `support.html`
- `terms.html`
- `styles.css`
- `assets/clipnest-logo.png`
- `assets/favicon-64.png`

## Before Publishing

If your final public domain is not `clipnest.app`, update:

- any canonical domain references you want to add
- your Google OAuth consent screen fields so they exactly match the live site

## Deployment

This is a plain static site and can be hosted on:

- Netlify
- Cloudflare Pages
- GitHub Pages
- Vercel
- any static hosting provider

## Google OAuth Production Notes

For Google OAuth production readiness, make sure:

1. The site is publicly accessible over HTTPS.
2. The privacy policy is on the same domain as the home page.
3. The domain is verified in Google Search Console.
4. The OAuth consent screen uses the same app name, home page URL, privacy policy URL, and support email shown on the live site.
