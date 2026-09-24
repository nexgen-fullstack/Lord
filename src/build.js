'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { SITE_URL, BASE_PATH, LANGS, DEFAULT_LANG, ORG, IMAGE, THEME_COLOR } = require('./site.config');
const { renderPage, esc, langHome, FAVICON } = require('./template');
const { renderIcon } = require('./icons');

/* Every absolute URL the app hands to the browser at runtime — manifest
   entries and the worker's precache list — has to carry the sub-directory the
   site is served from. Relative links inside the pages already do. */
const p = (rel) => BASE_PATH + rel;

const ROOT = path.resolve(__dirname, '..');
const write = (rel, body) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, 'utf8');
  const kb = (Buffer.byteLength(body, 'utf8') / 1024).toFixed(1);
  console.log(`  ✓ ${rel.padEnd(28)} ${kb.padStart(7)} kB`);
};

/* ───────────────────────── locale pages ───────────────────────── */

console.log('\nSanguis Christi — build\n────────────────────────────────────────────');

/* If a real chant recording has been supplied, the pages link to it; if not,
   the audio toggle goes straight to the synthesised drone and never issues a
   request that would 404. Drop in the file and rebuild to switch over. */
const CHANT = 'assets/audio/chant.mp3';
const hasChant = fs.existsSync(path.join(ROOT, CHANT));
console.log(`  ${hasChant ? '♪ chant.mp3 found — pages will use it' : '♪ no chant.mp3 — using the synthesised drone'}\n`);

const contents = LANGS.map((meta) => {
  const c = require(`./content/${meta.code}`);
  return Object.assign({}, meta, c, { hasChant });
});

for (const c of contents) {
  if (c.sections.length !== 6) {
    throw new Error(`[${c.code}] expected 6 prayer sections, found ${c.sections.length}`);
  }
  write(path.join(c.code, 'index.html'), renderPage(c));
}

/* ───────────────────── root language gateway ───────────────────── */

const hreflangs = LANGS.map((l) =>
  `  <link rel="alternate" hreflang="${l.hreflang}" href="${langHome(l.code)}">`).join('\n') +
  `\n  <link rel="alternate" hreflang="x-default" href="${langHome(DEFAULT_LANG)}">`;

const defaultContent = contents.find((c) => c.code === DEFAULT_LANG);

const gateCards = LANGS.map((l) => {
  const c = contents.find((x) => x.code === l.code);
  return `      <a class="gate-card" href="./${l.code}/" hreflang="${l.hreflang}" lang="${l.hreflang}">
        <span class="gate-flag" aria-hidden="true">${l.flag}</span>
        <span class="gate-name">${esc(l.name)}</span>
        <span class="gate-sub">${esc(c.hero.cta)}</span>
      </a>`;
}).join('\n');

const langMapJs = JSON.stringify(LANGS.reduce((m, l) => { m[l.code] = true; return m; }, {}));

