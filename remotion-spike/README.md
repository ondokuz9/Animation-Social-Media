# Remotion spike — does it reproduce the approved reel?

A single question, answered with a measurement: **if the next Evlek reel is built in
Remotion instead of the current renderer, what does the picture cost?**

Method: port the approved V7 closing scene (`project/evlek-reel-v7.jsx` ·
`SceneKapanis`) to Remotion verbatim — same constants, same easing, same numbers,
same element order — then compare its output against the golden baseline
snapshots in `baselines/frames/render/`.

The only substitution is the time source:

```js
// approved renderer          // Remotion
useScene().localTime      →   useCurrentFrame() / fps
```

## Result

| measurement | value |
|---|---|
| PSNR, Remotion vs the approved source render (t = 19.50 s) | **44.92 dB** |
| Differing pixels | 9 927 of 2 073 600 (**0.48 %**) |
| Where the difference is | **glyph edges only** — the wordmark image and the gold rule are pixel-identical |
| For contrast: the approved MP4 vs its own source render, same frame | **38.70 dB** |
| Render speed | 210 frames in 19 s (~11 fps) vs ~3 fps for the approved pipeline |

**Remotion's independent render is closer to our source PNGs than our own delivered
H.264 master is.** The residual is font rasterisation noise, below what the codec
already does. Visually indistinguishable.

Porting effort was mechanical: ~15 minutes for a scene, because the design was
already authored as a pure function of `t` — which is exactly what Remotion wants.

## Environment notes (both one-time)

1. Remotion tries to download its own Chromium; that is blocked here (403). Pass
   `--browser-executable` instead.
2. The modern Chrome binary dropped old headless mode, so the executable must be
   the **headless shell**:
   `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`

```sh
npx remotion still src/index.js Kapanis out/f087.png --frame=87 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## Encode defaults do NOT match the approved spec

Remotion's own encode produced `yuvj420p` (full range), a `bt470bg` colour tag, a
duration of 3.563 s for 210 frames, and an unrequested silent audio track. It also
exposes fewer ffmpeg controls than the approved pipeline (no maxrate/bufsize).

**Conclusion — use the hybrid:** author in Remotion, output a PNG sequence
(`--sequence`), and encode the master with the verified `render/encode.mjs`
(H.264 High L4.2, yuv420p, BT.709 limited, faststart, maxrate/bufsize). Best of
both: Remotion's authoring and preview, our proven delivery spec.

## Licence

Remotion is free for individuals and **for-profit organizations with up to 3
employees** (see `LICENSE.md` in the Remotion repository). Beyond that a company
licence is required. Confirm headcount before relying on the free tier.

## Files

```
src/Kapanis.jsx      the ported scene
src/Root.jsx         composition registration (3.5 s @ 60 fps, 1080×1920)
src/evlek.css        copied from project/ — base64 brand fonts
public/wordmark.png  copied from project/img/
out/                 render output, not tracked (regenerate with the command above)
```
