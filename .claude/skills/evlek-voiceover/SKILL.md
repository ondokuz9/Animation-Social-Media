---
name: evlek-voiceover
description: Write, generate, verify and mux Turkish voiceover for an Evlek film. Covers the syllable budget model, ElevenLabs settings and audio tags, alignment checking and the mux rule. Use whenever a film needs narration, a script needs to fit a duration, or a read comes back the wrong length.
---

# Voiceover

Text-to-speech has no duration control. You write, you generate, and it is
however long it is. The only lever is the script, so the script gets written to
a budget before anything is generated.

## The model

Turkish syllable count is exact: one vowel, one syllable, no diphthongs. A voice
at a fixed speed reads at a stable rate. Two numbers describe a read:

```
duration ≈ syllables / ART + lines × GAP

ART   syllables per second of actual speech
GAP   seconds of silence the model inserts per paragraph break
```

Measured for **ElevenLabs v3, voice "Cicek", speed 100**: `ART 5.73`, `GAP 0.42`.
These are in `video-system/scripts/emlakci-reel.vo.json` and are wrong for any
other voice, model or speed.

**GAP is the term that catches people.** Merging two paragraphs does not shorten
the words, it removes a pause. On a sixteen-line script, collapsing to eight
paragraphs takes 3.4 seconds off the read with no edit to the text. When a read
comes back short, check the paragraph structure before touching the words.

## Tools

```sh
node video-system/tools/vo-timing.mjs plan      <script.vo.json>
node video-system/tools/vo-timing.mjs measure   <script.vo.json> <read.mp3>
node video-system/tools/vo-timing.mjs calibrate <script.vo.json> <read.mp3>
```

`plan` predicts the read before it is generated and reports headroom against the
film. `measure` compares a finished read to the plan line by line and prints the
mux command. `calibrate` re-derives ART and GAP — run it whenever the voice,
model or speed changes, and paste the result into the script's `voice` block.

Script format: `video-system/scripts/<name>.vo.json`. See the emlakçı one.

## Writing to the budget

Target **80–90% fill**. Below 80% the film feels underwritten; above 90% the
lines run into the cuts and there is no room for the read to come back long.

Silence is a tool. Leave a line unwritten where the screen already carries the
message — Kapanış says "Sen yayınla. Gerisi Evlek'te." on screen; the read does
not need to say it too. A beat of silence over a strong frame reads as
confidence.

The read should say what the screen does not. If the header says
"Açıklamayı Evlek yazdı." and the read says the same thing, one of them is dead
air. Screen carries the function; read carries the consequence.

## ElevenLabs

Model v3. Settings that produced the current reads: speed 100, stability 50,
similarity 75.

**Stability must sit in Creative or Natural.** Robust deliberately under-responds
to directional prompts — the audio tags go in and the delivery comes out flat.
If tags are not landing, check this first.

Tags mark the turns; they do not go on every line. Tagging all sixteen lines
makes the read jump, because the model re-establishes the emotion at each tag.
An untagged line inherits the one before it, which is what produces flow. Around
half tagged is right.

Tags in use, with what they are for:

| tag | where |
|---|---|
| `[excited]` | the hook, and the one lift before the close |
| `[confident]` | claims — these should sound like evidence, not enthusiasm |
| `[determined]` | a list being executed |
| `[energetic]` | a number |
| `[warm]` | benefit and close — this is where trust is sold |
| `[thoughtful]` | a qualification, a limit, a piece of reassurance |
| `[emphatic]` | the two or three lines the whole film is built around |
| `[curious]` | the turn, where the subject changes |

Punctuation is the other lever, and a more reliable one. An em dash is a beat. A
full stop is roughly 0.25s, a comma roughly 0.15s. A single word in caps stresses
it, but Turkish TTS sometimes spells capitalised words letter by letter — use it
on one word at a time and listen.

## Verifying a read

```sh
node video-system/tools/vo-timing.mjs measure video-system/scripts/<name>.vo.json read.mp3
```

Block count must match line count. If it does not, the model merged or split
paragraphs and the per-line comparison is meaningless — fix the blank lines and
regenerate before reading anything else in the output.

Per-line drift under 0.3s is fine. Above that, shorten the line *before* the one
that drifted; a late line is almost always caused by the one preceding it running
long.

If the whole read overruns the film, do not raise the speed. A rushed read is
worse than a short one. Merge two paragraphs (buys ~0.42s each) or cut a line.

## Muxing

```sh
node video-system/tools/cuts.mjs mix <silent-master.mp4> <read.mp3>
```

That runs `-c:v copy` and normalises the audio to −14 LUFS / −1 dBTP. **The video
stream is never re-encoded.** Re-encoding a mixed master invalidates the golden
baseline (rules 6 and 14), and every platform cut is made from the mixed master,
so a mistake here propagates to everything that ships.

Pin the mixed master with `npm run baseline:create` after mixing. The silent
master is pinned; the file that actually got published should be too, or in six
months there is no way to prove which one it was.

## What is still missing

**Music and sound design.** `video-system/assets/audio/` is empty on purpose —
nothing enters without clear licensing. `npm run markers:export` produces the cue
list (onsets are authored by the design; lengths and levels in the export are
suggestions for the mix, not timings). No bed and no UI one-shots have been made.
A motion-graphics film carrying only a voiceover sounds like a document being
read aloud; this is the single largest remaining quality gap.

**Captions.** No VTT or SRT pipeline. Reels and LinkedIn autoplay muted. The
`remotion-captions` skill is installed and is where this starts.
