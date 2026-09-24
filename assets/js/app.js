/* ============================================================================
   SANGUIS CHRISTI — application script
   Ambient canvas · navigation · i18n switcher · text size · prayer trackers ·
   ambient chant · voice reader · print · offline app (install, cache,
   updates) · the Android app's bridge to the device's own speech engine.
   No dependencies, no build step.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js-reveal');

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LANG = document.body.getAttribute('data-lang') || 'en';

  /* The Android app (android/) loads these same pages from inside its APK and
     says so in its user agent. There the prayers are already on the device:
     no service worker, no install prompt, no cache to report. */
  var NATIVE = /SanguisApp/.test(navigator.userAgent);

  /* Localised UI strings emitted by the page. */
  var UI = (function () {
    var el = document.getElementById('uiStrings');
    try { return el ? JSON.parse(el.textContent) : {}; } catch (e) { return {}; }
  })();

  var store = {
    get: function (k, fallback) {
      try { var v = localStorage.getItem(k); return v === null ? fallback : v; }
      catch (e) { return fallback; }
    },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  var fmt = function (tpl, vars) {
    return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? vars[k] : m;
    });
  };

  /* Ambient organ levels. While the voice prayer speaks, the drone is ducked
     to DUCK_LEVEL so the recitation stays clear over it. */
  var BASE_VOL = 0.34;      /* chant.mp3 element volume     */
  var SYNTH_GAIN = 0.09;    /* synthesised drone master gain */
  var DUCK_LEVEL = 0.27;    /* 27% — inside the 20–30% band  */

  var voiceActive = false;  /* true while speech synthesis is talking */

  /* Populated by initAudio; harmless no-ops until then. */
  var Ambient = { duck: function () {}, release: function () {} };

  /* The two header popovers are mutually exclusive. */
  function closeLangMenu() {
    var menu = document.getElementById('langMenu');
    var t = document.querySelector('[data-lang-toggle]');
    if (menu && !menu.hidden) { menu.hidden = true; if (t) t.setAttribute('aria-expanded', 'false'); }
  }
  function closeVoicePanel() {
    var p = document.getElementById('voicePanel');
    var t = document.querySelector('[data-voice-toggle]');
    if (p && !p.hidden) { p.hidden = true; if (t) t.setAttribute('aria-expanded', 'false'); }
  }
  function closeInstallPanel() {
    var p = document.getElementById('installPanel');
    var t = document.querySelector('[data-install-toggle]');
    if (p && !p.hidden) { p.hidden = true; if (t) t.setAttribute('aria-expanded', 'false'); }
  }
  function closeTextPanel() {
    var p = document.getElementById('textsizePanel');
    var t = document.querySelector('[data-textsize-toggle]');
    if (p && !p.hidden) { p.hidden = true; if (t) t.setAttribute('aria-expanded', 'false'); }
  }

  var onFrame = function (fn) {
    var queued = false;
    return function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; fn(); });
    };
  };

  /* ══════════════════ 1. AMBIENT CANVAS — blood & light ══════════════════ */

  function initCanvas() {
    var canvas = document.getElementById('bloodCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var W = 0, H = 0, dpr = 1;
    var drops = [], rays = [];
    var running = false, raf = 0, last = 0;
    var FRAME_MS = 1000 / 30;          // 30 fps ceiling keeps the CPU cost low

    function rand(a, b) { return a + Math.random() * (b - a); }

    function makeDrop(seeded) {
      return {
        x: rand(0, W),
        y: seeded ? rand(0, H) : rand(-140, -20),
        len: rand(9, 26),
        speed: rand(0.45, 1.45),        /* a touch swifter than before */
        drift: rand(-0.09, 0.09),
        r: rand(1.2, 3.1),
        alpha: rand(0.24, 0.7)
      };
    }

    function makeRays() {
      rays = [];
      var count = W < 700 ? 2 : W < 1400 ? 3 : 4;
      for (var i = 0; i < count; i++) {
        var x = W * ((i + 0.5) / count) + rand(-W * 0.08, W * 0.08);
        /* Gradient runs top-to-bottom only, so it stays valid while the beam
           breathes horizontally — no per-frame gradient allocation. */
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, 'rgba(212, 175, 55, 0.26)');
        g.addColorStop(0.45, 'rgba(212, 175, 55, 0.085)');
        g.addColorStop(1, 'rgba(212, 175, 55, 0)');
        rays.push({
          x: x,
          w: rand(W * 0.05, W * 0.13),
          skew: rand(-0.28, 0.28),
          grad: g,
          phase: rand(0, Math.PI * 2),
          speed: rand(0.00016, 0.00042),
          /* independent slow cycles so no two beams move alike */
          widthPhase: rand(0, Math.PI * 2),
          widthSpeed: rand(0.00011, 0.00029),
          originPhase: rand(0, Math.PI * 2),
          originSpeed: rand(0.00007, 0.00019),
          originSpread: rand(W * 0.02, W * 0.06)
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var target = Math.min(71, Math.max(19, Math.round(W / 25)));   /* ≈ +18% density */
      drops.length = 0;
      for (var i = 0; i < target; i++) drops.push(makeDrop(true));
      makeRays();
      if (REDUCED) paint(performance.now());
    }

    function paint(t) {
      ctx.clearRect(0, 0, W, H);

      /* Light rays — additive, still only the cached gradients. Each beam
         flares in brightness, swells in width as it flares, and drifts its
         origin across the sky on its own slower cycle. */
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var r = 0; r < rays.length; r++) {
        var ray = rays[r];
        var pulse = 0.55 + 0.45 * Math.sin(ray.phase + t * ray.speed);
        var swell = 0.68 + 0.62 * (0.5 + 0.5 * Math.sin(ray.widthPhase + t * ray.widthSpeed));
        var w = ray.w * swell;
        var ox = ray.x + Math.sin(ray.originPhase + t * ray.originSpeed) * ray.originSpread;
        var top = -H * (0.04 + 0.03 * Math.sin(ray.originPhase * 1.7 + t * ray.originSpeed));

        ctx.globalAlpha = REDUCED ? 0.7 : pulse;
        ctx.fillStyle = ray.grad;
        ctx.beginPath();
        ctx.moveTo(ox - w / 2, top);
        ctx.lineTo(ox + w / 2, top);
        ctx.lineTo(ox + w * 1.6 + ray.skew * H, H);
        ctx.lineTo(ox - w * 1.6 + ray.skew * H, H);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      /* Falling drops of the Precious Blood. */
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx.strokeStyle = 'rgba(120, 0, 0, ' + (d.alpha * 0.42).toFixed(3) + ')';
        ctx.lineWidth = d.r * 0.75;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.drift * d.len, d.y - d.len);
        ctx.stroke();

        ctx.fillStyle = 'rgba(150, 6, 10, ' + d.alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step(t) {
      raf = requestAnimationFrame(step);
      if (t - last < FRAME_MS) return;
      last = t;

      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        d.y += d.speed;
        d.x += d.drift;
        if (d.y > H + 40 || d.x < -60 || d.x > W + 60) drops[i] = makeDrop(false);
      }
      paint(t);
    }

    function start() {
      if (running || REDUCED) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    window.addEventListener('resize', onFrame(resize), { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    window.addEventListener('beforeprint', stop);
    window.addEventListener('afterprint', start);
    start();
  }

  /* ═══════════════════ 2. HEADER · SCROLLSPY · PROGRESS ═══════════════════ */

  function initHeader() {
    var header = document.getElementById('siteHeader');
    var bar = document.querySelector('[data-read-progress]');
    var toTop = document.querySelector('[data-to-top]');

    var update = onFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-scrolled', y > 24);
      if (toTop) toTop.classList.toggle('is-visible', y > window.innerHeight * 0.8);
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
      }
    });

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
      });
    }

    /* Scrollspy */
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav-link]'));
    var targets = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if (targets.length && 'IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = '#' + en.target.id;
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      targets.forEach(function (t) { spy.observe(t); });
    }
  }

  /* ═══════════════════════════ 3. MOBILE DRAWER ═══════════════════════════ */

  function initDrawer() {
    var drawer = document.getElementById('mobileDrawer');
    var toggle = document.querySelector('[data-menu-toggle]');
    if (!drawer || !toggle) return;

    var lastFocus = null;

    function open() {
      closeLangMenu();
      closeVoicePanel();
      closeTextPanel();
      lastFocus = document.activeElement;
      drawer.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    }
    function close() {
      drawer.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    toggle.addEventListener('click', function () {
      drawer.hidden ? open() : close();
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-menu-close]') || e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) close();
    });
    /* Past the width where the header rail returns (main.css, 1340px) the
       drawer has nothing left to offer. */
    window.addEventListener('resize', onFrame(function () {
      if (window.innerWidth >= 1340 && !drawer.hidden) close();
    }), { passive: true });
  }

  /* ═════════════════════════ 4. LANGUAGE SWITCHER ═════════════════════════ */

  function initLangSwitcher() {
    var wrap = document.querySelector('[data-lang-switch]');
    if (!wrap) return;
    var toggle = wrap.querySelector('[data-lang-toggle]');
    var menu = wrap.querySelector('.lang-menu');
    var options = Array.prototype.slice.call(menu.querySelectorAll('.lang-option'));

    function open() {
      closeVoicePanel();
      closeTextPanel();
      /* Carry the reader's place in the page across to the other language. */
      var hash = location.hash || '';
      options.forEach(function (a) {
        a.setAttribute('href', '../' + a.getAttribute('data-lang') + '/' + hash);
      });
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
    function close() {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.hidden ? open() : close();
    });

    options.forEach(function (a, i) {
      a.addEventListener('click', function () {
        store.set('pb.lang', a.getAttribute('data-lang'));
      });
      a.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          var next = (i + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
          options[next].focus();
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!menu.hidden && !wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { close(); toggle.focus(); }
    });

    /* Remember the language actually being read. */
    store.set('pb.lang', LANG);
  }

  /* ═══════════════════════════ 4b. TEXT SIZE ═══════════════════════════ */

  /* Multipliers on the reading type (the CSS --zoom). 1 is already large
     print; the steps above it are for readers who need more still. */
  var ZOOM_STEPS = [0.85, 1, 1.15, 1.3, 1.5, 1.75];

  function initTextSize() {
    var wrap = document.querySelector('[data-textsize]');
    if (!wrap) return;
    var toggle = wrap.querySelector('[data-textsize-toggle]');
    var panel = wrap.querySelector('.textsize-panel');
    var valueEl = wrap.querySelector('[data-textsize-value]');
    var minus = wrap.querySelector('[data-textsize-step="-1"]');
    var plus = wrap.querySelector('[data-textsize-step="1"]');

    /* The stored choice, or else whatever the boot script started from (in
       the app, the phone's own font size). */
    var saved = parseFloat(store.get('pb.textZoom', '')) ||
                parseFloat(root.style.getPropertyValue('--zoom')) || 1;
    var idx = 1;
    ZOOM_STEPS.forEach(function (z, i) {
      if (Math.abs(z - saved) < Math.abs(ZOOM_STEPS[idx] - saved)) idx = i;
    });

    function reflect() {
      valueEl.textContent = Math.round(ZOOM_STEPS[idx] * 100) + '%';
      minus.disabled = idx === 0;
      plus.disabled = idx === ZOOM_STEPS.length - 1;
    }

    /* The line the reader was on stays where it was on the screen: without
       this, every step would reflow the page and carry them somewhere else. */
    function anchor() {
      var headerH = (document.querySelector('.site-header') || {}).offsetHeight || 64;
      var nodes = document.querySelectorAll('.prayer-text > *, .litany-item, .section-header');
      for (var i = 0; i < nodes.length; i++) {
        var r = nodes[i].getBoundingClientRect();
        if (r.bottom > headerH + 4) return { el: nodes[i], top: r.top };
      }
      return null;
    }

    function apply(next) {
      if (next < 0 || next >= ZOOM_STEPS.length || next === idx) return;
      var keep = (window.scrollY || window.pageYOffset) > 40 ? anchor() : null;
      idx = next;
      root.style.setProperty('--zoom', String(ZOOM_STEPS[idx]));
      store.set('pb.textZoom', String(ZOOM_STEPS[idx]));
      reflect();
      if (keep) {
        /* Instant, not the page's smooth scrolling: an animated correction
           would still be under way when the next tap measures again. */
        var drift = keep.el.getBoundingClientRect().top - keep.top;
        if (drift) {
          var y = (window.scrollY || window.pageYOffset) + drift;
          try { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); }
          catch (e) { window.scrollTo(0, y); }
        }
      }
    }

    function openPanel() {
      closeLangMenu(); closeVoicePanel(); closeInstallPanel();
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.hidden ? openPanel() : closePanel();
    });
    minus.addEventListener('click', function () { apply(idx - 1); });
    plus.addEventListener('click', function () { apply(idx + 1); });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !wrap.contains(e.target)) closePanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { closePanel(); toggle.focus(); }
    });

    reflect();
  }

  /* ═════════════════════ 5. 33-DAY PRAYER TRACKER ═════════════════════ */

  var DAY_MS = 86400000;
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }
  function daysBetween(a, b) {
    return Math.round((Date.parse(b + 'T00:00:00') - Date.parse(a + 'T00:00:00')) / DAY_MS);
  }

  function initTrackers() {
    /* The 12-year tracker and the personal-name field were removed; clear the
       keys they left behind instead of orphaning them in the visitor's browser. */
    store.del('pb.track.12y');
    store.del('pb.name');

    Array.prototype.forEach.call(document.querySelectorAll('[data-tracker]'), function (el) {
      var kind = el.getAttribute('data-tracker');
      var total = parseInt(el.getAttribute('data-total'), 10) || 33;
      var key = 'pb.track.' + kind;

      var bar = el.querySelector('.tracker-bar');
      var fill = el.querySelector('[data-fill]');
      var status = el.querySelector('[data-status]');
      var dots = el.querySelector('[data-dots]');
      var markBtn = el.querySelector('[data-mark]');
      var resetBtn = el.querySelector('[data-reset]');

      var state = read();

      function read() {
        try {
          var raw = store.get(key, '');
          var o = raw ? JSON.parse(raw) : null;
          if (o && typeof o.count === 'number') return o;
        } catch (e) {}
        return { start: '', last: '', count: 0 };
      }
      function save() { store.set(key, JSON.stringify(state)); }

      if (dots && !dots.childElementCount) {
        for (var i = 0; i < total; i++) dots.appendChild(document.createElement('i'));
      }

      function render() {
        var count = Math.min(state.count, total);
        var pct = total ? (count / total) * 100 : 0;
        if (fill) fill.style.width = pct.toFixed(2) + '%';
        if (bar) bar.setAttribute('aria-valuenow', String(count));

        if (dots) {
          Array.prototype.forEach.call(dots.children, function (d, idx) {
            d.classList.toggle('is-done', idx < count);
          });
        }

        var done = count >= total;
        var markedToday = state.last === todayISO();
        var text;

        if (done) text = UI.statusDone33;
        else if (!count) text = UI.statusIdle;
        else text = fmt(UI.statusDay33, { n: count, total: total, pct: Math.round(pct) });
        if (markedToday && !done) text += ' · ' + UI.statusMarked;
        if (status) status.textContent = text;

        if (markBtn) markBtn.disabled = done || markedToday;
        if (resetBtn) resetBtn.disabled = !count;
      }

      if (markBtn) {
        markBtn.addEventListener('click', function () {
          var t = todayISO();
          if (state.last === t || state.count >= total) return;
          if (!state.start) state.start = t;
          state.count += 1;
          state.last = t;
          save();
          render();
        });
      }
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          if (!state.count) return;
          if (!window.confirm(UI.confirmReset)) return;
          state = { start: '', last: '', count: 0 };
          store.del(key);
          render();
        });
      }

      render();
    });
  }

  /* ═════════════════════ 6. AMBIENT GREGORIAN CHANT ═════════════════════ */
  /* Uses assets/audio/chant.mp3 when present; otherwise synthesises a soft
     organum drone with the Web Audio API so the toggle always works.        */

  function SynthDrone() {
    var ctx = null, master = null, voices = [], level = 1, running = false;

    function build() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();

      master = ctx.createGain();
      master.gain.value = 0;

      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      filter.Q.value = 0.6;

      var verb = ctx.createConvolver();
      var len = Math.floor(ctx.sampleRate * 2.6);
      var buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (var ch = 0; ch < 2; ch++) {
        var data = buf.getChannelData(ch);
        for (var i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
        }
      }
      verb.buffer = buf;

      var wet = ctx.createGain(); wet.gain.value = 0.55;
      var dry = ctx.createGain(); dry.gain.value = 0.55;

      filter.connect(dry).connect(master);
      filter.connect(verb).connect(wet).connect(master);
      master.connect(ctx.destination);

      /* D2 – A2 – D3 – A3: the open fifths of medieval organum. */
      [[73.42, 0.30, 0.045], [110.00, 0.24, 0.061], [146.83, 0.18, 0.037], [220.00, 0.09, 0.053]]
        .forEach(function (spec, idx) {
          var osc = ctx.createOscillator();
          osc.type = idx > 1 ? 'sine' : 'triangle';
          osc.frequency.value = spec[0];
          osc.detune.value = (idx % 2 ? 4 : -4);

          var g = ctx.createGain();
          g.gain.value = spec[1];

          /* Slow "breathing" so the drone never sits still. */
          var lfo = ctx.createOscillator();
          lfo.frequency.value = spec[2];
          var lfoGain = ctx.createGain();
          lfoGain.gain.value = spec[1] * 0.45;
          lfo.connect(lfoGain).connect(g.gain);

          osc.connect(g).connect(filter);
          osc.start();
          lfo.start();
          voices.push(osc, lfo);
        });
      return true;
    }

    function rampTo(value, seconds) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(value, ctx.currentTime + seconds);
    }

    this.start = function () {
      if (!ctx && !build()) return false;
      if (ctx.state === 'suspended') ctx.resume();
      running = true;
      rampTo(SYNTH_GAIN * level, 2.5);
      return true;
    };

    this.stop = function () {
      running = false;
      if (!ctx) return;
      rampTo(0, 1.2);
    };

    /* Ducking: 1 = full, DUCK_LEVEL = under the voice. */
    this.setLevel = function (mult, seconds) {
      level = mult;
      if (!ctx || !running) return;
      rampTo(SYNTH_GAIN * level, seconds || 0.7);
    };
  }

  function initAudio() {
    var btn = document.querySelector('[data-audio-toggle]');
    if (!btn) return;
    var iconHost = btn.querySelector('[data-audio-icon]');
    var iconOn = UI.iconSound || '';
    var iconOff = UI.iconMute || '';

    /* Set by the build only when assets/audio/chant.mp3 actually exists. */
    var chantSrc = btn.getAttribute('data-chant-src');
    var element = null, synth = null, playing = false, resolved = false;

    function setUI(on) {
      playing = on;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var label = on ? UI.audioOff : UI.audioOn;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      if (iconHost && iconOn && iconOff) iconHost.innerHTML = on ? iconOn : iconOff;
    }

    function fadeTo(target, ms) {
      if (!element) return;
      var from = element.volume, t0 = performance.now();
      (function tick(t) {
        var k = Math.min(1, (t - t0) / ms);
        element.volume = Math.max(0, Math.min(1, from + (target - from) * k));
        if (k < 1) requestAnimationFrame(tick);
        else if (target === 0) element.pause();
      })(t0);
    }

    function loadFile() {
      return new Promise(function (resolve, reject) {
        var a = new Audio(chantSrc);
        a.loop = true;
        a.preload = 'auto';
        a.volume = 0;
        var timer = setTimeout(reject, 2500);
        a.addEventListener('canplaythrough', function () { clearTimeout(timer); resolve(a); }, { once: true });
        a.addEventListener('error', function () { clearTimeout(timer); reject(); }, { once: true });
        a.load();
      });
    }

    function playSynth() {
      if (!synth) synth = new SynthDrone();
      synth.setLevel(voiceActive ? DUCK_LEVEL : 1, 0.01);   /* start already ducked if the voice is speaking */
      if (synth.start()) setUI(true);
    }

    /* Level control used by the voice-prayer reader. */
    Ambient.duck = function () {
      if (!playing) return;
      if (element) fadeTo(BASE_VOL * DUCK_LEVEL, 700);
      else if (synth) synth.setLevel(DUCK_LEVEL, 0.7);
    };
    Ambient.release = function () {
      if (!playing) return;
      if (element) fadeTo(BASE_VOL, 900);
      else if (synth) synth.setLevel(1, 0.9);
    };

    btn.addEventListener('click', function () {
      if (playing) {
        if (element) fadeTo(0, 900); else if (synth) synth.stop();
        setUI(false);
        return;
      }

      if (resolved) {
        if (element) { element.play().then(function () { fadeTo(BASE_VOL * (voiceActive ? DUCK_LEVEL : 1), 1800); setUI(true); }, playSynth); }
        else playSynth();
        return;
      }

      /* First activation. With no recording supplied, go straight to the
         synthesised drone — no request, no 404. */
      if (!chantSrc) { resolved = true; return playSynth(); }

      setUI(true);
      loadFile().then(function (a) {
        resolved = true;
        element = a;
        return a.play().then(function () { fadeTo(BASE_VOL * (voiceActive ? DUCK_LEVEL : 1), 1800); });
      }).catch(function () {
        resolved = true;
        element = null;
        playSynth();
      });
    });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden || !playing) return;
      if (element) fadeTo(0, 400); else if (synth) synth.stop();
      setUI(false);
    });

    setUI(false);
  }

  /* ══════════════ 7. VOICE PRAYER — Web Speech API reader ══════════════ */

  var SPEECH_MAX = 180;   /* short utterances sidestep the long-text cutoff */

  /* The spec exposes no gender field on SpeechSynthesisVoice, so voices are
     classified by the only signal available — their name. Female patterns are
     tested first: "female" contains "male" in several languages. */
  var GENDER_WORD = {
    female: /(female|woman|weiblich|f[ée]minin|femminile|femenin|feminin|жіноч|женск)/i,
    male: /(\bmale\b|\bman\b|m[äa]nnlich|masculin|maschile|masculino|чолов|мужск)/i
  };
  var GENDER_NAME = {
    female: /\b(zira|hazel|susan|linda|heidi|katja|hedda|elsa|isabella|paulina|polina|helena|laura|sabina|marina|ana|joana|francisca|camila|sara|am[ée]lie|anna|victoria|samantha|karen|moira|tessa|fiona|nicky|allison|ava|zoe|kate|serena|catherine|luciana|monica|carmen|conchita|lucia|alice|federica|maria|nataliya|solomiya|milena)\b/i,
    male: /\b(david|mark|george|guy|christopher|eric|roger|steffan|thomas|ravi|rishi|arthur|oliver|daniel|fred|alex|liam|sam|stefan|conrad|bernd|klaus|cosimo|diego|jorge|pablo|alonso|h[ée]lio|duarte|ricardo|carlos|enrique|juan|ostap|anatol|maxim|yuriy|nicolas|matteo|giuseppe|gordon|james|john|paul|peter)\b/i
  };

  function guessGender(v) {
    var n = (v.name || '') + ' ' + (v.voiceURI || '');
    if (GENDER_WORD.female.test(n) || GENDER_NAME.female.test(n)) return 'female';
    if (GENDER_WORD.male.test(n) || GENDER_NAME.male.test(n)) return 'male';
    return null;
  }

  /* Reads the prayer out of the DOM, keeping line breaks and skipping the
     tracker and other screen-only furniture. */
  function extractText(node) {
    if (node.nodeType === 3) return node.nodeValue;
    if (node.nodeType !== 1) return '';
    if (node.tagName === 'BR') return '\n';
    if (node.classList &&
        (node.classList.contains('tracker') || node.classList.contains('no-print'))) return '';
    var s = '';
    for (var i = 0; i < node.childNodes.length; i++) s += extractText(node.childNodes[i]);
    if (/^(P|LI|H1|H2|H3|DIV|ASIDE|UL|HR)$/.test(node.tagName)) s += '\n';
    return s;
  }

  function chunkText(text, max) {
    var out = [];
    text.split(/\n+/).forEach(function (raw) {
      var line = raw.replace(/\s+/g, ' ').trim();
      if (!line) return;
      if (line.length <= max) { out.push(line); return; }

      var sentences = line.match(/[^.!?…]+[.!?…]*\s*/g) || [line];
      var buf = '';
      sentences.forEach(function (s) {
        if (buf && (buf + s).length > max) { out.push(buf.trim()); buf = ''; }
        if (s.length > max) {
          var w = '';
          s.split(' ').forEach(function (word) {
            if (w && (w + ' ' + word).length > max) { out.push(w.trim()); w = word; }
            else w = w ? w + ' ' + word : word;
          });
          buf = w;
        } else buf += s;
      });
      if (buf.trim()) out.push(buf.trim());
    });
    return out;
  }

  /* Android's web view has no Web Speech synthesis at all. Inside the app,
     window.SanguisTTS (android/…/MainActivity.java) hands the text to the
     device's own TextToSpeech engine instead, and this shim puts the standard
     speechSynthesis face on it, so initVoice below runs unchanged.
     The engine has no pause, so pause() stops and resume() re-reads the
     current sentence from its beginning — at prayer pace, the natural place
     to pick up again anyway. */
  function installNativeSpeech() {
    var bridge = window.SanguisTTS;
    if (!bridge || (window.speechSynthesis && window.SpeechSynthesisUtterance)) return;

    var pending = {}, seq = 0, current = null, paused = false, listeners = [];

    function Utterance(text) {
      this.text = String(text || '');
      this.lang = ''; this.voice = null;
      this.rate = 1; this.pitch = 1; this.volume = 1;
      this.onend = null; this.onerror = null; this.onstart = null;
    }

    function voices() {
      try {
        return JSON.parse(bridge.voices() || '[]').map(function (v) {
          return { name: v.name, voiceURI: v.name, lang: v.lang,
                   localService: !!v.local, 'default': false };
        });
      } catch (e) { return []; }
    }

    function send(u) {
      var id = String(++seq);
      pending[id] = u;
      current = { id: id, u: u };
      bridge.speak(id, u.text, u.lang || '', u.voice ? u.voice.name : '',
                   Number(u.rate) || 1, Number(u.pitch) || 1);
    }

    /* Called back by the app when an utterance finishes or fails. */
    window.__sanguisTTS = function (id, type) {
      var u = pending[id];
      if (!u) return;
      delete pending[id];
      if (current && current.id === id) current = null;
      if (type === 'end' && u.onend) u.onend({ type: 'end' });
      if (type === 'error' && u.onerror) u.onerror({ type: 'error', error: 'synthesis-failed' });
    };

    window.SpeechSynthesisUtterance = Utterance;
    window.speechSynthesis = {
      speak: function (u) { paused = false; send(u); },
      /* Pending utterances are dropped without firing onend, as the spec's
         cancel does — initVoice relies on that to stop the queue. */
      cancel: function () {
        paused = false; current = null;
        pending = {};
        bridge.stop();
      },
      pause: function () {
        if (!current) return;
        paused = true;
        var held = current;
        delete pending[held.id];
        current = held;
        bridge.stop();
      },
      resume: function () {
        if (!paused || !current) return;
        paused = false;
        send(current.u);
      },
      getVoices: voices,
      addEventListener: function (type, fn) { if (type === 'voiceschanged') listeners.push(fn); },
      onvoiceschanged: null
    };

    /* The engine binds asynchronously; the app announces when its voices are
       ready, exactly as a browser fires voiceschanged. */
    window.__sanguisVoices = function () {
      listeners.forEach(function (fn) { try { fn(); } catch (e) {} });
    };
  }

  function initVoice() {
    var root = document.querySelector('[data-voice]');
    if (!root) return;

    var toggle = root.querySelector('[data-voice-toggle]');
    var panel = root.querySelector('.voice-panel');
    var statusEl = root.querySelector('[data-voice-status]');
    var playBtn = root.querySelector('[data-voice-play]');
    var playLabel = root.querySelector('[data-voice-play-label]');
    var pauseBtn = root.querySelector('[data-voice-pause]');
    var stopBtn = root.querySelector('[data-voice-stop]');
    var genderBtns = Array.prototype.slice.call(root.querySelectorAll('.voice-gender'));

    function setStatus(text, warn) {
      statusEl.textContent = text || '';
      statusEl.classList.toggle('is-warning', !!warn);
    }

    /* Panel open/close — shared by both the supported and unsupported paths so
       the reason for an unavailable reader is always visible. */
    function openPanel() { closeLangMenu(); closeInstallPanel(); closeTextPanel(); panel.hidden = false; toggle.setAttribute('aria-expanded', 'true'); }
    function closePanel() { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.hidden ? openPanel() : closePanel();
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !root.contains(e.target)) closePanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { closePanel(); toggle.focus(); }
    });

    var synth = window.speechSynthesis;
    if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') {
      setStatus(UI.voiceUnsupported, true);
      [playBtn, pauseBtn, stopBtn].concat(genderBtns).forEach(function (b) { b.disabled = true; });
      return;
    }

    var lang = UI.speechLang || document.documentElement.lang || 'en-US';
    var gender = store.get('pb.voice.gender', 'female');
    var sections = Array.prototype.slice.call(document.querySelectorAll('.section-card'));

    var voices = [], chosen = null, genderMatched = true;
    var queue = [], idx = 0, state = 'idle';   /* idle | speaking | paused */
    var lastTitle = '';

    genderBtns.forEach(function (b) {
      b.setAttribute('aria-checked', b.getAttribute('data-gender') === gender ? 'true' : 'false');
    });

    function pickVoice() {
      var base = lang.split('-')[0].toLowerCase();
      var norm = function (v) { return (v.lang || '').replace('_', '-').toLowerCase(); };
      var exact = voices.filter(function (v) { return norm(v) === lang.toLowerCase(); });
      var loose = voices.filter(function (v) { return norm(v).indexOf(base) === 0; });
      var pool = (exact.length ? exact : loose).slice();

      if (!pool.length) { chosen = null; genderMatched = false; return; }

      /* Prefer the higher-quality neural/online voices where present — but in
         the app, voices on the device: it is meant to work with no signal. */
      pool.sort(function (a, b) {
        var score = function (v) {
          return (/natural|neural|online|enhanced|premium/i.test(v.name) ? 2 : 0) +
                 (NATIVE ? (v.localService ? 1 : 0) : (v.localService ? 0 : 1));
        };
        return score(b) - score(a);
      });

      /* Android names its voices by code ("uk-ua-x-hfd-local"), which says
         nothing about gender. When no voice at all can be told apart, a
         warning that the other gender is missing would be a guess, so none is
         shown. */
      var byGender = pool.filter(function (v) { return guessGender(v) === gender; });
      var knowable = pool.some(function (v) { return guessGender(v) !== null; });
      genderMatched = byGender.length > 0 || !knowable;
      chosen = byGender[0] || pool[0];
    }

    function reflect() {
      var speaking = state === 'speaking';
      playBtn.disabled = !chosen || speaking;
      pauseBtn.disabled = !speaking;
      stopBtn.disabled = state === 'idle';
      playLabel.textContent = state === 'paused' ? UI.voiceResume : UI.voicePlay;
      toggle.classList.toggle('is-speaking', speaking);
    }

    function announceReadiness() {
      if (!chosen) { setStatus(UI.voiceNoVoice, true); return; }
      if (state !== 'idle') return;
      if (genderMatched) setStatus(UI.voiceIdle);
      else setStatus(fmt(UI.voiceNoGender, {
        gender: gender === 'male' ? UI.voiceMale : UI.voiceFemale
      }), true);
    }

    function refreshVoices() {
      voices = synth.getVoices() || [];
      genderBtns.forEach(function (b) { b.disabled = !voices.length; });
      pickVoice();
      announceReadiness();
      reflect();
    }

    /* Start from whichever prayer the reader is currently looking at. */
    function currentSectionIndex() {
      var active = document.querySelector('[data-nav-link].is-active');
      var href = active && active.getAttribute('href');
      if (href) {
        for (var i = 0; i < sections.length; i++) if ('#' + sections[i].id === href) return i;
      }
      var headerH = (document.querySelector('.site-header') || {}).offsetHeight || 64;
      for (var j = 0; j < sections.length; j++) {
        if (sections[j].getBoundingClientRect().bottom > headerH + 8) return j;
      }
      return 0;
    }

    function buildQueue(start) {
      var items = [];
      for (var i = start; i < sections.length; i++) {
        var sec = sections[i];
        var titleEl = sec.querySelector('.section-title');
        var subEl = sec.querySelector('.section-subtitle');
        var title = titleEl ? titleEl.textContent.trim() : '';
        var sub = subEl ? subEl.textContent.trim() : '';
        if (title) items.push({ id: sec.id, title: title, text: title + (sub ? '. ' + sub : '') });
        var body = sec.querySelector('.prayer-text');
        if (body) {
          chunkText(extractText(body), SPEECH_MAX).forEach(function (t) {
            items.push({ id: sec.id, title: title, text: t });
          });
        }
      }
      return items;
    }

    function duck(on) {
      voiceActive = on;
      if (on) Ambient.duck(); else Ambient.release();
    }

    function speakNext() {
      if (idx >= queue.length) return finish();
      var item = queue[idx];

      if (item.title !== lastTitle) {
        lastTitle = item.title;
        var sec = document.getElementById(item.id);
        if (sec) sec.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
      }
      setStatus(fmt(UI.voiceReading, { section: item.title }));

      var u = new SpeechSynthesisUtterance(item.text);
      if (chosen) u.voice = chosen;
      u.lang = chosen ? chosen.lang : lang;
      u.rate = 0.92;   /* unhurried, for prayer */
      u.pitch = 1;
      u.volume = 1;
      u.onend = function () { if (state !== 'speaking') return; idx++; speakNext(); };
      u.onerror = function (e) {
        if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
        if (state !== 'speaking') return;
        idx++; speakNext();
      };
      synth.speak(u);
    }

    function play() {
      if (!chosen) return;
      if (state === 'paused') {
        state = 'speaking';
        synth.resume();
        duck(true);
        if (lastTitle) setStatus(fmt(UI.voiceReading, { section: lastTitle }));
        reflect();
        return;
      }
      synth.cancel();
      queue = buildQueue(currentSectionIndex());
      idx = 0;
      lastTitle = '';
      if (!queue.length) return;
      state = 'speaking';
      duck(true);
      reflect();
      speakNext();
    }

    function pause() {
      if (state !== 'speaking') return;
      state = 'paused';
      synth.pause();
      duck(false);
      setStatus(UI.voicePaused);
      reflect();
    }

    function stop() {
      state = 'idle';
      synth.cancel();
      idx = 0; queue = []; lastTitle = '';
      duck(false);
      announceReadiness();
      reflect();
    }

    function finish() {
      state = 'idle';
      idx = 0; lastTitle = '';
      duck(false);
      setStatus(UI.voiceDone);
      reflect();
    }

    playBtn.addEventListener('click', play);
    pauseBtn.addEventListener('click', pause);
    stopBtn.addEventListener('click', stop);

    genderBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        gender = btn.getAttribute('data-gender');
        store.set('pb.voice.gender', gender);
        genderBtns.forEach(function (b) {
          b.setAttribute('aria-checked', b === btn ? 'true' : 'false');
        });

        /* Swap voice mid-prayer: drop to idle first so the cancelled utterance
           cannot advance the queue, then resume on the same chunk. */
        var wasSpeaking = state === 'speaking';
        state = 'idle';
        synth.cancel();
        pickVoice();
        announceReadiness();
        if (wasSpeaking && chosen) { state = 'speaking'; duck(true); speakNext(); }
        reflect();
      });
    });

    refreshVoices();
    if ('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', refreshVoices);
    /* Some engines populate the list late and never fire the event. */
    setTimeout(function () { if (!voices.length) refreshVoices(); }, 1200);

    /* Never let a recitation outlive the page — language links navigate away. */
    var silence = function () { try { synth.cancel(); } catch (e) {} };
    window.addEventListener('beforeunload', silence);
    window.addEventListener('pagehide', silence);
  }

  /* ═══════════════════════════ 8. PRINT BUTTON ═══════════════════════════ */

  function initPrint() {
    var btn = document.querySelector('[data-print]');
    if (btn) btn.addEventListener('click', function () { window.print(); });
  }

  /* ═════════════════════════ 9. REVEAL ON SCROLL ═════════════════════════ */

  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    if (REDUCED || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });

    /* Safety net: a prayer must never stay invisible because an observer
       failed to fire (background tab, throttled rendering, odd browser). */
    setTimeout(function () {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      io.disconnect();
    }, 5000);
  }

  /* ═════════════ 10. OFFLINE APP — install, cache, updates ═════════════ */

  /* One live region carries all three announcements the app makes about
     itself. Messages with an action stay until dismissed; the rest fade. */
  function initToast() {
    var el = document.querySelector('[data-toast]');
    if (!el) return { show: function () {}, hide: function () {} };

    var textEl = el.querySelector('[data-toast-text]');
    var iconEl = el.querySelector('[data-toast-icon]');
    var actionEl = el.querySelector('[data-toast-action]');
    var closeEl = el.querySelector('[data-toast-close]');
    var timer = 0, onAction = null;

    function hide() {
      clearTimeout(timer);
      el.classList.remove('is-open');
      /* Wait out the transition before removing it from the a11y tree. */
      timer = setTimeout(function () { el.hidden = true; }, 260);
    }

    function show(text, opts) {
      if (!text) return;
      var o = opts || {};
      clearTimeout(timer);

      textEl.textContent = text;
      iconEl.innerHTML = o.icon || '';
      iconEl.hidden = !o.icon;

      onAction = o.onAction || null;
      actionEl.hidden = !onAction;
      if (onAction) actionEl.textContent = o.actionLabel || '';

      el.hidden = false;
      /* Force a reflow so the transition runs on a freshly unhidden node. */
      void el.offsetWidth;
      el.classList.add('is-open');

      if (!onAction && !o.sticky) timer = setTimeout(hide, 5200);
    }

    actionEl.addEventListener('click', function () {
      var fn = onAction;
      hide();
      if (fn) fn();
    });
    closeEl.addEventListener('click', hide);

    return { show: show, hide: hide };
  }

  /* True when the page is running as an installed app rather than a tab. */
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.matchMedia('(display-mode: minimal-ui)').matches ||
           navigator.standalone === true;
  }

  /* iOS has never implemented beforeinstallprompt: the only way onto the home
     screen is the Share sheet, so the button has to teach that instead. */
  function isIOS() {
    var ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function initInstall(toast) {
    var wrap = document.querySelector('[data-install-wrap]');
    if (!wrap) return;

    var toggle = wrap.querySelector('[data-install-toggle]');
    var panel = wrap.querySelector('.install-panel');
    var iosHint = wrap.querySelector('[data-install-ios]');
    var goBtn = wrap.querySelector('[data-install-go]');
    var deferred = null;

    function openPanel() {
      closeLangMenu(); closeVoicePanel(); closeTextPanel();
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.hidden ? openPanel() : closePanel();
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !wrap.contains(e.target)) closePanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { closePanel(); toggle.focus(); }
    });

    /* Already installed — nothing to offer. */
    if (NATIVE || isStandalone()) return;

    if (isIOS()) {
      iosHint.hidden = false;
      wrap.hidden = false;
      return;
    }

    /* Chromium fires this only when the install criteria are met (manifest,
       icons, service worker, HTTPS), so the button appears exactly when it
       can actually do something. */
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      goBtn.hidden = false;
      wrap.hidden = false;
    });

    goBtn.addEventListener('click', function () {
      if (!deferred) return;
      closePanel();
      deferred.prompt();
      deferred.userChoice.then(function () {
        /* The event is single-use; a declined prompt will be offered again by
           the browser on a later visit. */
        deferred = null;
        goBtn.hidden = true;
        wrap.hidden = true;
      });
    });

    window.addEventListener('appinstalled', function () {
      deferred = null;
      wrap.hidden = true;
      toast.show(UI.installedNote, { icon: UI.iconCheck });
    });
  }

  function initServiceWorker(toast) {
    if (NATIVE || !('serviceWorker' in navigator)) return;
    /* file:// and any non-secure origin cannot register one. */
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' &&
        location.hostname !== '127.0.0.1') return;

    /* Resolved against the page (/uk/ → /sw.js) so the app also works when
       the site is served from a sub-path. */
    var swUrl = new URL('../sw.js', location.href).pathname;

    /* No controller yet means this visit is installing the app for the first
       time — worth telling the reader the prayers are now theirs to keep. */
    var firstInstall = !navigator.serviceWorker.controller;
    var updating = false;

    navigator.serviceWorker.register(swUrl).then(function (reg) {

      function watch(worker) {
        if (!worker) return;
        worker.addEventListener('statechange', function () {
          if (worker.state !== 'installed') return;
          if (navigator.serviceWorker.controller && !firstInstall) {
            /* A newer prayer book is cached and waiting. Never swap it in
               mid-devotion — let the reader choose the moment. */
            toast.show(UI.updateReady, {
              actionLabel: UI.updateAction,
              onAction: function () {
                updating = true;
                worker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          } else if (firstInstall) {
            toast.show(UI.offlineReady, { icon: UI.iconCheck });
          }
        });
      }

      watch(reg.installing);
      if (reg.waiting && navigator.serviceWorker.controller) {
        toast.show(UI.updateReady, {
          actionLabel: UI.updateAction,
          onAction: function () {
            updating = true;
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      }
      reg.addEventListener('updatefound', function () { watch(reg.installing); });

      /* Check for a new devotion when the reader comes back to the tab. The
         catch is not decoration: offline, update() rejects, and an unhandled
         rejection is exactly the console error an offline reader should never
         be the one to produce. */
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) return;
        try {
          var p = reg.update();
          if (p && p.catch) p.catch(function () {});
        } catch (e) { /* worker gone */ }
      });
    }).catch(function () {
      /* Registration can fail behind a strict CSP or in private mode. The
         site is ordinary static HTML, so everything still works online. */
    });

    /* clients.claim() also fires this on the very first install, which must
       not reload the page under the reader — only an accepted update does. */
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!updating) return;
      updating = false;
      location.reload();
    });
  }

  /* A quiet line in the footer saying, truthfully, how much of the devotion is
     already on the device. Nothing is shown until the worker has answered —
     an unregistered worker must not leave a promise of offline access
     standing on the page. */
  function initOfflineStatus() {
    var el = document.querySelector('[data-offline-status]');
    if (!el) return;

    /* Inside the app this is simply true: every page ships in the APK. */
    if (NATIVE) {
      el.textContent = UI.offlineComplete;
      el.classList.add('is-complete');
      el.hidden = false;
      return;
    }
    if (!('serviceWorker' in navigator)) return;

    function render(info) {
      if (!info || !info.total) return;
      var complete = info.cached >= info.total;
      el.textContent = complete
        ? UI.offlineComplete
        : fmt(UI.offlineStored, { done: info.cached, total: info.total });
      el.classList.toggle('is-complete', complete);
      el.hidden = false;
    }

    function ask() {
      var worker = navigator.serviceWorker.controller;
      if (!worker) return;
      try {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (e) {
          if (e.data && e.data.type === 'CACHE_STATUS') render(e.data);
        };
        worker.postMessage({ type: 'CACHE_STATUS' }, [channel.port2]);
      } catch (e) { /* no MessageChannel — the broadcast path below still works */ }
    }

    navigator.serviceWorker.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'CACHE_STATUS') render(e.data);
    });
    navigator.serviceWorker.addEventListener('controllerchange', ask);

    navigator.serviceWorker.ready.then(function () {
      ask();
      /* The optional half — fonts, artwork, icons — finishes after activate,
         so the first answer is usually a partial count. */
      setTimeout(ask, 4000);
    }).catch(function () {});
  }

  function initNetworkState(toast) {
    /* The app never needs the network, so losing it is not news. */
    if (NATIVE) return;
    window.addEventListener('offline', function () {
      document.body.classList.add('is-offline');
      toast.show(UI.offlineNow, { icon: UI.iconOffline, sticky: true });
    });
    window.addEventListener('online', function () {
      document.body.classList.remove('is-offline');
      toast.show(UI.backOnline, { icon: UI.iconCheck });
    });
    if (!navigator.onLine) document.body.classList.add('is-offline');
  }

  function initApp() {
    var toast = initToast();
    initInstall(toast);
    initServiceWorker(toast);
    initOfflineStatus();
    initNetworkState(toast);
  }

  /* ═════════════════════════════ BOOTSTRAP ═════════════════════════════ */

  function boot() {
    initCanvas();
    initHeader();
    initDrawer();
    initLangSwitcher();
    initTextSize();
    initTrackers();
    initAudio();
    if (NATIVE) installNativeSpeech();
    initVoice();
    initPrint();
    initReveal();
    initApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
