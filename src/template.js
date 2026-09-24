'use strict';

const { SITE_URL, LANGS, DEFAULT_LANG, ORG, CHURCH, IMAGE, THEME_COLOR } = require('./site.config');

/* ────────────────────────────── helpers ────────────────────────────── */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* JSON-LD must never be able to close its own <script> element. */
const jsonld = (obj) => JSON.stringify(obj, null, 2)
  .replace(/</g, '\\u003c')
  .replace(/>/g, '\\u003e')
  .replace(/&/g, '\\u0026');

const abs = (p) => `${SITE_URL}/${String(p).replace(/^\/+/, '')}`;
const langHome = (code) => `${SITE_URL}/${code}/`;

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E" +
  "%3Crect width='32' height='32' rx='4' fill='%230a0304'/%3E" +
  "%3Cpath d='M13.6 3h4.8v6.6H25v4.8h-6.6V29h-4.8V14.4H7V9.6h6.6z' fill='%23d4af37'/%3E%3C/svg%3E";

/* Inline SVG icons — no icon CDN, nothing render-blocking. */
const ICON = {
  cross: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10.2 2h3.6v5.6H19v3.6h-5.2V22h-3.6V11.2H5V7.6h5.2z" fill="currentColor"/></svg>',
  globe: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c-2.6 2.3-4 5.3-4 9s1.4 6.7 4 9c2.6-2.3 4-5.3 4-9s-1.4-6.7-4-9ZM3.5 9h17M3.5 15h17"/></svg>',
  chevron: '<svg class="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>',
  printer: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M7 9V3h10v6M7 19H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 15h10v6H7z"/></svg>',
  sound: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4 9h3.2L12 4.8v14.4L7.2 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z"/><path class="wave" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M15.6 8.6a4.6 4.6 0 0 1 0 6.8M18.4 6a8.2 8.2 0 0 1 0 12"/></svg>',
  mute: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4 9h3.2L12 4.8v14.4L7.2 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="m16 9.5 5 5m0-5-5 5"/></svg>',
  menu: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>',
  down: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>',
  up: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m6 15 6-6 6 6"/></svg>',
  check: '<svg class="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7"/></svg>',
  reset: '<svg class="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 5v5h5M4.6 14a7.5 7.5 0 1 0 1.3-5.4"/></svg>',
  voice: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M12 3.4a2.6 2.6 0 0 1 2.6 2.6v5a2.6 2.6 0 0 1-5.2 0V6A2.6 2.6 0 0 1 12 3.4Z"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M6.6 11a5.4 5.4 0 0 0 10.8 0M12 16.4V20.6M9.2 20.6h5.6"/></svg>',
  play: '<svg class="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5.2v13.6L19 12z"/></svg>',
  pause: '<svg class="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 5h3.4v14H7zm6.6 0H17v14h-3.4z"/></svg>',
  stop: '<svg class="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="1.6" fill="currentColor"/></svg>',
  install: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="2.6" width="12" height="18.8" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M12 7.4v6.4m0 0 2.4-2.4M12 13.8l-2.4-2.4M10.4 18h3.2"/></svg>',
  textsize: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M2.5 19 8 5l5.5 14M4.5 14h7M14 19l3.8-9.5L21.6 19M15.3 15.8h5"/></svg>',
  offline: '<svg class="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M4 4l16 16M7.8 8.2A5.6 5.6 0 0 0 6.4 19h10.2M8.6 5.4A6.4 6.4 0 0 1 18.4 11a4 4 0 0 1 2.2 6.6"/></svg>'
};

/* ─────────────────────────── content blocks ─────────────────────────── */

/* The traditional printed rubric — "(ім’я)" — kept as static sacred text. */
function nameSlot(c) {
  return `<span class="user-name">${esc(c.ui.nameDefault)}</span>`;
}

/* Content is escaped first, then a tiny markup subset is re-enabled:
   **bold**, _italic_. Raw HTML in content files can never leak through. */
