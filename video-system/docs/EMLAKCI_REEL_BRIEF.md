# Emlakçı Reel'i · "Cevapta sen yoktun" · v1 brief

**Amaç:** KKTC'de emlakçıyı Evlek'e çekmek.
**Kitle:** Girne, Lefkoşa, Gazimağusa'daki emlak ofisleri ve bağımsız emlakçılar. Alıcı değil.
**Tek mesaj:** Alıcı artık yapay zekâya soruyor; yapay zekâ yalnızca okuyabildiği ilanı söyler; Evlek ilanını okunabilir yapar ve seni görmediğin alıcıya ulaştırır.

---

## 1 · Stratejik dayanak

Üç bulgunun kesişimi (kaynaklar bölüm 9):

1. **Pazar daralıyor.** KKTC 2026'da işlem hacmi düşük, yabancı ilgi soğumuş, fiyatlar yüksek. 63/2026 kararnamesi yabancı alımını yeniden kurguladı. Her lead'in değeri arttı.
2. **Alıcı keşfi yapay zekâya kaydı.** Zillow (Eki 2025), Redfin (Şub 2026), Realtor.com (Mar 2026) ChatGPT'nin içine girdi. Alıcı emlakçıya ulaşmadan önce AI ile araştırıyor.
3. **AI görünürlüğü çabaya değil yapıya bağlı.** Dil modelleri yapılandırılmış, anlamı net, otorite taşıyan kaynaklardan alıntılıyor. Sosyal medya gönderisi ve mesaj listesi okunamaz; yapılandırılmış ilan okunabilir.

**Sonuç:** Talebin gittiği yerde emlakçı görünmez durumda. Bu, KKTC'de kimsenin emlakçıya söylemediği cümle.

**Evlek'in özellikleri bu tek sebebin ayakları:**
- Yapılandırılmış ilan (koçan tipi, m², doğrulanmış ilan veren, fiyat bağlamı) → okunabilirlik
- 5 dil → erişim genişliği
- İlan içindeki yapay zekâ → alıcının sorusu ilanın üstünde cevaplanır
- Sanal düzenleme / marketing studio → medya kalitesi

Reklam özellik saymaz; hepsini tek sebebin altına yerleştirir.

---

## 2 · Teknik

| | |
|---|---|
| Ölçü | 1080 × 1920 |
| Kare hızı | 60 fps |
| Süre | **14.00 sn** = 840 kare |
| Güvenli alan | metin x 80–1000, y 280–1220 |
| Motor | Remotion (yeni), master encode mevcut `encode.mjs` ile (BT.709 limited, faststart) |
| Ses | music + SFX, voiceover yok, 48 kHz |

---

## 3 · Değiştirilemez kurallar

- Rakip, portal veya yapay zekâ **ürün adı geçmez**. Logo, marka rengi, ikon kullanılmaz.
- **Bilinen sohbet arayüzü taklit edilmez.** Balon düzeni, avatar, yazıyor animasyonu, yıldız ikonu yok. Cevap, markanın kendi soyut "cevap bloğu" motifiyle temsil edilir.
- **Uydurma istatistik yok.** "%40 daha fazla görüntülenme" gibi hiçbir sayı ekrana gelmez. Araştırma bulguları konumlandırmayı belirler, ekranda iddia olmaz.
- Temsilî veri gösterildiğinde **"Örnek ekran"** etiketi sahnede bir kez, okunur biçimde bulunur.
- Emoji yok. Coral/turuncu yok. 24 px altı metin yok.
- Renk: `#0A2540` lacivert · `#F4F1EB` krem · `#C9A157` altın (vurgu, çizgi, aktif durum). Elektrik mavisi yalnız kursör/aktif seçim detayında.
- Tip: başlıklar Hanken Grotesk 800, gövde 500, mono yalnız sorgu ve veri rakamlarında (JetBrains Mono).

---

## 4 · Kurgu — 14.00 sn

