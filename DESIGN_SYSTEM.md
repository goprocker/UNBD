# UNBD Design System

## Direction

Editorial streetwear with restrained industrial UI. Photography carries emotion; typography supplies confrontation. Black, paper white, and UNBD electric blue remain the only dominant colors.

## Reference Adaptations

- [Apple AirPods Pro](https://www.apple.com/airpods-pro/): adapted its single-focus sticky narrative and clear progress pacing. UNBD uses campaign frames instead of product renders.
- [Lusion](https://lusion.co/): adapted depth changes inside a stable media frame and the contrast between compact labels and large statements. No 3D canvas or branded scene was copied.
- [Gentle Monster](https://www.gentlemonster.com/): adapted full-scale fashion imagery, sparse product labels, and slower editorial rhythm. UNBD retains its own products, blue accent, logo, and copy.

## Implemented Rules

- Source: `styles.css`; behavior: `app.js`.
- Motion uses native scrolling plus one `requestAnimationFrame` update per scroll frame.
- Hero media scales slowly while foreground type travels faster and fades.
- Manifesto words change from muted to solid as reading progress advances.
- Pinned Drop 001 story divides its scroll range into three explicit product chapters.
- Product images use shallow vertical parallax; hover image switching remains independent.
- The Plot Piece chapter uses a transparent high-fidelity cutout of the official product photograph with scroll-driven perspective, rotation, scale, and pointer drag, framed by the same editorial type and electric-blue lighting.
- All continuous effects stop under `prefers-reduced-motion`.
- Breakpoints remain mobile-first at 768 and 1024 CSS pixels.

## Avoid

No scroll hijacking, inertia replacement, excessive blur, generic gradients, copied reference layouts, decorative motion without narrative purpose, animation that blocks product links, or heavyweight 3D dependency for a single object.
