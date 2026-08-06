# Emlakçı Reel · v7 — final kesim

36.000 sn · 2160 kare · 60 fps · 1080×1920 · sessiz · tamamen Türkçe
Kaynak: `remotion/src/reels/emlakci/` · Baseline: `baselines/evlek-emlakci-reel.json`

Bu belge yayınlanan final kesimin kare seviyesinde kaydı. v6 belgesi 30 sn'lik
kesimi anlatır ve konumlandırma bölümü hâlâ geçerlidir; bu belge yalnızca
v6 → final arasında değişenleri ve nihai kurguyu kaydeder.

---

## 0 · Final kesimi şekillendiren süreç

İki tur uzman incelemesi:

1. **20 ajanlık tasarım paneli** (33 sn kesimi öncesi): Staging ve Asistan
   aktlarını yüzeyinden değil önermesinden yeniden kurdu. Staging bir
   karşılaştırma değil üretim hattı oldu; Asistan Evlek'in kendi zemininden
   çıkarılıp YABANCI bir panele taşındı (grafit yüzey, 36px radius, kaynak
   listesi, alıntı mekanizması).

2. **İki uzmanlı 0.4 sn kare teftişi** (33 sn kesim üzerinde, final öncesi):
   bir ince işler uzmanı + bir kusur müfettişi, 33 sn'lik master'ın 83
   karesinin tamamını inceledi. 26 kusur (4 kritik) raporlandı; final kesim
   4 kritiğin 4'ünü ve orta/küçük kusurların neredeyse tamamını giderdi.
   En önemli yapısal sonuç: film sözlerini insanların okuyabildiğinden hızlı
   harcıyordu — süre 33 → 36 sn'ye çıktı ve zamanın tamamı üç yere gitti:
   Yayınla'nın üç başlığı, Diller'in beş dili, Kapanış'ın ibaresi.

3. **Marka geçişi** (kullanıcı bulgusu): "İlan koymak değişti." ekranını
   markasız gören bir emlakçı filmi terk etti. Gerçek wordmark artık hook'ta
   (kapak karesi), tezde, beş kartın her birinde (pencere içi plaka) ve
   makroda (uygulama çubuğu kadraja girene dek) var. İzleyici filme hangi
   karesinden girerse girsin markayı bekletmeden öğrenir.

---

## 1 · Kurgu tablosu

|  #  | akt      | süre  | zemin        | kayıt                              |
|-----|----------|-------|--------------|------------------------------------|
|  1  | Açılış   | 10.30 | lacivert→krem| hook, tez, beş kart, dönüş         |
|  2  | Yayınla  |  5.00 | krem         | cihaz, makro 2.4× → geniş          |
|  3  | Diller   |  3.20 | krem         | yalnız tipografi                   |
|  4  | Staging  |  4.03 | fotoğraf     | üretim hattı                       |
|  5  | Match    |  3.30 | lacivert     | büyüyen dendrit                    |
|  6  | Arama    |  3.00 | krem         | tam kadraj arayüz                  |
|  7  | Asistan  |  4.20 | lacivert     | yabancı panel + alıntı             |
|  8  | Kapanış  |  3.20 | lacivert     | marka plakası                      |

İki dissolve (Yayınla→Diller 6k; Asistan→Kapanış 8k), gerisi sert kesme.
Toplam: 2160 kare = 36.000 sn.

## 2 · Akt notları (v6'dan değişenler)

**Açılış.** Hook nefes alıyor (1.00→1.03, kare 0 dokunulmadı — kapak).
Hook'ta ve tezde gerçek wordmark. Tez alt satırı "Sen yayınla. Gerisini
Evlek yönetsin." 2.2 sn tam görünür (liste 0.44 sn arayla). Beş kartın
penceresinde marka plakası + ince çerçeve; örnekleme pencereleri sabit
bölgelere alındı (Yayınla 2.25–2.55, Staging 1.70–2.00, Asistan 3.78–3.98).
Dönüş anında kart artık BİTMİŞ ilan: "Bunları Evlek yaptı." geçmiş zamanı
görüntüyle çelişmiyor; sonraki aktın makrosu geriye dönüş olarak okunuyor.

