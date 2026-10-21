const products = [
  { slug: 'plot-piece', name: 'Plot Piece', price: 'Rs. 899.00', edition: 'Ring / Drop 001', primary: 'https://unbd.store/cdn/shop/files/Plot_piece.png?v=1781063652&width=1280', secondary: 'https://unbd.store/cdn/shop/files/RKD09255copy.jpg?v=1781064745&width=1920' },
  { slug: 'rogue-star', name: 'Rogue Star', price: 'Rs. 899.00', edition: 'Pendant / Drop 001', primary: 'https://unbd.store/cdn/shop/files/RKD08751copy.jpg?v=1781062418&width=1280', secondary: 'https://unbd.store/cdn/shop/files/RKD09532_copy_2.jpg?v=1781062457&width=1920' },
  { slug: 'don-t-follow', name: 'Don’t Follow!', price: 'Rs. 1,469.00', edition: 'Tee / Drop 001', primary: 'https://unbd.store/cdn/shop/files/ADS_POSTS_2.png?v=1753188268&width=1280', secondary: 'https://unbd.store/cdn/shop/files/10.png?v=1753188686&width=1920' },
  { slug: 'for-the-plot', name: 'For the Plot!', price: 'Rs. 1,469.00', edition: 'Tee / Drop 001', primary: 'https://unbd.store/cdn/shop/files/8_df287829-be1a-43af-9647-46b228f6db14.png?v=1753189615&width=1280', secondary: 'https://unbd.store/cdn/shop/files/9_a90a90d8-4122-46f8-a708-9215876eeb04.png?v=1753189615&width=1920' },
  { slug: 'no-limits', name: 'No Limits!', price: 'Rs. 1,469.00', edition: 'Tee / Drop 001', primary: 'https://unbd.store/cdn/shop/files/1.png?v=1753271402&width=1280', secondary: 'https://unbd.store/cdn/shop/files/2.png?v=1753271402&width=1920' }
];

const productGrid = document.querySelector('[data-product-grid]');
const dialog = document.querySelector('[data-product-dialog]');
const dialogContent = document.querySelector('[data-dialog-content]');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const searchButton = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('#search-panel');
const header = document.querySelector('[data-header]');
const progress = document.querySelector('.scroll-progress span');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const story = document.querySelector('[data-scroll-story]');
const storyFrames = [...document.querySelectorAll('[data-story-frame]')];
const storySteps = [...document.querySelectorAll('[data-story-step]')];
const storyCounter = document.querySelector('[data-story-counter]');
const storyProgress = document.querySelector('[data-story-progress]');
const introHeading = document.querySelector('.intro h2');

if (productGrid) productGrid.innerHTML = products.map((product, index) => `
  <article class="product-card reveal" style="--order:${index}">
    <a class="product-card__media" href="/products/${product.slug}/" aria-label="View ${product.name}">
      <img src="${product.primary}" alt="${product.name}" loading="lazy">
      <img src="${product.secondary}" alt="${product.name} campaign view" loading="lazy">
    </a>
    <div class="product-card__meta">
      <div><h3>${product.name}</h3><p>${product.edition} · ${product.price}</p></div>
      <a class="product-card__action" href="/products/${product.slug}/" aria-label="View ${product.name}">↗</a>
    </div>
  </article>
`).join('');

function setExpanded(button, panel, expanded) {
  button?.setAttribute('aria-expanded', String(expanded));
  panel?.setAttribute('aria-hidden', String(!expanded));
}

function closeOverlays(except) {
  if (except !== 'menu') setExpanded(menuButton, mobileMenu, false);
  if (except !== 'search') setExpanded(searchButton, searchPanel, false);
  document.body.classList.toggle('menu-open', except === 'menu');
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  closeOverlays(open ? 'menu' : null);
  setExpanded(menuButton, mobileMenu, open);
});