function inline(text) {
  return esc(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>');
}

/* Replaces the {{name}} token with the live, editable name span. */
function withName(text, c) {
  return inline(text).replace(/\{\{name\}\}/g, nameSlot(c));
}

function renderBlock(b, c) {
  switch (b.t) {

    case 'p':
      return `<p>${withName(b.x, c)}</p>`;

    case 'lead':
      return `<p class="lead">${withName(b.x, c)}</p>`;

    /* One block per line, so a line too long for a phone wraps in balanced
       halves ("Киріє елейсон, / Христе елейсон,") instead of leaving a lone
       word behind. The newline between them is what the voice reader splits
       on; the layout ignores it. */
    case 'chant':
      return `<p class="chant">${b.lines.map((l) => `<span class="line">${esc(l)}</span>`).join('\n')}</p>`;

    case 'poem':
      return `<p class="poem">${b.lines.map((l) => `<span class="line">${esc(l)}</span>`).join('\n')}</p>`;

    /* A repeated antiphon — said before and after a litany. */
    case 'refrain':
      return `<p class="refrain">${esc(b.x)}</p>`;

    case 'litany': {
      /* `ordered: true` renders the numbered form (1.–10.) exactly as it
         stands in the printed devotional; the plain form keeps the
         bullet-free list used by the other litanies. */
      const tag = b.ordered ? 'ol' : 'ul';
      const cls = b.ordered ? 'litany-group litany-numbered' : 'litany-group';
      const items = b.items.map(([call, resp]) => resp
        ? `<li class="litany-item"><span class="litany-call">${esc(call)}</span> <span class="litany-response">${esc(resp)}</span></li>`
        : `<li class="litany-item"><span class="litany-call">${esc(call)}</span></li>`
      ).join('\n            ');
      return `<${tag} class="${cls}">\n            ${items}\n          </${tag}>`;
    }

    case 'box':
      return `<aside class="instruction-box">` +
        (b.title ? `<h3 class="box-title">${esc(b.title)}</h3>` : '') +
        b.x.map((p) => `<p>${withName(p, c)}</p>`).join('') +
        `</aside>`;

    case 'promise':
      return `<aside class="promise-box">` +
        `<h3 class="box-title">${ICON.cross}<span>${esc(b.title)}</span></h3>` +
        b.x.map((p) => `<p>${withName(p, c)}</p>`).join('') +
        `</aside>`;

    case 'note':
      return `<p class="note">${esc(b.x)}</p>`;

    case 'rule':
      return `<hr class="sacred-rule" aria-hidden="true">`;

    case 'tracker': {
      const total = 33;
      return `<div class="tracker no-print" data-tracker="33d" data-total="${total}">
            <h3 class="tracker-title">${esc(c.ui.tracker33Title)}</h3>
            <p class="tracker-lead">${esc(c.ui.tracker33Lead)}</p>
            <div class="tracker-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${total}"
                 aria-valuenow="0" aria-label="${esc(c.ui.tracker33Title)}">
              <span class="tracker-fill" data-fill></span>
            </div>
            <p class="tracker-status" data-status role="status" aria-live="polite"></p>
            <div class="tracker-dots" data-dots aria-hidden="true"></div>
            <div class="tracker-actions">
              <button type="button" class="btn btn-primary" data-mark>${ICON.check}<span>${esc(c.ui.markToday)}</span></button>
              <button type="button" class="btn btn-ghost" data-reset>${ICON.reset}<span>${esc(c.ui.resetProgress)}</span></button>
            </div>
          </div>`;
    }

    default:
      throw new Error(`Unknown block type: ${b.t}`);
  }
}

function renderSection(s, c, index) {
  const titleId = `${s.id}-title`;
  return `
      <section id="${esc(s.id)}" class="section-card reveal" aria-labelledby="${titleId}">
        <header class="section-header">
          <p class="section-index" aria-hidden="true">${String(index).padStart(2, '0')}</p>
          <h2 class="section-title" id="${titleId}">${esc(s.title)}</h2>
          ${s.subtitle ? `<p class="section-subtitle">${esc(s.subtitle)}</p>` : ''}
        </header>
        <div class="prayer-text">
          ${s.blocks.map((b) => renderBlock(b, c)).join('\n          ')}
        </div>
      </section>`;
}

/* ──────────────────────────── head / SEO ──────────────────────────── */

/* The two faces that carry first paint: the body serif and the UI sans, in
   whichever subset this locale renders. Everything else in fonts.css loads
   normally, gated by unicode-range. */
function preloadFonts(c) {
  const sub = c.fontSubset || 'latin';
  return [
    `lora-400-700-${sub}.woff2`,
    `montserrat-400-700-${sub}.woff2`
  ].map((f) =>
    `<link rel="preload" as="font" type="font/woff2" href="../assets/fonts/${f}" crossorigin>`
  ).join('\n  ');
}

function renderHreflang() {
  const links = LANGS.map((l) =>
    `<link rel="alternate" hreflang="${l.hreflang}" href="${langHome(l.code)}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${langHome(DEFAULT_LANG)}">`);
  return links.join('\n  ');
}

function renderStructuredData(c) {
  const url = langHome(c.code);
  const img = abs(IMAGE.path);
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;
  const pageId = `${url}#webpage`;

  const graph = [];

  const org = {
    '@type': 'Organization',
    '@id': orgId,
    name: ORG.name,
    legalName: ORG.legalName,
    url: SITE_URL + '/',
    logo: { '@type': 'ImageObject', url: abs(ORG.logoPath), width: IMAGE.width, height: IMAGE.height },
    description: c.meta.description,
    knowsLanguage: LANGS.map((l) => l.hreflang),
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    availableLanguage: LANGS.map((l) => ({
      '@type': 'Language', name: l.name, alternateName: l.hreflang
    }))
  };
  if (ORG.email) org.email = ORG.email;
  if (ORG.sameAs.length) org.sameAs = ORG.sameAs;
  graph.push(org);

  if (CHURCH.enabled && CHURCH.name) {
    graph.push({
      '@type': 'CatholicChurch',
      '@id': `${SITE_URL}/#church`,
      name: CHURCH.name,
      url: CHURCH.url || SITE_URL + '/',
      telephone: CHURCH.telephone || undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: CHURCH.address.streetAddress,
        addressLocality: CHURCH.address.addressLocality,
        postalCode: CHURCH.address.postalCode,
        addressCountry: CHURCH.address.addressCountry
      },
      geo: CHURCH.geo.latitude
        ? { '@type': 'GeoCoordinates', latitude: CHURCH.geo.latitude, longitude: CHURCH.geo.longitude }
        : undefined,
      parentOrganization: { '@id': orgId }
    });
  }

  graph.push({
    '@type': 'WebSite',
    '@id': siteId,
    url: SITE_URL + '/',
    name: c.siteName,
    alternateName: ORG.name,
    description: c.meta.description,
    inLanguage: LANGS.map((l) => l.hreflang),
    publisher: { '@id': orgId },
    copyrightHolder: { '@id': orgId }
  });

  /* The site is a genuinely installable, offline-capable application, and
     saying so is what lets an assistant answer "is there a prayer app that
     works without signal" with this page. Free, no account, any platform. */
  graph.push({
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/#app`,
    name: c.siteName,
    alternateName: c.brand,
    url,
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: 'Prayer',
    operatingSystem: 'Android, iOS, Windows, macOS, Linux',
    browserRequirements: 'Requires JavaScript. Works offline once opened.',
    inLanguage: LANGS.map((l) => l.hreflang),
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    featureList: [
      c.ui.installTitle,
      c.ui.offlineReady,
      c.ui.voiceTitle,
      c.ui.tracker33Title
    ],
    screenshot: img,
    softwareHelp: { '@id': pageId },
    publisher: { '@id': orgId },
    isPartOf: { '@id': siteId }
  });

  graph.push({
    '@type': 'WebPage',
    '@id': pageId,
    url,
    name: c.meta.title,
    description: c.meta.description,
    inLanguage: c.hreflang,
    isPartOf: { '@id': siteId },
    about: { '@id': `${url}#devotion` },
    primaryImageOfPage: { '@type': 'ImageObject', url: img, width: IMAGE.width, height: IMAGE.height, caption: c.hero.imageAlt },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    potentialAction: { '@type': 'ReadAction', target: [url] },
    /* The page carries its own Web Speech reader over exactly these nodes. */
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.section-title', '.prayer-text']
    }
  });

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.siteName, item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: c.name, item: url }
    ]
  });

  graph.push({
    '@type': 'Article',
    '@id': `${url}#devotion`,
    headline: c.meta.title,
    alternativeHeadline: c.hero.title,
    description: c.meta.description,
    articleSection: c.meta.section,
    inLanguage: c.hreflang,
    isPartOf: { '@id': pageId },
    mainEntityOfPage: { '@id': pageId },
    image: { '@type': 'ImageObject', url: img, width: IMAGE.width, height: IMAGE.height },
    publisher: { '@id': orgId },
    author: { '@id': orgId },
    keywords: c.meta.keywords,
    genre: c.meta.genre,
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    isAccessibleForFree: true,
    /* Every prayer is a citable node with its own deep link, in reading
       order, so an answer engine can quote one prayer rather than the page. */
    hasPart: c.sections.map((s, i) => ({
      '@type': 'CreativeWork',
      '@id': `${url}#${s.id}`,
      name: s.title,
      alternateName: s.subtitle || undefined,
      position: i + 1,
      inLanguage: c.hreflang,
      genre: c.meta.genre,
      isPartOf: { '@id': `${url}#devotion` },
      isAccessibleForFree: true,
      url: `${url}#${s.id}`
    }))
  });

  return { '@context': 'https://schema.org', '@graph': graph };
}

