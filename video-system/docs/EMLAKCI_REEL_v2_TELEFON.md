# Emlakçı Reel'i v2 · "Asistan Evlek'i okuyor" · telefon kurgusu

**Kitle:** KKTC emlak ofisleri ve bağımsız emlakçılar.
**Kampanya cümlesi:** **"Bir kere yaz. Her yerde görün."**
**Süre:** 14.4 sn · 1080×1920 · 60 fps · 864 kare
**Motor:** Remotion → PNG sekansı → mevcut `encode.mjs` (BT.709 limited, faststart)

---

## 1 · Neden bu kurgu

Önceki versiyonlar soyut kaldı: cevap bloğu, iskelet çizgiler, temsilî rakamlar. İzleyici Evlek'in ne yaptığını tahmin etmek zorundaydı.

Bu versiyonda film **bir telefonun ekranında** geçiyor ve gösterdiği şey gerçek: alıcı yapay zekâ asistanına soruyor, asistan **Evlek'in canlı verisini okuyup** cevap veriyor. Evlek'in MCP sunucusu bunu bugün yapıyor — yani reklam bir vaat değil, bir kayıt.

Sonra aynı telefon emlakçının tarafına dönüyor: tek ilan girişi → çıktılar → eşleşme → ve baştaki cevabın içine emlakçının ilanı giriyor. Film başladığı yerde bitiyor.

---

## 2 · Ekrandaki veri — hepsi canlı

`evlek.app` üretiminden 5 Ağustos 2026'da çekildi (Evlek MCP: `search_listings`, `get_price_index`).

| alan | değer |
|---|---|
| Sorgu | Girne · 2+1 · daire · ≤ £180.000 |
| Eşleşen aktif ilan | **23** |
| Kart 1 | **£115.000** · Girne · Karakum · 2+1 · 75 m² |
| Kart 2 | **£125.000** · Girne Merkez · 2+1 · 100 m² |
| Kart 3 | **£130.000** · Girne · Alsancak · 2+1 · 80 m² |
| Piyasa satırı | **Girne medyanı £158.500** (86 aktif satılık ilan) |

**"Örnek ekran" etiketi kaldırıldı** — veri temsilî değil, gerçek. Bunun karşılığı: rakamlar zamanla değişir. Brief'e çekim tarihi yazıldı; yayından önce yenilenirse kartlar güncellenir.

> Karar noktası: **"23 aktif ilan"** sayısı ekranda kalsın mı? Kalırsa güçlü ve doğrulanabilir olur ama bir hafta sonra değişir. Alternatif: sayıyı çıkarıp yalnızca kartları ve medyanı göstermek. Öneri: **kalsın**, altına tarih yazmadan — bir anlık görüntü olduğu zaten anlaşılır.

---

## 3 · Marka kuralında bilinçli sapma

Önceki bütün brief'lerde "bilinen sohbet arayüzünü taklit etme" kuralı vardı. Bu kurgu bir sohbet arayüzü gösteriyor — **kasıtlı ve onaylı.**

Sapmayı güvenli tutan üç şey:

1. Arayüz **Evlek'in kendi dili**: krem zemin, lacivert mürekkep, altın vurgu, Hanken Grotesk. Hiçbir bilinen ürünün balon şekli, rengi, avatarı veya ikonu kullanılmıyor.
2. Hiçbir **ürün/marka adı** geçmiyor. Asistan isimsiz; yalnızca "asistan" olarak var.
3. Cevabın kaynağı açıkça **evlek.app** olarak işaretli — taklit değil, atıf.

---

## 4 · Kurgu — 14.4 sn

Telefon bütün film boyunca kadrajda. Cihaz çerçevesi sade, markasız, koyu; ekran 1080×1920'nin ortasında ~%78 genişlikte, hafif perspektifle.

### PERDE 1 — Alıcı tarafı

