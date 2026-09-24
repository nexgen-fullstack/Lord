'use strict';

/* ============================================================================
   SANGUIS CHRISTI — font self-hosting
   ----------------------------------------------------------------------------
   Downloads the exact woff2 subsets the site uses from Google Fonts and writes
   them into assets/fonts/, plus assets/css/fonts.css to declare them.

     node src/fetch-fonts.js      (or: npm run fonts)

   This is the ONLY step that touches the network, and it is deliberately not
   part of `npm run build` — the files it produces are committed and the build
   stays offline and deterministic.

   Three reasons the site self-hosts rather than linking fonts.googleapis.com:

     1. Offline. A service worker cannot reliably precache an opaque
        cross-origin response; self-hosted files are just another same-origin
        asset and land in the offline cache with everything else.
     2. Speed. The Google stylesheet is render-blocking and costs a DNS
        lookup + TLS handshake to two extra hosts before a glyph is drawn.
     3. Privacy. No visitor IP is handed to a third party — which for an
        EU-facing devotional site is the difference between a GDPR question
        and no question at all.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
const CSS_OUT = path.join(ROOT, 'assets', 'css', 'fonts.css');

/* Only the families and styles main.css actually asks for, each requested as
   a weight *range*. All three are variable fonts, so a range comes back as a
   single file per subset carrying every weight in between — seven files in
   all, where discrete weights used to cost nineteen.

     Lora        the reading face. A sturdy book serif with a tall x-height
                 and full Cyrillic, chosen over Cormorant Garamond, whose
                 hairline strokes and small x-height read thin on a phone.
     Cinzel      Roman capitals for the brand and the hero title (Latin only —
                 Cyrillic falls back to Lora through the font stack).
     Montserrat  the interface: menu, buttons, labels. */
const FAMILIES = [
  'Cinzel:wght@400..700',
  'Lora:ital,wght@0,400..700;1,400..700',
  'Montserrat:wght@400..700'
];

/* Exactly the two subsets the six locales need — verified by scanning every
   character of every content file against each subset's unicode-range:
   Ukrainian resolves to `cyrillic` (which includes U+0490-0491, Ґ and ґ), and
   the five Latin locales to `latin`. Nothing lands in latin-ext or
   cyrillic-ext, so fetching them would add 610 kB the site can never render.
   Re-run that scan if a language with Central-European or Greek glyphs is
   ever added. */
const KEEP_SUBSETS = ['latin', 'cyrillic'];

/* A modern desktop UA is what makes the API serve woff2 rather than ttf. */
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function get(url, binary) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(get(res.headers.location, binary));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`${res.statusCode} for ${url}`));
      }
      const parts = [];
      res.on('data', (c) => parts.push(c));
      res.on('end', () => resolve(binary ? Buffer.concat(parts) : Buffer.concat(parts).toString('utf8')));
    }).on('error', reject);
  });
}

/* Splits the API stylesheet into { subset, family, style, weight, url, range }. */
function parseFaces(css) {
  const faces = [];
  const re = /\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const subset = m[1];
    const body = m[2];
    const pick = (k) => {
      const r = new RegExp(k + ':\\s*([^;]+);');
      const hit = body.match(r);
      return hit ? hit[1].trim() : '';
    };
    const src = body.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (!src) continue;
    faces.push({
      subset,
      family: pick('font-family').replace(/^['"]|['"]$/g, ''),
      style: pick('font-style') || 'normal',
      weight: pick('font-weight') || '400',
      range: pick('unicode-range'),
      url: src[1]
    });
  }
  return faces;
}

/* A variable face reports its weight as a range ("400 700"); the space has
   no place in a file name. */
const slug = (f) =>
  `${f.family.toLowerCase().replace(/\s+/g, '-')}-${f.weight.replace(/\s+/g, '-')}${f.style === 'italic' ? '-italic' : ''}-${f.subset}.woff2`;

(async function main() {
  console.log('\nSanguis Christi — fonts\n────────────────────────────────────────────');
  fs.mkdirSync(FONT_DIR, { recursive: true });

  const all = [];
  for (const family of FAMILIES) {
    const url = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
    const css = await get(url, false);
    const faces = parseFaces(css).filter((f) => KEEP_SUBSETS.indexOf(f.subset) > -1);
    console.log(`  ${family.split(':')[0].replace(/\+/g, ' ').padEnd(20)} ${String(faces.length).padStart(2)} faces`);
    all.push(...faces);
  }

  let bytes = 0;
  for (const f of all) {
    const name = slug(f);
    const dest = path.join(FONT_DIR, name);
    const data = await get(f.url, true);
    fs.writeFileSync(dest, data);
    bytes += data.length;
    f.file = name;
  }

  /* Faces from a previous run that are no longer asked for must go: build.js
     precaches every woff2 in the folder, so a stale file would be shipped to
     every reader's device for nothing. */
  const keep = new Set(all.map((f) => f.file));
  for (const old of fs.readdirSync(FONT_DIR)) {
    if (old.endsWith('.woff2') && !keep.has(old)) fs.unlinkSync(path.join(FONT_DIR, old));
  }

  /* `font-display: swap` keeps text readable during the (now local, so very
     short) load. unicode-range is preserved so a Latin page never downloads
     the Cyrillic subsets and vice versa. */
  const css = `/* ============================================================================
   Self-hosted web fonts — generated by \`npm run fonts\`. Do not edit by hand.
   ${all.length} woff2 subsets · ${(bytes / 1024).toFixed(0)} kB total
   ========================================================================== */

` + all.map((f) => `@font-face {
  font-family: '${f.family}';
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url('../fonts/${f.file}') format('woff2');
  unicode-range: ${f.range};
}`).join('\n\n') + '\n';

  fs.writeFileSync(CSS_OUT, css, 'utf8');

  console.log('────────────────────────────────────────────');
  console.log(`  ${all.length} files · ${(bytes / 1024).toFixed(0)} kB → assets/fonts/`);
  console.log(`  assets/css/fonts.css written\n`);
})().catch((e) => {
  console.error('\n  ✗ font fetch failed:', e.message);
  console.error('    The committed assets/fonts/ + fonts.css are still valid; ' +
                'the build does not need this step.\n');
  process.exit(1);
});
