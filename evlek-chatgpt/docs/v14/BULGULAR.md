# v14 · Bulgular (Rumi'nin v13 geri bildirimi, 2–3 kat derin inceleme)

15 Kasım 2026. Finish masası: cihaz/ürün render uzmanı, kurgu ve kadraj uzmanı, ChatGPT ürün deneyimi ve hareket tasarımcısı, eklenti öğreticisi uzmanı, ses tasarımcısı → kırmızı takım → finish şefi. Ham çıktılar: `kurul/`.

Ölçümler v13 render'ından (out/v13qc, 6 fps) ve 3B izdüşüm hesabından; her bulgu kare/saniye kanıtlı.

## Rumi'nin maddeleri → bulgular

### 1. [ekran yarım] 6,95–12,75 (PR pozu; Rumi'nin karesi ≈11–12 sn, blok_1 7,00–9,83, blok_2 10,00–12,83)

**Bulgu.** Telefon kadrajın altından %40 kesik, üstte karenin üçte biri boş. PR = P(540;1698;0,80;2;−4;−1) için gövde kutusu x[36,1068] y[639,2763]. Alttan 843 px (gövdenin %40'ı) kadraj dışında, üstte 0–639 arası (%33) boş lacivert. Sonuç ilk geldiğinde (7,8) kart şeridi ekran y 1957–2569'da, yani tamamen kadraj dışında. Kartlar ancak 10,35'teki kaydırmayla geliyor; asıl 'vay' anı 2,55 sn görünmüyor. 8,3–10,35 arası kareler blok_1'de birebir aynı, 2 sn donuk tutuş. 2,3–18,75 arasında, yani filmin ≈%55'inde telefon hiç tam görünmüyor (COMP, PR, PT).

**Kök neden.** Kartları açmak için ekran içi kaydırma yerine kamera kullanılmış: telefon kadrajın altına itilmiş (V13.tsx:25 'kart şeridi önce kadraj dışında'). Okunurluk için ölçek 0,80'e çıkarılmış ama dikey konum tam telefona göre bırakılmış. Kenar payını denetleyen bir kural ya da QC yok; bodyBox (Phone.tsx:33) yazılmış ama kullanılmıyor.

**v14 çözümü.** Telefon her karede tam görünür ve her yanda ≥48 px pay kalır. Yalnız portal anında telefon tamamen gizlenir. Dört poz kullanılır: KAPAK, A, B, E (poz tablosu). Sonuç A pozunda (s 0,60) ilk karede bütün olarak görünür: harita y≈755, kartlar 1252–1712, yüzen yazım kutusu kartların altına biner (gerçek kayıt eklenti_57_0 gibi). Kartı büyütmek için A→B kamera hamlesi (10,758–11,40) yapılır, ardından 420 px ekran içi kaydırma gelir (LAPTA_SCROLL 900 → 420). QC her kareyi denetler: bodyBox ⊂ [48,1032]×[48,1872].

### 2. [ekran yarım] 2,5–6,35 (COMP pozu; blok_0 2,50–4,83, blok_1 5,00–6,17)

**Bulgu.** Yazma bölümü yarım telefon ve kocaman bir siyahlık. COMP = P(530;−40;0,92) için gövde kutusu x[−48,1139] y[−1258,1188]: telefon üstten 1258 px kesik. Kadrajın 0–≈720 arası düz siyah ekran, 1188–1920 arası 732 px boş lacivert (%38). Karelerin %46–50'si saf siyah, ortalama parlaklık 15/255. Telefonu telefon olarak tanıtan tek ipucu alt köşenin yuvarlağı.

**Kök neden.** 48 px'lik yazının okunması için yakın plan seçilmiş. Ama klavye olmadığından yazım kutusu ekranın en altında (ekran y 2364) kalıyor ve yakın plan yalnız siyahı büyütüyor. Gerçek telefonda yazarken klavye açıktır: eklenti_31_5'te klavye ekranın %32,9'unu kaplıyor, zemini #161815, tuşları #343633.

**v14 çözümü.** Yakın plan kaldırılır. Yazma B pozunda yapılır: P(524;951;0,67;3;−12;0), tam telefon, kutu [121,958,56,1863]. Klavye açık olur (ekran y 1715–2556, çıktıda 1245–1818). Yazım kutusu klavyenin üstünde durur (ekran y 1438–1679, çıktıda ≈1140, kadrajın ortası). Yazı 48 px × 0,67 = 32 px. Siyah alan ekranın üst ≈%55'ine iner; kapak da aynı düzende olduğu için telefon ilk kareden itibaren 'kullanılan telefon' olarak okunur.

### 3. [telefon] 0–30; en belirgin 0–2,3 ve 25,35–30 (first.png)

**Bulgu.** Telefonun dış hattı zeminde kayboluyor. first.png y=1200'de sol çerçeve 2–4 px genişliğinde, rengi (44,64,83); hemen yanındaki zemin (15,44,74). Kontrast ≈1,38:1. y=1000'de sağ kenar x 818–842 arası (3,11,23)–(7,19,34): çerçeve sağ-alta düşen gölgeyle birleşiyor ve hiç seçilmiyor. Telefon 'lacivert içinde koyu bir dikdörtgen' gibi duruyor.

**Kök neden.** Phone.tsx:82'de ön çerçeve mavi-grafit (#3C4D59/#2B3B47/#16232D), zemin ise #163E68/#0A2540: ikisi aynı ton ailesinde. Kenar ışığı (satır 89) inset 3 px, rgba(255,255,255,.16); 0,45 ölçekte 1,35 px'e ve %16 opaklığa düşüyor. Üç gölge katmanı (satır 61–63) 150/260 × s kadar sağ-alta kaydırılmış, bu yüzden sağ kenarı kendisi karartıyor. Zeminde telefonun arkasına düşen bir ışık yok.

**v14 çözümü.** Malzeme koyu nötr metal olur. Mavi-grafit çıkar; açık titanyum da kullanılmaz (iPhone Natural Titanium çağrışımı riski). Silueti parlak bir pah halkası çizer: 4 gövde px, rgba(255,255,255,.55), sol üst ve sağ kenarda %100, sol altta %25 maske. Zemine telefonun üst üçte birinin arkasına düşen bir anahtar ışık konur. Diyagonal gölgeler kalkar; yerine ortam gölgesi ve yumuşak düşen gölge gelir (telefon spesifikasyonu). QC: siluetin sol üst, sağ üst ve sağ ortasındaki 8 noktada kenar pikseli ile zemin arasında kontrast ≥3:1; alt kenarda ≥2:1.

### 4. [telefon] 0–30 (bütün pozlar)

**Bulgu.** Telefonun kalınlığı hiç görünmüyor, kâğıt inceliğinde bir kart gibi okunuyor. Yedi pozun hepsinde açı rx 2, ry −4, rz −1. Sağ yan yüzün çıktıdaki genişliği COVER'da −1,2 px, PR'de −10,2 px (eksi değer: yüz görünmüyor). Sol yan yüz her pozda gizli. 150 px'lik gövde kalınlığından iz yok. rz −1° bilinçli bir açı gibi değil, 'yamuk kalmış' gibi duruyor. Açı hiç değişmediği için kenar ışığı maskesi de 30 sn boyunca yerinde sabit.

**Kök neden.** ry ±4° kalınlığı göstermeye yetmiyor. perspectiveOrigin poz merkezinde olduğu için yan yüz perspektifle kendiliğinden gizleniyor. Kadraj, hareket ve ses uzmanlarının önerdiği pozlar da ölçümde gizli çıkıyor: B70 −8,7, TYPE −13,3, HERO −15,9 px.

**v14 çözümü.** Okuma pozlarında açı rx 3, ry −12, rz 0: sağ yan yüz 8,0–8,5 px görünür, yeniden örnekleme eğimi olmaz. Kapakta açı rx 6, ry −17, rz −2: yan yüz 14,0 px. Pozlar arasında ry yalnız −12 ile −17 arasında değişir; bu, kenar ışığının kaymasına yeter. Yan yüze 30 dilimlik metal bir bant eklenir: speküler şerit ve iki pah (telefon spesifikasyonu).

### 5. [telefon] 0–2,3 ve 25,35–30 (blok_0 ilk 2 satır, blok_5 26,00–29,83)

**Bulgu.** Kapak ve kapanışta, yani 6,15 sn boyunca (filmin %20'si, küçük resim ve döngünün ilk karesi), ekranın ≈%85'i boş siyah. Telefon alanındaki piksellerin %87'si parlaklık <8. Cam bordürü #030507, ekran #000; aradaki fark gözle görülmüyor, ekranın nerede başladığı belli değil. Üstüne ekranın içinde rgba(0,0,0,.15) karartma biniyor (V13.tsx:213, dimAt). Sonuç kapalı bir cihaz ya da 'siyah levha'.

**Kök neden.** Yeni sohbet ekranında yalnız alttaki yazım kutusu var. dimAt Phone'un içinde ekranın üstüne çiziliyor; bu, arayüzün üstüne filtre koymak demek ve kurala aykırı. Bordür mürekkebi ile ekran zemini aynı siyah.

**v14 çözümü.** Kapak durumu gerçek 31_5 kaydındaki gibi kurulur: yeni sohbet, klavye açık, kutuda yanıp sönen imleç. Logo 1,40–2,10 arasında kutuya çip olarak iner. Kapanışta 'Sohbette dene' aynı ekranı getirir; böylece son kare ile ilk kare birebir aynı olur. dimAt ekrandan kaldırılıp yalnız zemine uygulanır; ekran karenin en parlak yüzeyi kalır. Bordür mürekkebi #0B0D10 olur. Ekranın 1,5 px dışına rgba(255,255,255,.06) bir cam halkası konur.

### 6. [ChatGPT kullanımı] 3,05–5,8 (yazma), 6,2–7,8 (gönder → ara)

**Bulgu.** Yazma ve gönderme gerçek bir telefon kullanımına benzemiyor. Klavye yok; harfler kendiliğinden ve teleks hızında beliriyor: 1. satır 50 ms/harf, 2. satır 54 ms/harf, yani 18–20 harf/sn. Gönderince yazım kutusu bir anda boşalıyor. Balon, ekranın 1750 px altından fırlıyor (Screen.tsx: translateY((1−bk)·1750)). 6,5 sn karesinin %72'si siyah, ortalama parlaklık 7/255: filmin en karanlık anı gönderdikten hemen sonra geliyor. 7,0–7,8 arası ekranda yalnız 35 px'lik bir 'Evlek' etiketi var. Gerçek ChatGPT'de yanıt üretilirken görünen durdur düğmesi (mavi daire #305BEE içinde beyaz kare, 57_0) yok.

**Kök neden.** NewChat ve Composer bileşenleri yalnız yazım kutusunu çiziyor. Yazma hızı doğrusal lin() ile kurulmuş; kelime öbeği yok. Gönderme bir ortak öğe geçişi olarak kurulmamış. Kamera geri çekilirken balon ekran dışından ayrı bir hareketle getiriliyor (iki hareket aynı anda).

**v14 çözümü.** Yazma klavyeyle yapılır ve kelime öbekleriyle ilerler: kelime içinde harf başına 4 kare (66,7 ms), kelime arasında +0,09 sn, satır sonunda +0,20 sn. Soru 3,15–7,16 arasında yazılır, ortalama 12,2 harf/sn. 7,296'da gönder düğmesine basılır. 7,40–7,78 arasında yazılan metin kutudan balona uçar (renk #191919 → #010456); klavye 7,40–7,70'te iner. Kamera ancak balon oturduktan sonra (7,80–8,45) B'den A'ya çekilir. Gönder düğmesi bu sırada durdur durumuna geçer (#305BEE, beyaz kare 30×30). Sonuç geldikten sonra, 8,75'te, gri oka döner.

### 7. [ChatGPT kullanımı] 10,35–13,45 (blok_2)

**Bulgu.** Kart şeridi ve ilan açılışının fiziği bozuk.
(a) Şerit parmaktan önce kayıyor. cardIdx 10,50'de (lin(t, drag[0]−0,4)) başlıyor, parmak 10,80'de beliriyor ve 10,90'da hareket ediyor; şerit o anda yolun %77'sini zaten almış. Sohbet kayması da 10,50–10,90 arasında şeritle üst üste biniyor.
(b) Şerit durunca önceki kartın kuyruğu sol kenarda kalıyor (11,0 karesinde '1 foto' parçası, Rumi'nin karesinde x≈480–490'da bir şerit).
(c) Dokunulan kart tepki vermiyor; üstüne yalnız beyaz bir disk biniyor.
(d) İlan sayfası opaklıkla beliriyor (lin(k,.25,.85)). 13,0 karesinde iki dolu arayüz üst üste: '£139.000 / Lapta'da Deniz…' yazıları 'Haritada tümü / Evlek'te aç' satırının üstünde.

**Kök neden.** Screen.tsx:122 (cardIdx) ve 150 (Drag) aynı eğriyi farklı başlangıçlarla kullanıyor. Sürükleme bir eğriyle tanımlanmış, fizikle değil. Yakalama noktası, önceki kartı kadraj dışında bırakacak şekilde seçilmemiş. Ortak öğe geçişi yalnız fotoğrafta var; sayfa kaptan büyümüyor.

**v14 çözümü.** Parmak ve şerit tek bir fonksiyona bağlanır.
- Sürükleme: 12,00–12,25 arası parmak 300 px sola gider, içerik 1:1 izler.
- Bırakma: 12,25–12,85 arası üstel yavaşlama, x = x0 + v·τ·(1−e^(−t/τ)), τ = 0,32 sn.
- Yakalama: £139.000 kartının sol kenarı ekran x=36 px'e oturur; önceki kartın sağ kenarı x ≤ 0 olur.
- Dokunuş: 13,065'te kart kırpımı 0,975'e küçülür (100 ms içeri, 120 ms dışarı).
- Açılış: 13,25–13,75 arası yakınlaşma geçişi. İlanın kırpma dikdörtgeni kart dikdörtgeninden tam ekrana büyür, köşe 36 → 104 px, bezier(0.2,0.9,0.1,1). Fotoğraf aynı eğriyle kahraman alanına oturur. Opaklık geçişi yapılmaz.
- Sohbet kayması 11,45–11,95'te biter, sürüklemeyle çakışmaz.

### 8. [eklenti] 19,3–24,6 (blok_3 son 3 kare, blok_4)

**Bulgu.** Eklenti kurulumu ne okunuyor ne izlenebiliyor.
- Hız: 7 eylem 5,15 sn'ye sıkışmış, adım başına ≈0,7 sn.
- Dokunuş: dokunuşla ekran değişimi arasında yalnız 0,05 sn var (≡ 19,60 → kenar menü 19,65; Eklentiler 20,25 → 20,30; Evlek satırı 21,80 → 21,85). Halka r 110 px, %35 beyaz; ekran kayarken parlıyor. 22,9'da 'Eklentiyi kur'daki halka beyaz düğmenin (#F2F2F2) üstünde hiç görünmüyor.
- Okunurluk: telefon s 0,55–0,60'ta. 'Bağlı' 42 px → 25 px, 'Northern Cyprus property data' 40 → 22 px.
- Arama: 'evlek' 0,4 sn'de klavyesiz beliriyor (12,5 harf/sn). Rumi'nin ss3'ünde ve Onur'un 13_0 kaydında klavye açık, arama alanı klavyenin üstünde.
- Yol şeridi: 'Ekle' kelimesi arayüzde yok (düğmede 'Eklentiyi kur' yazıyor). Asıl adım olan 'evlek ara' şeritte hiç yok. Mercan alt çizgi lacivert üstünde ≈2,9:1, okunmuyor.
- Kesmeler: 19,3'te PF (0,58) → CHAT (0,55) arasında %5'lik atlamalı kesme var. 18,95'teki 'Emlakçıya sor' dokunuşu hiçbir sonuç doğurmuyor.

**Kök neden.** Bölüme 5,15 sn ayrılmış ve tek uzak pozda çekilmiş. Dokunuş göstergesi ekranın içinde çiziliyor, bu yüzden s ile birlikte küçülüyor. Klavye bilinçli olarak çıkarılmış. Şerit, izleyiciye eylem talimatı vermek yerine konum gösteren bir 'breadcrumb' olarak tasarlanmış.

**v14 çözümü.** Bölüm 19,20–25,90 arasına alınır (6,7 sn). Kamera, adım satırına yer bırakan E pozunda sabit durur: P(527;1095;0,574;3;−12;0), gövde y 330–1872. Akış ve süreler 'eklenti_akisi'nda.
- Dokunuş: tek bir parmak imleci çıktı uzayında çizilir; Ø88 px, lacivert konturu sayesinde beyaz düğmede de görünür. Basıştan ekran değişimine en az 0,18 sn kalır.
- Klavye: aramada açılır; 'evlek' 4 kare/harf hızla yazılır.
- Dış metin: 'Eklentiler'den ekle.' başlığının altında tek bir numaralı adım satırı durur: 1 Eklentiler → 2 "evlek" ara → 3 Eklentiyi kur; kurulunca disk ✓ olur. Kelimeler arayüzden birebir alınır.
- Okunurluk: arayüz yazıları iOS boyutlarına çıkar (51/45 px); s 0,574'te 29/26 px olur.
- Giriş: ölü 'Emlakçıya sor' dokunuşu ve kesme kalkar. Yerine ✕ ile ilan kapanır, ardından kamera hamlesi gelir.

### 9. [eklenti] 19,65–24,45

**Bulgu.** Gerçek arayüzde olmayan durumlar gösteriliyor.
- 'Bağlı' yeşil ve onay işaretli yazılmış (#3DDC97, Screen.tsx:321). Gerçek kayıtta (eklenti_28_5) gri, onay işareti yok.
- 'Sohbette dene' düğmesi #3A3A3C zemin üstünde açık renk yazı. Gerçekte zemin #9E9E9E (ölçüldü), yazı siyah.
- Kurulumdan sonra sağ üstteki paylaş simgesi gerçekte dişliye dönüşüyor; v13'te paylaş simgesi kalıyor.
- Eklentiler kataloğu 1 sn boyunca açık kalıyor (20,33–21,33). 'Kurulu' altında 6 boş gri kare, 'Popüler' altında 4 gri iskelet satırı var; ekran bozuk ya da yüklenmemiş gibi duruyor.
- Kenar menüde sohbet listesinin yerinde gri çubuklar var.
- Durum çubuğu push geçişlerinde sayfayla birlikte kayıyor: 19,80 karesinde iki ayrı '10:24' var.

**Kök neden.** Onay anı, referansa bakılmadan 'kazandın' rengiyle süslenmiş. Üçüncü taraf logoları gösterilemediği için katalog gri iskeletle doldurulmuş ve fazla uzun tutulmuş. Sidebar, Plugins ve EvlekPage bileşenlerinin her biri kendi StatusBar'ını çiziyor.

**v14 çözümü.** Arayüz referansa uydurulur.
- 'Bağlı' 42 px, renk #9B9B9B, onay işareti yok.
- 'Sohbette dene': zemin #9E9E9E, yazı #000.
- Paylaş simgesi 0,2 sn içinde dişliye döner.
- Katalog en çok 0,30 sn görünür. Arama alanına dokununca liste iskelete döner; bu, 13_0 kaydında gerçekten olan davranış.
- Kenar menüde Keşfet'in altı boş siyah kalır; gri çubuk konmaz.
- StatusBar tek ve sabit bir katman olur; Screen'in en üstünde çizilir, geçişlerle kaymaz.
- Evlek sayfasındaki açıklamanın sonuna 'Daha fazla' eklenir (#4A9EFF).

### 10. [görseller garip] 6,95–19,3 ve 14,45–17,55

**Bulgu.** Gerçek Evlek pikselleri bozuluyor ve ev anı stok görsel gibi duruyor.
- Eğim: gerçek widget ve ilan PNG'leri rz −1° ve ry −4° ile yeniden örnekleniyor. Yatay çizgiler, filtre çipleri ve fiyat satırları 1° eğik ve yumuşak.
- Filtre: gerçek ilan fotoğrafına GRADE filtresi uygulanıyor (V13.tsx:89: contrast 1.05, sepia .06, hue-rotate −3°). Telefona dönüşte renk sıçrıyor.
- Hayalet telefon: portal örtüsü rgba(6,26,46,.78) olduğundan telefon %22 görünür kalıyor. 15,9 karesinde dış 'Lapta · 2+1 · 107 m²' satırı hayalet '10:24' saatine değiyor.
- Dördüncü mesaj: dış '£139.000' (96 px) brifteki 3 mesaj sınırını aşıyor.
- Logo: 1,67 ve 25,5'te logo, ekranın içinden dev beyaz bir 'Evlek' yazısı olarak geçiyor.
- Harita: üst çubuğun altında sert kesiliyor; Rumi'nin karesinde 'Kozan' yarım (y≈745).

**Kök neden.** Okuma sahnelerinde eğime gerek yok, ama sabit rz −1 her karede bütün arayüzü döndürüyor. Ev anına ayrı bir renk ayarı verilmiş. Portal yalnız yarı saydam bir örtü. Logonun yolu ekranın içinden geçiyor.

**v14 çözümü.** - Eğim: okuma pozlarında rz 0.
- Filtre: GRADE ve dimAt kaldırılır; hiçbir Evlek pikseline filtre uygulanmaz.
- Portal: örtü yerine bulanık havuz zemini k ile tam opak gelir; k=1 iken telefon görünmez.
- Dış metin: '£139.000' ve 'Lapta · 2+1 · 107 m²' kaldırılır.
- Logo: yolu ekranın dışından geçer (Bezier: (540,300) → (140,520) → (150,1400) → çip). Yükseklik log ölçekte küçülür ve gövde sınırını ≤20 px yükseklikle geçer. Başlık bu sırada %35 opaklığa iner ve logonun üstünde çizilir.
- Harita: üst çubuğa 120 px'lik bir geçiş verilir, linear-gradient(#000 → transparent). Bu kabuğun parçasıdır, widget pikseline dokunmaz.

### 11. [telefon] 0–30 (Rumi'nin karesinde x≈805)

**Bulgu.** Delik kamera ekranın ortasında değil, ve telefonun yan detayları zayıf.
- Delik kamera gövde koordinatında 82 px sola kayık. Rumi'nin karesinde delik x 805, gövdenin ortası ≈852; kapakta ≈42 px sola kaymış duruyor.
- Sağ yanda tek bir tuş var: 140 px boyunda, düz #2F404C. 0,45 ölçekte 63×4 px'lik koyu bir çubuğa dönüşüyor.
- Gövde köşesi 128 px, ekran köşesi 96 px; ekran köşeleri güncel telefonlara göre fazla keskin.

**Kök neden.** Kod hatası, Phone.tsx:88: left = 589,5 − 22. Buradaki 589,5 ekran koordinatında merkez, ama katman gövde koordinatında; OX = 60 eklenmemiş. Doğru merkez gövdede 649,5. Tuş tek renk, ışık almıyor; boyu gövdenin %5'i.

**v14 çözümü.** - Delik kamera: merkez gövde koordinatında (649,5; 148), Ø44, yani left 627,5, top 126.
- Tuşlar: ikisi de sağda. Güç y 700–930, ses y 1040–1480; 7 px dışa taşar, metal degrade.
- Köşeler: gövde BR 138, ekran SR 104; fark 34 px, eşmerkezli. Yazım kutusunun köşesi kırpılmaz: 30,3 + 64 = 94 < 104.

### 12. [diğer (kurgu ve kamera ritmi)] 1,50 · 2,50–2,83 · 6,35–6,95 · 12,75–13,45 · 19,30

**Bulgu.** Kamera ile içerik birbirinin üstüne biniyor.
- 1,50: uçan logo başlığın (y 440–541) tam üstünden geçiyor.
- 2,50–2,83: başlık %40–60 opaklıkta, siyah ekranın üstüne biniyor.
- 6,35–6,95: kamera 0,6 sn'de 1738 px dikey yol alıyor (≈2900 px/sn), balon da aynı anda uçuyor.
- 12,75–13,45: fotoğraf uçarken telefon da 443 px kayıyor.
- 19,30: %5 boy farkıyla atlamalı kesme.

**Kök neden.** Kamera anahtarları içerik geçişleriyle aynı aralıklara (TL.push, TL.rise, TL.expand) bağlanmış.

**v14 çözümü.** Tek hareket kuralı: içerik hareket ederken kamera durur, kamera hareket ederken ekran içeriği durur.
- Her kamera hamlesi 0,65–0,70 sn, IOE, en çok 900 px/sn.
- Filmde 6 hamle var, kesme yok: 2,40 · 7,80 · 10,758 · 19,20 · 25,90 (portal kamerasız).
- Başlık 2,25–2,45'te söner, kamera 2,40'ta başlar.
- Bekleme sırasında kamera ≤%1 kayar.

### 13. [ses] tüm film

**Bulgu.** v13'ün ses taslağı (audio/film.py) kurguyla örtüşmüyor ve telefonda duyulmuyor.
- Ritim: müzik 2,5 sn'lik ölçülere kilitli. Davul 7,8'deki sonuçta değil 10,0'da giriyor (56. satır: g_res − 0,01 ≤ t0). Davul ve piyano 25,0–27,5'te logo ile başlığın üstüne biniyor.
- Uyum: arama anındaki ışıltı (C6, G6, C7, E7), çalan C# ve F# akorlarıyla yarım ses sürtüşüyor.
- Telefon hoparlörü: dokunuş gövdesi 150 Hz, kick 55 Hz; telefon hoparlörü ≈300 Hz'in altını vermez, geriye 2,5 ms'lik bir 'tik' kalır.
- Tekdüzelik: dokuz dokunuşun hepsi aynı örnek. Panel geçişi bir gürültü süpürmesi, yani whoosh.
- Döngü: efekt busu 30,0'da başa sarılmıyor; logo kuyruğu kesiliyor, dikişte tık duyulur.
- Mastering: loudnorm tek geçişli çalışıyor.

**Kök neden.** Ölçü ızgarası kurguya göre değil sabit 96 BPM'e göre kurulmuş. Efekt reçeteleri tek osilatörlü ve 300 Hz–5 kHz arasında katman yok.

**v14 çözümü.** Müzik 104 BPM ve φ = 1,527 sn ızgarasına kurulur: 13 ölçü = 30,000 sn. Bölüm olayları ızgaraya oturur: sonuç inişi B4 (8,450), kart dokunuşu B6 (13,065), Bağlı B11 (24,604).
- Efektler üç katmanlı (klik, gövde 300–600 Hz, hava) ve round-robin varyasyonlu.
- Whoosh yok.
- Logo imzası 'Ev·lek' iki notadan oluşur ve palindromdur.
- Mastering: true-peak limiter, −14 LUFS, −1,5 dBTP; mux -c:v copy.
Ayrıntılar ses_plani'nda.

## Kırmızı takımın değerlendirmesi

- **1. Telefon gerçekçiliği ('telefon telefona benzemiyor')** — Kısmen. Kök nedenleri yalnız cihaz uzmanı doğru ölçmüş: siluet kontrastı 1,38:1, tek ve kısa tuş, sağ-alta kayan gölge, delik kamera hatası. Delik kamera hatasını doğruladım: Phone.tsx:88'de left = 589,5 − 22 = 567,5 gövde px, oysa ekran merkezi gövdede OX + SW/2 = 649,5. Delik 82 gövde px sola kayık. Klavye eksiğini üç uzman yakalamış; eklenti_31_5'te ölçtüğüm değerler hareket uzmanınınkini doğruluyor: klavye ekranın %32,9'u (≈841 px), zemin #161815, tuş #343633, işlev tuşu #434542. Cihaz uzmanının 873 px / #2B2B2E / #6B6B70 ve kadraj uzmanının 873+100 px / #3A3A3C değerleri yanlış. Çözüm üç yerden bozuluyor. (a) Diğer uzmanların pozlarında kalınlık hiç görünmüyor. Phone.tsx'teki bodyToOut'u birebir taşıyan betikle (/tmp/claude-0/-home-user-Animation-Social-Media/8061e222-fdd3-5eed-88a7-976b512a043c/scratchpad/rt_pose.py) ölçtüğüm sağ yan yüz genişlikleri (eksi değer: yüz görünmüyor): kadraj B66 −7,4 · B68 −8,0 · B70 −8,7 · KAPAK +3,6 px (uzman ≈9 diyor); hareket TYPE −13,3 · RES +2,0 · HERO −15,9 (uzman 12–20 px diyor); eklenti ADIM −5,2; sesin önerdiği ry −14 kapak 10,7 px (uzman 16 diyor). Sol yan yüz bütün pozlarda gizli (−10 ile −61 arası). 'Kâğıt kart' görüntüsünü yalnız cihaz uzmanının ry −12 / −18 pozları çözüyor: LIST +8,3 px, COVER +15,7 px. (b) Önerilen 'açık titanyum' (#E4E8EB→#5A6168) BR 148 ile birleşince iPhone 15/16 Pro 'Natural Titanium' gibi okunur. Buna 1179×2556 ekran, iOS durum çubuğu, ev çubuğu ve iOS klavye de eklenince kural ihlali olur. (c) Kontrast yalnız telefon malzemesinde aranmış; zemin hiç ele alınmamış. Eksik: 1) Kapak ve kapanışta (0–2,3 ve 26,15–30; 6,15 sn, filmin %20'si) ekranın ≈%85'i boş siyah. Hiçbir uzman bu ekrana içerik koymayı önermiyor. 'Siyah levha' hissinin asıl kaynağı bu; bordür mürekkebini #0B0D10 yapmak bunu çözmez. 2) Hibrit kimlik: Android tipi gövde (delik kamera, tuşlar sağda) ile iOS durum çubuğu, iOS ev çubuğu ve önerilen iOS klavye (küre ve mikrofon tuşu) bir arada. Göz bu tutarsızlığı 'garip' diye okur; bilinçli bir seçim yapılmalı. 3) dimAt, V13.tsx:212'de Phone'un içinde ekranın üstüne rgba(0,0,0,.15) basıyor. Bu arayüze filtre demek; cihaz uzmanı yerini değiştirmeyi önermiş ama kural ihlali olarak işaretlememiş. 4) Durum çubuğu push geçişlerinde sayfayla birlikte kayıyor. Bunu yalnız eklenti uzmanı görmüş; aynı sorun Gelişme'deki ilan açılışında da var. 5) Önerim: metal koyu nötr kalsın (ön halka #4A5056 → #23282C, pah ışığı rgba(255,255,255,.38)). Kontrast zemin tarafından kurulsun: telefonun arkasına L*≥35'lik bir anahtar ışık konsun ya da bir bölümde krem #FAF8F2 zemin denensin. Siluet için ≥3:1 hedefi titanyum kullanmadan da tutar. 6) Okuma pozlarında yan yüzü göstermek için ya ry ≈ −10…−12 olmalı ya da perspectiveOrigin poz merkezi yerine sabit (540, 960) noktasına alınmalı. Bugün yan yüz perspektif nedeniyle kendiliğinden gizleniyor. Bu değişiklik projectOut/bodyBox zincirine de aynen işlenmeli.
- **2. Yarım ekran ('ekran ne alaka yarım duruyor')** — Tam çözümü yalnız kadraj uzmanının kuralı getiriyor: bodyBox ⊂ [24,1056]×[24,1896], makro plan yok. Pozlarını doğruladım: B70 [96,983,32,1885], B68 [108,970,63,1862], A61 [149,935,262,1881]. Cihaz ve hareket uzmanları ise sorunu yeniden üretiyor. Cihaz COMP P(560,300,1.0,8,−16,0) → [−42,1246,−1020,1736]; altta 184 px boş lacivert kalıyor. Hareket TYPE → [−75,1239,−979,1688]; altta 232 px boş kalıyor. Bu, Rumi'nin karesinin (üstte 639 px boş, alt 843 px kesik) ters çevrilmiş hâli: bir kenarı görünen, öbür kenarı kesik telefon yine 'yarım' okunur. Hareket HERO [−80,1210,−58,2612] ekranı 1175 px genişliğe yayıyor (ekran üstü y=11); telefon kimliği kayboluyor ve geçişlerde yine yarım telefon karesi doğuyor. Hareket uzmanının kendi kuralı ('≥3 kenardan taşsın') TYPE'ı geçiriyor ama Rumi'nin itirazını karşılamıyor. Eksik: 1) Instagram profil ızgarası artık 3:4 kırpıyor (1080×1440, y 240–1680). v13 kapağında logo (y 200–400) üstten, telefon (y1 1927) alttan kesiliyor. Kadraj KAPAK (y1 1885) ve cihaz COVER (y1 1855) de ızgarada alttan kesik kalır, yani profilde 'yarım telefon' yeniden görünür. Kapak karesi için ayrı bir 3:4 QC gerekli. 2) Reels arayüzü üstte ≈200 px, altta ≈380 px, sağda ≈140 px örtüyor. B70'te telefon üstü y=32, altı y=1885. Tam kadraj kuralı ile platform güvenli alanı çelişiyor ve bu, ölçek seçiminde hesaba katılmamış. 3) Rumi'nin 'yarım' dediği şey ekran içeriği de olabilir. 0–2,3 ve 26–30'da ekranın yarıdan fazlası boş siyah; 6,33–6,83'te balon gövdesiz havada asılı (blok_1). 4) Rumi'nin karesinde harita, üst çubuğun altında sert kesiliyor ('Kozan' yarım, y≈745). Gerçek ChatGPT'de üst çubukta yumuşak bir geçiş var; ekranın kendi içinde de yarım hissi veriyor. 5) Üç uzman üç farklı kenar payı öneriyor (24 / 48 / 60 px). Tek eşik olarak 48 px öneriyorum; dış metin de bu paya dahil.
- **3. ChatGPT'de Evlek kullanımının çekiciliği ('seksi değil')** — Kısmen. Hareket uzmanının işi derin: gönder → balon ortak öğe geçişi, siyah süreyi 1,45 sn'den 0'a indirmesi, sürükleme fiziği. Ayrıca Screen.tsx:122'deki hatayı doğru yakalamış; doğruladım: cardIdx lin(t, drag[0]−0,4) ile başlıyor, Drag ise lin(t, drag[0]) ile; içerik parmaktan 0,4 sn önce kayıyor. Ancak 'seksi'yi büyük ölçüde mikro-animasyon sayısıyla arıyor: 2,3–19,3 arasında 20'den fazla ayrı olay var (klavye, tuş önizleme balonu, durdur düğmesi, beş kademeli kırpım, fiyat hapı yayı, ışık sızması, sürükleme, yakınlaşma geçişi, HERO, galeri, LIST, kaydırma, CTA). Bu, Rumi'nin 'tempo insan gözüne göre, kalabalık değil' kararıyla çelişiyor. Ayrıca kademeli widget inişi ve fiyat hapının 1→1,06→1 yayı gerçek Evlek widget'ının yapmadığı davranışlar. Yani canlı olmayan bir özellik gösterilmiş olur (org kuralı). Eksik: 1) Işık ve renk: film koyu üstüne koyu (lacivert zemin, siyah ekran, koyu widget; hareket uzmanının ölçümüyle ortalama parlaklık 15–31/255). Çekicilik eksiğinin büyük kısmı buradan geliyor, ama yalnız camgöbeği ışık sızması önerilmiş. Zemine anahtar ışık konmalı, bir bölümde krem zemin denenmeli. 2) Evlek'in sohbete nasıl çağrıldığı hiç gösterilmiyor; çip logodan 'sihirle' iniyor. Gerçek kullanım '@Evlek' (eklenti_28_5'teki üç örnek istemin üçü de '@Evlek …' ile başlıyor). Yazım sahnesinde '@Evl…' yazılıp çipe dönüşmesi hem gerçek hem öğretici olur. A′ kancasıyla uyumu Rumi'ye sorulmalı. 3) Asıl 'vay' anı görünür kılınmıyor: sorulan '£160 bin altı' ile gelen '£105–147 bin · 8' arasındaki eşleşme. Kamera gerçek pikseldeki bu hapta 0,4 sn durabilir; ek dış metne gerek yok. 4) Yazma hızları tutarsız: hareket uzmanında 'Lapta'da' 8 harf / 0,5 sn = 16 harf/sn, eklenti uzmanında 6,7 harf/sn; ses uzmanı v13'ün 18–20 harf/sn'sini 3 kat hızlı buluyor. Kelime öbekli, tek bir hız ailesi (≈10–12 harf/sn) seçilmeli. 5) 18,95'teki 'Emlakçıya sor' dokunuşu hiçbir sonuç doğurmuyor; 0,35 sn sonra sohbete kesiliyor. Ölü dokunuş kullanım hissini bozuyor; hiçbir uzman yakalamamış. 6) Kart şeridi idx 5'te durduğunda önceki kartın kuyruğu sol kenarda kalıyor (11,0 karesinde '1 foto' parçası; Rumi'nin karesinde x≈480–490'da bir şerit). Gerçek kayıtta (eklenti_57_0) ilk kartın solunda hiçbir şey yok.
- **4. Eklenti ekleme anlatımı** — Büyük ölçüde. Eklenti uzmanı kök nedenleri yakalamış: 7 eylem 5,15 sn'ye sıkışmış (adım başı 0,7 sn); dokunuş ile ekran değişimi arasında yalnız 0,05 sn var; beyaz düğmenin üstündeki beyaz halka görünmüyor; katalog gri iskeletle dolu; yol şeridindeki 'Ekle' kelimesi arayüzde yok; yeşil ✓ 'Bağlı' uydurma. Bu sonuncuyu eklenti_28_5'te ölçtüm: 'Bağlı' gri (≈#747474), onay işareti yok; 'Sohbette dene' #9E9E9E–#B0B0B0; sağ üstte dişli var. Üç sorun kalıyor. (a) 'Kaldır-bas' kopyaları 830–914 px genişlikte, karenin %77–85'i. Telefonun üstünü kapatıyor, tam telefon kuralını ve Rumi'nin 'gerçekçi his' isteğini zayıflatıyor, üstelik arayüzün gerçekte yapmadığı bir durum gösteriyor: öğe ekrandan kalkıyor ve asıl öğe gizleniyor. (b) Adım satırındaki rakam 40 px; 52 px dış metin kuralının altında. (c) Zamanlama +1,0 sn'yi künye ve kapanıştan alıyor. Ses uzmanı 'cut 19,30 ve bound 23,35'e dokunulmasın' diyor, hareket uzmanı ise Gelişme'yi baştan zamanlıyor. Üç çizelge uyumsuz ve CLAUDE.md gereği her zamanlama değişikliği Rumi'nin onayını gerektiriyor. Eksik: 1) Gerçek akış teyit edilmemiş. Arama sonucundaki '+' doğrudan kuruyorsa (Rumi'nin ss3 görüntüsü), 'satır → sayfa → Eklentiyi kur' bir adım fazla olabilir; Onur'un kaydından adım adım doğrulanmalı. 2) Kurulumdan sonra eklentinin nasıl kullanılacağı ('@Evlek' ya da '+' menüsü) anlatılmıyor; 'Sohbette dene' çipi kendiliğinden ekliyor. 3) 'Eklentiler'den ekle.' iddiası: uygulamanın yayın günü her plan ve bölgede aramada göründüğü teyit edilmeli (org kuralı: yalnız canlı özellik). 'Evlek MCP' satırı sorusu da buna bağlı. 4) Evlek sayfasının metinleri İngilizce ('Show me apartments for sale in Kyrenia…' ve açıklama). Gerçek veri oldukları için değiştirilemezler; kamera ve adım satırı Türk izleyiciye bu bloğu okutmaya çalışmamalı. 5) 19,3 kesmesi, ilan tam ekranı ✕ ile kapatılmadan sohbete atlıyor. Geçiş bir kapatma dokunuşuyla gerekçelendirilmeli. 6) Ses uzmanının dört basamaklı adım motifi eski STEPS'e (ChatGPT / Eklentiler / Evlek / Ekle) bağlı. Yeni adımlara (1 Eklentiler · 2 ara · 3 kur · ✓ Bağlı) yeniden eşlenmeli. 7) Kadraj uzmanı 'Bağlı' için B66'ya kamera itmesi öneriyor, eklenti uzmanı kamerayı sabit tutuyor. Biri seçilmeli; önerim sabit kamera.
- **5. Ses (kodla sentez, gerçekçi his)** — Teknik tespitler derin ve doğru. Doğruladığım film.py hataları: 56. satırdaki g_res − 0,01 ≤ t0 koşulu davulu 7,8 yerine 10,0'da başlatıyor; shimmer'ın C ve G notaları o anki C# ve F# akorlarıyla sürtüşüyor; loudnorm tek geçiş; efekt busu döngüde başa sarılmıyor. Ancak plan v13 zaman çizelgesine kilitli. 104 BPM, φ=0,850 ızgarası 'res 7,80 → B4.1' gibi eşleşmelere dayanıyor; oysa hareket uzmanı sonucu 6,75–7,40'a, eklenti uzmanı kesmeyi 18,70'e alıyor, kadraj uzmanı kamera hamlelerini yeniden diziyor. Görüntü kilitlenmeden bu ızgara geçersiz. Ayrıca 'drop', clap ve %55 swing hi-hat 'sakin, mimari, kendinden emin' karakterini reklam pop'una çekebilir. Panel geçişi için önerilen 'LP 400 Hz gürültü, 300 ms' fiilen yumuşak bir whoosh. Eksik: 1) Sıra: önce görüntü zaman çizelgesi kilitlenmeli, sonra ses ızgarası tl.ts'den türetilmeli (film.py zaten tl.ts'yi okuyor). Tempo 104 BPM'e sabitlenmemeli; kilitli çizelgedeki 5–6 kilit olaya en az sapma veren tempo ve faz aranmalı. 2) Klavye görünür hâle gelirse 'yalnız her 3. harfe ses' kuralı görüntüyle çelişir: her tuş basışı görünür, çoğu sessiz kalır. Önerim: her görünür basışa −42 dBFS mikro tık, kelime başlarına −30. 3) 'Gerçekçi his' ararken klavye tıkı ve haptik iOS seslerinin birebir taklidine yaklaşmamalı; marka kopyası algısı doğar. 4) Deniz ambiyansı portalın kalıp kalmamasına bağlı; hareket uzmanı portalı kaldırıyor. 5) 18,95'teki ölü dokunuşa ses konunca boşluk daha da belirginleşir. 6) Döngü dikişinde (30,0 → 0,0) ilk ve son 10 ms'de tık olup olmadığı kontrol edilmeli; mux sonrası video md5 kontrolü korunmalı.
- **6. 'Görseller garip duruyor'** — Parçalı. Uzmanların bulduğu dört neden doğru: rz −1'in yeniden örneklemesi (cihaz), iskelet katalog (eklenti), çift '<' (hareket), portal fotoğrafının stok görsel gibi durması (hareket). Ama hareket uzmanının HERO pozu s=1,0, rz −1, ry −5: gerçek pikseller 1:1 ölçekte döndürülüyor ve yumuşamanın en çok göze batacağı kare tam bu oluyor. Cihaz uzmanının 'okuma pozlarında rz=0' kuralıyla doğrudan çelişiyor. Eksik: 1) V13.tsx:89'daki GRADE (contrast 1.05, sepia .06, hue-rotate −3°) gerçek ilan fotoğrafına uygulanıyor; yani gerçek Evlek pikseline filtre. Kadraj uzmanı portalı korurken bunun kaldırılmasını söylemiyor. 2) Kart şeridinde önceki kartın kuyruğu görünüyor. 3) Harita üst çubuğun altında sert kesiliyor. 4) Logo ekranın içinden geçerken arayüzün üstünde dev beyaz bir 'Evlek' yazısı olarak görünüyor (blok_0 1,67: durum çubuğunun üstünde; blok_5 25,5: ekranın ortasında). Logo ekran içinde kırpılmalı ya da yolu ekranın dışından geçmeli. 5) Portalda telefon hayalet gibi görünüyor ve dış etiket '10:24' saatine biniyor (kadraj uzmanı yakaladı). 6) İlanda 'Eklendi: 27 Ağu 2026' yazıyor. Dipnot 'ilan verileri gerçektir' diyor; yayın günü ilanın hâlâ yayında ve fiyatın £139.000 olduğu doğrulanmazsa bu doğrulanmamış bir iddiaya dönüşür.