/* ─────────────────────── cold-start discipline ───────────────────────

   A devotion must open at its beginning. Three separate mechanisms used to
   drop the reader half-way into a prayer instead:

     · the browser restores the previous scroll offset on a reload, and an
       installed app relaunching counts as one;
     · a fragment left over from the last session ("…/uk/#golden-arrow")
       survives in the restored URL and the page jumps to it — smoothly,
       because `scroll-behavior: smooth` animates the jump;
     · the root gateway used to forward that fragment on to the locale.

   This runs inline in the head, before the stylesheets, so it settles the
   question before the first paint rather than correcting it afterwards.
   A deep link opened in a browser tab still honours its fragment — that is
   how a search result or a shared prayer link is supposed to arrive. */
function renderBootScript() {
  return `<script>
  (function () {
    var html = document.documentElement;

    /* Suspends \`scroll-behavior: smooth\` for the opening moments. Without it
       the very first jump is animated: the app appears to sail down into a
       prayer on its own before the reader has touched anything. */
    html.className += (html.className ? ' ' : '') + 'js-boot';

    /* The Android app identifies itself in its user agent. Marked here, before
       the stylesheet, so its print and install controls never flash up. */
    if (/SanguisApp/.test(navigator.userAgent)) html.className += ' is-app';

    /* The reader's own text size, restored before the first paint — applied
       any later and every prayer would visibly jump to its new size. */
    try {
      var zoom = parseFloat(localStorage.getItem('pb.textZoom'));
      /* No choice made yet: inside the Android app, start from the font size
         set in the phone's own accessibility settings. */
      if (!(zoom > 0) && window.SanguisApp && SanguisApp.fontScale) {
        zoom = Math.min(1.75, Math.max(1, Math.round(SanguisApp.fontScale() * 20) / 20));
      }
      if (zoom >= 0.8 && zoom <= 2) html.style.setProperty('--zoom', String(zoom));
    } catch (e) { /* storage blocked — the default large print stands */ }

    var fresh = true;
    try {
      fresh = !sessionStorage.getItem('pb.session');
      sessionStorage.setItem('pb.session', '1');
    } catch (e) { /* private mode — treat every load as fresh */ }

    if (fresh) {
      /* Only for this first load: left on 'manual' it would also stop Back
         from returning the reader to where they were. */
      try {
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      } catch (e) {}

      var standalone = false;
      try {
        standalone = matchMedia('(display-mode: standalone)').matches ||
                     matchMedia('(display-mode: minimal-ui)').matches ||
                     matchMedia('(display-mode: fullscreen)').matches ||
                     navigator.standalone === true;
      } catch (e) {}

      /* Inside the installed app there are no inbound deep links, so a
         fragment on a cold start can only be last session's leftover. */
      if (standalone && location.hash && location.hash !== '#hero') {
        try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
      }
    }

    /* The browser's own fragment jump happens before the artwork and the fonts
       have settled, so it lands short and the reader arrives above the prayer
       they asked for. Land again once everything has its final height —
       explicitly instant, never animated. */
    function land() {
      var id = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
      var target = id && document.getElementById(id);
      if (target) {
        try { target.scrollIntoView({ behavior: 'instant', block: 'start' }); }
        catch (e) { target.scrollIntoView(true); }
      } else if (fresh) {
        try { scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
        catch (e) { scrollTo(0, 0); }
      }
    }

    addEventListener('load', function () {
      land();
      /* A late font swap or a decoded image can still move the target; one
         more pass a beat later is what makes the landing reliable. */
      requestAnimationFrame(land);
      setTimeout(function () {
        land();
        html.className = html.className.replace(/(^|\\s)js-boot(\\s|$)/, '$1').trim();
        try { history.scrollRestoration = 'auto'; } catch (e) {}
      }, 250);
    }, { once: true });
  })();
  </script>`;
}