write('index.html', `<!DOCTYPE html>
<html lang="${DEFAULT_LANG}" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(defaultContent.meta.title)}</title>
  <meta name="description" content="${esc(defaultContent.meta.description)}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="${THEME_COLOR}">
  <link rel="canonical" href="${langHome(DEFAULT_LANG)}">
${hreflangs}
  <link rel="icon" href="${FAVICON}">
  <link rel="icon" type="image/png" sizes="192x192" href="./assets/icons/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="./assets/icons/icon-512.png">
  <link rel="apple-touch-icon" sizes="180x180" href="./assets/icons/apple-touch-icon.png">
  <link rel="manifest" href="./site.webmanifest">
  <meta name="apple-mobile-web-app-title" content="${esc(ORG.name)}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(defaultContent.siteName)}">
  <meta property="og:description" content="${esc(defaultContent.meta.description)}">
  <meta property="og:url" content="${SITE_URL}/">
  <meta property="og:image" content="${SITE_URL}/assets/img/Jesus.jpeg">
  <link rel="stylesheet" href="./assets/css/fonts.css">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{min-height:100vh;min-height:100svh;display:grid;place-items:center;padding:6vh 20px;
      background:radial-gradient(ellipse at 50% 0%,#1b0508 0%,#0a0304 62%);color:#f8f3eb;
      font-family:'Montserrat',system-ui,-apple-system,'Segoe UI',sans-serif;text-align:center}
    .gate{max-width:900px;width:100%}
    .gate-cross{font-family:'Cinzel',serif;font-size:2.4rem;color:#d4af37;line-height:1}
    h1{font-family:'Cinzel','Times New Roman',serif;font-size:clamp(1.25rem,4vw,2.1rem);color:#d4af37;
      margin:18px 0 10px;letter-spacing:1px;text-wrap:balance}
    .gate p.quote{color:#dcd0bf;font-size:clamp(.85rem,2.4vw,1rem);max-width:56ch;margin:0 auto 32px;line-height:1.6;font-style:italic}
    /* Flex, not grid: six cards over two rows leave the last row short, and a
       grid would strand those two against the left edge. */
    .gate-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:14px}
    .gate-card{flex:1 1 190px;
      display:flex;flex-direction:column;align-items:center;gap:6px;padding:22px 16px;
      border:1px solid rgba(212,175,55,.35);border-radius:12px;text-decoration:none;color:#f8f3eb;
      background:rgba(20,5,7,.55);transition:border-color .25s,transform .25s,box-shadow .25s}
    .gate-card:hover,.gate-card:focus-visible{border-color:rgba(212,175,55,.85);transform:translateY(-3px);
      box-shadow:0 10px 30px rgba(139,0,0,.45);outline:none}
    .gate-flag{font-size:1.9rem;line-height:1}
    .gate-name{font-family:'Cinzel','Times New Roman',serif;font-size:1.05rem;color:#d4af37;letter-spacing:.5px}
    .gate-sub{font-size:.72rem;color:#dcd0bf;text-transform:uppercase;letter-spacing:1.4px}
    .gate-note{margin-top:28px;font-size:.75rem;color:#9c8f80;letter-spacing:1px;text-transform:uppercase}
    /* Three across from tablet up, so six languages read as two even rows;
       below that they stretch to the full width of a phone. */
    @media (min-width:640px){.gate-card{flex:0 1 calc(33.333% - 10px)}}
    @media (prefers-reduced-motion:reduce){.gate-card{transition:none}.gate-card:hover{transform:none}}
  </style>
  <noscript><meta http-equiv="refresh" content="0; url=./${DEFAULT_LANG}/"></noscript>
  <script>
    /* The root always opens in Ukrainian, the site's own language, whatever
       language the phone or browser happens to be set to. Another language
       only when the reader has picked one in the switcher (remembered as
       pb.langChoice), or when the link says so with ?lang=xx. Edge routing
       (Cloudflare Pages) in /functions/_middleware.js follows the same rule.
       Visit /?choose to reach the language chooser below instead.

       The redirect deliberately drops any fragment. A hash arriving at the bare
       root is never a fresh intention — it is a leftover from a previous
       session that an app relaunch or a restored tab carried back — and
       forwarding it is what used to open the app part-way into a prayer
       instead of at the beginning. Deep links keep working: they point at
       /<lang>/#section directly and never pass through here. */
    (function () {
      var supported = ${langMapJs};
      var primary = ${JSON.stringify(DEFAULT_LANG)};
      var go = function (code) { location.replace('./' + code + '/'); };
      try {
        var params = new URLSearchParams(location.search);
        if (params.has('choose')) return;

        var forced = params.get('lang');
        if (forced && supported[String(forced).toLowerCase().split('-')[0]]) {
          return go(String(forced).toLowerCase().split('-')[0]);
        }

        var chosen = null;
        try { chosen = localStorage.getItem('pb.langChoice'); } catch (e) {}
        if (chosen && supported[chosen]) return go(chosen);
      } catch (e) { /* no storage or no URLSearchParams — Ukrainian */ }
      go(primary);
    })();
  </script>
</head>
<body>
  <main class="gate">
    <div class="gate-cross" aria-hidden="true">✝</div>
    <h1>${esc(defaultContent.hero.title)}</h1>
    <p class="quote">${esc(defaultContent.hero.quote)}</p>
    <nav class="gate-grid" aria-label="Language">
${gateCards}
    </nav>
    <p class="gate-note">${esc(ORG.name)}</p>
  </main>
  <script>
    /* Picking a language here is a choice, and the root remembers it. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('.gate-card');
      if (!a) return;
      try { localStorage.setItem('pb.langChoice', a.getAttribute('hreflang')); } catch (err) {}
    });
  </script>
</body>
</html>
`);

/* ───────────────────────────── sitemap ───────────────────────────── */

const today = new Date().toISOString().slice(0, 10);
const urls = LANGS.map((l) => {
  const alts = LANGS.map((a) =>
    `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${langHome(a.code)}"/>`).join('\n');
  return `  <url>
    <loc>${langHome(l.code)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l.code === DEFAULT_LANG ? '1.0' : '0.9'}</priority>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${langHome(DEFAULT_LANG)}"/>
    <image:image>
      <image:loc>${SITE_URL}/assets/img/Jesus.jpeg</image:loc>
      <image:title>${esc(contents.find((c) => c.code === l.code).hero.imageAlt)}</image:title>
    </image:image>
  </url>`;
}).join('\n');

