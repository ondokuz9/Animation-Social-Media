# Emlakçı Reel'i v4 · üretim kitabı

**"Sen ilanı koy. Gerisi Evlek'te."**
1080×1920 · 60 fps · gövde 17.5 sn + kanca 2.5 sn = **20.00 sn / 1200 kare**
Remotion → PNG sekansı → `encode.mjs` (H.264 High L4.2, yuv420p, BT.709 limited, faststart)

---

## 0 · Roller — bu işi kim yapar, ne getirir

Tek kişilik bir iş değil; her rolün ayrı bir disiplini var. Hepsini ben üstleniyorum ama **hangi şapkayla ne karar verdiğim ayrık** olsun ki tartışabilelim.

| rol | bu projede ne yapar | çıktısı |
|---|---|---|
| **Kreatif direktör** | Omurgayı korur, neyin **dışarıda** kalacağına karar verir. En zor işi bu: her yeni özellik filme girmek ister. | bölüm 1 |
| **Metin yazarı (UX writer)** | Ekrandaki her kelime. Türkçe, kısa, fiil odaklı. 5 kelimeyi geçen satır gerekçe ister. | bölüm 6 |
| **Ürün tasarımcısı** | Ekranda görünen Evlek arayüzü. Gerçek ürüne benzemezse kaydolan emlakçı aldatılmış hisseder — bu rolün tek görevi o boşluğu kapatmak. | bölüm 5 |
| **Motion tasarımcı** | Süre/easing token sistemi, imza hareketi, her öğenin fiziği. Tutarlılık burada kazanılır. | bölüm 3–4 |
| **Ses tasarımcısı** | Sessiz-öncelikli miks, cue haritası, LUFS hedefleri. | bölüm 7 |
| **Performans pazarlamacı** | Kanca varyantları, test planı, dağıtım, KPI. Filmi *çalıştıran* rol. | bölüm 2, 10 |
| **Render mühendisi** | Remotion, deterministik render, encode şartnamesi, QC. | bölüm 9, 11 |
| **Kırmızı takım / uyum** | İddia disiplini: ürünün yapmadığı hiçbir şey ekranda görünmeyecek. Açıklama etiketleri. | bölüm 12 |

---

## 1 · Strateji

### Omurga: ilanın yolculuğu
Tek bir ilan sisteme girer; film onun başına gelenleri izler. Arama, staging, diller, eşleşme, AI görünürlüğü — hiçbiri "madde" değil, o yolculuğun durakları.

### İkna mekanizması: emek asimetrisi
**Emlakçı ekrana bir kez dokunur** (0.00–1.40, "Yayınla"). Kalan 18.6 saniye boyunca bir daha dokunmaz. İzleyici bunu bilinçli fark etmez ama hisseder: *ben bir şey yaptım, sistem altı şey yaptı.* Biçim mesajı taşır.

### Rakip farkı — laf çakmadan
Eski yöntem **hiç gösterilmez**. Karşılaştırma yok, "onlar/biz" yok, ekranda rakip izi yok. Fark yalnızca fiillerde: filtre seçmek yerine cümle yazılır, sayfa gezmek yerine cevap gelir, her yere yeniden yazmak yerine bir kere yazılır, görülmek için uğraşmak yerine ilan doğru alıcıya kendisi çıkar.

### Yapay zekâ vurgusu
"Yapay zekâ" ekranda **tam bir kez** geçer (14.20). Öncesinde 14 saniye boyunca çalışırken gösterilmiştir. Adlandırma, kanıttan sonra gelir.

### Dışarıda kalanlar — bilinçli
Koçan, fiyat geçmişi, yatırım hesaplayıcı, doğrulama rozeti, çok şehir. Hepsi gerçek ve hepsi güçlü; **hiçbiri bu filme girmiyor.** Yedi durak zaten üst sınır. Bunlar ikinci ve üçüncü filmin konusu.

---

