# Evlek — Design System

**Evlek** is an AI-native real estate platform for North Cyprus (KKTC). It helps people find the right home through natural-language AI search and verified listings, and it strengthens listings by showing their potential (e.g. virtual staging / *sanal düzenleme*). Primary audience: home seekers and property offices in Girne, Lefkoşa and Gazimağusa. Primary language **Turkish**, with some EN / RU / DE.

Web: **evlek.app**

This design system encodes the visual language used across Evlek's Instagram carousels (1080×1350) and provides tokens, components, foundation cards and a carousel UI kit so any surface — static, animated or interactive — stays on brand.

## Sources given
- `uploads/1.png … 4.png` — earlier Instagram carousel set (feed marketing).
- `uploads/evlek_kocan_slide1–3.png` — "KKTC Mülkiyet Rehberi / Koçan nedir" carousel — the **refined, current** system (cream + navy + cobalt, mono eyebrows, single organic wave, brand lockup). This is the canonical reference the tokens and components target.
- `uploads/wordmark-black-transparent.png`, `uploads/wordmark-white-transparent.png` — the real Evlek wordmark (black for cream backgrounds, white for photos/dark). Copied to `assets/wordmark-black.png` and `assets/wordmark-white.png`.

No codebase, Figma file or font binaries were provided — the component inventory below is derived from the carousel system, not an external component library.

---

## CONTENT FUNDAMENTALS

**Voice:** calm, architectural, confident. No hype, no exclamation-marks, **no emoji**. The brand sounds like a thoughtful estate advisor, not a marketer.

- **Language:** Turkish primary. Short, declarative sentences, often fragments. Frequent full stops as rhythm: *"Bulun. Karşılaştırın. Karar verin."*
- **Person:** speaks TO the reader in the imperative/second person — *"Cümleyle ara. Doğru eve ulaş."*, *"Ev aramak değil, doğru evi bulmak."* Uses "biz" only implicitly.
- **Headline pattern:** a plain-navy phrase with **one cobalt-highlighted word or clause** carrying the emphasis — *"Emlak için **yeni** nesil dokunuş."*, *"Gerçek bilgiler. **Güvenli kararlar.**"*, *"Koçan nedir, hangisi **ne demek?**"*
- **Eyebrow labels:** short, mono, uppercase, letter-spaced — *"KKTC MÜLKİYET REHBERİ"*, *"3 KOÇAN TÜRÜ"*, *"KARAR ÖNCESİ"*.
- **Signature vocabulary:** *sanal düzenleme / virtual staging*, *yeniden hayal et*, *doğrulanmış ilanlar*, *koçan*, *akıllı arama*. Domain-accurate KKTC property terms (Türk Koçanı, Eşdeğer Koçan, Tahsis Koçanı).
- **CTA copy:** action + destination — *"Koçan bilgisi ilanlarda → evlek.app"*, *"→ evlek.app"*. Always the arrow, always the domain.
- **Legal register:** careful and plain — *"Bu içerik genel bilgilendirmedir, hukuki danışmanlık değildir."*
- **Casing:** Turkish sentence case in headlines/body; UPPERCASE only for mono eyebrows and badges. Mind Turkish dotted/dotless i.

---

## VISUAL FOUNDATIONS

**Palette — STRICT: blue + cream only.** No orange/coral, no pink/magenta, no green as a UI accent.
- Background **cream `#F4F1EB`** — nearly every slide.
- Ink / walls **navy `#14213D`** — headlines, body ink, floor-plan walls, dark badges.
- Single accent **cobalt `#2F5CFF`** — exactly one highlighted word, CTAs, plan detail lines, and the wave.
- **Light blue `#B9D0FF`** — eyebrows on dark photos, soft strokes.
- **Lavender `#D9DCEF`** — the pale under-layer of the double organic wave.
- White `#FFFFFF` — cards on cream, and all text over photos.
- Text hierarchy on cream uses navy at 100/80/64/48% opacity.

**Typography.**
- **Display — Fraunces** (serif), semibold ~600, for editorial display moments; often one *italic* word in cobalt.
- **Headlines & body — Hanken Grotesk.** Headlines weight **800**, very tight tracking (−0.02em), line-height ~1.0. Body weight **500**, line-height ~1.5. (The uploaded carousels set their big headlines in Hanken 800, not Fraunces — Fraunces is reserved for editorial accents.)
- **Labels — JetBrains Mono**, uppercase, letter-spacing 0.18em: eyebrows, page numbers (`1 / 3`), badges.

