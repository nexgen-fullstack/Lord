'use strict';

/* ============================================================================
   SANGUIS CHRISTI — global site configuration
   ----------------------------------------------------------------------------
   ► Point the site at your real domain by editing SITE_URL below (one line).
     Everything else — canonicals, hreflang, OpenGraph, sitemap, JSON-LD —
     is derived from it automatically.
   ========================================================================== */

const SITE_URL = 'https://nexgen-fullstack.github.io/Lord';

/* Sub-directory the site is served from, '' when it sits at the domain root.
   Own domain, Netlify, Cloudflare Pages, a `<user>.github.io` repo → leave it
   empty. A normal GitHub Pages repo serves at
   https://<user>.github.io/<repo>/, and there BASE_PATH must be '/<repo>' —
   with a leading slash and no trailing one. It is what the manifests and the
   service worker's precache list are built from; get it wrong and the worker
   fails to install, which quietly costs you both offline reading and the
   install prompt. SITE_URL must end with the same path. */
const BASE_PATH = '/Lord';

/* Language matrix. Order here = order in the language switcher. */
/* `speechLang` is the BCP-47 tag handed to the Web Speech API for the
   voice-prayer reader.
   `fontSubset` names the self-hosted woff2 subset this locale actually renders
   in (see src/fetch-fonts.js); it drives the <link rel=preload> so the first
   paint does not wait on a font the page will never use. */
const LANGS = [
  { code: 'uk', hreflang: 'uk', ogLocale: 'uk_UA', name: 'Українська', flag: '🇺🇦', speechLang: 'uk-UA', fontSubset: 'cyrillic',
    geo: { region: 'UA',    placename: 'Україна' },       countries: ['UA'] },
  { code: 'en', hreflang: 'en', ogLocale: 'en_US', name: 'English',    flag: '🇬🇧', speechLang: 'en-US', fontSubset: 'latin',
    geo: { region: 'US',    placename: 'United States' },  countries: ['US','GB','IE','CA','AU','NZ','PH','IN','ZA','NG','KE','SG','MT'] },
  { code: 'de', hreflang: 'de', ogLocale: 'de_DE', name: 'Deutsch',    flag: '🇩🇪', speechLang: 'de-DE', fontSubset: 'latin',
    geo: { region: 'DE',    placename: 'Deutschland' },    countries: ['DE','AT','CH','LI','LU'] },
  { code: 'it', hreflang: 'it', ogLocale: 'it_IT', name: 'Italiano',   flag: '🇮🇹', speechLang: 'it-IT', fontSubset: 'latin',
    geo: { region: 'IT',    placename: 'Italia' },         countries: ['IT','VA','SM'] },
  { code: 'pt', hreflang: 'pt', ogLocale: 'pt_PT', name: 'Português',  flag: '🇵🇹', speechLang: 'pt-PT', fontSubset: 'latin',
    geo: { region: 'PT',    placename: 'Portugal' },       countries: ['PT','BR','AO','MZ','CV','GW','ST','TL'] },
  { code: 'es', hreflang: 'es', ogLocale: 'es_ES', name: 'Español',    flag: '🇪🇸', speechLang: 'es-ES', fontSubset: 'latin',
    geo: { region: 'ES',    placename: 'España' },         countries: ['ES','MX','AR','CO','CL','PE','VE','EC','GT','CU','BO','DO','HN','PY','SV','NI','CR','PA','UY','PR','GQ'] }
];

/* The site's primary language. It is the x-default target, the language the
   bare "/" falls back to, the one the root gateway is written in, and the
   locale the offline fallback page is served from. */
const DEFAULT_LANG = 'uk';

/* Publisher entity used for schema.org/Organization + OpenGraph. */
const ORG = {
  name: 'Sanguis Christi',
  legalName: 'Sanguis Christi — Devotion to the Most Precious Blood',
  logoPath: 'assets/img/Jesus.jpeg',
  email: '',                 // optional — appears in JSON-LD only when non-empty
  sameAs: []                 // optional — social / directory profiles
};

/* Optional schema.org/CatholicChurch node.
   Left disabled on purpose: emitting a CatholicChurch entity for a site that is
   not an actual parish is false structured data and Google treats it as spam.
   Fill in your real parish details and flip `enabled` to true if this site
   belongs to one. */
const CHURCH = {
  enabled: false,
  name: '',
  url: '',
  telephone: '',
  address: { streetAddress: '', addressLocality: '', postalCode: '', addressCountry: '' },
  geo: { latitude: '', longitude: '' }
};

const IMAGE = {
  path: 'assets/img/Jesus.jpeg',
  width: 832,
  height: 1263,
  type: 'image/jpeg'
};

/* Theme tokens mirrored into <meta name="theme-color"> and the JSON-LD. */
const THEME_COLOR = '#0a0304';

module.exports = { SITE_URL, BASE_PATH, LANGS, DEFAULT_LANG, ORG, CHURCH, IMAGE, THEME_COLOR };