## 2 · Modüler mimari — filmin en önemli üretim kararı

Performans kreatifinde 2026 standardı net: **hook, açı ve format** performansı taşıyan üç kaldıraçtır, ve **tam reklamı değil kancayı test edersin.** Öneri: 4–6 kanca varyantı, iki aşamalı test — önce kanca *aileleri*, kazanan ailenin içinde varyantlar.

Bu yüzden film **iki parça** olarak inşa edilir:

```
[ KANCA 0.00–2.50 ]  ← değiştirilebilir, 5 varyant
[ GÖVDE 2.50–20.00 ]  ← sabit, bir kez üretilir
```

Kesişme noktası **2.50 sn**: "Yayınla" basılmış, ilk çıktı henüz başlamamış. Her kanca bu duruma bağlanır, gövde hiç değişmez.

Pratik sonucu: **5 farklı reklam, tek gövde render'ıyla.** Yeni kanca üretmek 20 dakika, tam film 25 dakika değil.

### Kanca varyantları (5)

| # | aile | metin | görsel |
|---|---|---|---|
| **H1** | merak | **"İlanı koydun. Şimdi ne oluyor?"** | form dolu, parmak Yayınla'ya basar |
| **H2** | problem | **"İlanın koyduğun gibi kalmasın."** | form dolu, kart soluk bekliyor, sonra canlanır |
| **H3** | sonuç | **"Bir ilan koydun. Altı iş yapıldı."** | Yayınla basılır, arkada altı tik hızlıca parlar |
| **H4** | doğrudan hitap | **"Emlakçıysan bunu bir kere izle."** | ekran karanlıktan açılır, form belirir |
| **H5** | desen kırma | **"Bu ilanı sen yazmadın."** | açıklama kendi kendine yazılırken görünür |

H1 birincil (mevcut kurgu ona göre yazıldı). H5 en riskli ve en yüksek tavanlı.

---

## 3 · Perde perde — kare kare

Telefon film boyunca kadrajda. Ekran 1080×1920'nin **%80'i** (864×1536 civarı), hafif perspektif, cihaz çerçevesi sade koyu grafit, marka yok.

Aşağıdaki `t` değerleri **film zamanı** (kanca dahil). Kare = `t × 60`.

### P1 · YAYINLA — 0.00–1.40 (kanca bölgesi, H1)

| t | öğe | hareket |
|---|---|---|
| 0.00 | Telefon zaten `rotateY −2.4°`, `scale 1.000`; ekranda ilan formu dolu: fotoğraf, başlık alanı, fiyat alanı, **Yayınla** düğmesi | parallax başlamış, **boş kare yok** |
| 0.15 | Kanca satırı üst güvenli alana düşer (y≈300) | `translateY 20→0`, `opacity 0→1`, **`dur-md` 280 ms**, `ease-out` |
| 0.62 | İmleç kadrajın sağ altından girer, Yayınla'ya doğru yol alır | `translate` yay ile, 0.46 sn, hafif yavaşlayarak |
| 1.08 | **Basma** | düğme `scale 1.00→0.97→1.00`, **`dur-xs` 180 ms**; altın halka `inset 0→−8px`, `opacity 0.7→0`, `dur-md` |
| 1.20 | **Gecikme** — hiçbir şey olmaz | 120 ms. *İnandırıcılığın tamamı burada.* |
| 1.32 | Onay: kartın kenarında ince altın çizgi bir kez döner | `stroke-dashoffset`, 0.34 sn |

### P2 · EVLEK TAMAMLIYOR — 1.40–4.60

