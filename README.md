# Sanguis Christi

**Возвеличення Найсвятішої Крові Господа нашого Ісуса Христа**
A six-language liturgical web application for the devotion to the Most Precious Blood of Jesus Christ.

Static HTML/CSS/JS. No framework, no runtime dependencies, no build toolchain beyond Node itself.
Every localized page ships as **fully rendered static HTML** — crawlers see the complete prayer
text, not a JavaScript shell — and the whole devotion **installs to a phone and works with no
network at all**, either as the installable web app or as the **Android app** in `android/`.

Everything a reader reads is set in **large print**: Lora at about 22px on a phone and 28px on a
desktop, bright ink on a still, dark card, and an **A− / A+** control for anyone who needs more.

---

## Quick start

```bash
npm run dev
```

That builds all six locales, validates the output, and serves the site at `http://localhost:4173`.

Individual commands:

```bash
npm run build   # regenerate the locales + sitemap, icons, manifests, sw.js, _headers
npm run check   # validate JSON-LD, hreflang, prayers, offline bundle, icons, fonts
npm start       # preview server only
npm run fonts   # re-download the self-hosted woff2 subsets (needs network)
npm run apk     # build the Android app → android/dist/SanguisChristi.apk
```

`npm run fonts` is the **only** command that touches the network, and it is deliberately outside
the build: the files it writes are committed, so `npm run build` is offline and deterministic.
You only need it when a family, weight or language changes.

---

## Layout

```
/                        root language gateway (auto-detect + chooser, x-default → /uk/)
/uk/  /en/  /de/         one static page per locale
/it/  /pt/  /es/
/assets/css/main.css     the whole design system
/assets/css/fonts.css    self-hosted @font-face declarations      (generated)
/assets/fonts/*.woff2    7 variable-font subsets, 206 kB           (generated)
/assets/icons/*.png      app icons, incl. maskable + apple-touch  (generated)
/assets/js/app.js        canvas, nav, drawer, switcher, text size, tracker, audio,
                         voice, print, the offline app (install, cache, updates)
                         and the Android app's speech bridge
/assets/img/Jesus.jpeg   the crucifixion image
/assets/audio/           drop chant.mp3 here (see “Ambient chant” below)
/functions/_middleware.js  Cloudflare Pages country routing            (generated)
/android/                the Android app (see “Android app” below)
  build.js               ► builds and signs the APK from the built site
  src/…/MainActivity.java  the web view, the asset server, the speech bridge
/src/                    build sources — edit these, not the generated output
  site.config.js         ► domain, languages, geo targeting, publisher entity
  content/<lang>.js      ► all prayer text and UI strings for one language
  template.js            page renderer (head, SEO, blocks, chrome)
  service-worker.js      ► the offline worker; build.js injects its asset lists
  middleware.js          ► the edge router; build.js injects the language matrix
  icons.js               PNG encoder — draws the app icons from the CSS palette
  fetch-fonts.js         downloads the woff2 subsets (network; run by hand)
  build.js               writes the site
  check.js               post-build validation
  serve.js               preview server
sw.js  sitemap.xml  robots.txt  _headers  _redirects              (generated)
site.webmanifest  <lang>/app.webmanifest                          (generated)
```

**Never edit `uk/index.html` and friends** — they are regenerated on every build.
Edit `src/content/<lang>.js` and run `npm run build`.

---

## Before you deploy

Open `src/site.config.js` and change one line:

```js
const SITE_URL = 'https://sanguis-christi.org';
```

Everything derived from it — canonicals, all seven `hreflang` links, OpenGraph URLs,
JSON-LD `@id`s, the sitemap and `robots.txt` — updates on the next `npm run build`.

Also in that file:

- **`ORG`** — the publisher entity used for `schema.org/Organization` and OpenGraph.
- **`CHURCH`** — an optional `schema.org/CatholicChurch` node, **disabled by default**.
  It is off deliberately: declaring a CatholicChurch entity for a site that is not an actual
  parish is false structured data and search engines treat it as spam. If this site belongs
  to a real parish, fill in its details and set `enabled: true`.

### Hosting