function renderHead(c) {
  const url = langHome(c.code);
  const img = abs(IMAGE.path);
  const alternates = LANGS.filter((l) => l.code !== c.code).map((l) =>
    `<meta property="og:locale:alternate" content="${l.ogLocale}">`).join('\n  ');

  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(c.meta.title)}</title>
  <meta name="description" content="${esc(c.meta.description)}">
  <meta name="keywords" content="${esc(c.meta.keywords)}">
  <meta name="author" content="${esc(ORG.name)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="theme-color" content="${THEME_COLOR}">
  <meta name="color-scheme" content="dark">
  <meta name="format-detection" content="telephone=no">

  <!-- Runs before the stylesheets: a prayer always opens at its beginning. -->
  ${renderBootScript()}

  <!-- Canonical + language targeting -->
  <link rel="canonical" href="${url}">
  ${renderHreflang()}
  <meta http-equiv="content-language" content="${c.hreflang}">
  <meta name="language" content="${esc(c.name)}">

  <!-- Geo targeting (Cloudflare country routing lives in /functions/_middleware.js) -->
  <meta name="geo.region" content="${c.geo.region}">
  <meta name="geo.placename" content="${esc(c.geo.placename)}">
  <meta name="geo.country" content="${c.geo.region}">
  <meta name="distribution" content="global">
  <meta name="coverage" content="Worldwide">
  <meta name="target" content="all">

  <!-- OpenGraph -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${esc(c.siteName)}">
  <meta property="og:locale" content="${c.ogLocale}">
  ${alternates}
  <meta property="og:title" content="${esc(c.meta.ogTitle || c.meta.title)}">
  <meta property="og:description" content="${esc(c.meta.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:secure_url" content="${img}">
  <meta property="og:image:type" content="${IMAGE.type}">
  <meta property="og:image:width" content="${IMAGE.width}">
  <meta property="og:image:height" content="${IMAGE.height}">
  <meta property="og:image:alt" content="${esc(c.hero.imageAlt)}">
  <meta property="article:section" content="${esc(c.meta.section)}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(c.meta.ogTitle || c.meta.title)}">
  <meta name="twitter:description" content="${esc(c.meta.description)}">
  <meta name="twitter:image" content="${img}">
  <meta name="twitter:image:alt" content="${esc(c.hero.imageAlt)}">

  <link rel="icon" href="${FAVICON}">
  <link rel="icon" type="image/png" sizes="192x192" href="../assets/icons/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="../assets/icons/icon-512.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../assets/icons/apple-touch-icon.png">

  <!-- Installable app. One manifest per locale, so launching the installed
       icon opens this language directly instead of bouncing through "/". -->
  <link rel="manifest" href="./app.webmanifest">
  <meta name="application-name" content="${esc(c.brand)}">
  <meta name="apple-mobile-web-app-title" content="${esc(c.brand)}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

  <!-- Self-hosted fonts. No third-party stylesheet in the critical path, and
       the faces are ordinary same-origin files, so they cache for offline. -->
  ${preloadFonts(c)}
  <link rel="stylesheet" href="../assets/css/fonts.css">

  <link rel="preload" as="image" href="../assets/img/Jesus.jpeg" fetchpriority="high">
  <link rel="stylesheet" href="../assets/css/main.css">

  <script type="application/ld+json">