| t | öğe | hareket |
|---|---|---|
| 1.40 | Form, ilan kartına dönüşür (aynı fotoğraf, yeni yerleşim) | shared-element morph, `dur-lg` 420 ms, `ease-in-out` |
| 1.75 | Üst metin değişir: **"Açıklaman yazılıyor."** | eski satır `ease-in` çıkar (`dur-sm` 200 ms), yeni satır `ease-out` girer |
| 1.90–3.10 | Kart içinde açıklama **kelime kelime** yazılır (~9 kelime/sn). Gerçek cümle değil, ürünün yazdığı tipik açıklama: `Girne Zeytinlik'te, denize yürüme mesafesinde, geniş balkonlu 2+1 daire.` | her kelime `opacity 0→1` + `translateY 6→0`, 120 ms; imleç 1.06 Hz |
| 3.10 | Metrik satırı oturur: **95 m² · 2+1 · Girne · Zeytinlik** | `translateY 14→0`, `dur-sm`, stagger 60 ms |
| 3.40 | Üst metin: **"Beş dile çevriliyor."** | |
| 3.55–4.45 | Dil rozetleri sırayla çevrilir **TR → EN → RU → DE → AR**. Her çevrimde kartın açıklama satırı o dile *dönüşür* (harf harf değil, blok halinde çapraz geçiş) | rozet `rotateX 0→90→0` 220 ms; metin blok `opacity` çapraz geçişi 180 ms; aralar 220 ms |
| 4.45 | Beş rozet birlikte kalır, hafif nabız | `scale 1.00→1.02→1.00`, 300 ms |

### P3 · FOTOĞRAF HAZIRLANIYOR — 4.60–7.80

| t | öğe | hareket |
|---|---|---|
| 4.60 | Kart, fotoğrafı tam ekrana açar | `scale` + `border-radius` morph, `dur-lg` |
| 4.75 | Üst metin: **"Fotoğrafın satışa hazırlanıyor."** | |
| 4.90 | Sol üstte açıklama pill'i belirir ve sahne boyunca kalır: **AI ile görselleştirildi · Temsilî** | `opacity 0→1`, `dur-md` |
| 5.10 | Boş oda tam görünür | **0.60 sn hareketsiz görünür** (izleyici "önce"yi görmeli) |
| 5.70 | Slider tutamacı belirir | `scale 0.9→1.0`, `dur-sm` |
| 5.90–7.10 | Slider soldan sağa, **1.20 sn**, `ease-in-out` (cosine) | döşenmiş oda açılır |
| 7.10 | Snap + altın onay halkası | halka `scale 1→1.6`, `opacity 0.6→0`, 300 ms |
| 7.30–7.80 | Döşenmiş oda tam görünür | 0.50 sn |

### P4 · EŞLEŞME — 7.80–10.60

| t | öğe | hareket |
|---|---|---|
| 7.80 | Fotoğraf kart formuna geri döner, merkeze oturur | morph, `dur-lg` |
| 7.95 | Üst metin: **"İlanın doğru alıcıyla eşleşiyor."** | |
| 8.30 / 8.42 / 8.54 | Üç alıcı kriteri çipi kartın çevresine gelir: **"Girne · 2+1"** · **"Deniz yakını"** · **"Yatırımlık"** | her biri `translate` + `scale 0.9→1.03→1.00`, `dur-md`, stagger 120 ms |
| 9.10 / 9.34 | İki çip altınla kilitlenir | altın çerçeve `opacity 0→1` + `scale 1.04→1.00`; tek halka nabzı 280 ms |
| 9.60 | Üçüncü çip sönerek uzaklaşır | `opacity 1→0.25`, `saturate 1→0.3`, `translateX +18px`, `dur-lg`, `ease-in` |
| 9.90–10.60 | Kart hafif öne çıkar | `scale 1.00→1.03`, 700 ms |

### P5 · ALICI ARIYOR — 10.60–14.20

