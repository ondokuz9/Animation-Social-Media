# Creating a new reel

The approved V7 master is never touched by this workflow. A new reel is a copy of
the template on its own branch, rendered to its own filenames.

## 1. Start from current main

```sh
git checkout main && git pull
git checkout -b video/<video-name>
```

One branch per video. `video/kocan-explainer`, `video/girne-launch` — the name is
the video, not the task.

## 2. Copy the template

```sh
cp -a video-system/templates/brand-reel-v7 video-system/templates/<video-name>
```

Copy it. Do not edit `brand-reel-v7/` in place, and do not "extend" it to cover
both reels.

## 3. Give it its own identity

In `video-system/templates/<video-name>/content.json`:

```json
{ "project_id": "evlek-<video-name>", "language": "tr" }
```

`project_id` ends up in the render report and distinguishes outputs.

## 4. Edit the content manifest

`content.json` holds the copy, the listing figures and the asset paths.
`content.example.json` documents every field. Nothing else needs editing for a
content-only reel.

What is *not* in the manifest, and what changing it costs:

| you want to change | where it lives | consequence |
|---|---|---|
| copy, prices, locations, images | `content.json` | none — this is the intended path |
| scene durations or order | `window.OM_SCENES` in the design page | frame count changes, baseline invalid, needs approval + a new baseline |
| layout, card sizes, easing, morphs | `evlek-reel-v7.jsx` | a design change, not a content change — ask first |
| fonts, colours | `evlek.css` | brand change — ask first |

Keep a line that reads as one sentence as **one interpolated string** in the JSX.
Splitting a text node changes text shaping and breaks byte-identity.

## 5. Add new assets under new filenames

```sh
cp ~/incoming/new-hook.jpg video-system/templates/<video-name>/project/img/hook-<what-it-is>.jpg
```

Never overwrite an existing image, in the template or in `assets/approved/`. If a
photograph is reprocessed, it gets a new name. Then point `content.json` at it.

Before/after staging pairs must be the same room from the same camera: identical
geometry, window proportions, camera angle, ceiling height and door openings.

## 6. Render

```sh
npm run render:template -- --template video-system/templates/<video-name> --label <video-name>
```

This inlines `content.json` into the page, captures every frame at `t = i / 60`,
encodes one single-pass H.264 master, and writes
`out/evlek_<video-name>_1080x1920_60fps_silent.mp4`.

## 7. QC

```sh
npm run qc                 # white flash, text stability, slider curve, pan smoothness
```

`qc.mjs` reads a captured frame sequence, so pass `--keep-frames` to the render
step when you want to QC it. What each check proves:
[`RENDER_AND_QC.md`](RENDER_AND_QC.md).

## 8. Check the approved baseline is untouched

```sh
npm run baseline:check
```

This renders the V7 checkpoints and compares them against the golden baseline. It
must pass on every branch, always. If it fails, something in `render/`,
`project/` or `brand-reel-v7/` moved — stop and report it. **Do not re-create the
baseline to make the check pass.**

## 9. Silent master

The render step already produced it. Confirm what you have:

```sh
ffprobe -v error -show_streams -show_format -of json out/evlek_<video-name>_*_silent.mp4
```

Expect 1080×1920, 60 fps, H.264 High L4.2, yuv420p, BT.709, no audio stream.

## 10. Pin it as a baseline (only once approved)

```sh
npm run baseline:create -- --id <video-name>-master \
  --video out/evlek_<video-name>_1080x1920_60fps_silent.mp4 \
  --source video-system/templates/<video-name>/project
```

Records sha256, the stream properties and eleven checkpoint snapshots. Do this
when the reel is signed off, not while iterating.

## 11. Audio

```sh
npm run markers:export -- --source video-system/templates/<video-name>/project
```

Mix music + SFX against the cue list at 48 kHz, no voiceover. Full process:
[`AUDIO_WORKFLOW.md`](AUDIO_WORKFLOW.md).

## 12. Mux — never re-encode the video

```sh
ffmpeg -i out/evlek_<video-name>_1080x1920_60fps_silent.mp4 -i mix/<video-name>_48k.wav \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -ar 48000 -ac 2 \
  -movflags +faststart -shortest \
  out/evlek_<video-name>_1080x1920_60fps_master.mp4
```

`-c:v copy` is not optional. Re-encoding the video stream discards the verified
render.

## 13. Confirm the muxed file

```sh
ffprobe -v error -show_streams -of json out/evlek_<video-name>_1080x1920_60fps_master.mp4
```

The video stream must be identical to the silent master (same codec, profile,
resolution, frame count, duration) with one AAC 48 kHz stereo stream added.

## 14. Platform cuts

Each platform version is a **new filename** — never an overwrite:

```
out/evlek_<video-name>_1080x1920_60fps_master.mp4     master
out/evlek_<video-name>_instagram_reels.mp4
out/evlek_<video-name>_tiktok.mp4
out/evlek_<video-name>_youtube_shorts.mp4
```

## 15. Commit

Source, template, manifest, marker exports, baseline metadata and checkpoint
snapshots are committed. MP4s, WAVs and frame directories are not — `.gitignore`
already covers them, and the master's identity is its sha256 in `baselines/`.

```sh
git add -A && git commit -m "feat(video): <video-name> reel"
git tag <video-name>-v1
```