**Signature elements.**
- **Eyebrow** = a short cobalt line (52×3px) + mono uppercase label, OR a standalone mono label in cobalt.
- **Organic wave** — a single cobalt wave (with a lavender under-wave) rising from the bottom edge. Used ONLY on cover and closing slides, never every slide.
- **Brand lockup**, bottom-left: the real Evlek wordmark (black on cream, white on photo) + an outlined transparent **"evlek.app" pill**.
- **Page number**, top-right, mono: `1 / 3`.
- **Floor-plan motif** — minimal single-rectangle room: navy walls, cobalt furniture lines, window as a double line, door as a quarter-arc. Used to show "same plan, different styles" (virtual staging).

**Layout.** Generous 76px side margins, lots of negative space, strong left-alignment. Content hangs from the top; wave/lockup anchor the bottom.

**Backgrounds.** Flat cream is the default (no gradients, no texture, no grain on the base). Photo slides are full-bleed architectural imagery with a **navy gradient scrim** (darker at top and bottom) and white text. Imagery is cool-neutral, crisp, contemporary architecture — never warm/sepia.

**Cards.** White fill, large radius (~28px), very soft shadow (`0 18px 48px rgba(20,33,61,.08)`); optionally a hairline. No colored left-border accents. Badges are pills — cobalt (fill, white text) or navy (fill, white/blue text), mono uppercase.

**Buttons / CTA.** Cobalt pill, white bold Hanken text, trailing arrow — `→ evlek.app`. Hover darkens cobalt to `#2247D6`; press shrinks slightly. Outlined pill variant (transparent fill, cobalt/navy border) for the evlek.app lockup chip.

**Motion (editorial, subtle — respect `prefers-reduced-motion`).** Reveal order: headline first → eyebrow line draws in → photo fades/scales up → floor-plan furniture lines draw on stroke-by-stroke → wave rises from the bottom. Easing `cubic-bezier(0.22,1,0.36,1)`, ~640ms reveals. No bounce, no flashy transitions.

**Radii & borders.** Pills fully round (999px); cards 28px; small chips 12px. Borders are navy at low opacity (hairlines), used sparingly.

---

## ICONOGRAPHY

Evlek's carousels use a **thin-line, rounded outline icon** style (search magnifier, shield, people, trend arrow, globe, checkmarks) in navy on cream — consistent with a Lucide/Feather-weight set. No filled icon system, no emoji, no unicode dingbats. The globe in the evlek.app pill and the arrow `→` in CTAs are the two recurring glyphs.

Since no icon assets were provided in the sources, this system links **[Lucide](https://lucide.dev)** from CDN as the closest match (same 2px rounded-stroke outline style) — used at ~2px stroke, navy or currentColor. **Substitution flagged:** if Evlek maintains its own icon set, supply the SVGs and we'll swap Lucide out. The arrow in CTAs is the literal character `→` set in Hanken/Mono, not an icon.

---

## Fonts

Fraunces, Hanken Grotesk and JetBrains Mono are all genuine Google Fonts and are loaded from the Google Fonts CDN (`tokens/fonts.css`). No local binaries were shipped; if you need offline/self-hosted fonts, download these three families and add local `@font-face` rules. **No substitution** — these are the real families named in the brief.

---

## Index / manifest

- `styles.css` — entry point; `@import`s the four token files.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`.
- `assets/` — `wordmark-black.png`, `wordmark-white.png`.
- `thumbnail.html` — homepage tile.
- **Foundations cards** — `foundations/*.html` (Colors, Type, Spacing, Brand groups).
- **Components** — `components/` (see below). Namespace: `window.EvlekDesignSystem_4d45ee`.
- **UI kit** — `ui_kits/carousel/` — sample 1080×1350 carousel slides.
- `SKILL.md` — Agent-Skill wrapper.

### Components
- `components/brand/BrandLockup` — bottom-left wordmark + evlek.app pill.
- `components/brand/PageNumber` — mono `1 / 3` top-right marker.
- `components/brand/Wave` — signature cobalt+lavender bottom wave.
- `components/brand/Eyebrow` — cobalt line + mono uppercase label.
- `components/core/Button` — cobalt CTA pill (+ outline/ghost variants).
- `components/core/Badge` — mono uppercase pill (cobalt / navy).
- `components/core/Card` — white rounded koçan card.
- `components/patterns/FloorPlan` — minimal single-room plan motif.

### UI kit — carousel
Sample slides: cover (wave + feature row), photo scrim slide, koçan-type cards slide, numbered-steps CTA closing slide.
