import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const requiredFiles = ['index.html', 'styles.css', 'app.js', 'netlify.toml', 'decisions.md'];
const contents = Object.fromEntries(await Promise.all(requiredFiles.map(async file => [file, await readFile(resolve(root, file), 'utf8')])));
const failures = [];

function requireMatch(file, pattern, message) {
  if (!pattern.test(contents[file])) failures.push(`${file}: ${message}`);
}

requireMatch('index.html', /<meta name="viewport"/, 'missing responsive viewport');
requireMatch('index.html', /class="skip-link"/, 'missing keyboard skip link');
requireMatch('index.html', /prefetch|preconnect/, 'missing connection hint for remote assets');
requireMatch('index.html', /data-product-grid/, 'missing product grid mount');
requireMatch('index.html', /data-scroll-story/, 'missing pinned scroll story');
requireMatch('index.html', /data-ring-object/, 'missing interactive realistic ring object');
requireMatch('index.html', /plot-piece-ring-realistic\.png/, 'missing realistic Plot Piece ring asset');
requireMatch('styles.css', /@media \(min-width: 768px\)/, 'missing tablet breakpoint');
requireMatch('styles.css', /@media \(min-width: 1024px\)/, 'missing desktop breakpoint');
requireMatch('styles.css', /prefers-reduced-motion/, 'missing reduced-motion support');
requireMatch('styles.css', /@media \(max-width: 767px\)/, 'missing mobile-specific motion treatment');
requireMatch('app.js', /IntersectionObserver/, 'missing progressive reveal observer');
requireMatch('app.js', /requestAnimationFrame\(updateScrollState\)/, 'missing scroll animation frame scheduling');
requireMatch('app.js', /orientationchange/, 'mobile motion does not recalculate after orientation changes');
requireMatch('app.js', /reducedMotion\.matches/, 'scroll motion does not respect reduced-motion preference');
requireMatch('app.js', /function updateRingObject\(/, 'missing interactive ring motion controller');
requireMatch('app.js', /https:\/\/unbd\.store\/products\//, 'product actions do not hand off to Shopify');
requireMatch('app.js', /\/products\/\$\{product\.slug\}\//, 'product cards do not link to local detail pages');
requireMatch('netlify.toml', /publish = "dist"/, 'publish directory is not dist');
requireMatch('decisions.md', /Standalone Netlify Storefront/, 'implementation decision was not logged');

const buildScript = await readFile(resolve(root, 'scripts/build.mjs'), 'utf8');
for (const route of ['pages/contact/index.html', 'pages/returns-and-exchange/index.html', 'products/${product.slug}/index.html']) {
  if (!buildScript.includes(route)) failures.push(`scripts/build.mjs: missing generated route ${route}`);
}

const ids = [...contents['index.html'].matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) failures.push(`index.html: duplicate IDs: ${[...new Set(duplicates)].join(', ')}`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Checked ${requiredFiles.length} source files: all structural checks passed.`);
