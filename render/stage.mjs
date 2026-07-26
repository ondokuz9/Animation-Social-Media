// Opens the reel in Chromium and prepares it for deterministic capture.
//
// Three things matter here:
//   1. No network. The design's runtime (support.js) pulls React, ReactDOM
//      and Babel from unpkg. Those requests are fulfilled from render/vendor
//      with the byte-identical npm artifacts — their sha384 digests match the
//      SRI attributes support.js sets, so integrity still verifies.
//   2. No chrome. The playback bar, tweaks panel, bundler overlays, scrollbars
//      and cursor are hidden, and the 1080x1920 stage <svg> is pinned to the
//      viewport origin at scale 1 so a clipped page screenshot is the frame,
//      pixel for pixel, with nothing resampled.
//   3. Nothing renders until every font and image is decoded, and every scene
//      has been mounted once, so no frame can catch a first-paint artifact.

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VENDOR = path.join(HERE, 'vendor');

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 60;

const STAGE_SELECTOR = 'svg[data-om-exportable-video-with-duration-secs]';

// unpkg URL -> local artifact. Byte-identical to what support.js expects.
const CDN_MAP = [
  ['react@18.3.1/umd/react.production.min.js', 'react-18.3.1/umd/react.production.min.js'],
  ['react-dom@18.3.1/umd/react-dom.production.min.js', 'react-dom-18.3.1/umd/react-dom.production.min.js'],
  ['@babel/standalone@7.29.0/babel.min.js', 'babel-standalone-7.29.0/babel.min.js'],
];

// Chrome only — never touches the design's own CSS or layout.
const CAPTURE_CSS = `
  html, body { margin: 0 !important; padding: 0 !important; overflow: hidden !important;
               background: #000 !important; }
  * { cursor: none !important; }
  ::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
  [data-omelette-chrome] { display: none !important; }
  .twk-panel, .twk-launch, .twk-fab { display: none !important; }
  #__bundler_loading, #__bundler_thumbnail, #__bundler_placeholder { display: none !important; }
  ${STAGE_SELECTOR} {
    position: fixed !important; left: 0 !important; top: 0 !important;
    margin: 0 !important; transform: none !important; box-shadow: none !important;
    z-index: 1 !important;
  }
`;

async function routeVendor(page) {
  await page.route('https://unpkg.com/**', async (route) => {
    const url = route.request().url();
    const hit = CDN_MAP.find(([remote]) => url.includes(remote));
    if (!hit) return route.abort();
    const body = await fs.readFile(path.join(VENDOR, hit[1]));
    await route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' },
      body,
    });
  });
  // Any other external origin is a bug, not a fallback — fail loud.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => {
    const url = route.request().url();
    if (url.startsWith('https://unpkg.com/')) return route.fallback();
    console.warn(`  ! blocked unexpected external request: ${url}`);
    return route.abort();
  });
}

