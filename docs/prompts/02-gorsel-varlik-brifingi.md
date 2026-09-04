# PROMPT 2 — GÖRSEL VARLIK BRİFİNGİ (SVG / PNG / doku talebi)

> ChatGPT'ye (görsel üretimi açık olan sürüme) yapıştır. Üretilen dosyaları
> `remotion/public/brandfilm/tex/` ve `remotion/public/kit/` altına koyacağız.

---

Evlek adlı KKTC emlak platformu için, kod içinde kullanılacak **üretim
varlıkları** hazırlamanı istiyorum. Bunlar dekoratif değil; bir video
render hattına girecek, o yüzden teknik şartname kesindir.

## MARKA VE STİL

- Renkler: lacivert `#0A2540` (ana çizgi), kobalt `#2F5CFF` (vurgu),
  krem `#F4F1EB` (zemin), altın `#C9A157` (nadir vurgu).
- Estetik: **editoryal baskı / kâğıt tiyatrosu.** Matbaa nişanları, kesik
  kâğıt kenarları, mürekkep dokusu. Akdeniz, sıcak, sakin, pahalı.
- **Yasak:** gradyan, neon, 3D render, drop-shadow gömülü görsel, emoji,
  stok-ikon görüntüsü, yuvarlak köşeli "app ikonu" hissi.
- Çizgi kalınlığı tek: 2px (24px ızgarada). Uçlar yuvarlak.

## TESLİM ŞARTNAMESİ (hepsi için geçerli)

- SVG'ler: tek renk `currentColor` ya da `#0A2540`, **gömülü gölge yok**,
  viewBox temiz, gereksiz grup yok, `<title>` etiketli.
- PNG'ler: **şeffaf zemin**, 2160px uzun kenar, gölge/vinyet gömülü değil.
- Dokular: **kenar geçişi tekrarlanabilir (seamless)**, nötr gri-krem,
  ortalama parlaklık 0.5 civarı — üstüne renk vereceğiz.
- Dosya adları: `kategori-isim.svg` (küçük harf, tire). Örnek: `ikon-yatak.svg`.
- Her paketi tek zip olarak ver, içinde `MANIFEST.txt` (dosya adı + ne olduğu).

---

## PAKET A — İKON SETİ (SVG, 24×24 ızgara, 2px çizgi)

Emlak ilan kartlarında ve rehber videolarında kullanılacak:

`yatak, banyo, metrekare, oda-sayisi, deniz-manzara, havuz, otopark,
asansor, esyali, bahce, teras, klima, jenerator, su-deposu, guvenlik,
okul, universite, market, hastane, otobus, plaj, restoran`

Her biri tanınabilir ve **KKTC bağlamına uygun** olsun (ör. su-deposu =
çatıdaki silindirik depo, jeneratör = kompakt kutu + egzoz).

## PAKET B — YAPI SİLUETLERİ (SVG, çizgi, cepheden)

KKTC yapı tipolojisi — abartısız, gerçekçi oranlarda:

1. `yapi-tas-villa` — iki katlı, taş kaplama cephe, geniş teras, düz çatı
2. `yapi-apartman-3kat` — 3 katlı, balkonlu apartman, çatıda su depoları
3. `yapi-sitedaire` — site içi bloklar, havuz, palmiye
4. `yapi-mustakil-eski` — geleneksel tek katlı Kıbrıs evi, kemerli sundurma
5. `yapi-proje-insaat` — vinç + iskele, "yapım aşamasında" bloklar
6. `yapi-stüdyo` — küçük öğrenci dairesi kesiti

Hepsi aynı çizgi kalınlığında, aynı perspektifte (düz cephe, izometrik değil).

## PAKET C — KKTC HARİTASI (SVG)

1. `harita-kktc-outline` — Kuzey Kıbrıs'ın **coğrafi olarak doğru** sınır
   çizgisi (tüm ada silueti içinde kuzey vurgulu). Tek path, dolgu yok.
