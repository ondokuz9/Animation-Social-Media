# Evlek video system — working rules

This repository holds the Evlek Reel V7 design sources, a verified deterministic
60 fps renderer, and an approved golden master. **The approved output is the
product.** Everything here exists to reproduce it exactly and to make the next
reel without disturbing it.

Read `baselines/evlek-reel-v7-master.json` before you change anything.

> This file is the Codex-facing copy of `CLAUDE.md`. The two are kept identical
> on purpose: whichever agent opens the repository reads the same rules. If you
> change one, change the other in the same commit.

## Non-negotiable rules

1. **Read the current state first.** Check the branch, the tags
   (`git tag -l`), and the baseline manifest in `baselines/` before proposing or
   making any change.
2. **Never edit the approved template in place.** `video-system/templates/brand-reel-v7/`
   is a reference. A new reel starts as a copy of it.
3. **One branch per video.** `video/<video-name>`, cut from the latest `main`.
4. **New reels are copies.** Copy the template directory; do not fork the
   renderer, and do not "generalise" the template to cover a new case.
5. **Approved assets are append-only.** Never overwrite anything in
   `video-system/assets/approved/` or `project/img/`. New imagery gets a new
   filename.
6. **The approved master is never re-encoded, overwritten, moved or deleted.**
   `out/evlek_reel_v7_1080x1920_60fps_silent_master.mp4`, sha256
   `3c22d5a3b6483127e3ca871d915453c5a17f844be0776387d46381950603ff71`.
7. **Do not refactor the renderer.** `render/` is verified working code:
   deterministic seek, `ReactDOM.flushSync`, the image/raster settle, the
   Chromium flags and the FFmpeg arguments are all load-bearing. "Cleaner code"
   is not a reason to touch any of it.
8. **Do not upgrade dependencies without explicit permission.** React 18.3.1,
   ReactDOM 18.3.1 and @babel/standalone 7.29.0 in `render/vendor/` are pinned to
   what `support.js` verifies by SRI — a different build fails integrity and the
   design will not mount. Playwright is pinned to the version whose Chromium
   produced the approved frames.
9. **Run QC before and after.** `npm run verify` and `npm run qc` for a full
   render, `npm run baseline:check` for anything that could touch pixels.
10. **A new render must leave the existing baseline untouched.** If
    `baseline:check` reports any drift on the V7 baseline, stop and report;
    do not update the baseline to make the check pass.
11. **Ask before deleting, moving, renaming or bulk-formatting.** That includes
    "tidying" directories, renaming assets and running a formatter across files
    you were not asked to change.
12. **Large binaries stay out of git.** MP4/WAV masters, mixes and platform cuts
    are pinned by checksum in `baselines/`, not committed.
13. **Frame directories stay out of git.** `out/frames*/` is regenerated
    deterministically; never commit it.
14. **Muxing audio never re-encodes video.** Always `-c:v copy`. Re-encoding the
    approved video stream invalidates the golden master.
15. **When something is ambiguous, stop and ask.** Do not assume a timing, a
    price, a location, a colour or an asset. Ask.

## What must not change without explicit permission

Scene durations and order, all copy, images, fonts, colours, card geometry,
easing values, the staging slider motion, the morph transitions, the render
timing system, `data-om-seek-to-time-frame` behaviour, the `ReactDOM.flushSync`
seek path, the Chromium render flags, the FFmpeg encode arguments, the approved
master, and any approved asset.

If a change you are about to make could alter the V7 output — even by one pixel —
stop and say so before making it.

## Layout

```
project/                     approved V7 design sources (the render of record)
render/                      the verified renderer + baseline/marker/QC tooling
baselines/                   golden master manifest + checkpoint snapshots
video-system/
  templates/brand-reel-v7/   reusable copy of the V7 design + content.json
  assets/                    brand, approved and audio libraries
  docs/                      how to create, render, QC and mix a reel
out/                         render outputs (gitignored except marker exports)
```

## Commands

| command | what it does |
|---|---|
| `npm run render` | full V7 render: capture → encode → design audit → reproducibility → verify → QC |
| `npm run render:template` | render a template instance to its own MP4, never touching V7 outputs |
| `npm run verify` | ffprobe + frame-hash audit of the current master |
| `npm run qc` | pixel QC over a captured frame sequence |
| `npm run markers:export` | audio cue list to `out/evlek_audio_markers.{json,csv}` |
| `npm run baseline:create` | pin a master: sha256, stream properties, checkpoint snapshots |
| `npm run baseline:check` | render the checkpoints and compare against the golden baseline |

Start here: `video-system/docs/CREATE_NEW_REEL.md`, and
`video-system/docs/DO_NOT_BREAK.md` before touching anything under `render/`.
