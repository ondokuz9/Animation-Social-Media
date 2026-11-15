# V16 · Evlek × ChatGPT lansman filmi · Kreatif rapor

15 Kasım 2026 · dal `video/evlek-chatgpt-v10` · yeni kompozisyon `V16-916` (`src/v16/`). V15 (`src/v15/`, `V15-916`) kıyas için değişmeden duruyor.

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

## Final kurgu (18,0 sn · 120 BPM · vuruş 0,5 sn)

| Zaman | İçerik | Kadraj |
|---|---|---|
| 0,00–1,75 | Gerçek ilanın havuz fotoğrafı; üstünde sorgu 4 öbekte | Fotoğraf penceresi 1080×1600, krem paspartu |
| 1,75–2,50 | Fotoğraf küçülüp gerçek £139.000 kartına oturur | Geçiş |
| 2,50–2,90 | Kart şeridi; sorgu krem üst bantta | Arayüz düz, 1:1 gerçek piksel |
| 2,90–4,50 | Tam telefon + "Evlek artık ChatGPT'de." | Telefon, krem sahne |
| 4,50–5,00 | Karta dokunuş; kart ilanın kahraman fotoğrafına büyür | Telefon |
| 5,00–6,95 | Gerçek ilan: £139.000, 2+1, 107 m²; galeri 2/14 | Telefon |
| 6,95–9,50 | Salon fotoğrafı (içeriden deniz); fiyat etiketi | Fotoğraf penceresi 1080×1600 |
| 9,50–11,50 | Fotoğraf ilana geri iner; "Emlakçıya sor" dokunuşu (10,9) | Telefon |
| 11,50 | Kesme | |
| 11,50–14,00 | "Eklentiler'den Evlek'i ekle." · Eklentiyi kur (12,45) → Bağlı (13,0) | Telefon |
| 14,00–18,00 | Logo · "artık ChatGPT'de." · ev fotoğrafı · tek CTA | Kapanış kartı |

**Grafik tasarım kararları:**
- **Sahne:** krem zemin (lacivert üstünde koyu arayüz yerine), lacivert tipografi, mercan yalnız vurgu. %7 gren; degradede bantlanma yok.
- **Tipografi:** Inter 700, −0,045em; etiketler 24–30 px, +0,14em, Türkçe büyük harf elle yazıldı ("GİRNE", "İLAN"). Rakamlar eş genişlikli.
- **Hiza:** bütün dış metin sola hizalı, x = 72.
- **Arayüz:** her karede düz (eğim 0°); perspektifli yeniden örnekleme yok. Kart yakın planı 1:1.
- **Fotoğraf:** 1080×1600 pencere; havuz kaynağa göre 1,333× → 1,36×, salon 1,00× → 1,10×. Yapay zekâ işlemi yok; yalnız kırpma ve Lanczos.
- **Güvenli alan:** dokunulan düğmeler ve CTA y ≤ 1600 (Reels alt arayüzünün üstü); ana metin y ≥ 84.

## Düzeltme turu (ilk tam render → final)

İlk tam render 19,0 sn'ydi (`out/v16_ilk_render_sessiz.mp4`). Kreatif direktör ve denetçi onu gördü; yapılanlar:

| Bulgu | Kaynak | Yapılan |
|---|---|---|
| 2,0 sn: fotoğraf grileşmiş arayüzün üstünde yapıştırma gibi | KD | Krem örtü 4 karede kalkar; köşe yarıçapı erkenden kart yuvasına eşlenir. |
| 3,0–5,0: telefon küçük, 2 sn yeni bilgi yok | KD | 1,6 sn'ye indi; telefon %8 büyüdü. |
| 5,0–10,5: dört kadraj sistemi | KD | İkiye indi: telefon ve fotoğraf penceresi. Çerçevesiz koyu ilan yakın planı kaldırıldı. |
| Eklenti bölümü 3 sn; iki ayrı CTA yazımı | KD | 2,5 sn; her iki yerde "Eklentiler'den Evlek'i ekle". |
| Sorgu hapı gerçek haritanın üstünde | denetçi | Sorgu krem üst banda taşındı; arayüzün üstünde etiket yok. |
| "107 M²" | denetçi | "107 m²"; büyük harf dönüşümü kaldırıldı. |
| Açılışta "Ev" simgeli etiket gerçek arayüz gibi | denetçi | Düz başlık: "CHATGPT'DE EVLEK'E SOR". |
| Salon fotoğrafı ilana inerken 17 px sıçrama | kendi ölçümüm | Hiza düzeltildi; kalkış ve inişte kare kare kayma 0 px (kare 416↔418, 605↔607). |
| Fiyat etiketi Reels alt alanında | kendi kontrolüm | 90 px yukarı alındı. |

