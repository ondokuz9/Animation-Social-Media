# V16 · Evlek × ChatGPT lansman filmi · Kreatif rapor

15 Kasım 2026 · dal `video/evlek-chatgpt-v10` · yeni kompozisyon `V16-916` (`src/v16/`); teslim adı FINAL. V15 (`src/v15/`, `V15-916`) kıyas için değişmeden duruyor.

## Yöntem

- **Altı bağımsız uzman:** Altı alt ajan paralel çalıştı; hiçbiri diğerinin çıktısını görmedi. Ortak brif: `docs/v16/ORTAK-BRIF.md`.
- **Video izleme:** Bu ortamda video oynatılamıyor. V15 kaynak MP4'ten kare çıkarılarak incelendi: 6 fps tam tarama (180 kare), 2 fps ızgara, kritik anlarda 1080×1920 tam çözünürlük kareler.
- **Ses:** Hiçbir uzman sesi dinleyemedi. Ses bulguları yalnız teknik ölçümdür (LUFS, true peak, bant enerjisi, senkron); dinleme gözlemi yoktur.
- **Referans filmler:** Zillow, Airbnb ve Higgsfield filmleri izlenemedi. Yalnız sayfa metni doğrulanabildi (aşağıda). Kararlar eldeki varlıklarla verildi.
- **İzleyici testi:** Yapılmadı. Açılış kararı editoryal değerlendirmedir.

## Ana fikir (kreatif direktör)

> ChatGPT'ye Türkçe bir cümle yaz; Kuzey Kıbrıs'taki gerçek ev, sohbetin içinde haritası ve fiyatıyla açılsın.

V15'in sözü 0–1,4 sn'de veriliyor ("Evlek artık ChatGPT'de."), karşılığı 8,45 sn'de yarım bir kartla geliyor; evin kendisi 14,7–16,45 sn'de yalnız 1,7 sn görünüyor.

## Öncelikli bulgular (V15)

