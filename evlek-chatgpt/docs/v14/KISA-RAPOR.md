# VIDEO-1 v14 · Final (sesli) · Kısa rapor

15 Kasım 2026 · dal `video/evlek-chatgpt-v10` · kompozisyon `V14-916` (`src/v14/`). v13 ve önceki sürümler değişmedi.

**Teslim** (git dışı):

| Dosya | Boyut | sha256 |
|---|---|---|
| `out/evlek_chatgpt_v14_1080x1920_60fps.mp4` (sesli) | 15,3 MB | `74640bd0b2ff816092381b37dd48523412c54c5e189697fb112d6ff60e15f4ad` |
| `out/evlek_chatgpt_v14_1080x1920_60fps_sessiz.mp4` | 14,0 MB | `86f3d8e6c4c2a758fbbac0affc4d73100bfa92192c88067f2f90a22d975879fb` |
| `out/audio/v14_master_48k.wav` | — | `ed5a405981ed7b4258730047c046c860fc879f182183658e458dc97ae9f6b354` |

**Video:**
- 30,000 sn · 1080×1920 · 60/1 · 1800 kare
- h264 yuv420p · tv · bt709 (matris, primaries ve transfer)
- Sesli ve sessiz dosyada video akışı birebir aynı (MD5 `860d29c2…`). Ses eklenirken görüntü yeniden kodlanmadı (`-c:v copy`).

**Ses:**
- AAC 320 kb/sn · 48 kHz stereo
- Entegre −14,0 LUFS · LRA 5,1 LU · tepe −3,1 dBFS (gerçek tepe ≤ −1,5 dBTP)

## Rumi'nin maddeleri → v14'te ne değişti

Bulguların tamamı kare kanıtıyla `BULGULAR.md`'de; ham uzman çıktıları `kurul/` altında.

### 1. "Telefon telefona benzemiyor"

`src/v14/Phone.tsx` (v12 telefonuna dokunulmadı).

- **Malzeme:** Mavi-grafit gövde koyu nötr metale döndü; ön halka degradeli. 4 px'lik parlak pah ışığı siluetin zeminden ayrılmasını sağlıyor (v13'te kontrast 1,38:1'di).
- **Yan yüz:** 30 dilim, ortada speküler şerit. Okuma pozlarında açı ry −12°, kapakta ry −17°; böylece telefonun kalınlığı ve sağdaki iki metal tuş (güç ve ses) görünüyor. v13'te yan yüz hiç görünmüyordu.
- **Cam ve ekran:** Cam mürekkebi #0B0D10 ve ince cam kenarı ekranın nerede başladığını belli ediyor.
- **Delik kamera:** v13'te 82 px sola kayıktı (kod hatası); artık ekranın tam ortasında.
- **Gölge:** Eski diyagonal gölge yerine ortam gölgesi ve yumuşak düşen gölge var.
- **Ekran ve zemin:** Ekranın üstüne hiçbir karartma ya da filtre binmiyor. Karartma yalnız zeminde; zemin ışığı poza bağlı ve telefonun üst üçte birinin arkasında.
- **Kapak ve kapanış:** Gerçek kayıttaki gibi klavyesi açık bir yeni sohbet var. Telefon artık siyah bir levha değil, kullanılan bir telefon gibi okunuyor.

### 2. "Ekran yarım duruyor"

- Telefon her karede tam görünüyor; gövde ile kadraj kenarı arasında ≥48 px pay var. Tek istisna, telefonun bilinçli olarak gizlendiği ev (portal) anı.
- Dört poz var: KAPAK, B (okuma), A (sonuç ve slogan), E (eklenti). v13'te filmin yaklaşık %55'inde telefon kadrajdan taşıyordu.
- Okuma pozlarında rz 0°. Gerçek Evlek pikselleri eğik yeniden örneklenmiyor.

### 3. "ChatGPT'de Evlek kullanımı seksi değil"

Akış kare kare:

- **Yazma:** Soru gerçek bir Türkçe klavyeyle, kelime kelime yazılıyor (kelime içinde harf başına 4 kare).
- **Gönder:** Parmak gönder tuşuna basıyor. Yazı kutudan balona uçuyor, klavye iniyor, gönder tuşu "durdur" durumuna geçiyor.
- **Arama → sonuç:** "Evlek" etiketi taranıyor, ardından "Birkaç saniye düşündü ›" satırı geliyor. Gerçek Lapta sonucu tek parça halinde oturuyor; bu an müziğin düşüş vuruşuyla aynı karede.
- **Kart:** Parmak kart şeridini sürüklüyor (içerik parmağı 1:1 izliyor), bırakınca şerit doğal biçimde yavaşlayarak £139.000'de duruyor. Ardından karta dokunuluyor.
- **İlan:** Kartın kırpımı tam ekrana büyüyor; kartın fotoğrafı ilanın kahraman fotoğrafına birebir oturuyor. Opaklıkla erime ya da iç içe ekran yok.
- **Ev:** Havuz fotoğrafı ilanın çerçevesinden büyüyor (1,08×, kalite korunuyor). Telefonun yerini bulanık havuz alıyor; hayalet telefon kalmıyor. Fotoğraf sonra aynı yere geri iniyor. Bu anda dış metin yok.
- **Galeri:** Parmakla sürüklenerek salon fotoğrafına (2/14) geçiliyor.
- **Emlakçıya sor:** Gerçek "Emlakçıya sor ↗" düğmesine dokunuluyor (senin isteğin, korundu). Ardından ✕ ile ilan karta geri küçülüyor.
- **Kamera:** Tek hareket kuralı uygulanıyor. Kamera hareket ederken ekran içeriği duruyor, içerik hareket ederken kamera duruyor.

