'use strict';

/* ============================================================================
   SANGUIS CHRISTI — Android app build
   ----------------------------------------------------------------------------
     node android/build.js          (or: npm run apk)

   Produces android/dist/SanguisChristi.apk: a signed, installable app that
   carries the whole devotion — all six languages, the fonts, the artwork —
   and runs with no network at all, from the very first launch.

   No Gradle and no downloads. It drives the Android SDK's own command-line
   tools directly, which is all a single-activity app needs:

     aapt2 compile/link   resources + manifest + the site as assets → APK
     javac                MainActivity → .class
     d8                   .class → classes.dex
     aapt add             dex into the APK
     zipalign, apksigner  align and sign

   Needs an Android SDK (build-tools + one platform) and a JDK 17+. Android
   Studio ships both: the SDK in %LOCALAPPDATA%\Android\Sdk (Windows) or
   ~/Library/Android/sdk (macOS), the JDK in its "jbr" folder. ANDROID_HOME
   and JAVA_HOME override the search.

   The first run creates the signing key in android/keystore/. Keep that
   folder safe and out of git (it is ignored): Android only installs an
   update over an existing app when it is signed with the same key.
   ========================================================================== */

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ANDROID = __dirname;
const ROOT = path.resolve(ANDROID, '..');
const BUILD = path.join(ANDROID, 'build');
const DIST = path.join(ANDROID, 'dist');
const KEYS = path.join(ANDROID, 'keystore');
const APK_NAME = 'SanguisChristi.apk';

const PACKAGE = 'org.sanguischristi.prayers';
const MIN_SDK = 24;          // Android 7.0 — every phone still in use
const TARGET_SDK = 35;       // Android 15
const WIN = process.platform === 'win32';
/* --debug: the page inside the app can be inspected from chrome://inspect. */
const DEBUG = process.argv.indexOf('--debug') > -1;
const exe = (name) => (WIN ? name + '.exe' : name);

const { LANGS } = require(path.join(ROOT, 'src', 'site.config'));
const { renderIcon } = require(path.join(ROOT, 'src', 'icons'));
const pkg = require(path.join(ROOT, 'package.json'));

function run(cmd, args, opts) {
  try {
    return execFileSync(cmd, args, Object.assign({ stdio: ['ignore', 'pipe', 'pipe'] }, opts))
      .toString();
  } catch (e) {
    const out = [e.stdout, e.stderr].filter(Boolean).map(String).join('\n').trim();
    throw new Error(`${path.basename(cmd)} failed:\n${out || e.message}`);
  }
}

const step = (msg) => console.log('  ' + msg);

/* ─────────────────────────── toolchain ─────────────────────────── */

function findSdk() {
  const home = os.homedir();
  const candidates = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk'),
    path.join(home, 'Library', 'Android', 'sdk'),
    path.join(home, 'Android', 'Sdk')
  ].filter(Boolean);
  const sdk = candidates.find((d) => fs.existsSync(path.join(d, 'build-tools')));
  if (!sdk) throw new Error('No Android SDK found. Install Android Studio, or set ANDROID_HOME.');
  return sdk;
}

/* Highest version first; "35.0.1" sorts above "35.0.0" and "34.0.0". */
const byVersion = (a, b) => b.localeCompare(a, undefined, { numeric: true });

function findBuildTools(sdk) {
  const dir = path.join(sdk, 'build-tools');
  const v = fs.readdirSync(dir).sort(byVersion)
    .find((d) => fs.existsSync(path.join(dir, d, exe('aapt2'))) &&
                 fs.existsSync(path.join(dir, d, 'lib', 'd8.jar')));
  if (!v) throw new Error('No usable build-tools in ' + dir);
  return path.join(dir, v);
}

function findPlatform(sdk) {
  const dir = path.join(sdk, 'platforms');
  const v = fs.readdirSync(dir).sort(byVersion)
    .find((d) => fs.existsSync(path.join(dir, d, 'android.jar')));
  if (!v) throw new Error('No Android platform in ' + dir + ' — install one with the SDK Manager.');
  return path.join(dir, v, 'android.jar');
}

function findJdk() {
  const candidates = [
    process.env.JAVA_HOME,
    WIN && 'C:\\Program Files\\Android\\Android Studio\\jbr',
    '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
    '/opt/android-studio/jbr',
    path.join(os.homedir(), 'android-studio', 'jbr')
  ].filter(Boolean);
  const jdk = candidates.find((d) => fs.existsSync(path.join(d, 'bin', exe('javac'))));
  if (!jdk) throw new Error('No JDK found. Android Studio includes one; or set JAVA_HOME.');
  return jdk;
}