| Host | What to do |
| --- | --- |
| **Cloudflare Pages** *(recommended)* | Deploy the repo root. `functions/_middleware.js` is picked up automatically and gives country-aware routing on `/`. |
| **Netlify / any static host** | Deploy the repo root. `_redirects` sends `/` → `/uk/`; the root page's own JS still negotiates the visitor's language. |
| **Plain Apache/nginx** | Serve the directory as-is. Everything works from the filesystem; even `file://` works for local reading. |
| **GitHub Pages** | Deploy from the branch, folder `/ (root)` — the repo *is* the built site. Set `BASE_PATH` (see below). `_headers`, `_redirects` and `functions/` are inert here; the root page's own JS still negotiates the language. |

### Serving from a sub-directory

`BASE_PATH` in `src/site.config.js` is the one line that matters. The pages link to their assets
relatively and do not care, but three things are absolute because the browser demands it — the
manifest `start_url`/`scope`/`icons`, the worker's precache list, and its offline fallback — and
if those carry the wrong prefix the worker fails to install. That failure is silent: no error the
reader can see, just no offline copy and **no install prompt**.

| Where it is served | `BASE_PATH` | `SITE_URL` |
| --- | --- | --- |
| own domain, Netlify, Cloudflare Pages | `''` | `https://example.org` |
| `https://<user>.github.io/` (repo named `<user>.github.io`) | `''` | `https://<user>.github.io` |
| `https://<user>.github.io/<repo>/` | `'/<repo>'` | `https://<user>.github.io/<repo>` |

`npm start` mirrors it, so the preview exercises the very URLs the manifests were built with, and
`npm run check` refuses a `BASE_PATH` with a stray slash or a `SITE_URL` that disagrees with it.

### Why the install prompt may not appear

Installability is not something this site can force; the browser decides. It needs **HTTPS**
(`localhost` counts, `file://` and a phone pointed at your laptop do not), a manifest with 192 and
512 icons, and a registered worker. Given those, Chromium fires `beforeinstallprompt` and the
install button in the header reveals itself.

**iOS never fires it.** Safari has no install prompt at all — the only route onto the home screen
is Share → *На екран «Домівка»*, which is exactly what the app's iOS hint spells out. An iPhone
showing no button is not a bug.

---

## Geo-SEO

Each locale page carries:

- `<link rel="canonical">` plus **all six `hreflang` variants and `x-default`** (7 links, cross-linked
  bidirectionally, as Google requires).
- Localized `<title>`, `<meta name="description">` and `keywords`, kept within SERP truncation
  limits (≤ 60 and ≤ 160 characters — `npm run check` enforces this).
- Full OpenGraph set with `og:locale` + five `og:locale:alternate`, and a Twitter summary card.
- `geo.region`, `geo.placename`, `geo.country`, `content-language`.
- JSON-LD `@graph`: `Organization` → `WebSite` → `WebApplication` → `WebPage` →
  `BreadcrumbList` → `Article`, where the `Article` carries one `CreativeWork` per prayer in
  `hasPart` — each with its own `@id`, `position` and deep link, so an answer engine can cite a
  single prayer rather than the whole page.
- A `WebApplication` node stating what the site genuinely is: free, no account, every platform,
  and working offline once opened. That is what lets an assistant answer *“is there a prayer app
  that works without signal”* with this site.
- `speakable` on the `WebPage`, pointing at `.section-title` and `.prayer-text` — the same nodes
  the page's own Web Speech reader recites.
- `_headers` ships `nosniff`, `Referrer-Policy`, `X-Frame-Options` and a closed `Permissions-Policy`,
  immutable caching for fonts, and `no-cache` for `sw.js` (a cached worker is an un-updatable app).

`sitemap.xml` lists every locale with reciprocal `xhtml:link` alternates and an `image:image`
entry. The bare `/` is deliberately absent: it answers 302 everywhere, and a redirecting URL in a
sitemap is a Search Console warning, never an indexable target.

**Language routing precedence** (`functions/_middleware.js`, generated from `src/middleware.js`):
`?lang=` → `pb_lang` cookie → **Ukrainian if the browser lists it at all** → `CF-IPCountry` →
`Accept-Language` → `uk`. Ukrainian is the site's own language, so a Ukrainian speaker abroad
reaches it ahead of whatever country their IP resolves to. Only the bare `/` is ever redirected,
so every localized URL stays stable and indexable exactly as its canonical declares.

