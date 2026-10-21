# UNBD Editorial Storefront

Standalone campaign storefront for UNBD. The site is optimized for Netlify and hands secure commerce actions to the existing Shopify store at `unbd.store`.

## Commands

- `npm run dev` starts a local preview at `http://127.0.0.1:4173`.
- `npm run check` validates structural, responsive, accessibility, and commerce-handoff requirements.
- `npm run build` creates the deployable `dist/` directory.

## Deployment

Netlify reads `netlify.toml`, runs `npm run build`, and publishes `dist/`. No environment variables are required.

## Commerce boundary

Product previews live on this site. Product selection, search results, customer accounts, bag management, policies, and payment remain on Shopify. Replace this boundary only after obtaining approved Shopify Storefront API credentials and defining checkout ownership.

The approved headless Shopify architecture, API contract, security controls, implementation phases, and acceptance criteria are documented in [BACKEND.md](BACKEND.md).