**Yayınla.** 5.00 sn. Makro 2.4× (fiyat + boş açıklama + buton birlikte).
Başlıklar kamera oturduktan sonra giriyor ve her biri ≥1 sn: hook_2 tek
satır 54px ("bastın." kırpılması satır sarmasıydı). "Evlek yazıyor…"
mikro-durumu yayınlanmış-ama-boş kart çelişkisini kapatıyor. Masaüstü ok
imleci yerine parmak gölgesi + basışta altın dalga halkası. Akt dolu
biterek Diller dissolve'üne içerik taşıyor — 14.0 sn'deki boş kare öldü.

**Diller.** 3.20 sn. TR 0.80, diğer dört dil eşit 0.53'er. Devir artık
çapraz-geçiş değil TAKAS: iki metin opaklığın üçte birinden fazlasını asla
paylaşmıyor — Almanca'nın sağındaki Arapça hayaleti bitti.

**Staging.** Başlık scrim'i fotoğraf yerleşene dek kalıyor (beyaz-üstü-beyaz
bitti). "Evlek üç stilde döşüyor." (şimdiki zaman — ÜRETİLİYOR durumuyla
çelişki yok). Develop çizgisi uçlarda sönümleniyor. Kaynak etiketi kartın
üst kenarına bağlandı. AKDENİZ/MİNİMAL artık doğru İ ile.

**Match.** Etiketler büyümeyle paralel (1.30'dan itibaren), etiketli final
1.4 sn duruyor. Etiket dili alıcı dili: "Girne'de 2+1 arıyor", "Denize
yakın istiyor", "Balkonlu arıyor", "Yatırım için bakıyor". Hepsi güvenli
alanda (y<1500). Merkez kart seçilen Akdeniz görselini taşıyor.

**Arama.** Başlık arama çubuğuyla aynı anda; yazım 6 kare sonra. Sorgu
"Girne'de denize yakın balkonlu 2+1" ve ÜÇ SONUÇ DA 2+1 — "4 KRİTERE UYAN
İLANLAR" (doğru İ) artık kendi kanıtıyla çelişmiyor. Üçüncü sonuç balkon
fotoğrafı (Alsancak). "Senin ilanın" rozetine kontur.

**Asistan.** Soru 0.22'de (boş panel yok). Panel kenarı aydınlatıldı.
ARANIYOR→BULUNDU ayrık pencereli takas (üst üste binme imkânsız). Kaynak
kartının metni tarama geçene kadar iskelet — "aranırken bulunmuş" paradoksu
bitti. Vurgu opaklığı kontrast için düşürüldü.

**Kapanış.** 3.20 sn; kurulum 1.9'da bitiyor, tam plaka 1.3 sn sabit.
"Sen yayınla. / Gerisi Evlek'te." — tezle aynı fiil. Zemin hikâyenin kendi
Akdeniz odası (duotone). "Görseller ve ilan bilgileri temsilîdir." 24px,
son 1.4 sn boyunca okunur.

## 3 · Dil ve dürüstlük kuralları

- Bütün mono etiketler `trUpper()` (tr-TR locale) ile basılır; CSS
  `text-transform: uppercase` bu projede yasak (noktasız-I hatası).
- Uydurma rakam yok; asistan cevabı 2. aktta yazılan cümleyi kelimesi
  kelimesine alıntılar.
- Tüm fotoğraflar AI üretimi (C2PA, trainedAlgorithmicMedia): Staging
  rozeti + "Filmdeki tüm görseller temsilîdir." + kapanış ibaresi.
- Rakip adı/ekranı yok; koçan yok; ürün bildirim göndermez, film de
  göstermez.

## 4 · QC kaydı

- Encode: `remotion/encode-emlakci.mjs` → onaylı V7 hattının `encode()`'u.
  Kapı: 2160/2160 kare, 60/1, yuv420p, High L4.2, BT.709/tv, progressive,
  0 ses.
- Kare denetimi: benzersizlik ~%94, en uzun sabit bölge <15 kare (Diller
  dil duruşları — 0.25 sn altı, görünmez).
- V7 golden master her adımda doğrulanır:
  `3c22d5a3b6483127e3ca871d915453c5a17f844be0776387d46381950603ff71`.
- Güncel master sha256'sı ve ölçümleri `baselines/evlek-emlakci-reel.json`
  içinde pinli tutulur; bu belge sayı kopyalamaz.
