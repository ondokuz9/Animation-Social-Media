---
name: evlek-publish
description: Turn a mixed Evlek master into the files each platform needs, and publish them. Covers platform cuts, the cover frame, Instagram and LinkedIn specifics, captions, and measurement. Use when a film is finished and needs to reach Instagram, LinkedIn, TikTok, WhatsApp or evlek.app.
---

# Publishing

Nothing that ships is the master. The master is 1080×1920, 60 fps, CRF 17,
silent. Every platform wants something else, and the emlakçı reel's first
publish had all of them cut by hand.

```sh
node video-system/tools/cuts.mjs mix      <master.mp4> <read.mp3>   # do this first
node video-system/tools/cuts.mjs poster   <mixed.mp4> --at 5.2
node video-system/tools/cuts.mjs web      <mixed.mp4>
node video-system/tools/cuts.mjs social   <mixed.mp4>               # 4:5, LinkedIn
node video-system/tools/cuts.mjs whatsapp <mixed.mp4>
node video-system/tools/cuts.mjs segments <mixed.mp4> --cut 0:1.8,3.3:5.4,…
```

Everything lands in `out/cuts/`, which is gitignored. Pin what actually shipped
in `baselines/`. Rule 12.

## The cover frame is the highest-leverage decision

The hook types itself on. Frame 0 of the emlakçı reel reads `KKTC'DE` — half a
sentence — and Instagram used it in the grid until it was overridden. **Never
accept the default cover.**

Pick a frame that reads as a complete thought at thumbnail size. For the emlakçı
reel that is ~5.2s: cream ground, "İlan koymak değişti." and the 01–05 list, the
whole story in one still. Export it with `cuts.mjs poster` and upload it as a
custom cover on both Instagram and LinkedIn.

## Length decides reach

2026 Instagram data, by watch ratio: **under 15s → 66.9%**, 15–30s → 31.6%,
30–60s → 20.3%. A 15-second cut of the same film gets roughly three times the
completion of the 36-second one.

So ship two: the full film for warm audiences (WhatsApp, direct sends, the site,
YouTube Shorts) and a hook cut for cold ones (Reels, TikTok). The hook cut is
built with `cuts.mjs segments` from the master — no re-render — and needs its own
read, written to its own budget.

## Instagram

Hashtags are **capped at 5** since December 2025. Thirty tags is not just
ineffective, it is not possible. Caption keywords now matter more than tags —
Instagram's search indexes caption text, so write the words a KKTC agent would
actually type into the phrases of the caption.

First ~125 characters show before "more". Put the audience and the promise there;
everything else is below the fold.

Settings that are not defaults and matter:

- **Custom cover** (above) — the single biggest one
- Upload at highest quality: Settings → Data usage and media quality
- Location: Girne. In a market this small, geography is most of the targeting
- Alt text, written by hand
- Recommend on Facebook: on. KKTC agents are still there
- A pinned first comment with the link — the caption cannot carry one

## LinkedIn

Different audience: agency owners, developers, investors, proptech — not agents.
Founder voice, insight first, product second. An ad reads as an ad here.

- **Link goes in the first comment, not the body.** 2026 engagement by format:
  documents 7.00%, multi-image 6.45%, video 6.00%, text 4.50%, **link posts
  3.25%**. A link in the body roughly halves distribution.
- Post from the personal profile. Reshare from the company page hours later.
- LinkedIn autoplays muted — captions are not optional. Turn on auto-captions and
  fix them by hand; Turkish transcription mangles "Evlek".
- 4:5 (`cuts.mjs social`) fills more of the feed than 9:16. Check the lower third
  survives the crop — the language row and the disclosure badge sit low.
- Do not edit the post in the first hour.
- Document/carousel is the highest-engagement format on the platform. The same
  film's key frames as a PDF carousel is a second post from the same work.

## The site

Do not embed the Instagram blockquote. It loads third-party JavaScript, sets Meta
cookies, pulls the visitor back to Instagram, and — the part that matters for
Evlek specifically — makes the video *Instagram's* content in the eyes of search
and language models. A film whose whole argument is "be visible to AI search"
should not be published in a way that gives the visibility to someone else.

Self-host instead: `cuts.mjs web`, a `<video>` with `preload="none"` and the
poster, a `VideoObject` JSON-LD block, and **the transcript as visible text on
the page**. Crawlers and language models read the transcript; they do not watch
the video.

The traffic from these posts should land on an agent-facing page, not evlek.app's
home page — the home page is a buyer-facing search product and an agent who lands
there bounces.

## Measurement

Every destination gets its own UTM: `?utm_source=ig&utm_campaign=<film>`,
`utm_source=li`, and so on. Views are not the metric. **Agents who sign up** is
the metric.

Ship 3–4 variants of the first two seconds against the same body, publish them
the same day, and scale the one that holds after 72 hours. Guessing the hook is
the most expensive habit available.

## Before you publish, check

- [ ] The mixed master has an audio stream. The silent master looks identical.
- [ ] Frame 0 reads as a whole sentence, or a custom cover is set.
- [ ] The read does not overrun the film — the last line is not clipped.
- [ ] Captions exist for the muted platforms.
- [ ] The AI-visualisation disclosure is legible and in frame long enough to read.
- [ ] Links carry UTMs and point at the agent page, not the home page.
- [ ] The published file is pinned in `baselines/`.
