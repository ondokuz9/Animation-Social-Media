# Evlek Reel v7 — native 60 fps render system

Renders `project/Evlek Reel v7.dc.html` frame by frame into a 1080×1920 · 60 fps
H.264 master. The design is **not** modified in any way: no scene duration, no
image, no text, no font, no easing, no colour is touched. The renderer only
seeks the design's own timeline and serialises what it draws.

This is not an upscale or a frame-rate conversion of an existing MP4. Every
frame is rendered from the source HTML/CSS/JS at the exact timestamp
`frameIndex / 60`.

```
npm install          # once — playwright (pinned), ffmpeg-static, ffprobe-static
npm run render       # capture -> encode -> verify
```

Output: `out/evlek_reel_v7_1080x1920_60fps_silent_master.mp4`

## Why the output is deterministic

The design was authored as a pure function of time — `render(t)`, no CSS
animations, no transitions, no `rAF` counters, no `Date.now()`. The
`animations-v2` Stage it runs on exposes that time as a seek protocol, which is
what the renderer drives:

```js
stageSvg.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', {
  detail: { time: frameIndex / 60, sync: true },
}));
```

`sync: true` makes the Stage apply the seek through `ReactDOM.flushSync`, so the
DOM already reflects that timestamp when `dispatchEvent` returns — the engine's
own `requestAnimationFrame` clock stays paused for the whole capture and can
never interleave. Seeking the same `t` twice, in any order, produces
byte-identical PNGs (asserted in the smoke checks and by the capture manifest's
per-frame hashes).

There is no screen recording and no real-time sampling anywhere in the pipeline.

## Pipeline

