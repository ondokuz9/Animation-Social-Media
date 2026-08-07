---
name: evlek-reel
description: How an Evlek film is made in this repository — the two render paths, the act structure, what is locked, and the mistakes that have already been made once. Use when creating, changing, rendering or reviewing any Evlek reel, or when deciding whether a new video is a content change or a new film.
---

# Making an Evlek film

`CLAUDE.md` holds the fifteen rules. This holds the procedure and the reasons —
what to do, in what order, and what has already gone wrong.

Read `CLAUDE.md` first. When the two disagree, `CLAUDE.md` wins.

## Two render paths, both live

**`remotion/`** — where new films are made. The emlakçı reel is here:
`remotion/src/reels/emlakci/`, composition `EmlakciReel`, eight acts that each
also exist as their own composition so one can be worked on without rendering
the whole film.

**`project/` + `render/`** — the original path. HTML/JSX design sources from a
claude.ai/design handoff, driven by a deterministic Playwright frame capture.
The approved V7 brand reel (21.55s) came out of this and it still reproduces.

Both encode through **the same `render/encode.mjs`**: High profile, progressive,
yuv420p, BT.709 limited, CRF 17, preset slow, 16M/24M, faststart, silent. One
encoder for every Evlek film is the point. `remotion/encode-emlakci.mjs` imports
that encode rather than reimplementing it — a new film does the same.

**Never render with `npx remotion render` straight to MP4.** That is a second
encoder. Render the PNG sequence, then encode:

```sh
npx remotion render EmlakciReel --sequence --frames-dir remotion/out/seq
node remotion/encode-emlakci.mjs
```

## Is this a content change or a new film?

This is the first question, and getting it wrong costs a week.

**Content change** — same acts, same durations, different words, prices, photos,
locations. Edit `content.json`. Nothing else. The staging pairs must still be the
same room from the same camera. This is the intended path and it is cheap.

**New film** — different act structure, different length, a register the current
acts do not have. Branch `video/<name>`, copy the template, write new scenes.

The tell: if you find yourself wanting to add a scene, stretch an act, or make a
component take a `variant` prop, it is a new film. Do not generalise the
emlakçı acts to cover a second case. Rule 4.

## Act structure of the emlakçı film

36.000s · 2160 frames · 60 fps. Two dissolves, five hard cuts.

| # | act | s | ground | register |
|---|---|---|---|---|
| 1 | Açılış | 10.30 | navy→cream | hook, thesis, five cards |
| 2 | Yayınla | 5.00 | cream | device, macro 2.4× → wide |
| 3 | Diller | 3.20 | cream | typography only |
| 4 | Staging | 4.03 | photograph | a production line |
| 5 | Match | 3.30 | navy | a dendrite, growing |
| 6 | Arama | 3.00 | cream | full-frame interface |
| 7 | Asistan | 4.20 | navy | a foreign panel + citation |
| 8 | Kapanış | 3.20 | navy | brand plate |

The assembly rule: **no two consecutive acts share a ground colour, a camera
behaviour and a subject.** An earlier cut was one phone from one camera position
for eleven seconds — technically clean, unwatchable. Variety here is the
mechanism that holds a scrolling viewer, not decoration.

The two dissolves are earned, not stylistic. Yayınla→Diller (6 frames) because
both grounds are cream and the subject is the same sentence — the description
just written is the one about to be translated. Asistan→Kapanış (8 frames),
navy to navy, an answer settling into a name. Everything else cuts hard because
the register change is the punctuation.

Full frame-level record: `video-system/docs/EMLAKCI_REEL_v7_FINAL.md`.

## Mistakes already made once

**Frame 0 is the cover frame, and it was half a sentence.** The hook types on
line by line, so frame 0 of the emlakçı reel reads `KKTC'DE` — that is what
Instagram put in the grid. Either the hook's full first line lands on frame 0,
or a poster frame is chosen deliberately (`cuts.mjs poster --at`). Check the
first frame of every film before it ships.

**The film spent words faster than anyone reads.** A 0.4s-interval inspection of
all 83 samples of the 33s cut found 26 defects, 4 critical. The fix was three
extra seconds, all of it bought for the three places carrying text: Yayınla's
headlines, Diller's five languages, Kapanış's disclosure. If a line is on screen
under one second, it is decoration, not communication.

**An unbranded frame loses the viewer.** An agent who saw "İlan koymak değişti."
with no wordmark left the film. The wordmark is now in the hook, the thesis,
each of the five cards and the macro. A viewer entering on any frame learns the
brand without waiting.

**The read was written after the film.** That produced a 36.000s film and a
25.97s read and no way to close the gap. See `evlek-voiceover` — the script is
written to a syllable budget *before* the film is locked, or at minimum before
the read is generated.

## Order of work

1. `git checkout -b video/<name>` from current `main`. Rule 3.
2. Read `baselines/` — know which masters exist and their checksums. Rule 1.
3. Write the script to a budget: `vo-timing.mjs plan`. Do this before scenes.
4. Build scenes. Preview in Remotion Studio; do not render to judge motion.
5. Draft render for review — half height, 30 fps, CRF 23. Seconds, not minutes.
   The bottleneck on this project is review rounds, not render time.
6. Master render only after the cut is approved: sequence → `encode-emlakci.mjs`.
7. `npm run verify`, `npm run qc`, `npm run baseline:check`. Rule 9.
   `baseline:check` must report the V7 baseline untouched. If it drifts, stop
   and report — do not update the baseline to make it pass. Rule 10.
8. `npm run baseline:create` for the new master. Pin it; do not commit it.
9. Mix, cut, publish — `evlek-voiceover`, then `evlek-publish`.

## Reviewing motion

`review-animations` and `improve-animations` are installed and their bar is a
product-UI bar: sub-300ms, frequency-appropriate, `ease-in` on entry is a block.

Those rules apply to **the interface inside the film** — the phone card, the
publish button and its press feedback, the search field and chips, the assistant
panel state changes, the staging slider.

They do not apply to **the film** — act durations, camera moves, dissolves,
montage rhythm, hook typography. A 2.8% push held across a ten-second act is a
decision, not a defect. Scoping this wrong produces confident, wrong findings.
See `.agents/skills/README.md`.

## Assets and provenance

Every photograph in the emlakçı reel is AI-generated and carries a C2PA manifest
signed by Google with `digitalSourceType: trainedAlgorithmicMedia` — including
the "empty room" the film presents as the agent's own photo. That is why the
disclosure badge exists and why it stays in frame long enough to read.

New imagery gets a new filename, always. Never overwrite anything in
`project/img/` or `video-system/assets/approved/`. Rule 5.

## Licensing

Remotion is free for up to 3 people who write Remotion code or use agentic tools
on it, aggregated across contractors, clients and partner agencies on the same
project. At four it is $25 per seat per month. Nothing in the tooling enforces
this. <https://www.remotion.dev/docs/license/faq>