### 4. "Evlek eklenti eklemek düzgün anlatılmamış"

- **Dış metin:** Üstte "Eklentiler'den ekle." başlığı, altında tek satırlık numaralı adım (mercan disk):
  1. Eklentiler
  2. "evlek" ara
  3. Eklentiyi kur

  Kurulum bitince disk ✓ oluyor.
- **Dokunuşlar:** Her adımda parmak imleci hedefe gidip basıyor; basış ile ekran değişimi arasında ≥0,18 sn var.
- **Akış:** Kenar menü (gerçek sırayla) → Eklentiler → "Eklenti ara" → klavye açılıyor, liste iskelete dönüyor (gerçek davranış) → "evlek" yazılıyor → Evlek satırı → Evlek sayfası → Eklentiyi kur → dönen gösterge → Bağlı → Sohbette dene → klavyesi açık yeni sohbette Evlek çipi.
- **Gerçek kayda uyum:** Kurulum sonrası ekran kayıttaki gibi: gri "Bağlı" (onay işareti yok), gri "Sohbette dene" düğmesi, paylaş simgesi dişliye dönüyor.

### 5. "Sesleri sen üret"

`audio/synth.py`, `audio/film14.py`, `audio/master.sh`.

- **Kaynak ve lisans:** Ses tamamen kodla sentezlendi; sample, kayıt ya da harici model yok. Lisans sorunu yok.
- **Müzik:** 104 BPM ızgara; 13 ölçü = 30 sn, dikişsiz döngü. Müzikteki vuruşlar görüntüdeki olaylara denk geliyor:
  - 8,45 sonuç (düşüş);
  - 13,07 kart dokunuşu;
  - 19,99 eklenti bölümü;
  - 24,60 "Bağlı".
- **Enstrümanlar:** Re majör; cam ped, keçe piyano, Karplus–Strong pluck, telefonda duyulsun diye harmoniği zenginleştirilmiş bas, hafif davul.
- **Efektler:** Yazma tıkı, dokunuş, gönder, sürtünme ve detent, sonucun oturması, ev sahnesinde deniz ambiyansı, "Bağlı" mandalı. Her vuruşta küçük perde ve seviye farkı var; aynı ses tekrar etmiyor.
- **Ses imzası:** Palindromik "Ev·lek" (girişte D5 → A4, kapanışta A4 → D5). Whoosh ve klişe riser yok.
- **Mastering:** EQ (telefon hoparlörü için alt bölge azaltıldı, netlik bandı açıldı), hafif kompresyon ve teyp doygunluğu, iki geçişli loudnorm.

## Kontrol sonuçları

- **Önce still turu** (28 kare), sonra tam render.
- **Tam film taraması:**
  - 6 fps tarama (180 kare);
  - siyah kare 0;
  - döngü SSIM 0,995 (son kare ↔ ilk kare);
  - ardışık kare farkında kesme yok. En büyük farklar 14,7 (portal açılışı), 16,65 (portal dönüşü) ve 18,9 (ilan karta küçülürken) sn'de; üçü de akan hareket, sıçrama değil.
- **Ses:**
  - −14,0 LUFS, LRA 5,1;
  - telefon hoparlörü simülasyonunda (300 Hz–12 kHz) dokunuş ve tıklar müziğin üstünde duyuluyor;
  - döngü dikişinde dairesel işleme sayesinde süreksizlik yok.

## Bilinçli tercihler ve açık noktalar

1. **Plandan sapma:** Finish masası "Emlakçıya sor" dokunuşunu kaldırmayı önermişti. Senin daha önceki "emlakçıya ulaş" isteğin nedeniyle korudum; dokunuştan sonra ✕ ile kapanıyor.
2. **Klavye:** Artık görünüyor; markasız. Küre ve mikrofon satırı ile dil etiketi çizilmedi.
3. **Lapta sonucunun ilk karesi:** Kart şeridi £127.000'den başlıyor. Gerçek ilk sırada CGI ve insan görüntülü kartlar var ve bunlar varlıklara hiç alınmadı.
4. **Dış metin:** Dış fiyat künyesi (£139.000 / Lapta…) kaldırıldı. Böylece filmde yalnız 3 ana mesaj kaldı; fiyat ilanın kendi gerçek pikselinde görünüyor.
5. **Yayından önce doğrulanacaklar:**
   - ilanın hâlâ yayında olduğu ve fiyatının £139.000 olduğu;
   - "evlek" aramasının herkese açık hesapta aynı sonucu verdiği.
6. **Yeniden üretim:**
   1. Görüntü:
      ```bash
      npx remotion render src/index.ts V14-916 out/v14.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png --x264-preset=slow --concurrency=4 --muted
      ```
   2. Ses miksi:
      ```bash
      cd audio && python3 film14.py ../src/v14/tl.ts ../out/audio/v14 && cd ..
      ```
   3. Mastering:
      ```bash
      bash audio/master.sh out/audio/v14_raw.wav out/audio/v14_master_48k.wav
      ```
   4. Mux ve kontrol:
      ```bash
      bash scripts/v14-qc.sh
      ```
