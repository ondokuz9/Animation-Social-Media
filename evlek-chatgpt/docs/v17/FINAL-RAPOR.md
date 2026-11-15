# V17 · FINAL · Kısa rapor

15 Kasım 2026 · dal `video/evlek-chatgpt-v17` · kompozisyon `V17-916` (`src/v17/`). V15 ve V16 değişmedi.

## Neden V17

Marka sahibi V16'yı reddetti: açılış telefonsuz bir fotoğraftı ve ChatGPT'nin kullanımı görünmüyordu. İstenen sıra şuydu:

1. başlık ve telefon,
2. ekrana yaklaşırken ChatGPT'de Evlek'e yazma,
3. etkileşim,
4. Eklentiler'den Evlek'i ekleme,
5. bitiş.

Üst kurul taslağı bu sırayla sınadı. Uygulanan düzeltmeler:

- **Yazım:** kamera yaklaşması bittikten sonra başlıyor.
- **Bitiş:** yeni sohbet ≥0,6 sn görünüyor; bitiş açılışla eşleşiyor (aynı başlık ve telefon, tek fark Evlek çipi).
- **Süre:** 22 sn; eklenti bölümü 13,0–19,0.
- **Eklenti bölümü:** telefon büyütüldü; 3 adım satırı sıradaki adımı vurguluyor.

Kurulun önerip uygulanmayanlar:

- ChatGPT karşılama satırı ve öneri hapları: gerçek kayıtta doğrulanmadı.
- Fotoğraf anında telefonu %40 opaklıkta tutmak: fotoğraf 1,8 sn sürüyor, ardından telefona geri iniyor.

## Kurgu (22,0 sn · 120 BPM)

| Zaman | Ne oluyor |
|---|---|
| 0,0–1,6 | "Evlek artık ChatGPT'de." · altında telefon, ChatGPT yeni sohbet |
| 1,6–2,4 | Kamera telefonun ekranına yaklaşır |
| 2,45–3,45 | Evlek çipi + "Lapta'da £160 bin altı, deniz manzaralı 2+1 daire" (4 öbek) |
| 3,85 | Gönder → balon üste, "Evlek" aranıyor, "Birkaç saniye düşündü" |
| 5,0 | Sonuç: harita + kartlar (gerçek piksel) |
| 5,75–7,45 | Kart şeridi kaydırılır, £139.000 kartına dokunulur |
| 7,5–9,2 | Gerçek ilan (tam telefon), galeri 2/14 |
| 9,45–11,8 | Salon fotoğrafı telefondan çıkıp büyür (fiyat etiketi), sonra geri iner |
| 12,4 / 12,85 | "Emlakçıya sor" dokunuşu · ✕ |
| 13,0–19,0 | "Eklentiler'den Evlek'i ekle." · menü → Eklentiler → "evlek" ara → Evlek → Eklentiyi kur → Bağlı → Sohbette dene |
| 19,1–22,0 | "Evlek artık ChatGPT'de." · Evlek çipli yeni sohbet · CTA "Eklentiler'den Evlek'i ekle" |

## Teslim (git dışı, `out/`)

| Dosya | sha256 |
|---|---|
| `evlek_chatgpt_V17_FINAL_1080x1920_60fps.mp4` (sesli, 13,5 MB) | `247fc87a6f14a8eb63d188d58cfdbd50d59e725d5fd6573ac0c62083c6a0cbfe` |
| `evlek_chatgpt_V17_FINAL_1080x1920_60fps_sessiz.mp4` | `73d9bb3055163365807951d7bd95adeb7242c0b32c3f76ef382a1cbd9c1b2144` |
| `evlek_chatgpt_V17_FINAL_kapak.png` (1,0 sn) | — |
| `audio/v17_master_48k.wav` | `82645b52d8c6f4df081480d28d54f0961b1a960f71ffb5d8a30f29a99baa53e6` |

## Kontrol (`bash scripts/v17-qc.sh`)

- **Görüntü:** 1080×1920 · 60/1 · 1320 kare · 22,000 sn · h264 yuv420p · bt709. Sessiz ve sesli dosyada video MD5 aynı (`98a125b4…`); ses `-c:v copy` ile eklendi.
- **Kesme:** siyah kare 0; sert kesme yok, büyük kare farkları akan kamera hareketleri.
- **Ses:** −14,6 LUFS · LRA 8,5 · gerçek tepe −3,9 dBTP. Platformlar −14'e normalize ediyor; 0,6 dB fark doğrusal mastering'de tepe sınırından.
  - Telefon bandında sonuç vuruşu +19,9 dB, Bağlı +29,3 dB, bitiş +20,4 dB; dokunuşlar +2…+12 dB. Mono kaybı 1,2 dB.
- **Okunurluk:** 360 px ızgarada (`V17_izgara_2fps_360.jpg`) başlık, sorgu, £139.000, adım satırı ve CTA okunuyor.
- **Ürün doğruluğu:** Sorgu, ilan değerleri ve Evlek widget/ilan pikselleri V16 denetimiyle aynı kaynaklardan; denetçi o kaynaklarda uyumsuzluk bulmadı.
  - Bu sürümdeki eklenti ekranları V15'ten gelir: kenar menü, Eklentiler, arama, Evlek sayfası, Bağlı.
  - Dönen yükleme halkası kaldırıldı (kayıtta yok).
  - V17 denetçiye ayrıca gönderilmedi.
- **Ses dinlenmedi;** yalnız ölçüldü.

## Açık noktalar

1. **Yayın günü kontrolü:** ilan yayında mı, fiyat £139.000 mı, "8 ilan" sayısı aynı mı.
2. **Arama listesi:** "evlek" araması tek satır gösteriliyor. Kurulu hesabın kaydında iki satır var; kurulu olmayan genel hesapta doğrulanmadı.
3. **Temsil notu:** "ChatGPT arayüzü temsilîdir" notu gönderi açıklamasına yazılmalı.

## Yeniden üretim

1. Görüntü:
   ```bash
   npx remotion render src/index.ts V17-916 out/v17.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png --x264-preset=slow --concurrency=4 --muted
   ```
2. Ses (önce `bash audio/fetch_samples.sh`):
   ```bash
   cd audio && python3 film17.py ../src/v17/tl.ts ../out/audio/v17 && cd ..
   ```
3. Mastering:
   ```bash
   LRA=20 bash audio/master.sh out/audio/v17_raw.wav out/audio/v17_master_48k.wav
   ```
4. Mux ve kontrol:
   ```bash
   bash scripts/v17-qc.sh
   ```