| t | öğe | hareket |
|---|---|---|
| 10.60 | **Perde geçişi:** ekran yukarı süpürülür, telefon 3° yatıp döner | çıkan `translateY −100%`, giren `translateY 100%→0`, **620 ms**; `rotateZ` geçişin ilk yarısında zirve |
| 10.85 | Üst metin: **"Alıcı cümleyle arıyor."** | |
| 11.00–12.20 | Alıcının Türkçe cümlesi kelime kelime yazılır: `Girne'de deniz gören, bahçeli 2+1` | 9 kelime/sn; virgülde +120 ms |
| 11.55–12.55 | **İmza hareketi:** yazılan kelimeler altta kritere dönüşür. Her kelime yazıldıktan 180 ms sonra kopyası aşağı düşerek çipe dönüşür | kopya: `translateY +34px`, `scale 1.00→0.82`, `opacity 1→0`; çip: `translateY +12→0`, `scale 0.90→1.03→1.00`, `dur-md`; stagger 160 ms |
| | çipler: **Girne** · **Deniz manzarası** · **Bahçeli** · **2+1** | |
| 12.70 | Ara basılır, kısa yükleme nabzı | basma `dur-xs`; altın süpürme 420 ms |
| 12.95–13.60 | Sonuçlar gelir. **En üstte emlakçının ilanı**, altın çerçeveli; altında iki kart daha | stagger 90 ms; `translateY 22→0`, `scale 0.96→1.00`, `dur-md` |
| 13.60 | Üst metin: **"İlanın karşısına çıkıyor."** | |

### P6 · ASİSTAN DA OKUYOR — 14.20–17.00

| t | öğe | hareket |
|---|---|---|
| 14.20 | Sonuç listesi, soyut bir cevap bloğuna dönüşür (sohbet arayüzü değil — markanın kendi cevap motifi) | morph, `dur-lg` |
| 14.40 | Üst metin: **"Yapay zekâ asistanları da okuyor."** | |
| 14.70–15.60 | Cevap metni kelime kelime açılır; içinde emlakçının ilanı kart olarak durur | 14 kelime/sn |
| 15.80 | Altın ince çizgi soldan çizilir | `scaleX 0→1`, 450 ms |
| 16.00 | Mono kaynak satırı: `KAYNAK: EVLEK.APP` | `opacity` + `translateY 10→0`, `dur-md` |
| 16.30–17.00 | Blok hafif nabız, sonra sabitlenir | `scale 1.00→1.02→1.00`, 500 ms |

### P7 · KAPANIŞ — 17.00–20.00

| t | öğe | hareket |
|---|---|---|
| 17.00 | Telefon kadrajdan süzülür; lacivert katman yukarıdan iner | telefon `translateY +140%` + `scale 0.94`, 520 ms; lacivert `translateY −100%→0`, 420 ms |
| 17.45 | Wordmark oturur | `opacity` + `scale 1.02→1.00`, `dur-lg` |
| 17.80 | Altın çizgi soldan çizilir | `scaleX 0→1`, 450 ms |
| 18.05 | **"Sen ilanı koy. Gerisi Evlek'te."** | `translateY 16→0` + fade, `dur-md` |
| 18.35 | `evlek.app` | `dur-md`, 120 ms gecikmeyle |
| 18.60 | CTA üzerinde tek seferlik ışık süpürmesi | 450 ms |
| **18.60–20.00** | **Tam sabit — 1.40 sn** | tek istisna |

**Döngü:** son lacivert kare, ilk karedeki koyu telefon gövdesiyle tonal olarak eşleşir.

---

## 4 · Motion token sistemi

Profesyonel standart: **süre ve easing token olarak tanımlanır ve tutarlı kullanılır.** Her öğe kendi keyfi süresini seçerse iş amatör görünür.

### Süre token'ları

| token | süre | kullanım | dayanak |
|---|---|---|---|
| `dur-xs` | **180 ms** | basma, toggle, mikro-etkileşim | mikro-etkileşimler 100–200 ms |
| `dur-sm` | **200 ms** | satır girişi, küçük durum değişimi | standart geçiş referansı 200 ms |
| `dur-md` | **280 ms** | kart girişi, çip, metin bloğu | <300 ms algılanan performans için |
| `dur-lg` | **420 ms** | ekranlar arası, morph, perde | ekranlar arası geçiş ~300 ms+ |
| `dur-xl` | **620 ms** | perde geçişi (telefon eğilmesiyle) | ağırlık hissi için bilinçli aşım |