| # | Zaman kodu | İzleyiciye etkisi | Müdahale | Doğrulama | Kaynak |
|---|---|---|---|---|---|
| 1 | 0–8,45 | İlk gerçek sonuç 8,45 sn'de. Yazım 4,0 sn sürüyor; kadrajın %55'i siyah (4,5 sn karesi). Sorgu 540 px karede ~16 px. | Sorgu büyük tipografiyle 4 öbekte, 1,2 sn'de gelir; sonuç ≤2,5 sn. | 360×640'ta sorgu ilk 2 sn'de okunur; kare 144'te sonuç kadrajda. | KD, kurgu, hareket |
| 2 | 8,6–13 | Arayüz gerçek boyutun üçte ikisinde ve −3,8° eğik (2,0 px/pt). Beş şey aynı ağırlıkta; ilk okunan fiyat £127.000, aranan £139.000 kartı yarım. | Okuma anlarında telefon düz ve kenardan kenara (≥2,75 px/pt); £139.000 kartı ortada sabit durur. | Arayüz karelerinde eğim 0°, px/pt ≥2,75. | hareket, KD |
| 3 | 14,7–16,7 | Tek arzu karesi yarıdan sonra, 1,1 sn tam; kadrajın üçte biri düz lacivert bant, ufuk tam ortada. | Ev en geç 6. sn'de, ≥1,5 sn kesintisiz; fotoğraf alanı ≥1080×1600. | Fotoğrafın ≥%80 genişlikte göründüğü kare sayısı ≥360. | görüntü yön., kurgu |
| 4 | 19,2–26,15 | Kurulum 6,95 sn (filmin %23'ü): 7 dokunuş, ikinci klavye, gri iskelet liste. | Ana filmde tek hareket: Evlek sayfası → "Eklentiyi kur" → "Bağlı". Uzun kurulum ayrı klip olur. | Ekrandaki talimat sayısı 1. | kurgu, KD |
| 5 | 18,30 ve 27–30 | "Emlakçıya sor" dokunuşunun sonucu yok; kapanışta 2–3 sn boş siyah telefon, CTA yok. | Dokunuşta kesilir (uydurma ekran çizilmez). Kapanış: ev fotoğrafı + logo + tek CTA. | Son 120 karede CTA ve ev birlikte. | kurgu, denetçi |
| 6 | 7,30–8,45 | Ekranda "Birkaç saniye düşündü" yazarken film 1,15 sn gösteriyor; hız vaadi gibi okunabilir. | Gönder ile sonuç arasında görünür geçiş; hız üzerine metin yok. | Metin taraması. | denetçi |
| 7 | ses, 8,45 | Telefon bandında sonuç vuruşu +3,2 dB, gönder tıkı +9,0 dB: en sert sesler arayüz tıkları. Ev anının ölçülebilir ses karşılığı yok. | Sonuç = ritmik vuruş (kick + klap + glockenspiel); ev = ritmin açılması (davul çıkar, uzun akor, deniz). Dokunuşlar −6 dB. | Aşağıdaki ses testi. | ses |

## Uzmanların geçer/kalır testleri

1. **KD:** 360×640'ta, 5,0 sn'ye kadar en az bir karede hem sorgu hem £139.000 kartı (fotoğraf + fiyat) okunur; süre 18–22 sn; CTA satırı tam 1.
2. **Görüntü yönetmeni:** Fotoğraf alanı ≥1080×1600, kaynak ölçeği ≤1,36×, ufuk pencerenin üstünden %40–45'te, metin kontrastı ≥4,5:1.
3. **Kurgu:** Kare 144'te (2,40 sn) sonuç kartı kadrajda.
4. **Hareket:** Arayüz karelerinde px/pt ≥2,75 ve eğim 0°; siyah oranı ≤%20; tam fotoğraf en geç 6. sn'de ≥1,5 sn.
5. **Ses:** 300 Hz–12 kHz mono'da sonuç sıçraması ≥+8 dB ve her dokunuştan ≥3 dB büyük.
6. **Denetçi:** 2 kare/sn taramada okunabilen her sayı ve etiket gerçek veriyle uyumlu; uyumsuzluk 0.

## Görüş ayrılıkları

| Konu | Görüş A | Görüş B | Karar |
|---|---|---|---|
| Havuz fotoğrafının ölçeği | Hareket: tam kadraj 1080×1920 (kaynağa göre 1,60×), gren yumuşaklığı örter. | Görüntü yön.: 1,60× yumuşar (keskinlik ölçüsü 1366 → 401); en fazla 1080×1600 pencere (1,333×). | B. Fotoğraf krem paspartulu 1080×1600 pencerede. |
| Fotoğraf üstü metin | Hareket: krem metin + lacivert degrade. | Görüntü yön.: gök üstünde lacivert metin (8,5:1). | B. Degrade fotoğrafı karartıyor; lacivert metin yeterli. |
| Açılış | KD: soğuk kitle için evle açılan, tanıyan kitle için aramayla açılan. | Kurgu: yazım kutusunda başla. | İki deneme render edildi; karar aşağıda. |
| Kapanış notu | Denetçi: "arayüz temsilidir" notu film içinde ya da açıklamada olmalı. | Marka sahibi: film içinden kalksın. | Marka sahibinin kararı; not gönderi açıklamasına. |
| Kart ölçeği | Hareket: kart 836 px (1,2× büyütme). | Gerçek piksel 1:1 kalsın. | 1:1 (kart 696 px); yeniden örnekleme yok. |

## Ürün doğruluğu (denetçi)

- **Sorgu ↔ sonuç:** Sekiz ilanın tamamı sorguya uyuyor (Lapta, satılık daire, 2+1, £105.000–£147.000, hepsi `sea_view`). Haritadaki "£105–147 bin · 8" bu aralık ve sayı.
- **İlan:** EVL-100102 · £139.000 · 2+1 · 2 banyo · 107 m² · Lapta, Girne · 14 foto. Canlı sayfa 15 Kasım 2026'da açıldı, değerler aynı.
- **Kullanılmayacaklar:** hız/süre iddiası, "denize sıfır" (konum semt düzeyinde), "havuzlu daire" (veri "ortak havuz"), "güncel fiyat", ofis adı, çizilmiş WhatsApp ekranı, dönen yükleme halkası (kayıtta yok).
- **Doğrulanamayan:** Kurulu olmayan genel hesapta "evlek" aramasının sonucu. Bu yüzden V16'da arama listesi gösterilmiyor; doğrudan Evlek eklenti sayfası var.

## Referans filmler

Hiçbiri izlenemedi; teknik gözlem yazılmadı.

| Marka | Bağlantı | Doğrulanabilen |
|---|---|---|
| Zillow | https://www.adsoftheworld.com/campaigns/someday-starts-today | "Someday Starts Today", Şubat 2026; 30 ve 15 sn'lik sürümler. Sayfada video yok. |
| Airbnb | https://buck.co/work/airbnb-experiences | "Airbnb Experiences & Services", BUCK; 2025 Summer Release'te gösterildiği yazıyor. Süre yok. |
| Higgsfield | https://www.youtube.com/@HiggsfieldAI | Yalnız kanal sayfası açıldı; belirli bir film doğrulanamadı. |

Bu adlar yalnız iç rapor içindir; filmde ve gönderi metninde geçmez.

## İki açılış denemesi

| | A · Evle açılan | B · Aramayla açılan |
|---|---|---|
| Kompozisyon | `V16-ACILIS-A` | `V16-ACILIS-B` |
| İlk kare | Lapta ilanının havuz fotoğrafı (1080×1600), üstünde sorgu | Krem zeminde büyük tipografiyle sorgu |
| Bağlantı | Fotoğraf küçülüp gerçek £139.000 kartına oturur | Sorgu sohbet balonuna iner, sonuç açılır, kart fotoğrafa büyür |
| Risk (KD) | "Herhangi bir emlak reklamı" gibi okunur; nedensellik ters | İlk kare yalnız yazı; sonuç 3 sn'yi geçerse V15 sorunu tekrarlanır |

Karşılaştırma ölçütleri (0,5 / 2 / 5. sn kareleri, sonra 360 px sessiz):
1. Göz önce nereye gidiyor?
2. Evlek'in ChatGPT'de ne yaptığı anlaşılıyor mu?
3. Hangi ev ya da mekân detayı akılda kalıyor?

## Karar: A (evle açılan)

Editoryal değerlendirmedir; gerçek izleyici testi yapılmadı. Kareler: `acilis_karsilastirma_V15_A_B.jpg`. Denemeler: `out/v16_acilis_A.mp4`, `out/v16_acilis_B.mp4` (5,5 sn; B'nin kaynağı commit `675fe73`).

| Soru | A | B |
|---|---|---|
| Göz önce nereye gidiyor? | 0,5 sn'de palmiyeli havuz adasına ve üstündeki sorguya; görüntü ile soru aynı karede. | Beyaz kutudaki yazıya; 2. sn'de kadrajın neredeyse tamamı siyah, yalnız küçük bir balon var. |
| Evlek'in ChatGPT'de ne yaptığı anlaşılıyor mu? | Evet: 2,5 sn'de aynı fotoğraf gerçek £139.000 kartında, altında "ChatGPT'ye sor" çubuğu. | Nedenselliği daha düz anlatıyor ama ev 5. sn'de geliyor. |
| Akılda kalan detay | Havuz adası ve deniz ufku (açılış, kart, kapanış), sonra çift kat pencereli salon. | Aynı havuz yalnız kart ölçeğinde. |

**İlk 5 saniye (KD):** İzleyici, deniz manzaralı palmiyeli bir havuzun üstünde sorguyu okuyor, aynı fotoğrafın ChatGPT sohbetinde £139.000'lık gerçek bir ilan kartına dönüştüğünü görüyor ve "Evlek artık ChatGPT'de." yazısını okuyor.

Marka sahibinin daha önceki şartı ("önce sorulur, sonra sonuç gelir") korunuyor: sorgu fotoğrafın üstüne yazılıyor, fotoğraf cevap olarak ChatGPT'deki karta iniyor.

## FINAL kurgu (20,0 sn · 120 BPM · vuruş 0,5 sn)

İlk V16 kurgusunda (18 sn, commit `a0b572e`) sorgu fotoğrafın üstüne yazılıyordu; ChatGPT'de Evlek'e yazma anı yoktu. Marka sahibi bu sahneyi istedi. Final kurguda açılış fotoğrafı korunuyor, yazma sahnesi gerçek ChatGPT yazım kutusunda geri geliyor.

| Zaman | İçerik | Kadraj |
|---|---|---|
| 0,00–1,40 | Gerçek ilanın havuz fotoğrafı + "Evlek artık ChatGPT'de." | Fotoğraf penceresi 1080×1600, krem paspartu |
| 1,40–2,00 | Fotoğraf üste çekilir; altta ChatGPT yazım kutusu ve klavye açılır | Üstte fotoğraf, altta arayüz yaprağı |
| 2,10–3,00 | Evlek çipi + sorgu, dört öbekte | Arayüz düz, kenardan kenara |
| 3,50–4,50 | Gönder → balon, gri "Evlek" araması, "Birkaç saniye düşündü" | Aynı; fotoğraf üstte kalır |
| 4,50–5,30 | Sonuç: arayüz kadrajı doldurur (balon, harita, kartlar) | Arayüz düz |
| 5,30–6,50 | Kart şeridi: £139.000 · 2+1 · 107 m² · Lapta, Girne | 1:1 gerçek piksel |
| 6,50–8,95 | Karta dokunuş → gerçek ilan; galeri 2/14 | Telefon |
| 8,95–11,50 | Salon fotoğrafı (içeriden deniz) + fiyat etiketi | Fotoğraf penceresi 1080×1600 |
| 11,50–13,50 | Fotoğraf ilana iner; "Emlakçıya sor" dokunuşu (12,9) | Telefon |
| 13,50 | Kesme | |
| 13,50–16,00 | "Eklentiler'den Evlek'i ekle." · Eklentiyi kur (14,45) → Bağlı (15,0) | Telefon |
| 16,00–20,00 | Logo · "artık ChatGPT'de." · ev fotoğrafı · tek CTA | Kapanış kartı |

**Grafik tasarım kararları:**
- **Sahne:** krem zemin, lacivert tipografi, mercan yalnız vurgu. %7 gren; degradede bantlanma yok.
- **Tipografi:** Inter 700, −0,045em; etiketler 24–30 px, +0,14em, Türkçe büyük harf elle yazıldı ("GİRNE", "İLAN"). Rakamlar eş genişlikli.
- **Hiza:** bütün dış metin sola hizalı, x = 72.
- **Arayüz:** her karede düz (eğim 0°). Yazma, sonuç ve kart anlarında kenardan kenara; kart yakın planı 1:1.
- **Boş siyah ekran yok:** yazma ve arama sırasında arayüz yalnız alt yaprakta; üstte ev fotoğrafı duruyor. Arayüz kadrajı ancak sonuç gelince dolduruyor.
- **Fotoğraf:** 1080×1600 pencere; havuz kaynağa göre 1,333× → 1,36×, salon 1,00× → 1,10×. Yapay zekâ işlemi yok; yalnız kırpma ve Lanczos.
- **Güvenli alan:** dokunulan düğmeler ve CTA y ≤ 1600 (Reels alt arayüzünün üstü).

## Düzeltme turları

İlk tam render 19,0 sn'ydi; kreatif direktör ve denetçi onu gördü.

| Bulgu | Kaynak | Yapılan |
|---|---|---|
| Telefon küçük, 2 sn yeni bilgi yok | KD | O sahne kaldırıldı; söz açılış fotoğrafına taşındı. |
| Dört kadraj sistemi art arda | KD | Üçe indi: fotoğraf penceresi, düz arayüz, telefon. |
| Eklenti bölümü 3 sn; iki ayrı CTA yazımı | KD | 2,5 sn; her iki yerde "Eklentiler'den Evlek'i ekle". |
| Sorgu hapı gerçek haritanın üstünde | denetçi | Kaldırıldı; sorgu artık gerçek sohbet balonunda. |
| "107 M²" | denetçi | "107 m²"; büyük harf dönüşümü kaldırıldı. |
| Açılışta "Ev" simgeli etiket gerçek arayüz gibi | denetçi | Düz başlık: "CHATGPT'DE EVLEK'E SOR". |
| Salon fotoğrafı ilana inerken 17 px sıçrama | kendi ölçümüm | Hiza düzeltildi; kalkış ve inişte kayma 0 px (kare 536↔538, 725↔727). |
| Gönderdikten sonra ~1 sn siyah kadraj | kendi kontrolüm | Arama alt yaprakta kalıyor, fotoğraf üstte; kadraj sonuçla açılıyor. |
| Gönder → sonuç 0,5 sn, atlama görünmüyor | denetçi (final) | "Evlek" araması 1,0 sn'ye uzatıldı; sonuç 4,5 sn'de. |
| 4,2 sn'de solan başlık fotoğrafın üstünde | denetçi (final) | Başlık açılmadan önce 8 karede söner. |
| Ses yükseklik eşitleyicisi sakin bölümleri kendiliğinden yükseltiyordu | kendi ölçümüm | Master doğrusal kazançla alınıyor; bölüm dengesi mikste kuruldu. |

**Kabul edilmeyen öneri:** KD "Emlakçıya sor" dokunuşunun çıkarılmasını istedi. Kurgucu ve denetçi "dokunuşta kes" dedi; marka sahibi anın kalmasını onayladı. Dokunuş korundu, 0,6 sn sonra kesiliyor.

## Final kontrol

**Teslim dosyaları** (git dışı, `out/`):

| Dosya | sha256 |
|---|---|
| `evlek_chatgpt_FINAL_1080x1920_60fps.mp4` (sesli, 14,9 MB) | `cf443e557cc70aa02514904e6298ce3b36e2a498278670bf578a198611fcd078` |
| `evlek_chatgpt_FINAL_1080x1920_60fps_sessiz.mp4` | `cdba5f85565149d91994efd2d27b7e042eff5ee04e81cd1b3cd0f43b159916fc` |
| `evlek_chatgpt_FINAL_kapak.png` (0,8 sn karesi) | `45d138310e4711e4ae33879cb549a484319a42bf9ab1688c898acce64d7174c6` |
| `audio/v16_master_48k.wav` | `28090a67bebaa59cb1330de22fbf3ec4186ac65cd944fd7039147f0dd76937d2` |
| `v16_acilis_A.mp4`, `v16_acilis_B.mp4` | açılış denemeleri |

**Teknik çıktı** (`bash scripts/v16-qc.sh`):
- **Görüntü:** 1080×1920 · 9:16 · 60/1 · 1200 kare · 20,000 sn · h264 yuv420p · bt709.
- **Ses:** AAC 320 kb/sn, 48 kHz stereo · −13,9 LUFS · LRA 7,2 · gerçek tepe −3,8 dBTP.
- **Eşleşme:** sessiz ve sesli dosyada video MD5 aynı (`2633b559…`); ses `-c:v copy` ile eklendi.
- **Kesmeler:** siyah kare 0; tek sert kesme planlanan 13,50 sn'de.
- **Döngü:** film döngü olarak kurulmadı; son kare kapanış kartı.

**Uzman testleri:**

| Test | Sonuç | Kanıt |
|---|---|---|
| KD: 5. sn'ye kadar sorgu + £139.000 kartı, 360 px'te | GEÇER | Sorgu 3,0 sn'de tam; 4,5–5,0 sn'de balon ve kartlar aynı karede; £139.000 5,3 sn'den itibaren 1:1. Süre 20,0 sn; CTA yazımı 1. |
| Görüntü yön.: fotoğraf ≥1080×1600, ölçek ≤1,36× | GEÇER | Kod değerleri: 1,333–1,36× ve 1,00–1,10×. Ufuk konumu ve kontrast final karede ayrıca ölçülmedi. |
| Kurgu: ilk gerçek sonuç ≤5 sn | GEÇER | Hedef ≤5,0 sn, gerçekleşen 4,5 sn (V15: 8,45). Kurgucunun 2,40 sn hedefi, yazma sahnesi geri geldiği için tutmuyor. |
| Hareket: eğim 0°, siyah ≤%20, fotoğraf ≤6. sn'de ≥1,5 sn | KISMEN | Eğim 0° ve fotoğraf (0–1,4 sn tam, 3,5 sn'ye kadar üstte) geçer. Koyu piksel oranı yazma ve arama sırasında %36–53 (klavye ve yazım kutusu; boş ekran değil), eklenti sayfasında %27. |
| Ses: sonuç sıçraması ≥+8 dB ve dokunuşlardan ≥3 dB büyük | GEÇER | Telefon bandında sonuç +20,2 dB; dokunuşlar −0,2…+5,2 dB. Mono kaybı 1,1 dB. Ev bölümü ritimli bölümden 3,7 dB sakin (hedef 3–5). |
| Denetçi: okunan her sayı ve etiket kaynakla uyumlu | GEÇER | 19,5 sn'lik final kurguda 18 kare tam çözünürlükte incelendi: sekiz maddenin sekizi geçer, uyumsuzluk 0. Yazım kutusu, çip ve balon gerçek kayıtla uyumlu (klavyede dünya/mikrofon satırı yok). İki rötuş önerisi son renderda uygulandı; son render denetçiye yeniden gönderilmedi, ben kare kare kontrol ettim. |

**Mobil ve sessiz izleme:** 360 px ızgarada (`FINAL_izgara_2fps_360.jpg`) söz, sorgu, £139.000 ve CTA okunuyor. Sessizde üç şey anlaşılıyor: ne sorulduğu, ChatGPT'de gerçek bir ilanın geldiği, tek sonraki adım. Gerçek telefonda izleme yapılmadı; küçültülmüş karelerle değerlendirildi.

**Ses:** Dinlenemedi; yalnız ölçüldü. Sonuç anı ritmik vuruş (150 ms nefes, sonra kick + klap + glockenspiel + piyano); ev anı ritmin açılması (davul bir vuruş önce çıkar, uzun akor, deniz, tek piyano notası). Kaynaklar CC0 (`audio/SAMPLES.md`).

## V15 → FINAL

| | V15 (30 sn) | FINAL (20 sn) |
|---|---|---|
| Açılış | 0–2,2 sn: koyu zeminde küçük telefon | 0–1,4 sn: ev fotoğrafı + söz |
| Yazma | 3,15–7,16 sn, harf harf, kadrajın %55'i siyah | 2,1–3,0 sn, dört öbek; üstte ev fotoğrafı |
| İlk gerçek sonuç | 8,45 sn | 4,5 sn |
| Ev büyük görünüyor | 15,4–16,5 sn (1,1 sn, ortada bant) | 0–1,4 ve 8,95–11,5 sn (3,9 sn, 1080×1600) |
| Kurulum ve kapanış | 19,2–30 sn: 7 dokunuş, boş telefon | 13,5–20 sn: 1 dokunuş, logo + ev + tek CTA |

## Açık noktalar

1. **Yayın günü kontrolü:** İlan yayında mı, fiyat £139.000 mı, "8 ilan" sayısı aynı mı. Canlı sayfa 15 Kasım 2026'da doğrulandı.
2. **Doğrulanamayan:** Kurulu olmayan genel bir hesapta "Eklentiyi kur" akışı.
3. **Zaman sıkıştırması:** Gönder ile sonuç arası filmde 1,0 sn; ekranda gerçek etiket "Birkaç saniye düşündü" duruyor. Hız üzerine metin ya da seslendirme yok.
4. **Temsil notu:** ChatGPT kabuğu yeniden çizimdir. Not film içinde yok (marka sahibinin kararı); gönderi açıklamasına yazılmalı.
5. **Ses dinlenmedi.** Kulağa ters gelen yer olursa `audio/film16.py`'de tek tek değişir.

## Yeniden üretim

1. Görüntü:
   ```bash
   npx remotion render src/index.ts V16-916 out/v16.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png --x264-preset=slow --concurrency=4 --muted
   ```
2. Ses (önce `bash audio/fetch_samples.sh`):
   ```bash
   cd audio && python3 film16.py ../src/v16/tl.ts ../out/audio/v16 && cd ..
   ```
3. Mastering (doğrusal kazanç):
   ```bash
   LRA=20 bash audio/master.sh out/audio/v16_raw.wav out/audio/v16_master_48k.wav
   ```
4. Mux ve kontrol:
   ```bash
   bash scripts/v16-qc.sh
   ```

Düzenlenebilir proje: `src/v16/` (`tl.ts` zaman çizelgesi, `V16.tsx` sahne, `Screen.tsx` telefon ekranı), `audio/film16.py`.
