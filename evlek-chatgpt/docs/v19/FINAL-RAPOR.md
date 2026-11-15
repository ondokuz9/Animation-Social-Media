# V19 · FINAL CUT · Kısa rapor

15 Kasım 2026 · dal `video/evlek-chatgpt-v17` · kompozisyon `V19-916` (`src/v19/`). V15–V18 değişmedi.

V18'den farkı yalnız ilan bölümü (8–17 sn) ve marka sahibinin son üç notu. Kurgu sırası, yazım, ses yapısı ve eklenti bölümü aynı.

## İlan bölümü (yönetmen + UX turu)

İki bağımsız uzman (20 yıllık sinema yönetmeni ve mobil ürün deneyimi tasarımcısı) aynı teşhisi koydu:

- **Bağlam kopuyordu:** Sayfa bir sahne aksesuarı gibi kullanılıyordu. Fotoğraf uygulamadan çıkıp krem zemine taşınıyor, sonra geri dönüyordu.
- **Kamera dağınıktı:** Bölüm boyunca kamera 6 kez yön değiştiriyordu.
- **Sahipsiz eylem vardı:** "Emlakçıya sor"a basılıyordu ama sonuç gösterilmiyordu.

Yeni akış, gerçek bir kullanıcının ilan bakma sırasıyla ve tek yönde ilerliyor:

| Zaman | Ekranda | Kamera |
|---|---|---|
| 8,35–8,85 | Karta dokunuş, ilan ChatGPT içinde açılır | Kart yakınından ilan üstüne |
| 8,85–10,0 | Fiyat okunur; parmak galeriyi kaydırır (1/14 → 2/14) | Çok yavaş yaklaşma |
| 10,0–12,0 | Salon fotoğrafı; pencerede deniz | Ölçülü yaklaşma (0,83 → 1,08) |
| 12,0–12,7 | Parmak sayfayı yukarı iter | Sayfayla birlikte iner |
| 12,7–14,5 | Fiyat, Temel bilgiler, Özellikler: "Deniz manzarası" | Sabit (okuma anı) |
| 14,5–15,7 | Kamera bir kez geri çekilir; ✕ ile ilan sohbetteki karta döner | Tam telefon |
| 15,7–16,6 | Parmak kalkmadan aynı köşedeki ☰'ye basar; Eklentiler başlar | Sabit |

**Diğer kararlar:**

- **"Emlakçıya sor":** Sayfanın gerçek parçası olarak görünür, ama basılmaz. Sonucu (WhatsApp) gösterilemez; çizmek uydurma olurdu.
- **Editoryal fotoğraf penceresi:** Kalktı.

## Marka sahibinin son notları

1. **"Telefona çok yaklaşıyor."** Okuma anlarında ölçek 0,92–1,0 yerine 0,74–0,88. Telefonun gövdesi ve kenarları her yerde görünür.
2. **Fotoğrafların sol üstündeki ikinci "‹".** Widget'ın kendi geri düğmesiydi; üstte zaten ✕ olduğu için kaldırıldı.
   - Kahraman fotoğraf, aynı fotoğrafın gerçek kaynağından çiziliyor (ilan yakalamasıyla 1 px içinde hizalı).
   - Galeri okları ‹ › ve "n / 14" sayacı gerçek yakalamadan geliyor.
3. **Giriş için profesyonel doku.** Krem zemine pencereden düşen yumuşak ışık şeritleri ve kayıt gölgeleri eklendi (kodla; çok yavaş kayar). Zeminin altı hafif koyu, başlık satır satır maskeyle açılıyor. Aynı dil bitişte de var.

## Teslim (git dışı, `out/`)

| Dosya | sha256 |
|---|---|
| `evlek_chatgpt_V19_FINAL_1080x1920_60fps.mp4` (sesli, 14,2 MB) | `4ae947a65ae96f57594222594f6892b51dcfb4ab816ab03db38802440d4b6a3b` |
| `evlek_chatgpt_V19_FINAL_1080x1920_60fps_sessiz.mp4` | `064a0e538181088dfa5fdfeff567ac12ba9150fc8fb14164748781fb85d3494d` |
| `evlek_chatgpt_V19_FINAL_kapak.png` (1,0 sn) | `a18bbbe8381385ba0b1208b62477986135c889f81281c850889724113b54eedd` |
| `audio/v19_master_48k.wav` | `42052b5314cd73515f3efc1b9d05a8ee3c609a47a160a91cf36f7e4d1b0aa3e0` |

## Kontrol (`bash scripts/v19-qc.sh`)

- **Görüntü:** 1080×1920 · 60/1 · 1560 kare · 26,000 sn · h264 yuv420p · bt709.
- **Eşleşme:** Sessiz ve sesli dosyada video MD5 aynı (`2cfe3fca…`); ses `-c:v copy` ile eklendi.
- **Kesme:** Siyah kare 0. Sert kesme yok; büyük kare farkları akan kamera hareketleri.
- **Ses:** −14,0 LUFS · LRA 7,8 · gerçek tepe −3,6 dBTP · mono kaybı 1,17 dB.
  - Telefon bandında sonuç +20,7 dB, bitiş +20,6 dB, Bağlı +10,7 dB.
  - Dokunuşlar ≤ +3,3 dB. Son 50 ms tam sıfır.
- **Dinleme ve izleme:** Ses dinlenmedi, video izlenmedi; değerlendirme kareler ve ölçümler üzerinden.
- **Doğruluk denetimi:** V19 ayrı bir doğruluk denetiminden geçmedi. İlan ve ekran verisi önceki denetimlerde doğrulanan kaynaklardan geliyor.

## Açıklama (caption) ve yayın günü

- **"İlk" cümlesi:** Basın duyurusundaki ifade aynen kullanılmalı: "Evlek, Kuzey Kıbrıs için ChatGPT'deki ilk emlak arama uygulamasıdır." (13 Kasım 2026)
- **Temsil notu:** "ChatGPT arayüzü temsilîdir" notu açıklamaya eklenmeli.
- **İlan kontrolü:** İlanın hâlâ yayında olduğu, fiyatın £139.000 olduğu ve "8 ilan" sayısı yayın günü kontrol edilmeli.

## Yeniden üretim

1. Görüntü (hareket bulanıklığı nedeniyle 2 paralel sekme):
   ```bash
   npx remotion render src/index.ts V19-916 out/v19.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png --x264-preset=slow --concurrency=2 --muted
   ```
2. Ses (önce `bash audio/fetch_samples.sh`):
   ```bash
   cd audio && python3 film19.py ../src/v19/tl.ts ../out/audio/v19 && cd ..
   ```
3. Mastering:
   ```bash
   GAIN=1 bash audio/master.sh out/audio/v19_raw.wav out/audio/v19_master_48k.wav
   ```
4. Mux ve kontrol:
   ```bash
   bash scripts/v19-qc.sh
   ```