### Easing token'ları

| token | eğri | kullanım |
|---|---|---|
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | **giren** her öğe |
| `ease-in` | `cubic-bezier(0.64, 0, 0.78, 0)` | **çıkan** her öğe |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | aynı öğenin durum değişimi, morph |
| `spring-soft` | overshoot %3, sönüm 0.75 | çip, kart, mesaj girişi |

**Kural:** giren öğe `ease-out`, çıkan öğe `ease-in`, yer değiştiren öğe `ease-in-out`. İstisna yok.

### Sürekli hareket (film boyunca)

| özellik | değer | not |
|---|---|---|
| Telefon `rotateY` | −2.4° → +1.2° | 20 sn'ye doğrusal olmayan yayılım |
| Telefon `scale` | 1.000 → 1.035 | çok yavaş `ease-out` |
| Telefon `rotateZ` | perde geçişlerinde 0→3→0 | yalnız P5 girişinde |
| Ekran içeriği | cihazla **aynı perspektif matrisi** | ayrı katman gibi kaymaz |

### Performans kuralı
Yalnızca `transform` ve `opacity` animasyonu. `width`, `top`, `left`, `filter` animasyonu **yok** (staging slider'ın `clip-path`'i tek istisna, o da GPU dostu).

---

## 5 · Ekrandaki Evlek arayüzü — tasarım şartnamesi

**En büyük risk bu bölümde:** ekranda gösterdiğimiz arayüz gerçek üründen farklıysa, kaydolan emlakçı aldatılmış hisseder ve ilk izlenim yanar.

| bileşen | şartname |
|---|---|
| Kart | beyaz dolgu, **radius 28**, gölge `0 18px 48px rgba(20,33,61,.08)`, hairline yok |
| Çip | radius **999**, yükseklik 56, yatay padding 24, kenarlık `1.5px` lacivert %16; **aktif:** altın kenarlık + %6 altın dolgu |
| Düğme (birincil) | lacivert dolgu, beyaz metin, radius 999, yükseklik 88, min genişlik 320 |
| Odak halkası | **lacivert 2.5px + altın %16 dış halo 7px** — tarayıcı mavisi asla |
| Alan (input) | krem zemin, radius 16, yükseklik 84, iç padding 24 |
| İmleç | beyaz dolgu + lacivert 1.6px kenar, gölge `0 3px 8px rgba(4,14,28,.35)` |
| Telefon çerçevesi | koyu grafit `#1A1D22`, radius 64, kenar kalınlığı 14, ekran radius 50 |
| Tipografi | başlık Hanken 800 ≥56px · arayüz Hanken 500 ≥30px · mono JetBrains 500 ≥28px |
| Renk | lacivert `#0A2540` · krem `#F4F1EB` · altın `#C9A157` · beyaz `#FFFFFF` |

**Açık soru (bölüm 13):** gerçek ürünün ekran görüntüleri elimde yok. Bu şartname markanın tasarım sistemine göre kuruldu; ürünle birebir tutması için görsel gerekiyor.

---

## 6 · Ekrandaki bütün metin

**Kural:** her satır ≤5 kelime (istisna gerekçelendirilir), fiil odaklı, tamamı Türkçe.

