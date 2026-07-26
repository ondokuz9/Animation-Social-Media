# Audio library

Empty on purpose. No audio has been generated, downloaded or committed — nothing
enters this tree without clear licensing.

The reel's cue list is exported from the design itself:

```sh
npm run markers:export
# out/evlek_audio_markers.json
# out/evlek_audio_markers.csv
```

Cue onsets in that export come from `window.OM_AUDIO_MARKERS` in the design page.
Lengths, levels and sound choices in it are **suggestions for the mix**, labelled
as such in the JSON under `field_provenance` — the design declares onsets only.

## Layout

```
music/          the bed. One continuous piece, not stems per scene.
ui/             interface one-shots: search click, chip ticks, confirmations
transitions/    match cuts, morphs, scene changes
staging/        the before/after slider: a moving sound plus its landing
data/           counters, chart draws, verification ticks
brand/          the sonic logo
```

## Categories and what belongs in each

| sound id | folder | used at | character |
|---|---|---|---|
| `search_click` | `ui/` | the cursor presses **Ara** | short, tactile, one clear transient. Not a mouse click sample — a product tap. |
| `query_parse_tick` | `ui/` | each criterion chip and the price clause | very small tick, 80–120 ms. Vary pitch slightly per hit so five in a row do not machine-gun. |
| `result_confirmation` | `ui/` | the listing card settles | soft affirmative, no bell, no "success" jingle. |
| `card_morph` | `transitions/` | match cut, search → card, card → detail | air and movement, no whoosh cliché. Follow the on-screen direction. |
| `verification_tick` | `data/` | the verified-lister check mark draws | precise, dry, quiet. Trust, not triumph. |
| `chart_draw` | `data/` | the 12-month price line draws | a rising tonal line, 500–700 ms, matched to the draw. |
| `staging_swipe` | `staging/` | the divider travels 110 → 970 px | **1.2 s of movement**, not a one-shot. Should feel like a hand dragging. |
| `staging_complete` | `staging/` | the divider snaps home | one settle, matched to the gold confirmation ring. |
| `data_count` | `data/` | index count-up and the yield figure | granular ticks under the number, fading as it lands. |
| `sonic_logo` | `brand/` | the wordmark settles | the brand signature. Tail rings into the held CTA. |

Voice: calm, architectural, confident — the same register as the copy. No
whooshes stacked for drama, no riser into every cut, no stock "corporate uplift".

## Rules

* Nothing with unclear licensing. If provenance cannot be stated, it does not go in.
* Audio files are **not** committed (`.gitignore` excludes `*.wav`, `*.mp3`,
  `*.m4a`, `*.aif`). Keep them in shared storage and reference them from the mix
  project; commit only these notes and the marker exports.
* 48 kHz throughout, to match the delivery spec.
* Mix against the silent master; never re-encode its video stream. The mux is
  `-c:v copy` — see [`../../docs/AUDIO_WORKFLOW.md`](../../docs/AUDIO_WORKFLOW.md).
* When files arrive, list them in the template's `assets.example.json`-style
  registry so a cue maps to a file by name, not by memory.
