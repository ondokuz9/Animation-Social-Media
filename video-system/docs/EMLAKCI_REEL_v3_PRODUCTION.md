# Emlakçı Reel'i v3 · üretim planı

**1080×1920 · 60 fps · 20.00 sn · 1200 kare**
**Kampanya cümlesi:** "Bir kere yaz. Her yerde görün."
**Motor:** Remotion → PNG sekansı → `encode.mjs` (H.264 High, BT.709 limited, faststart)

---

## 1 · Araştırmadan çıkan dört kural

| bulgu | filme etkisi |
|---|---|
| İlk 3 sn tamamlanma varyansının %80'ini belirliyor; iyi işler %70+ intro retention tutturuyor | Kanca **0.15 sn**'de ekranda. Logo introsu, boş kare, ısınma yok. İlk 2.6 sn'de ürünün ana farkı zaten gösterilmiş oluyor. |
| Kısa videoların %60–85'i **sessiz** izleniyor | Bütün mesaj ekrandaki metinde. Ses yalnızca ritim ve doku katıyor; kapalıyken hiçbir bilgi kaybolmuyor. |
| "Dashboard ekran kaydı en hızlı kayıp yolu" | Ekran kaydı yok. Arayüz **tasarlanmış ve niyetle hareket ediyor** — her öğe bir sebeple giriyor. |
| En iyi işler ürünün değerini *anlatmıyor, hissettiriyor* (Bolt: hızı hızla anlatıyor) | Evlek'in değeri "anlama" ve "hazır cevap". Film bunu **cümleden kriterin kendiliğinden oluşmasıyla** hissettiriyor — söylemeden. |

---

## 2 · Rakipten farkı nasıl anlatıyoruz — laf çakmadan

**Kural: eski yöntem hiç gösterilmiyor.** Karşılaştırma yok, "onlar/biz" yok, ekranda tek bir rakip izi yok.

Fark **fiillerle** anlatılıyor:

| standart ilan sitesinde emlakçının/alıcının yaptığı | Evlek'te ekranda gördüğümüz |
|---|---|
| filtre seçer, kutucuk işaretler | **cümle yazar**, kriterler kendiliğinden oluşur |
| sayfa sayfa gezer | **cevap gelir** — üç ilan, gerekçesiyle |
| aynı ilanı her yere yeniden yazar | **bir kere yazar**, çıktılar çoğalır |
| ilanı görülsün diye uğraşır | **ilan doğru alıcıya kendisi çıkar** |
| yalnızca arama motorunda vardır | **asistanlar da okur** |

İzleyicinin kafasındaki karşılaştırmayı kendi deneyimi yapıyor. Biz sadece yeni olanı kusursuz gösteriyoruz. Bir şeyin daha iyi olduğunu söylemenin en güçlü yolu, rakibi hiç anmamaktır.

**Yapay zekâ çağı vurgusu** da aynı disiplinle: "AI" kelimesi ekranda **bir kez** geçiyor, o da ürünün gerçek yeteneğini adlandırırken. Gerisi gösterilerek anlatılıyor.

---

## 3 · İnteraktif his — nasıl kuruluyor

Film "birinin ürünü kullandığını izliyoruz" hissi vermeli, slayt değil.

- **İmleç/dokunuş her etkileşimi başlatır.** Hiçbir öğe kendi kendine belirmez; ya yazılır, ya basılır, ya sürüklenir.
- **Arayüz karşılık verir:** odak halkası, basma durumu (`scale` 1.00→0.97→1.00), üzerine gelince kart 4 px yükselir, geçersiz alan hafifçe titrer.
- **Gecikmeler gerçekçi:** basma ile sonucun arasında 90–140 ms var. Anında olan hiçbir şey inandırıcı değil.
- **Fizik tutarlı:** her giren öğe aynı yay ailesini kullanır. Farklı hızlarda farklı yaylar = amatör.
- **Cihaz canlı:** telefon film boyunca çok yavaş parallax yapar; ekran içeriği cihazla aynı perspektifte kalır.

---

## 4 · Film — 20.00 sn

Telefon kadrajda; ekran 1080×1920'nin ~%80'i, hafif perspektif. Cihaz çerçevesi sade, markasız, koyu grafit.

### PERDE 1 · SORU — 0.00–2.60