${jsonld(renderStructuredData(c))}
  </script>`;
}

/* ──────────────────────────── page chrome ──────────────────────────── */

function renderLangSwitcher(c) {
  const items = LANGS.map((l) => {
    const current = l.code === c.code;
    return `<li role="none">
              <a role="menuitem" class="lang-option${current ? ' is-current' : ''}"
                 href="../${l.code}/" hreflang="${l.hreflang}" lang="${l.hreflang}"
                 data-lang="${l.code}"${current ? ' aria-current="true"' : ''}>
                <span class="flag" aria-hidden="true">${l.flag}</span>
                <span class="lang-name">${esc(l.name)}</span>
              </a>
            </li>`;
  }).join('\n            ');

  /* Trigger shows the globe and the flag badge only — the language code was
     redundant beside a badge that already reads as the country. */
  return `<div class="lang-switch" data-lang-switch>
          <button type="button" class="btn btn-lang" data-lang-toggle
                  aria-expanded="false" aria-haspopup="true" aria-controls="langMenu"
                  aria-label="${esc(c.ui.languageLabel)}: ${esc(c.name)}">
            ${ICON.globe}
            <span class="flag" aria-hidden="true">${c.flag}</span>
            ${ICON.chevron}
          </button>
          <ul class="lang-menu" id="langMenu" role="menu" aria-label="${esc(c.ui.languageLabel)}" hidden>
            ${items}
          </ul>
        </div>`;
}

/* Voice-prayer controller: gender choice + transport, driven by the Web
   Speech API. Rendered inert; app.js enables it once voices are available. */
function renderVoiceControl(c) {
  return `<div class="voice" data-voice>
          <button type="button" class="btn btn-icon" data-voice-toggle
                  aria-expanded="false" aria-haspopup="dialog" aria-controls="voicePanel"
                  aria-label="${esc(c.ui.voiceLabel)}" title="${esc(c.ui.voiceLabel)}">
            ${ICON.voice}
          </button>
          <div class="voice-panel" id="voicePanel" role="dialog"
               aria-label="${esc(c.ui.voiceTitle)}" hidden>
            <p class="voice-panel-title">${esc(c.ui.voiceTitle)}</p>

            <div class="voice-field">
              <span class="voice-legend" id="voiceGenderLegend">${esc(c.ui.voiceGender)}</span>
              <div class="voice-genders" role="radiogroup" aria-labelledby="voiceGenderLegend">
                <button type="button" class="voice-gender" role="radio" aria-checked="true"
                        data-gender="female">${esc(c.ui.voiceFemale)}</button>
                <button type="button" class="voice-gender" role="radio" aria-checked="false"
                        data-gender="male">${esc(c.ui.voiceMale)}</button>
              </div>
            </div>

            <div class="voice-actions">
              <button type="button" class="btn btn-ghost" data-voice-play>
                ${ICON.play}<span data-voice-play-label>${esc(c.ui.voicePlay)}</span>
              </button>
              <button type="button" class="btn btn-ghost" data-voice-pause disabled>
                ${ICON.pause}<span>${esc(c.ui.voicePause)}</span>
              </button>
              <button type="button" class="btn btn-ghost" data-voice-stop disabled>
                ${ICON.stop}<span>${esc(c.ui.voiceStop)}</span>
              </button>
            </div>

            <p class="voice-status" data-voice-status role="status" aria-live="polite">${esc(c.ui.voiceIdle)}</p>
          </div>
        </div>`;
}

/* Text size: A− / A+ over the reading type only. The steps and the stored
   choice live in app.js; the boot script re-applies it before first paint. */
function renderTextSizeControl(c) {
  return `<div class="textsize" data-textsize>
          <button type="button" class="btn btn-icon" data-textsize-toggle
                  aria-expanded="false" aria-haspopup="dialog" aria-controls="textsizePanel"
                  aria-label="${esc(c.ui.textSizeLabel)}" title="${esc(c.ui.textSizeLabel)}">
            ${ICON.textsize}
          </button>
          <div class="textsize-panel" id="textsizePanel" role="dialog"
               aria-label="${esc(c.ui.textSizeLabel)}" hidden>
            <p class="voice-panel-title">${esc(c.ui.textSizeLabel)}</p>
            <div class="textsize-row">
              <button type="button" class="btn textsize-step" data-textsize-step="-1"
                      aria-label="${esc(c.ui.textSmaller)}" title="${esc(c.ui.textSmaller)}">A−</button>
              <output class="textsize-value" data-textsize-value aria-live="polite">100%</output>
              <button type="button" class="btn textsize-step" data-textsize-step="1"
                      aria-label="${esc(c.ui.textLarger)}" title="${esc(c.ui.textLarger)}">A+</button>
            </div>
            <p class="textsize-hint">${esc(c.ui.textSizeHint)}</p>
          </div>
        </div>`;
}

/* Install control. Rendered hidden; app.js reveals it when the browser fires
   `beforeinstallprompt`, or on iOS Safari — which never fires that event and
   needs the Share-sheet instructions spelled out instead. */
function renderInstallControl(c) {
  return `<div class="install" data-install-wrap hidden>
          <button type="button" class="btn btn-icon" data-install-toggle
                  aria-expanded="false" aria-haspopup="dialog" aria-controls="installPanel"
                  aria-label="${esc(c.ui.installLabel)}" title="${esc(c.ui.installLabel)}">
            ${ICON.install}
          </button>
          <div class="install-panel" id="installPanel" role="dialog"
               aria-label="${esc(c.ui.installTitle)}" hidden>
            <p class="install-title">${esc(c.ui.installTitle)}</p>
            <p class="install-body">${esc(c.ui.installBody)}</p>
            <p class="install-ios" data-install-ios hidden>${esc(c.ui.installIos)}</p>
            <button type="button" class="btn btn-primary install-go" data-install-go hidden>
              ${ICON.install}<span>${esc(c.ui.installAction)}</span>
            </button>
          </div>
        </div>`;
}

/* One live region for the three things the app has to say for itself:
   the prayers are stored, the network went away, a new version is ready. */
function renderToast(c) {
  return `<div class="app-toast no-print" data-toast role="status" aria-live="polite" hidden>
      <span class="app-toast-icon" data-toast-icon aria-hidden="true"></span>
      <span class="app-toast-text" data-toast-text></span>
      <button type="button" class="app-toast-action" data-toast-action hidden></button>
      <button type="button" class="app-toast-close" data-toast-close
              aria-label="${esc(c.ui.dismiss)}" title="${esc(c.ui.dismiss)}">${ICON.close}</button>
    </div>`;
}

function renderNav(c, cls) {
  const links = c.sections.map((s) =>
    `<li><a href="#${esc(s.id)}" data-nav-link>${esc(s.nav)}</a></li>`).join('\n            ');
  return `<nav class="${cls}" aria-label="${esc(c.ui.navLabel)}">
          <ul>
            <li><a href="#hero" data-nav-link>${esc(c.ui.navHome)}</a></li>
            ${links}
          </ul>
        </nav>`;
}

function renderHeader(c) {
  return `<header class="site-header" id="siteHeader">
      <div class="header-inner">
        <a class="brand" href="#hero">
          ${ICON.cross}
          <span class="brand-text">${esc(c.brand)}</span>
        </a>

        ${renderNav(c, 'main-nav')}

        <div class="header-tools">
          ${renderTextSizeControl(c)}
          <button type="button" class="btn btn-icon" data-audio-toggle${c.hasChant ? ' data-chant-src="../assets/audio/chant.mp3"' : ''}
                  aria-pressed="false" aria-label="${esc(c.ui.audioOn)}" title="${esc(c.ui.audioOn)}">
            <span data-audio-icon>${ICON.mute}</span>
          </button>
          ${renderVoiceControl(c)}
          ${renderInstallControl(c)}
          <button type="button" class="btn btn-icon" data-print
                  aria-label="${esc(c.ui.print)}" title="${esc(c.ui.print)}">${ICON.printer}</button>
          ${renderLangSwitcher(c)}
          <button type="button" class="btn btn-icon menu-btn" data-menu-toggle
                  aria-expanded="false" aria-controls="mobileDrawer"
                  aria-label="${esc(c.ui.menuLabel)}">${ICON.menu}</button>
        </div>
      </div>
      <div class="read-progress" aria-hidden="true"><span data-read-progress></span></div>
    </header>

    <div class="drawer" id="mobileDrawer" hidden>
      <div class="drawer-backdrop" data-menu-close></div>
      <div class="drawer-panel" role="dialog" aria-modal="true" aria-label="${esc(c.ui.navLabel)}">
        <button type="button" class="btn btn-icon drawer-close" data-menu-close
                aria-label="${esc(c.ui.closeLabel)}">${ICON.close}</button>
        ${renderNav(c, 'drawer-nav')}
      </div>
    </div>`;
}

function renderHero(c) {
  return `<section id="hero" class="hero" aria-labelledby="heroTitle">
          <div class="hero-body">
            <h1 class="hero-title" id="heroTitle">${esc(c.hero.title)}</h1>
            <blockquote class="hero-quote">
              <p>${esc(c.hero.quote)}</p>
              <cite>${esc(c.hero.quoteRef)}</cite>
            </blockquote>

            <figure class="crucifix-frame">
              <img class="crucifix-img" src="../assets/img/Jesus.jpeg"
                   alt="${esc(c.hero.imageAlt)}"
                   width="${IMAGE.width}" height="${IMAGE.height}"
                   fetchpriority="high" decoding="async">
            </figure>
          </div>

          <a class="scroll-cue no-print" href="#devotion">
            <span>${esc(c.hero.cta)}</span>
            ${ICON.down}
          </a>
        </section>`;
}

function renderFooter(c) {
  const year = new Date().getFullYear();
  const links = LANGS.map((l) =>
    `<a href="../${l.code}/" hreflang="${l.hreflang}" lang="${l.hreflang}"${l.code === c.code ? ' aria-current="true"' : ''}>${l.flag} ${esc(l.name)}</a>`
  ).join('\n            ');

  return `<footer class="site-footer">
      <div class="container">
        <p class="footer-motto">${esc(c.footer.motto)}</p>
        <nav class="footer-langs no-print" aria-label="${esc(c.ui.languageLabel)}">
            ${links}
        </nav>
        <p class="footer-note">${esc(c.footer.note)}</p>

        <!-- Filled by app.js from the service worker's own count. Hidden until
             there is something true to say — an unregistered worker must not
             leave a promise of offline access standing on the page. -->
        <p class="footer-offline no-print" data-offline-status role="status" hidden></p>

        <p class="footer-copy">&copy; ${year} ${esc(c.footer.copyright)}</p>
      </div>
    </footer>

    <button type="button" class="to-top no-print" data-to-top
            aria-label="${esc(c.ui.toTop)}" title="${esc(c.ui.toTop)}">${ICON.up}</button>`;
}

/* ────────────────────────────── page ────────────────────────────── */

/* Localised strings the client script needs at runtime. Emitted as JSON so
   nothing has to be duplicated inside app.js. */
function renderUiStrings(c) {
  return jsonld({
    audioOn:       c.ui.audioOn,
    audioOff:      c.ui.audioOff,
    statusIdle:    c.ui.statusIdle,
    statusDay33:   c.ui.statusDay33,
    statusMarked:  c.ui.statusMarked,
    statusDone33:  c.ui.statusDone33,
    confirmReset:  c.ui.confirmReset,
    iconSound:     ICON.sound,
    iconMute:      ICON.mute,

    speechLang:      c.speechLang,
    voiceMale:       c.ui.voiceMale,
    voiceFemale:     c.ui.voiceFemale,
    voicePlay:       c.ui.voicePlay,
    voiceResume:     c.ui.voiceResume,
    voiceIdle:       c.ui.voiceIdle,
    voiceReading:    c.ui.voiceReading,
    voicePaused:     c.ui.voicePaused,
    voiceDone:       c.ui.voiceDone,
    voiceNoGender:   c.ui.voiceNoGender,
    voiceNoVoice:    c.ui.voiceNoVoice,
    voiceUnsupported: c.ui.voiceUnsupported,

    installLabel:  c.ui.installLabel,
    installAction: c.ui.installAction,
    installedNote: c.ui.installedNote,
    offlineReady:  c.ui.offlineReady,
    offlineStored: c.ui.offlineStored,
    offlineComplete: c.ui.offlineComplete,
    offlineNow:    c.ui.offlineNow,
    backOnline:    c.ui.backOnline,
    updateReady:   c.ui.updateReady,
    updateAction:  c.ui.updateAction,
    iconOffline:   ICON.offline,
    iconCheck:     ICON.check
  });
}

function renderPage(c) {
  return `<!DOCTYPE html>
<html lang="${c.hreflang}" dir="ltr">
<head>
  ${renderHead(c)}
</head>
<body data-lang="${c.code}">

  <a class="skip-link" href="#devotion">${esc(c.ui.skip)}</a>

  <canvas id="bloodCanvas" aria-hidden="true"></canvas>
  <div class="vignette" aria-hidden="true"></div>

  <div class="print-header" aria-hidden="true">
    <strong>${esc(c.siteName)}</strong>
    <span>${SITE_URL.replace(/^https?:\/\//, '')}/${c.code}/</span>
  </div>

  ${renderHeader(c)}

  <main id="main">
    <div class="container">
      ${renderHero(c)}
${c.sections.map((s, i) => renderSection(s, c, i + 1)).join('\n')}
    </div>
  </main>

  ${renderFooter(c)}

  ${renderToast(c)}

  <script type="application/json" id="uiStrings">
${renderUiStrings(c)}
  </script>
  <script src="../assets/js/app.js" defer></script>
</body>
</html>
`;
}

module.exports = { renderPage, esc, jsonld, langHome, ICON, FAVICON };