Neither the edge nor the root gateway forwards a fragment. A hash arriving at `/` is always a
leftover from a previous session, and forwarding it is what used to reopen the app part-way into
a prayer instead of at its beginning.

Localized responses carry `Content-Language` but deliberately **no `Vary`**. A localized URL
serves one language to everybody — the path decides it, not the request headers — so varying on
`Accept-Language` and `CF-IPCountry` would fragment the edge cache into a copy per header
combination without ever changing a byte. Only `/`, which really does negotiate, sets `Vary`.

Two escape hatches on the root: **`/?lang=de`** forces a language, **`/?choose`** shows the
language chooser page instead of routing away. Both the edge middleware and the preview server
honour them, so they behave identically in development and production.

---

## Features

| Feature | Notes |
| --- | --- |
| **Text size** | The “Aa” button: A− / A+ in six steps, 85 % to 175 % of the default large print. Moves only the reading type, never the chrome, keeps the line the reader was on in place, and is restored before the first paint. In the Android app the starting size follows the phone's own font-size setting. |
| **Language switcher** | Flag badge + native name, keyboard navigable, **preserves the current `#section`** so the reader keeps their place across languages. Choice persisted in `localStorage`. |
| **Voice prayer** | Reads the prayers aloud via the Web Speech API — male/female voice, play / pause / stop. See below. |
| **33-day tracker** | 33 dots, progress bar, completion message. One mark per calendar day, kept in `localStorage`. |
| **Ambient canvas** | Falling drops of the Precious Blood + slow light rays. Capped at 30 fps, device-pixel-ratio capped at 1.5, gradients cached per resize, paused when the tab is hidden or when printing, and disabled entirely under `prefers-reduced-motion`. |
| **Ambient chant** | Toggle in the header. See below. |
| **Print** | `@media print` gives clean black-on-white prayer sheets: canvas, chrome, tracker, install control and toast removed, the hero on its own page, cards kept off page breaks. |
| **Installable** | Header button offers a real install on Android/desktop, and the Share-sheet instructions on iOS, which never fires `beforeinstallprompt`. Hidden when it would do nothing. |
| **Offline** | The whole devotion — all six languages, the artwork and every font — is precached. See **Offline app** below. |

The Act of Consecration carries the traditional printed rubric — `(ім’я)` / `(name)` / `(nombre)` —
as static sacred text. There is no name input: the reader supplies their own name aloud, as in a
printed missal.

### Voice prayer

The header's microphone button opens a small controller: **voice gender** (male / female) and a
**play / pause / stop** transport. Reading starts from the prayer the reader is currently looking
at (taken from the scrollspy), scrolls each section into view as it reaches it, and continues to
the end of the page.

- **Language** comes from `speechLang` in `src/site.config.js` (`uk-UA`, `en-US`, `de-DE`,
  `it-IT`, `pt-PT`, `es-ES`) — the reader always matches the page being read.
- **Gender** is inferred from the voice *name*, because `SpeechSynthesisVoice` exposes no gender
  field: explicit words (`male`, `weiblich`, `femminile`, `чоловічий`, …) plus a table of known
  platform voice names. Female patterns are tested first — "female" contains "male". Verified
  live against Microsoft Hedda/Katja (female) and Stefan (male).
- **Graceful degradation** is layered: no voice for the language → the transport disables and the
  panel says so; the requested gender missing → it uses the available voice and warns; no Web
  Speech API at all → the panel explains that. The button never silently does nothing.
- Text is chunked to ~180 characters at sentence boundaries, which avoids the long-utterance
  cutoff several engines have, and lets pause/stop respond immediately.
- Speech is cancelled on `beforeunload` / `pagehide`, so a recitation never outlives the page
  when the reader switches language.

**Organ harmony:** while the voice speaks, the ambient organ ducks to **27%** (`DUCK_LEVEL` in
`assets/js/app.js`) and returns to full on pause, stop or completion — verified as gain ramps of
`0.09 → 0.0243 → 0.09`. Turning the organ on *during* a recitation starts it already ducked.

### Ambient chant

The toggle works out of the box with **no audio file**: it synthesises a soft organum drone
(open fifths on D–A–D–A, slow amplitude breathing, convolution reverb) with the Web Audio API.

To use a real recording instead, drop an MP3 at `assets/audio/chant.mp3` and rebuild:

