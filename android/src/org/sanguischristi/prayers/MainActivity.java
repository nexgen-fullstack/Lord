package org.sanguischristi.prayers;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.util.Log;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * The whole app: one web view showing the devotion that ships inside the APK.
 *
 * The pages are the very files the website serves, copied into assets/www by
 * android/build.js. They are served from https://appassets.androidplatform.net
 * — a host the web view reserves for exactly this and never resolves on the
 * network — so they get a real https origin (localStorage for the tracker and
 * the text size, same-origin fonts) without the app needing the internet at
 * all. There is no INTERNET permission: nothing here can reach the network.
 */
public class MainActivity extends Activity {

    static final String HOST = "appassets.androidplatform.net";
    static final String START = "https://" + HOST + "/index.html";
    static final int INK = 0xFF0A0304;          // --bg-primary in main.css

    private WebView web;
    private TextToSpeech tts;
    private volatile boolean ttsReady = false;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(INK);

        web = new WebView(this);
        web.setBackgroundColor(INK);
        root.addView(web, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);

        /* From Android 15 every app is drawn edge to edge. Pad the page clear
           of the status bar, the navigation bar and any display cutout, so the
           header is never tucked under the clock. */
        if (Build.VERSION.SDK_INT >= 30) {
            root.setOnApplyWindowInsetsListener((View v, WindowInsets insets) -> {
                Insets bars = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return WindowInsets.CONSUMED;
            });
        }

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        /* The page sizes its own type (and offers A−/A+); the device's font
           scale is handed to it through SanguisApp.fontScale() instead, so it
           enlarges the prayers without breaking the header. */
        s.setTextZoom(100);
        /* Pinch-to-zoom stays available for anyone who needs more still. */
        s.setSupportZoom(true);
        s.setBuiltInZoomControls(true);
        s.setDisplayZoomControls(false);
        /* app.js reads this to switch off the service worker and the install
           prompt, and to reach the speech bridge below. */
        s.setUserAgentString(s.getUserAgentString() + " SanguisApp/" + BuildConfig.VERSION_NAME);