2. `harita-kktc-sehirler` — aynı outline + 6 şehir noktası
   (Girne, İskele, Lefkoşa, Gazimağusa, Güzelyurt, Lefke), her nokta ayrı
   `<g id="girne">` gibi kimlikli olsun ki kodda ayrı ayrı boyayabileyim.
3. `harita-girne-semtler` — Girne bölgesi, semt noktaları kimlikli:
   Alsancak, Esentepe, Girne Merkez, Lapta, Çatalköy, Karşıyaka,
   Karaoğlanoğlu, Edremit, Doğanköy, Ozanköy, Bellapais, Zeytinlik.

**Doğruluk kritik:** yanlış bir harita güveni bitirir. Emin olmadığın
noktayı koyma, hangi noktalardan emin olmadığını yaz.

## PAKET D — KÂĞIT VE MALZEME DOKULARI (PNG, 2160px, seamless)

`doku-kraft-kagit, doku-eskiz-kagidi, doku-gazete-kagidi,
doku-mavi-kopya-izgara, doku-keten-bez, doku-beton-siva,
doku-karton-kenar, doku-el-yapimi-kagit, doku-toner-lekesi,
doku-mürekkep-tarama`

Her biri **düz aydınlatmada taranmış gibi** olsun — yapay ışık, vinyet,
gölge yok. Bunlar nesnelerin içine gireceği için düz ve nötr olmalı.

## PAKET E — DAMGA VE İŞARETLER (SVG)

1. `damga-onayli-emlakci` — dairesel mühür, ortada onay işareti, çevresinde
   "EVLEK ONAYLI EMLAKÇI" yazısı. Mürekkep basılmış hissi (kesintili kenar).
2. `damga-kktc` — KKTC ibareli küçük dikdörtgen damga
3. `damga-tarih` — içi boş tarih kutusu (kodda tarih basacağım)
4. `isaret-ok-elle` — elle çizilmiş ok (3 varyant: sağ, sol, aşağı)
5. `isaret-daire` — elle çizilmiş vurgulama dairesi (oval, kapanmamış)
6. `isaret-alti-cizili` — elle çizilmiş alt çizgi (3 varyant)
7. `isaret-parantez` — köşeli parantez çifti, elle çizilmiş
8. `isaret-onay` — elle çizilmiş tik
9. `ofis-atas, ofis-zimba, ofis-toplu-igne, ofis-bant-parcasi` (4 varyant bant)

## PAKET F — FOTOĞRAF YÖNÜ (üretilecek görseller)

Bunları görsel üretimiyle yapacaksan şu yönde üret; **fotogerçekçi, sıcak
Akdeniz gün ışığı, geniş açı yok, insan yok, marka/logo yok:**

1. `ev-tas-villa-dis` — taş kaplama villa dış cephe, zeytin ağacı, öğleden
   sonra ışığı
2. `ev-daire-balkon` — deniz gören balkon, sade mobilya
3. `ev-salon` — ferah salon, doğal ışık, nötr renkler
4. `ev-mutfak` — sade modern mutfak
5. `ev-yatak-odasi` — sakin yatak odası
6. `sokak-alsancak` — Akdeniz sokak dokusu, bougainvillea, taş duvar
7. `sahil-girne` — kayalık sahil, sabah ışığı
8. `insaat-etap` — yapım aşamasında site, vinç, temiz şantiye

Hepsi **3:2 yatay ve 4:5 dikey** iki versiyonda, en az 2160px.

---

## ÖNCE ŞUNU YAP

Üretime başlamadan önce bana şunu ver:
1. Bu listeden **hangilerini gerçekten yapabileceğini** (SVG üretimi, doku
   üretimi, fotoğraf üretimi ayrı yetenekler)
2. Hangi paketten başlamamı önerdiğini (en çok işe yarayacak olan)
3. Harita için hangi kaynaktan çalışacağını ve doğruluk konusunda ne kadar
   emin olduğunu

Sonra paket paket ilerleyelim; her paketi bitirince zip + MANIFEST ver.
