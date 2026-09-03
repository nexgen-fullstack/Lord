/* ============================================================================
   Cloudflare Pages Function — country- and header-aware language routing.
   SOURCE FILE. `npm run build` stamps the language matrix in and writes
   /functions/_middleware.js, which Cloudflare Pages picks up automatically.
   Edit this file, never the generated one.

   Precedence:
     1. ?lang=xx           explicit override in the URL
     2. pb_lang cookie     the visitor's remembered choice
     3. PRIMARY            the site's own language, if the browser lists it
     4. CF-IPCountry       the country Cloudflare resolved from the IP
     5. Accept-Language    the browser's own preference list
     6. PRIMARY            the x-default target
   Only the bare root path "/" is redirected, so every localized URL stays
   stable and indexable exactly as its canonical + hreflang tags declare.
   ========================================================================== */

const LANGS = ["uk","en","de","it","pt","es"];
const PRIMARY = "uk";
const COUNTRY_LANG = {
  "UA": "uk",
  "US": "en",
  "GB": "en",
  "IE": "en",
  "CA": "en",
  "AU": "en",
  "NZ": "en",
  "PH": "en",
  "IN": "en",
  "ZA": "en",
  "NG": "en",
  "KE": "en",
  "SG": "en",
  "MT": "en",
  "DE": "de",
  "AT": "de",
  "CH": "de",
  "LI": "de",
  "LU": "de",
  "IT": "it",
  "VA": "it",
  "SM": "it",
  "PT": "pt",
  "BR": "pt",
  "AO": "pt",
  "MZ": "pt",
  "CV": "pt",
  "GW": "pt",
  "ST": "pt",
  "TL": "pt",
  "ES": "es",
  "MX": "es",
  "AR": "es",
  "CO": "es",
  "CL": "es",
  "PE": "es",
  "VE": "es",
  "EC": "es",
  "GT": "es",
  "CU": "es",
  "BO": "es",
  "DO": "es",
  "HN": "es",
  "PY": "es",
  "SV": "es",
  "NI": "es",
  "CR": "es",
  "PA": "es",
  "UY": "es",
  "PR": "es",
  "GQ": "es"
};

const ONE_YEAR = 60 * 60 * 24 * 365;

function acceptedCodes(header) {
  if (!header) return [];
  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { code: tag.toLowerCase().split('-')[0], q: q ? parseFloat(q.split('=')[1]) : 1 };
    })
    .filter((entry) => entry.code && !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q)
    .map((entry) => entry.code);
}

function readCookie(header, name) {
  if (!header) return null;
  const match = header.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  /* Remember an explicit choice on any localized page. */
  const segment = path.split('/')[1];
  if (LANGS.includes(segment)) {
    const response = await next();
    const headers = new Headers(response.headers);
    headers.set('Content-Language', segment);
    /* No Vary here on purpose. A localized URL serves one language to
       everybody — the path decides it, not the request headers — so varying
       on Accept-Language and CF-IPCountry would fragment the edge cache into
       a copy per header combination without ever changing the bytes. Only
       the bare "/", which really does negotiate, sets Vary (see below). */
    if (readCookie(request.headers.get('Cookie'), 'pb_lang') !== segment) {
      headers.append(
        'Set-Cookie',
        `pb_lang=${segment}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax; Secure`
      );
    }
    return new Response(response.body, { status: response.status, headers });
  }

  /* Everything except the bare root is served untouched. */
  if (path !== '/' && path !== '') return next();

  /* /?choose serves the language chooser itself instead of routing away. */
  if (url.searchParams.has('choose')) return next();

  const forced = url.searchParams.get('lang');
  const cookie = readCookie(request.headers.get('Cookie'), 'pb_lang');
  const country = (request.headers.get('CF-IPCountry') || (request.cf && request.cf.country) || '').toUpperCase();
  const accepted = acceptedCodes(request.headers.get('Accept-Language'));

  const lang =
    (forced && LANGS.includes(forced) && forced) ||
    (cookie && LANGS.includes(cookie) && cookie) ||
    /* The site's own language wins whenever the reader understands it at all,
       ahead of the IP's country — a Ukrainian abroad gets Ukrainian. */
    (accepted.includes(PRIMARY) && PRIMARY) ||
    COUNTRY_LANG[country] ||
    accepted.find((code) => LANGS.includes(code)) ||
    PRIMARY;

  /* No fragment is forwarded — the server never receives one anyway, and a
     stale hash is exactly what used to reopen the app mid-prayer. */
  const target = new URL(`/${lang}/`, url);

  return new Response(null, {
    status: 302,
    headers: {
      Location: target.toString(),
      'Cache-Control': 'private, no-store',
      Vary: 'Accept-Language, CF-IPCountry, Cookie',
      'Set-Cookie': `pb_lang=${lang}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax; Secure`
    }
  });
}