| # | t | metin | tip |
|---|---|---|---|
| 1 | 0.15 | **İlanı koydun. Şimdi ne oluyor?** | kanca (H1) |
| 2 | 1.75 | **Açıklaman yazılıyor.** | başlık |
| 3 | 1.90 | `Girne Zeytinlik'te, denize yürüme mesafesinde, geniş balkonlu 2+1 daire.` | ürün çıktısı |
| 4 | 3.10 | **95 m² · 2+1 · Girne · Zeytinlik** | metrik |
| 5 | 3.40 | **Beş dile çevriliyor.** | başlık |
| 6 | 3.55 | **TR · EN · RU · DE · AR** | rozet |
| 7 | 4.75 | **Fotoğrafın satışa hazırlanıyor.** | başlık |
| 8 | 4.90 | **AI ile görselleştirildi · Temsilî** | açıklama pill'i |
| 9 | 7.95 | **İlanın doğru alıcıyla eşleşiyor.** | başlık |
| 10 | 8.30 | **Girne · 2+1** · **Deniz yakını** · **Yatırımlık** | alıcı çipleri |
| 11 | 10.85 | **Alıcı cümleyle arıyor.** | başlık |
| 12 | 11.00 | `Girne'de deniz gören, bahçeli 2+1` | alıcının sorgusu |
| 13 | 11.55 | **Girne** · **Deniz manzarası** · **Bahçeli** · **2+1** | kriter çipleri |
| 14 | 13.60 | **İlanın karşısına çıkıyor.** | başlık |
| 15 | 14.40 | **Yapay zekâ asistanları da okuyor.** | başlık |
| 16 | 16.00 | `KAYNAK: EVLEK.APP` | mono |
| 17 | 18.05 | **Sen ilanı koy. Gerisi Evlek'te.** | kapanış |
| 18 | 18.35 | `evlek.app` | CTA |

**Koçan hiçbir yerde geçmiyor.** Yabancı kelime yok. Uydurma istatistik yok.

---

## 7 · Ses

Sessiz izlenme oranı **%85**. Ses bilgi taşımaz, ritim ve doku katar. Sesi kapalı izleyen hiçbir şey kaybetmez — bu kalite barajının maddesi.

### Miks hedefleri

| | değer |
|---|---|
| Format | AAC stereo, **48 kHz** |
| Instagram / TikTok kesiti | **−11 LUFS** entegre |
| YouTube kesiti | **−14 LUFS** entegre |
| True peak | **−1 dBTP** |
| Müzik seviyesi | −15 … −12 dB (voiceover yok, biraz daha önde olabilir) |
| Kontrol | en az iki ortamda dinleme (küçük hoparlör + kulaklık) |

İki ayrı miks çıkarılır; maliyeti sıfır, kazancı platformda doğru ses.

### Cue haritası

| t | cue | karakter |
|---|---|---|
| 0.00 | `bed-in` | düşük, sakin yatak |
| 1.08 | `press` | Yayınla basılır, kuru ve kısa |
| 1.32 | `confirm` | onay, yumuşak |
| 1.90 | `type-texture` | yazma dokusu (tuş sesi değil) |
| 3.10 | `metric-tick` | metrik satırı |
| 3.55–4.45 | `lang-flip` ×5 | dil rozetleri, küçük ve temiz |
| 4.60 | `photo-open` | fotoğraf açılır, hava |
| 5.90 | `staging-swipe` | **1.20 sn hareket sesi**, tek atış değil |
| 7.10 | `staging-snap` | oturma |
| 8.30–8.54 | `chip-in` ×3 | |
| 9.10 / 9.34 | `match-lock` ×2 | altın kilit |
| 10.60 | `side-flip` | perde geçişi, ağırlık |
| 11.55–12.55 | `chip-form` ×4 | kriter koparken |
| 12.70 | `search-press` | |
| 12.95–13.15 | `card-land` ×3 | |
| 14.20 | `assistant-open` | tonal yükseliş |
| 16.00 | `source-line` | onay hissi |
| 17.00 | `close-sweep` | lacivert iner |
| 17.90 | `sonic-logo` | marka imzası, kuyruk CTA'ya uzanır |

---

## 8 · Varlıklar

