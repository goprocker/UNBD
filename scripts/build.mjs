import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');
const assets = ['index.html', 'styles.css', 'app.js'];

const products = [
  { slug: 'plot-piece', name: 'Plot Piece', price: 'Rs. 899.00', type: 'Ring / Drop 001', primary: 'Plot_piece.png?v=1781063652&width=1600', secondary: 'RKD09255copy.jpg?v=1781064745&width=1920' },
  { slug: 'rogue-star', name: 'Rogue Star', price: 'Rs. 899.00', type: 'Pendant / Drop 001', primary: 'RKD08751copy.jpg?v=1781062418&width=1600', secondary: 'RKD09532_copy_2.jpg?v=1781062457&width=1920' },
  { slug: 'don-t-follow', name: 'Don’t Follow!', price: 'Rs. 1,469.00', type: 'Tee / Drop 001', primary: 'ADS_POSTS_2.png?v=1753188268&width=1600', secondary: '10.png?v=1753188686&width=1920' },
  { slug: 'for-the-plot', name: 'For the Plot!', price: 'Rs. 1,469.00', type: 'Tee / Drop 001', primary: '8_df287829-be1a-43af-9647-46b228f6db14.png?v=1753189615&width=1600', secondary: '9_a90a90d8-4122-46f8-a708-9215876eeb04.png?v=1753189615&width=1920' },
  { slug: 'no-limits', name: 'No Limits!', price: 'Rs. 1,469.00', type: 'Tee / Drop 001', primary: '1.png?v=1753271402&width=1600', secondary: '2.png?v=1753271402&width=1920' }
];

const shell = ({ title, description, content }) => `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#1010e8"><meta name="description" content="${description}"><title>${title} — UNBD</title><link rel="preconnect" href="https://unbd.store"><link rel="stylesheet" href="/styles.css"></head>
<body class="inner-page"><a class="skip-link" href="#main">Skip to content</a><div class="grain" aria-hidden="true"></div>
<header class="inner-header"><nav aria-label="Primary navigation"><a href="/">Home</a><a href="/#drop">Drop 001</a><a href="/pages/contact/">Contact</a><a href="/pages/returns-and-exchange/">Returns</a></nav><a class="wordmark" href="/" aria-label="UNBD home">un</a><nav aria-label="Store navigation"><a href="https://unbd.store/account">Account</a><a href="https://unbd.store/cart">Bag ↗</a></nav></header>
<main id="main">${content}</main>
<footer class="inner-footer"><a class="wordmark" href="/">un</a><p>#BeUNBOUND</p><p>© 2026 UNBD</p></footer></body></html>`;

const productPage = product => shell({
  title: product.name,
  description: `${product.name} by UNBD — ${product.type}.`,
  content: `<article class="product-page"><div class="product-page__gallery"><img src="https://unbd.store/cdn/shop/files/${product.primary}" alt="${product.name}" fetchpriority="high"><img src="https://unbd.store/cdn/shop/files/${product.secondary}" alt="${product.name} campaign view" loading="lazy"></div><div class="product-page__info"><p class="section-index">[ DROP 001 ]</p><h1>${product.name}</h1><p>${product.type}</p><p class="product-page__price">${product.price}</p><a class="purchase-link" href="https://unbd.store/products/${product.slug}">Choose on UNBD store <span>↗</span></a><p class="handoff-note">Secure size selection, inventory, and checkout continue on UNBD’s official Shopify store.</p></div></article>`
});

const contactPage = shell({
  title: 'Contact',
  description: 'Contact UNBD in Rajkot, Gujarat, India.',
  content: `<section class="editorial-page"><p class="section-index">[ CONTACT ]</p><h1>Need Something?<br>Break the Silence!</h1><div class="editorial-grid"><article><h2>Legal</h2><p>Entity Name: UNBD LLP<br>Based at: Rajkot, Gujarat, India</p></article><article><h2>Email Us</h2><p><a href="mailto:knockknock@unbd.store">knockknock@unbd.store</a></p><p>We check it religiously. Expect a reply within 24–48 hours.</p></article><article><h2>Exchange or Refund Drama?</h2><p>Read the <a href="/pages/returns-and-exchange/">returns and exchange details</a>. If you’re still stuck, email your order ID and issue.</p></article><article><h2>DMs are Open</h2><p><a href="https://www.instagram.com/unbd.store">Instagram @unbd.store ↗</a></p></article></div></section>`
});

const returnsPage = shell({
  title: 'Returns and Exchange',
  description: 'UNBD returns and exchange terms.',
  content: `<section class="editorial-page policy-page"><p class="section-index">[ SUPPORT ]</p><h1>Returns and<br>Exchange</h1><p class="policy-lead">We’re all about moving forward, not backward. Returns are not offered, but sizing exchanges are.</p><div class="editorial-grid"><article><h2>How it works</h2><ul><li>Only sizing-related exchanges are accepted.</li><li>The first exchange is free.</li><li>Further exchanges are chargeable.</li><li>If exchange is unavailable, store credit applies minus a ₹150 processing fee.</li></ul></article><article><h2>Before you start</h2><ul><li>Product must be unused and in original condition.</li><li>Request exchange within 5 days of delivery.</li><li>One exchange per order is free.</li></ul><a class="purchase-link" href="https://unbd.store/apps/yanet-return/">Open return portal <span>↗</span></a></article></div></section>`
});

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(assets.map(file => cp(resolve(root, file), resolve(output, file))));

const pages = [
  ...products.map(product => [`products/${product.slug}/index.html`, productPage(product)]),
  ['pages/contact/index.html', contactPage],
  ['pages/returns-and-exchange/index.html', returnsPage]
];

await Promise.all(pages.map(async ([path, html]) => {
  const target = resolve(output, path);
  await mkdir(resolve(target, '..'), { recursive: true });
  await writeFile(target, html);
}));

console.log(`Built ${assets.length} shared assets and ${pages.length} pages into dist/.`);
