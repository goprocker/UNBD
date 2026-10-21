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
const ringStage = document.querySelector('[data-ring-stage]');
const ringCanvas = document.querySelector('[data-ring-canvas]');
const ringCounter = document.querySelector('[data-ring-counter]');
const ringProgress = document.querySelector('[data-ring-progress]');
const ringChapters = [...document.querySelectorAll('[data-ring-chapter]')];

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

const ringState = {
  progress: reducedMotion.matches ? 0.34 : 0,
  dragX: 0,
  dragY: 0,
  hoverX: 0,
  hoverY: 0,
  dragging: false,
  lastX: 0,
  lastY: 0
};

function createRingMesh(segments = 42, sides = 18) {
  const points = [];
  const triangles = [];
  const majorRadius = 1.5;
  const tubeRadius = 0.43;

  for (let segment = 0; segment <= segments; segment += 1) {
    const u = (segment / segments) * Math.PI * 2;
    for (let side = 0; side <= sides; side += 1) {
      const v = (side / sides) * Math.PI * 2;
      const cosV = Math.cos(v);
      points.push({
        x: (majorRadius + tubeRadius * cosV) * Math.cos(u),
        y: (majorRadius + tubeRadius * cosV) * Math.sin(u),
        z: tubeRadius * Math.sin(v),
        nx: cosV * Math.cos(u),
        ny: cosV * Math.sin(u),
        nz: Math.sin(v)
      });
    }
  }

  const row = sides + 1;
  for (let segment = 0; segment < segments; segment += 1) {
    for (let side = 0; side < sides; side += 1) {
      const a = segment * row + side;
      const b = a + row;
      triangles.push([points[a], points[b], points[a + 1]]);
      triangles.push([points[b], points[b + 1], points[a + 1]]);
    }
  }

  return triangles;
}

const ringMesh = createRingMesh();

function rotateRingPoint(point, rotateX, rotateY, rotateZ) {
  const cosX = Math.cos(rotateX);
  const sinX = Math.sin(rotateX);
  const cosY = Math.cos(rotateY);
  const sinY = Math.sin(rotateY);
  const cosZ = Math.cos(rotateZ);
  const sinZ = Math.sin(rotateZ);
  const y1 = point.y * cosX - point.z * sinX;
  const z1 = point.y * sinX + point.z * cosX;
  const x2 = point.x * cosY + z1 * sinY;
  const z2 = -point.x * sinY + z1 * cosY;

  return {
    x: x2 * cosZ - y1 * sinZ,
    y: x2 * sinZ + y1 * cosZ,
    z: z2
  };
}

function smoothStep(value) {
  const normalized = clamp(value);
  return normalized * normalized * (3 - 2 * normalized);
}

function resizeRingCanvas() {
  if (!ringCanvas) return;
  const rect = ringCanvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = Math.max(1, Math.round(rect.width * pixelRatio));
  const height = Math.max(1, Math.round(rect.height * pixelRatio));
  if (ringCanvas.width !== width || ringCanvas.height !== height) {
    ringCanvas.width = width;
    ringCanvas.height = height;
  }
  renderRing();
}