**Kaçırılanlar:**
- Boş ekran: kapak ve kapanışta (0–2,3 ve 26,15–30; 6,15 sn, filmin %20'si) ekranın ≈%85'i boş siyah. Bu, Reels küçük resmi ve döngünün ilk karesi. Gerçek kayıtta (eklenti_57_0) yazım kutusu widget'ın üstünde yüzüyor; kapakta telefonun içinde Lapta sonucu ve yüzen yazım kutusu dururken logo çipe inebilir. Bu, 'Önce yaz → ara → sonuç' sırasıyla çelişebileceği için Rumi'ye sorulmalı.
- Instagram profil ızgarası 3:4 (1080×1440, y 240–1680) kırpıyor: v13 kapağında logo (y 200–400) üstten, telefon (y1 1927) alttan kesik. Önerilen KAPAK (y1 1885) ve COVER (y1 1855) pozları da ızgarada kesik; profilde yine 'yarım telefon' görünür.
- Ölü dokunuş: 18,95'te 'Emlakçıya sor'a basılıyor, hiçbir şey olmuyor ve 19,3'te ilan ✕ ile kapatılmadan sohbete kesiliyor. Dokunuş ya kaldırılmalı (düğme yalnız vurgulanır) ya da gerçek sonucu gösterilmeli; geçiş bir kapatma dokunuşuyla gerekçelendirilmeli.
- Kart şeridinde snap hatası: idx 5'te önceki kartın kuyruğu sol kenarda görünüyor (11,0 karesinde '1 foto' parçası; Rumi'nin karesinde x≈480–490). Gerçek kayıtta ilk kartın solu boş.
- Haritanın üst çubuğun altında sert kesilmesi: Rumi'nin karesinde 'Kozan' yarım, y≈745. Gerçek ChatGPT'deki üst çubuk geçişi eksik; ekran içinde ayrıca bir 'yarım' hissi yaratıyor.
- Logo yolu: 1,67 ve 25,5'te 'Evlek' logosu telefon arayüzünün üstünde dev beyaz yazı olarak görünüyor (blok_0 ve blok_5). Kadraj uzmanı yalnız 1,50'deki başlık çakışmasını görmüş.
- Yan yüz hesapları hatalı: kadraj, hareket ve ses uzmanlarının pozlarında perspectiveOrigin poz merkezinde olduğu için iki yan yüz de gizli. Sağ yan yüz: B70 −8,7, TYPE −13,3, HERO −15,9, ADIM −5,2 px; sol yan yüz bütün pozlarda −10 ile −61 arası. 'Kalınlık 9–20 px görünür' iddiaları yanlış; ölçüm betiği /tmp/claude-0/-home-user-Animation-Social-Media/8061e222-fdd3-5eed-88a7-976b512a043c/scratchpad/rt_pose.py.
- Klavye referans ölçüsü: eklenti_31_5'te klavyenin üst kenarı 569/848, yani ekranın %32,9'u (≈841 px); zemin #161815, harf tuşu #343633, işlev tuşu #434542. Cihaz ve kadraj uzmanlarının 873 ve 973 px değerleri ve renkleri yanlış.
- Kimlik tutarsızlığı: Android tipi gövde ile iOS durum çubuğu, ev çubuğu ve iOS klavye bir arada. 'Telefon telefona benzemiyor' hissinin bir kaynağı da bu ve hiçbir uzman ele almamış.
- '@Evlek' ile çağırma hiç gösterilmiyor. Eklenti sayfasındaki gerçek örnek istemlerin hepsi '@Evlek …' ile başlıyor; filmde çip logodan sihirle iniyor. Kurulumdan sonra eklentinin nasıl kullanılacağı da anlatılmıyor.
- Işık ve renk: film baştan sona koyu üstüne koyu. Marka paletinde krem #FAF8F2 var; bir bölümde krem zemin ya da telefonun arkasına anahtar ışık, siluet kontrastını titanyum kullanmadan 3:1'in üstüne taşır. Hiçbir uzman zemine dokunmayı önermiyor.
- Platform güvenli alanı: Reels üstte ≈200 px örtüyor; tam kadraj kuralındaki B70 pozunda telefon üstü y=32. Durum çubuğu ve 'Sor. Evlek göstersin.' (top 130) bu bantta kalıyor. Ölçek seçiminde üst bant hesaba katılmamış.
- Doğrulama eksikleri (org kuralı): ilanın yayında olması ve fiyatı, uygulamanın her plan ve bölgede aramada çıkması, arama sonucundaki '+' düğmesinin doğrudan kurup kurmadığı. Bunlar yayından önce gerçek hesapta kontrol edilmeli.
- Kapsam ve öncelik: beş uzmanın önerileri birlikte uygulanırsa Rumi'nin 'kalabalık değil' kuralı aşılır ve uzmanlar arasında ortak bir P0 listesi yok. Önerdiğim P0: tam telefon kuralı ve poz seti (ry −10…−12, rz 0), delik kamera düzeltmesi (gövde x 649,5), siluet kontrastı (titanyumsuz), referanstan ölçülmüş klavye, dimAt ve GRADE'in kaldırılması, eklenti adım süreleri ve dokunuş imleci, 'Bağlı'nın referansa uydurulması, dış fiyat etiketinin kaldırılması. Ses, görüntü çizelgesi kilitlendikten sonra tl.ts'den türetilir.
- Süreç: önerilerin çoğu sahne sürelerini, kopyayı ve dış metin yerleşimini değiştiriyor. CLAUDE.md'ye göre bunlar Rumi'nin açık onayını gerektiriyor ve v14 v13 kaynağının kopyası olarak kendi dalında yapılmalı. Uzmanların hiçbiri bu onay listesini çıkarmamış.