| an | ekranda | metin |
|---|---|---|
| 0.00 | Telefon zaten hareket hâlinde. Arama alanı odaklı, imleç yanıp sönüyor. **Boş kare yok.** | — |
| 0.15 | Üst güvenli alanda kanca satırı düşer | **"Alıcı artık böyle arıyor."** |
| 0.30–1.60 | Cümle **kelime kelime** yazılır (İngilizce — alıcı yabancı). Virgülde 0.12 sn duraksama. | `Sea view 2+1 in Kyrenia, under £180,000, Turkish title` |
| 1.10–2.35 | **Filmin en önemli anı:** cümle yazılırken altındaki kriterler *kendiliğinden oluşur*. Her kriter, ilgili kelime yazıldıktan 0.18 sn sonra, o kelimenin altından yukarı doğru "kopar" ve çip hâline gelir. | çipler sırayla: **Girne** · **2+1** · **Deniz manzarası** · **≤ £180K** · **Türk Koçanı** |
| 2.35–2.60 | İmleç Ara düğmesine gider, basar: `scale` 1.00→0.97→1.00, altın halka dışa açılır | — |

> Bu perde tek başına "filtre değil, dil" farkını hiçbir şey söylemeden anlatıyor. Kanca da burada: izleyici cümlenin kriterlere dönüşmesini görünce ne olacağını merak ediyor.

### PERDE 2 · CEVAP — 2.60–6.20

| an | ekranda | metin |
|---|---|---|
| 2.60–2.75 | Kısa yükleme nabzı — ince altın çizgi bir kez süpürür | — |
| 2.75–4.10 | Üç ilan kartı 90 ms arayla alttan girer. Her kart: fotoğraf, fiyat, konum, m², ve **koçan rozeti**. | **£142.000** Girne · Alsancak · 2+1 · 85 m²<br>**£158.000** Girne · Zeytinlik · 2+1 · 95 m²<br>**£169.000** Girne · Çatalköy · 2+1 · 100 m² |
| 4.10–5.10 | Kartların üstüne tek satır bağlam düşer; ilk kartta küçük fiyat işareti yanar | **"Girne medyanı £158.000"** |
| 5.10–6.20 | Üst satır değişir | **"Cevap hazır geliyor."** |

### PERDE 3 · DÖNÜŞ — 6.20–7.00

Ekran yukarı süpürülür, telefon 3° yatıp döner. Emlakçının ilan girişi alttan gelir: bir fotoğraf, üç boş alan, bir düğme.

Metin: **"Peki bu ilan oraya nasıl geldi?"** *(merak halkası — izleyiciyi ikinci yarıya taşır)*

### PERDE 4 · TEK GİRİŞ — 7.00–11.60

| an | ekranda | metin |
|---|---|---|
| 7.00–8.20 | İmleç fotoğrafı sürükleyip bırakır, iki alan doldurulur. Toplam üç etkileşim, hepsi görünür. | **"Sen bir kere yaz."** |
| 8.20–8.60 | "Yayınla" basılır, kısa onay | — |
| 8.60–11.60 | Tek girişten çıktılar sırayla tikle oturur. Her tik telefonu 2 px sarsar. | **5 dilde açıklama yazıldı** → **Koçan · m² · bölge fiyatı eklendi** → **Fotoğraflar düzenlendi** *(AI ile görselleştirildi · Temsilî)* |

### PERDE 5 · EŞLEŞME — 11.60–14.40

İlan ortada. Çevresine üç alıcı profili çipi gelir — **"Girne · 2+1 · ≤£180K"**, **"Deniz manzarası"**, **"Yatırım · kira getirisi"**. İkisi altın çerçeveyle kilitlenir, biri sönerek uzaklaşır.

Metin: **"İlanın analiz edilir."** → **"Doğru alıcının karşısına çıkar."**

### PERDE 6 · CEVABIN İÇİNDE — 14.40–17.40

Ekran perde 2'deki cevaba geri döner. Aynı üç kart — ama en üste **emlakçının ilanı** altın çerçeveyle oturur. Kartın altında ince altın çizgi çizilir ve kaynak satırı belirir.

Metin: **"Yapay zekâ asistanları da okur."** · mono: `KAYNAK: EVLEK.APP`

> "AI" kelimesinin ekranda geçtiği tek yer burası. Film boyunca gösterildi; burada bir kez adlandırılıyor.

### PERDE 7 · KAPANIŞ — 17.40–20.00

Telefon kadrajdan süzülür, lacivert iner. Wordmark oturur (1.02→1.00), altın çizgi soldan çizilir.

**"Bir kere yaz. Her yerde görün."**
**evlek.app**

Son **1.4 sn tam sabit.** Son kare, ilk karedeki koyu telefon gövdesiyle tonal olarak eşleşir — döngü dikişsiz.

---

## 5 · Hareket şartnamesi

Tek easing ailesi: `cubic-bezier(0.22, 1, 0.36, 1)`. Elastic bounce yok, aşırı overshoot yok.