| varlık | kaynak | durum |
|---|---|---|
| Telefon çerçevesi, arayüz, kartlar, çipler, imleç, cevap bloğu | **kodla çizilir** | ✔ |
| İlan fotoğrafı (döşenmiş) | `img/room-01-akdeniz.jpg` | ✔ mevcut |
| Boş oda (staging öncesi) | `img/room-00-bos.jpg` | ✔ mevcut |
| Sonuç listesindeki diğer iki kart | `img/room-02-minimal.jpg`, `img/peek-balkon.jpg` | ✔ mevcut |
| Wordmark | `img/wordmark.png` | ✔ mevcut |

**Yeni görsel üretilmesine gerek yok.** Staging çifti geometrisi eşleşmiş ve onaylı.

---

## 9 · Kalite barajı

### Kurgu ve mesaj
- [ ] Kanca **0.15 sn**'de tam okunur; ilk karede hareket var
- [ ] **Sesi kapat, baştan sona izle** — hiçbir bilgi kaybolmuyor
- [ ] **2.50 sn**'de izleyici "ilan konuldu, bir şeyler oluyor" durumunu anlamış
- [ ] Emlakçı ekrana **yalnız bir kez** dokunuyor (1.08); sonra hiç
- [ ] Ekranda rakip izi, karşılaştırma, "eski yöntem" **yok**
- [ ] "Yapay zekâ" **tam bir kez** geçiyor
- [ ] Koçan **hiç** geçmiyor

### Hareket
- [ ] Her süre bir **token**'a eşit (`dur-xs/sm/md/lg/xl`) — keyfi süre yok
- [ ] Giren `ease-out`, çıkan `ease-in`, yer değiştiren `ease-in-out` — istisnasız
- [ ] Yalnız `transform` + `opacity` (staging `clip-path` istisna)
- [ ] Basma ↔ sonuç arası **90–140 ms** gecikme var
- [ ] **1.0 sn'den uzun hareketsizlik yok** (son 1.40 sn hariç)
- [ ] Bütün giriş animasyonları aynı yay ailesinde

### Tipografi ve yerleşim
- [ ] Bütün metin **≥28 px**, güvenli alan içinde (x 80–1000, y 280–1220)
- [ ] Başlıklar ≥56 px

### Teknik
- [ ] `ffprobe`: 1080×1920 · 60 fps · 1200 kare · H.264 High L4.2 · yuv420p · BT.709 · faststart
- [ ] `qc.mjs`: beyaz flash yok, metinde ghosting yok, kare tekrarları yalnız tasarımın duruşlarında
- [ ] Ses: IG kesiti −11 LUFS, YT kesiti −14 LUFS, TP ≤ −1 dBTP
- [ ] Son kare ↔ ilk kare tonal eşleşme (döngü dikişsiz)

---

## 10 · Test ve dağıtım

### Kanca testi — iki aşama
Standart: **4–6 varyant.** Dörtten az desen göremezsin, altıdan fazlada bütçe dağılır.

1. **Aşama 1 — aile testi.** H1–H5 aynı gövdeyle yayınlanır. Ölçüt: **3 saniye tutma oranı** (hedef %70+). Tıklama değil — kanca kancadır.
2. **Aşama 2 — aile içi varyant.** Kazanan ailenin içinde 3 yeni varyant (farklı ilk görsel, farklı kelime dizilişi). Ölçüt: tıklama ve kayıt.

Haftada **3–5 yeni varyant** sürdürülebilir hız.

### Format çeşitliliği
Aynı gövdeden türetilecek ek kesitler — ek çekim yok, sadece kurgu:

| kesit | süre | kullanım |
|---|---|---|
| Tam film | 20.0 sn | ana |
| Kısa kesit | **8.0 sn** (P1 + P5 + kapanış) | üst huni, geniş erişim |
| Staging kesiti | **6.0 sn** (P3 + kapanış) | görsel odaklı yerleşim |
| Durağan kareler | 4 adet | carousel / story, filmden bedava çıkar |

