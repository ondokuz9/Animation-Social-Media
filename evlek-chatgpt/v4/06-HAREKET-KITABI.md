# VIDEO-1 v7 · Hareket kitabı (ince iş)

**Ana kural:** ChatGPT kabuğu stok ve gerçek kalır. Evlek widget'ının içi ise ürünün yarınki hâli gibi "seksi" hareket edebilir, ama her hareket bir sebebe bağlıdır ve 400 ms'yi geçmez.

**Kurul koltukları:**

1. Hareket yönetmeni (ürün filmleri).
2. iOS arayüz sadakati uzmanı.
3. Widget hareket tasarımcısı.
4. Başlık tipografı.
5. Ses tasarımcısı.
6. Kırmızı takım.

---

## A. Gerçeklik sözleşmesi (iOS uzmanı)

Bunlar değişmez. Bozulursa video sahte görünür.

| Öğe | Gerçek davranış | Ayrıntı |
|---|---|---|
| Çözünürlük | iPhone ekran kaydı ölçeği | Arayüzü 1179×2556 mantığında kur (3x), 1080 genişliğe indir. Gövde yazısı yaklaşık 46 px görünür; videoda okunurluk sorunu kalmaz. 9:16 kadraj dikeyde kamerayla taşınır. |
| Klavye | iOS koyu klavye | Yazarken alttan açılır (280 ms, iOS eğrisi). Basılan tuşun büyütülmüş önizlemesi görünür; gerçek ekran kaydının en güçlü işareti bu. Gönderince klavye iner. |
| Yazma ritmi | İnsan | Harf başına 55–95 ms rastgele, boşluklarda 120–180 ms, bir kez 300 ms duraksama. Video için 1,4× hızlandır ama ritim korunur. |
| "@Evlek" | Mention listesi | "@" ile liste açılır; yalnız "Ev · Evlek · Northern Cyprus property data" satırı. Dokunulunca satır kısa gri vurgulanır, girişte "Ev Evlek" etiketi oluşur. |
| Gönderme | Balon yükselmesi | Kullanıcı balonu girişten kalkıp yerine oturur (iOS yay, aşmasız). Ekran içeriği yukarı kayar. |
| Düşünme | Işıltılı "Düşünüyor" | Gri yazıda soldan sağa ışık geçişi (1,2 sn döngü). Sonra "5s düşündü ›" satırına dönüşür. Altında "Ev · Search Northern Cyprus property listings açıldı ⤢". |
| Cevap akışı | ChatGPT akışı | Metin 2–4 karakterlik parçalarla gelir; her parça 120 ms'de 0 → 1 opaklıkla belirir. Satır sonları doğal. Kalın yerler akış sırasında kalın. |
| Kaydırma | iOS momentum | Yavaşlayan eğri (deceleration 0,998). Uçta hafif lastik esneme, en fazla 30 px. Akış sırasında otomatik alta kayma. Aşağı ok düğmesi gerçekteki gibi belirip kaybolur. |
| Dokunma | iOS basma | Halka yok. Basılan öğe 80 ms'de %8 koyulaşır ya da açılır, bırakınca döner. Parmak gösterilmez. |
| Tablo | Markdown tablosu | Satır satır akar; çizgiler soluk. Başlık kalın. |
| Uygulama içi tarayıcı | iOS sayfası | "Evlek'te aç" iOS tarayıcı sayfasını alttan açar (üstte "evlek.app" ve kilit). Sayfa önce iskelet, 300 ms sonra içerik. |
| Durum çubuğu | Temiz | 9:41, tam pil, Wi-Fi. Kayıt göstergesi yok. |
| Doku | Yok | Ekran kaydında gren olmaz. Gren ve renk düzeltmesi yalnız sinematik çekimlerde (H1, H3). |

## B. Evlek widget'ı: seksi ama mantıklı (widget tasarımcısı)

Her hareket için: sebep, süre, eğri. Eğriler:

