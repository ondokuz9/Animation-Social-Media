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

## Cila turu (kare kare + ses uzmanı)

Marka sahibi kurguyu onayladı; sıra değişmedi. Üç bağımsız inceleme yapıldı:

- **Hareket ve grafik tasarım:** 60 fps, geçişler kare kare; 12 bulgu.
- **Ses uzmanı:** dinleyemedi; ölçüm ve kod incelemesine dayandı; 9 madde.
- **ChatGPT iOS doğruluk denetçisi:** eklenti ekranları gerçek kayıtlarla karşılaştırıldı.

**Görüntü:**

- **Gönder (4,05 sn):** Metin artık her karede görünüyor. Kutudan balona tek hareketle akıyor; kamera aynı tempoda izliyor. Önceden tek karede siliniyor ve 300 px sıçrıyordu.
- **Kart → ilan (7,53 sn) ve dönüş (13,0 sn):** Kartın gerçek fotoğrafı ilanın kahraman fotoğrafına çapraz geçiyor; basma ölçeği sürüyor. Tek karelik düzen sıçraması giderildi.
- **Kart şeridi:** Sürükleme yumuşak başlıyor, süzülme sıfır hızla duruyor. Toplam yol ve £139.000'de duruş aynı.
- **Salon fotoğrafı (9,45 / 11,8 sn):**
  - Telefon fotoğrafın altından aşağı süzülüyor; yarı saydam telefon kareleri kalmadı.
  - Galeri okları tek karede kaybolmuyor.
  - Kalkış ve inişte kayma 0 px.
- **Eklenti bölümü:** Telefon tam kadrajda (ölçek 0,55); düğmelerin altı Reels alt bandının üstünde.
- **Kenar menü:** iOS eğrisiyle açılıyor.
- **Bitiş:** Eklenti başlığı ile bitiş başlığı üst üste biniyor; yazısız kare yok.
- **Yazma kamerası:** Yazım kutusuna daha yakın (siyah alan azaldı). "Evlek" araması sırasında kamera hafifçe yaklaşıyor; arama yazısı daha açık gri.
- **Okunurluk:** Küçük etiketler 24 → 30 px, adım hapları 28 → 32 px.
- **Gren:** Her 2 karede kayıyor; sabit toz gibi görünmüyor.

**ChatGPT iOS doğruluğu** (gerçek kayıt `eklenti_31_5`, `13_0`, `16_5`, `28_5` ve kenar menü/arama ekran görüntüleriyle):

