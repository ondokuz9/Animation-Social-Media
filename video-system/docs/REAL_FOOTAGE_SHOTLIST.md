# Gerçek çekim listesi

14 Ekim 2026. AI fotoğrafların yerine gerekenler ve Onur'un ilk toplu çekimi.
Her şey 4K, mümkünse 60 fps (filmler 60 fps). Telefon yeterli; gimbal tercih.
Dikey (9:16) ve yatay (16:9) ayrı ayrı çekilir, kırpılarak üretilmez.

## A. Mevcut filmlerdeki AI fotoğrafların yerine

Hepsi **izinli, gerçek bir aktif ilandan** (ofisin yazılı izni + ilan no).

| Mevcut dosya | Yerine gereken | Not |
|---|---|---|
| `hook-girne-liman.jpg` | Girne limanı, altın saat | Kamu alanı; yüzler tanınmayacak mesafede. |
| `room-00-bos.jpg` / `stage-00-bos.jpg` | Gerçek ilanın **boş** salonu, sabit tripod açısı | Sanal dekorasyonun kaynağı. Aynı açıdan döşeli sürüm Evlek'in kendi staging özelliğiyle üretilir ve etiketlenir. |
| `room-01-akdeniz.jpg` / `stage-01..03` | Yukarıdaki odanın Evlek staging çıktıları | Ürün içinden, 6 stilden seçilen 2–3 tanesi. |
| `niyet-salon.jpg`, `room-02-minimal.jpg` | Aynı ya da ikinci ilandan döşeli salon | |
| `peek-balkon.jpg`, `detay-balkon.jpg`, `stage-10-balkon.jpg` | Gerçek balkon + manzara | Manzara gerçekte ne ise o. |
| `stage-11-mutfak.jpg` | Gerçek mutfak | |
| `kiyi.jpg`, `ilan-a-deniz.jpg` | Kıyı / deniz, gerçek konum | |
| `ilan-c-site.jpg` (Girne kuşbakışı da bu) | Site dış cephe + izinli drone Girne genel plan | Drone izni ve uçuş kuralları kontrol edilmeli. |
| `detay-isik.jpg` | Gerçek iç mekân ışık detayı | |

Toplam: **2–3 gerçek ilan**, tercihen Girne, biri boş (staging için).

## B. Onur ile toplu çekim (yarım gün)

1. **Kamera karşısı kayıt**, nötr fon, iki ışık, yaka mikrofonu:
   - 6–8 kısa parça (10–20 sn): "Sahte ilanın 5 işareti", "Rozet ne demek",
     "Mimar gezide neye bakar", "Bu ilan neden yayına girmedi" (anonim),
     emlakçıya "Aynı ilan, beş dil".
   - Avatar/dublaj için: 2 dk düz anlatım, sabit kadraj (araç gereksinimine göre).
2. **Ses**: 3 dk temiz okuma (ses klonu için), sessiz odada.
3. **Gezi**: gerçek ilanda yürüyerek tur, Onur kadrajda ve kadraj dışında.
4. **Ekran kaydı**: evlek.app'te gerçek akış — cümleyle arama → ilan →
   "İlan Veren" → WhatsApp. Tarayıcı ve telefon, temiz hesapla.
5. **Detay planlar**: el, kapı, pencere, anahtar yok (anahtar teslimi Evlek'in
   işi değil).

## C. Gereken belgeler

- Onur'un imzalı izni (`AI_FOOTAGE_POLICY.md` §4).
- Her ilan için ofis izni: ilan no, fotoğraf/video kullanımı, kanallar, süre.
- Kamera karşısına çıkacak emlakçılar için izin.
- Lisanslı müzik: 2–3 parça, ticari ve reklam kullanımı yazılı (ücretli
  kampanyada da geçerli olmalı). Lisans PDF'i `video-system/assets/audio/`
  yanına, ses dosyası checksum ile.

## D. Sırada ne var

1. Onur 2–3 ilan seçer, ofislerden izin alınır.
2. Çekim günü.
3. Fotoğraflar `video-system/assets/approved/` altına **yeni adlarla** eklenir
   (eskiler silinmez).
4. Emlakçı filminde yalnız `content.json` varlık satırları değişir; V7 için
   `video/brand-reel-v8` dalında yeni film.