        web.setWebViewClient(new AssetClient());
        /* A chrome client is what lets confirm() — the tracker's reset
           question — show its dialog at all. It also passes the page's
           console to logcat (tag "SanguisWeb") for `adb logcat`. */
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                Log.d("SanguisWeb", m.messageLevel() + " " + m.sourceId() + ":" + m.lineNumber() + " " + m.message());
                return true;
            }
        });
        /* `node android/build.js --debug` builds an APK whose page can be
           inspected from chrome://inspect on a connected computer. */
        if (BuildConfig.DEBUG) WebView.setWebContentsDebuggingEnabled(true);
        web.addJavascriptInterface(new SpeechBridge(), "SanguisTTS");
        web.addJavascriptInterface(new AppBridge(), "SanguisApp");

        tts = new TextToSpeech(this, status -> {
            ttsReady = status == TextToSpeech.SUCCESS;
            js("window.__sanguisVoices && window.__sanguisVoices()");
        });
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override public void onStart(String id) { }
            @Override public void onDone(String id) { event(id, "end"); }
            @Override @Deprecated public void onError(String id) { event(id, "error"); }
            @Override public void onError(String id, int code) { event(id, "error"); }
            /* A stop() the page asked for — the page already knows. */
            @Override public void onStop(String id, boolean interrupted) { }
        });

        if (state != null) web.restoreState(state);
        else web.loadUrl(START);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        if (web != null) { web.destroy(); }
        super.onDestroy();
    }

    private void js(final String code) {
        if (web == null) return;
        web.post(() -> web.evaluateJavascript(code, null));
    }

    private void event(String id, String type) {
        js("window.__sanguisTTS && window.__sanguisTTS(" + JSONObject.quote(id) + ",'" + type + "')");
    }

    /* ─────────────────────────── the pages ─────────────────────────── */

    private final class AssetClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (HOST.equals(u.getHost())) return false;
            /* Anything outside the book opens in the browser, if there is one. */
            try { startActivity(new Intent(Intent.ACTION_VIEW, u)); }
            catch (ActivityNotFoundException e) { /* nowhere to send it */ }
            return true;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (!HOST.equals(u.getHost())) return notFound();

            String path = u.getPath();
            if (path == null || path.isEmpty()) path = "/";
            if (path.endsWith("/")) path += "index.html";
            path = path.substring(1);
            if (path.contains("..")) return notFound();

            try {
                InputStream in = getAssets().open("www/" + path);
                String mime = mimeFor(path);
                WebResourceResponse r = new WebResourceResponse(mime, charsetFor(mime), in);
                Map<String, String> h = new HashMap<>();
                h.put("Cache-Control", "no-cache");
                h.put("Access-Control-Allow-Origin", "*");
                r.setResponseHeaders(h);
                return r;
            } catch (IOException e) {
                return notFound();
            }
        }

        private WebResourceResponse notFound() {
            return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
                    new HashMap<>(), new ByteArrayInputStream(new byte[0]));
        }
    }

    static String mimeFor(String path) {
        String p = path.toLowerCase(Locale.ROOT);
        if (p.endsWith(".html")) return "text/html";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".js")) return "text/javascript";
        if (p.endsWith(".json") || p.endsWith(".webmanifest")) return "application/json";
        if (p.endsWith(".woff2")) return "font/woff2";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".mp3")) return "audio/mpeg";
        return "application/octet-stream";
    }

    static String charsetFor(String mime) {
        return mime.startsWith("text/") || mime.equals("application/json") ? "UTF-8" : null;
    }

    /* ──────────────────────── bridges for app.js ──────────────────────── */

    /** The device's own text-to-speech engine, which Android's web view does
     *  not expose to pages. app.js wraps this in a standard speechSynthesis. */
    private final class SpeechBridge {

        /** Installed voices only — one that still has to be downloaded would
         *  fail without a connection, which is the whole point of this app. */
        @JavascriptInterface
        public String voices() {
            JSONArray out = new JSONArray();
            if (!ttsReady) return out.toString();
            try {
                Set<Voice> all = tts.getVoices();
                if (all == null) return out.toString();
                for (Voice v : all) {
                    Set<String> f = v.getFeatures();
                    if (f != null && f.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)) continue;
                    if (v.isNetworkConnectionRequired()) continue;
                    JSONObject o = new JSONObject();
                    o.put("name", v.getName());
                    o.put("lang", v.getLocale().toLanguageTag());
                    o.put("local", true);
                    out.put(o);
                }
            } catch (Exception e) { /* engine vanished mid-query */ }
            return out.toString();
        }

        @JavascriptInterface
        public void speak(String id, String text, String lang, String voiceName, double rate, double pitch) {
            if (!ttsReady) { event(id, "error"); return; }
            Voice chosen = null;
            try {
                Set<Voice> all = tts.getVoices();
                if (all != null && voiceName != null && !voiceName.isEmpty()) {
                    for (Voice v : all) if (voiceName.equals(v.getName())) { chosen = v; break; }
                }
            } catch (Exception e) { chosen = null; }

            if (chosen != null) tts.setVoice(chosen);
            else if (lang != null && !lang.isEmpty()) tts.setLanguage(Locale.forLanguageTag(lang));

            tts.setSpeechRate((float) rate);
            tts.setPitch((float) pitch);
            Bundle params = new Bundle();
            if (tts.speak(text, TextToSpeech.QUEUE_ADD, params, id) != TextToSpeech.SUCCESS) {
                event(id, "error");
            }
        }

        @JavascriptInterface
        public void stop() {
            if (ttsReady) tts.stop();
        }
    }

    private final class AppBridge {
        /** The accessibility font size chosen in Android's settings. The page
         *  starts at this text size until the reader picks one of their own. */
        @JavascriptInterface
        public float fontScale() {
            return getResources().getConfiguration().fontScale;
        }
    }
}