| # | an | ekranda | metin |
|---|---|---|---|
| A1 | 0.00–1.30 | Telefon zaten hafif hareket hâlinde. Ekranda sohbet boş. Sağdan alıcının mesajı yaylı girer. | mesaj (EN): **"2+1 in Kyrenia, sea view, under £180,000"** |
| A2 | 1.30–2.10 | Mesajın altında ince altın çizgi soldan sağa süpürür, küçük **evlek** çipi bir kez nabız atar — veri çekiliyor. | mikro etiket: **evlek.app** |
| A3 | 2.10–4.30 | Asistanın cevabı **kelime kelime** açılır. Ardından üç gerçek ilan kartı 90 ms arayla alttan girer. | cevap: **"Girne'de 23 aktif ilan var. En uygun üçü:"**<br>kartlar: £115.000 Karakum · £125.000 Girne Merkez · £130.000 Alsancak |
| A4 | 4.30–5.60 | Kartların altında tek satır piyasa bağlamı belirir; sohbet yumuşakça yukarı kayar. | **"Girne medyanı £158.500"** |
| A5 | 5.60–6.60 | Ekranın üstüne emlakçıya dönen ilk cümle düşer (telefon dışında, kadrajın üst güvenli alanında). | **"Alıcı artık böyle arıyor."** |

### PERDE 2 — Emlakçı tarafı

| # | an | ekranda | metin |
|---|---|---|---|
| B1 | 6.60–7.40 | Sohbet yukarı süpürülür, telefon 3° yatıp geri döner; ekranda emlakçının ilan girişi belirir: bir fotoğraf, üç alan. | **"Sen bir kere yaz."** |
| B2 | 7.40–10.20 | Tek girişten üç çıktı sırayla tikle oturur. Her tik telefonu çok hafif titretir (2 px). | **5 dilde açıklama yazıldı**<br>**Koçan · m² · bölge fiyatı eklendi**<br>**Fotoğraflar düzenlendi** *(AI ile görselleştirildi · Temsilî)* |
| B3 | 10.20–11.60 | İlan ortada; çevresinde üç alıcı kriteri çipi belirir, ikisi altınla kilitlenir, biri söner. | **"İlanın analiz edilir, doğru alıcıya çıkar."** |
| B4 | 11.60–12.90 | Ekran perde 1'deki sohbete geri döner — aynı cevap, ama bu kez **en üstteki kart emlakçının ilanı.** Altın çerçeveyle oturur. | **"Ve o cevabın içinde sen varsın."** |
| B5 | 12.90–14.40 | Telefon kadraj dışına süzülür, lacivert kapanış iner: wordmark, altın çizgi, CTA. Son 1.2 sn tam sabit. | **"Bir kere yaz. Her yerde görün."**<br>**evlek.app** |

**Döngü:** son lacivert kare, ilk karedeki koyu telefon çerçevesiyle tonal olarak eşleşir; tekrar başladığında kesme hissi olmaz.

---

## 5 · Hareket şartnamesi

Bütün easing: `cubic-bezier(0.22, 1, 0.36, 1)` — markanın mevcut eğrisi. Elastic bounce yok.

**Telefon (film boyunca, hiç durmaz)**
- `rotateY`: −2.4° → +1.2°, tek yönlü, 14.4 sn'ye yayılmış
- `scale`: 1.000 → 1.035, doğrusal değil, çok yavaş ease-out
- `rotateZ`: perde geçişinde 0° → 3° → 0°, 0.8 sn — hareketin ağırlığını verir
- Ekran içeriği cihazla birlikte perspektif alır; ayrı katman gibi kaymaz

**Mesaj girişi (A1, her mesaj)**
- `translateY`: 24 → −4 → 0 px, 0.34 sn
- `scale`: 0.96 → 1.02 → 1.00
- `opacity`: 0 → 1, ilk %60'ta tamamlanır

**Cevap metni (A3)**
- **Kelime kelime** açılır, ~14 kelime/sn. Karakter karakter daktilo kullanılmaz — 60 fps'te ucuz görünür.
- Her kelime kendi içinde 0.12 sn `opacity` + 6 px `translateY`
- Metin biterken 3 px genişliğinde altın kursör 0.25 sn'de söner

**Veri çekme nabzı (A2)**
- Altın çizgi soldan sağa 0.42 sn'de süpürür, arkasında 40 px yumuşak kenar bırakır
- **evlek** çipi eşzamanlı `scale` 1.00 → 1.06 → 1.00 ve `opacity` 0.7 → 1 → 0.85

**İlan kartları (A3)**
- Stagger 90 ms
- `translateY` 20 → 0 px, `scale` 0.96 → 1.00, 0.30 sn
- Gölge kart oturduktan sonra 0.15 sn içinde yumuşar (yerçekimi hissi)

