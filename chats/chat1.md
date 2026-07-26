# Evlek tanıtım reeli

_Started 2026-07-25 20:32 UTC_

---

## User

# Evlek — Tanıtım Reel'i · 1080×1920 · 30fps · 20.0 sn (600 kare)

## TEKNİK KURALLAR — pazarlık dışı
- Tüm animasyon tek bir zaman değişkeninin SAF FONKSİYONU olsun: render(t), t = 0…20 sn.
  Aynı t her zaman birebir aynı kareyi üretmeli.
- CSS `animation` / `transition` KULLANMA. `requestAnimationFrame` sayacı, `Date.now()`,
  `setInterval` KULLANMA. Animation template'inin Stage/timeline yapısını kullan.
- Dış çağrı YOK. Fontlar evlek.css'ten gelir (base64 gömülü). Görseller `img/` göreli yolundan.
- `<video>` elementi YOK. Hareket yalnızca transform + opacity.
- 19.0–20.0 arası TAM SABİT kare (seslendirme kuyruğu için).
- prefers-reduced-motion desteklensin.

## MARKA
evlek.css yüklü. Token: --krem #F4F1EB · --navy #14213D · --kobalt #2F5CFF
Tip: --display Fraunces 700 · --baslik Hanken Grotesk 800 · --mono JetBrains Mono 500
Coral/turuncu YOK. Emoji YOK. Rakam olarak istatistik/ilan sayısı YAZMA.
Hiçbir dış platform, rakip veya AI ürün adı yazma; hiçbir bilinen sohbet
arayüzünü (balon düzeni, yıldız ikonu vb.) taklit etme.

## ZAMAN ÇİZELGESİ

### A · ODA DÖNÜŞÜMÜ — 0.0–5.0
Kareler: img/room-00-bos.jpg → room-01-akdeniz.jpg → room-02-minimal.jpg → room-03-dogal.jpg
- Kesintisiz yavaş push-in TÜM A boyunca akar: ölçek 1.00→1.07, odak noktası
  sağdaki kemerli pencereye doğru hafif kayar. Kareler değişir, hareket durmaz.
- Geçişler 1.4 / 2.6 / 3.8'de. Her geçiş 0.25 sn DİKEY WIPE (üstten aşağı),
  yumuşak kenar ~40px. Kesme değil, wipe.
