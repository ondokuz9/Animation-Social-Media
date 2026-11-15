# VIDEO-1 v15.1 / v15.2 · Kısa rapor

15 Kasım 2026 · dal `video/evlek-chatgpt-v10` · kompozisyon `V15-916`

- **v15.1 (görüntü):** Kapanıştaki "arayüz temsilidir" dipnotu Rumi'nin isteğiyle kaldırıldı. Not, gönderi açıklamasına taşınacak.
- **v15.2 (ses):** Görüntü v15.1 ile birebir aynı. Yalnız ses değişti: arayüz sesleri ve akustik enstrümanlar artık gerçek kayıt (CC0).

## Teslim (git dışı)

| Dosya | sha256 |
|---|---|
| `out/evlek_chatgpt_v15_2_1080x1920_60fps.mp4` (**önerilen**, yeni ses) | `128505ad1f7619de4a336f6e11a8805461c06222ef6a0c80ae77e8d418cc4068` |
| `out/evlek_chatgpt_v15_1_1080x1920_60fps.mp4` (v15 sesi) | `3ebd8a3411de2b51eac9cb9f474f82c20366c4b1349f43db36223fc6ca2e0d9a` |
| `out/evlek_chatgpt_v15_1_1080x1920_60fps_sessiz.mp4` | `b13eb9a18111c672a832ec118afd0d34a6dc7b9a1fa2fff1286736bd62a7ed12` |
| `out/audio/v15_2_master_48k.wav` | `916a859414e7e2ad2f620866eaae98fe13d431f290d24547b3f8cf452a11fcfc` |

**Kontrol:**

- **Görüntü:** 30,000 sn · 1800 kare · 60/1 · bt709.
- **Video akışı:** Üç dosyada da aynı (MD5 `538ea38c…`); ses `-c:v copy` ile eklendi.
- **Bütünlük:** Siyah kare 0; döngü SSIM 0,992.
- **Kare farkı:** Kesme yok; büyük farklar yalnız portal (14,7 / 16,65) ve ilanın karta dönüşü (18,9).
- **Ses:** v15.2 −14,0 LUFS · LRA 4,4 · tepe −3,2 dBFS.

## v15.2 sesinde ne değişti

Kaynaklar, commit'ler, lisanslar ve tam eşleme: `audio/SAMPLES.md`.

**Arayüz (Kenney CC0 kayıtları):**

- **Klavye:** Harflerde üç farklı kısa tık rastgele sırayla; boşluk ve satırda daha pes bir "tok".
- **Dokunuş ve gönder:** Dokunuşlarda yumuşak "tok", gönderde kısa yükselen bir ses.
- **Oturma sesleri:** Sonuç, kart ve ilan oturmaları müzikle aynı tonda (Re majör notalara akortlandı).
- **Bağlı:** Mandal sesi ve tam Re6 onay çanı.

**Müzik (VCSL CC0 kayıtları):**

- **Yeni enstrümanlar:** Keçe piyano yerine Steinway B, pluck yerine vibrafon (yumuşak tokmak), çanlarda glockenspiel, gerçek el çırpma ve hi-hat.
- **Sentezde kalanlar:** Kick, bas, ped ve impact. Bunlar elektronik lansman müziğinde zaten sentezle yapılır.
- **Zamanlama:** Müziğin yapısı ve vuruş zamanları v15 ile aynı.

**Akort ve denge:**

- **Akort:** Dosya adına güvenilmedi, FFT ile ölçüldü. VCSL vibrafon ve glockenspiel adları bir oktav aşağıyı gösteriyordu; düzeltildi.
- **Seviye eşleme:** Her kayıt, değiştirdiği sentez sesin seviyesine eşitlendi; v15 dengesi korundu (bölümler ±0,5 dB).
- **Dokunuş netliği:** Telefon bandında dokunuşlar müziğin +4…+10 dB üstünde (v15'te +3…+6).
- **Tepe sınırlayıcı:** Kayıtlı dokunuşların 1–2 ms'lik atakları final vuruşundan sivriydi. Bu yüzden ses yükseltilirken dinamik eziliyordu (LRA 2,5). 1,5 ms ileri bakışlı bir sınırlayıcı eklendi; örneklerin yalnız %0,24'üne dokunuyor ve LRA 4,4'e döndü.

## Yeniden üretim

1. Örnekleri indir:
   ```bash
   bash audio/fetch_samples.sh
   ```
2. Miksi üret:
   ```bash
   cd audio && python3 film15_2.py ../src/v15/tl.ts ../out/audio/v15_2 && cd ..
   ```
3. Mastering:
   ```bash
   bash audio/master.sh out/audio/v15_2_raw.wav out/audio/v15_2_master_48k.wav
   ```
4. Mux ve kontrol:
   ```bash
   bash scripts/v15_2-mux.sh
   ```

## Açık noktalar

1. **Dinlemeden kuruldu:** Dengeyi ölçümle kurdum. Kulağa ters gelen tek bir ses olursa (ör. gönder sesi) `film15_2.py`'de tek satırla başka bir Kenney sesiyle değişir.
2. **Müzik yatağı:** Hâlâ kodla bestelenmiş, kayıtlı enstrümanlarla zenginleştirilmiş bir parça. Gerçek bir prodüksiyon müziği için en iyi yol ElevenLabs Music. Bunun için anahtar ortam sırrı olarak `ELEVENLABS_API_KEY` adıyla eklenmeli, sohbete yapıştırılmamalı. Alternatif olarak lisanslı bir parça seçilebilir.