### KPI
| aşama | ölçüt | hedef |
|---|---|---|
| Kanca | 3 sn tutma | %70+ |
| İzleme | tamamlanma | %35+ (20 sn için iyi) |
| İlgi | profil/tıklama | ölçüm sonrası taban belirlenir |
| Dönüşüm | emlakçı kaydı | landing sayfası hazır olunca |

---

## 11 · Üretim sırası

| # | iş | süre |
|---|---|---|
| 1 | Remotion projesi + marka primitifleri (token, renk, tip, telefon, imleç, kart, çip) | 0.5 gün |
| 2 | **P5 imza hareketi tek başına** — cümle → kriter kopması | 0.5 gün |
| 3 | Onay → P1–P4 | 1 gün |
| 4 | P6–P7 | 0.5 gün |
| 5 | Tam render + `encode.mjs` master + `qc.mjs` + kalite barajı | 0.5 gün |
| 6 | 5 kanca varyantı | 0.5 gün |
| 7 | Ses miksi (dışarıdan) → `-c:v copy` mux → iki LUFS kesiti | — |
| 8 | Kısa kesitler + durağan kareler | 0.5 gün |

**Toplam ~4 gün** (ses hariç). İlk gösterilebilir çıktı: **2. adımın sonunda**, yani ilk yarım günde.

---

## 12 · İddia disiplini (kırmızı takım)

Ekranda görünen her şey ürünün **gerçekten yaptığı** bir şey olmalı. Aksi hâlde ilk kaydolan emlakçı farkı görür ve bu, güven üzerine kurulu bir markanın en pahalı hatası olur.

| ekranda gösterilen | doğrulanması gereken |
|---|---|
| Yayınla sonrası açıklamanın otomatik yazılması | otomatik mi, emlakçı mı tetikliyor? |
| Beş dile otomatik çeviri | yayında mı, hangi diller? |
| Fotoğrafın otomatik hazırlanması | staging otomatik mi, emlakçı mı başlatıyor? |
| "Doğru alıcıyla eşleşiyor" | gerçek bir eşleştirme/bildirim var mı, yoksa aramada mı çıkıyor? |
| "Yapay zekâ asistanları da okuyor" | MCP/yapılandırılmış veri yayında ✔ (doğrulandı) |

**Kural:** yukarıdaki maddelerden biri "hayır" ise, o beat ya çıkar ya da dili düzeltilir ("yazılıyor" → "tek tıkla yazılır"). Filmin gücü doğruluğundan geliyor.

Açıklama etiketi **"AI ile görselleştirildi · Temsilî"** staging sahnesi boyunca ekranda kalır — pazarlama değil, güven altyapısı.

---

## 13 · Kaynaklar

- UI motion süre/easing standartları: https://gist.github.com/uxderrick/07b81ca63932865ef1a7dc94fbe07838
- Motion design ilkeleri 2026: https://www.bettermockups.com/blogs/resources/motion-design-principles
- UI geçişlerinde 5 kural: https://www.equal.design/blog/5-rules-for-motion-in-ui-transitions
- Sessiz izleme ve dikey video ses stratejisi: https://www.garageproductions.in/sound-design-for-vertical-video-audio-strategy-music-selection-for-mobile-first-storytelling/
- LUFS hedefleri (platform bazlı): https://www.opus.pro/blog/best-loudness-normalizers
- Kanca testi — tam reklamı değil kancayı test et: https://www.kalungi.com/blog/test-ad-hooks-not-full-ads
- Kanca varyant sayısı ve iki aşamalı test: https://www.peak10marketing.com/blog/hook-testing-framework
- Kreatif yorgunluk ve modüler üretim: https://www.darkroomagency.com/observatory/creative-fatigue-performance-testing-framework
- B2B SaaS kreatif test çerçevesi: https://www.saashero.net/strategy/b2b-saas-creative-testing-frameworks/
- İlk 3 saniye ve sessiz izleme: https://asensebranding.com/blogs/video-production-trends-in-2026-how-algorithms-favor-silent-vertical-instant-videos