**Sohbet kaydırma (A4)**
- İçerik ekranı aştığında 0.55 sn ease-out ile kayar, sıçrama yok
- Kaydırma sırasında üstteki mesajlar %30 opaklığa düşer

**Perde geçişi (B1)**
- Sohbet katmanı yukarı `translateY(-100%)`, yeni katman alttan `translateY(100%)` → 0, 0.62 sn
- Telefonun `rotateZ` eğilmesi geçişin ilk yarısında zirve yapar

**Çıktı tikleri (B2)**
- Her satır: `translateY` 16 → 0, `opacity` 0 → 1, 0.28 sn
- Tik işareti SVG `stroke-dashoffset` ile 0.22 sn'de çizilir
- Telefon gövdesi tik anında 2 px `translateY` ile sarsılır, 0.18 sn'de yerine oturur

**Eşleşme kilidi (B3)**
- Çipler 0.12 sn arayla belirir
- Kilitlenen ikisi: altın çerçeve `opacity` 0 → 1 + `scale` 1.04 → 1.00, kısa altın halka nabzı
- Sönen çip: `opacity` 1 → 0.25, `filter: saturate(0.3)`, 0.4 sn

**Kapanış (B5)**
- Lacivert katman yukarıdan `translateY(-100%)` → 0, 0.42 sn
- Wordmark `scale` 1.02 → 1.00 + fade, altın çizgi `scaleX` 0 → 1 soldan
- CTA'da tek seferlik ışık süpürmesi, sonra tam sabit

**Genel kural:** hiçbir noktada 1.0 sn'den uzun hareketsizlik yok — telefonun sürekli parallax'ı bunu zaten garantiler. Son 1.2 sn bilinçli istisna.

---

## 6 · Ses marker'ları

| t (sn) | cue | karakter |
|---|---|---|
| 0.00 | `intro-bed` | sakin, düşük yatak |
| 0.35 | `message-send` | mesaj gönderme, kuru ve kısa |
| 1.35 | `data-fetch` | altın süpürme ile eşzamanlı, tonal yükseliş |
| 2.15 | `answer-stream` | kelimeler açılırken çok hafif doku |
| 3.10 / 3.20 / 3.30 | `card-land` ×3 | kartlar otururken |
| 4.35 | `context-tick` | medyan satırı |
| 6.60 | `side-flip` | perde geçişi, hava ve ağırlık |
| 7.70 / 8.60 / 9.50 | `output-tick` ×3 | çıktı tikleri |
| 10.40 / 10.70 | `match-lock` ×2 | eşleşme kilidi, altın |
| 11.70 | `you-are-in` | emlakçının kartı cevaba girerken — filmin duygusal zirvesi |
| 12.95 | `close-sweep` | lacivert iner |
| 13.30 | `sonic-logo` | marka imzası, kuyruk CTA'ya uzanır |

---

## 7 · Varlıklar

| varlık | kaynak | durum |
|---|---|---|
| Telefon çerçevesi | kodla çizilir (sade, markasız) | ✔ üretim gerekmez |
| Üç ilan kartı görseli | canlı ilanların kapak fotoğrafları (`coverImageUrl`) | indirilecek |
| Emlakçının ilan fotoğrafı | `img/room-01-akdeniz.jpg` | ✔ mevcut |
| Wordmark | `img/wordmark.png` | ✔ mevcut |
| Sohbet, kartlar, çipler, tikler | kodla çizilir | ✔ |

> Canlı ilanların kapak fotoğraflarını kullanmak için ilan sahiplerinden izin gerekiyorsa, o üç kart yerine mevcut proje görselleri kullanılır — kurgu değişmez.

---

## 8 · Yayın metni

Ekranda tek hedef: `evlek.app`. İletişim adresi açıklamaya girer.

> Alıcılar aramaya artık yapay zekâdan başlıyor. Asistan yalnızca okuyabildiği ilanı söyleyebiliyor.
>
> Evlek'te ilanını bir kere yazıyorsun: açıklaman beş dile çevriliyor, koçan bilgisi, metrekare ve bölge fiyatı ekleniyor, fotoğrafların düzenleniyor. İlanın analiz edilip doğru alıcının karşısına çıkıyor — ve yapay zekâ asistanları onu okuyabiliyor.
>
> Bir kere yaz. Her yerde görün → evlek.app
> Emlak ofisleri için: hello@evlek.app