- **Yeni sohbet:** sol üstte ×; yalnız çip varken mavi gönder düğmesi.
- **Klavye:** küre ve mikrofon satırı; boş kutuda büyük harf.
- **Evlek simgesi:** kayıttaki koyu zemin (#11171F).
- **Eklentiler sayfası:**
  - "Kurulu" ve "Popüler" gri;
  - arama sırasında 6 satır iskelet;
  - imleç metne bitişik;
  - temizle simgesi kayıttaki boyutta.
- **Evlek sayfası:** başlık normal kalınlıkta, metin renkleri kayıttaki gibi. Kimlikler satır sonunda bölünmüyor.
- **İkonlar:** dişli, Eklentiler, Codex ve Keşfet kayıttaki biçime yaklaştırıldı.

**Bilerek yapılmayanlar:**

- **Dynamic Island hapı:** Telefon markasız kalıyor; iPhone'u taklit etmemek için delik kamera korundu.
- **"Evlek MCP" ikinci satırı:** Genel kullanımda doğrulanmadı.
- **Hareket bulanıklığı:** Render süresini yaklaşık 6 katına çıkarıyor ve metni bulanıklaştırıyor.

**Ses** (`audio/film17.py` → `music17`; `film16.py` değişmedi):

- **Eklenti bölümü:** 15,4–18,0 sn arasında akor yoktu ve seviye −25 LUFS'a çöküyordu.
  - Artık D → G → Em → A → Asus4 → Bm9 → A yürüyüşü var; akor değişimleri eklenti adımlarıyla örtüşüyor.
  - Bas kökleri ve vibrafon ostinatosu devam ediyor; bölüm seviyesi doldu.
- **Açılış:** "Ev·lek" motifi (A4 → D5) ve kapalı hi-hat sekizlikleri.
- **Bitiş:** filmin en yüksek anı; sonuçtan +1,8 dB, Bağlı'dan +5,1 dB.
- **"Kur" dokunuşu:** altı doldu; telefon bandında +12,1 dB'den +2,9 dB'e indi.
- **Bağlı:** hafif nefes var (+10,4 dB).
- **Kuyruk:** 21,2–21,92 sn kosinüs sönüm; son 50 ms tam sıfır.
- **Ritim:** yarım groove 120 BPM ızgarasına oturdu.
- **EQ:** 300–320 Hz çamur kesildi (ped −6 dB, tuşlar −4 dB).
- **Mastering:** Doğrusal kazançla −14,0 LUFS (`GAIN=1 bash audio/master.sh`). Önceki yöntem ölçüm farkı yüzünden −14,6'da kalıyordu.

**Ses testi** (uzmanın eşikleri):

| Test | Eşik | Sonuç | |
|---|---|---|---|
| Seviye / gerçek tepe | −14 ±0,3 LUFS · ≤ −1,5 dBTP | −14,0 LUFS · −3,1 dBTP | GEÇER |
| Bitiş tepesi | sonuçtan ≥ +1,5 · Bağlı'dan ≥ +3 | +1,8 · +5,1 | GEÇER |
| Telefon bandı | dokunuş ≤ +7 · sonuç ve bitiş ≥ +12 | dokunuş ≤ +7,2 · sonuç +20,7 · bitiş +19,8 | GEÇER |
| Kuyruk | son 50 ms ≤ −70 dBFS | sıfır | GEÇER |
| Mono kaybı | ≤ 1,5 dB | 1,18 dB | GEÇER |
| Kısa süreli dip (2,4–19 sn) | ≥ I−8 | I−8,0 | SINIRDA |
| Açılış dibi | ≥ I−5 | I−7,0 | KALIR |
| 200–500 Hz / 2–5 kHz farkı | ≤ +7 dB | sorgu +8,8 · eklenti +8,9 | KALIR |

## Teslim (git dışı, `out/`)

| Dosya | sha256 |
|---|---|
| `evlek_chatgpt_V17_FINAL_1080x1920_60fps.mp4` (sesli) | `d33fc7112d573a5dd7b9aa00e85e6154625dc2e93a437939c1ac0548aa904bab` |
| `evlek_chatgpt_V17_FINAL_1080x1920_60fps_sessiz.mp4` | `826b14fb8062cce617b0a63cf75f9bc0fa49ac2a2394357b993b748e794b25ee` |
| `evlek_chatgpt_V17_FINAL_kapak.png` (1,0 sn) | — |
| `audio/v17_master_48k.wav` | `c45b65bc73ab5cac02b2fc8580ca72f9b6e5f70c3f574d63aaa9bd5ba7146047` |

## Kontrol (`bash scripts/v17-qc.sh`)

- **Görüntü:** 1080×1920 · 60/1 · 1320 kare · 22,000 sn · h264 yuv420p · bt709. Sessiz ve sesli dosyada video MD5 aynı (`d6ad438e…`); ses `-c:v copy` ile eklendi.
- **Kesme:** siyah kare 0; sert kesme yok, büyük kare farkları akan kamera hareketleri.
- **Ses:** −14,0 LUFS · LRA 7,7 · gerçek tepe −3,1 dBTP (ayrıntı yukarıdaki ses testinde).
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
   GAIN=1 bash audio/master.sh out/audio/v17_raw.wav out/audio/v17_master_48k.wav
   ```
4. Mux ve kontrol:
   ```bash
   bash scripts/v17-qc.sh
   ```
