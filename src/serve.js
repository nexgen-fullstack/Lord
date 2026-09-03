'use strict';

/* Zero-dependency preview server: `npm start` → http://localhost:4173
   Mirrors the production URL shape (/uk/, /en/, … and the root redirect). */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 4173;
/* Read from the one place the language matrix is declared, so the preview
   cannot route differently from production. */
const config = require('./site.config');
const LANGS = config.LANGS.map(function (l) { return l.code; });
const DEFAULT_LANG = config.DEFAULT_LANG;
const BASE_PATH = config.BASE_PATH || '';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon'
};

http.createServer(function (req, res) {
  var url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  var pathname = decodeURIComponent(url.pathname);

  /* Mirror the sub-directory the site is deployed under, so the preview
     exercises the same URLs the manifests and the worker were built with. */
  if (BASE_PATH) {
    if (pathname === BASE_PATH) { res.writeHead(302, { Location: BASE_PATH + '/' }); return res.end(); }
    if (pathname.indexOf(BASE_PATH + '/') !== 0) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404 — outside ' + BASE_PATH); }
    pathname = pathname.slice(BASE_PATH.length);
  }

  /* Mirrors functions/_middleware.js: route the bare root, but let /?choose
     through so the language chooser page can actually be reached. */
  if (pathname === '/' && !url.searchParams.has('choose')) {
    var wanted = url.searchParams.get('lang');
    var lang = LANGS.indexOf(wanted) > -1 ? wanted : DEFAULT_LANG;
    res.writeHead(302, { Location: BASE_PATH + '/' + lang + '/' });
    return res.end();
  }

  var rel = pathname.replace(/^\/+/, '');
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';

  var file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.readFile(file, function (err, body) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 — ' + pathname);
    }
    var type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    var headers = { 'Content-Type': type, 'Cache-Control': 'no-cache' };

    /* Mirrors the production _headers file: the worker must be allowed to
       claim the whole origin, and must never be served from a stale cache —
       otherwise a rebuilt offline bundle is invisible in development. */
    if (rel === 'sw.js') headers['Service-Worker-Allowed'] = '/';

    res.writeHead(200, headers);
    res.end(body);
  });
}).listen(PORT, function () {
  console.log('\n  Sanguis Christi — preview\n  http://localhost:' + PORT + BASE_PATH + '/\n');
  LANGS.forEach(function (l) { console.log('    http://localhost:' + PORT + BASE_PATH + '/' + l + '/'); });
  console.log('');
});