/* ─────────────────────────── helpers ─────────────────────────── */

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest, filter) {
  if (!fs.existsSync(src)) return 0;
  let n = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) n += copyDir(s, d, filter);
    else if (!filter || filter(entry.name)) { copy(s, d); n++; }
  }
  return n;
}

function walk(dir, ext) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, ext));
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}

/* ─────────────────────────── the build ─────────────────────────── */

(function main() {
  console.log('\nSanguis Christi — Android app\n────────────────────────────────────────────');

  const sdk = findSdk();
  const tools = findBuildTools(sdk);
  const androidJar = findPlatform(sdk);
  const jdk = findJdk();
  const java = path.join(jdk, 'bin', exe('java'));
  const javac = path.join(jdk, 'bin', exe('javac'));
  const keytool = path.join(jdk, 'bin', exe('keytool'));
  step(`SDK       ${sdk}`);
  step(`tools     ${path.basename(tools)} · ${path.basename(path.dirname(androidJar))}`);
  step(`JDK       ${jdk}`);

  /* 1. The site itself, freshly built, so the app never ships stale text. */
  if (process.argv.indexOf('--no-site') === -1) {
    run(process.execPath, [path.join(ROOT, 'src', 'build.js')], { cwd: ROOT });
    step('site      rebuilt (npm run build)');
  }

  rmrf(BUILD);
  fs.mkdirSync(BUILD, { recursive: true });
  fs.mkdirSync(DIST, { recursive: true });

  /* 2. The pages, exactly as the website serves them. The service worker and
        the redirect files are left out: inside the app everything is local. */
  const www = path.join(BUILD, 'assets', 'www');
  let files = 0;
  copy(path.join(ROOT, 'index.html'), path.join(www, 'index.html')); files++;
  copy(path.join(ROOT, 'site.webmanifest'), path.join(www, 'site.webmanifest')); files++;
  for (const l of LANGS) {
    copy(path.join(ROOT, l.code, 'index.html'), path.join(www, l.code, 'index.html'));
    copy(path.join(ROOT, l.code, 'app.webmanifest'), path.join(www, l.code, 'app.webmanifest'));
    files += 2;
  }
  files += copyDir(path.join(ROOT, 'assets'), path.join(www, 'assets'),
    (name) => !/^\./.test(name));
  step(`pages     ${files} files → assets/www`);

  /* 3. Resources, plus launcher icons drawn from the site's own icon code. */
  const res = path.join(BUILD, 'res');
  copyDir(path.join(ANDROID, 'res'), res);
  const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  for (const [name, k] of Object.entries(DENSITIES)) {
    const dir = path.join(res, 'mipmap-' + name);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'ic_launcher.png'), renderIcon(Math.round(48 * k), {}));
    fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), renderIcon(Math.round(48 * k), { round: true }));
    fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), renderIcon(Math.round(108 * k), { maskable: true }));
  }
  step('icons     5 densities · legacy, round and adaptive');

  const aapt2 = path.join(tools, exe('aapt2'));
  const compiled = path.join(BUILD, 'compiled.zip');
  run(aapt2, ['compile', '--dir', res, '-o', compiled]);

  /* A version code that only ever goes up, so every new APK installs over
     the last one: minutes since 2024-01-01. */
  const versionCode = Math.floor((Date.now() - Date.UTC(2024, 0, 1)) / 60000);
  const versionName = pkg.version;
  const unsigned = path.join(BUILD, 'app.unsigned.apk');
  const gen = path.join(BUILD, 'gen');
  run(aapt2, ['link',
    '-o', unsigned,
    '-I', androidJar,
    '--manifest', path.join(ANDROID, 'AndroidManifest.xml'),
    '--min-sdk-version', String(MIN_SDK),
    '--target-sdk-version', String(TARGET_SDK),
    '--version-code', String(versionCode),
    '--version-name', versionName,
    '--java', gen,
    compiled]);
  step(`link      v${versionName} (${versionCode}) · min SDK ${MIN_SDK} · target ${TARGET_SDK}`);

  /* 4. Code. BuildConfig is written here because there is no Gradle to do it. */
  const pkgDir = path.join(gen, ...PACKAGE.split('.'));
  fs.mkdirSync(pkgDir, { recursive: true });
  fs.writeFileSync(path.join(pkgDir, 'BuildConfig.java'),
    `package ${PACKAGE};\n\n/** Generated by android/build.js. */\n` +
    `public final class BuildConfig {\n` +
    `  public static final String VERSION_NAME = ${JSON.stringify(versionName)};\n` +
    `  public static final int VERSION_CODE = ${versionCode};\n` +
    `  public static final boolean DEBUG = ${DEBUG};\n` +
    `  private BuildConfig() {}\n}\n`);

  const classes = path.join(BUILD, 'classes');
  const sources = walk(path.join(ANDROID, 'src'), '.java').concat(walk(gen, '.java'));
  run(javac, ['--release', '11', '-encoding', 'UTF-8', '-nowarn', '-Xlint:-options',
    '-classpath', androidJar, '-d', classes].concat(sources));

  const dex = path.join(BUILD, 'dex');
  fs.mkdirSync(dex, { recursive: true });
  run(java, ['-cp', path.join(tools, 'lib', 'd8.jar'), 'com.android.tools.r8.D8',
    '--release', '--min-api', String(MIN_SDK), '--lib', androidJar, '--output', dex]
    .concat(walk(classes, '.class')));
  step(`code      ${sources.length} sources → classes.dex`);

  /* The dex and the pages go in with `aapt add`, named relative to BUILD with
     forward slashes. (aapt2 link -A would add the pages too, but on Windows it
     stores them as "assets/www\uk\index.html", which Android cannot open.) */
  copy(path.join(dex, 'classes.dex'), path.join(BUILD, 'classes.dex'));
  const entries = walk(path.join(BUILD, 'assets'), '')
    .map((f) => path.relative(BUILD, f).split(path.sep).join('/'));
  run(path.join(tools, exe('aapt')), ['add', unsigned, 'classes.dex'].concat(entries), { cwd: BUILD });

  /* 5. Align, then sign with the release key — created on the first run. */
  const aligned = path.join(BUILD, 'app.aligned.apk');
  run(path.join(tools, exe('zipalign')), ['-f', '4', unsigned, aligned]);

  const ks = path.join(KEYS, 'release.jks');
  const props = path.join(KEYS, 'keystore.properties');
  if (!fs.existsSync(ks)) {
    fs.mkdirSync(KEYS, { recursive: true });
    const pass = crypto.randomBytes(18).toString('base64').replace(/[^A-Za-z0-9]/g, '');
    run(keytool, ['-genkeypair', '-keystore', ks, '-alias', 'sanguis',
      '-keyalg', 'RSA', '-keysize', '3072', '-validity', '12000',
      '-storepass', pass, '-keypass', pass,
      '-dname', 'CN=Sanguis Christi, O=Sanguis Christi']);
    fs.writeFileSync(props,
      '# Signing key for the Android app. Back up this folder: without it no\n' +
      '# future version can be installed over the current one.\n' +
      `storeFile=release.jks\nkeyAlias=sanguis\nstorePassword=${pass}\n`);
    step('key       created android/keystore/release.jks — back it up');
  }
  const pass = (fs.readFileSync(props, 'utf8').match(/^storePassword=(.*)$/m) || [])[1];
  if (!pass) throw new Error('android/keystore/keystore.properties has no storePassword');

  const apk = path.join(DIST, DEBUG ? APK_NAME.replace('.apk', '-debug.apk') : APK_NAME);
  const apksigner = path.join(tools, 'lib', 'apksigner.jar');
  run(java, ['-jar', apksigner, 'sign', '--ks', ks, '--ks-key-alias', 'sanguis',
    '--ks-pass', 'pass:' + pass, '--key-pass', 'pass:' + pass, '--out', apk, aligned]);
  run(java, ['-jar', apksigner, 'verify', apk]);
  rmrf(apk + '.idsig');

  const kb = (fs.statSync(apk).size / 1024).toFixed(0);
  console.log('────────────────────────────────────────────');
  console.log(`  ✓ android/dist/${path.basename(apk)}  ${kb} kB  signed and verified`);

  /* --publish: put the release APK on the website itself, at
     /downloads/SanguisChristi.apk, so a phone can fetch it with one link. */
  if (process.argv.indexOf('--publish') > -1 && !DEBUG) {
    copy(apk, path.join(ROOT, 'downloads', APK_NAME));
    console.log(`  ✓ downloads/${APK_NAME}  published with the site`);
  }
  console.log('');
})();
