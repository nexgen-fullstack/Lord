/* ============================================================================
   Cloudflare Pages Function — language routing for the bare root.

   SOURCE FILE. `npm run build` stamps the language list in and writes
   /functions/_middleware.js, which Cloudflare Pages picks up automatically.
   Edit this file, never the generated one.

   The root always opens in Ukrainian, the site's own language — not in
   whatever language the browser or the visitor's country suggests.
   Precedence:

     1. ?lang=xx           explicit override in the URL (and remembered)
     2. pb_lang cookie     a language the reader picked in the switcher
     3. PRIMARY            Ukrainian

   Only the bare root path "/" is redirected, so every localized URL stays
   stable and indexable exactly as its canonical + hreflang tags declare.
   ========================================================================== */

const LANGS = __LANGS__;
const PRIMARY = '__PRIMARY__';
const ONE_YEAR = 60 * 60 * 24 * 365;

function readCookie(header, name) {
  if (!header) return null;
  const match = header.match(new RegExp('(?:^|;\s*)' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const segment = path.split('/')[1];
  if (LANGS.includes(segment)) {
    const response = await next();
    const headers = new Headers(response.headers);
    headers.set('Content-Language', segment);
    /* No Vary and no cookie here on purpose. A localized URL serves one
       language to everybody, and landing on one — a shared link, a search
       result — is not a choice of language for the root; only the switcher
       sets pb_lang. */
    return new Response(response.body, { status: response.status, headers });
  }

  /* Everything except the bare root is served untouched. */
  if (path !== '/' && path !== '') return next();

  /* /?choose serves the language chooser itself instead of routing away. */
  if (url.searchParams.has('choose')) return next();

  const forced = url.searchParams.get('lang');
  const cookie = readCookie(request.headers.get('Cookie'), 'pb_lang');
  const explicit = forced && LANGS.includes(forced) ? forced : null;
  const lang = explicit || (cookie && LANGS.includes(cookie) && cookie) || PRIMARY;

  /* No fragment is forwarded — the server never receives one anyway, and a
     stale hash is exactly what used to reopen the app mid-prayer. */
  const headers = {
    Location: new URL(`/${lang}/`, url).toString(),
    'Cache-Control': 'private, no-store',
    Vary: 'Cookie'
  };
  if (explicit) {
    headers['Set-Cookie'] = `pb_lang=${explicit}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax; Secure`;
  }
  return new Response(null, { status: 302, headers });
}
