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
