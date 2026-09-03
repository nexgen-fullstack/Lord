'use strict';

/* Post-build sanity check: valid JSON-LD, complete hreflang set, correct
   section count, no unresolved markup tokens. Run with `node src/check.js`. */

const fs = require('fs');
const path = require('path');
const { SITE_URL, BASE_PATH, LANGS, DEFAULT_LANG, THEME_COLOR, IMAGE } = require('./site.config');

/* Precache URLs and manifest entries are served-path absolute; on disk they
   live under the repo root, so the sub-directory has to come back off. */
const unbase = (url) => (BASE_PATH && url.indexOf(BASE_PATH) === 0) ? url.slice(BASE_PATH.length) : url;

const ROOT = path.resolve(__dirname, '..');
let failures = 0;

function fail(msg) { failures++; console.log('  ✗ ' + msg); }

console.log('\nSanguis Christi — check\n────────────────────────────────────────────');

for (const lang of LANGS) {
  const file = path.join(ROOT, lang.code, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const notes = [];

  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) fail(`${lang.code}: no JSON-LD block`);
  else {
    try {
      const graph = JSON.parse(ld[1])['@graph'];
      notes.push(graph.map((n) => n['@type']).join(' + '));
      const article = graph.find((n) => n['@type'] === 'Article');
      if (!article || article.hasPart.length !== 6) fail(`${lang.code}: Article.hasPart != 6`);
    } catch (e) { fail(`${lang.code}: JSON-LD invalid — ${e.message}`); }
  }

  const ui = html.match(/<script type="application\/json" id="uiStrings">([\s\S]*?)<\/script>/);
  if (!ui) fail(`${lang.code}: no uiStrings block`);
  else {
    try { JSON.parse(ui[1]); } catch (e) { fail(`${lang.code}: uiStrings invalid — ${e.message}`); }
  }

  const hreflang = (html.match(/rel="alternate" hreflang=/g) || []).length;
  if (hreflang !== LANGS.length + 1) fail(`${lang.code}: ${hreflang} hreflang links, expected ${LANGS.length + 1}`);

  const sections = (html.match(/class="section-card reveal"/g) || []).length;
  if (sections !== 6) fail(`${lang.code}: ${sections} sections, expected 6`);

  if (!/<span class="user-name">/.test(html)) fail(`${lang.code}: name rubric missing`);
  if (/\{\{name\}\}/.test(html)) fail(`${lang.code}: unresolved {{name}} token`);
  if (/\*\*|(?:^|\s)_[^\s_]/m.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) {
    fail(`${lang.code}: unconverted emphasis markup left in output`);
  }

  /* The name input and the 12-year tracker were removed by request — assert
     that no fragment of either creeps back in. */
  if (!/data-tracker="33d"/.test(html)) fail(`${lang.code}: 33-day tracker missing`);
  if (/data-tracker="12y"|data-years|tracker-years/.test(html)) fail(`${lang.code}: 12-year tracker still present`);
  if (/nameInput|name-field|data-name-slot|data-name-clear/.test(html)) fail(`${lang.code}: name input still present`);

  /* Language switcher must not repeat the code beside the flag badge. */
  if (/lang-current|lang-code/.test(html)) fail(`${lang.code}: duplicate language code still rendered`);

  /* Voice-prayer controller */
  if (!/data-voice-toggle/.test(html)) fail(`${lang.code}: voice control missing`);
  ['data-voice-play', 'data-voice-pause', 'data-voice-stop', 'data-voice-status'].forEach((hook) => {
    if (!html.includes(hook)) fail(`${lang.code}: voice control missing ${hook}`);
  });
  if ((html.match(/class="voice-gender"/g) || []).length !== 2) fail(`${lang.code}: expected male + female voice options`);
  if (!new RegExp(`"speechLang": "${lang.speechLang}"`).test(html)) fail(`${lang.code}: speechLang not ${lang.speechLang}`);
  if (!/<meta name="geo.region" content="[A-Z]{2}">/.test(html)) fail(`${lang.code}: geo.region missing`);
  if (!/<link rel="canonical"/.test(html)) fail(`${lang.code}: canonical missing`);

  /* The Eucharistic Heart devotion is the full text: the opening, the
     antiphon said twice, the numbered litany of ten and the ten invocations.
     A regression here would silently truncate a prayer. */
  const refrains = (html.match(/<p class="refrain">/g) || []).length;
  if (refrains !== 2) fail(`${lang.code}: ${refrains} refrains, expected 2`);
  const numbered = html.match(/<ol class="litany-group litany-numbered">([\s\S]*?)<\/ol>/);
  if (!numbered) fail(`${lang.code}: numbered litany missing`);
  else {
    const n = (numbered[1].match(/class="litany-item"/g) || []).length;
    if (n !== 10) fail(`${lang.code}: numbered litany has ${n} invocations, expected 10`);
    if (!/litany-response/.test(numbered[1])) fail(`${lang.code}: numbered litany has no responses`);
  }
  const litanyGroups = (html.match(/class="litany-group/g) || []).length;
  if (litanyGroups < 2) fail(`${lang.code}: expected both Eucharistic litanies`);

  /* Installable-app wiring. */
  if (!/<link rel="manifest" href="\.\/app\.webmanifest">/.test(html)) {
    fail(`${lang.code}: per-locale manifest not linked`);
  }
  if (!/rel="apple-touch-icon"[^>]*apple-touch-icon\.png/.test(html)) {
    fail(`${lang.code}: apple-touch-icon missing`);
  }
  if (!/name="apple-mobile-web-app-capable" content="yes"/.test(html)) {
    fail(`${lang.code}: iOS standalone meta missing`);
  }
  if (!/data-install-toggle/.test(html)) fail(`${lang.code}: install control missing`);
  if (!/data-toast\b/.test(html)) fail(`${lang.code}: app toast missing`);
  if (!/data-offline-status/.test(html)) fail(`${lang.code}: offline status line missing`);

  /* Cold-start discipline. The inline boot script must sit in the head and
     ahead of the stylesheets, or the browser restores the previous scroll
     offset and the app reopens part-way into a prayer. */
  const head = html.slice(0, html.indexOf('</head>'));
  if (head.indexOf("sessionStorage.getItem('pb.session')") === -1) {
    fail(`${lang.code}: cold-start boot script missing from <head>`);
  } else if (head.indexOf("sessionStorage.getItem('pb.session')") >
             head.indexOf('assets/css/main.css')) {
    fail(`${lang.code}: boot script runs after main.css — it must precede it`);
  }
  if (!/scrollRestoration/.test(head)) fail(`${lang.code}: scroll restoration not pinned`);

  /* Self-hosted fonts: no third-party request may survive in the head. */
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html)) {
    fail(`${lang.code}: still linking Google Fonts`);
  }
  if (!/<link rel="stylesheet" href="\.\.\/assets\/css\/fonts\.css">/.test(html)) {
    fail(`${lang.code}: local fonts.css not linked`);
  }
  const preloads = (html.match(/rel="preload" as="font"/g) || []).length;
  if (preloads !== 2) fail(`${lang.code}: ${preloads} font preloads, expected 2`);
  /* A preload the page never uses is a wasted round trip Lighthouse flags. */
  (html.match(/rel="preload" as="font"[^>]*href="\.\.\/assets\/fonts\/([^"]+)"/g) || [])
    .forEach((tag) => {
      const file = tag.match(/fonts\/([^"]+)"/)[1];
      if (!fs.existsSync(path.join(ROOT, 'assets', 'fonts', file))) {
        fail(`${lang.code}: preloads missing font ${file}`);
      }
      if (file.indexOf(lang.fontSubset) === -1) {
        fail(`${lang.code}: preloads ${file}, not the ${lang.fontSubset} subset`);
      }
    });

  /* SERP truncation limits — titles ~60 chars, descriptions ~160. */
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (title.length > 60) fail(`${lang.code}: <title> is ${title.length} chars (max 60)`);
  if (desc.length > 160) fail(`${lang.code}: description is ${desc.length} chars (max 160)`);

  console.log(`  · ${lang.code}  ${(html.length / 1024).toFixed(0).padStart(3)} kB  title ${String(title.length).padStart(2)}  desc ${desc.length}  ${notes[0] || ''}`);
}

for (const f of ['index.html', 'sitemap.xml', 'robots.txt', 'site.webmanifest', 'sw.js',
                 '_headers', '_redirects', 'assets/css/main.css', 'assets/css/fonts.css',
                 'assets/js/app.js', 'assets/img/Jesus.jpeg']) {
  if (!fs.existsSync(path.join(ROOT, f))) fail(`missing file: ${f}`);
}

/* ─────────────── one primary language, everywhere ─────────────── */

/* The default language is declared once in site.config.js. Every artefact
   that encodes it is generated, so this asserts they all actually agree —
   the drift that used to be possible was an edge redirect still pointing at
   the old language after the config had moved on. */
{
  /* BASE_PATH shape. A trailing slash or a missing leading one silently
     produces "//uk/" or "repo/uk/" in the manifests, and the worker then
     fails to install — which costs offline reading and the install prompt
     together, with nothing in the UI to say why. */
  if (BASE_PATH) {
    if (BASE_PATH[0] !== '/') fail(`BASE_PATH "${BASE_PATH}" must start with "/"`);
    if (BASE_PATH.slice(-1) === '/') fail(`BASE_PATH "${BASE_PATH}" must not end with "/"`);
  }
  if (!SITE_URL.endsWith(BASE_PATH)) {
    fail(`SITE_URL "${SITE_URL}" does not end with BASE_PATH "${BASE_PATH}"`);
  }
  if (SITE_URL.slice(-1) === '/') fail(`SITE_URL "${SITE_URL}" must not end with "/"`);

  const root = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  if (!new RegExp(`<html lang="${DEFAULT_LANG}"`).test(root)) {
    fail(`index.html: gateway is not written in ${DEFAULT_LANG}`);
  }
  if (!new RegExp(`hreflang="x-default" href="[^"]*/${DEFAULT_LANG}/"`).test(root)) {
    fail(`index.html: x-default does not point at /${DEFAULT_LANG}/`);
  }
  if (!new RegExp(`rel="canonical" href="[^"]*/${DEFAULT_LANG}/"`).test(root)) {
    fail(`index.html: canonical does not point at /${DEFAULT_LANG}/`);
  }
  /* A fragment forwarded from "/" is what reopened the app mid-prayer. */
  if (/location\.hash/.test(root)) {
    fail('index.html: gateway still forwards location.hash');
  }

  const redirects = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8');
  if (!new RegExp(`^/\\s+/${DEFAULT_LANG}/\\s+302`, 'm').test(redirects)) {
    fail(`_redirects: root does not send to /${DEFAULT_LANG}/`);
  }

  const mw = path.join(ROOT, 'functions', '_middleware.js');
  if (!fs.existsSync(mw)) fail('functions/_middleware.js not generated');
  else {
    const src = fs.readFileSync(mw, 'utf8');
    if (!new RegExp(`const PRIMARY = "${DEFAULT_LANG}"`).test(src)) {
      fail(`_middleware.js: PRIMARY is not ${DEFAULT_LANG}`);
    }
    if (/__LANGS__|__PRIMARY__|__COUNTRY_LANG__/.test(src)) {
      fail('_middleware.js: unsubstituted build placeholder');
    }
    const codes = JSON.parse(src.match(/const LANGS = (\[[^\]]*\]);/)[1]);
    if (codes.join(',') !== LANGS.map((l) => l.code).join(',')) {
      fail('_middleware.js: language list drifted from site.config.js');
    }
  }

  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const locs = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
  if (locs.length !== LANGS.length) {
    fail(`sitemap.xml: ${locs.length} URLs, expected ${LANGS.length}`);
  }
  /* A redirecting URL in a sitemap is a Search Console warning. */
  if (locs.some((l) => /<loc>https?:\/\/[^/]+\/<\/loc>/.test(l))) {
    fail('sitemap.xml: lists the bare root, which 302s');
  }
}

/* ───────────────────── offline bundle ───────────────────── */

/* Reads a PNG's IHDR directly. An icon whose real pixels disagree with the
   size it advertises is silently dropped by Chrome's installability check. */
function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const grab = (name) => {
  const m = sw.match(new RegExp('const ' + name + ' = (\\[[\\s\\S]*?\\]);'));
  return m ? JSON.parse(m[1]) : null;
};
const critical = grab('CRITICAL');
const optional = grab('OPTIONAL');

if (!critical || !optional) fail('sw.js: precache lists not parseable');
else {
  if (!/const VERSION = "[0-9a-f]{12}"/.test(sw)) fail('sw.js: no build version stamped');

  /* Every precached URL must resolve to a file, or install() rejects and the
     app is never available offline at all. */
  let missing = 0;
  for (const url of critical.concat(optional)) {
    const rel = unbase(url).replace(/^\//, '') || 'index.html';
    const file = path.join(ROOT, rel.endsWith('/') ? rel + 'index.html' : rel);
    if (!fs.existsSync(file)) { fail(`sw.js precaches a missing file: ${url}`); missing++; }
  }

  for (const lang of LANGS) {
    if (critical.indexOf(`${BASE_PATH}/${lang.code}/`) === -1) fail(`sw.js: ${BASE_PATH}/${lang.code}/ not precached`);
  }
  const fontsPrecached = optional.filter((u) => unbase(u).indexOf('/assets/fonts/') === 0).length;
  const fontsOnDisk = fs.readdirSync(path.join(ROOT, 'assets', 'fonts'))
    .filter((f) => f.endsWith('.woff2')).length;
  if (fontsPrecached !== fontsOnDisk) {
    fail(`sw.js precaches ${fontsPrecached} fonts, ${fontsOnDisk} on disk`);
  }

  const bytes = critical.concat(optional).reduce((sum, url) => {
    const rel = unbase(url).replace(/^\//, '') || 'index.html';
    const file = path.join(ROOT, rel.endsWith('/') ? rel + 'index.html' : rel);
    try { return sum + fs.statSync(file).size; } catch (e) { return sum; }
  }, 0);
  console.log(`  · offline  ${critical.length} critical + ${optional.length} optional` +
              `  ${(bytes / 1024 / 1024).toFixed(2)} MB${missing ? '  (INCOMPLETE)' : ''}`);
}

/* ───────────────────── manifests + icons ───────────────────── */

for (const lang of LANGS.concat([{ code: '', hreflang: DEFAULT_LANG }])) {
  const rel = lang.code ? `${lang.code}/app.webmanifest` : 'site.webmanifest';
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) { fail(`missing manifest: ${rel}`); continue; }

  let mf;
  try { mf = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { fail(`${rel}: invalid JSON — ${e.message}`); continue; }

  for (const key of ['name', 'short_name', 'start_url', 'scope', 'display',
                     'background_color', 'theme_color', 'icons', 'id', 'lang']) {
    if (!mf[key]) fail(`${rel}: missing "${key}"`);
  }
  if (mf.theme_color !== THEME_COLOR) fail(`${rel}: theme_color ${mf.theme_color} != ${THEME_COLOR}`);
  if (lang.code && mf.start_url !== `${BASE_PATH}/${lang.code}/`) {
    fail(`${rel}: start_url ${mf.start_url} should be ${BASE_PATH}/${lang.code}/`);
  }
  /* A start_url that redirects fails installability on some Android builds. */
  if (mf.start_url === `${BASE_PATH}/`) fail(`${rel}: start_url is the gateway, which redirects — use a locale`);
  if (mf.scope !== `${BASE_PATH}/`) fail(`${rel}: scope ${mf.scope} should be ${BASE_PATH}/`);
  for (const icon of mf.icons) {
    if (BASE_PATH && icon.src.indexOf(BASE_PATH + '/') !== 0) {
      fail(`${rel}: icon ${icon.src} is missing the ${BASE_PATH} prefix`);
    }
  }

  const purposes = mf.icons.map((i) => i.purpose);
  if (purposes.indexOf('any') === -1) fail(`${rel}: no "any" icon`);
  if (purposes.indexOf('maskable') === -1) fail(`${rel}: no maskable icon`);
  if (!mf.icons.some((i) => i.sizes === '512x512')) fail(`${rel}: no 512x512 icon`);

  for (const icon of mf.icons) {
    const ip = path.join(ROOT, unbase(icon.src).replace(/^\//, ''));
    if (!fs.existsSync(ip)) { fail(`${rel}: icon not on disk — ${icon.src}`); continue; }
    const dim = pngSize(ip);
    if (!dim) { fail(`${icon.src}: not a valid PNG`); continue; }
    const [w, h] = icon.sizes.split('x').map(Number);
    if (dim.w !== w || dim.h !== h) {
      fail(`${icon.src}: is ${dim.w}x${dim.h}, declared ${icon.sizes}`);
    }
    if (dim.w !== dim.h) fail(`${icon.src}: not square — launchers reject it`);
  }
}

/* ───────────────── hero artwork dimensions ───────────────── */

/* The width/height on the <img>, in OpenGraph and in the JSON-LD all come from
   IMAGE in site.config.js. When they disagree with the file the browser
   reserves the wrong box and the page shifts as the artwork decodes. */
function jpegSize(file) {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

{
  const file = path.join(ROOT, IMAGE.path);
  const real = fs.existsSync(file) && jpegSize(file);
  if (!real) fail(`${IMAGE.path}: could not read dimensions`);
  else if (real.w !== IMAGE.width || real.h !== IMAGE.height) {
    fail(`${IMAGE.path}: is ${real.w}x${real.h}, site.config declares ${IMAGE.width}x${IMAGE.height}`);
  }
}

/* ───────────────── typographic quotation marks ───────────────── */

/* Each language closes a quotation with its own mark. German opened with the
   low "„" but closed four of them with a straight ASCII quote, which renders
   as a wrong glyph in the prayer text and in every SERP snippet. */
const QUOTES = { uk: ['«', '»'], en: ['“', '”'], de: ['„', '“'],
                 it: ['«', '»'], pt: ['«', '»'], es: ['«', '»'] };

for (const lang of LANGS) {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'content', `${lang.code}.js`), 'utf8');
  const [open, close] = QUOTES[lang.code];
  const count = (ch) => (src.split(ch).length - 1);
  if (count(open) !== count(close)) {
    fail(`${lang.code}: ${count(open)} "${open}" but ${count(close)} "${close}" — unbalanced quotes`);
  }
  const straight = new RegExp(open + '[^' + open + '"]*"', 'g');
  const bad = (src.match(straight) || []).length;
  if (bad) fail(`${lang.code}: ${bad} quotation(s) closed with a straight " instead of ${close}`);
}

/* ───────────────────── self-hosted fonts ───────────────────── */

const fontCss = fs.readFileSync(path.join(ROOT, 'assets/css/fonts.css'), 'utf8');
const faces = (fontCss.match(/@font-face/g) || []).length;
if (!faces) fail('fonts.css: no @font-face rules');
let fontBytes = 0;
for (const m of fontCss.matchAll(/url\('\.\.\/fonts\/([^']+)'\)/g)) {
  const file = path.join(ROOT, 'assets', 'fonts', m[1]);
  if (!fs.existsSync(file)) fail(`fonts.css references a missing file: ${m[1]}`);
  else fontBytes += fs.statSync(file).size;
}
if (!/unicode-range:/.test(fontCss)) {
  fail('fonts.css: no unicode-range — every locale would download every subset');
}
console.log(`  · fonts    ${faces} faces  ${(fontBytes / 1024).toFixed(0)} kB self-hosted`);

console.log('────────────────────────────────────────────');
console.log(failures ? `  ${failures} problem(s) found\n` : '  All checks passed\n');
process.exit(failures ? 1 : 0);
