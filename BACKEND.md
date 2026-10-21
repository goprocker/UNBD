# UNBD Headless Commerce Backend Blueprint

## Purpose

This document defines the backend planned for the UNBD editorial storefront. The new site will use Shopify as a headless commerce platform instead of rebuilding payment, inventory, customer, and order systems.

The storefront will continue to run on Netlify. Netlify Functions will provide a small backend-for-frontend layer between the browser and the Shopify Storefront API. Shopify will remain the source of truth for products, variants, availability, carts, checkout, customers, payments, shipping, taxes, orders, refunds, and transactional notifications.

This is an architecture and implementation specification. It does not provide Shopify credentials or claim that the integration is already active.

## Verified Original Store Behavior

The public store at `unbd.store` was inspected on 2026-10-21. Its current Shopify implementation provides:

- Five published products: Rogue Star, Plot Piece, No Limits!, Don't Follow!, and For the Plot!.
- Product variants for ring size, apparel size, and color where applicable.
- Live product availability and INR pricing.
- Predictive search and standard search results.
- Cart creation and line-item management.
- Shopify customer accounts.
- Shopify-hosted checkout, payment, shipping, tax, order, and notification workflows.
- Shopify policy pages for contact information, privacy, refunds, and shipping.
- Judge.me review integration.
- GoKwik integration within the existing Shopify store.

Catalog facts can change in Shopify. The new storefront must read them from Shopify rather than copy them into JavaScript.

## System Architecture

```text
Browser
  |
  | HTTPS /api/*
  v
Netlify Functions
  |
  | Shopify Storefront GraphQL API
  v
Shopify
  |-- products, variants, prices, availability
  |-- carts and checkout URLs
  |-- customer accounts
  |-- checkout, payments, taxes, shipping, orders, refunds
  |-- Judge.me and GoKwik store integrations
```

### Frontend

The existing HTML, CSS, and JavaScript site remains responsible for presentation, accessibility, loading states, error messages, and cart interactions. It must stop using the hard-coded `products` array after the catalog endpoints are connected.

### Netlify Functions

Netlify Functions will:

- Expose a stable same-origin API to the browser.
- Validate query parameters and JSON request bodies.
- call Shopify with server-managed configuration.
- Normalize Shopify GraphQL results into small frontend response objects.
- Store the opaque Shopify cart ID in a secure cookie.
- Apply mutation origin checks and basic rate limits.
- Return controlled errors without leaking credentials or upstream response details.

Netlify Functions will not store product, customer, payment, or order records.

### Shopify

Shopify will own all commerce state. Staff will continue to manage products, variants, media, prices, inventory, discounts, fulfillment, policies, and orders in Shopify Admin.

The Storefront API will be used only for customer-facing catalog and cart operations. An Admin API token is not required for v1 and must never be exposed to the browser.

## API Contract

All endpoints return JSON. Successful responses use `{ "data": ... }`. Failed responses use:

```json
{
  "error": {
    "code": "INVALID_CART_LINE",
    "message": "The selected item could not be added to the bag."
  }
}
```

Error messages shown to customers must remain useful but must not include stack traces, tokens, internal IDs beyond those already used by the storefront, or raw Shopify errors.

### Catalog

#### `GET /api/products`

Returns published products, handles, descriptions, featured media, price ranges, options, variants, and availability. Supports optional `first` and `after` pagination parameters. `first` must be clamped to a safe maximum.

#### `GET /api/products/:handle`

Returns one published product and its variants. Returns `404` when the handle does not exist or is not published to the configured Storefront API sales channel.

#### `GET /api/search?q=<query>`

Returns matching products for a trimmed query. Empty queries return an empty result. Query length must be limited before calling Shopify.

Catalog responses may use a short public cache. Availability and cart responses must not use a shared cache.

### Cart

#### `GET /api/cart`

Reads the cart ID from the cart cookie and returns current lines, quantities, costs, discounts, availability, and checkout URL. A missing, expired, or invalid cart returns an empty cart rather than exposing an upstream error.

#### `POST /api/cart/lines`

Accepts:

```json
{
  "merchandiseId": "gid://shopify/ProductVariant/123",
  "quantity": 1
}
```

Creates a Shopify cart when no valid cart exists, then adds the selected published and available variant. Quantity must be a positive integer within the configured per-line limit.

#### `PATCH /api/cart/lines/:lineId`

Accepts `{ "quantity": 2 }` and updates an existing cart line. Quantity must be a positive integer within the per-line limit.

#### `DELETE /api/cart/lines/:lineId`

Removes an existing line and returns the updated cart.

#### `POST /api/checkout`

Validates the current cart and returns its Shopify `checkoutUrl`. The frontend then performs a top-level navigation to Shopify checkout. The backend must not proxy payment pages or collect payment details.

### Accounts and Policies

Customer sign-in, registration, password recovery, addresses, and order history will use Shopify-hosted account pages. Contact, privacy, refund, shipping, and return links will use the canonical Shopify pages until the business approves equivalent local content.

No custom customer authentication or customer database will be added in v1.

## Data Shapes

The backend should normalize Shopify data into these minimum frontend shapes:

```ts
type Product = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  featuredImage: Image | null;
  images: Image[];
  priceRange: { min: Money; max: Money };
  options: Array<{ name: string; values: string[] }>;
  variants: Variant[];
};

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
};

type Cart = {
  id: string | null;
  totalQuantity: number;
  lines: CartLine[];
  subtotal: Money;
  total: Money;
  checkoutUrl: string | null;
};

type Money = { amount: string; currencyCode: "INR" | string };
type Image = { url: string; altText: string | null; width: number | null; height: number | null };
```

Shopify global IDs remain opaque strings. The frontend must never parse or generate them.

## Cart Session