searchButton?.addEventListener('click', () => {
  const open = searchButton.getAttribute('aria-expanded') !== 'true';
  closeOverlays(open ? 'search' : null);
  setExpanded(searchButton, searchPanel, open);
  if (open) requestAnimationFrame(() => document.querySelector('#search-input')?.focus());
});

mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeOverlays()));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeOverlays();
  if (dialog?.open) dialog.close();
});

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-product]');
  if (!trigger) return;
  const product = products.find(item => item.slug === trigger.dataset.product);
  if (!product) return;
  dialogContent.innerHTML = `
    <div class="dialog-media"><img src="${product.secondary}" alt="${product.name} campaign view"></div>
    <div class="dialog-info">
      <div><p class="section-index">${product.edition}</p><h2>${product.name}</h2><p>${product.price}</p></div>
      <a class="dialog-link" href="https://unbd.store/products/${product.slug}"><span>Choose options on UNBD</span><span>↗</span></a>
    </div>`;
  dialog.showModal();
});

document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

if (introHeading) {
  const words = introHeading.textContent.trim().split(/\s+/);
  introHeading.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
}

const introWords = [...document.querySelectorAll('.intro h2 .word')];
const productCards = [...document.querySelectorAll('.product-card')];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function sectionProgress(element, start = 0.85, end = 0.15) {
  const rect = element.getBoundingClientRect();
  const distance = window.innerHeight * start - window.innerHeight * end + rect.height;
  return clamp((window.innerHeight * start - rect.top) / distance);
}

function updateScrollMotion() {
  if (reducedMotion.matches) return;

  const hero = document.querySelector('.hero');
  const heroMedia = document.querySelector('.hero__media img');
  const heroType = document.querySelector('.hero__type');
  if (hero && heroMedia && heroType) {
    const heroProgress = clamp(window.scrollY / Math.max(hero.offsetHeight, 1));
    heroMedia.style.transform = `scale(${1 + heroProgress * 0.09}) translate3d(0, ${heroProgress * 3}%, 0)`;
    heroType.style.transform = `translate3d(0, ${heroProgress * 14}vh, 0)`;
    heroType.style.opacity = String(1 - heroProgress * 0.9);
  }

  const introProgress = sectionProgress(document.querySelector('.intro'), 0.78, 0.28);
  const litWords = Math.ceil(introProgress * introWords.length * 1.2);
  introWords.forEach((word, index) => word.classList.toggle('is-lit', index < litWords));

  if (story) {
    const rect = story.getBoundingClientRect();
    const range = Math.max(story.offsetHeight - window.innerHeight, 1);
    const storyValue = clamp(-rect.top / range);
    const active = Math.min(2, Math.floor(storyValue * 3));
    storyFrames.forEach((frame, index) => frame.classList.toggle('is-active', index === active));
    storySteps.forEach((step, index) => step.classList.toggle('is-active', index === active));
    storyCounter.textContent = `0${active + 1} / 03`;
    storyProgress.style.transform = `scaleX(${storyValue})`;
    story.style.setProperty('--story-scale', String(1 + (storyValue * 0.035)));
    story.style.setProperty('--story-image-y', `${(storyValue - active / 3) * -8}%`);
  }

  productCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const local = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    card.style.setProperty('--product-y', `${(local - 0.5) * -8}%`);
  });

  const statementEl = document.querySelector('.statement__large');
  const statementSection = document.querySelector('.statement');
  if (statementEl && statementSection) {
    const statementValue = sectionProgress(statementSection, 0.9, 0.1);
    statementEl.style.transform = `scale(${0.82 + statementValue * 0.18})`;
    statementEl.style.letterSpacing = `${-0.04 - statementValue * 0.06}em`;
  }
}

let ticking = false;
function updateScrollState() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${ratio})`;
  header.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.76);
  updateScrollMotion();
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollState);
}, { passive: true });
window.addEventListener('resize', () => requestAnimationFrame(updateScrollState), { passive: true });
window.addEventListener('orientationchange', () => requestAnimationFrame(updateScrollState), { passive: true });
updateScrollState();