```bash
npm run build
```

The build detects the file and links the pages to it (it prints which mode it chose). If the file
is present but fails to play in a given browser, the toggle still falls back to the drone at
runtime. If it is absent, no audio request is ever made — no 404 in anyone's console.

---

## Offline app

The site installs to a home screen and then works with **no network at all**. That is not a
progressive nicety here; it is the point. Someone praying on a pilgrimage, in a hospital, on a
train or in a church basement should not lose the text because the signal did.

### What is stored

`npm run build` writes `sw.js` with two lists and a version stamped from the bytes being shipped:

| List | Contents | On failure |
| --- | --- | --- |
| **critical** | the six locale pages, `main.css`, `fonts.css`, `app.js` | install fails and is retried — the app is never half-installed |
| **optional** | artwork, all 19 font subsets, five icon sizes, seven manifests, the gateway | install still succeeds; the cache tops up on the next visit |

Together, **1.2 MB** for the complete devotion in six languages.

### How it serves

Prayer pages are **cache-first**: a devotion opens instantly and opens with no signal. Freshness
is handled behind it — every hit revalidates in the background, and when a genuinely new build is
found the worker installs it and *waits*. It never swaps the page out from under someone
mid-prayer; the reader gets a quiet notice with a **refresh** action and chooses the moment.
Activating a new version deletes every older cache, so a superseded prayer text cannot survive a
deploy.

Three details worth keeping if you edit `src/service-worker.js`:

- **`/` is never cached.** It 302s to a locale in every deployment, and a cached redirect is both
  useless and rejected outright by some `Cache` implementations. Offline, `/` falls back to the
  gateway page, which can still negotiate a language from what *is* cached.
- **Range requests pass straight through.** Handing a cached `200` back for a `Range` request
  breaks audio playback in Safari.
- **`cache: 'reload'` on every precache request**, so a fresh deploy can never be precached from a
  stale browser-cache entry.
- **Precaching is per-file with one retry**, not `cache.addAll`. One dropped request on mobile
  data used to abort the whole install and leave the reader with no offline copy at all; now the
  critical set is retried, and `activate` tops up whatever the optional set could not reach.

### Saying so on the page

The footer carries one quiet line — `[data-offline-status]` — filled from the worker's own count
of the precache list. It stays hidden until the worker answers, because an unregistered worker
must not leave a promise of offline access standing on the page. Complete, it reads *«Усі молитви
збережено на пристрої»* and turns gold; partial, it shows the honest `n / total`.

### Opening at the beginning

A devotion must open at its beginning, and three separate mechanisms used to drop the reader
half-way into a prayer instead: the browser restoring the previous scroll offset on what an
installed app treats as a reload, a fragment left over from the last session surviving in the
restored URL, and the root gateway forwarding that fragment on to the locale.

`renderBootScript()` in `src/template.js` settles it inline in the `<head>`, ahead of the
stylesheets, so it happens before the first paint rather than being corrected after it:

| Situation | What happens |
| --- | --- |
| Installed app, cold start, leftover hash | hash dropped, opens at the top |
| Installed app, cold start, no hash | opens at the top, scroll restoration pinned for that load |
| Browser tab, deep link from a search result | fragment honoured — that is how a shared prayer link arrives |
| Same session, reload or Back | untouched; the browser restores the reader's place |

It also suspends `scroll-behavior: smooth` for the opening moments (`html.js-boot`), so the first
jump is never animated, and lands the fragment again after `load` — the browser's own jump fires
before the artwork and fonts have their final height, and used to land the reader above the
prayer they asked for.

### Icons

`src/icons.js` draws the brand cross directly into PNG bytes — a CRC-32 and `zlib`, no image
library and no network. It exists because an installed app needs **square** icons and the only
photograph in the repo is 832 × 1248: Android silently rejected it, so the old manifest advertised
an icon no launcher would ever use. The generated set is 192/512 plain, 192/512 maskable (the
cross shrunk into the 80% safe circle) and a 180px apple-touch icon, all drawn from the same
palette as `main.css`, so the icon cannot drift from the site.

### Manifests

One manifest per locale, not one for the site. A single root manifest would have to point
`start_url` at `/`, which redirects — slower on launch, and enough to fail the installability
check on some Android builds. `/uk/app.webmanifest` starts the app in Ukrainian, and each carries
`shortcuts` so a long-press on the icon jumps straight to a devotion.