**Telefon — hiç durmaz**
- `rotateY` −2.4° → +1.2° (20 sn'ye yayılı, tek yön)
- `scale` 1.000 → 1.035 (çok yavaş ease-out)
- `rotateZ` yalnızca perde geçişlerinde 0° → 3° → 0°, 0.62 sn
- Ekran içeriği cihazla aynı perspektif matrisinde

**Yazma (P1)** — kelime kelime, ~9 kelime/sn, virgülde +0.12 sn. Karakter daktilosu **kullanılmaz**. İmleç 1.06 Hz yanıp söner, yazarken sabit kalır.

**Kriter kopması (P1, filmin imza hareketi)**
- Kelime yazıldıktan 0.18 sn sonra başlar
- Kelimenin kopyası `translateY` +34 px aşağı, `scale` 1.00 → 0.82, `opacity` 1 → 0 ile kaynak metinde solar
- Aynı anda çip `translateY` +12 → 0, `scale` 0.90 → 1.03 → 1.00, `opacity` 0 → 1, 0.34 sn
- Çipler arası 0.16 sn stagger; sıra yazım sırasını takip eder

**Basma (P1, P4)** — `scale` 1.00 → 0.97 → 1.00, 0.20 sn; altın halka `inset` −8 px'e açılır, `opacity` 0.7 → 0, 0.34 sn

**Kart girişi (P2, P6)** — stagger 90 ms; `translateY` 22 → 0, `scale` 0.96 → 1.00, 0.32 sn; gölge kart oturduktan **sonra** 0.16 sn'de yumuşar

**Yükleme nabzı (P2)** — altın çizgi soldan sağa 0.42 sn, arkasında 40 px yumuşak kenar

**Perde geçişi (P3)** — çıkan katman `translateY(-100%)`, giren katman `translateY(100%)` → 0, 0.62 sn; telefonun eğilmesi geçişin ilk yarısında zirve

**Çıktı tikleri (P4)** — satır `translateY` 16 → 0 + fade, 0.28 sn; tik SVG `stroke-dashoffset` ile 0.22 sn'de çizilir; cihaz 2 px sarsılır ve 0.18 sn'de oturur

**Eşleşme kilidi (P5)** — çipler 0.12 sn arayla; kilitlenen: altın çerçeve fade + `scale` 1.04 → 1.00 + tek halka nabzı; sönen: `opacity` → 0.25, `saturate(0.3)`, `translateX` 18 px uzağa, 0.42 sn

**Kapanış (P7)** — lacivert `translateY(-100%)` → 0, 0.42 sn; wordmark `scale` 1.02 → 1.00; altın çizgi `scaleX` 0 → 1 soldan; CTA'da tek seferlik ışık süpürmesi (0.45 sn), sonra tam sabit

**Genel:** 1.0 sn'den uzun hareketsizlik yok (telefon parallax'ı garantiler). Son 1.4 sn bilinçli istisna.

---

## 6 · Ekrandaki bütün metin

1. **Alıcı artık böyle arıyor.**
2. `Sea view 2+1 in Kyrenia, under £180,000, Turkish title` *(mono, sorgu)*
3. Çipler: **Girne** · **2+1** · **Deniz manzarası** · **≤ £180K** · **Türk Koçanı**
4. Kartlar: **£142.000** Girne · Alsancak · 2+1 · 85 m² — **£158.000** Girne · Zeytinlik · 2+1 · 95 m² — **£169.000** Girne · Çatalköy · 2+1 · 100 m²
5. **Girne medyanı £158.000**
6. **Cevap hazır geliyor.**
7. **Peki bu ilan oraya nasıl geldi?**
8. **Sen bir kere yaz.**
9. **5 dilde açıklama yazıldı** / **Koçan · m² · bölge fiyatı eklendi** / **Fotoğraflar düzenlendi** *(AI ile görselleştirildi · Temsilî)*
10. **İlanın analiz edilir.** / **Doğru alıcının karşısına çıkar.**
11. **Yapay zekâ asistanları da okur.** / `KAYNAK: EVLEK.APP`
12. **Bir kere yaz. Her yerde görün.** / `evlek.app`

**Tipografi:** başlıklar Hanken Grotesk 800, min 56 px. Arayüz metni 500, min 30 px. Mono (JetBrains) yalnız sorgu, rakam ve kaynak satırında, min 28 px. **28 px altı metin yok.**

**Veri temsilîdir** (site tamamlanmış varsayımıyla, gerçek piyasa aralığına oturtuldu). Öneri: perde 2'de küçük ve sabit bir **"Örnek ekran"** etiketi kalsın — güven hikâyesinin parçası, maliyeti sıfır.

---

## 7 · Ses marker'ları