## Riskler ve onay noktaları

- ONAY ŞARTI (CLAUDE.md 15. kural): Plan sahne sürelerini, kopyanın yerini (slogan top 480 → 130, dış fiyat ve künye etiketinin kalkması, yol şeridinin numaralı adım satırına dönmesi), kapak ekranını (klavye açık) ve 'Emlakçıya sor' dokunuşunun kalkmasını değiştiriyor. Uygulamadan önce Rumi'nin açık onayı gerekir. Ayrı onay istenecek maddeler: tl.ts tablosu, adım satırının '3 mesaj' kuralına girmemesi, dipnotun 30 px ile ≥52 px kuralından muafiyeti, dış '£139.000' etiketinin kaldırılması.
- Uygulama sınırı: v14, src/v13 ve src/v12/Phone.tsx'in kopyası olarak src/v14/ altında yapılmalı (src/v14/Phone.tsx, Screen.tsx, V14.tsx, tl.ts). v12 ve v13 dosyaları değişmez. Bulunduğumuz dal video/evlek-chatgpt-v10; yeni film için video/<ad> dalı açılmalı. V7 renderer'ına, baseline'a ve approved varlıklara dokunulmaz. Yeni görsel gerekirse yeni dosya adı alır.
- Doğrulanmamış iddialar (org kuralı):
- İlan 'Eklendi: 27 Ağu 2026' tarihli. Yayın günü hâlâ yayında olduğu ve fiyatının £139.000 olduğu doğrulanmalı. Dipnot 'ilan verileri gerçektir' diyor.
- 'Eklentiler'den ekle' akışının herkese açık bir hesapta, her plan ve bölgede 'evlek' aramasında çıktığı gerçek hesapta denenmeli.
- Arama sonucundaki '+' düğmesinin doğrudan kurup kurmadığı ya da sayfaya götürdüğü kayıttan doğrulanmalı. Doğrudan kuruyorsa 3. adım yeniden yazılır.
- 'Evlek MCP' satırının herkese açık kullanıcıya görünüp görünmediği Rumi'ye sorulmalı; planda gösterilmiyor.
- iPhone kopyası riski: kabuk (durum çubuğu, ev çubuğu, Q klavye) iOS düzeninde. Riski azaltmak için klavyede küre ve mikrofon satırı ve 'TR EN' etiketi çizilmez; gövde koyu nötr metal, delik kamera, iki tuş sağda, Dynamic Island yok. Açık titanyum ve BR 148 reddedildi. Yine de ilk render Rumi'ye 'iPhone'a benziyor mu?' sorusuyla gösterilmeli.
- Uydurma davranış riski: widget'ın tek parça inişi, kartın 0,975 basılı durumu, ilan yakınlaşma geçişi ve sürükleme fiziği gerçek ChatGPT davranışına yakın kuruldu ama birebir doğrulanmadı. Kademeli widget inişi, fiyat hapı yayı, tuş parlaması, kaldır-bas ve 'sohbet %40 kararır' bilinçli olarak atıldı. Kurulum sonrası gri 'Bağlı', #9E9E9E 'Sohbette dene' ve dişli simgesi eklenti_28_5'ten ölçüldü.
- Kapak ile 3:4 profil ızgarası: Instagram ızgarası y 240–1680 bandını kırpar. KAPAK pozunda telefon alttan (y1 1870), logo üstten (200–400) kesilir. Izgara için ilk kare değil, ayrı bir kapak görseli üretilmeli (evlek-publish adımı). Bu, filmdeki kadrajı değiştirmez.
- Platform güvenli alanı: B pozunda telefon üstü y=56. Reels üst arayüzü ≈0–200 bandında yalnız durum çubuğunu örter, anlam kaybı yok. 'Eklentiyi kur' (y≈1728) ve 'Emlakçıya sor' çubuğu (≈1754) alt açıklama bandında kalır. Anlamı adım satırı ve imleç taşıdığı için kabul edildi.
- Dipnot ile kapak çakışması: KAPAK gövde üstü y 700, dipnot 572–652; pay tam 48 px. Kick ya da kayma kapanışa eklenirse çakışır. Bu yüzden KAPAK pozunda kayma ve kick yok.
- Okunurluk sınırı: B pozunda (s 0,67) gerçek widget kart künyesi 40 px → 27 px. Bu 28 px eşiğinin hemen altında ve kabul edildi. Fiyat (33 px), başlık ve 'Bağlı' (E'de 24 px; 45 px iOS boyutuyla 26 px) eşik kontrolüne girer.
- Yazma süresi: soru 4,0 sn sürüyor (12,2 harf/sn). Rumi 'yavaş' bulursa kelime içi süre 3 kareye inebilir (3,25 sn). Bu durumda send ve sonraki bütün olaylar ölçü ızgarasına göre yeniden hizalanmalı.
- Ses ızgarası görüntüye bağlı: 104 BPM ve φ 1,527, bu tl.ts'ye göre seçildi. tl.ts'de onaydan sonra değişiklik olursa tempo ve faz yeniden aranmalı (B4 = sonuç, B6 = kart, B11 = Bağlı). Ses görüntü kilitlenmeden render edilmez.
- Render ve QC: 30 dilim, klavye ve anahtar ışık render süresini artırır.
- Determinizm korunmalı: yeni katmanlarda rastgelelik yok; zaman yalnız useCurrentFrame'den türer.
- Her karede şu iddialar kodla denetlenip ilk ihlal saniyesiyle raporlanmalı: bodyBox ≥48 px, dış metin ile telefon arası ≥48 px, anlam satırlarında font×s ≥28 px, siluet kontrastı ≥3:1, delik kamera merkezi.
- 'Bir ekran yarım mı' sorusu artık sayıyla cevaplanır.
- Logo yolu: logo ekranın dışından ve başlığın altından geçiyor; başlık bu sırada %35'e iniyor. Rumi 'haber' cümlesinin 1,42'de sönmesini istemezse alternatif şu: logo yolu 1,40–2,10 yerine 1,70–2,30 olur ve başlık 1,70'e kadar tam kalır. Bu da kamera itişini 2,45'e kaydırır.