/* The bare root is deliberately absent: it answers 302 in every deployment,
   and a redirecting URL in a sitemap is a Search Console warning and never an
   indexable target. The six localized homes carry the whole hreflang set. */
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`);

/* ───────────────────────────── robots ───────────────────────────── */

write('robots.txt', `User-agent: *
Allow: /

# Nothing here is generated per-visitor, so nothing needs to be hidden.
# The manifests and the service worker are crawlable on purpose: Google reads
# the manifest to confirm the site is installable.

Sitemap: ${SITE_URL}/sitemap.xml
`);

/* ──────────────────────────── app icons ──────────────────────────── */

/* Square PNGs, drawn from the palette in main.css. The old manifest advertised
   the 832 × 1248 photograph, which Android rejects for the launcher — an
   installed app got a generic placeholder instead of the cross. */
const ICON_SIZES = [
  { file: 'icon-192.png', size: 192, opts: {} },
  { file: 'icon-512.png', size: 512, opts: {} },
  { file: 'icon-maskable-192.png', size: 192, opts: { maskable: true } },
  { file: 'icon-maskable-512.png', size: 512, opts: { maskable: true } },
  { file: 'apple-touch-icon.png', size: 180, opts: {} }
];

fs.mkdirSync(path.join(ROOT, 'assets', 'icons'), { recursive: true });
for (const ic of ICON_SIZES) {
  write(path.join('assets', 'icons', ic.file), renderIcon(ic.size, ic.opts));
}

/* ─────────────────────── web app manifests ─────────────────────── */

/* One manifest per locale. A single root manifest would have to point
   `start_url` at "/", which 302s to a language — and a redirect on launch is
   both slower and, on some Android builds, enough to fail the installability
   check. Each locale's manifest starts the app straight in that language. */

const manifestIcons = [
  { src: p('/assets/icons/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: p('/assets/icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
  { src: p('/assets/icons/icon-maskable-192.png'), sizes: '192x192', type: 'image/png', purpose: 'maskable' },
  { src: p('/assets/icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' }
];

for (const c of contents) {
  const home = p(`/${c.code}/`);
  write(path.join(c.code, 'app.webmanifest'), JSON.stringify({
    id: home,
    name: c.siteName,
    short_name: c.brand,
    description: c.meta.description,
    lang: c.hreflang,
    dir: 'ltr',
    start_url: home,
    scope: p('/'),
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    orientation: 'any',
    categories: ['books', 'education', 'lifestyle'],
    icons: manifestIcons,
    /* Long-press the installed icon to jump straight to a devotion. */
    shortcuts: c.sections.slice(0, 4).map((s) => ({
      name: s.title,
      short_name: s.nav,
      url: `${home}#${s.id}`,
      icons: [{ src: p('/assets/icons/icon-192.png'), sizes: '192x192', type: 'image/png' }]
    }))
  }, null, 2) + '\n');
}

/* The root gateway keeps a manifest of its own, in the default language. */
write('site.webmanifest', JSON.stringify({
  id: p('/'),
  name: ORG.legalName,
  short_name: ORG.name,
  description: defaultContent.meta.description,
  lang: DEFAULT_LANG,
  dir: 'ltr',
  start_url: p(`/${DEFAULT_LANG}/`),
  scope: p('/'),
  display: 'standalone',
  display_override: ['standalone', 'minimal-ui'],
  background_color: THEME_COLOR,
  theme_color: THEME_COLOR,
  orientation: 'any',
  categories: ['books', 'education', 'lifestyle'],
  icons: manifestIcons
}, null, 2) + '\n');

/* ───────────────────────── service worker ───────────────────────── */

/* Everything that must be readable with no network at all. */
const CRITICAL = []
  .concat(LANGS.map((l) => p(`/${l.code}/`)))
  .concat(['/assets/css/main.css', '/assets/css/fonts.css', '/assets/js/app.js'].map(p));

const fontFiles = fs.existsSync(path.join(ROOT, 'assets', 'fonts'))
  ? fs.readdirSync(path.join(ROOT, 'assets', 'fonts')).filter((f) => f.endsWith('.woff2')).sort()
  : [];