---

## Fonts

Three families, all **variable fonts**, requested as weight ranges so each subset is a single
file: **Lora** (every word that is read — a sturdy book serif with a tall x-height and full
Cyrillic), **Cinzel** (brand and hero title; Latin only, so Ukrainian falls through to Lora) and
**Montserrat** (menu, buttons, labels). Lora replaced Cormorant Garamond, whose hairline strokes
and small x-height read thin on a phone even at 25px.

They are **self-hosted** (`npm run fonts`), not linked from Google:

1. **Offline.** A service worker cannot reliably precache an opaque cross-origin response.
   Self-hosted faces are ordinary same-origin files and cache with everything else.
2. **Speed.** The Google stylesheet is render-blocking and costs DNS + TLS to two extra hosts
   before a single glyph is drawn.
3. **Privacy.** No visitor IP reaches a third party — which for an EU-facing devotional site is
   the difference between a GDPR question and no question at all.

Only what is actually rendered is downloaded: 7 files, 206 kB. Scanning every character
of all six content files against each subset's `unicode-range` showed that **only `latin` and
`cyrillic` are ever needed** — Ukrainian resolves to `cyrillic`, which includes U+0490–0491
(Ґ, ґ), and nothing lands in `latin-ext` or `cyrillic-ext`. Dropping those two saved 610 kB.

Re-run that scan if you add a language with Central-European, Greek or Vietnamese glyphs, and
update `KEEP_SUBSETS` in `src/fetch-fonts.js` plus `fontSubset` in `src/site.config.js`.

---

## Accessibility

Verified in-browser against the rendered colours:

| Element | Contrast on `#0a0304` |
| --- | --- |
| Body prayer text, litany calls | **19.7 : 1** |
| Secondary text, nav | **16.8 : 1** |
| Opening prayers (pale gold) | **16.7 : 1** |
| Gold headings, litany responses | **12.6 : 1** |
| Muted notes | **12.9 : 1** |
| Section subtitles | **10.5 : 1** |

All are at least 10 : 1, well past the WCAG **AAA** threshold of 7 : 1. The prayers sit on a
near-opaque card (`--card-bg`), not over the animated canvas, so the contrast holds everywhere.

Large-print choices, all in `main.css`: ragged-right text with no indent and no hyphenation;
litany responses in bold gold rather than italic; the opening prayers upright rather than in
italic; `text-wrap: pretty` so a response never leaves one word alone on a line; chant and poem
lines wrap in balanced halves on a phone.

> Note: `#a71d2a` (Passion Red) measures 2.8 : 1 as text. It is kept for borders and glows, and
> the tint `--accent-rose: #ff9fae` carries the same colour identity in text.

Also: skip link, single `h1` with a clean `h1 → h2 → h3` outline, labelled landmarks and
navigations, `aria-expanded` / `aria-pressed` on all toggles, focus moved into and restored from
the mobile drawer, Escape closes menus, visible `:focus-visible` rings, `alt` text on the image,
`prefers-reduced-motion` honoured throughout.

## Layout guarantees

The hero fits **strictly within one fold** at every viewport. It is sized with
`calc(100svh - var(--header-h))` (`100vh` fallback), the image is a flex child with
`min-height: 0` so it shrinks rather than pushing, and the section has `overflow: hidden` as a
hard backstop. Verified with zero horizontal overflow at 375 × 812, 800 × 455, 1440 × 900 and
2560 × 1400; short-landscape breakpoints at `max-height: 560px` and `430px` drop the citation
and the quote in turn.

### Header

`.header-inner` is a flex row of three parts: the brand (`flex: 0 0 auto`), the nav
(`flex: 1 1 auto; min-width: 0; overflow: hidden`) and the controls
(`flex: 0 0 auto; flex-shrink: 0; margin-left: auto`). The controls can therefore never be
shrunk or overlapped by the navigation, and a long translation clips at the nav's own edge
rather than painting across the language switcher.

Sizing the rail is a **six-language** problem, not a Ukrainian one: Ukrainian is the
*narrowest* locale, so calibrating against it alone under-sizes the header by ~60px. Two
consequences are baked into the CSS:

