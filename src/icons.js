'use strict';

/* ============================================================================
   SANGUIS CHRISTI — application icons
   ----------------------------------------------------------------------------
   Draws the brand cross straight into PNG bytes. No canvas, no image library,
   no network: just zlib (built into Node) and a hand-rolled CRC-32.

   Why generate rather than ship files: an installed PWA needs *square* icons,
   and the only image in the repo — Jesus.jpeg — is 832 × 1248. Chrome rejects
   a non-square icon for the launcher, so the old manifest advertised an icon
   Android would never use. These are square, exact, and rebuilt on every
   `npm run build`, so the palette can never drift from the CSS.
   ========================================================================== */

const zlib = require('zlib');

/* ─────────────────────────── PNG plumbing ─────────────────────────── */

const CRC_TABLE = (function () {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

/* RGBA pixel buffer → PNG file bytes (colour type 6, 8 bits per channel). */
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;    // bit depth
  ihdr[9] = 6;    // colour type: truecolour with alpha
  ihdr[10] = 0;   // deflate
  ihdr[11] = 0;   // adaptive filtering
  ihdr[12] = 0;   // no interlace

  /* Filter byte 0 (None) in front of every scanline. The art is smooth
     gradients over flat fields, so deflate already does well here. */
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const dst = y * (1 + width * 4);
    raw[dst] = 0;
    rgba.copy(raw, dst + 1, y * width * 4, (y + 1) * width * 4);
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ──────────────────────────── the artwork ──────────────────────────── */

/* Palette lifted from main.css so the icon and the site cannot drift apart. */
const IN_GROUND = [0x25, 0x07, 0x0b];   // centre of the ground
const OUT_GROUND = [0x0a, 0x03, 0x04];  // --bg-void, the outer field
const GOLD = [0xd4, 0xaf, 0x37];        // --accent-gold
const GOLD_HI = [0xf0, 0xd8, 0x84];     // --accent-gold-bright
const CRIMSON = [0x8b, 0x00, 0x00];     // --accent-crimson

const mix = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t)
];
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* The Latin cross, in a 0..1 square. `arm` is the half-thickness of a bar. */
function crossCoverage(x, y, cx, cy, halfW, halfH, arm, barY) {
  const inVertical = Math.abs(x - cx) <= arm && y >= cy - halfH && y <= cy + halfH;
  const inHorizontal = Math.abs(y - barY) <= arm && x >= cx - halfW && x <= cx + halfW;
  return inVertical || inHorizontal;
}

/**
 * Render one square icon.
 *
 * @param {number} size    edge length in pixels
 * @param {object} [opts]
 * @param {boolean} [opts.maskable]  shrink the cross into the 80% safe circle
 *                                   and paint the ground full-bleed, as the
 *                                   maskable-icon spec requires
 * @param {boolean} [opts.round]     clip to a circle (Safari pinned tabs etc.)
 * @returns {Buffer} PNG bytes
 */
function renderIcon(size, opts) {
  const o = opts || {};
  const px = Buffer.alloc(size * size * 4);
  const SS = 3;                     // 3×3 supersampling — enough for straight edges
  const half = size / 2;

  /* A maskable icon may lose its outer 10% to the launcher's mask, so the
     cross is drawn smaller and the ground is allowed to bleed to the edge. */
  const scale = o.maskable ? 0.60 : 0.84;
  const cx = 0.5, cy = 0.5;
  const halfH = 0.5 * scale;                 // vertical bar: half-height
  const halfW = 0.345 * scale;               // horizontal bar: half-width
  const arm = 0.083 * scale;                 // half-thickness of both bars
  const barY = cy - 0.165 * scale;           // where the transverse bar crosses

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let hits = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const u = (x + (sx + 0.5) / SS) / size;
          const v = (y + (sy + 0.5) / SS) / size;
          if (crossCoverage(u, v, cx, cy, halfW, halfH, arm, barY)) hits++;
        }
      }
      const cover = hits / (SS * SS);

      /* Ground: a radial fall-off from a warm centre to the void, with a
         faint crimson bloom behind the cross. */
      const dx = (x + 0.5) / size - 0.5;
      const dy = (y + 0.5) / size - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy) / 0.7071;   // 0 at centre, 1 at corner

      let rgb = mix(IN_GROUND, OUT_GROUND, clamp01(Math.pow(dist, 0.85)));
      rgb = mix(rgb, CRIMSON, clamp01(0.30 * (1 - dist * 1.5)));

      /* Gold glow so the cross is not a flat cut-out at small sizes. */
      const glow = clamp01(0.42 * (1 - dist * 1.85));
      rgb = mix(rgb, GOLD, glow * 0.28);

      if (cover > 0) {
        /* Vertical sheen down the cross itself. */
        const face = mix(GOLD_HI, GOLD, clamp01((y / size - 0.18) / 0.72));
        rgb = mix(rgb, face, cover);
      }

      let alpha = 255;
      if (o.round) {
        const r = Math.sqrt(dx * dx + dy * dy) * size;
        const edge = half - 0.5;
        alpha = Math.round(255 * clamp01(edge - r + 0.5));
      }

      const i = (y * size + x) * 4;
      px[i] = rgb[0]; px[i + 1] = rgb[1]; px[i + 2] = rgb[2]; px[i + 3] = alpha;
    }
  }

  return encodePNG(size, size, px);
}

module.exports = { renderIcon, encodePNG };
