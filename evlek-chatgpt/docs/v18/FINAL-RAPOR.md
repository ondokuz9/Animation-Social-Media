# V18 · FINAL CUT · Kısa rapor

15 Kasım 2026 · dal `video/evlek-chatgpt-v17` · kompozisyon `V18-916` (`src/v18/`). V15, V16 ve V17 değişmedi.

Kurgu sırası V17'dekiyle aynı; marka sahibi onayladı. V18'de değişenler:

1. **Özellikler kanıtı (+2 sn).** Salon fotoğrafı ilana indikten sonra gerçek ilan sayfası 500 px aşağı kayıyor. Özellikler çipleri 1 sn duruyor (13,6–14,6): Deniz manzarası · Ortak havuz · Otopark · Balkon · Eşyalı · Teras. Böylece sorgunun dört ölçütü de gerçek veriyle karşılanıyor. "Açıklama" bölümü ve içindeki "denize sıfır" hiçbir karede görünmüyor.
2. **Hafif yavaşlatma (kurgucu tablosu).**
   - Uzayan anlar: sonucun okunması (+%53), Evlek sayfası (+%42), Bağlı (+%55).
   - Aynı kalanlar: kart, fotoğraf ve bitiş.
   - Toplam süre 26,0 sn.
3. **Harf harf yazım.**
   - Yazım, kamera telefona yaklaşırken (1,85 sn) başlıyor.
   - Ritim: harf 2–3 kare, boşluk 3 kare, satır sonu 7 kare.
   - Her harfte gerçek tuş sesi (Kenney CC0, rastgele sırayla) ve tuş aydınlanması (3 kare) var.
4. **İnce işler turu.**
   - **Telefon:** Cam ve ekran siyahı tek parça. Sıcak, üç katmanlı gölge (temas, yakın, ortam). Pah ışığı ikiye bölündü (dış parlak, iç koyu). Metal sıcak tonda. Açılışta 6° eğimle yerleşiyor.
   - **Hareket bulanıklığı:** Yalnız saf kamera hareketlerinde (6 örnek, 120°). Metnin aktığı anlarda yok; orada hayalet kopya yapıyordu.
   - **Zemin:** Gren soft-light; zemin artık koyulaşmıyor. Giriş ve çıkış örtüsü de grenli. Işık merkezi yavaşça kayıyor.
   - **Kadraj:** Yazım kadrajı ortalandı. Bitişte telefonun altında ≥90 px pay var.
   - **Tipografi:** Sol hiza ±1 px. Etiketlerde `case`. Pasif adım hapları daha okunur. CTA gölgesi inceltildi.
   - **Dokunuş göstergesi:** 96 px, ince halka; dokunuşta genişleyen dalga.
5. **Ses.** `audio/film18.py`: film17 yapısı yeni zamanlara uyarlandı.
   - Harf başına tuş sesi; Özellikler'e kaydırma sesi.
   - Eklenti bölümünde akor yürüyüşü yeni adımlara oturuyor.
   - İlan bölümünde seviye çukuru dolduruldu.

## Teslim (git dışı, `out/`)

| Dosya | sha256 |
|---|---|
| `evlek_chatgpt_V18_FINAL_1080x1920_60fps.mp4` (sesli, 13,6 MB) | `4518c2a9c1cf3d56cf9d004c5c2db0753c7691673d1d72568e79ae66b6e18293` |
| `evlek_chatgpt_V18_FINAL_1080x1920_60fps_sessiz.mp4` | `5bf3e31358ed0c112ab0dc3303b4c0ffb7c7010e6ae7e653f8412950b46aaf64` |
| `evlek_chatgpt_V18_FINAL_kapak.png` (1,0 sn) | `c9b1410a4f16194e1ca5838b9c9bcfe0ff5dcce55fb18ccbf9c6704d06ca649d` |
| `audio/v18_master_48k.wav` | `c8def42ddd85732ca65f91138f1ebfd522b21c549334434096c2aa8629e73b0a` |

## Kontrol (`bash scripts/v18-qc.sh`)

- **Görüntü:** 1080×1920 · 60/1 · 1560 kare · 26,000 sn · h264 yuv420p · bt709.
- **Eşleşme:** Sessiz ve sesli dosyada video MD5 aynı (`6b0429e0…`); ses `-c:v copy` ile eklendi.
- **Kesme:** Siyah kare 0. Sert kesme yok; büyük kare farkları akan kamera hareketleri.
- **Ses:** −14,0 LUFS · LRA 8,4 · gerçek tepe −3,1 dBTP · mono kaybı 1,17 dB.
  - Telefon bandında sonuç +20,7 dB, bitiş +20,4 dB, Bağlı +9,2 dB.
  - Dokunuşlar ≤ +8,2 dB. Son 50 ms tam sıfır.
- **Ses testinde kalanlar:** 200–500 Hz bandı, sorgu ve eklenti bölümlerinde hedefin yaklaşık 2 dB üstünde. Açılış penceresi hedefin yaklaşık 1,5 dB altında.
- **Okunurluk:** 360 px ızgarada (`V18_izgara_2fps_360.jpg`) başlık, sorgu, sonuç, £139.000, Özellikler çipleri, adım satırı ve CTA okunuyor.
- **Render:** Hareket bulanıklığı belleği artırdığı için render 2 paralel sekmeyle alındı; görüntüye etkisi yok.
- **Dinleme ve izleme:** Ses dinlenmedi, video izlenmedi; değerlendirme kareler ve ölçümler üzerinden.
- **Denetim:** V18 ayrı bir doğruluk denetiminden geçmedi. İlan ve ekran verisi V16/V17 denetiminde doğrulanan kaynaklardan geliyor.

## Açıklama (caption) için

Evlek'in basın duyurusundaki ifade (13 Kasım 2026, "Evlek, Kuzey Kıbrıs emlak ilanlarını ChatGPT'ye taşıdı"):

> "Evlek, Kuzey Kıbrıs için ChatGPT'deki ilk emlak arama uygulamasıdır."

- Açıklamada bu cümle aynen kullanılmalı; daha geniş bir "Kıbrıs'ta ilk" ifadesine genişletilmemeli.
- "ChatGPT arayüzü temsilîdir" notu da açıklamaya eklenmeli.

## Yayın günü

- İlan hâlâ yayında mı, fiyat £139.000 mı, "8 ilan" sayısı aynı mı: kontrol edilmeli.

## Yeniden üretim

1. Görüntü (hareket bulanıklığı nedeniyle 2 paralel sekme):
   ```bash
   npx remotion render src/index.ts V18-916 out/v18.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png --x264-preset=slow --concurrency=2 --muted
   ```
2. Ses (önce `bash audio/fetch_samples.sh`):
   ```bash
   cd audio && python3 film18.py ../src/v18/tl.ts ../out/audio/v18 && cd ..
   ```
3. Mastering:
   ```bash
   GAIN=1 bash audio/master.sh out/audio/v18_raw.wav out/audio/v18_master_48k.wav
   ```
4. Mux ve kontrol:
   ```bash
   bash scripts/v18-qc.sh
   ```