function renderRing() {
  if (!ringCanvas) return;
  const context = ringCanvas.getContext('2d');
  if (!context) return;

  const width = ringCanvas.width;
  const height = ringCanvas.height;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  const mobile = width / pixelRatio < 768;
  const roll = smoothStep(ringState.progress / 0.55);
  const settle = smoothStep((ringState.progress - 0.55) / 0.2);
  const fall = smoothStep((ringState.progress - 0.75) / 0.25);
  const centerX = width * ((mobile ? -0.25 : -0.13) + roll * (mobile ? 0.76 : 0.81) - fall * (mobile ? 0.01 : 0.18));
  const groundY = height * (mobile ? 0.39 : 0.62);
  const bounce = Math.sin(roll * Math.PI * 4) * (1 - roll) * height * 0.025;
  const centerY = groundY - bounce + fall * height * 0.1;
  const baseSize = Math.min(width, height) * (mobile ? 0.31 : 0.36);
  const scale = baseSize * (0.86 + settle * 0.18) * (1 + fall * fall * 4.6);
  const rotateX = 1.08 - settle * 0.58 + fall * 0.2 + ringState.dragY + ringState.hoverY * 0.08;
  const rotateY = roll * Math.PI * 4.5 + settle * Math.PI * 0.35 + fall * Math.PI * 0.18 + ringState.dragX + ringState.hoverX * 0.12;
  const rotateZ = roll * Math.PI * 2.2 - settle * 0.28 + fall * 0.16;
  const camera = 5.4;
  const light = { x: -0.4, y: -0.55, z: 0.73 };
  const projected = [];

  context.clearRect(0, 0, width, height);
  context.globalAlpha = 1 - smoothStep((fall - 0.76) / 0.24);
  context.save();
  context.globalAlpha *= 0.36 * (1 - fall);
  context.filter = `blur(${1.4 * pixelRatio}rem)`;
  context.fillStyle = '#1010e8';
  context.beginPath();
  context.ellipse(centerX, centerY + scale * 0.82, scale * 1.05, scale * 0.2, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  for (const triangle of ringMesh) {
    const vertices = triangle.map(point => {
      const position = rotateRingPoint(point, rotateX, rotateY, rotateZ);
      const normal = rotateRingPoint({ x: point.nx, y: point.ny, z: point.nz }, rotateX, rotateY, rotateZ);
      const perspective = camera / (camera - position.z);
      return {
        x: centerX + position.x * scale * perspective,
        y: centerY + position.y * scale * perspective,
        z: position.z,
        normal
      };
    });
    const normal = {
      x: (vertices[0].normal.x + vertices[1].normal.x + vertices[2].normal.x) / 3,
      y: (vertices[0].normal.y + vertices[1].normal.y + vertices[2].normal.y) / 3,
      z: (vertices[0].normal.z + vertices[1].normal.z + vertices[2].normal.z) / 3
    };
    projected.push({
      vertices,
      depth: (vertices[0].z + vertices[1].z + vertices[2].z) / 3,
      light: Math.max(-1, Math.min(1, normal.x * light.x + normal.y * light.y + normal.z * light.z)),
      facing: normal.z
    });
  }

  projected.sort((first, second) => first.depth - second.depth);
  for (const facet of projected) {
    const brightness = Math.round(35 + (facet.light + 1) * 23 + Math.max(0, facet.facing) * 11);
    const blueReflection = Math.max(0, facet.light) * 7;
    context.beginPath();
    context.moveTo(facet.vertices[0].x, facet.vertices[0].y);
    context.lineTo(facet.vertices[1].x, facet.vertices[1].y);
    context.lineTo(facet.vertices[2].x, facet.vertices[2].y);
    context.closePath();
    context.fillStyle = `hsl(${220 + blueReflection} 9% ${brightness}%)`;
    context.fill();
    context.strokeStyle = `hsla(220 16% ${Math.min(88, brightness + 8)}% / 0.2)`;
    context.lineWidth = 0.55 * pixelRatio;
    context.stroke();
  }

  const labelSize = Math.max(10, Math.min(14, width / pixelRatio * 0.012)) * pixelRatio;
  context.save();
  context.fillStyle = 'rgba(255,255,255,.55)';
  context.font = `${labelSize}px Helvetica, sans-serif`;
  context.letterSpacing = `${2 * pixelRatio}px`;
  context.textAlign = 'center';
  if (fall < 0.55) context.fillText('UNBOUND / OBJECT 001', centerX, centerY + scale * 1.18);
  context.restore();
  context.globalAlpha = 1;
}

if (ringCanvas) {
  ringCanvas.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') return;
    ringState.dragging = true;
    ringState.lastX = event.clientX;
    ringState.lastY = event.clientY;
    ringCanvas.setPointerCapture(event.pointerId);
  });

  ringCanvas.addEventListener('pointermove', event => {
    const rect = ringCanvas.getBoundingClientRect();
    ringState.hoverX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    ringState.hoverY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    if (ringState.dragging) {
      ringState.dragX += (event.clientX - ringState.lastX) * 0.009;
      ringState.dragY = clamp(ringState.dragY + (event.clientY - ringState.lastY) * 0.006, -0.7, 0.7);
      ringState.lastX = event.clientX;
      ringState.lastY = event.clientY;
    }
    renderRing();
  });

  const releaseRing = event => {
    ringState.dragging = false;
    if (ringCanvas.hasPointerCapture(event.pointerId)) ringCanvas.releasePointerCapture(event.pointerId);
  };
  ringCanvas.addEventListener('pointerup', releaseRing);
  ringCanvas.addEventListener('pointercancel', releaseRing);
  ringCanvas.addEventListener('pointerleave', () => {
    if (ringState.dragging) return;
    ringState.hoverX = 0;
    ringState.hoverY = 0;
    renderRing();
  });
}

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

  if (ringStage) {
    const rect = ringStage.getBoundingClientRect();
    const range = Math.max(ringStage.offsetHeight - window.innerHeight, 1);
    ringState.progress = clamp(-rect.top / range);
    const active = Math.min(2, Math.floor(ringState.progress * 3));
    ringChapters.forEach((chapter, index) => chapter.classList.toggle('is-active', index === active));
    if (ringCounter) ringCounter.textContent = `0${active + 1} / 03`;
    if (ringProgress) ringProgress.style.transform = `scaleX(${ringState.progress})`;
    ringStage.style.setProperty('--ring-glow', String(0.55 + Math.sin(ringState.progress * Math.PI) * 0.45));
    ringStage.style.setProperty('--ring-copy-opacity', String(smoothStep((ringState.progress - 0.22) / 0.18) * (1 - smoothStep((ringState.progress - 0.82) / 0.16))));
    renderRing();
  }

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
window.addEventListener('resize', () => requestAnimationFrame(() => {
  resizeRingCanvas();
  updateScrollState();
}), { passive: true });
window.addEventListener('orientationchange', () => requestAnimationFrame(() => {
  resizeRingCanvas();
  updateScrollState();
}), { passive: true });
resizeRingCanvas();
updateScrollState();