| # | an | süre | ekranda | metin |
|---|---|---|---|---|
| **S1** | 0.00–2.20 | 2.20 | Krem zemin. Üstte mono sorgu parçası soldan belirir. Zeminde çok yavaş ölçek (1.00→1.02). | sorgu: `Kyrenia · sea view · 2+1 · under £180,000`<br>başlık (0.35'te): **"Alıcı artık sana sormuyor."** |
| **S2** | 2.20–4.60 | 2.40 | Sorgu yukarı küçülür. Cevap bloğu oluşur: krem kart, 24 px radius, içinde 3 iskelet satır soldan sağa çizilir, ardından 3 küçük ilan satırı belirir. Hiçbiri vurgulu değil. | **"Cevap geldi."** (2.6)<br>**"İçinde sen yoktun."** (3.7, vuruşlu) |
| **S3** | 4.60–6.60 | 2.00 | Cevap bloğunun yanında üç soluk soyut şekil belirir (bir gönderi, bir mesaj, bir fotoğraf — logosuz, tanınmaz). Sırayla griye düşüp sönerler. | **"Yapay zekâ, okuyamadığı yeri söyleyemez."** |
| **S4** | 6.60–9.20 | 2.60 | Tanıdık ilan kartı (V7'deki aynı ilan) alttan yaylı girer ve cevap bloğunun içine oturur. Otururken yapılandırılmış alanları sırayla yanar: **Türk Koçanı** → **£1.941/m² · Girne medyanı £2.115** → **Doğrulanmış ilan veren**. Blok altında altın ince çizgi soldan çizilir. | **"Okunabilir ilan, cevabın içine girer."** (7.0)<br>mono: **KAYNAK: EVLEK.APP** (8.4) |
| **S5** | 9.20–11.60 | 2.40 | Cevap bloğu yerinde kalır, dil rozetleri sırayla değişir: **TR → EN → RU → DE → AR**. Her değişimde bloktaki satırlar hafifçe yeniden dizilir (içerik aynı, dil değişiyor hissi). | **"Görmediğin alıcı seni bulur."** (9.5)<br>alt satır: **"Beş dilde, sen uyurken."** (10.6) |
| **S6** | 11.60–14.00 | 2.40 | Lacivert kapanış yukarıdan iner. Wordmark oturur (1.02→1.00), altın çizgi soldan çizilir. | **"İlanını okunabilir yap."**<br>**evlek.app** — son 1.8 sn tam sabit |

**"Örnek ekran" etiketi** S2'de belirir, S5 sonuna kadar sağ üstte küçük ve sabit kalır.

**Ritim:** hiçbir noktada 1.2 sn'den uzun hareketsizlik yok. S1–S2 gerilim, S3 açıklama (en sakin an), S4 çözüm, S5 kazanç, S6 nefes.

**Döngü:** son kare lacivert; ilk kare krem. Sert geçiş istenmiyorsa son 6 karede laciverte doğru çok hafif bir karartma yapılır ve döngü kesme gibi değil nefes gibi görünür.

---

## 5 · Ekrandaki bütün metin

Sırayla, birebir:

1. `Kyrenia · sea view · 2+1 · under £180,000` *(mono, sorgu)*
2. **Alıcı artık sana sormuyor.**
3. **Cevap geldi.**
4. **İçinde sen yoktun.**
5. **Yapay zekâ, okuyamadığı yeri söyleyemez.**
6. **Okunabilir ilan, cevabın içine girer.**
7. `KAYNAK: EVLEK.APP` *(mono)*
8. **Görmediğin alıcı seni bulur.**
9. **Beş dilde, sen uyurken.**
10. **İlanını okunabilir yap.**
11. `evlek.app`

Veri (temsilî, "Örnek ekran" etiketiyle): `£165.000` · `Girne · Zeytinlik` · `2+1` · `Türk Koçanı` · `£1.941/m²` · `Girne medyanı £2.115` · `TR · EN · RU · DE · AR`

**Tutarlılık notu:** bu, V7'deki ilanın aynısı. Alıcı filminde alıcının gözünden gördüğümüz ev, burada emlakçının gözünden görünüyor. İki film aynı evrende geçiyor.

---

## 6 · Görsel varlıklar

Yeni görsel üretilmesine **gerek yok**:

| varlık | dosya | kullanım |
|---|---|---|
| İlan fotoğrafı | `img/room-01-akdeniz.jpg` | S4 kart görseli |
| Wordmark | `img/wordmark.png` | S6 kapanış (invert) |

Cevap bloğu, ilan kartı, dil rozetleri, iskelet satırlar — hepsi kodla çizilir.

---

## 7 · Ses marker'ları

| t (sn) | cue | karakter |
|---|---|---|
| 0.00 | `intro-bed` | sakin giriş yatağı |
| 0.35 | `line-hit` | başlık vuruşu, kuru |
| 2.20 | `answer-form` | cevap bloğu oluşur, tonal yükseliş |
| 3.70 | `absence-hit` | "İçinde sen yoktun" — alçak, tok, tek vuruş |
| 4.60 | `dim-out` | soyut şekiller sönerken, hafif düşüş |
| 6.60 | `card-enter` | kart cevaba girer |
| 7.20 / 7.70 / 8.20 | `field-tick` ×3 | yapılandırılmış alanlar yanarken |
| 8.40 | `source-line` | kaynak satırı çizilirken, onay hissi |
| 9.50 / 10.10 / 10.70 | `lang-shift` ×3 | dil değişimleri, küçük ve temiz |
| 11.60 | `close-sweep` | lacivert iner |
| 12.10 | `sonic-logo` | marka imzası, kuyruk CTA'ya uzanır |

---

## 8 · Gönderi metni (reklam kopyası)

Reel'in ekranında tek hedef var: `evlek.app`. İletişim adresi **açıklama metnine** girer, ekrana değil.

> Alıcılar artık aramaya yapay zekâdan başlıyor. Yapay zekâ ise yalnızca okuyabildiği ilanı söyleyebiliyor — sosyal medya gönderisini, mesaj listesini değil.
>
> Evlek'te ilanın yapılandırılmış olur: koçan bilgisi, metrekare fiyatı, bölge karşılaştırması, doğrulanmış ilan veren. Beş dilde. Sen uyurken.
>
> İlanını okunabilir yap → evlek.app
> Emlak ofisleri için: hello@evlek.app

---

## 9 · Kaynaklar

- North Cyprus Real Estate Market Review 2026 — durgunluk: https://northern-cyprus-property.com/north-cyprus-real-estate-market-review-2026/
- TRNC 63/2026 kararnamesi: https://www.dovecgroup.com/en/blog/north-cyprus-property-law-2026-new-rules
- Yabancılar için KKTC mülkiyet kuralları 2026: https://realting.com/news/north-cyprus-property-laws-for-foreigners-2026
- Emlakçıların AI aramada görünmezliği — HousingWire: https://www.housingwire.com/articles/agents-invisible-ai-search/
- Portalların ChatGPT entegrasyonları (Zillow/Redfin/Realtor.com): https://www.pinova.in/blog/real-estate-portals-chatgpt-app-2026
- 2026 State of AI Search in Real Estate: https://www.goflydragon.com/state-of-ai-seo-in-real-estate/
- GEO for Real Estate — yapılandırılmış veri: https://lseo.com/generative-engine-optimization-geo-for-real-estate/
- GEO 2026 rehberi: https://llmrefs.com/generative-engine-optimization

**Not:** 2. ve 3. bulgudaki oran/yüzde verileri pazarlama ajanslarının kendi çalışmalarından; KKTC'ye özel değil. Konumlandırmayı yönlendirirler, **ekranda iddia olarak kullanılmazlar.**
