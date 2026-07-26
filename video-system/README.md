# Evlek video system — v1.0.0

A reusable way to produce Evlek reels at the quality of the approved V7 master:
the same design template, the same deterministic renderer, the same encode
settings, the same checks — with content in a manifest instead of in the code.

Nothing in here re-implements the renderer. `render/` at the repository root is
the verified renderer that produced the approved master; this directory adds the
template, the content schema, the asset libraries and the documentation around it.

## What is where

```
video-system/
  VERSION                       this system's version (semver)
  README.md                     you are here
  templates/
    brand-reel-v7/              the reusable reel: 1080×1920, 21.55 s, 7 scenes
      project/                  design sources (byte-identical copy of ../../project)
      content.json              the active content manifest
      content.example.json      the schema, annotated, with placeholders
      assets.example.json       asset registry example (provenance, approvals)
      apply-content.mjs         inlines content.json into the design page
      README.md                 how this template is put together
  assets/
    brand/                      wordmarks, logo lockups
    approved/                   cleared photography, append-only
    audio/                      music and SFX libraries, by category
  docs/
    CREATE_NEW_REEL.md          the workflow, start to finish
    RENDER_AND_QC.md            what each check proves, and how to read a failure
    AUDIO_WORKFLOW.md           markers → mix → mux without re-encoding video
    DO_NOT_BREAK.md             the load-bearing details, and why
  baselines/README.md           pointer: baselines live at the repository root
  render/README.md              pointer: the renderer lives at the repository root
```

`render/` and `baselines/` were deliberately **not** moved under this directory.
The renderer is verified working code with a rendered-and-checked master behind
it; relocating it would change import paths, the manifest paths recorded in
`baselines/evlek-reel-v7-master.json`, and every documented command, for no gain.
The two pointer READMEs say where they are.

## The approved reel

| | |
|---|---|
| Master | `out/evlek_reel_v7_1080x1920_60fps_silent_master.mp4` (not in git) |
| sha256 | `3c22d5a3b6483127e3ca871d915453c5a17f844be0776387d46381950603ff71` |
| Format | 1080×1920 · 60 fps · 1293 frames · 21.55 s · H.264 High L4.2 · yuv420p · BT.709 · silent |
| Baseline | `baselines/evlek-reel-v7-master.json` + eleven checkpoint snapshots |
| Renderer | `render/`, deterministic: same frame index always produces the same pixels |

## Making the next reel

```sh
git checkout main && git pull
git checkout -b video/<name>
cp -a video-system/templates/brand-reel-v7 video-system/templates/<name>
# edit templates/<name>/content.json — copy, prices, locations, asset paths
npm run render:template -- --template video-system/templates/<name> --label <name>
```

Full workflow, including the audio mux and the platform cuts:
[`docs/CREATE_NEW_REEL.md`](docs/CREATE_NEW_REEL.md).

Before you touch anything under `render/`, read
[`docs/DO_NOT_BREAK.md`](docs/DO_NOT_BREAK.md). The rules that apply to every
change are in `CLAUDE.md` / `AGENTS.md` at the repository root.

## Scene structure of brand-reel-v7

| # | scene | duration | starts at |
|---|---|---|---|
| 1 | Kanca — harbour hook → living room | 2.10 s | 0.00 |
| 2 | Arama — natural-language search | 1.85 s | 2.10 |
| 3 | Sonuçlar — listing card + stack | 2.50 s | 3.95 |
| 4 | Okuma — detail, verification, market read | 3.30 s | 6.45 |
| 5 | Sanal Düzenleme — before/after slider | 4.00 s | 9.75 |
| 6 | Piyasa — index and yield | 4.30 s | 13.75 |
| 7 | Kapanış — wordmark, tagline, CTA | 3.50 s | 18.05 |

Durations live in `window.OM_SCENES` in the design page, and the renderer reads
the total from the Stage — never from a constant. Changing a duration changes the
frame count and invalidates the baseline; it needs explicit approval and a new
baseline.
