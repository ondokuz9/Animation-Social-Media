# Evlek Haftalık Video Sistemi

Amaç: her hafta farklı, yüksek kaliteli, evlek.app çevresinde (müşteri, emlakçı,
KKTC, emlak, inşaat) kısa video üretmek — aynı zanaat çizgisiyle, ama grid'de
asla tekrar etmeden.

## İlke: FORMAT × İÇERİK × DÜNYA

Her video üç kararın birleşimidir:

| Karar | Seçenekler | Ne sağlar |
|---|---|---|
| **Format** (sabit koreografi, Remotion composition) | Pazar Nabzı · Aynı Ev (problem) · Semt Rehberi · Emlakçı İçin · Evlek Nasıl Çalışır · Proje/İnşaat | Kalite garantisi: fizik, timing, QC bir kez çözülür |
| **İçerik** (haftalık JSON, `content/`) | Şehir/semt, sayılar, kopya, fotoğraf | Her hafta yeni video = yeni JSON + render, yeni tasarım değil |
| **Dünya** (görsel palet) | Krem+kâğıt · Kobalt · Koyu lacivert+gold · Duotone foto | Grid'de farklılık; art arda iki hafta aynı dünya kullanılmaz |

Sabit olan: fizik kuralları (tek %5 aşım, gölge 3 kare önce, fade/dissolve yok,
tek-kütle baskı, statik doku), Instagram paleti (krem `#F4F1EB`, kobalt `#2F5CFF`,
lacivert `#0A2540`, gold yalnız emlakçı dünyasında), lockup sol altta,
kaynak satırı her veri karesinde.

## Formatlar

| Format | Süre | Veri kaynağı | Kime | Dünya |
|---|---|---|---|---|
| **Pazar Nabzı** ✅ `PazarNabzi` | 15s | Evlek MCP `get_price_index` / `compare_cities` (canlı) | Alıcı + emlakçı | Krem + kobalt şerit |
| Aynı Ev (problem) ✅ `EvlekBrandFilm15/06` | 15s / 6s | Sabit | Alıcı | Krem kolaj + kobalt |
| Semt Rehberi | 15s | Evlek repo `content/semt/*.md` (51 semt) + gerçek foto | Alıcı / yatırımcı | Duotone foto + krem |
| Emlakçı İçin | 15s | Ürün gerçeği (5 dil, AI arama, onaylı rozet) | Emlakçı | Koyu lacivert + gold |
| Evlek Nasıl Çalışır | 10s | Gerçek UI (ekran kaydı / UI mock) | Alıcı | Kobalt + beyaz kart |
| Proje / İnşaat | 15s | Geliştirici verisi (teslim tarihi, etap, ödeme planı — MCP `payment_plan`) | Yatırımcı | Krem + gold çizgi |

## Haftalık akış (Pzt–Cum, ~2 saat insan zamanı)

1. **Pzt — veri çek:** MCP'den canlı sayılar → `content/pazar-nabzi-<hafta>.json`.
   Medyan yoksa gösterilmez; sayılar her zaman kaynak-tarihli.
2. **Sal — içerik seç:** bu haftanın 2. videosu için format + dünya (rotasyon tablosuna göre).
3. **Çar — render:** `npx remotion render src/index.js <Format> --props=../content/<dosya>.json`
   → ProRes → H.264 (CRF 15, preset slow, GOP 120, BT.709, sessiz, faststart).
4. **Per — QC:** kontak sayfası (`ffmpeg fps=1 tile`), ilk/son kare loop kontrolü,
   ffprobe (kare sayısı tam, tek stream, BT.709), gözle: fade yok, gölge fiziği,
   metin 1:1 güvenli alanda.