- `.header-inner` is capped at **1760px**, wider than the reading column. At the old 1360px cap
  Spanish could not fit at *any* viewport width.
- Below 1800px `.brand-text` is hidden, handing its ~240px to the navigation; the cross keeps
  the brand mark and the full title heads the page immediately below.

At weight 600 the links measure 861px (uk) to 920px (es/it) at 0.8rem, and up to ~985px at
0.86rem; the controls take ~290px. The rail therefore appears at **≥ 1340px** at 0.8rem and
grows to 0.86rem from 1440px; below 1340px the drawer, with its large full-width links, takes
over. If you add an item or a longer translation, re-measure every locale at exactly 1340px —
the worst case is Spanish or Italian, never Ukrainian.

---

## Android app

`npm run apk` builds **`android/dist/SanguisChristi.apk`** (~680 kB): a signed app that carries
all six languages, the fonts and the artwork, and works with no network from the very first
launch. It asks for **no permissions at all** — not even the internet.

It is a single web view showing the very pages the site serves. `android/build.js` rebuilds the
site, copies the pages into the APK, and serves them to the web view from
`https://appassets.androidplatform.net`, a host Android reserves for app assets and never
resolves on the network — so the pages keep a real https origin (the tracker and the text size
persist) while nothing can leave the device. Inside the app (`html.is-app`, from its user agent)
the service worker, the install button and the print button are switched off.

Android's web view has no Web Speech synthesis, so the app passes the page a bridge to the
phone's own text-to-speech engine, and `app.js` wraps it in a standard `speechSynthesis`: the
voice prayer works unchanged. Only voices installed on the phone are offered, so reading aloud
also works offline. A Ukrainian voice may need installing once in Android's text-to-speech
settings.

**Building** needs the Android SDK and a JDK 17+ — exactly what Android Studio installs (the
script finds both on its own; `ANDROID_HOME` / `JAVA_HOME` override). No Gradle and no downloads:
it runs `aapt2`, `javac`, `d8`, `zipalign` and `apksigner` directly.

```bash
npm run apk                     # release APK
node android/build.js --debug   # page inspectable from chrome://inspect
```

**The signing key** is created on the first build in `android/keystore/` (ignored by git). Back
that folder up: Android installs an update over an existing app only when it carries the same
signature, so losing the key means readers would have to uninstall before updating.

**Installing** on a phone: copy the APK over and open it, allowing installation from that source
when asked — or `adb install android/dist/SanguisChristi.apk`. For Google Play the same project
would need an app bundle (`.aab`) and a Play signing setup; the APK is for direct distribution.

On iPhone, the site itself is the app: Safari → Share → *На екран «Домівка»*.

---

## Adding a language

1. Copy `src/content/en.js` to `src/content/<code>.js` and translate it — including the
   `ui.install*` / `ui.offline*` strings the offline app speaks in and the text-size labels (`ui.textSizeLabel`, `textSmaller`, `textLarger`, `textSizeHint`).
2. Add an entry to `LANGS` in `src/site.config.js` (code, hreflang, og locale, flag, geo,
   countries, `speechLang`, `fontSubset`).
3. List the countries in that entry's `countries` array — `build.js` compiles them into the
   edge router's `COUNTRY_LANG` map.
4. If the language needs glyphs outside `latin`/`cyrillic`, add its subset to `KEEP_SUBSETS` in
   `src/fetch-fonts.js` and run `npm run fonts`.
5. `npm run build && npm run check`.

The switcher, footer, sitemap, hreflang set, root gateway, its own web app manifest and the
offline precache all pick it up automatically.

---

## A note on the texts

The Prayer to the Eucharistic Heart of Jesus is carried **complete**: the opening invocation, the
antiphon *“Eucharistic Heart of Jesus, I trust in Thee”* said before and after, the numbered
litany of ten, the ten invocations, and the closing prayer. The site previously held only the
second half. Both litanies render from the same `litany` block — `ordered: true` gives the
numbered form used in the printed devotional.


These are traditional Catholic devotional prayers. The promises attached to several of them
(the twelve-year prayer, St Gertrude's prayer, the thirty-three days) come from **private
revelations**; they are devotional tradition, not articles of faith, and each locale's footer
says so. Indulgence figures are quoted as they appear in the pre-conciliar sources.