- Sol üst (0.3'te girer, A boyunca kalır): mono "BU ODA BOŞTU", krem %85
- Sağ alt (yalnızca 1.4'ten sonra): .rozet "YZ İLE DÜZENLENDİ · TEMSİLÎ"
- Alt bant mono, geçişlerle değişir: "AKDENİZ" → "MİNİMALİST" → "DOĞAL"

### B · YENİ ÇAĞ — 5.0–7.6
5.0'da navy blok alttan yükselip odayı örter (0.4 sn).
Merkez, Hanken 800, krem, iki satır:
  "Kuzey Kıbrıs'ta
   ev aramak değişti."
"değişti" kobalt.
5.8'de altında mono satır, öğeler tek tek girer:
  "İNCELENMİŞ İLANLAR · 6 ŞEHİR · 5 DİL"

### C · SORU — 7.6–10.4
Navy devam. Merkezde mono kursör, 7.8–9.4 arası harf harf yazılır:
  "Girne'de deniz gören, Türk koçanlı 2+1"
9.6'da altında liste DEĞİL — tek bir cevap bloğu belirir (opacity + 20px yukarı kayma).

### D · KAYNAK — 10.4–14.0
Cevap bloğu: krem zeminli kart, 24px yuvarlatma, içinde 3 satır NÖTR İSKELET ÇİZGİ
(gerçek cümle yazma; bu bir arayüz taklidi değil, soyut bir cevap temsili).
11.2'de kartın altında kobalt ince çizgi + mono: "KAYNAK: EVLEK.APP"
Bu satır belirirken kartta hafif ölçek nabzı: 1.00→1.03→1.00, 0.4 sn.

### E · VERİ KATMANI — 14.0–17.0
Kartın çevresine dört mono etiket 0.25 sn arayla oturur (alttan 12px kayarak,
kobalt ince çerçeveli):
  "KOÇAN" · "FİYAT GEÇMİŞİ" · "ONAYLI EMLAKÇI" · "5 DİL"

### F · KAPANIŞ — 17.0–20.0
17.0: navy yukarı çekilir, krem'e geçiş (0.5 sn).
17.2–18.2: alt kenardan çift katmanlı organik dalga yükselir
  (arka katman navy %10 opaklık, öndeki dolu navy — hafif faz farkıyla).
Merkez: img/wordmark.png, genişlik ~420px.
Altında Hanken italic %70 opaklık: "Yeni çağa göre kurulmuş."
En altta mono: "evlek.app"
19.0–20.0 tam sabit.

## RİTİM
A görsel ve hızlı · B–E bilgi yoğun ama sakin · F nefes.
Hiçbir yerde 2 sn'den uzun hareketsizlik olmasın — B ve C'de zeminde
çok yavaş bir ölçek sürsün (1.00→1.02).

## User

# Evlek — Tanıtım Reel'i · 1080×1920 · 30fps · 20.0 sn (600 kare)

## TEKNİK KURALLAR — pazarlık dışı
- Tüm animasyon tek bir zaman değişkeninin SAF FONKSİYONU olsun: render(t), t = 0…20 sn.
  Aynı t her zaman birebir aynı kareyi üretmeli.
- CSS `animation` / `transition` KULLANMA. `requestAnimationFrame` sayacı, `Date.now()`,
  `setInterval` KULLANMA. Animation template'inin Stage/timeline yapısını kullan.
- Dış çağrı YOK. Fontlar evlek.css'ten gelir (base64 gömülü). Görseller `img/` göreli yolundan.
- `<video>` elementi YOK. Hareket yalnızca transform + opacity.
- 19.0–20.0 arası TAM SABİT kare (seslendirme kuyruğu için).
- prefers-reduced-motion desteklensin.

## MARKA
evlek.css yüklü. Token: --krem #F4F1EB · --navy #14213D · --kobalt #2F5CFF
Tip: --display Fraunces 700 · --baslik Hanken Grotesk 800 · --mono JetBrains Mono 500
Coral/turuncu YOK. Emoji YOK. Rakam olarak istatistik/ilan sayısı YAZMA.
Hiçbir dış platform, rakip veya AI ürün adı yazma; hiçbir bilinen sohbet
arayüzünü (balon düzeni, yıldız ikonu vb.) taklit etme.

## ZAMAN ÇİZELGESİ

### A · ODA DÖNÜŞÜMÜ — 0.0–5.0
Kareler: img/room-00-bos.jpg → room-01-akdeniz.jpg → room-02-minimal.jpg → room-03-dogal.jpg
- Kesintisiz yavaş push-in TÜM A boyunca akar: ölçek 1.00→1.07, odak noktası
  sağdaki kemerli pencereye doğru hafif kayar. Kareler değişir, hareket durmaz.
- Geçişler 1.4 / 2.6 / 3.8'de. Her geçiş 0.25 sn DİKEY WIPE (üstten aşağı),
  yumuşak kenar ~40px. Kesme değil, wipe.
- Sol üst (0.3'te girer, A boyunca kalır): mono "BU ODA BOŞTU", krem %85
- Sağ alt (yalnızca 1.4'ten sonra): .rozet "YZ İLE DÜZENLENDİ · TEMSİLÎ"
- Alt bant mono, geçişlerle değişir: "AKDENİZ" → "MİNİMALİST" → "DOĞAL"

### B · YENİ ÇAĞ — 5.0–7.6
5.0'da navy blok alttan yükselip odayı örter (0.4 sn).
Merkez, Hanken 800, krem, iki satır:
  "Kuzey Kıbrıs'ta
   ev aramak değişti."
"değişti" kobalt.
5.8'de altında mono satır, öğeler tek tek girer:
  "İNCELENMİŞ İLANLAR · 6 ŞEHİR · 5 DİL"

### C · SORU — 7.6–10.4
Navy devam. Merkezde mono kursör, 7.8–9.4 arası harf harf yazılır:
  "Girne'de deniz gören, Türk koçanlı 2+1"
9.6'da altında liste DEĞİL — tek bir cevap bloğu belirir (opacity + 20px yukarı kayma).

### D · KAYNAK — 10.4–14.0
Cevap bloğu: krem zeminli kart, 24px yuvarlatma, içinde 3 satır NÖTR İSKELET ÇİZGİ
(gerçek cümle yazma; bu bir arayüz taklidi değil, soyut bir cevap temsili).
11.2'de kartın altında kobalt ince çizgi + mono: "KAYNAK: EVLEK.APP"
Bu satır belirirken kartta hafif ölçek nabzı: 1.00→1.03→1.00, 0.4 sn.

### E · VERİ KATMANI — 14.0–17.0
Kartın çevresine dört mono etiket 0.25 sn arayla oturur (alttan 12px kayarak,
kobalt ince çerçeveli):
  "KOÇAN" · "FİYAT GEÇMİŞİ" · "ONAYLI EMLAKÇI" · "5 DİL"

### F · KAPANIŞ — 17.0–20.0
17.0: navy yukarı çekilir, krem'e geçiş (0.5 sn).
17.2–18.2: alt kenardan çift katmanlı organik dalga yükselir
  (arka katman navy %10 opaklık, öndeki dolu navy — hafif faz farkıyla).
Merkez: img/wordmark.png, genişlik ~420px.
Altında Hanken italic %70 opaklık: "Yeni çağa göre kurulmuş."
En altta mono: "evlek.app"
19.0–20.0 tam sabit.

## RİTİM
A görsel ve hızlı · B–E bilgi yoğun ama sakin · F nefes.
Hiçbir yerde 2 sn'den uzun hareketsizlik olmasın — B ve C'de zeminde
çok yavaş bir ölçek sürsün (1.00→1.02).

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: copy_starter_component]_

_[tool: copy_files]_

_[tool: copy_starter_component]_

_[tool: grep]_

_[tool: write_file]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: ready_for_verification]_

Reel hazır, inceleme için açıldı — 6 sahne (Oda dönüşümü → Yeni çağ → Soru → Kaynak → Veri katmanı → Kapanış), 20.0 sn, 1080×1920, tümü tek `t`'nin saf fonksiyonu; 19–20 sn sabit kare. Zamanlamayı alttaki timeline'dan sahne sahne uzatıp kısaltabilirsin; export Share → Export → Video.

Not: `kiyi.jpg` kullanılmadı (zaman çizelgesinde yoktu; OKUBENI'deki Girne uyarısıyla da uyumlu).

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Evlek tanıtım reeli"
User is viewing file: Evlek Reel.dc.html
Current date is now July 26, 2026
</system-info>

<pasted_text name="Pasted text (71 lines)">
Reel'i bu kurguya göre yeniden yapılandır. 1080×1920 · 30fps · 19.0 sn (570 kare).
Tüm animasyon tek t değişkeninin saf fonksiyonu (0…19). CSS animation/transition,
rAF sayacı, Date.now() YOK. Dış çağrı YOK. 18.0–19.0 tam sabit kare.

## KADRAJ — mutlak
- Stage ekranı %100 doldurur. Kenar boşluğu, kart çerçevesi, siyah alan YOK.
- Oda görselleri her zaman object-fit: cover, full-bleed.
- SAFE ZONE: metin üstten 220px, alttan 340px, sağdan 140px içeride.
- Navy sahnelerde zemin ASLA düz renk değil: altta img/room-03-dogal.jpg
  blur(28px) + ölçek 1.1, üstünde #14213D %88 opaklık katmanı + üst merkezden
  hafif radyal ışık (#1B2B52) + %2 grain. Derinlik hissedilsin, görsel seçilmesin.

## HAREKET DİLİ — her öğe için
- Girişler yaylı: scale 0.92→1.04→1.00 veya translateY 24→-4→0, ~0.35 sn.
  Doğrusal fade YOK.
- Oda push-in kesintisiz: A boyunca ölçek 1.00→1.08.
- Metin vurguları kelime kelime gelir (word-punch), cümle blok halinde değil.

## ZAMAN ÇİZELGESİ

### A · DÖNÜŞÜM KANCASI — 0.0–4.2
0.0  img/room-00-bos.jpg full-bleed, push-in zaten akıyor. METİN YOK.
0.9  SNAP: 0.2 sn dikey wipe → room-01-akdeniz.jpg. AYNI ANDA Hanken 800 84px
     word-punch, sol alt safe zone üstünde, krem, iki vuruş:
     "Bu oda" (0.9) → "boştu." (1.15)
1.1  Sağ alt (bottom: 360px): .rozet "YZ İLE DÜZENLENDİ · TEMSİLÎ" yaylı girer.
2.0  Wipe → room-02-minimal.jpg · sol altta mono çip yaylı: "MİNİMALİST"
3.1  Wipe → room-03-dogal.jpg · çip: "DOĞAL"
     (Akdeniz çipi 1.3'te gelir: "AKDENİZ". Her yeni çip eskisinin yerini alır.)
Başlık "Bu oda boştu." A boyunca kalır.

### B · KIRILMA — 4.2–6.4
4.2  Navy katman diyagonal (sol-alt→sağ-üst) 0.35 sn'de dolar; altta doğal oda
     blur'lu yaşamaya devam eder (yukarıdaki zemin kuralı).
4.5  Kinetik başlık, Hanken 800 124px, satır aralığı 1.04, dikey merkez,
     word-punch sırayla:
     "Kuzey Kıbrıs'ta" (4.5) / "ev aramak" (4.9) / "değişti." (5.3, KOBALT,
     scale taşması 1.06→1.00)
5.8  Altında mono 30px yaylı: "Sorular artık yapay zekâya soruluyor."

### C · SORU — 6.4–9.2
Başlık yukarı kayıp küçülür (%40 ölçek, üst safe zone altına yerleşir).
6.6–8.4  Mono 52px, sol hizalı, genişlik %78, harf harf yazılır + kursör:
     "Girne'de deniz gören, Türk koçanlı 2+1"
Yazım hızı sabit değil: virgülde 0.15 sn duraksama (insan ritmi).

### D · CEVAP + KANIT — 9.2–14.2
9.2   Krem kart (genişlik %78, radius 24px) alttan yaylı girer, dikey merkez.
9.5–10.6  Kart içinde 3 iskelet çizgi SOLDAN SAĞA ÇİZİLEREK dolar (genişlik
      animasyonu, sırayla — cevap "yazılıyor" hissi). Gerçek metin yazma.
10.8  Kartın hemen altında (20px): kobalt çizgi soldan çizilir + mono 30px
      "KAYNAK: EVLEK.APP" — gelirken kartta nabız 1.00→1.03→1.00.
11.6  Kartın üstünde mono 34px yaylı: "CEVABIN KAYNAĞI ÖNEMLİ."
12.2–13.6  Kartın altında 2×2 grid (grid genişliği = kart genişliği), dört çip
      0.3 sn arayla yaylı POP: "KOÇAN" · "FİYAT GEÇMİŞİ" · "ONAYLI EMLAKÇI" · "5 DİL"
      Kobalt ince çerçeve, mono 28px. Grid'in üstünde Hanken 800 44px: "Her ilanda:"

### E · KAPANIŞ — 14.2–19.0
14.2  Navy + kart yukarı süpürülür (0.4 sn), krem zemin.
14.5  Alt kenardan çift katmanlı organik dalga yükselir (arka navy %10 + ön dolu
      navy, faz farklı), yükseklik alt %22. Dalga tepe hattı çok yavaş salınır
      (genlik 6px, t'ye bağlı sinüs) — canlı dursun.
15.0  img/wordmark.png (genişlik 520px) yaylı iner, optik merkez (%8 yukarıda).
15.6  Altında Hanken italic 44px %70: "Yeni çağa göre kurulmuş."
16.4  Altında mono 32px kobalt CTA: "ARAMAYA BAŞLA → EVLEK.APP"
      Ok karakteri yatayda ±4px salınır (t sinüs) — davet hissi.
18.0–19.0 tam sabit.

## YASAKLAR
Coral yok · emoji yok · rakamla istatistik yok · rakip/AI ürün adı yok ·
bilinen sohbet arayüzü taklidi yok · 28px altı metin yok.
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Evlek Design System (design system)">
[Design System] This project uses the **Evlek Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

This project has the **EvlekDesignSystem_4d45ee** design system bound at `_ds/evlek-design-system-4d45ee0a-f7e6-4177-bceb-3742aca5c64d/`. If anything under that path is missing or fails to load, the folder name may differ — `list_files` `_ds/` and use the folder whose name ends with 4d45ee0a-f7e6-4177-bceb-3742aca5c64d instead, including in the <link>/<script> paths below.

**Loading the bundle is how you use this design system.** Every Design Component you build must load `_ds/evlek-design-system-4d45ee0a-f7e6-4177-bceb-3742aca5c64d/_ds_bundle.js` in `<helmet>` (include it in child DCs too — de-duped by URL) and compose with its components — do not recreate those components from scratch or restyle raw HTML to look like them. At the top of the template:

```html
<helmet>
  <link rel="stylesheet" href="_ds/evlek-design-system-4d45ee0a-f7e6-4177-bceb-3742aca5c64d/tokens/fonts.css">
  <link rel="stylesheet" href="_ds/evlek-design-system-4d45ee0a-f7e6-4177-bceb-3742aca5c64d/tokens/colors.css">
  <link rel="stylesheet" href="_ds/evlek-design-system-4d45ee0a-f7e6-4177-bceb-3742aca5c64d/tokens/typography.css">
  <link rel="stylesheet" href="_ds/evlek-design-system-4d45ee0a-f7e6-4177-bceb-3742aca5c64d/tokens/spacing.css">
  <link rel="stylesheet" href="_ds/evlek-design-system-4d45ee0a-f7e6-4177-bceb-3742aca5c64d/styles.css">
  <script src="_ds/evlek-design-system-4d45ee0a-f7e6-4177-bceb-3742aca5c64d/_ds_bundle.js"></script>
</helmet>
```

Then mount any component directly in the template — no logic class needed:

```html
<x-import component-from-global-scope="EvlekDesignSystem_4d45ee.Button" hint-size="auto,40px">Label</x-import>
```

Props are template attributes (kebab → camelCase); template children pass through as `props.children`. The linked stylesheet(s) carry the design tokens (colors, type, spacing) — style against those via `var(--*)` and the design system's classes rather than guessing values.

**Start from a template if one matches.** Before building from scratch, check whether a template below matches the user's request. Read the template (list its folder, `read_file` the entry) and decide: if it's close to what's asked, `copy_files` the folder as your starting point; if you'd rather re-author in DC, `dc_write` a new page using the template as your structural reference. When this design system is bound, `copy_files` repoints the copied `ds-base.js` automatically — only edit its base line yourself if the copy result says so, or when copying from an unbound project (change `'../..'` to your `_ds/evlek-design-system-4d45ee0a-f7e6-4177-bceb-3742aca5c64d` path). (Older templates have no `ds-base.js` and carry `../../…` bundle/stylesheet refs in their pages instead — repoint those by hand.)

- `Carousel Cover Slide` (`/projects/4d45ee0a-f7e6-4177-bceb-3742aca5c64d/templates/carousel-cover/`) — Evlek 1080×1350 cover: eyebrow, big headline with one cobalt word, lead paragraph, signature wave and brand lockup.

The full design-system source tree lives at `/projects/4d45ee0a-f7e6-4177-bceb-3742aca5c64d/` — use `list_files` / `read_file` from there for anything not under `_ds/` (layout varies by brand; don't assume folder names). Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
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
- **Headlines &amp; body — Hanken Grotesk.** Headlines weight **800**, very tight tracking (−0.02em), line-height ~1.0. Body weight **500**, line-height ~1.5. (The uploaded carousels set their big headlines in Hanken 800, not Fraunces — Fraunces is reserved for editorial accents.)
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

**Radii &amp; borders.** Pills fully round (999px); cards 28px; small chips 12px. Borders are navy at low opacity (hairlines), used sparingly.

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

</design-system-guide>
</attached-skill>

## Assistant

_[tool: write_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

Yeni kurgu `Evlek Reel v2.dc.html`'de (v1 korundu): 5 sahne — Dönüşüm kancası → Kırılma → Soru → Cevap+Kanıt → Kapanış, 19.0 sn, tümü saf `render(t)`, 18–19 sabit.

Kurgudan tek sapma: B başlığı 124px yerine 96px — "Kuzey Kıbrıs'ta" 124px'te sağ safe zone'u (140px) taşırıyordu. Dalga salınımı ve ok, 18.0'da sıfıra inen zarfla duruyor (sabit kare korunur).

## User

Mevcut “Evlek Reel v2” tasarımını ana marka Reeli olacak şekilde V3 olarak yeniden kurgula.

AMAÇ
Evlek’in yalnızca ilan gösteren bir site olmadığını; doğal dilde ev arama, gerçek ilan sonuçları, güven/veri katmanı ve virtual staging sunan yeni nesil Kuzey Kıbrıs emlak platformu olduğunu göstermeliyiz.

Video bir teknoloji demosu veya soyut AI videosu gibi görünmemeli. Gerçek Evlek ürün arayüzü ve gerçek ilan kartları ana görsel kanıt olmalı.

TEKNİK
- 1080×1920
- 30 FPS
- Toplam 19–20 saniye
- Tüm önemli metin ve logoları x: 70–1010, y: 280–1240 alanında tut
- Instagram UI bölgelerine metin yerleştirme
- Hızlı fakat okunabilir geçişler
- 180–320 ms arası motion süreleri
- Elastic bounce, aşırı glow, parçacık, neon AI efekti ve gereksiz 3D kullanma
- Gerçek ürün ekranı yerine skeleton placeholder kullanma

TASARIM
- Ana renkler: #0A2540, beyaz ve kontrollü #C9A157
- Elektrik mavisini yalnızca cursor, aktif seçim veya küçük etkileşim detayında kullan
- Pazarlama metinlerinde Outfit veya mevcut Evlek sans-serif fontu
- Monospace fontu sadece arama sorgusu ve veri metriklerinde kullan
- Uzun süre bulanık lacivert arka plan gösterme
- Gerçek Evlek UI ekranları, ilan görselleri ve veri kartları kullan
- Her sahnede en fazla bir ana mesaj
- Mimari görsellerin geometrisini, kamera açısını, pencere ve oda oranlarını değiştirme

SAHNE 1 — 0.0–1.3 sn
Gerçek Evlek arama ekranına hızlı giriş.
Ana metin:
“Filtreleri değil,
evi tarif et.”
Logo introsu kullanma.

SAHNE 2 — 1.3–4.2 sn
Evlek’in gerçek arama kutusunda şu sorgu yazılsın:
“Girne’de deniz gören,
Türk koçanlı, £180 bin altı 2+1”
Sorgunun gerçek sonuç üreten bir arama olduğundan emin ol.
Yazma animasyonu hızlı olsun.
Enter sonrasında kısa click feedback kullan.

SAHNE 3 — 4.2–7.0 sn
İki veya üç gerçek Evlek ilan kartı ekrana gelsin.
Bir kart öne çıksın.
Kartta fotoğraf, fiyat, konum, 2+1, koçan ve Evlek kontrolü görülsün.
Ana metin:
“Evlek bulur.”

SAHNE 4 — 7.0–11.0 sn
Seçilen gerçek ilanın detay sayfasına gir.
Aşağıdaki gerçek arayüz öğelerini sırasıyla büyüt:
- Evlek kontrolü
- Koçan tipi / risk bandı
- £/m²
- Bölge medyanı karşılaştırması
- Fiyat geçmişi veya piyasa okuması
Ana metin:
“Sadece bulmaz.
Okur.”
Badge grid yerine gerçek UI kullan.

SAHNE 5 — 11.0–13.3 sn
Mevcut virtual staging görüntüsünden kısa bir before/after kullan.
Boş oda ve döşenmiş oda arasında temiz mask transition.
Ana metin:
“Potansiyelini gösterir.”
“Yapay zekâyla düzenlendi · temsilî” ifadesini okunur, yüksek kontrastlı küçük pill içinde göster.

SAHNE 6 — 13.3–16.8 sn
Üç hızlı gerçek ürün ekranı:
1. KKTC Fiyat Endeksi
2. Fiyat haritası veya yatırım hesaplayıcısı
3. Beş dil veya mobil uygulama ekranı
Ana metin:
“Karar için
daha fazla bağlam.”
Her ekranı yaklaşık 0.8–1.0 saniye göster.
Etiket kalabalığı oluşturma.

SAHNE 7 — 16.8–19.5 sn
Kırık beyaz sade kapanış.
Alt dalga grafiğini kaldır veya çok ince bir marka çizgisine dönüştür.
Logo:
“Evlek”
Alt metin:
“Kıbrıs’ta doğru ev.”
CTA:
“EVLEK.APP’TE ARA”
Kapanışı maksimum 2.2 saniye tut.

SES İÇİN MARKER EKLE
- Arama: hafif typing
- Enter: click
- Sonuç: subtle confirmation
- Virtual staging: soft swipe
- Logo: kısa sonic logo

Tüm animasyonlar premium, sakin, net ve gerçek ürün odaklı olsun.
Video eski ilan sitesi ile yeni nesil emlak platformu arasındaki farkı kullanıcıya göstermeli; “AI” kelimesini tekrar tekrar yazmadan AI-native hissi vermeli.

## Assistant

_[tool: write_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

V3 hazır — 19.5 sn, 7 sahne, tamamı gerçek ürün arayüzü olarak kurgulandı: arama ekranı → sorgu yazımı + Enter feedback → 3 gerçek ilan kartı (öne çıkan altın çerçeve) → detay sayfasında 5 modüle sıralı kamera zoom'u (kontrol, koçan/risk, £/m², medyan, fiyat geçmişi) → before/after staging slider → 3 bağlam ekranı → sade krem kapanış (dalga yerine ince altın çizgi).

Notlar:
- Ses marker'ları `OM_AUDIO_MARKERS` içinde: typing 1.8 · click 3.6 · confirm 4.5 · swipe 11.4 · sonic logo 17.2.
- Outfit dış çağrı gerektireceği için mevcut gömülü Evlek sans'ı (Hanken Grotesk) kullandım; mono yalnız sorgu + metriklerde.
- Elektrik mavisi yalnız caret, focus ring, aktif seçim ve slider tutamacında; #C9A157 kontrol rozeti, medyan vurgusu ve kapanış çizgisinde.

## User

Found issues — fixing…

## User

Found issues — fixing…

## User

<pasted_text name="Pasted text (108 lines)">
Mevcut Evlek Reel V3’ü tamamen sıfırdan değiştirme. Tasarım dilini koru ancak aşağıdaki kritik hataları gidererek V4 oluştur.

ANA HEDEF
Video bir ürün onboarding’i gibi değil, yeni nesil bir emlak platformunun güçlü marka reklamı gibi görünmeli.

Temel hikâye:
Problem → Doğal dilde arama → Gerçek sonuç → Güven ve piyasa bağlamı → Virtual staging → Veri araçları → Marka kapanışı.

KRİTİK DÜZELTMELER
1. Video “5 dilde” ekranında bitmesin.
2. Son 2.5–3 saniyede Evlek logosu, “Kıbrıs’ta doğru ev.” sloganı ve “EVLEK.APP’TE ARA” CTA’sı gösterilsin.
3. 17.3–19.5 saniye arasındaki hareketsiz bekleme kaldırılmalı.
4. Açılış başlığı en az 1.2 saniye tam kontrastla okunabilir kalmalı.
5. Arama düğmesine gerçek click/tap animasyonu eklenmeli.
6. Sonuçlardaki üç ilan görseli birbirinden farklı olmalı.
7. Seçilen sonuç kartı detay sayfasına morph transition ile dönüşmeli.
8. 7.5–10.5 saniye arasındaki agresif zoom kaldırılmalı. Hiçbir fiyat veya metin ekran dışına taşmamalı.
9. “Belgeler ve ilan sahada doğrulandı” metnini kaldır. Yerine:
   “İlan sahibi doğrulandı”
   “Temel ilan bilgileri kontrol edildi”
   kullan.
10. “Düşük risk” gibi hukuki garanti algısı yaratabilecek ifadeleri kaldır. “Koçan bilgisi” veya “Türk Koçanı” kullan.
11. Dil seçeneklerini TR, EN, RU, DE, AR olarak düzelt.
12. KKTC fiyat endeksi, ilan fiyatı ve karşılaştırma verileri gerçek Evlek verisiyle değiştirilmeli. Gerçek veri yoksa “örnek veri” etiketi eklenmeli.
13. Tekrarlanan hamburger menülerini kaldır.
14. ARAMA / SONUÇLAR / İLAN / VERİ / HESAPLA / DİL gibi okunamayacak küçük bölüm etiketlerini kaldır veya minimum 24 px yap.
15. Ana içerikleri ekranın üst kısmına sıkıştırma; kartları dikey merkeze yaklaştır ve %15–20 büyüt.
16. Ana metinleri yan kenarlardan en az 110 px, üstten 210 px, alttan 350 px güvenli alan içinde tut.
17. Ana başlıklar 64–80 px, yardımcı metinler 28–36 px, en küçük açıklamalar minimum 23 px olsun.
18. Browser default mavi focus border yerine Evlek laciverti ve kontrollü altın highlight kullan.

YENİ ZAMANLAMA

0.00–0.75
Karmaşık filtre ve ilan görüntülerinden hızlı bir problem sahnesi.
Metin:
“İlan çok.
Karar zor.”

0.75–3.40
Evlek doğal dil araması.
Metin:
“Filtreleri değil,
evi tarif et.”
Sorgu:
“Girne’de deniz gören,
Türk koçanlı, £180 bin altı 2+1”
Ara düğmesine click animasyonu ekle.

3.40–5.50
Birbirinden farklı gerçek ilan kartları.
Metin:
“Evlek bulur.”
Seçilen kart detail page’e morph olsun.

5.50–8.80
Üç veri noktası sırayla vurgulansın:
“Kontrol eder.”
“Karşılaştırır.”
“Geçmişi gösterir.”
Tüm sayfayı zoomlamak yerine hedef kartları büyüt.

8.80–11.20
Boş oda en az 0.4 saniye tam görünür olsun.
Slider soldan sağa ilerleyerek furnished version’ı açsın.
Metin:
“Potansiyelini gösterir.”
“Yapay zekâyla düzenlendi · temsilî” etiketi okunabilir ve güvenli alanda olsun.

11.20–13.50
Fiyat endeksi ve yatırım hesaplayıcısı tek sahnede.
Metin:
“Piyasayı gör.
Getiriyi hesapla.”

13.50–15.20
Kısa destek satırı:
“5 dil · Web · iOS · Android”
Diller:
TR · EN · RU · DE · AR

15.20–19.50
Marka kapanışı:
“Evlek”
“Kıbrıs’ta doğru ev.”
CTA:
“EVLEK.APP’TE ARA”
CTA minimum 2.5 saniye sabit ve okunabilir kalsın.

MOTION
- 180–320 ms arası hızlı ve kontrollü geçişler
- Elastic bounce kullanma
- Aşırı glow, neon, AI parçacıkları veya robotik efekt kullanma
- Card morph, mask reveal, soft scale ve controlled slide kullan
- Sonuç ekranında kartlar 80–120 ms arayla stagger edilsin
- Video son karede kesilmesin; CTA 6–8 frame yumuşak fade ile tamamlansın

SES MARKERLARI
- Typing
- Search click
- Result confirmation
- Data tick
- Virtual staging swipe
- Sonic logo

Genel his:
Premium, sakin, hızlı, güvenilir ve ürün odaklı.
“AI” kelimesini tekrar ederek değil, kullanıcı deneyimini göstererek AI-native his ver.
</pasted_text>

## Assistant

_[tool: copy_files]_

_[tool: write_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

V4 hazır — 8 sahne, 19.5 sn: Problem ("İlan çok. Karar zor.") → Arama (başlık tüm sahne boyunca tam kontrast, altın caret, tap-ripple'lı Ara) → Sonuçlar (3 farklı görsel: iç mekân + kıyı + doğal, 110 ms stagger) → kart→detay **morph** + tüm-sayfa zoom yerine yerinde kart büyütme ("Kontrol eder / Karşılaştırır / Geçmişi gösterir") → staging (boş oda ~0.75 sn tam görünür) → endeks+hesaplayıcı tek sahne → "5 dil · Web · iOS · Android" (TR EN RU DE AR) → marka kapanışı (CTA ~16.6'dan sona kadar sabit, ~2.9 sn).

Uygulanan düzeltmeler: hamburger/bölüm etiketleri kalktı, "sahada doğrulandı" → "İlan sahibi doğrulandı / Temel ilan bilgileri kontrol edildi", risk bandı → "Koçan bilgisi", tüm veri panellerinde "ÖRNEK VERİ" etiketi, mavi focus yerine lacivert çerçeve + altın glow, min metin 23 px, kenar boşlukları 110/210/350, ses marker'ları güncel (`OM_AUDIO_MARKERS`).

## User

<system-info comment="Only acknowledge these if relevant">
User is viewing file: Evlek Reel v4.dc.html
</system-info>

<pasted_text name="Pasted text (311 lines)">
Mevcut Evlek Reel V4’ün tasarım dilini ve başarılı ürün sahnelerini koru; ancak videoyu güçlü bir ana marka filmi hâline getirmek için V5 olarak yeniden kurgula.

AMAÇ

Evlek’i yalnızca gelişmiş bir ilan arama sitesi gibi değil, Kuzey Kıbrıs’ta doğru gayrimenkul kararını vermek için arama, doğrulama sinyalleri, piyasa bağlamı, fiyat geçmişi, yatırım araçları ve virtual staging sunan yeni nesil emlak platformu olarak konumlandır.

Video özellik listesi veya ürün onboarding turu gibi görünmemeli.

Ana anlatı:

Karmaşa → Kullanıcı problemi → Evlek ile sade arama → Gerçek sonuç → Karar katmanı → Potansiyel → Piyasa araçları → Marka kapanışı

TOPLAM SÜRE

22–23 saniye.

Süre uzatılırken statik beklemeler ekleme. Ek süreyi giriş hikâyesine, ürün geçişlerine ve dönüşümün anlaşılmasına ayır.

TEKNİK

- 1080×1920
- 30 FPS
- H.264 High Profile
- Master export bitrate: 8–10 Mbps
- AAC stereo
- 48 kHz
- Tüm metinler mobilde okunabilir olmalı
- Ana mesaj: minimum 60–76 px
- İkincil mesaj: minimum 32–40 px
- Mikro bilgi: minimum 24–28 px
- Monospace fontu yalnızca sorgu ve veri rakamlarında kullan
- Küçük altın metin kullanma
- Altını aktif durum, çizgi, ikon ve vurgu için kullan
- Kritik içerikleri yaklaşık x=80–1000 ve y=280–1220 içinde tut
- Instagram üst ve alt UI alanlarına kritik metin yerleştirme
- Virtual staging ana metnini mevcut konumundan 100–140 px yukarı taşı

RENK RİTMİ

1. Giriş: hafif koyu, kontrollü karmaşa
2. Arama: temiz beyaz/kırık beyaz
3. Sonuç ve detay: sıcak açık zemin
4. Virtual staging: full-screen fotoğraf
5. Piyasa araçları: sıcak kırık beyaz
6. Kapanış: #0A2540 lacivert

Aşırı glow, neon, gradient, parçacık, robot grafiği veya jenerik AI efekti kullanma.

SAHNE 1 — 0.00–0.65

Yakın plan emlak ilan kartları ve filtreler hızlı biçimde ekrana gelsin.

Filtre örnekleri:
- Bölge
- Fiyat
- Oda
- Koçan
- Deniz manzarası
- Metrekare

Kartları küçük bir web sayfası olarak uzaktan gösterme. Ekranı dolduran yakın plan detaylar kullan.

Metin:
“İlan bulmak kolay.”

Metin ilk karede değil, 0.15 saniye içinde netleşsin.
Minimum 0.8 saniye okunabilir kalsın.

SAHNE 2 — 0.65–1.85

İlanların üzerine karar vermek için gereken bilgi soruları gelsin:

- Koçan bilgisi?
- Bölge fiyatı?
- Fiyat geçmişi?
- İlan veren doğrulandı mı?

Arka plandaki ilanlar hafif blur olsun.

Metin:
“Doğru kararı vermek zor.”

Bu sahne problemi yalnızca söylememeli, görsel olarak da göstermeli.

SAHNE 3 — 1.85–2.70

Karmaşık kartlar ve filtreler kontrollü bir morph transition ile tek bir Evlek arama kutusuna dönüşsün.

İsteğe bağlı küçük metin:
“Evlek bunun için var.”

Logo ekranın en üst unsafe alanına yerleştirilmesin.

SAHNE 4 — 2.70–5.15

Başlık:
“Filtreleri değil,
aradığın evi tarif et.”

Sorgu karakter karakter çok yavaş yazılmasın. Üç anlam bloğu hâlinde gelsin:

“Girne’de deniz gören,”
“Türk koçanlı,”
“£180 bin altı 2+1”

Her blok geldiğinde ilgili kelime veya kriter kısa altın vurguyla belirginleşsin.

Mevcut “deniz manzaralı / site içinde / yeni koçan” chip’lerini kaldır.

Chip kullanılacaksa sorguyla birebir uyumlu olsun:
- Girne
- Deniz manzaralı
- Türk koçanlı
- ≤ £180K
- 2+1

Ara düğmesine gerçek tıklama animasyonu ekle:
- Cursor yaklaşır
- Button scale 1.0 → 0.96 → 1.0
- Kısa click feedback
- Çok hafif altın halka
- Arama kutusu sonuç sayfasına morph olur

SAHNE 5 — 5.15–7.20

Üç gerçek ve birbirinden farklı ilan kartı 100 ms stagger ile gelsin.

Kart görselleri:
1. Deniz manzaralı salon
2. Bina/balkon veya sahil görünümü
3. Farklı mimariye sahip başka bir gerçek ilan

Aynı AI görselinin varyasyonlarını kullanma.

Başlık:
“Evlek bulur.”

“3 sonuç” metnini kaldır.
Üstteki uzun sorgu pill’ini kaldır veya şu kısa formata getir:
“Girne · 2+1 · Türk Koçanı · ≤ £180K”

Seçilen kart:
- Diğerlerinden %15–20 büyük
- Altın ince border
- Net fiyat
- Konum
- 2+1
- Türk Koçanı
- Doğrulanmış hesap

Seçilen kart detail page’e shared-element morph transition ile dönüşsün.

SAHNE 6 — 7.20–10.80

Tam detay sayfasını uzun süre sabit gösterme.

Dört focus state kullan:

1. “Doğrulanmış hesap”
İlgili kart büyüsün, doğrulama ikonu çizilsin.

2. “Türk Koçanı”
Koçan bilgi alanı vurgulansın.
Risk garantisi belirten ifade kullanma.

3. “Piyasayla karşılaştırır”
İlan £/m² ve Girne medyanı animasyonla gelsin.
Veriler gerçek değilse görünür “Örnek veri” etiketi bulunsun.

4. “Fiyat geçmişini gösterir”
12 aylık grafik soldan sağa çizilsin.
Son nokta altın renkli olsun.

Ana metin:
“Sadece bulmaz.
Açıklar.”

“İlan sahibi doğrulandı” yerine:
“İlan veren doğrulandı”
veya
“Doğrulanmış hesap”
kullan.

“Evlek kontrolü” gibi belirsiz ifadeleri ürünün gerçek kontrol kapsamına göre somutlaştır.

SAHNE 7 — 10.80–13.70

Virtual staging sahnesi.

- Boş oda 0.55 saniye tam görünür
- Slider 0.9 saniyede soldan sağa ilerler
- Tamamlanmış oda 0.75 saniye görünür
- Metin final 0.6 saniyede oturur

Metin:
“Potansiyelini gösterir.”

Metni alt UI bölgesinden 100–140 px yukarı taşı.

Disclosure:
“AI ile düzenlendi · Temsilî”

Disclosure yüksek kontrastlı lacivert pill içinde, minimum 24 px olsun.

Odanın:
- geometrisini
- pencere oranını
- kamera açısını
- tavan yüksekliğini
- kapı boşluklarını
değiştirme.

SAHNE 8 — 13.70–16.20

Başlık:
“Piyasayı gör.
Getiriyi hesapla.”

Fiyat endeksi kartı:
- Aşağıdan hafif yükselsin
- Grafik 0.6 saniyede çizilsin
- Endeks değeri count-up ile gelsin

Yatırım hesaplayıcısı:
- İkinci kart olarak overlap ile gelsin
- Fiyat ve kira bilgisi görünür
- Brüt getiri en son vurgulansın

Örnek veya temsili değerler kullanılıyorsa “Örnek veri” etiketi minimum 24 px ve yüksek kontrastlı olsun.

SAHNE 9 — 16.20–17.50

Mevcut ayrı ve statik “5 dil” sahnesini kaldır.

Web ve mobil ekranları kısa bir cihaz kompozisyonunda göster.

Metin:
“Web · iOS · Android · 5 dil”

Dil kodları:
TR · EN · RU · DE · AR

Cihaz mockup’ları görüntünün tamamını kaplamasın.
Sahne maksimum 1.3 saniye sürsün.

SAHNE 10 — 17.50–22.50

Lacivert marka kapanışı.

Arka plan:
#0A2540

Logo:
Beyaz Evlek wordmark

Slogan:
“Kıbrıs’ta doğru ev.”

CTA:
“Evlek.app’te ara”

CTA:
- Minimum 360–420 px genişlik
- 84–96 px yükseklik
- Minimum 28–30 px yazı
- En az 2.7 saniye okunabilir kalmalı

Destek satırı:
“Web · iOS · Android · 5 dil”

Kapanış tamamen donmuş kalmasın:
- Logo 1.02’den 1.00’a otursun
- İnce altın çizgi soldan sağa çizilsin
- CTA üzerinde bir defalık çok hafif highlight geçsin
- Sürekli pulse veya glow kullanma

MOTION KURALLARI

- Büyük geçişler: 240–420 ms
- Mikro animasyonlar: 160–280 ms
- Kart stagger: 80–120 ms
- Yazı blokları: 180–260 ms
- Grafik çizimi: 500–700 ms
- Elastic bounce kullanma
- Aşırı hızlı zoom kullanma
- Sayfa screenshot’larını yalnızca büyütüp küçültme
- Morph, mask reveal, shared element, soft scale ve controlled slide kullan
- Her 0.7–1.2 saniyede anlamlı bir görsel değişim olsun

SES MARKERLARI

- Listing/UI taps
- Soft reverse sweep
- Typing
- Search click
- Result ticks
- Verification confirmation
- Data tick
- Chart tonal rise
- Staging swipe
- Index count-up
- Sonic logo

GENEL HİS

Premium fakat steril değil.
Teknolojik fakat robotik değil.
Veri odaklı fakat finans şirketi gibi değil.
Modern fakat jenerik SaaS reklamı gibi değil.
Kuzey Kıbrıs emlak sektörüne özgü.
Evlek’in “eski ilan sitesi değil, karar platformu” farkını göstermeli.
</pasted_text>

## Assistant

_[tool: write_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

V5 hazır — 22.5 sn, 10 sahne: Karmaşa (yakın plan kartlar+filtreler, "İlan bulmak kolay.") → Problem (blur + 4 soru pill'i, "Doğru kararı vermek zor.") → morph'la tek arama kutusuna dönüşüm → 3 anlam bloğuyla sorgu + altın vurgu + kriter chip'leri + cursor'lı gerçek tıklama → sonuçlar (kısa sorgu pill'i, %18 büyük altın çerçeveli kart) → shared-element morph detay + 4 focus state (check çizimi, koçan, animasyonlu karşılaştırma, soldan çizilen grafik + altın uç) → staging (0.55 sn boş oda, 0.9 sn slider, metin 1010'a taşındı, lacivert 24px disclosure) → endeks count-up + overlap'li hesaplayıcı → cihaz kompozisyonu (browser+telefon, TR·EN·RU·DE·AR) → lacivert kapanış (beyaz wordmark 1.02→1.00, altın çizgi, tek seferlik CTA highlight, CTA ~19.7'den sona dek sabit).

Notlar: 3. ilan görseli eldeki setten aynalanmış farklı kadraj — gerçek üçüncü ilan fotoğrafı gelirse takarım. H.264/bitrate/AAC export tarafının ayarları; ses marker listesi `OM_AUDIO_MARKERS`'ta güncel.

## User

Found issues — fixing…

## User

Found issues — fixing…

## User

<pasted_text name="Pasted text (185 lines)">
V5’i genişletme veya yeni sahne ekleme. V6’nın ana hedefi sadeleştirme ve bilişsel yükü azaltmak.

Mevcut 22.5 saniyelik 10 sahneyi yaklaşık 19–20 saniyelik 6 sahneye indir.

KRİTİK KARAR

V5’in mevcut 0.00–2.70 arasındaki girişini tamamen kaldır:

- Boş lacivert ilk kare
- Filtre kolajı
- Üç ilan kolajı
- “İlan bulmak kolay.”
- Dört soru pill’i
- “Doğru kararı vermek zor.”
- Ortadaki “Evlek bunun için var.” logo sahnesi

Video doğrudan kullanıcının gerçek arama isteğiyle başlamalı.

SAHNE 1 — 0.00–2.30

İlk kare boş veya fade durumda olmasın.

İlk karede büyük metin:

“Girne’de deniz gören,
Türk koçanlı 2+1?”

Küçük destek metni:

“Evlek’e söyle.”

Arama kutusunda ikinci kriter olarak:

“£180 bin altı”

gelsin.

Uzun karakter karakter yazma animasyonu kullanma.
Metni iki anlam bloğu hâlinde göster.

Alttaki tekrar eden Girne / Deniz manzaralı / Türk koçanlı chip’lerini kaldır.
Yalnızca fiyat kriteri chip veya arama metni olarak kalabilir.

Ara düğmesine net fakat kısa click animasyonu ekle.
İlk 2.3 saniyede logo introsu kullanma.

SAHNE 2 — 2.30–4.50

Üç sonuç yerine iki sonuç göster.

Birinci kart ana ve büyük olsun.
İkinci kart kısmen görünerek seçenek hissi versin.

Metin:

“Evlek bulur.”

Uzun sorgu pill’ini kaldır.
Kartta yalnızca:

- Fotoğraf
- Fiyat
- Girne · Zeytinlik
- 2+1
- Türk Koçanı

okunur kalsın.

Seçilen kart shared-element morph ile detay sayfasına dönüşsün.

SAHNE 3 — 4.50–7.80

Dört ayrı focus state kullanma.

Tek ilan ekranında üç büyük bilgi göster:

1. Doğrulanmış ilan veren
2. Türk Koçanı
3. Bölge fiyatı ve 12 aylık fiyat geçmişi

Ana metin:

“Sadece bulmaz.
Açıklar.”

Fotoğraf üstündeki geçici “Doğrulanmış hesap” ve “Türk Koçanı” pill’lerini kaldır.
Aynı bilginin fotoğraf üzerinde ve aşağıdaki kartta iki kez görünmesini engelle.

“BELGE İLANDA” rozetini kaldır.
İki ayrı “ÖRNEK VERİ” etiketi kullanma.
Veriler temsiliyse sahnede yalnızca bir adet küçük ve okunur:

“Örnek ekran”

etiketi kullan.

SAHNE 4 — 7.80–11.50

Virtual staging sahnesini yavaşlat.

Zamanlama:

- 0.70 sn tamamen boş oda
- 1.15 sn slider hareketi
- 1.35 sn tamamlanmış oda ve ana metin
- 0.45 sn çıkış geçişi

Ana metni değiştir:

“Evin potansiyelini gör.”

“Potansiyelini gösterir.” kullanma.

Disclosure tasarımını değiştir.

Tamamen büyük harfli:

“AI İLE DÜZENLENDİ · TEMSİLÎ”

etiketini kaldır.

Yerine iki kontrollü pill kullan:

Ana pill:
“AI ile görselleştirildi”

Yanında küçük pill:
“Temsilî”

Ana pill lacivert, normal büyük-küçük harfli ve sakin olmalı.
Temsilî pill altın çerçeveli olabilir.
Ana başlık en az 1.2 saniye tam okunur kalsın.

SAHNE 5 — 11.50–15.80

Fiyat endeksi ve hesaplayıcı tek sahnede kalabilir.

Metin:

“Piyasayı gör.
Getiriyi hesapla.”

Yalnızca üç ana veri görsel olarak güçlü olsun:

- Endeks
- Yıllık değişim
- Brüt getiri

Diğer küçük değerleri okutmaya çalışma.

Ayrı Web / iOS / Android cihaz sahnesini kaldır.

SAHNE 6 — 15.80–19.30

Kapanış ilk karede logo, slogan ve CTA ile birlikte başlasın.

Logo tek başına uzun süre beklemesin.

İçerik:

“Evlek”

“Kıbrıs’ta doğru ev.”

CTA:
“Evlek.app’te ara”

Alt satır:
“Web · iOS · Android · 5 dil”

Kapanış toplam 3–3.5 saniye olsun.

GENEL KURALLAR

- Maksimum 6 sahne.
- Yeni özellik ekleme.
- Bir sahnede tek ana mesaj kullan.
- Aynı bilgiyi iki farklı yerde tekrarlama.
- Her sahnede okunması gereken metin sayısını azalt.
- Mobil okunabilirliği masaüstü görünümünden daha önemli kabul et.
- İlk karede mutlaka anlamlı içerik olsun.
- Blur ve pill kalabalığını azalt.
- Tamamen büyük harfli uzun etiketlerden kaçın.
- Sahne geçişlerini anlatının parçası yap; sunum slaytı gibi kesme.
- Video ses kanalı içermeli; mevcut V5 dosyasında ses bulunmuyor.
</pasted_text>

## Assistant

_[tool: write_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

_[tool: snip]_

V6 hazır — 19.3 sn, 6 sahne: eski giriş (kolaj/sorular/"Evlek bunun için var.") tamamen kaldırıldı; video ilk karede dolu başlıyor ("Girne'de deniz gören, Türk koçanlı 2+1?" + "Evlek'e söyle."), sorgu 2 blok, tek chip yok, kısa click → 2 kart (büyük seçili + kısmi ikinci, uzun pill yok) → morph detay: 3 bilgi (doğrulanmış ilan veren, Türk Koçanı, bölge fiyatı+12 ay tek kartta), foto üstü pill'ler ve "BELGE İLANDA" kalktı, sahne başına tek "Örnek ekran" etiketi → yavaşlatılmış staging (0.7 boş / 1.15 slider / 1.35 metin, "Evin potansiyelini gör.", "AI ile görselleştirildi" + altın çerçeveli "Temsilî") → piyasa (3 güçlü veri: endeks count-up, +%6,2, altın %5,45; cihaz sahnesi kalktı) → kapanış tüm öğelerle birlikte açılıyor (3.5 sn, tek seferlik CTA highlight).

Not: HTML tarafı ses kanalı taşıyamıyor — export sonrası miksaj için marker listesi `OM_AUDIO_MARKERS`'ta sahnelere göre güncellendi.

## User

Send this design to Canva: `Evlek Reel v6.dc.html`

## Assistant

_[tool: show_to_user]_

_[tool: tool_search_tool_bm25]_

_[tool: dc_html_str_replace]_

_[tool: bundle_project]_

_[tool: canva__import-design-from-url]_

Canva'ya aktarıldı: **[Open in Canva](https://www.canva.com/d/fyikCVu1IC541j-)**

Not: Canva HTML'i statik sayfa olarak alır — animasyon zaman çizelgesi Canva'da oynamaz; içerik tek sayfa (ilk kare) olarak düzenlenebilir. Video çıktısı için buradaki export akışı daha uygun.

## User

Bu mesajla birlikte yüklediğim dosyaları yalnızca belirtilen görevlerde kullan:

01_girne_harbor_hook.jpg
- Final Reelin ilk görseli.
- Girne limanı/kalesi ve deniz manzarası net görülsün.
- Full-screen kullan.
- Sağdan sola yaklaşık %4–6 kontrollü pan ve çok hafif push-in uygula.
- Sabit fotoğraf gibi başlatma.

02_mediterranean_livingroom.jpg
- Girişte Girne manzarasından sonra gelen yaşam/ev arzusu görseli.
- Maksimum 0.4–0.6 saniye kullan.
- Tam ekran.
- Bunu doğrudan £180K tutarındaki gerçek ilan olarak sunma; görsel niyet katmanı olarak kullan.

03_coastal_balcony_peek.jpg
- Sonuç sahnesindeki küçük ikinci peek kart için.
- Ana sonuç kartı yapma.
- Ekranın altında yalnızca %15–18’i görünsün.

04_staging_final_mediterranean.jpg
- Virtual staging sahnesinin final furnished görseli.
- Claude projesinde hâlihazırda bulunan aynı odanın tamamen boş orijinaliyle eşleştir.
- Before ve after görüntülerinin kamera açısı, pencere, zemin, duvar ve mimari geometrileri kesinlikle aynı konumda kalsın.

OPTIONAL_staging_alt_warm.jpg
- Yalnızca stil referansı.
- Final videoda kullanma.

YENİ FINAL GİRİŞ — 0.00–2.55

0.00–0.45:
01_girne_harbor_hook.jpg tam ekran.
Sağdan sola yumuşak pan + çok hafif push-in.
Metin:
“Sen tarif et.”

Metin ilk karede okunur olsun fakat büyük reklam sloganı gibi ekranın ortasını kaplamasın.

0.45–0.85:
Mimari çizgi veya balkon korkuluğu üzerinden match-cut ile
02_mediterranean_livingroom.jpg görseline geç.

Kısa sorgu parçası:
“Deniz gören 2+1…”

0.85–1.25:
İç mekân görseli kontrollü mask/shared-element transition ile Evlek doğal dil arama kutusuna dönüşsün.

Arama kutusunda:
“Girne’de deniz gören, Türk koçanlı 2+1”

Köşede küçük premium badge:
“AI arama”

Badge lacivert ve sade olsun.
Robot, beyin, neon veya parçacık efekti kullanma.

1.25–1.85:
Evlek’in cümleyi anladığı görsel olarak gösterilsin.

Sözcükleri sırayla kısa altın vurguyla aktive et:
- Girne’de
- deniz gören
- Türk koçanlı
- 2+1

Ardından bunlar küçük ve temiz yapılandırılmış kriterlere dönüşsün:
Girne · Deniz manzarası · Türk Koçanı · 2+1

Son kriter:
≤ £180K

Bu sahnenin ana ikinci mesajı:
“Evlek anlasın.”

Böylece açılış mesajı:
“Sen tarif et. Evlek anlasın.”

1.85–2.25:
Cursor Ara butonuna gelir.
Button 1.00 → 0.96 → 1.00 tepki verir.
Click ve kısa confirmation feedback.

2.25–2.55:
Arama alanı mevcut sonuç sahnesindeki ana ilan kartına shared-element morph ile dönüşsün.

Ardından:
“Evlek bulur.”
sahnesi mevcut final akıştaki yerinden devam etsin.

KRİTİK:
- İlk 2.55 saniyede fazla yazı gösterme.
- Her anda tek ana mesaj.
- AI özelliği “AI arama” etiketi ve cümlenin anlam kriterlerine ayrılmasıyla anlaşılmalı.
- İlk karede beyaz UI veya logo introsu kullanma.
- Girne/Karpaz gibi coğrafi görselleri karıştırma.
- Generic rocky coastal village ve Karpaz beach görsellerini bu Reel’de kullanma.
- Giriş müzik ritmine senkronize edilmeli.

## Assistant

_[tool: list_files]_

_[tool: copy_files]_

_[tool: write_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

V7 hazır — 19.55 sn, yeni giriş monte edildi:

- **0.00–0.45** Girne limanı full-bleed, sağdan sola pan + hafif push-in; "Sen tarif et." ilk kareden okunur, sol altta.
- **0.45–0.85** Korkuluk hattı üzerinden dikey match-cut → salon; mono "Deniz gören 2+1…".
- **0.85–2.25** Salon shared-element morph'la arama kutusuna dönüşür; köşede lacivert "AI arama" rozeti; sözcükler sırayla altın vurguyla aktive olur (Girne'de / deniz gören / Türk koçanlı / 2+1) → yapılandırılmış kriter çipleri, son çip altın çerçeveli "≤ £180K"; başlık "Evlek **anlasın**."; cursor tıklaması 1.00→0.96→1.00.
- **2.25–2.55** Arama kutusu ana ilan kartına morph → "Evlek bulur." akış V6'daki gibi devam eder.

Görsel atamalar isteğe göre: salon görseli yalnızca niyet katmanı (ilan olarak sunulmuyor), yeni balkon görseli sonuçlarda alt kenarda ~%16 görünen peek kart, staging sahnesi projedeki boş oda + eşleşen furnished çiftiyle değişmedi; OPTIONAL_warm kullanılmadı. Ses marker'ları (`OM_AUDIO_MARKERS`) yeni girişe göre güncel — müzik senkronu miksajda bu cue'lara oturtulabilir.

## User

Bu tur final polishing turu. Yeni fikir veya yeni sahne ekleme. Mevcut V7 iskeletini koru, yalnızca pacing, kompozisyon ve final kalite düzeltmelerini yap.

EN KRİTİK DÜZELTME 1 — GİRİŞ ÇOK HIZLI

İlk 2–3 saniye şu an fazla hızlı geçiyor. İzleyici:
- Girne limanlı balkon görselini
- “Sen tarif et.”
- salon görselini
- “Evlek anlasın.”
- search UI’ye dönüşümü
- kriter ayrışmasını

yakalamakta zorlanıyor.

Girişi 3.35–3.65 saniyeye yay.

Yeni akış:

0.00–0.90
01_girne_harbor_hook.jpg
Full-screen.
Sağdan sola hafif pan + çok hafif push-in.
Metin:
“Sen tarif et.”
Bu sahne en az 0.9 saniye okunur kalsın.

0.90–1.75
02_mediterranean_livingroom.jpg
Match-cut ile geç.
Bu sahnede yeni büyük slogan ekleme.
Görsel biraz nefes alsın.
İstenirse çok kısa ve küçük:
“Deniz gören 2+1…”
kullanılabilir ama şart değil.

1.75–2.75
İç mekân arama kutusuna kontrollü biçimde dönüşsün.
Burada:
“Evlek anlasın.”
gelsin.
Arama kutusunda:
“Girne’de deniz gören, Türk koçanlı 2+1”
ve ardından:
“≤ £180K”
eklensin.

2.75–3.35
Kriterler kısa ama okunur şekilde yapılandırılmış hale gelsin:
Girne · Deniz manzarası · Türk Koçanı · 2+1 · ≤ £180K
Bunları bir anda değil, çok kısa stagger ile göster.
Bu kısım fazla hızlı geçmesin.

3.35–3.65
Cursor Ara butonuna gelir.
Click feedback.
Arama kutusu ana sonuç kartına morph olur.

EN KRİTİK DÜZELTME 2 — İKİNCİ İLAN KARTI ÇOK AŞAĞIDA

“Evlek bulur.” sahnesinde ikinci küçük peek kart şu an çok aşağıda ve bağımsız başka sahne gibi duruyor.

Düzeltme:
- ikinci kartı yaklaşık 180–220 px yukarı al
- ana kartın arkasında istiflenmiş his ver
- yalnızca alt kısmının yaklaşık %18–22’si görünsün
- ikinci kartı yaklaşık %92–94 scale kullan
- ana kartla aynı merkez aksına yaklaştır
- aradaki boş beyaz alanı azalt

Amaç:
peek kart, ayrı bir ikinci kart gibi değil, ana kartın arkasındaki başka seçenek gibi görünmeli.

EN KRİTİK DÜZELTME 3 — ANA KART HİYERARŞİSİ

Ana sonuç kartı:
- yaklaşık %6–8 büyüt
- “Evlek bulur.” ile kart arasındaki boşluğu biraz azalt
- alt satırdaki:
“Girne · Zeytinlik · 2+1”
kontrastını çok az artır
- Türk Koçanı badge’i biraz daha rafine ve premium yap

DİĞER FINAL DÜZELTMELER

- “Sadece bulmaz. Açıklar.” sahnesi kalsın
- veri kartlarını çok küçük bırakma
- “Örnek ekran” tek etiket olarak kalsın
- virtual staging sahnesinde:
  - 0.8 sn boş oda
  - 1.15 sn slider
  - 1.45 sn sonuç
  - 0.5 sn çıkış
- disclosure:
  “AI ile görselleştirildi” + “Temsilî”
  korunmalı
- piyasa sahnesinde küçük detayları değil 3 ana metriği vurgula
- kapanış CTA biraz büyüsün

TEKNİK FINAL
Mevcut v7 exportta ses kanalı yok.
Final exportta mutlaka ses olmalı:
- music + SFX
- no voiceover

Export:
- 1080x1920
- 30 fps
- H.264 High Profile
- 8–12 Mbps
- AAC stereo
- 48 kHz

Bu tur yeni konsept değil, final polishing turu.
Önce giriş + sonuç sahnesi düzelsin, sonra aynı dosyada full final export al.

## Assistant

_[tool: write_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Polish tamam — toplam 21.15 sn:

**Giriş yayıldı (3.65 sn):** liman 0–0.9 ("Sen tarif et." tam 0.9 sn okunur) → match-cut salon 0.9–1.75 (nefes, küçük mono "Deniz gören 2+1…") → kontrollü morph + "Evlek anlasın." + sorguya "≤ £180K" eklenişi 1.75–2.75 → kriter çipleri 0.11 sn stagger'la 2.75–3.35 → cursor + click + kart morph'u 3.35–3.65.

**Sonuç sahnesi:** peek kart 1620→610'a alındı — ana kartın arkasında aynı aksta, %93 scale, altından ~%19'u görünüyor; ana kart %7 büyüdü (940px, top 430, boşluk azaldı), alt satır kontrastı arttı, Türk Koçanı rozeti rafine (yarı saydam lacivert + hairline).

**Diğer:** staging 0.8/1.15/1.45/0.5 ritmine oturtuldu (3.9 sn), kapanış CTA büyüdü (470×102, 34px), Okuma morph geometrisi yeni kart konumuna eşlendi, ses marker'ları yeni zamanlara güncellendi.

Ses: HTML/DC dosyası ses kanalı taşıyamıyor — video export'u görüntü verir; müzik+SFX miksajı `OM_AUDIO_MARKERS` cue listesine göre kurguda eklenmeli (48 kHz AAC, H.264 8–12 Mbps export ayarları kurgu aracında).

## User

<pasted_text name="Pasted text (184 lines)">
Bu gerçekten son görsel polishing turudur. Yeni özellik veya yeni sahne ekleme. Mevcut V7.1 akışını koru; yalnızca giriş metinleri, okunabilirlik, sonuç kartlarının kompozisyonu ve morph geçişini düzelt.

1. GİRİŞ METİN MANTIĞI

Mevcut:
“Sen tarif et.”
“Deniz gören 2+1…”
“Evlek anlasın.”

yapısını kaldır.

Bunun yerine tek ve tamamlanan bir anlatı kullan:

Girne görseli:
“Aklındaki evi…”

Salon görseli:
“…sen tarif et.”

Arama ekranı:
“Evlek anlar.”

Bu üç metin tek bir düşünce olarak okunmalı:
“Aklındaki evi sen tarif et. Evlek anlar.”

2. GİRNE SAHNESİ — 0.00–1.00

01_girne_harbor_hook.jpg full-screen.

Metin:
“Aklındaki evi…”

Yerleşim:
- x: 96–110
- y: yaklaşık 485–565
- maksimum genişlik 650 px
- Outfit SemiBold/Bold
- 72–78 px
- Evlek laciverti #0A2540
- beyaz metin kullanma
- ağacın, çatının veya liman detaylarının üzerine yerleştirme
- üst/orta gökyüzü negatif alanına yerleştir

Metin 0.12–0.30 arasında girsin ve 1.00’a kadar tamamen okunur kalsın.

Görsel:
- sağdan sola %3–4 kontrollü pan
- 1.00 → 1.025 hafif push-in

3. SALON SAHNESİ — 1.00–2.10

02_mediterranean_livingroom.jpg kullan.

“Deniz gören 2+1…” metnini tamamen kaldır.

Yeni metin:
“…sen tarif et.”

Yerleşim:
- x: 105–125
- y: yaklaşık 585–690
- Outfit SemiBold/Bold
- 70–76 px
- #0A2540
- açık duvar alanında
- sandalye, sehpa, koltuk veya pencere üzerine gelmesin
- monospace kullanma

Metin 1.18–1.38 arasında girsin ve yaklaşık 2.05’e kadar okunur kalsın.

Girne görselinden salon görseline geçiş, aynı yatay hareketi devam ettiren 180–240 ms directional match-cut/mask transition olsun.
Flash veya beyaz fade kullanma.

4. ARAMA — 2.10–3.95

Salon kontrollü biçimde Evlek arama kutusuna dönüşsün.

Başlık:
“Evlek anlar.”

“Evlek anlasın.” kullanma.

Sorgu:
“Girne’de deniz gören,
Türk koçanlı 2+1”

Ardından:
“≤ £180K”

Küçük badge:
“AI arama”

2.95–3.60 arasında kriterler kısa confirmation state olarak aktive olsun:
Girne
Deniz manzarası
Türk Koçanı
2+1
≤ £180K

Chip’ler uzun süre kalmasın.
Ama okunmadan da geçmesin.
Toplam confirmation yaklaşık 0.6–0.7 saniye.

3.65–3.95:
cursor click ve sonuç morph.

5. EVLEK BULUR — ÜÇLÜ CARD DECK

Mevcut ana kartın altındaki text-only ikinci ilan satırını tamamen kaldır.

Bir ana kart + iki yan peek kart kullan.

Ana kart:
- ortada
- %100 scale
- mevcut salon görseli
- £165.000
- Girne · Zeytinlik · 2+1
- Türk Koçanı
- genişlik yaklaşık 850–900 px

Sol arka kart:
- 03_coastal_balcony_peek.jpg
- %92–94 scale
- ana kartın arkasında
- soldan yaklaşık 65–80 px görseli görünsün

Sağ arka kart:
- uygun üçüncü Girne/deniz görseli
- %92–94 scale
- ana kartın arkasında
- sağdan yaklaşık 65–80 px görseli görünsün

Yan kartların fiyat ve açıklamalarını okutmaya çalışma.
Yalnızca kart ve görsel kenarları görünerek çoklu sonuç hissi versin.

Animasyon:
- kartlar 80–100 ms stagger ile gelsin
- çok hafif carousel settle hareketi
- ana kart 1.00 → 1.025 focus
- yan kartlar ana kartın arkasına kapanır
- ana kart ilan detayına morph olur

Maksimum rotation:
sol -1°
sağ +1°
veya tamamen düz.

“Evlek bulur.” ile kart arasındaki boşluğu mevcut hâlden %15–20 azalt.
Ana kartı dikey merkeze biraz yaklaştır.
Büyük alt boşluk bırakma.

6. MORPH DÜZELTMESİ

Sonuç kartından “Sadece bulmaz. Açıklar.” sahnesine geçerken oluşan beyaz/soluk hayalet kareyi azalt.

- Ana kart opaklığını koru
- Fotoğraf shared element olarak devam etsin
- Fiyat ve konumun pozisyon sürekliliğini koru
- Kart büyürken arka plan değişsin
- crossfade yerine gerçek shared-element morph hissi ver

7. KORUNACAKLAR

- “Sadece bulmaz. Açıklar.”
- Virtual staging 0.8 / 1.15 / 1.45 / 0.5 ritmi
- “AI ile görselleştirildi” + “Temsilî”
- Piyasa sahnesi
- Büyütülmüş kapanış CTA
- Toplam yaklaşık 21–21.5 saniye

8. TEKNİK FINAL

HTML önizleme ses taşımasa da final export kurgu aracında mutlaka:
- music + SFX
- no voiceover
- 1080×1920
- 30 FPS
- H.264 High Profile
- 8–12 Mbps
- AAC stereo
- 48 kHz

Bu turdan sonra yeniden konsept üretme. Sadece yukarıdaki final düzeltmelerini uygula ve full final export hazırla.
</pasted_text>

## Assistant

_[tool: write_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Final polish uygulandı — 21.45 sn:

1. **Giriş anlatısı tek düşünce:** liman 0–1.0 "Aklındaki evi…" (lacivert, gökyüzü boşluğunda, 0.12–0.30 girer) → 0.21 sn yatay directional mask-cut (pan yönünü sürdürür, flash yok) → salon 1.0–2.1 "…sen tarif et." (lacivert, açık duvarda; mono kalktı) → arama başlığı "Evlek **anlar**."
2. **Üçlü card deck:** alttaki text-only kart kalktı; ana kart ortada (880px, %2.5 focus), solda peek-balkon −1°, sağda kiyi +1°, her biri kenardan ~70px görünür, ~90 ms stagger + settle; sahne sonunda yan kartlar ana kartın arkasına kapanıyor.
3. **Morph düzeltmesi:** foto shared-element olarak karttan (100,470,880×480) tam genişliğe büyüyor, fiyat+konum satırı kart pozisyonundan detay pozisyonuna sürekli lerp ediyor (50→62px), beyaz hayalet crossfade kalktı.
4. Kriter confirmation 2.95–3.60 (≈0.65 sn), click 3.65–3.95, staging ritmi ve kapanış CTA korunmuş; ses marker'ları yeni zamanlara güncel.

Not: Outfit projede gömülü değil — intro metinleri marka sansı Hanken Grotesk 700 ile (evlek.css'teki set). Ses/encode (music+SFX, H.264 8–12 Mbps, AAC 48 kHz) kurgu aracında `OM_AUDIO_MARKERS` cue'larıyla eklenmeli.

## User

sonuçlar kısmında kartlar altan gelsi stack olsa daha iyi olur 3-5 tane
sanal düzenlemenin sonunda evin potansiyelini gör yazısı biraz yukarı daha mantıklı bir alana taşınsa iyi olur

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

İki değişiklik uygulandı:

1. **Sonuçlar:** yan kartlar yerine 4'lü stack — ana kart morph'la oturur, arkasına 3 kart alttan sırayla (0.11 sn stagger) yükselip üst kenarları 34'er px görünecek şekilde istiflenir (her katman %5 küçülür).
2. **Staging:** "Evin potansiyelini gör." alttan üst sol başlık bölgesine (y≈360) taşındı — diğer sahnelerin başlık hizasıyla tutarlı; üst scrim okunabilirlik için hafif koyulaştırıldı.

## User

kartlar üst üste binmiş alt kısımda istiyorum ayrıca biraz daha sexy şekilde olmalı

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Stack ana kartın altına taşındı: 3 kart alttan yükselip ana kartın arkasına kaskad halinde oturuyor — her biri ~90px'lik bandıyla görünür, hafif alternatif rotasyon (−1° / +1.4° / −0.8°), derine doğru daralan genişlik, settle'lı giriş (0.12 sn stagger), katmanlı gölge + alt kenarda hafif lacivert degrade ile derinlik hissi.

## User

Virtual staging sahnesinin fotoğraflarını ve süresini genel olarak koru; fakat metin hiyerarşisini ve before/after anlatısını tamamen yenile.

MEVCUT SORUN

Şu anda:
- “AI ile görselleştirildi”
- “Temsilî”
- “Evin potansiyelini gör.”

aynı anda fazla baskın görünüyor.

Ana başlık slider’ın önce/sonra mantığını açıklamıyor ve disclosure ana mesajdan daha fazla dikkat çekiyor.

YENİ ANA FİKİR

Slider’ın kendisi metinsel hikâye olsun.

Başlangıçta tamamen boş oda göster.

Ana metin:
“Bugünkü hâli.”

Slider soldan sağa ilerleyerek döşenmiş odayı açsın.

Dönüşüm tamamlandığında ana metin:
“Olabileceği hâli.”

Kullanılacak final anlatı:
“Bugünkü hâli. Olabileceği hâli.”

SLIDER YÖNÜ

- İlk karede oda tamamen boş olmalı.
- Slider soldan sağa ilerlemeli.
- Döşenmiş versiyon soldan sağa açılmalı.
- Finalde ekran tamamen döşenmiş oda olmalı.
- Döşenmiş taraf solda, boş taraf sağda başlayan ters kompozisyonu kullanma.

ZAMANLAMA

0.00–0.75:
Tamamen boş oda.
“Bugünkü hâli.”
Metin en az 0.7 saniye okunur kalsın.

0.75–1.00:
Slider tutamacı aktive olsun.
Ana metin yumuşak şekilde kaybolsun.

1.00–2.20:
Slider soldan sağa ease-in-out hareket etsin.
Bu sırada büyük ana başlık gösterme.
İzleyici yalnızca dönüşümü takip etsin.

2.20–2.45:
Slider final konumuna hafif snap ile otursun.
Kısa visual confirmation feedback.

2.45–3.75:
Tamamen döşenmiş oda.
Yeni ana metin:
“Olabileceği hâli.”
Minimum 1.2 saniye tamamen okunur kalsın.

3.75–4.00:
Sonraki sahneye yumuşak geçiş.

ANA METİN TASARIMI

“Bugünkü hâli.” ve “Olabileceği hâli.”:

- aynı x/y başlangıç pozisyonunda
- aynı font ve ölçüde
- Outfit SemiBold/Bold
- yaklaşık 64–72 px
- beyaz
- sol üst veya sol orta açık duvar alanında
- çok hafif koyu scrim veya ince text shadow
- iki ayrı slogan değil, aynı cümlenin iki durumu gibi görünmeli

DISCLOSURE

Mevcut iki büyük pill’i kaldır:
- “AI ile görselleştirildi”
- ayrı büyük “Temsilî” pill

Yerine tek kompakt pill kullan:

“AI ile görselleştirildi · Temsilî”

- lacivert yarı saydam tek pill
- 24–26 px
- ekranın sol üst güvenli alanında
- ana metinden belirgin biçimde küçük
- uyarı bandı gibi görünmemeli
- bütün sahne boyunca sabit kalabilir
- tamamen büyük harf kullanma

GENEL

- “Evin potansiyelini gör.” metnini kaldır.
- Yeni slogan veya ek açıklama ekleme.
- Mimari geometriyi ve kamera açısını değiştirme.
- Slider hareketini sakin, premium ve anlaşılır tut.
- Dönüşüm tamamlandıktan sonra sonucu yeterince uzun göster.

## Assistant

_[tool: str_replace_edit]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Staging sahnesi yeni anlatıya geçti (4.0 sn):

- **0–0.75** tamamen boş oda + "Bugünkü hâli." (≥0.7 sn okunur)
- **0.75–1.00** tutamaç aktive olur, metin yumuşakça çıkar
- **1.00–2.20** slider soldan sağa ease-in-out, ekranda büyük başlık yok
- **2.20–2.45** snap + altın halka confirmation pulse'ı
- **2.45–3.75+** tamamen döşenmiş oda + aynı pozisyon/ölçüde "Olabileceği hâli." (≥1.2 sn)

"Evin potansiyelini gör." kalktı; iki pill tek kompakt yarı saydam lacivert pill'e indi: "AI ile görselleştirildi · Temsilî" (25px, sol üst, sahne boyunca sabit). Toplam süre 21.55 sn; marker'lara `staging-snap` cue'su eklendi.

## User

Save as standalone HTML: `Evlek Reel v7.dc.html`

## Assistant

_[tool: run_script]_

_[tool: super_inline_html]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: present_fs_item_for_download]_

Hazır — tek dosya, 5.8 MB, tamamen çevrimdışı çalışıyor (tüm görseller, fontlar, React ve animasyon motoru gömülü). Tarayıcıda açınca reel loop'ta oynar; scrubber'la gezilebilir.

