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

_Karar ve final sonuçları renderlardan sonra aşağıya işlenir._
