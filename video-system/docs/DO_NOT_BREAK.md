# Do not break

Every item here is load-bearing, and most of them are here because breaking them
produced a visible defect that had to be found by measurement. Read this before
changing anything under `render/`.

## The approved master

`out/evlek_reel_v7_1080x1920_60fps_silent_master.mp4`, sha256
`3c22d5a3b6483127e3ca871d915453c5a17f844be0776387d46381950603ff71`.

Never re-encode it, overwrite it, move it, rename it or delete it. It is not in
git; that checksum in `baselines/evlek-reel-v7-master.json` is its identity. To add
audio, mux to a **new filename** with `-c:v copy`.

## The seek protocol

```js
stageSvg.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', {
  detail: { time: frameIndex / 60, sync: true },
}));
```

* The event name is the Stage's contract (`animations-v2.jsx`), not a convention.
* `sync: true` routes the seek through `ReactDOM.flushSync`, so the committed DOM
  reflects that timestamp when `dispatchEvent` returns. Drop it and frames come
  from whenever React happened to commit.
* The Stage advertises `data-om-sync-seek` when `flushSync` is available; the
  renderer waits for that attribute before capturing. Without the wait, an early
  frame can be captured against an uncommitted DOM.
* Seeks must stay **unmarked** (no `detail.playing`). A marked seek latches the
  Stage's external-playback state and can render two scene layers at a seam.

## `settle()` — images and raster

Each frame waits for its images to load *and* decode, then for two animation
frames, before the screenshot.

* A seek commits the DOM synchronously, but an `<img>` a freshly mounted scene
  just created is only `complete` after its load task runs — **even when the bytes
  are already in the HTTP cache**. Screenshotting earlier produced a frame at
  t≈7.0 s where the scrim painted and the photograph did not.
* Two animation frames, not one: the first gets the commit to the compositor, the
  second lets it finish rastering. One frame let a layer be captured at the
  previous frame's raster scale.

## The Chromium flags

```
--force-device-scale-factor=1  --disable-lcd-text  --font-render-hinting=none
--run-all-compositor-stages-before-draw  --disable-partial-raster
--disable-checker-imaging  --disable-threaded-animation
--disable-threaded-scrolling  --disable-image-animation-resync
--force-color-profile=srgb  --disable-features=PaintHolding
```

`--disable-lcd-text` and `--font-render-hinting=none` fix glyph rasterisation, so
text is identical on every frame with no subpixel colour fringing. The four
compositor flags stop a frame being served out of a half-rastered layer. Changing
any of them changes the pixels: adding them mid-project invalidated a completed
1293-frame capture and it had to be redone.

`--deterministic-mode` belongs in that family and is deliberately **absent** — it
hangs this Chromium build headless.

## The capture geometry

Viewport exactly 1080×1920, `deviceScaleFactor: 1`, and the stage `<svg>` pinned
to the viewport origin with `transform: none` so the screenshot is 1:1. Never
capture at a device scale factor above 1 and downscale — that changes
antialiasing throughout.

## The encode arguments

See `RENDER_AND_QC.md` for the full command. CRF 17, preset slow, High/4.2,
yuv420p, BT.709 tagged, `-g 30`, `+faststart`, `-an`, and the explicit
`scale=…:in_range=full:out_range=tv:in_color_matrix=bt709:out_color_matrix=bt709`
conversion. Change one value and the output is no longer comparable to any
baseline in the repository.

## The pinned dependencies

* React 18.3.1, ReactDOM 18.3.1, @babel/standalone 7.29.0 in `render/vendor/`.
  `support.js` sets an SRI `integrity` attribute for each; a different build fails
  verification and the design never mounts. Their sha384 digests are recorded in
  `render/vendor/README.md`.
* Playwright is pinned to the version whose Chromium produced the approved
  frames. A browser upgrade can change text rasterisation — treat it as a change
  that needs a fresh baseline and explicit approval.

## Text nodes in the design

A line that reads as one sentence must be **one** interpolated string:

```js
{`${LI('location', 'Girne · Zeytinlik')} · ${LI('type', '2+1')}`}   // correct
{LI('location')} · {LI('type')}                                     // breaks it
```

Splitting one text node into three changed text shaping and moved 48 pixels by up
to 39 levels in the detail scene, breaking byte-identity against the baseline.

## The frame count comes from the design

The Stage publishes the summed scene durations on
`data-om-exportable-video-with-duration-secs`, and the renderer reads it. Never
hardcode 1293 or 21.55 anywhere. Changing `OM_SCENES` changes both, which
invalidates the baseline — that needs approval and a new baseline.

## Repeated frames are the design holding still

The approved master has 804 distinct frames out of 1293. Do not "fix" that. The
holds were specified ("metin en az 1.2 saniye okunur kalsın", "0.75 sn tamamen boş
oda", "CTA minimum 2.5 sn sabit"), and `verify.mjs` proves each repeat against the
design's own per-frame state. The only way to get more distinct frames is to
change the design's timing.

## Thresholds

Do not widen a tolerance to make a check pass. Every threshold in `verify.mjs` and
`qc.mjs` was set against a measurement — and the two that began as round-number
guesses (a 12 px slider step limit, a 90 % unique-frame rule) were both wrong and
had to be replaced with checks derived from the design itself.

## Assets

`project/img/` and `video-system/assets/approved/` are append-only. A reprocessed
image gets a new filename. Overwriting an approved asset silently changes every
reel that references it.

## When in doubt

Stop and ask. A wrong assumption about a price, a location, a duration or an asset
ships as a brand video.