- **Giriş:** `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Yay:** `damping 22, stiffness 220`, aşmasız ya da en fazla %2.

| # | An | Hareket | Sebep |
|---|---|---|---|
| B1 | Widget gelir | Kutu 12 px aşağıdan ve %0 opaklıktan gelir (320 ms). Harita karoları bulanıktan nete açılır (blur 12 → 0, 400 ms). Yer adları önem sırasıyla belirir: önce Girne, sonra köyler (40 ms arayla). | Veri yükleniyor hissi |
| B2 | Fiyat kapsülleri | Her kapsül, kendi semtinde küçük bir "ping" halkasından doğar: halka 0 → 28 px, tek sefer, %40 → 0. Kapsül 0,85 → 1 ölçeklenir. Batıdan doğuya, 70 ms arayla. | İlanların nerede olduğunu gösterir |
| B3 | "52 ilan" | Rakam alttan maskeyle açılır, 240 ms. Sayaç yok. | — |
| B4 | Çipler ve cümle | Kullanıcı balonundaki ifade ("160 bin sterlin altı", "deniz manzaralı", "2+1", "satılık") sırayla çok hafif vurgulanır (arka plan %12 beyaz, 300 ms). Aynı anda karşılık gelen çip ince beyaz kenarla parlar. Ekran dışına uçuş yok. | Cümle filtreye dönüştü |
| B5 | Kartlar gelir | Kartlar sağdan, 60 ms arayla kayar (360 ms). Kartın içindeki fotoğraf karttan %8 daha yavaş hareket eder (iç parallax) ve 1,04 → 1 yerleşir. "12 foto" kapsülü 120 ms sonra belirir. | Fotoğrafa dikkat |
| B6 | Kaydırma | Kart şeridi momentumla kayar. Fotoğraflar iç parallax'la ters yöne %6 kayar. Sağdaki "›" düğmesi dokunulunca hafif basılır. | Gerçek parmak hareketi |
| B7 | Lapta'ya iniş | Harita yumuşak yakınlaşma ve kaydırmayla Lapta'ya iner (900 ms, `flyTo` eğrisi). Diğer kapsüller %0,8 ölçek ve %0 opaklıkla söner. Batıdaki "£90–160 bin · 28" kapsülü yerinde "£105–147 bin · 8"e dönüşür: genişlik yayla ayarlanır, yazı alttan maskeyle değişir. | Aynı bölge, daralan sonuç |
| B8 | Sıralı kartlar | Eski kartlar sola %30 kayıp söner. Yenileri sağdan sırayla gelir: £105.000 → £110.000 → £120.000. Her kartın fiyatı, kart yerleşince 80 ms sonra açılır. | "Ucuzdan pahalıya" ritmi |
| B9 | Karttan ilan detayına | £139.000 kartına dokunulunca kartın fotoğrafı, ilan detay widget'ının kapak fotoğrafına dönüşür (paylaşılan öğe geçişi, 420 ms). Galeri sayacı "1/14". | Aynı ilan, açılıyor |
| B10 | Galeri | 2 kaydırma. Fotoğraf değişiminde iç parallax ve sayaç "2/14", "3/14" alttan maskeyle. | — |
| B11 | Evlek'te aç | Düğme basılır; tarayıcı sayfası açılırken aynı fotoğraf ve fiyat sayfadaki yerlerine oturur (iOS sayfası açılırken eşleşen konum). | Evlek'e geçiş |
| B12 | WhatsApp'tan yaz | Düğme basma hâli; sonra 6 kare beyaz parlama yok, doğrudan H3'e geçiş. | Sonuç |

**Yapılmayacaklar:** sayaç, parçacık, neon, ekran dışına çıkan öğe, 3B dönüş, aşırı yay, aynı anda üçten fazla hareket.

## C. Kamera (hareket yönetmeni)

- **Sanal kamera tam ekran arayüzün üstünde.** Ölçek 1,0–1,35. Sönümlü yay, aşma yok.
- **Önden gitme.** Kamera olaydan 4 kare önce yönelir, olaydan 10 kare sonra durur. Göz neye bakacağını önceden bilir.
- **Çerçeveleme.** Odak noktası kadrajın %45 yüksekliğinde (altta klavye ya da giriş alanı payı). Yazı yazılırken kamera giriş kutusuna 1,25×; cevap akarken 1,0×'a açılır.
- **Ritim.** Bütün filmde en fazla 7 kamera hareketi. Hareketsiz anlar (cevap akışı, tablo) değerli; izleyici okusun.
- **H1 → arayüz geçişi.** H1'deki telefon ekranı (sabit kadraj, ekran kameraya dönük) arayüzle köşe sabitlemesiyle değiştirilir. Sonra dijital itmeyle ekran tam kareye büyür (600 ms, giriş eğrisi). Telefon kenarı kadrajdan çıkarken hafif hareket bulanıklığı.
- **Arayüz → H3 geçişi.** WhatsApp dokunuşundan sonra ekran 200 ms'de hafif aydınlanır ve H3'e çapraz geçiş yapılır (8 kare).

## D. Üst yazılar: ince iş (başlık tipografı)

Toplam 3 yazı. Sade ama zanaat:

- **Yazı tipi:** Inter Display (yoksa Inter, optik boyut büyük). Ağırlık 600, kalın değil. Boyut 64–72 px. Satır aralığı 1,05. İz −%1,5.
- **Renk:** Beyaz, %94. Okunurluk için yumuşak gölge: `0 2px 24px rgba(0,0,0,.35)`. Zemin bandı yok.
- **Giriş:**
  - Harf harf maske yükselişi; her harf 14 px aşağıdan, 12 ms arayla.
  - Her harfte blur 4 px → 0 ve opaklık 0 → 1, 280 ms.
  - Kelime aralarında ekstra 30 ms (okuma ritmi).
- **Bekleme:** En az 1,6 sn sabit; titreşim yok.
- **Çıkış:** Bütün satır 8 px yukarı ve opaklık 0, 220 ms.
- **İnce çizgi:**
  - Yalnız kapanışta. Logonun altında 1 px, %35 beyaz.
  - 600 ms'de soldan sağa çizilir; bitince mercana döner, 120 px kısa çizgi.
  - Tek mercan.
- **Yazılar:**
  1. 0,4–2,8 sn, H1 üstünde alt üçte bir: "Kuzey Kıbrıs'ta ev mi arıyorsunuz?"
  2. 9,5–11,5 sn, arayüzün üstünde sol üstte küçük etiket (34 px, 500): "Evlek, ChatGPT içinde". Arkasında %40 siyah ve 20 px backdrop blur, yuvarlak 16 px. Arayüzle karışmasın diye küçük.
  3. 27,0–30 sn, H3 üstünde ortada: Evlek logosu (beyaz SVG, 420 px), altında "artık ChatGPT'de." ve ince çizgi.

## E. Ses (ses tasarımcısı)

- **Müzik:** Lisanslı.
  - 0–3,5: sıcak tek synth ya da piyano.
  - 3,5: arayüze geçişte ritim girer (112 BPM).
  - 19: karşılaştırma tablosunda bir ölçü boşluk.
  - 27: çözülür.
- **Efektler:**
  - iOS klavyesi gerçek tık (çok hafif).
  - Gönder "fıp".
  - Widget geldiğinde yumuşak tek "pop".
  - Kapsül ping'leri için tonlu ama −24 dB fısıltı.
  - Kart kaydırmada hafif "fış".
  - Paylaşılan öğe geçişinde kısa nefes "whoosh".
- **Mastering:** −14 LUFS, −1 dBTP.

## F. Kırmızı takım

| Risk | Önlem |
|---|---|
| Widget hareketleri abartılırsa ChatGPT gerçekliği bozulur | Her hareket ≤ 400 ms, aynı anda ≤ 3 hareket. Kabuk (klavye, balon, akış) asla süslenmez. |
| Arayüzde gren ya da renk düzeltmesi "render" gibi gösterir | Arayüz piksel temiz; gren yalnız H1/H3'te. |
| Kişisel veri | Mention listesinde yalnız Evlek. Sohbet geçmişi ve kenar menüsü yok. |
| Ofis adı | Karşılaştırma tablosundaki "Emlakçı" satırı ve sayfadaki ofis kartı kadraj dışında. |
| Okunmayan anlar | Cevap ve tablo anlarında kamera durur, en az 1,5 sn okuma süresi. |

**Ek:** Bu kitaptaki B1–B11 hareketleri, gerçek Evlek widget'ına da taşınabilecek tasarımdır. Video bir hedef ürünü gösterir, uydurma bir özellik değil.