/** Launches Chromium and returns a page parked on frame 0, ready to capture. */
export async function openStage({ origin, page: pagePath, imgDir, quiet = false }) {
  const log = (m) => { if (!quiet) console.log(m); };

  const browser = await chromium.launch({
    args: [
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--disable-lcd-text',                 // grayscale AA: no colour fringing on text
      '--font-render-hinting=none',         // identical glyph rasterisation every frame
      '--disable-features=PaintHolding',
      '--force-color-profile=srgb',
      '--autoplay-policy=no-user-gesture-required',
      // Determinism of the *compositor*, not just the DOM. Without these,
      // Chromium can serve a frame from a layer still rastered at the previous
      // frame's scale — two frames of the results card came out measurably
      // softer that way even though their DOM was byte-identical to the next
      // frame's. These force every compositor stage to complete, at full
      // raster, before a frame is drawn. (--deterministic-mode belongs in this
      // family but hangs this Chromium build headless, so it is deliberately
      // not used.)
      '--run-all-compositor-stages-before-draw',
      '--disable-partial-raster',
      '--disable-checker-imaging',
      '--disable-threaded-animation',
      '--disable-threaded-scrolling',
      '--disable-image-animation-resync',
      '--disable-background-timer-throttling',
    ],
  });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',         // the reel honours prefers-reduced-motion
    colorScheme: 'light',
    bypassCSP: true,
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => console.warn(`  ! page error: ${e.message}`));

  await routeVendor(page);

  const url = `${origin}/${encodeURIComponent(pagePath)}`;
  log(`  loading ${url}`);
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });

  // The design mounts through <x-dc>/<x-import>: React, Babel and the JSX
  // modules all arrive asynchronously, so wait for the stage itself.
  await page.waitForSelector(STAGE_SELECTOR, { timeout: 60_000, state: 'attached' });

  // flushSync-backed seeking is what makes a seeked frame exact — the DOM
  // reflects the new time before dispatchEvent returns.
  await page.waitForSelector(`${STAGE_SELECTOR}[data-om-sync-seek]`, { timeout: 30_000, state: 'attached' });

  const duration = await page.$eval(STAGE_SELECTOR, (el) =>
    parseFloat(el.getAttribute('data-om-exportable-video-with-duration-secs')));
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(`bad stage duration: ${duration}`);

  await page.addStyleTag({ content: CAPTURE_CSS });

  // Decode every image the reel uses, up front. Scene components mount and
  // unmount across the timeline; without this, a photo's first appearance can
  // paint one frame late.
  const images = (await fs.readdir(imgDir))
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .map((f) => `img/${f}`);
  const decoded = await page.evaluate(async (list) => {
    const results = await Promise.all(list.map((src) => new Promise((resolve) => {
      const im = new Image();
      im.onload = () => (im.decode ? im.decode().then(() => resolve(src), () => resolve(src)) : resolve(src));
      im.onerror = () => resolve(null);
      im.src = src;
    })));
    return results.filter(Boolean).length;
  }, images);
  if (decoded !== images.length) {
    throw new Error(`only ${decoded}/${images.length} images decoded — refusing to capture`);
  }
  log(`  decoded ${decoded} images`);

  // Fonts: the three brand families are base64-embedded in evlek.css. Confirm
  // the real faces are usable, not just that fonts.ready settled.
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => ({
    ready: document.fonts.status,
    hanken: document.fonts.check("800 76px 'Hanken Grotesk'"),
    mono: document.fonts.check("500 32px 'JetBrains Mono'"),
    fraunces: document.fonts.check("700 76px 'Fraunces'"),
    loaded: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style}:${f.status}`),
  }));
  if (!fonts.hanken || !fonts.mono) {
    throw new Error(`brand fonts not loaded: ${JSON.stringify(fonts)}`);
  }
  log(`  fonts ready (${fonts.loaded.length} faces: ${fonts.loaded.join(', ')})`);

  const seek = async (t) => {
    await page.evaluate(({ time, sel }) => {
      const el = document.querySelector(sel);
      el.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', {
        detail: { time, sync: true },   // sync => ReactDOM.flushSync, committed on return
        bubbles: false,
      }));
    }, { time: t, sel: STAGE_SELECTOR });
  };

  // A seek commits the DOM synchronously, but an <img> a scene has just
  // mounted is only `complete` once its load task has run — even when the
  // bytes are already in the HTTP cache. Screenshotting before that yields a
  // frame with the photo missing (the scrim paints, the picture doesn't).
  // So every frame waits for its images to be loaded AND decoded, then for one
  // animation frame, before it is serialised.
  const settle = async () => {
    await page.evaluate(async () => {
      const wait = (im) => new Promise((res) => {
        im.addEventListener('load', res, { once: true });
        im.addEventListener('error', res, { once: true });
      });
      await Promise.all([...document.images].map(async (im) => {
        if (!im.complete) await wait(im);
        if (im.decode) { try { await im.decode(); } catch { /* decode races unmount */ } }
      }));
      // Two frames, not one: the first lets the new style commit reach the
      // compositor, the second lets it finish rastering at the final scale, so
      // the screenshot can't catch a layer mid-re-raster.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    });
  };

  // Warm pass: mount every scene once so its images, SVG paths and text
  // layout are all resident before the real capture. Purely a cache warm —
  // render(t) is a pure function of t, so it cannot change any output frame.
  const warmStep = 0.1;
  for (let t = 0; t <= duration + 1e-9; t += warmStep) {
    await seek(Math.min(t, duration));
    await settle();
  }
  await seek(0);
  await settle();
  log(`  warm pass done (${Math.ceil(duration / warmStep) + 1} seeks)`);

  return {
    page,
    duration,
    seek,
    settle,
    fonts,
    imageCount: decoded,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    close: async () => { await context.close(); await browser.close(); },
  };
}
