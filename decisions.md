# Decision Log

Record meaningful implementation decisions as work happens. Use one dated entry per cohesive change.

## 2026-10-21 — Establish Continuous Decision Logging

### What changed

Created this decision log and added its maintenance rule to `AGENTS.md`.

### Why this approach

A repository-local Markdown log keeps technical reasoning beside the code, preserves context across sessions, and makes each decision reviewable in normal diffs.

### Why this method over alternatives

Markdown needs no extra dependency or service. It is easier to inspect and maintain than an external tracker, generated database, or end-of-task summary. Logging after each meaningful change also reduces missing or reconstructed rationale.

## 2026-10-21 — Build a Standalone Netlify Storefront

### What changed

Created a responsive static storefront with an editorial homepage, verified UNBD campaign and product imagery, animated navigation, product previews, search handoff, Spotify integration, and Netlify configuration.

### Why this approach

The user replaced the Shopify-theme plan with a local Netlify deployment. A static storefront provides a fast, portable visual experience while keeping purchase, cart, account, policies, and search on the existing Shopify store.

### Why this method over alternatives

Plain HTML, CSS, and JavaScript avoid framework and runtime overhead for a presentation-led site. Native scrolling, CSS motion, and `IntersectionObserver` provide smooth effects without GSAP or a scroll-hijacking library. This reduces bundle size and preserves accessibility while Shopify continues to own secure commerce operations.

## 2026-10-21 — Use a Zero-Dependency Build and Verification Pipeline

### What changed

Added local preview, structural checks, deterministic `dist/` generation, Netlify documentation, and package scripts using only Node.js built-ins.

### Why this approach

The site needs repeatable local verification and a predictable Netlify publish directory without introducing a framework solely for file copying or serving.

### Why this method over alternatives

Node.js scripts avoid transient `npx` downloads, bundler configuration, and dependency security updates. The source is already browser-ready, so Vite, Webpack, and esbuild would add maintenance without improving the output.

## 2026-10-21 — Constrain Oversized Editorial Type

### What changed

Reduced the fluid “DON’T FOLLOW” display scale and clipped root-level horizontal overflow after rendered desktop QA exposed content wider than the viewport.

### Why this approach

The statement remains intentionally dominant while fitting narrow and wide screens without horizontal page movement.

### Why this method over alternatives

A viewport-relative type scale preserves the composition more reliably than hiding individual letters, shrinking the entire section, or applying a fixed font size at several arbitrary breakpoints.

## 2026-10-21 — Expand Compact Navigation Touch Targets

### What changed

Increased header and footer link hit areas to at least 44 pixels high after mobile rendered QA identified visually compact links with undersized targets.

### Why this approach

The design keeps its small editorial labels while touch users receive reliable interactive areas.

### Why this method over alternatives

Invisible vertical hit-area expansion preserves the typography and spacing better than enlarging label text or replacing text links with bulky controls.

## 2026-10-21 — Lock Mobile Navigation to the Dynamic Viewport

### What changed

Set the open mobile menu to explicit full dynamic-viewport dimensions after device emulation showed underlying hero content below the overlay.

### Why this approach

`100dvh` tracks the usable mobile viewport while browser chrome expands and collapses, keeping navigation visually complete.

### Why this method over alternatives

Dynamic viewport units handle mobile browser chrome more accurately than legacy `100vh`, fixed pixel heights, or JavaScript resize listeners.

## 2026-10-21 — Add Reference-Led Scroll Storytelling

### What changed

Added a three-chapter pinned product story, hero depth motion, scroll-painted manifesto words, product-image parallax, statement scaling, a motion design record, and reduced-motion fallbacks.

### Why this approach

Apple’s controlled narrative pacing, Lusion’s framed depth, and Gentle Monster’s campaign-scale imagery fit UNBD’s editorial identity. The combined system turns scrolling into product storytelling without copying reference branding or layouts.

### Why this method over alternatives

Native scrolling with a single `requestAnimationFrame` loop provides precise scrubbed motion without GSAP, Lenis, WebGL, or scroll hijacking. It keeps the zero-dependency build, supports reduced-motion users, and avoids introducing heavy animation code for effects achievable with CSS transforms.

## 2026-10-21 — Recompose the Hero Around a Raw UNBD Campaign Image