| step | file | what it does |
|---|---|---|
| serve | `server.mjs` | static HTTP origin over `project/` (never `file://`, so the runtime's relative `.jsx` / `.css` / `img` fetches behave exactly as in the design tool) |
| open | `stage.mjs` | launches Chromium, hides chrome, waits for readiness, exposes `seek()` / `settle()` |
| capture | `capture.mjs` | 1293 PNGs at `t = i / 60`, plus a per-frame hash manifest |
| encode | `encode.mjs` | one single-pass libx264 encode of the PNG sequence |
| audit | `domaudit.mjs` | hashes the design's own state at all 1293 timestamps — the evidence for "is this repeated frame the design or the capture?" |
| reproduce | `reproduce.mjs` | renders the timeline a second time and requires byte-identical frames |
| verify | `verify.mjs` | ffprobe + frame-hash audit, writes `out/verify-report.json` |
| QC | `qc.mjs` | pixel-level visual checks, writes `out/qc-report.json` |
| run all | `render.mjs` | orchestrates all six, keeps frames until everything passes |

### No network at render time

`support.js` (the design runtime) loads React, ReactDOM and Babel from unpkg.
Those three requests are fulfilled from `vendor/` with the byte-identical npm
artifacts — their sha384 digests match the SRI attributes `support.js` sets, so
subresource integrity still verifies. Any other external request is blocked and
logged, so a silent dependency on the network cannot creep in.

### Capture hygiene

* viewport exactly 1080×1920, `deviceScaleFactor: 1`
* the stage `<svg>` is pinned to the viewport origin at `transform: none`, so
  the screenshot is 1:1 — nothing is scaled or resampled
* hidden: playback bar, tweaks panel, bundler overlays, scrollbars, cursor
* `--disable-lcd-text` and `--font-render-hinting=none` so glyph rasterisation
  is identical on every frame (no subpixel colour fringing on text)
* capture refuses to start unless all 9 images decode and the brand faces
  (Hanken Grotesk 800, JetBrains Mono 500) report loaded
* a warm pass seeks the whole timeline at 0.1 s steps first, mounting every
  scene once

`settle()` is the important one: a seek commits the DOM synchronously, but an
`<img>` that a freshly mounted scene just created is only `complete` after its
load task runs — even when the bytes are already in the HTTP cache.
Screenshotting before that produces a frame where the scrim paints and the
photograph does not (this really happened at t≈7.0 s, the "Sadece bulmaz.
Açıklar." detail scene). So each frame waits for its images to load *and*
decode, then for two animation frames — one to get the commit to the
compositor, one to let it finish rastering — before serialisation.

The Chromium flags in `stage.mjs` matter for the same reason. `--deterministic-mode`
belongs in that family but hangs this build headless, so it is deliberately
absent; the remaining four (no partial raster, no checkerboard imaging, no
threaded animation, all compositor stages before draw) are what keep a frame
from being served out of a half-rastered layer.

### Frame count comes from the design

Never hardcoded. The Stage publishes the summed scene durations on
`data-om-exportable-video-with-duration-secs`, and the renderer reads it:

```
Kanca 2.1 + Arama 1.85 + Sonuçlar 2.5 + Okuma 3.3
     + Sanal Düzenleme 4.0 + Piyasa 4.3 + Kapanış 3.5  =  21.55 s
21.55 × 60 = 1293 frames   (frame 1 = t 0.000 s, frame 1293 = t 21.533 s)
```

If the design's scene list changes, the frame count follows it automatically.

## Encode

```
ffmpeg -framerate 60 -i frames/frame_%06d.png \
  -vf scale=1080:1920:in_range=full:out_range=tv:in_color_matrix=bt709:out_color_matrix=bt709,format=yuv420p \
  -c:v libx264 -preset slow -crf 17 -profile:v high -level:v 4.2 \
  -pix_fmt yuv420p -maxrate 16M -bufsize 24M -g 30 \
  -x264-params interlaced=0 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -movflags +faststart -an -r 60 \
  evlek_reel_v7_1080x1920_60fps_silent_master.mp4
```

The `scale` filter carries no resize (the source is already 1080×1920) — it is
there to state the RGB→YUV conversion explicitly: full-range sRGB PNG in,
limited-range BT.709 yuv420p out, rather than leaving it to swscale's defaults.

## Verification

`verify.mjs` decodes the finished master and hashes **every** frame, so
duplicated output — "fake 60 fps" — cannot pass unnoticed. No frame
interpolation, frame blending or `mpdecimate` is used anywhere in the pipeline.

Repeated frames do exist, and they are the design's own hold moments — the
briefs asked for several of them by name ("metin en az 1.2 saniye okunur
kalsın", "0.75 sn tamamen boş oda", "CTA minimum 2.5 sn sabit"). Claiming that
without evidence would be hand-waving, so the pipeline proves it: `domaudit.mjs`
hashes what the design *draws* at each of the 1293 timestamps, and `verify.mjs`
requires every pixel repeat to line up with either

* an identical design state — the reel is holding still, or
* a design state that changed by less than one device pixel at 60 fps.

The second group is also checked for softness in `qc.mjs`: a repeat that were
*softer* than its neighbours would mean a layer was captured mid-re-raster,
which is a real defect. Measured worst case: −0.4 % sharpness, i.e. none.

Two things this audit deliberately does **not** do:

* It does not treat "identical serialised DOM ⇒ identical pixels" as a rule. CSS
  rounds transform values when serialising, so the tail of an ease
  (`scale(1.0249994)` vs `scale(1.025)`) serialises identically while the
  rasteriser still sees two different floats. Fifteen frames sit in that gap.
* It does not use run *counts* to detect encoder duplicates. Forcing an IDR
  every 30 frames (`-g 30`) makes libx264 re-quantise inside a static stretch,
  which *adds* distinct decoded frames (1090 distinct out of 1293, against 804
  distinct source PNGs). The check compares the actual duplicate frame *sets*
  instead, and confirms libx264 collapsed nothing the render kept apart.

Determinism is gated by `reproduce.mjs` — the whole timeline rendered a second
time, requiring 1293/1293 byte-identical frames — because rendering it again is
the only thing that actually establishes it.

Frames are kept until verification passes; `node render.mjs --clean-frames`
deletes them afterwards, and `--encode-only` re-encodes an existing capture
without re-rendering.
