# VIDEO-1 v13 · Kısa rapor

15 Kasım 2026 · dal `video/evlek-chatgpt-v10` · kompozisyon `V13-916` (`src/v13/`). v12 ve önceki sürümler olduğu gibi duruyor.

**Teslim:** `out/evlek_chatgpt_v13_1080x1920_60fps.mp4` (git dışı)
- 30,000 sn · 1080×1920 · 60/1 fps · 1800 kare · sessiz · 13,0 MB
- yuv420p · tv · bt709 (matris, primaries ve transfer)
- sha256 `f15853a859565027665322c828e4fdf13ae924c55f9e62d06226f30ee3d8c18a`

**Dayanak:**
- Rumi'nin v12 geri bildirimi
- Kurgu masası (`KURUL-v13.md`, seçenek A′)
- Rumi'nin 15 Kasım kararları:
  - Kanca A′.
  - evlek.app çıksın; yerine "emlakçıya ulaş".
  - Kalite.
  - Sonda "Eklentiler'den ekle".
  - Yeni kayıt yok; iOS ekran görüntüleri kullanılacak.
  - Ses en sona kalacak.

## Akış

| Saniye | Bölüm | Ne oluyor |
|---|---|---|
| 0,0–2,3 | GİRİŞ | Lacivert zemin, Evlek logosu, "artık ChatGPT'de." ve yanıp sönen imleç. Altta telefon, ekranda boş yeni sohbet. Ev yok. 1,4–2,1'de logo yay çizerek yazım kutusuna iner ve Evlek çipine dönüşür. |
| 2,3–6,2 | GELİŞME · yaz | Kamera yazım kutusuna iner (kutu kadrajın ortasında). Soru insan hızında yazılır: "Lapta'da £160 bin altı, deniz manzaralı 2+1 daire". 6,2'de gönder. |
| 6,35–8,3 | ara → sonuç | Balon yukarı kalkar, Evlek etiketi 0,8 sn ışıldar, gerçek Lapta widget'ı gelir; üstünde "Birkaç saniye düşündü ›" satırı. |
| 8,5–10,35 | | "Sor. Evlek göstersin." |
| 10,35–12,6 | kart | Sohbet kayar, kart şeridi sürüklenir, £139.000 kartı okunur, 12,6'da dokunuş. |
| 12,75–14,45 | ilan | Kartın fotoğrafı kahraman alanına uçar; gerçek tam ekran detay (1/14) açılır. Arkadaki zemin ilanın bulanık fotoğrafına döner. |
| 14,45–17,55 | ev | Havuz fotoğrafı ilanın kendi çerçevesinden geniş bir kareye büyür (1,08×, özgün çözünürlüğe yakın). Künye: "£139.000 / Lapta · 2+1 · 107 m²". Ardından fotoğraf aynı yere geri iner. |
| 17,7–19,3 | | Galeride "›" ile 2/14 salon gelir. Kamera ilanın tamamına çekilir, "Emlakçıya sor ↗" düğmesine dokunulur. |
| 19,3–24,6 | SONUÇ | Üstte "Eklentiler'den ekle." ve "ChatGPT › Eklentiler › Evlek › Ekle". Ekranda sırayla: kenar menü (Kitaplık, Projeler, Eklentiler, Planlanmış, Codex, Keşfet) → Eklentiler → "evlek" araması → Evlek → Eklentiyi kur → Bağlı → Sohbette dene. |
| 24,45–26,15 | | Yeni sohbette Evlek çipi görünür; çip kalkıp logoya döner, telefon kapak pozuna iner. |
| 26,15–30,0 | | "artık ChatGPT'de." harf harf yazılır; dipnot gelir. Son kare ilk kare. |

## Kontrol

- **Still turları** (toplam 49 kare). Bulunan ve düzeltilen hatalar:
  - ilan açılışında iç içe telefon ekranı;
  - kapakta küçük ve karanlık telefon;
  - imlecin satır altına kayması;
  - yazma planında dörtte üçü boş siyah kadraj.
- **Tam render sonrası:**
  - 6 fps tarama (180 kare);
  - ardışık kare farkı: planlanmamış sıçrama yok; büyük farklar yalnız 17,7 (galeri "›") ve 19,3 (bölüm kesmesi);
  - siyah kare 0;
  - döngü SSIM 0,996.
- **Metin ile telefon arası** (3B izdüşüm): kapak ≥49 px, slogan 88 px, yol bloğu ≥60 px.
- **Gerçek piksel:** Evlek ekranlarının hepsi gerçek widget yakalaması. Görünen kartlar: £120.000, £127.000, £139.000, £139.990. CGI ve insanlı kartlar hiçbir varlıkta yok. Ofis ve kişi adı yok.
- **ChatGPT kabuğu temsilî;** düzeni Rumi'nin iOS ekran görüntüleriyle ve Onur'un kaydıyla eşleşiyor. Kenar menüde kişisel sohbet listesi ve sabitlenenler yok. Eklentiler ekranında üçüncü taraf logo ve adları yerine nötr yer tutucular var.

## Bilinçli tercihler ve açık noktalar

1. **Klavye gösterilmedi.** Gerçekte arama ve yazma sırasında açık; iPhone kopyası riskini azaltmak ve kadrajı sade tutmak için yok.
2. **Arama sırasında ekranda yalnız ışıldayan "Evlek" etiketi var.** Gerçekte ne yazdığı kayıtta yok; uydurma bir durum metni yazılmadı. "Birkaç saniye düşündü ›" kayıtta görülen gerçek metin ve sonuç gelince çıkıyor.
3. **Kapakta ve kapanışta telefon ekranı boş yeni sohbet.** Gerçeğe sadık, ama ekran koyu. Dikkat bilinçli olarak logo ve başlıkta.
4. **"Emlakçıya sor ↗"** gerçek widget düğmesi; dokunuşun sonrası (WhatsApp) gösterilmiyor.
5. **Ses yok.** Rumi'nin kararıyla en son yapılacak; kodla sentez planlandı (müzik + efekt, seslendirme yok, 48 kHz, −14 LUFS).
6. **Yeniden üretim:**
   ```bash
   npx remotion render src/index.ts V13-916 out/v13.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png --x264-preset=slow --concurrency=4 --muted
   ```
   Ardından transfer etiketi yeniden kodlamasız düzeltilir:
   ```bash
   ffmpeg -i out/v13.mp4 -c copy -bsf:v h264_metadata=transfer_characteristics=1 -movflags +faststart out/evlek_chatgpt_v13_1080x1920_60fps.mp4
   ```