| t | cue | karakter |
|---|---|---|
| 0.00 | `bed-in` | düşük, sakin yatak |
| 0.30–1.60 | `type-texture` | yazma dokusu, tuş sesi değil |
| 1.10 / 1.34 / 1.58 / 1.82 / 2.06 | `chip-form` ×5 | kriter koparken, küçük ve temiz |
| 2.40 | `press` | Ara basılır |
| 2.62 | `fetch-sweep` | tonal yükseliş |
| 2.85 / 2.94 / 3.03 | `card-land` ×3 | |
| 4.15 | `context-tick` | medyan satırı |
| 6.25 | `side-flip` | perde geçişi, hava ve ağırlık |
| 8.30 | `publish` | yayınla onayı |
| 8.90 / 9.80 / 10.70 | `output-tick` ×3 | |
| 12.20 / 12.60 | `match-lock` ×2 | altın kilit |
| 14.60 | `you-are-in` | emlakçının kartı üste otururken — duygusal zirve |
| 17.50 | `close-sweep` | lacivert iner |
| 17.95 | `sonic-logo` | kuyruk CTA'ya uzanır |

---

## 8 · Varlıklar

| varlık | kaynak |
|---|---|
| Telefon çerçevesi, arayüz, kartlar, çipler, tikler, imleç | **kodla çizilir** |
| Üç ilan fotoğrafı | `img/room-01-akdeniz.jpg`, `img/room-02-minimal.jpg`, `img/peek-balkon.jpg` ✔ mevcut |
| Emlakçının ilan fotoğrafı | `img/niyet-salon.jpg` ✔ mevcut |
| Wordmark | `img/wordmark.png` ✔ mevcut |

**Yeni görsel üretilmesine gerek yok.**

---

## 9 · Kalite barajı — "geçti" ne demek

Teslimden önce ölçülecek:

- [ ] **0.15 sn**'de kanca metni tam okunur; ilk karede hareket var, boş kare yok
- [ ] **Sessiz izlendiğinde** hiçbir bilgi kaybolmuyor (sesi kapatıp baştan sona izle)
- [ ] **2.6 sn**'de ürünün ana farkı (cümle → kriter) zaten gösterilmiş
- [ ] Hiçbir noktada **1.0 sn'den uzun hareketsizlik** (son 1.4 sn hariç)
- [ ] Her etkileşimin görünür bir **başlatıcısı** var (imleç/dokunuş) — kendiliğinden beliren öğe yok
- [ ] Basma ile sonuç arasında **90–140 ms** gecikme var
- [ ] Bütün giriş animasyonları **aynı yay ailesini** kullanıyor
- [ ] Ekranda **rakip izi yok**, karşılaştırma yok, "eski yöntem" gösterilmiyor
- [ ] "AI/yapay zekâ" ekranda **tam bir kez** geçiyor
- [ ] Bütün metin **≥28 px**, güvenli alanda (x 80–1000, y 280–1220)
- [ ] Son kare ↔ ilk kare tonal olarak eşleşiyor (döngü dikişsiz)
- [ ] `qc.mjs`: beyaz flash yok, metinde ghosting yok, kare tekrarları yalnızca tasarımın duruşlarında
- [ ] `ffprobe`: 1080×1920 · 60 fps · 1200 kare · H.264 High · yuv420p · BT.709 · faststart

---

## 10 · Üretim sırası

1. Remotion projesini kur, marka primitiflerini çıkar (renk, tip, güvenli alan, telefon çerçevesi, imleç)
2. **Perde 1'i tek başına render et** — filmin imza hareketi orada; tutmazsa gerisi anlamsız
3. Onay → perde 2–7
4. Tam render → `encode.mjs` ile master
5. `qc.mjs` + kalite barajı
6. Ses miksi (48 kHz, music + SFX, voiceover yok) → `-c:v copy` ile mux
7. Platform kesitleri, ayrı dosya adlarıyla

---

## 11 · Kaynaklar

- İlk 3 saniye ve intro retention: https://asensebranding.com/blogs/video-production-trends-in-2026-how-algorithms-favor-silent-vertical-instant-videos
- Reels en iyi uygulamalar 2026: https://quso.ai/blog/instagram-reels-best-practices
- Shorts en iyi uygulamalar 2026: https://miraflow.ai/blog/youtube-shorts-best-practices-2026-complete-guide
- B2B SaaS video örnekleri (Bolt, Notion, Diligent): https://www.superside.com/blog/saas-video-examples
- SaaS ürün demo videoları — ekran kaydı tuzağı: https://vidico.com/news/top-12-outstanding-saas-product-demo-videos/
- SaaS explainer örnekleri: https://www.whatastory.agency/blog/saas-explainer-video-examples