**Kabul edilmeyen öneri:** KD "Emlakçıya sor" dokunuşunun çıkarılmasını istedi. Kurgucu ve denetçi "dokunuşta kes" dedi; marka sahibi de bu anı daha önce istemişti. Dokunuş korundu, 0,6 sn sonra kesiliyor.

## Final kontrol

**Teslim dosyaları** (git dışı, `out/`):

| Dosya | sha256 |
|---|---|
| `evlek_chatgpt_v16_1080x1920_60fps.mp4` (sesli, 14,4 MB) | `bed941dfe7700aaf276b00db0711abf717e5fefff0bf91a7a88c4223f6ac61cf` |
| `evlek_chatgpt_v16_1080x1920_60fps_sessiz.mp4` | `7077fd222dad40110296026f254063621594884236d27ef22d2216376c2dcd98` |
| `evlek_chatgpt_v16_kapak.png` (kare 0) | `ea4eeefb44bfccf56714776cda6af3e17e9bc9ef66997afc587fa9ca1eabf4d4` |
| `audio/v16_master_48k.wav` | `e7c5995df5614688892057b41d326c38aa77f3d1b30bdd76dc5ff3b9e3b18de0` |
| `v16_acilis_A.mp4`, `v16_acilis_B.mp4` | açılış denemeleri |

**Teknik çıktı** (`bash scripts/v16-qc.sh`):
- **Görüntü:** 1080×1920 · 9:16 · 60/1 · 1080 kare · 18,000 sn · h264 yuv420p · bt709.
- **Ses:** AAC 320 kb/sn, 48 kHz stereo · −14,0 LUFS · LRA 7,7 · gerçek tepe −2,5 dBTP.
- **Eşleşme:** sessiz ve sesli dosyada video MD5 aynı (`4da486d4…`); ses `-c:v copy` ile eklendi.
- **Kesmeler:** siyah kare 0; tek sert kesme planlanan 11,50 sn'de. Diğer büyük kare farkları akan geçişler (3,2 / 4,75 / 7,15 / 9,7 / 13,95).
- **Döngü:** film döngü olarak kurulmadı; son kare kapanış kartı.

**Uzman testleri:**

| Test | Sonuç | Kanıt |
|---|---|---|
| KD: 5. sn'ye kadar sorgu + £139.000 kartı aynı karede, 360 px'te | GEÇER | 2,5–2,9 sn (krem bant + kart). Süre 18,0 sn; CTA yazımı 1. |
| Görüntü yön.: fotoğraf ≥1080×1600, ölçek ≤1,36× | GEÇER | Kod değerleri: 1,333–1,36× ve 1,00–1,10×. Ufuk konumu ve kontrast final karede ayrıca ölçülmedi; kırpma uzmanın verdiği değerlerle aynı. |
| Kurgu: 2,40 sn'de sonuç kartı kadrajda | SINIRDA | Kart 2,50 sn'de tam oturuyor; 2,40 geçişin son kareleri. İlk gerçek sonuç: hedef ≤5,0 sn, gerçekleşen 2,5 sn. |
| Hareket: eğim 0°, siyah ≤%20, fotoğraf ≤6. sn'de ≥1,5 sn | KISMEN | Eğim 0° ve fotoğraf (0–1,75 sn) geçer. Siyah oranı 12–13. sn'de %27 (Evlek eklenti sayfasının kendi siyah boşluğu), 3. sn'de %21. Telefon sahnelerinde arayüz 1,7–1,8 px/pt (KD'nin "iki kadraj sistemi" kararıyla çelişen ölçüt). |
| Ses: sonuç sıçraması ≥+8 dB ve dokunuşlardan ≥3 dB büyük | GEÇER | Telefon bandında sonuç +19,6 dB; dokunuşlar −0,3…+3,9 dB. Mono kaybı 1,1 dB (hedef ≤1,5). Ev bölümü ritimli bölümden 2,5 dB sakin (hedef 3–5; biraz altında). |
| Denetçi: okunan her sayı ve etiket kaynakla uyumlu | GEÇER | Final renderda 11 kare tam çözünürlükte incelendi: dört düzeltmenin dördü yapılmış, sekiz maddenin sekizi geçer, uyumsuzluk 0, yeni bulgu yok. |