### What changed

Replaced the typography-baked cover image with a verified black-and-white UNBD jewellery photograph, created a responsive split composition, separated the BREAK/FREE lines, and added restrained drop metadata and a direct collection action.

### Why this approach

The former image repeated “BREAK FREE” inside the artwork and in the interface, weakening hierarchy. The raw campaign image lets the site own the typography while placing UNBD jewellery at the focal point.

### Why this method over alternatives

Using an existing UNBD photograph preserves brand authenticity and licensing certainty. A CSS split composition adapts the same asset across desktop and mobile without generating substitute imagery or maintaining separate hero files.

## 2026-10-21 — Complete the Responsive Spacing Pass

### What changed

Tightened shared section padding, shortened the manifesto and statement stages, standardized product metadata height, refined footer rhythm, and added a short-desktop rule for hero and pinned-story copy.

### Why this approach

The storefront keeps deliberate negative space without forcing empty viewport-sized gaps. Product titles align consistently, while short laptop screens retain all hero and story controls.

### Why this method over alternatives

Fluid `clamp()` spacing and one height-aware media query fit the existing CSS system. JavaScript layout calculations or another dependency would add fragility without improving the result.

## 2026-10-21 — Add Separate Storefront Pages

### What changed

Added local routes for all five products, Contact, and Returns and Exchange. Product cards now open local product pages, shared navigation connects every route, and secure purchase and return actions hand off to the official Shopify store.

### Why this approach

The original UNBD site exposes distinct product and support pages. Matching that information architecture gives visitors stable, linkable destinations while preserving the editorial homepage.

### Why this method over alternatives

The existing dependency-free build now generates repeated page shells from one verified product data set. This avoids duplicated HTML and framework overhead while retaining separate Netlify-friendly paths.

## 2026-10-21 — Publish Through Netlify CLI

### What changed

Built the final multi-page output, created the `unbd-break-free` Netlify project through the CLI, and published `dist/` to production.

### Why this approach

CLI deployment follows the requested workflow and keeps Netlify configuration beside the project for repeatable future releases.

### Why this method over alternatives

Netlify’s official CLI runs the configured production build before upload and reports the authoritative deploy URL. Manual drag-and-drop would bypass the repository build command and provide weaker repeatability.

## 2026-10-21 — Preserve Scroll Motion on Mobile

### What changed

Added mobile-specific compositing hints, stronger hero shading, full-frame story transitions, keyboard-accessible product image changes, and motion recalculation after resize or device rotation.

### Why this approach

The same hero depth, manifesto painting, pinned story, product parallax, and statement scaling now remain stable across mobile portrait and landscape layouts.

### Why this method over alternatives

The existing native scroll loop already owns motion state. Extending its CSS and viewport lifecycle keeps desktop and mobile behavior consistent without a second animation system, scroll hijacking, or extra library weight.

## 2026-10-21 — Guard Scroll Motion Against Null DOM Elements

### What changed

Added null guards in `updateScrollMotion()` around the hero block (`hero`, `heroMedia`, `heroType`) and the statement block (`statementEl`, `statementSection`). Added a null guard before assigning `productGrid.innerHTML`.

### Why this approach

`app.js` is loaded as a module on every page including inner product, contact, and returns pages. Those pages do not contain `.hero`, `.statement__large`, `.statement`, or `[data-product-grid]`, so the previous code threw `TypeError: Cannot read properties of null` on any inner route, breaking the scroll-progress bar and menu behaviour.

### Why this method over alternatives

Optional chaining (`?.`) could silence property access, but it would not guard the entire block correctly when multiple related variables are needed together. Explicit `if` guards are clearer about the intent and keep each section's logic self-contained.

## 2026-10-21 — Restore Original Mobile Hero Campaign

### What changed

Set the original UNBD `COVER_PORTRAIT.png` two-person campaign image as the mobile-only hero source. Desktop retains its existing jewellery campaign composition.

### Why this approach

The source artwork already contains UNBD’s original mobile “BREAK FREE” identity and is composed specifically for portrait screens. Hiding duplicate interface headline text preserves that artwork’s hierarchy.

### Why this method over alternatives

The native `<picture>` media source loads the right verified image for each viewport without JavaScript swaps, duplicate downloads, or desktop design changes.
