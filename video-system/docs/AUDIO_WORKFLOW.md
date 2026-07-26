# Audio workflow

The render is silent by design. Audio is added last, and the video stream is never
re-encoded to do it.

## 1. Export the cue list

```sh
npm run markers:export
# out/evlek_audio_markers.json
# out/evlek_audio_markers.csv
```

Times are read from the running design — `window.OM_AUDIO_MARKERS` in the page,
with the total duration taken from the Stage. Nothing is typed by hand.

The JSON separates what the design authored from what the export suggests:

```json
"field_provenance": {
  "authored_by_the_design": ["cue", "time_seconds", "scene", "scene_local_seconds", "frame"],
  "mix_suggestions_not_authored": ["end_seconds", "duration_seconds", "category",
    "suggested_sound", "intensity", "suggested_gain_db", "notes"]
}
```

The design declares **onsets only**. Every length and level in the export is a
starting point for the mix.

The 17 cues of the approved reel:

| t (s) | frame | cue | scene | suggested sound |
|---|---|---|---|---|
| 0.00 | 1 | intro-swell | Kanca | music bed in |
| 1.00 | 61 | match-cut-whoosh | Kanca | card_morph |
| 2.10 | 127 | morph-soft | Arama | card_morph |
| 2.95 | 178 | chip-tick | Arama | query_parse_tick |
| 3.00 | 181 | price-tick | Arama | query_parse_tick |
| 3.14 | 189 | chip-tick | Arama | query_parse_tick |
| 3.32 | 200 | chip-tick | Arama | query_parse_tick |
| 3.51 | 211 | chip-tick | Arama | query_parse_tick |
| 3.72 | 224 | search-click | Arama | search_click |
| 4.15 | 250 | result-confirm | Sonuçlar | result_confirmation |
| 8.85 | 532 | verification-confirm | Okuma | verification_tick |
| 10.20 | 613 | chart-tonal-rise | Sanal Düzenleme | chart_draw |
| 10.75 | 646 | staging-swipe | Sanal Düzenleme | staging_swipe |
| 11.95 | 718 | staging-snap | Sanal Düzenleme | staging_complete |
| 14.85 | 892 | index-countup | Piyasa | data_count |
| 16.45 | 988 | data-tick | Piyasa | data_count |
| 18.70 | 1123 | sonic-logo | Kapanış | sonic_logo |

### Two cues to confirm against the picture

The export flags cues that have drifted out of the scene they read as. Neither is
changed by the exporter — the design's declared time is exported as-is.

* **`chart-tonal-rise` at 10.20 s** falls in *Sanal Düzenleme*, but the 12-month
  price line it names draws in *Okuma*, at roughly 9.0–9.55 s. Flagged in
  `review` in the JSON.
* **`verification-confirm` at 8.85 s** is in the right scene, but the check mark it
  names finishes drawing at about 7.65 s. The exporter cannot see that (the scene
  matches), so it is noted here.

Decide in the mix: move the cue to the picture, or leave it as an accent. Changing
`OM_AUDIO_MARKERS` in the design is a design edit — ask first.

## 2. Mix

* Music + SFX. **No voiceover.**
* 48 kHz throughout, stereo.
* Reference the silent master for picture; work to the exported cue times.
* Categories, character and per-cue guidance:
  [`../assets/audio/README.md`](../assets/audio/README.md).
* `staging-swipe` is 1.2 s of *movement*, not a one-shot — the divider travels
  110 → 970 px through a cosine ease.
* Nothing with unclear licensing.

Deliver a single WAV: `mix/<video-name>_48k.wav`, 48 kHz, stereo, aligned to
frame 1 with no offset.

## 3. Mux without touching the video

```sh
ffmpeg -i out/evlek_reel_v7_1080x1920_60fps_silent_master.mp4 \
       -i mix/evlek_reel_v7_48k.wav \
       -map 0:v:0 -map 1:a:0 \
       -c:v copy \
       -c:a aac -b:a 320k -ar 48000 -ac 2 \
       -movflags +faststart -shortest \
       out/evlek_reel_v7_1080x1920_60fps_master.mp4
```

`-c:v copy` is mandatory. The video stream in the output is bit-identical to the
approved master; re-encoding it discards the verified render and invalidates every
baseline.

Note the output is a **new filename**. The silent master is never overwritten.

## 4. Confirm

```sh
ffprobe -v error -show_streams -show_format -of json \
  out/evlek_reel_v7_1080x1920_60fps_master.mp4
```

Check:

* video: `h264` / `High` / `1080x1920` / `yuv420p` / `60` fps / `1293` frames /
  `21.55` s / BT.709 — identical to the silent master;
* audio: exactly one `aac` stream, 48000 Hz, 2 channels;
* `-movflags +faststart` still in effect (moov before mdat).

The video stream should hash the same as the source's. To be certain:

```sh
ffmpeg -v error -i out/evlek_reel_v7_1080x1920_60fps_silent_master.mp4 -map 0:v -f md5 -
ffmpeg -v error -i out/evlek_reel_v7_1080x1920_60fps_master.mp4        -map 0:v -f md5 -
```

Both must print the same digest. If they differ, the video was re-encoded — start
over with `-c:v copy`.

## 5. Record it

Pin the muxed master alongside the silent one:

```sh
npm run baseline:create -- --id evlek-reel-v7-master-audio \
  --video out/evlek_reel_v7_1080x1920_60fps_master.mp4
```

Keep both manifests. The silent master stays the render of record; the muxed file
is the deliverable.