const OPTIONAL = []
  /* Not '/': it 302s to a locale everywhere, and a cached redirect is
     both useless and rejected outright by some Cache implementations. */
  .concat([p('/index.html'), p(`/assets/img/${path.basename(IMAGE.path)}`)])
  .concat(LANGS.map((l) => p(`/${l.code}/app.webmanifest`)))
  .concat([p('/site.webmanifest')])
  .concat(ICON_SIZES.map((i) => p(`/assets/icons/${i.file}`)))
  .concat(fontFiles.map((f) => p(`/assets/fonts/${f}`)));

/* The cache name is derived from the bytes actually being shipped, so a
   deploy that changes one prayer invalidates the old cache, and a rebuild
   that changes nothing leaves installed readers undisturbed. */
/* Served paths carry BASE_PATH; on disk the files sit under the repo root, so
   it has to come back off before reading them. Skipping this step is not a
   cosmetic slip: every read fails, the hash falls back to the URL list, and
   the version then stops moving when the content does — installed readers
   would never be offered an update again. */
const unbase = (url) => (BASE_PATH && url.indexOf(BASE_PATH) === 0) ? url.slice(BASE_PATH.length) : url;

const hash = crypto.createHash('sha256');
let hashed = 0;
for (const rel of CRITICAL.concat(OPTIONAL)) {
  const bare = unbase(rel).replace(/^\//, '') || 'index.html';
  const file = path.join(ROOT, bare.endsWith('/') ? bare + 'index.html' : bare);
  try { hash.update(fs.readFileSync(file)); hashed++; }
  catch (e) { hash.update(rel); }
}
if (hashed !== CRITICAL.length + OPTIONAL.length) {
  throw new Error(`cache version read ${hashed}/${CRITICAL.length + OPTIONAL.length} files — ` +
    'the version would stop tracking the content; check BASE_PATH');
}
const SW_VERSION = hash.digest('hex').slice(0, 12);

const swSource = fs.readFileSync(path.join(__dirname, 'service-worker.js'), 'utf8');
write('sw.js', swSource
  .replace("'__VERSION__'", JSON.stringify(SW_VERSION))
  .replace('__CRITICAL__', JSON.stringify(CRITICAL, null, 2))
  .replace('__OPTIONAL__', JSON.stringify(OPTIONAL, null, 2))
  .replace("'__FALLBACK__'", JSON.stringify(p(`/${DEFAULT_LANG}/`)))
  .replace("'__ROOT__'", JSON.stringify(p('/'))));

/* ─────────────────────────── GitHub Pages ─────────────────────────── */

/* Without this, Pages runs the output through Jekyll, which drops every file
   and folder whose name starts with an underscore. Nothing here needs Jekyll. */
write('.nojekyll', '');

/* ──────────────────── host headers (Netlify / Pages) ──────────────────── */

/* Fingerprinted assets could be cached forever, but nothing here is
   fingerprinted, so the long-lived entries are the ones whose URL genuinely
   never changes meaning: fonts and icons. HTML and the worker stay revalidated
   so a new devotion reaches readers on their next visit. */
write('_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()

/sw.js
  Cache-Control: no-cache
  Service-Worker-Allowed: /

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*.webmanifest
  Content-Type: application/manifest+json; charset=utf-8
  Cache-Control: public, max-age=3600

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

/assets/icons/*
  Cache-Control: public, max-age=604800

/assets/img/*
  Cache-Control: public, max-age=2592000

/assets/css/*
  Cache-Control: public, max-age=86400, must-revalidate

/assets/js/*
  Cache-Control: public, max-age=86400, must-revalidate
`);

/* ─────────────────── Netlify / static-host redirects ─────────────────── */

write('_redirects', `# Static-host fallback (Netlify / Cloudflare Pages).
# Language routing on Cloudflare Pages lives in /functions/_middleware.js.
/  /${DEFAULT_LANG}/  302
`);

/* ──────────────── Cloudflare Pages edge middleware ──────────────── */

/* Generated from site.config.js for the same reason sw.js is: the language
   list used to be duplicated by hand in functions/_middleware.js, so
   changing the default language here left the edge still redirecting to the
   old one — a drift no test would have caught. */
write(path.join('functions', '_middleware.js'),
  fs.readFileSync(path.join(__dirname, 'middleware.js'), 'utf8')
    .replace('__LANGS__', JSON.stringify(LANGS.map((l) => l.code)))
    .replace("'__PRIMARY__'", JSON.stringify(DEFAULT_LANG)));

console.log('────────────────────────────────────────────');
console.log(`  ${LANGS.length} locales · ${SITE_URL}`);
console.log(`  offline cache ${SW_VERSION} · ${CRITICAL.length} critical + ${OPTIONAL.length} optional files\n`);
