# Agent skills — what is installed and how it applies here

Installed with `npx skills add`. Skills live in `.claude/skills/` and are symlinked
into `.claude/skills/` for Claude Code. Other agents (Codex, Cursor, Cline, Amp)
read `.agents/` directly.

| source | skills | licence |
|---|---|---|
| [`remotion-dev/skills`](https://github.com/remotion-dev/skills) | the 12 `remotion-*` skills | part of the Remotion repo, installed via the sanctioned installer, not vendored |
| [`emilkowalski/skills`](https://github.com/emilkowalski/skills) | `animate`, `review-animations`, `improve-animations`, `animation-vocabulary`, `find-animation-opportunities`, `emil-design-eng`, `apple-design`, `prototype`, `pick-ui-library` | MIT — `_vendor/LICENSE-emilkowalski-skills.txt` |
| [`MengTo/Skills`](https://github.com/MengTo/Skills) | `elevenlabs-tts`, `video-to-superprompt`, `optimize-web-animations`, `staggered-word-reveal`, `masked-reveal`, `animation-systems` | MIT — `_vendor/LICENSE-MengTo-Skills.txt` |

Only six of MengTo's 118 skills are here. The rest are web-design and
game-development skills with no bearing on this repository.

---

## Two overrides. These win over the skill text.

### 1. `remotion-render` must not be followed literally

The skill says to render with `npx remotion render`. **Do not.** That produces its
own encode with its own parameters, and the whole point of this repository is that
every Evlek film comes out of one ffmpeg invocation.

The pipeline here is:

```
remotion render <composition> --sequence   →  PNG sequence
node remotion/encode-emlakci.mjs           →  render/encode.mjs → master
```

`render/encode.mjs` is shared with the approved V7 pipeline: High profile,
progressive, yuv420p, BT.709 limited range, CRF 17, preset slow, 16M/24M,
faststart, no audio. A second set of encode arguments is a second thing that can
drift — see `CLAUDE.md` rules 6, 7 and 14.

Use `remotion-render` for what it is good at: understanding CLI flags,
concurrency, still frames, and how the sequence output is named.

### 2. `review-animations` applies to the interface, not to the film

Emil's bar is built for **product UI**: sub-300ms, frequency-appropriate motion,
no animation on actions seen a hundred times a day, `ease-in` on entry is a block.
Those rules are right — for a button.

They are wrong for a film. A 2.8% continuous push held across a ten-second act is
correct here. A 3.2-second language sequence is correct here. Feeding the whole
composition to `review-animations` will generate confident, wrong findings.

**Where it applies:** the interface moments inside the film — the phone card, the
publish button and its press feedback, the search field and chips, the assistant
panel's state changes, the staging slider. Those are UI and the standards hold.

**Where it does not:** act durations, camera moves, dissolves, the montage rhythm,
the hook typography. Those are film decisions and belong to
`video-system/docs/EMLAKCI_REEL_v7_FINAL.md` and the frame-inspection process.

---

## Which skill for which job

| job | skill |
|---|---|
| writing or changing a scene component | `remotion-markup` |
| a new composition or reel | `remotion-create`, then the template copy flow in `CREATE_NEW_REEL.md` |
| looking up a Remotion API | `remotion-docs` — cheaper and more accurate than guessing |
| subtitles / VTT / SRT | `remotion-captions` — this repository has no caption pipeline yet |
| previewing while iterating | `remotion-studio` |
| judging a UI moment inside a film | `review-animations` (scope above) |
| fixing an easing curve or duration | `animate` |
| a sweep for motion defects across scenes | `improve-animations` (scope above) |
| briefing motion precisely instead of "make it smoother" | `animation-vocabulary` — read this yourself, not just the agent |
| voiceover generation and reuse | `elevenlabs-tts` |
| turning a reference video into a brief | `video-to-superprompt` |
| word-by-word reveals, masked text | `staggered-word-reveal`, `masked-reveal` |

---

## Remotion licensing — check this before the team grows

Remotion is free for a for-profit company with **up to 3 people who write Remotion
code or use agentic coding tools on it**. Headcount aggregates across entities:
contractors, clients and partner agencies working on the same project count.

At four, a Company License is required — Remotion for Creators is $25 per seat per
month. This is a real obligation, not a nag screen; there is nothing in the tooling
that will stop you.

<https://www.remotion.dev/docs/license/faq>

---

## Updating

```sh
npx skills add remotion-dev/skills     # re-run to pull newer versions
npx skills add emilkowalski/skills
```

The MengTo skills were copied by hand and do not update. Re-copy from
`MengTo/Skills` if you want a newer version, and keep the licence file with them.

Skills run with full agent permissions. Read a skill before trusting it.