**Mobil ve sessiz izleme:** 360 px ızgarada (`v16_izgara_2fps_360.jpg`) sorgu, £139.000, "artık ChatGPT'de." ve CTA okunuyor. Sessizde üç şey anlaşılıyor: ne arandığı, ChatGPT'de gerçek bir ilanın geldiği, tek sonraki adım. Gerçek telefonda izleme yapılmadı; küçültülmüş karelerle değerlendirildi.

**Ses:** Dinlenemedi; yalnız ölçüldü. Sonuç anı ritmik vuruş (150 ms nefes, sonra kick + klap + glockenspiel + piyano); ev anı ritmin açılması (davul bir vuruş önce çıkar, uzun akor, deniz, tek piyano notası). Kaynaklar CC0 (`audio/SAMPLES.md`).

## V15 → V16

| | V15 (30 sn) | V16 (18 sn) |
|---|---|---|
| İlk gerçek sonuç | 8,45 sn | 2,5 sn |
| Ev büyük görünüyor | 15,4–16,5 sn (1,1 sn, ortada bant) | 0–1,75 ve 6,95–9,5 sn (4,3 sn, 1080×1600) |
| Yazım | 3,15–7,16 sn, harf harf | 0–1,0 sn, 4 öbek, fotoğrafın üstünde |
| Kurulum | 19,2–26,15 sn, 7 dokunuş | 11,5–14,0 sn, 1 dokunuş |
| Kapanış | 27–30 sn, boş telefon | 14–18 sn, logo + ev + tek CTA |

## Açık noktalar

1. **Yayın günü kontrolü:** İlan yayında mı, fiyat £139.000 mı, "8 ilan" sayısı aynı mı. Canlı sayfa 15 Kasım 2026'da doğrulandı.
2. **Doğrulanamayan:** Kurulu olmayan genel bir hesapta "Eklentiyi kur" akışı.
3. **Temsil notu:** ChatGPT kabuğu yeniden çizimdir. Not film içinde yok (marka sahibinin kararı); gönderi açıklamasına yazılmalı.
4. **Ses dinlenmedi.** Kulağa ters gelen yer olursa `audio/film16.py`'de tek tek değişir.
5. **Eklenti sayfası** gerçek sayfa gibi İngilizce ve büyük kısmı siyah; filmin en zayıf 2,5 saniyesi.

## Yeniden üretim

1. Görüntü:
   ```bash
   npx remotion render src/index.ts V16-916 out/v16.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png --x264-preset=slow --concurrency=4 --muted
   ```
2. Ses (önce `bash audio/fetch_samples.sh`):
   ```bash
   cd audio && python3 film16.py ../src/v16/tl.ts ../out/audio/v16 && cd ..
   ```
3. Mastering:
   ```bash
   bash audio/master.sh out/audio/v16_raw.wav out/audio/v16_master_48k.wav
   ```
4. Mux ve kontrol:
   ```bash
   bash scripts/v16-qc.sh
   ```

Düzenlenebilir proje: `src/v16/` (`tl.ts` zaman çizelgesi, `V16.tsx` sahne, `Screen.tsx` telefon ekranı), `audio/film16.py`.
