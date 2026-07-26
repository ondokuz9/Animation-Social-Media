# Render and QC

## The pipeline

`npm run render` runs six stages. Each one exists because it caught something.

| stage | module | what it establishes |
|---|---|---|
| 1. capture | `render/capture.mjs` | 1293 lossless PNGs, one per frame, each seeked to exactly `i / 60` |
| 2. encode | `render/encode.mjs` | one single-pass libx264 master from that sequence |
| 3. design audit | `render/domaudit.mjs` | what the design *draws* at each of the 1293 timestamps |
| 4. reproducibility | `render/reproduce.mjs` | the whole timeline rendered again, byte-identical |
| 5. verify | `render/verify.mjs` | ffprobe properties + frame-hash accounting |
| 6. QC | `render/qc.mjs` | pixel-level visual checks |

Frames are kept until every stage passes. `--clean-frames` deletes them
afterwards; `--encode-only` re-encodes an existing capture.

## Why the render is deterministic

The design was authored as a pure function of time: no CSS animations or
transitions, no `requestAnimationFrame` counters, no `Date.now()`. The
`animations-v2` Stage exposes that time as a seek protocol, and the renderer
drives it:

```js
stageSvg.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', {
  detail: { time: frameIndex / 60, sync: true },
}));
```

`sync: true` makes the Stage apply the seek through `ReactDOM.flushSync`, so the
DOM already reflects that timestamp when `dispatchEvent` returns, and the engine's
own clock stays paused for the entire capture. No screen recording, no real-time
sampling.

The frame count is never hardcoded: the Stage publishes the summed scene durations
on `data-om-exportable-video-with-duration-secs`, and the renderer reads it.
21.55 s × 60 = 1293 frames.

## Reading a repeated frame

The approved master has **804 distinct frames out of 1293**. That is not fake 60
fps — it is the reel holding still, and the design was asked to hold in exactly
those places ("metin en az 1.2 saniye okunur kalsın", "0.75 sn tamamen boş oda",
"CTA minimum 2.5 sn sabit").

`verify.mjs` proves it rather than asserting it. Every pixel repeat must line up
with either:

* an identical design state — `domaudit.mjs` hashes the stage DOM per frame, and
  473 repeats have a byte-identical design state; or
* a design state that changed by **less than one device pixel** at 60 fps — 15
  frames, each individually listed in `out/verify-report.json`.

The second group is then checked for softness in `qc.mjs`: a repeat that was
*softer* than its neighbours would mean a layer was captured mid-re-raster, which
is a real defect. Measured worst case: −0.4 % sharpness, i.e. none.

Two things that audit deliberately does not do:

* It does not treat "identical serialised DOM ⇒ identical pixels" as a rule. CSS
  rounds transform values on serialisation, so the tail of an ease
  (`scale(1.0249994)` vs `scale(1.025)`) serialises identically while the
  rasteriser still sees two different floats.
* It does not compare duplicate *run counts* to detect encoder duplicates.
  `-g 30` forces an IDR every 30 frames, which makes libx264 re-quantise inside a
  static stretch and *adds* distinct decoded frames (1090 distinct from 804
  distinct sources). The check compares duplicate frame *sets* instead.

## The QC checks

| check | how it is measured | passing value on the approved master |
|---|---|---|
| no white flash | per-frame mean luma; a frame brighter than both neighbours by >8 | none |
| sub-pixel repeats are not softer | whole-frame edge RMS vs neighbours | worst −0.401 % |
| text stable while held | edge energy in the headline band, frame to frame | 175 held frames, <25 % deviation |
| slider never backtracks | sub-pixel centroid of the 4 px divider | 86 frames, no backtrack |
| slider sits on the design curve | measured centroid vs `110 + 860·(0.5 − 0.5·cos πp)` | mean 0.563 px, max 1.338 px |
| opening pan smooth | second difference of frame-to-frame delta | mean Δ 1.050, max jerk 0.202 |

The slider check is worth understanding: rather than a jerk heuristic with an
arbitrary threshold, it compares the rendered divider against the design's own
easing formula. Every 60 fps sample sits on the authored curve to within the
measurement precision of a 4 px bar crossing a moving image seam.

## Baseline checking

```sh
npm run baseline:check
```

Renders eleven checkpoints (0.50, 1.40, 2.70, 4.50, 7.20, 9.30, 10.80, 13.20,
16.50, 19.50, 21.30 s) and compares them two ways:

* against `baselines/frames/render/*.png` — must be **byte-identical**;
* against `baselines/frames/master/*.png`, decoded from the approved MP4 — by
  PSNR, which must stay within 1.5 dB of the value the baseline recorded for that
  checkpoint. An identical render reproduces the recorded PSNR exactly.

It also ffprobes the master and checks its sha256 against the manifest.

## Encode settings

```
-framerate 60 -i frames/frame_%06d.png
-vf scale=1080:1920:in_range=full:out_range=tv:in_color_matrix=bt709:out_color_matrix=bt709,format=yuv420p
-c:v libx264 -preset slow -crf 17 -profile:v high -level:v 4.2
-pix_fmt yuv420p -maxrate 16M -bufsize 24M -g 30
-x264-params interlaced=0
-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv
-movflags +faststart -an -r 60
```

The `scale` filter does not resize — the source is already 1080×1920. It is there
to state the RGB→YUV conversion explicitly: full-range sRGB PNG in, limited-range
BT.709 yuv420p out, rather than leaving it to swscale's defaults.

Do not change any of these values for a new reel. A different CRF or preset makes
the output incomparable to every baseline in the repository.

## No network at render time

`support.js` loads React, ReactDOM and Babel from unpkg. Those three requests are
fulfilled from `render/vendor/` with the byte-identical npm artifacts — their
sha384 digests match the SRI attributes `support.js` sets, so integrity still
verifies. Any other external request is blocked and logged. See
`render/vendor/README.md`.

## When a check fails

1. Read the report: `out/verify-report.json`, `out/qc-report.json`,
   `out/baseline-check-*.json`. They list exact frames and timecodes.
2. Do not widen a tolerance to make a check pass. Every threshold here was set
   against a measurement, and the two that started out arbitrary were both wrong.
3. Do not re-create a baseline to silence drift.
4. If the failure is in the design rather than the render, stop and report it —
   changing the design is a separate, approved decision.
