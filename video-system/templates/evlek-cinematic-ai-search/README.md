# Reel: evlek-cinematic-ai-search

The cinematic Evlek AI-search reel. 1080×1920 · 60 fps · 21.55 s · 1293
frames · 7 scenes. It is an isolated copy of `brand-reel-v7`: the approved
template and renderer remain untouched.

The reel keeps V7's product-story structure and adds a living photographic
backdrop to the search experience, deeper spatial lighting, and a kinetic
brand-field closing scene.

```
evlek-cinematic-ai-search/
  project/                    the design, byte-identical to the repo's project/
    Evlek Reel v7.dc.html     scene list, audio markers, inlined content manifest
    evlek-reel-v7.jsx         the seven scenes; reads content through CP/LI/AS
    animations-v2.jsx         Stage / SceneStage / useScene — the timeline engine
    tweaks-panel.jsx          authoring panel (hidden during capture)
    support.js                Claude Design runtime (x-dc / x-import)
    evlek.css                 brand tokens + base64 Hanken, Fraunces, JetBrains Mono
    img/                      the reel's photography and wordmark
    _ds/                      the Evlek design system bundle
  content.json                the active content manifest
  content.example.json        the annotated schema
  assets.example.json         asset registry: provenance and approvals
  apply-content.mjs           inlines content.json into the design page
```

## How content reaches the design

`evlek-reel-v7.jsx` never contains a string you would want to change per reel.
It reads through three accessors, each falling back to the approved V7 value:

```js
CP('results', 'Evlek bulur.')          // content.copy.results
LI('price', '£165.000')                // content.listing.price
AS('hook_image', 'img/hook-...jpg')    // content.assets.hook_image
```

`apply-content.mjs` writes `content.json` into the page's `<helmet>` as
`window.EVLEK_CONTENT`, next to the existing `OM_SCENES` and `OM_AUDIO_MARKERS`
declarations. It is inlined rather than fetched on purpose: the reel must stay a
pure function of `t`, and a runtime fetch would make the first frames depend on
when a response arrived. `npm run render:template` runs it before capturing, so
the page can never drift from the manifest.

A missing manifest is not an error — every accessor falls back, so the approved
reel still renders.

## Two things the manifest does not control

**Scene durations and order** live in `window.OM_SCENES` in the design page. The
renderer reads the total from the Stage, never from a constant, so editing that
list is how you change timing — and it changes the frame count, which invalidates
the baseline. It needs explicit approval and a new baseline.

**Layout and motion** — card sizes, positions, easing, the slider curve, the
morphs — are in the JSX. A new reel with different framing is a design change,
not a content change. Ask first.

## Text nodes are load-bearing

Two fields that read as one line on screen are built as a single interpolated
string:

```js
{`${LI('location', 'Girne · Zeytinlik')} · ${LI('type', '2+1')}`}
```

not as `{LI('location')} · {LI('type')}`. Splitting one text node into three
changes how the line is shaped: it moved 48 pixels by up to 39 levels in the
detail scene and broke byte-identity against the baseline. If you add a field to
an existing line, keep the line one string.

## Verification

Render this reel independently:

```sh
npm run render:template -- \
  --template ../video-system/templates/evlek-cinematic-ai-search \
  --label evlek-cinematic-ai-search
```

Then run `npm run baseline:check` against the original V7 source. The new reel
is expected to differ visually; the approved V7 baseline is expected to remain
unchanged.