The backend stores the Shopify cart ID in a cookie named `unbd_cart` with these attributes:

- `HttpOnly`
- `Secure` in deployed environments
- `SameSite=Lax`
- `Path=/`
- A bounded lifetime aligned with Shopify cart availability

The browser must not provide an arbitrary cart ID in request JSON or URLs. When Shopify rejects or no longer recognizes a stored cart, the backend clears the cookie and creates a new cart only when the customer next adds an item.

## Configuration

Netlify must provide:

```text
SHOPIFY_STORE_DOMAIN=unbd.store
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<storefront-token>
SHOPIFY_API_VERSION=<supported-pinned-version>
ALLOWED_ORIGIN=https://<production-domain>
```

Local development uses sanitized values in `.env.local`, which remains ignored by Git. `.env.example` will contain names and placeholders only.

The Shopify API version must be pinned, reviewed before its support window ends, and updated through a tested change. Tokens must be scoped to the minimum Storefront API access required for catalog and cart operations.

## Security and Reliability

- Validate all parameters and JSON fields at the function boundary.
- Accept JSON mutation requests only from the configured same origin.
- Apply `Content-Type`, request-size, query-length, and quantity limits.
- Rate-limit search and cart mutations by a privacy-preserving client key.
- Escape or safely render Shopify HTML; never concatenate untrusted values into executable markup.
- Never log tokens, cookies, customer data, full request bodies, or payment information.
- Set timeouts on Shopify requests and return `502` or `503` for controlled upstream failures.
- Use `400` for invalid input, `404` for missing public resources, `409` for availability conflicts, and `429` for rate limits.
- Re-read cart state after Shopify mutations and treat Shopify as authoritative.
- Add request correlation IDs to server logs and safe error responses.

Payment card details, UPI details, billing details, and checkout authentication must only be entered on Shopify-hosted checkout pages.

## Third-Party Integrations

### Judge.me

Judge.me remains attached to the Shopify catalog. The frontend may render its approved public widget or use an approved read-only integration. Review submission, moderation, and trust signals remain owned by Judge.me and Shopify. Private Judge.me credentials must not be placed in frontend code.

### GoKwik

GoKwik remains a Shopify-side checkout integration. The storefront will navigate customers to the Shopify checkout URL returned by the Storefront API. GoKwik behavior must be verified in a non-production purchase flow before launch; its presence on the original theme does not by itself prove compatibility with every headless checkout path.

## Failure Behavior

- Catalog unavailable: show a retry state and retain navigation to `unbd.store` as an emergency commerce fallback.
- Product removed or unpublished: return `404` and show a product-unavailable page.
- Variant sold out: reject the mutation with `409`, refresh product/cart availability, and preserve other cart lines.
- Cart expired: clear the invalid cookie and return an empty cart.
- Checkout URL missing: keep the customer on the bag page and show a retry message.
- Judge.me unavailable: hide review content without blocking catalog or checkout.
- GoKwik unavailable: Shopify's supported checkout remains the authority; do not attempt a custom payment fallback.

## Implementation Phases

### Phase 1: Shopify Access and Read-Only Catalog

1. Create approved Storefront API access for the existing Shopify shop.
2. Add environment validation and a shared Shopify GraphQL client.
3. Implement product listing, product detail, and search endpoints.
4. Replace hard-coded catalog data with API responses while preserving loading and error states.

### Phase 2: Cart and Checkout

1. Add secure cart-cookie handling.
2. Implement cart retrieval and line mutations.
3. Connect bag count and bag UI to live cart state.
4. Return and navigate to Shopify checkout URLs.
5. Verify discounts, sold-out behavior, shipping, taxes, and checkout on Shopify.

### Phase 3: Original-Store Integrations

1. Connect Shopify-hosted accounts and canonical policy pages.
2. Add the approved Judge.me presentation.
3. Verify GoKwik behavior through the Shopify checkout handoff.
4. Complete accessibility, security, failure, and production monitoring checks.

Each phase must update `decisions.md` when implementation choices change and must include tests for new behavior.

## Test and Acceptance Plan

### Automated Tests

- Validate configuration and reject missing required values at startup.
- Normalize Shopify product, variant, money, image, and cart responses.
- Reject malformed handles, excessive search queries, invalid IDs, and invalid quantities.
- Cover empty catalog results, missing products, sold-out variants, expired carts, Shopify GraphQL errors, timeouts, and rate limits.
- Verify cart create, add, update, remove, and checkout URL flows with mocked Shopify responses.
- Verify cookies and security headers in local and deployed environments.

### Integration Tests

- Compare product titles, handles, variants, prices, media, and availability with Shopify.
- Search for known and unknown products.
- Add each available variant, change quantity, remove it, and reload the cart.
- Confirm a sold-out variant cannot be added.
- Confirm checkout navigation reaches the expected Shopify shop over HTTPS.
- Confirm account and policy links reach canonical Shopify pages.
- Confirm no Storefront or Admin credentials appear in built frontend files or browser responses.

### Launch Acceptance

- Shopify staff confirm catalog, inventory, pricing, tax, shipping, discount, refund, and policy configuration.
- A controlled test order proves cart-to-order flow, payment, notification, and fulfillment visibility.
- Judge.me and GoKwik behavior is verified on the deployed staging site.
- Production monitoring shows successful catalog and cart requests without leaking customer or secret data.

## Out of Scope for v1

- A custom product CMS, inventory database, customer database, or order-management system.
- Custom password authentication or account storage.
- Direct payment, card, or UPI processing.
- Replacing Shopify Admin, checkout, discounts, shipping, tax, refunds, or fulfillment.
- Copying Shopify catalog data into this repository as an ongoing source of truth.

These boundaries keep the backend small while preserving the secure commerce behavior of the original UNBD store.