5. **Cum — yayın:** özel kapak (kit'ten), caption ilk 125 karakter, 5 hashtag,
   konum Girne, UTM'li link ilk yorumda. Ölçüt: **emlakçı kaydı**, izlenme değil.

## Rotasyon (grid'de tekrar yok)

Hafta A: Pazar Nabzı (krem) + Emlakçı İçin (koyu)
Hafta B: Semt Rehberi (duotone) + Evlek Nasıl Çalışır (kobalt)
Hafta C: Pazar Nabzı (krem, farklı şehir) + Aynı Ev cutdown (kolaj)
Hafta D: Proje/İnşaat (krem+gold) + Emlakçı İçin (koyu, farklı argüman)

## Dürüstlük kuralları (değişmez)

- Uydurma sayı yok. MCP `medianPrice: null` döndürürse medyan gösterilmez; sayım gösterilir.
- Üretilmiş (AI) ev görseli gerçek ilan numarasıyla yan yana gelmez.
- Her veri karesinde `KAYNAK: EVLEK.APP CANLI İLAN VERİSİ · <tarih>`.
- "komisyonsuz", ilk-üç vaadi, koçan/hukuk iddiası yok (Product Truth).
- Türkçe ana dil; İngilizce yalnız yatırımcı serisinde, ayrı format olarak.

## Komutlar

```bash
# haftalık veri → JSON (elle ya da MCP'den), sonra:
cd remotion
npx remotion render src/index.js PazarNabzi ../out/pazar-nabzi-<hafta>.mov \
  --props=../content/pazar-nabzi-<hafta>.json --codec=prores --prores-profile=hq --muted
ffmpeg -i ../out/pazar-nabzi-<hafta>.mov -c:v libx264 -preset slow -crf 15 -tune grain \
  -profile:v high -level 4.2 -pix_fmt yuv420p -r 60 -fps_mode cfr \
  -x264-params keyint=120:min-keyint=120:scenecut=0:open-gop=0 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -movflags +faststart -an ../out/Evlek_PazarNabzi_<hafta>_9x16_60fps.mp4
```

Yeni format eklemek: `remotion/src/formats/<Ad>.jsx` + `content/<ad>-ornek.json`
+ `Root.jsx`'te `defaultProps` ile kayıt. Marka filmi ve onaylı master'lara dokunulmaz.

---

# v2 — DERİNLİK, TREND VE SÜRDÜRÜLEBİLİRLİK KATMANI (3 Eylül 2026)

## 1. Zanaat tek yerde: `remotion/src/formats/kit.jsx`

Kalite artık her formatta yeniden çözülmüyor; miras alınıyor. Kit şunları taşır:

- **Fizik:** `place` (tek %5 aşım, tek dönüş, asla scale), `press` (tek kütle
  merdane baskısı — harf harf yazma yok, fade yok), `drawLine` (yalnız çizgiler
  için), `CastShadow` (niyet 3 kare önce, uçuşta TEK geniş ambient, temas
  karesinde sert çift).
- **Malzeme:** `PaperGround` (kireç sıva + tooth), `StockCard` (kesik kenar +
  fiber + kendi dokusu), `InkBar` (içinde gerçek kobalt tarama olan mürekkep
  şeridi — düz dolgu değil), `CobaltBoard` (kapanış dünyası, fiziksel iniş/kalkış).
- **Tipografi ve yerleşim:** `Kicker`, `Headline`, `SourceLine`, `Lockup`,
  `Registration` (pres nişanları), 84px kenar, 1:1 güvenli bant.

Yeni format açmak artık **senaryo yazmak**, tasarım sistemi kurmak değil.

## 2. Amiral format: `PazarRaporu` (25s / 1500 kare)

Beş perdede argüman kurar: haftanın sayısı → ülke kırılımı (4 şehir) →
kazananın içi (Girne'nin "proven" semtleri) → ikinci pazar (İskele/Long Beach)
→ okuma cümlesi → kobalt kapanış + fiziksel loop.

Eylül 2026 kısa video araştırması formatı belirledi: 20–45 sn aralığı uzun
formatlardan iyi performans veriyor, ilk iki saniye izlenmeyi belirliyor ve
**hiper-yerel pazar güncellemeleri** en çok paylaşılan tür. Bu yüzden sayı
00.45'te ekranda, film 25 saniye, her ekran tek fikir.

## 3. Trend girdisi — ne kullanıldı, ne kullanılmadı

| Kaynak | Durum | Kullanım |
|---|---|---|
| Evlek MCP (`get_price_index`, `compare_cities`, `list_locations`) | ✅ canlı | Her videonun sayıları |
| Kısa video format araştırması (Eylül 2026) | ✅ | Süre, ilk 2 sn, haftada 3 gönderi kadansı |
| SE Ranking anahtar kelime veritabanı | ❌ KKTC terimlerini kapsamıyor (0 satır) | Kullanılmadı — hacim uydurulmadı |
| Evlek repo SEO çalışması | ✅ | Konu seçimi (semt/şehir sayfaları) |

## 4. Delta motoru — haftadan haftaya gerçek değişim

Her çekim `content/snapshots/` altına yazılır. `scripts/delta.mjs` iki snapshot
arasındaki farkı üretir ve **6 günden kısa aralığı haftalık delta saymayı
reddeder**. W40'tan itibaren videolarda gerçek "bu hafta +N" çipi açılır.

## 5. Tek komut: `scripts/hafta.mjs`

```bash
node scripts/hafta.mjs PazarRaporu content/pazar-raporu-2026-W37.json
```

Sırayla: içerik kontrolü (kaynak satırı zorunlu) → ProRes render → H.264 sosyal
encode → **ffprobe kapısı** (tam kare sayısı, 60 CFR, tek stream, BT.709) →
kontak sayfası → sha256 → `baselines/` pini. Kapıyı geçemeyen dosya teslim
edilmez; haftalık tempo kaliteyi düşürmenin mazereti olamaz.

## 6. Takvim: `content/takvim-12-hafta.json`

12 hafta × haftada 3 gönderi (1 video + 2 statik), format ve dünya rotasyonlu,
her hafta veri kaynağı ve eksik girdi ("FOTO GEREK", "EKRAN KAYDI GEREK")
işaretli. Yan yana iki hafta aynı dünyayı kullanmaz.
