# VIDEO-1 v12 · Final raporu: "Evlek artık ChatGPT'de"

14 Kasım 2026 · dal `video/evlek-chatgpt-v10` · kompozisyon `V12-916` (`src/v12/`). v7, v8, v10 ve v11 olduğu gibi duruyor.

**Teslim:** `out/evlek_chatgpt_v12_1080x1920_60fps.mp4`
- 30,000 sn · 1080×1920 · 60/1 fps · 1800 kare · sessiz · 22,5 MB
- h264 yuv420p, tv aralığı, bt709 (matris, primaries ve transfer)
- sha256 `324558755db761b7ced296e4bfccc1ab489ea8ba50a39ea0c5149af243f7a849`
- MP4 git'e girmedi.

**Süreç:** 11 bağımsız uzman (her biri en çok 4 bulgu ve 9 ölçütte puan) → toplantı ve kreatif direktör kararı → kırmızı takım ve üretim mühendisi (paralel) → düzeltilmiş final plan → uygulama. Ardından iki tur kritik sahne still'i (50 kare), tam render ve tam film QC:
- 6 fps tarama (180 kare)
- 360×640 ızgara
- ardışık kare farkı analizi
- döngü SSIM
- siyah kare taraması

Ham kurul çıktıları:
- `docs/v12/kurul/`: ilk görüşler, toplantı, kırmızı takım, mühendis, final plan (JSON)

---

## A. Yönetici kararı

**v11'in bağımsız kurul puanı ≈5,5/10.** Sessiz izlenince anlaşılan bir ürün demosuydu, arzu uyandıran bir reklam değildi.

Üç kök sorun vardı:
1. **Boş açılış ve kapanış.** İlk 5 sn ve son 4 sn koyu, boş bir sohbet ekranı.
2. **Güven.** Yeniden çizilmiş widget gerçekte olmayan bileşenler gösteriyordu (sıralama çipi, karşılaştırma kartı). İlk görülen ilan kartı insan figürlü bir CGI render'dı.
3. **Kalabalık.** 8 dış cümle ve 3 farklı fiil.

**Seçilen yön: "Önce ev".** Film gerçek havuz karesi ve "Evlek artık ChatGPT'de." ile açılıyor. Fotoğraf ters portalla ChatGPT tam ekranındaki gerçek Evlek detayına iniyor. Sonra her ekran durumu görünür bir eylemle geliyor:
- soru
- gerçek Lapta sonucu
- kart kaydırma ve dokunuş
- galeride "sonraki" ile iç mekâna portal
- "Evlek'te tüm ayrıntılar ↗" ile gerçek evlek.app sayfası
- Eklentiler yolu → Bağlı → gerçek Girne sonucu

Film aynı havuz karesinde CTA ile kapanıyor ve ilk kareye dönüyor.

**En büyük değişiklik:** Evlek ekranları artık yeniden çizilmiyor. Gerçek widget HTML'i gerçek veriyle 1179 px'te yakalandı. Karşılaştırma çıkarıldı. Yalnız üç ana mesaj var.

**v12 puanım ≈7,6/10.** Yayın, Onur'un iki kararına bağlı: gerçek widget ve yeni kanca.

## B. Kanıtlı teşhis (v11, kurul)

Kanıt kareleri v11 kaydından alındı (6 fps; geçişlerde 30 fps). Her satır v12'de uygulandı; uygulanmayanlar "Plandan sapmalar" bölümünde.

| # | Saniye | Uzman | Gözlem | Etki | Düzeltme (v12) | Öncelik |
|---|---|---|---|---|---|---|
| 1 | 0,0–2,5 | Tümü | 0–2,0 sn karelerinde (blok6_0) kadrajın yarıdan fazlası boş, koyu bir ChatGPT ekranı. Havuz fotoğrafı bulanık ve lacivert multiply altında; havuz tanınmıyor. Tek hareket telefonun ~40 px yükselmesi. İlk ev pikseli 5,5 sn'de küçük bir kartta, ilk tam ekran ev 10,85 sn'de geliyor. | Kanca yalnız 'ChatGPT' haberini zaten tanıyan izleyicide çalışıyor. Geniş kitle için ilk saniyede arzu yok. Bu bir yorum; performans verisi yok. | 0,0'da keskin, tam ekran EVL-100102_00, logo ve 'artık ChatGPT'de.'. 1,5–2,5'te ters portal fotoğrafı ChatGPT tam ekranındaki gerçek Evlek detayına indirsin (plan 2). | P0 |
| 2 | 25,8–30,0 | Yönetmen, sosyal, sanat yön. | 25,8'de yazım kutusunda yalnız 'Evlek /' var, sonra ekran boşalıyor. 26,0–30,0'da bulanık zemin üstünde boş bir telefon ve açılış kartının tekrarı görünüyor (blok6_25). CTA küçük ve ~2,1 sn tam opak. Döngü yine boş ekrana bağlanıyor. | Harekete geçme anında akılda kalan görüntü ev değil, boş arayüz. İkinci kez izlemek için bir neden yok. | Kapanış keskin havuz karesinde olsun. Telefon kurulumdan sonraki gerçek Girne sonucunu göstersin. CTA 5,0 sn ve dipnot ≥4,6 sn tam opak kalsın. Son karenin piksel değerleri 0. kareyle aynı olsun (plan 7). | P0 |
| 3 | 5,5–9,8 (t_7,8) | Baş kreatif direktör, mühendis | £105.000 (EVL-100336) kartında havuzda bir çocuk ve bir kadın, kapıda bir kadın ve sağda atlayan bir figür var. Görsel 1600×899 bir CGI render. 540×400 kartta cover ölçeğiyle dikeyde taşma olmadığı için '50% 8%' kırpımı hiçbir şeyi değiştirmiyor. '50% 0%' + scale 1,35 de figürleri kadrajdan çıkarmıyor. | 'İnsan görüntüsü yok' kuralının doğrudan ihlali. Filmde görülen ilk ilan görseli bu. | Bu kart hiçbir v12 varlığında bulunmasın. Kart şeridi yalnız 3–7. dizinler kırpılarak yakalansın. Gerçek açılış durumu kadraj dışında kalsın ve kaydırma şeridin kadraja girdiği karede sürüyor olsun (plan 1 ve 3). | P0 |
| 4 | 5,5–20,5 | UI, strateji, kırmızı takım | Widget elle yeniden çizilmiş ve bileşen envanteri gerçek değil. 'Ucuzdan pahalıya' çipi yok; gerçekte yalnız tam ekran listede 'Sırala: Fiyat ↑' var. Karşılaştırma widget'ı yok. Detayda gerçek düğmeler görünmüyor ('Evlek'te tüm ayrıntılar ↗', 'Emlakçıya sor ↗', '‹ ›', 'Sonuçlara dön'). Oysa gerçek widget HTML'i (live/listing-cards-v3-14.html) ve 1179 px yakalama düzeneği (cap/harness.mjs, s52_inline.png) repoda. | 'Arayüz temsilidir' dipnotu uydurma işlevi örtmez; güven riski doğuyor. Yeniden çizimin gerekçesi olan 'gerçek widget yakalanamaz' öncülü yanlış. | Evlek widget yüzeyleri gerçek HTML'den, gerçek veriyle, koyu temada ve DPR 3'te yakalanan piksellerle kullanılsın. Dış reklam katmanları (ışık, derinlik, portal, kadraj) korunsun (plan 1). | P0 |
| 5 | 17,0–20,5 | UI, strateji, yönetmen | Karşılaştırma bir widget kartı olarak çizilmiş. Gerçek oturumda (ref 07) ChatGPT bir metin tablosu veriyor ve £127.000'lik ilanı öneriyor. 'Arada £12.000 fark.' dördüncü ana mesaj olmuş. | Ürünün sahip olmadığı bir bileşen gösteriliyor. Kahraman ilan 'pahalı olan' konumuna düşüyor ve mesaj sınırı aşılıyor. | Karşılaştırma tüm sürümlerden çıkarılsın. Kazanılan süre iç mekâna ve evlek.app sayfasına verilsin (plan 9). | P1 |
| 6 | 2,9–29,75 | Marka/tipografi, algı | 8 dış cümle, 7 punto ve 4 ağırlık var. Aynı eylem için 3 fiil kullanılıyor ('bul', 'kur', 'ekle'). İstem yankısı telefondaki istemle aynı anda akıyor. 25,0'da 'Eklentiyi kur.' yazısı telefonla neredeyse çakışıyor. | İzleyici tek bir ses yerine altyazı akışı okuyor ve 'nasıl başlarım' cevabı bulanıklaşıyor. | Yalnız üç ana mesaj kalsın; künye ve fiilsiz bir yol şeridi ayrıca sade tutulsun. Yankı, adım başlıkları ve fark yazısı kaldırılsın (plan 8). | P1 |
| 7 | 9,8–17,0 | UI, mühendis | 'Haritada tümü' ve 'Evlek'te aç' kodda var, ama ekranda y 2308–2412'de duruyor; yazım kutusu (üst kenar 2310) ve alt degrade (2256'dan başlıyor) bunları örtüyor. Gerçek ilan sayfasına geçiş gösterilmiyor. page_view.png hiç kullanılmamış. | 'Gerçek ilan sayfasına geçebilirsin' vaadi ve gerçekliğin piksel kanıtı izleyiciye ulaşmıyor. | Tam ekran detayda gerçek dv__out 'Evlek'te tüm ayrıntılar ↗' düğmesine dokunulsun. Bu düğme openLink ile ilanın kendi adresini açıyor. Ardından evlek.app sayfası uygulama içi tarayıcıda açılsın (plan 5). | P1 |
| 8 | 2,02–2,13; 24,45–24,50; 26,3–26,47 | Hareket, mühendis | titleOut [2,0–2,25] ile logoDrop [2,0–2,5] üst üste biniyor; logo sönen başlığın içinden geçiyor (blok6_0, 2,0). Kapanışta yükselen logo yine başlığın içinden geçiyor (blok6_25, 1,33). Bekleme göstergesi 24,45'te bitiyor ama 'Bağlı' 24,5'te geliyor; arada 3 kare boyunca düğme yeniden 'Eklentiyi kur' yazıyor. | İmza hareketi iki uçta da kirli bir kare üretiyor. Kurulumdaki geri dönüş güveni zayıflatıyor. | Başlık 1,5'te tamamen sönmüş olsun; logo uçuşu 2,95'te başlasın. Kapanışta logo yerinde belirsin. Bekleme göstergesinin bittiği kare ile 'Bağlı' karesi aynı olsun (spin[1] === bound = 19,7). | P1 |
| 9 | 10,6–11,2; 15,37–15,67; 17,30–17,45 | Hareket, mühendis, fotoğraf | Portalda h ile ph farklı hızda büyüyor. 10,95'te koyu bir şerit ve telefon kalıntısı görünüyor. Interior, Pool üstünde 0,3 sn ve 0,6 sn'lik opaklıkla açılıp kapanıyor; bu çift pozlama yaratıyor. | En güçlü an, telefonun önünden kayan bir dikdörtgen gibi okunuyor. Dissolve ucuz görünüyor. | ph=h ve bilgi alanı yok. Görüntü dikdörtgeni iki uçta analitik olarak hesaplansın. Fotoğraf değişimi yalnız portalla, kesmeyle ya da ≥16 px bulanıklık altında yapılsın (plan 4 ve 11). | P1 |
| 10 | 11,1–14,5 | Fotoğraf, mühendis | Havuz fotoğrafı 1,60× ve üstüne 1,04 ölçekle yaklaşık 1,66×'e büyütülmüş; palmiyeler yağlı boya gibi görünüyor. Kareler JPEG q80 olarak yakalanmış. İç mekân beyazları camgöbeği tonunda. | Arzu anı olduğundan sıradan görünüyor. | Fotoğraflar Lanczos ile önceden ölçeklenip PNG olarak kaydedilsin; ek zoom olmasın. Dış çekim 1,60×, iç çekim 1,32× sabit kalsın. Kareler PNG yakalansın. GRADE_INT uygulanarak duvarda R≥B hedeflensin (plan 11 ve 12). | P1 |
| 11 | 20,5–26,0 | UI, sosyal | Menüye ya da 'Eklentiler' satırına dokunuş yok. Arama listesi iskelet satırlarla boş duruyor. 'Bağlı' mobilde ~7 px. Kurulumdan sonra açılan sohbet boş kalıyor (25,8). | İzleyici Eklentiler'in yerini öğrenmiyor ve kurulumun sonucunu görmüyor. | ≡ › Eklentiler › 'evlek' › Evlek › Eklentiyi kur › Bağlı adımları 3,5 sn'de gösterilsin. Ardından 'Sohbette dene' ile gerçek Girne sonucu (52 ilan) 1,5 sn ekranda kalsın (plan 6). | P1 |
| 12 | 0,0–30,0 | Hareket, CD | Telefonda hap biçimli kamera adası, '9:41', iOS ikonları, sol yan tuşlar ve iki tonlu titanyum benzeri çerçeve var. 15,2–17,0'da telefon kırpılıyor ve gölgesi fotoğrafa oturmuyor. | 'Birebir iPhone kopyası yok' kuralı için risk taşıyor (yorum, hukuki değerlendirme değil). Telefon fotoğraf üstünde çıkartma gibi duruyor. | src/v12/Phone.tsx kopyasında markasız gövde, delik kamera, '10:24', tek tonlu çerçeve ve temas gölgesi olsun (plan 10). | P1 |
| 13 | 5,5–25,0 | Algı, UI | Yeniden çizilen arayüzdeki ikincil metin tasarımda 30–44 px; s 0,55'te çıktıda ~17–24 px, 360 px önizlemede 6–8 px'e iniyor. Eklenti sayfasındaki İngilizce örnek istemler okunmuyor. | Anlatıyı taşıyan metin doku olarak kalıyor ve dış yazı bunu yankıyla telafi ediyor. | Anlam taşıyan her metin için çıktıda ≥28 px olacak yakın plan pozu kullanılsın. Gerçek widget DPR 3'te gövde metnini ~42–48 tasarım px'te verdiği için PD s 0,70 yeterli. Okunmayan metin doku sayılsın ve anlatı yükü taşımasın. | P1 |
| 14 | 2,0–2,5 (imza) | Mühendis | screenToOut rx, ry ve rz'yi yok sayıyor. rz=−1° tek başına çipte ~11 px yanlış iniş yaratıyor. | Logo çipin yanına iniyor ve imza kirli görünüyor. | v12/Phone.tsx'e saf bir projectOut(pose, sx, sy) fonksiyonu eklensin (Rx·Ry·Rz·S, perspektif 3200). DOM ölçümüyle ±1,5 px içinde doğrulansın. | P2 |
| 15 | 15,25–17,0 | Yönetmen, fotoğraf | İç mekân toplam 1,6 sn ekranda ve yarısını telefon örtüyor. Tilt tavana doğru gidiyor. | Çift yükseklikli cam ve kapıdaki deniz neredeyse görünmüyor. | İç mekân 2,0 sn telefonsuz ve tam ekran gösterilsin (9,65–11,65). Tilt pencereden kapıdaki denize insin. | P2 |
| 16 | tüm film | Mühendis | ffprobe sonucu: yuvj420p, color_range=pc, bt470bg, primaries ve transfer belirsiz. Remotion varsayılanlarıyla (JPEG q80 kare) render edilmiş. | Platform yeniden kodlarken ton kayması ve siyahlarda ezilme riski var; metinde halka oluşuyor. | --image-format=png --pixel-format=yuv420p --color-space=bt709 --crf=16 --x264-preset=slow --muted ile render edilsin (plan 12). | P2 |
| 17 | 10,5–14,2 | CD, yönetmen, hareket, fotoğraf | Kart, köşeleri eşleşerek telefonun 3B düzleminden kalkıyor ve tam ekran gerçek fotoğrafa açılıyor; opaklık hilesi yok. Telefon aynı ilanla dönüyor. Veriler kayıtla tutuyor (EVL-100102, 14 foto, 107 m², tür eklenmemiş). | Filmin tek gerçek arzu anı bu. 'ChatGPT'deki cevap gerçek bir eve açılıyor' fikrini sözsüz anlatıyor. | Korunsun: portal hem kancaya (ters yönde) hem iç mekân açılışına taşınsın. Dikiş ve hayalet temizliği uygulansın. | Koru |

## C. Puan kartı

- **v11:** 11 uzmanın verdiği puanların ortalaması (n = o ölçütü puanlayan uzman sayısı).
- **v12:** Benim değerlendirmem; final dosyası kare kare incelendi. Ölçüm değil, yargı.

| Ölçüt | v11 (kurul) | v12 | 10/10 ölçütü (kurul) | v12'de eksik kalan |
|---|---|---|---|---|
| Kanca | 3,8 (n 11) | **7,5** | 0. kare keskin gerçek ilan fotoğrafı, başlık 360×640'ta okunur, 1,6 sn içinde telefon ve gerçek ilan, boş arayüz hiç yok | 0–1,5 sn'de ürün bağı yalnız yazıyla kuruluyor; tek başına tatil reklamı gibi okunabilir. Ters portal 1,5'te başlıyor. |
| İlan arzusu | 6,3 (n 5) | **8** | ≥12 sn gerçek mekân, ilk ilan görseli gerçek fotoğraf ve insansız, dış ve iç tam ekran | Büyük boy ev ≈10 sn (0–2,5 · 8,65–11,65 · 23,5–30), telefonla birlikte ≈16 sn. Kaynak 1600 px; 1,60× büyütme hafif yumuşak. |
| Telefon gerçekliği | 6,3 (n 3) | **7,5** | Markasız ama tanınır, fotoğraf planlarında ≥40 px pay, temas gölgesi, perspektif hizası | Yakın planlarda (PC, PP) gövde bilinçli kırpılıyor. Gölge 2B. |
| Hareket kalitesi | 6,3 (n 3) | **7,5** | İki fotoğraf ≥3 kare üst üste değil, hareket ≤1,3 sn + ≥1,2 sn duruş | Hayalet geçiş yok; iki portalda köşeler ±2 px eşleşiyor. Hareket bulanıklığı yok. 16,2'deki beyaz sayfa → koyu sohbet kesmesi sert (ardışık kare farkı 118). |
| Okunurluk | 6,2 (n 5) | **7,5** | 360×640'ta ana yazı, fiyat, konum, adım okunur; anlam taşıyan arayüz metni çıktıda ≥28 px | Ana mesajlar, künye, fiyatlar ve yol şeridi 360×640'ta okunuyor. Dipnot orada ≈10 px (istisna). Widget ayrıntıları doku olarak kalıyor. |
| Ürünün çekiciliği | 6,2 (n 6) | **8** | Her ürün planı gerçek etikete bağlı, ≥0,8 sn gerçek evlek.app pikseli, işlevsiz boşluk yok | Bütün Evlek pikselleri gerçek. evlek.app 2,0 sn. Yeni sohbet 21,25–21,75'te koyu ve boş (gerçek durum). |
| Marka bütünlüğü | 6,4 (n 4) | **7,5** | Sürekli Evlek imi, tek fiil, tek renk sistemi, dipnot ≥28 px | Tek fiil ("ekleyin"), mercan yalnız şerit alt çizgisinde. Sürekli köşe imi bilinçli olarak yok (kurul D8). |
| Tempo | 5,6 (n 7) | **7** | İlk ilan görseli <1 sn, arama perdesi ≤4 sn, ekleme ≤4 sn, yazı kanıtla aynı anda | Eklentiler yolu 3,5 sn'de 5 ekran; filmin en yoğun yeri. Kapanış 5 sn sabit. |
| Kapanış | 4,5 (n 10) | **7,5** | Son 4 sn'de mekân + telefon + yol, CTA okunur, dikişsiz döngü | Mekân, telefonda gerçek Girne sonucu, CTA 5,0 sn tam opak. Döngü SSIM 0,985: hedef 0,99'un altında, fark görünmüyor. |

**Genel: ≈7,6/10.** v11'e göre en büyük sıçrama kancada (+3,7), kapanışta (+3) ve güvende (gerçek piksel). "Dünya standardı" için hâlâ eksik olanlar:
- müzik ve ses (Faz B; tempo hissinin yarısı ses),
- daha yüksek çözünürlüklü kaynak fotoğraf,
- Eklentiler yolunu Onur'un gerçek iOS kaydıyla birebir kesinleştirmek.

**Ölçülen değerler**

| Ölçüt | Değer |
|---|---|
| Farklı ana cümle | 3 ("Evlek artık ChatGPT'de." · "Sor. Evlek göstersin." · "ChatGPT'de Eklentiler'den Evlek'i ekleyin.") |
| Dış metin blokları | 7: başlık, slogan, künye (2 satır), yol şeridi, CTA, dipnot (v11: 9, v10: ~23) |
| Tam opak kalış ve okuma oranı | Gereken süre = kelime × 0,3 + 0,7 sn. Başlık 1,25 sn (0,96) · slogan 1,6 sn (1,0) · "£139.000" 1,35 sn · "Lapta · 2+1 · 107 m²" 1,25 sn (0,8) · CTA 5,0 sn (2,5) · dipnot 4,65 sn |
| Metin ile telefon gövdesi arası (3B izdüşüm, en kötü köşe) | Logo → kanca 87 px · slogan → soru planı 418 px · şerit → Eklentiler 122 px / "Bağlı" planı 75 px · dipnot → kapanış 110 px. Hepsi ≥48 px. |
| Kart şeridi soru planında | Üst kenar çıktıda y 1958 (kadrajın 38 px altında). £105.000, £110.000 ve £120.000 (CGI) kartlarının pikseli hiçbir varlıkta yok. |
| Döngü (kare 1799 ↔ kare 0) | SSIM 0,985; ortalama mutlak fark 1,0/255; 20 seviyeyi aşan yalnız 118 piksel (0,37 px pan farkı ve I/P kare kodlaması) |
| Siyah kare | 0 (blackdetect) |
| Ardışık kare farkında planlanmamış sıçrama | 0. Planlı kesmeler: 2,95 · 6,25 · 8,35 · 16,2 |
| Render | Remotion 4.0.300, PNG kare, `--crf=16 --x264-preset=slow --color-space=bt709`, 4 çekirdek ≈28 dk |

## D. Anlaşmazlıklar

Kurul toplantısında ve sınamada 8 anlaşmazlık çıktı. Her birinde kreatif direktör tek karar verdi.

**D1. Gerçek widget pikseli mi, yeniden tasarım mı**
- Görüşler: Toplantı planı karma modeli savundu: ChatGPT içindeki widget temsilî kalacak ama envanteri gerçeğe kilitlenecekti. Kırmızı takım ve mühendis şunları gösterdi: gerçek widget HTML'i, canlı veri ve cap/harness düzeneği repoda; 1179 px genişlikte gerçek render mümkün (s52_inline.png, detail_inline.png). Yeni brif ve docs/KURALLAR.md 'içerikleri yeniden çizilmez' diyor. HANDOFF karar 2 (Onur) ise 'daha seksi bir yeniden tasarım' istiyor.
- Seçenekler: (a) Yeniden tasarım (v11): cilalı, ama planın kendisi bile üç uydurma bileşen üretti; envanter kilidi pratikte tutmuyor. (b) Gerçek widget pikselleri ve dış reklam katmanları: uydurma riski kalkar, brif ve KURALLAR'a uyar. Bedeli: yakalama hattı (~1,5 gün) ve stil özgürlüğünün kaybı. (c) Karma: iki yolun riskini birlikte taşır.
- Karar: (b). Evlek'in kendi yüzeyleri (Lapta ve Girne satır içi sonuçları, tam ekran detay, evlek.app sayfası) gerçek piksel olarak kullanılır. ChatGPT kabuğu ve Eklentiler ekranları temsilî kalır. Onur'un 'zayıf görünüm' itirazına cevap kadraj, ışık, derinlik ve portal katmanlarıyla verilir. Render öncesinde Onur'a aynı karelerde A/B still sunulur.
- Gerekçe: Bu filmin bütün güven sorunları yeniden çizimden doğdu. Gerçek piksel, 'kart, detay ve sayfa doğru kayda bağlı' kuralını kendiliğinden sağlar. Yeniden tasarımın tek gerekçesi olan 'kayıt yok, büyütünce bulanıklaşır' öncülü yanlış çıktı: düzenek 393 pt × DPR 3 = 1179 px ile ekranla birebir çiziyor. HANDOFF karar 2 bağlayıcı olduğu için sapma yazılı onaya gidiyor.

**D2. Kancanın indiği ekran durumu ve neden-sonuç sırası**
- Görüşler: Toplantı planı ters portalı £139.000'e kaydırılmış karusele indiriyordu. Kırmızı takım bunun gerçek bir açılış durumu olmadığını gösterdi: gerçek karusel £105.000 ile açılıyor. Ayrıca sonuç sorudan önce okunuyordu. Mühendis, kahraman kartın ve çipin portal sırasında çift görüneceğini belirtti.
- Seçenekler: (a) Kaydırılmış karusel: hızlı, ama gerçek dışı bir durum. (b) Karuseli dizin 0'da göstermek: dürüst, ama insan görüntüsü ve CGI içeren kart kadraja girer. (c) Ters portal ChatGPT tam ekranındaki gerçek Evlek detayına (1/14 = aynı havuz fotoğrafı) iner. Ardından sert kesmeyle soru balonuna geçilir ve film doğrusal ilerler; detaya götüren gerçek dokunuş 7,3'te filmin içinde gösterilir.
- Karar: (c).
- Gerekçe: Tam ekran detay gerçek bir durum: kart dokunuşu ChatGPT'de goFull('detail') çağırıyor. Kahraman görsel kancadaki fotoğrafın ta kendisi, bu yüzden portal dikişsiz kapanıyor. 0–2,95 bilinçli bir ileri sıçrama: kancanın işi arzu ve haber. 2,95'ten sonra her durum görünür bir eylemle geliyor ve 7,7'de aynı detay yeniden gelerek kafiye kuruyor.

**D3. Kahraman karta nasıl ulaşılır (£105.000 kartı sorunu)**
- Görüşler: Kırmızı takım görünür bir kaydırma ya da kartların ilk durumda gösterilmesini önerdi. Mühendis, £105.000 kartının hiçbir karede görünmemesi gerektiğini söyledi; görsel CGI ve kırpım figürleri çıkarmıyor.
- Seçenekler: (a) Görünür tam kaydırma (0→5): £105.000 kartı kadraja girer. (b) Yeni bir sıralama ya da istem: kaydı alınmamış bir sonuç, yani uydurma riski. (c) Şerit yakın plana kesmeyle girilir; kaydırma o karede zaten sürüyordur (dizin ≈3,6→5) ve parmak halkası görünür. Kaydırmanın başı kadraj dışında kalır. Varlık yalnız 3–7. dizinleri içerir.
- Karar: (c).
- Gerekçe: Gerçek bir eylem (yatay kaydırma) gerçek bir duruma götürüyor ve kesme serbest. £105.000, £110.000 ve £120.000 (CGI) kartlarının pikselleri hiçbir v12 varlığında yok; ihlal fiziksel olarak imkânsız. Kadrajda kalan 100185, 101433, 100102 ve 100970 gerçek fotoğraflar; elle kontrol edildi.

**D4. Karşılaştırma bölümü**
- Görüşler: Yönetmen ve CD çıkarılmasını, strateji ve algı kısaltılmasını, UI gerçek tablo olarak çizilmesini önerdi. Kırmızı takım çıkarılmasını doğru buldu.
- Seçenekler: (a) Kısa kanıt planı: 'akıllı' yanı gösterir, ama ana hikâyeyi böler. (b) Gerçek tablo: dürüst, ama gerçek cevap £127.000'lik ilanı öneriyor. (c) Çıkarmak: süre ve sade mesaj kazanılır.
- Karar: (c). 30, 15 ve 6 sn sürümlerinde karşılaştırma yok.
- Gerekçe: HANDOFF karar 3'e göre karşılaştırma 'gerekirse olabilir, amaç değil'. Gerçek oturum diğer ilanı tercih ediyor. Kazanılan süre telefonsuz 2,0 sn iç mekâna, gerçek evlek.app sayfasına ve karar 5'teki Girne sonucuna gidiyor.

**D5. CTA metni, yol şeridi ve 52 px alt sınırı**
- Görüşler: Toplantı planı 'Eklentiler'den Evlek'i ekle.' ile 44/48 px'lik bir yol şeridini birlikte kullanıyordu. Kırmızı takım, HANDOFF karar 4'teki metnin kısaltıldığını ve 52 px alt sınırının çiğnendiğini gösterdi.
- Seçenekler: (a) Kısa CTA ve kapanışta şerit: iki metin aynı bilgiyi tekrarlıyor ve bağlayıcı metin değişiyor. (b) HANDOFF CTA'sı birebir, şerit yalnız kurulum bölümünde 52/600: tek ses, karar 4'e uyumlu. (c) Kapanışta yalnız şerit: eylem fiili kayboluyor.
- Karar: (b). CTA 'ChatGPT'de Eklentiler'den Evlek'i ekleyin.' (üç satır, 72/800). Yol şeridi 'ChatGPT › Eklentiler › Evlek › Ekle' yalnız 16,2–21,15 arasında, 52/600. Dipnot 30 px (istisna).
- Gerekçe: CTA zaten yolu içeriyor; kapanışta şerit tekrar olur. Şerit, adımların ekranda gerçekten gösterildiği anda öğretici. HANDOFF'taki 52 px kuralı korunuyor.

**D6. Telefonsuz tam ekran planlar**
- Görüşler: UI ve HANDOFF ('telefon her an telefon olmalı') telefonun hiç kadraj dışına çıkmamasını istedi. Diğer uzmanlar tam ekran ev anının telefonsuz kalmasını başarı saydı.
- Seçenekler: (a) Telefon hep kadrajda: ürün bağı sürer, ama ev ile telefon aynı anda odak olur. (b) Sınırlı telefonsuz plan: tek odak, en yüksek arzu.
- Karar: (b). Yalnız iki plan var: 0,0–1,5 (kanca) ve 9,65–11,65 (iç mekân). Toplam 3,5 sn. Her ikisinde telefon bağı portalla bir saniye içinde kuruluyor.
- Gerekçe: Kural, telefonun göründüğü yerde telefon olarak tanınmasını istiyor. 'Fotoğraf, telefon ve metin aynı anda odak olmasın' ilkesi de telefonsuz bir arzu anı gerektiriyor. HANDOFF cümlesiyle olan gerilim Onur'a soruluyor.

**D7. Girne sonucu 1,5 sn (HANDOFF karar 5)**
- Görüşler: Toplantı planı bu kararı atlamıştı. Kırmızı takım bunu bağlayıcı bir kararın ihlali olarak işaretledi.
- Seçenekler: (a) Atlamak: karar ihlali. (b) Ayrı bir Girne bölümü: +1,5 sn ve hikâye bölünür. (c) Kurulumdan sonraki 'Sohbette dene' sonucu gerçek Girne araması olur (w_search52.json, 52 ilan, gerçek ilk durum): ilk kullanımın kanıtı ve karar 5 aynı planda karşılanır.
- Karar: (c). 21,95–23,45 arası 1,5 sn. Kapanıştaki telefon da bu sonucu gösterir.
- Gerekçe: Kurulumdan sonra boş sohbet kalmıyor. Gösterilen karusel ilk durumunda ve ilk kart (EVL-101212) gerçek bir iç mekân fotoğrafı. Lapta tekrarlanmıyor.

**D8. Köşede sürekli Evlek imi**
- Görüşler: CD ve marka direktörü HANDOFF'a göre 3–25 sn arasında köşe imi istedi.
- Seçenekler: (a) 48 px im: hatırlanırlık artar, ama başlık ve şerit yuvasıyla (y 110–210) çakışır ve ikinci bir odak doğar. (b) İm yok: marka logo, çip, gerçek detay ve evlek.app başlığıyla görünür.
- Karar: (b).
- Gerekçe: Evlek her 6 sn'de en az bir kez ≥40 px görünüyor: logo (0–2,95), balon çipi (3,45), gerçek widget başlıkları, evlek.app logosu (14,2–15,15), Eklentiler'de Evlek sayfası ve kapanış. Onur'a bildirilir.

## E. Değişiklik planı (12 madde) ve uygulama durumu

Bütün maddeler uygulandı. Kısmen uygulananlar ve farklar "Plandan sapmalar" bölümünde. Teknik sütun kısaltıldı; tamamı `docs/v12/kurul/final.json` içinde.

| No | Kaynak sn | Yeni sn | Öğe | Yarar | Teknik (özet) | Bağımlılık | Emek | Kabul |
|---|---|---|---|---|---|---|---|---|
| 1 | 5,5–26,0 (tüm widget ekranları) | 1,5–16,2 ve 21,6–30,0 | Evlek yüzeyleri gerçek pikselle: Lapta satır içi sonucu, tam ekran detay (1/14, 2/14, kaydırılmış hali), Girne sonucu ve evlek.app sayfası | Uydurma bileşen ve davranış sınıfı tümden kalkar. Kart, detay ve sayfa gerçek kayıttan gelir. Brif ve KURALLAR'a uyulur; gerçeklik kanıtı ekrandaki her Evlek pikselinde olur. | Yeni dosya cap/capture-v12.mjs (cap/ altındaki mevcut dosyalara dokunulmaz; harness.mjs'in shim'i kopyalanır). Playwright viewport 393×900, deviceScaleFactor 3, tema dark, mod inline/fullscreen. Fixture: live/w_lapta.json, live/w_search52.json; get_listing stub'ı live/w_detail_100102.json döndürür (officeName ve office null: yalnız ofis satırı temizlenir, başka veri değişmez). Harita karoları için networkidle ve harita hazır olayı beklenir, sonra donmuş PNG alınır. Çıktılar public/v12/w/ altına: wLaptaTop.png (harita, başlık, çipler; kart şeridinin üst kenarında kırpılır), wLaptaRow.png (track overflow visible; yalnız 3–7. dizin, x kırpımı 100185 kartının sol kenarından), wGirne.png (satır i | Ağ erişimi (evlek.app harita varlıkları, görseller). Render öncesi Onur'a A/B still (açık soru 1). | Orta-yüksek (1,5 gün) | Her PNG aynı fixture'dan iki kez üretildiğinde sha256 eşit. Hiçbir varlıkta '[ofis]', kişi ya da ofis adı yok. EVL-100336, 100837 ve 100932 kapaklarının pikselleri hiçbir varlıkta yok (pHash taraması). Ekrandaki her Evlek etiketi listing-cards-v3-14.html i18n sözlüğünde geçiyor. dFull_2 kahramanı ile public/v4/EVL-100102_01 pHash farkı ≤6; değilse _01'in gerçek dizinine '›' ile gidilir ve 2/14 etiketi gerçek dizinle değişir. |
| 2 | 0,0–5,5 | 0,0–3,45 | Kanca: keskin havuz + logo + 'artık ChatGPT'de.' → ters portal ile tam ekran Evlek detayına (1/14) iniş → 2,95'te soru balonuna kesme → logo balondaki 'Ev Evlek' çipine iner | İlk karede gerçek ev ve haber birlikte görünür. 2,5 sn'de 'bu ev ChatGPT'deki bir Evlek sonucu' bilgisi metinsiz verilir. İnilen durum gerçek. Boş ekran yok. | V12.tsx: Photo bileşeni (kanca ve kapanış aynı bileşeni kullanır; props {xPct, blur, dim}). Kaynak public/v12/EVL-100102_00_l2560.png (2560×1920), left = −(xPct/100)·1480, xPct = 24 + 1,5·t. ReversePortal: k = FLY(lin(t,1,5,2,5)). Görüntü dikdörtgeni başlangıçta (−388,5; 0; 2560×1920), bitişte projectOut(PH, HERO_D) ile hesaplanan dikdörtgen (4:3, cover). Kırpım çerçevesi (0,0,1080,1920)'den projeksiyonlu HERO_D'ye aynı k ile karışır. Screen state 'detailFull1' {heroHidden: t<2,5}. Telefon PH (540;1110;0,55;2;−4;−1), üst kenar 367,5; logo alt kenarı 295; pay 72 px. Zemin: Photo blur 24 + lacivert .6 (aynalı dolgu, plan 11). Başlık opaklığı 1−lin(t,1,25,1,5). 2,95'te Screen 'qBubble' {chipHid | No 1 (dFull_1, HERO_D), no 10 (projectOut), no 11 (dosya) | Orta-yüksek (1,5 gün) | 0. kare: kadrajın %100'ü keskin fotoğraf, düz siyah alan %0. 360×640'ta logo ve başlık okunuyor. 2,5'te portal görüntüsü ile kahraman pikselleri arasındaki fark ≤2 px. 1,5–2,5'te çift kahraman yok. Logo çipe ≤2 px hatayla iniyor. 0–3,45'te logo ile metin kutuları ve logo ile telefon gövdesi kesişmiyor. |
| 3 | 2,9–10,4 | 3,45–8,65 | Soru balonu yakın planı + slogan → gerçek Lapta sonucu → kesmeyle kart şeridi (kaydırma sürüyor) → £139.000 kartı → dokunuş → tam ekran detay → '›' ile 2/14 | Sohbetten eve giden yol, her durum gerçek bir eylemle gelerek sessiz okunuyor. £105.000 kartı hiçbir karede yok. | KEYS: K(3,45, PH) → K(4,15, PB', SOFT) → K(6,25, PB', L_) → kesme K(6,25, PC) → K(7,7, PC, L_) → K(8,2, PDH, SOFT). PB' = (x, y; 0,85; 2; −4; −1). x = 540 − 0,85·(60 + bx − 649,5) (bx: balon merkezi). y, kart şeridi üst kenarı kadrajın ≥40 px altında kalacak şekilde: y ≥ 1920 − 0,85·(72 + ROW_TOP − 1350) + 40 (nominal (432; 1700)). PC = (540 − 0,8·(60+cx−649,5); 960 − 0,8·(72+cy−1350); 0,80; 2; −4; −1); cx, cy = CARD5 merkezi (nominal (669; 606)). PDH (540;1180;0,62;2;−4;−1). Ekran içi: harita belirişi 4,5–4,9, başlık ve çipler 4,95–5,2 (kamera sabit). Şerit: translateX bezier(.2,.7,.2,1) 6,25–6,6, dizin 3,6→5, parmak halkası (r 110, beyaz %35) aynı yolda. Dokunuş 7,3 + kick. Tam ekran açılı | No 1, no 8 | Orta (1,5 gün) | Durum fonksiyonu testi: her ekran durumu ≥18 kare. 'Sor. Evlek göstersin.' ≥96 kare tam opak. 6,25 öncesinde kart şeridi kadrajda değil (projectOut testi). Balon metni çıktıda ≥28 px. Kart fiyatı çıktıda ≥36 px. |
| 4 | 10,0–17,0 | 8,65–11,65 | Detay kahramanından (2/14) iç mekâna portal; 2,0 sn telefonsuz tam ekran tilt; lacivert degrade üstünde künye | İlanın ikinci güçlü vaadi (çift yükseklik, kapıda deniz) tam ekran ve tek odakla görünüyor. Kalıntı ya da hayalet yok. | Portal (v12, parametrik): kaynak dikdörtgen projectOut(PDH, HERO_D). Görüntü başlangıçta kahraman içinde cover (1200×1600, genişlik = kahraman genişliği, objectPosition 50% 50%); bitişte (−150; 0; 1584×2112) (public/v12/EVL-100102_01_l1584.png). Görüntü ve kırpım dikdörtgeni aynı k ile interpolasyon; ph=h, bilgi alanı yok. FLY 8,65–9,65. Telefon portal sırasında hareketsiz; görüntü onu örtüyor. showPhone=false 9,65–11,65. Kartın seçim halkası portal kartında çizilmez. Interior top = Math.round(−120·E(lin(t,9,65,11,65))), E = bezier(.33,0,.2,1). Künye: '£139.000' 96/800 tabular top 210, giriş 9,75–10,0; 'Lapta · 2+1 · 107 m²' 52/600 top 322, giriş 9,85–10,1; çıkış 11,4–11,6. Üst degrade rgba( | No 1 (dFull_2, eşleşme kontrolü), no 11 | Orta (1 gün) | 60 fps tarama 8,65–9,65: koyu şerit yok, telefon kalıntısı yok. 9,65'te Interior'a geçiş sıçramasız (ardışık kare farkı ≤ medyanın 2 katı). Tam ekran katmanda iki farklı fotoğrafın çapraz geçişi = 0. Künye kontrastı ≥4,5:1. Alan türü yazılmıyor. |
| 5 | 14,5–17,0 | 11,65–16,2 | Telefon tam ekran detayla (2/14) döner → bilgiye itme → kaydırma → 'Evlek'te tüm ayrıntılar ↗' (dv__out) → uygulama içi tarayıcıda gerçek evlek.app sayfası | Gerçek düğme gerçek ilan adresini açıyor (openLink(d.url) → .../lapta-da-deniz-manzarali-2-1-daire-evl-100102). Fiyat, kod ve sayfa aynı kayıt. Filmin gerçeklik kanıtı bu. | KEYS: K(11,65, (900;2500;0,42;3;−8;0), cut) → K(12,3, P_IN (740;1300;0,42;3;−8;0), ENTER) → K(12,85, PD (560;1000;0,70;2;−5;−1), SOFT) → K(14,55, PD, L_) → K(15,15, PP (540;650;0,78;2;−4;−1), SOFT) → K(16,2, PP, L_). Zemin brightness 1→.85 [11,65–12,05]; blur 0→24 + lacivert .6 [13,8–14,4]. Ekran: dFull_2 → kaydırma [13,35–13,6] → dFull_info. Dokunuş 13,7 (DV_OUT merkezi). WebPage, iOS modal olarak aşağıdan gelir [13,8–14,2]. Düzen: durum çubuğu 0–140; açık tarayıcı başlığı 140–270 (✕, kilit, 'evlek.app' 40/600, zemin #F7F7F7); page_view.png içeriği (kaynak y 0–1765) 270–2035; sayfa zemin rengiyle düz dolgu 2035–2131 (renk page_view (600,1740)'tan örneklenir); yapışkan alt çubuk (kaynak y 17 | No 1 (dFull_info, DV_OUT) | Orta (1 gün) | Ofis kartı ('BÜRO SAHİBİ', kişi adı) hiçbir karede yok. PP'de '£139.000', 'Lapta'da Deniz Manzaralı 2+1 Daire' ve '107 m² Kapalı' çıktıda ≥28 px (beklenen ≈34) ve ≥1,0 sn. P_IN'de gövde köşeleri (projectOut) kadraj kenarına ≥40 px. Dokunulan düğme etiketi 'Evlek'te tüm ayrıntılar ↗'. |
| 6 | 20,5–26,0 | 16,2–23,45 | Eklentiler yolu 3,5 sn: ≡ › Eklentiler › 'evlek' › Evlek › Eklentiyi kur › Bağlı ✓; ardından 'Sohbette dene' ve gerçek Girne sonucu 1,5 sn | İzleyici Eklentiler'in yerini ve yolun tamamını görür. Kurulumun ilk sonucu boş kalmaz. HANDOFF karar 5 (Girne 1,5 sn) karşılanır. | Kesme 16,2: CHAT (540;1050;0,55;2;−4;−1), Lapta sohbeti. ≡ 16,45 → Sidebar [16,5–16,75] (Yeni sohbet, Zamanlananlar, Kitaplık, Eklentiler, Keşfet; sabitlenenler ve hesap yok) → 'Eklentiler' 17,05 → PluginsHome push [17,1–17,4] → arama 17,7 → 'evlek' [17,75–17,95] (klavye görünmez) → tek sonuç satırı 18,0 (iskelet yok) → satır 18,3 → EvlekPage push [18,35–18,65] → KEYS K(18,7, CHAT) → K(19,3, PBTN (540;1070;0,60;2;−4;−1), SOFT) → 'Eklentiyi kur' 19,35 → spin [19,35; 19,7) → bound t ≥ 19,7 (spin[1] === bound) → '✓ Bağlı' + 'Sohbette dene'. Tut 19,7–20,9. 'Sohbette dene' 20,9 → NewChat push [20,95–21,25] (yazım kutusunda 'Ev Evlek' çipi + gerçek Girne istemi; ref 02/03'ten birebir) → gönder 21, | No 1 (wGirne), no 8 (PathStrip), açık soru 6 (iOS yolu) | Orta-yüksek (2 gün) | 16,2–19,7 = 3,5 sn. Her ekran durumu ≥18 kare. Spin bitişi ile bound aynı kare; geri dönen durum yok. 'Bağlı' çıktıda ≥33 px, 360×640'ta ≥11 px ve ≥1,2 sn. Girne sonucu ≥90 kare. PBTN'de gövde üst kenarı ile şerit alt çizgisi arası ≥48 px (projectOut). |
| 7 | 26,0–30,0 | 23,45–30,0 | Kapanış evde: keskin havuz, Girne sonucunu gösteren telefon, logo, CTA, dipnot; dikişsiz döngü | Son görüntü ev ve gerçek sonuç oluyor. CTA 5 sn sabit kalıyor (HANDOFF). Döngü eve bağlanıyor. | KEYS: K(23,45, PBTN) → K(24,15, CLOSE (540;1330;0,40;3;−6;−1), SOFT) → K(29,45, CLOSE, L_) → K(29,95, EXIT (540;2650;0,40;3;−6;−1), FLY); showPhone=false t ≥ 29,95. Photo: blur 24→0 ve lacivert .6→0 [23,45–24,15], tek görüntü ve aynalı dolgu; xPct = 24 − 1,5·(30 − t) (t=30'da 24, 0. kareyle aynı). Logo (540;220) h150, giriş 24,15–24,4. CTA 'ChatGPT'de / Eklentiler'den / Evlek'i ekleyin.' 72/800, satır aralığı 79, top 330, giriş 24,25–24,5. Dipnot 30/500, satır aralığı 40, sol ve sağ 90, top 610, krem %85, giriş 24,6–24,85. CTA ve dipnot çıkışı 29,5–29,65. Başlık 'artık ChatGPT'de.' giriş 29,7–29,95. Kanca ile aynı degrade ve vinyet. Signature kalkışı yok. | No 6, no 11 | Orta (0,5 gün) | CTA tam opak ≥300 kare. Dipnot ≥276 kare, ≤2 satır, alt kenarı ile telefon üst kenarı (790) arası ≥48 px. 1799. ve 0. kare SSIM ≥0,99. Döngüde 1795–1799 ile 0–4 arası kare farkı ≤ film medyanının 2 katı. EXIT'te gölge dahil 1920'nin altında piksel yok. |
| 8 | 2,9–29,75 (tüm dış metin) | tüm film | Dış metin sistemi: 3 ana mesaj + tek künye + kurulumda yol şeridi + dipnot; yankı, adım başlıkları ve fark yazısı kaldırılır | Tek tipografik ses ve tek fiil ('ekleyin'). Aynı anda okunacak tek dış metin. | V12.tsx: qWords yankısı, step1, step2 ve diff Txt silinir. Txt tek başlık yuvası (top 128). Yeni PathStrip({active, done}): 'ChatGPT › Eklentiler › Evlek › Ekle' 52/600, letter-spacing −0,03em, top 128. Pasif öğeler krem %55; aktif öğe %100 + mercan alt çizgi 4 px (y +8); done ise '✓'. Görünürlük 16,2–21,15 (giriş 16,2–16,45, çıkış 20,9–21,15). Aktif adımlar: ChatGPT 16,2, Eklentiler 17,05, Evlek 18,3, Ekle ✓ 19,7. Ölçülen genişlik >928 px ise harf aralığı −0,04em yapılır; yine sığmazsa 'ChatGPT ›' düşer (ChatGPT kabuğu zaten ekranda). | No 2, no 6, no 7 | Düşük (0,5 gün) | Farklı ana cümle sayısı = 3. Hiçbir karede iki dış metin aynı anda tam opak değil (logo hariç). Dış metin ≥52 px (dipnot 30). Metin ile telefon arası ≥48 px. Metin üstte ≥110 px, yanlarda ≥76 px ve alt 280 px'e girmiyor. |
| 9 | 5,5–20,5 | — (çıkarıldı) | Karşılaştırma, 'Arada £12.000 fark.' ve v11'in yeniden çizilmiş widget dalları kaldırılır | Kahraman ilanı küçülten sahne ve tüm uydurma bileşenler ('Ucuzdan pahalıya', karşılaştırma kartı) çıkar. | Önce kullanımlar kaldırılır: scrollAt (TL.scrollC) → 0; Background (TL.back); Screen içindeki TL.iosBack, q3Type, send3; kick listesi. Ardından v12/tl.ts'ten back, iosBack, q3Type, send3, bubble3, scrollC, cmp, cmpPush ve diff anahtarları silinir. Screen.tsx'te Compare, Q3, çizilmiş ListingCard, Chips, MapWidget ve Detail dalları no 1'in PNG yerleşimiyle değiştirilir. src/v10 ve src/v11'e dokunulmaz. | No 1 | Düşük (0,5 gün) | npx tsc --noEmit temiz. Hiçbir karede '£12.000', 'karşılaştır' ya da 'Ucuzdan pahalıya' yok. git diff src/v10 src/v11 boş. |
| 10 | 0,0–30,0 | 0,0–30,0 | Markasız cihaz, fotoğraf üstünde temas gölgesi ve doğru 3B izdüşüm (projectOut) | 'Birebir iPhone kopyası yok' kuralı karşılanır. Telefon fotoğraf planlarında sahneye oturur. İmza ve geometri testleri doğru hesaplanır. | src/v12/Phone.tsx (v10'un kopyası); V12.tsx ve Screen.tsx'teki import './Phone'. Değişiklikler: Ø44 delik kamera (589,5; 50); BR 157→128; ekran yarıçapı 117→96; tek tonlu grafit çerçeve linear-gradient(125deg,#3C4D59,#2B3B47 30%,#16232D 70%,#2B3B47); sol yan tuşlar (BX−9, y 492/672) kaldırılır; sağda güç (y 640, h 140). Screen StatusBar saati '10:24'. onPhoto gölgesi: (−40,60)·s, blur 80·s, α .35 ve (0,140)·s, blur 220·s, α .22. projectOut(pose, sx, sy): M = T(x,y)·P(3200)·Rx·Ry·Rz·S(s), ekran noktası (60+sx−649,5; 72+sy−1350; 75·s). | Yok | Düşük-orta (1 gün) | Hap ada yok, '9:41' yok. projectOut ile DOM getBoundingClientRect farkı ≤1,5 px (CHAT, PB', PC). P_IN, PD ve CLOSE'da gövde ≥40 px payla kadraj içinde (yakın planlar bilinçli kırpım). |
| 11 | 10,8–17,0 ve 0,0–5,5 (fotoğraflar) | 0,0–2,5 · 8,65–14,4 · 23,45–30,0 ve bulanık zeminler | Fotoğraf hattı: Lanczos ile ölçeklenmiş PNG, ek zoom yok, tek Photo bileşeni, aynalı dolgulu blur, sıcak-nötr derecelendirme | Arzu anlarında yumuşama azalır. Bulanıklık rampasında kenar bandı olmaz. Döngü dikişi tek bileşenle güvenceye alınır. | Yeni dosyalar (append-only): ffmpeg -i public/v4/EVL-100102_00.jpg -vf scale=2560:1920:flags=lanczos public/v12/EVL-100102_00_l2560.png ve scale=1584:2112:flags=lanczos ile EVL-100102_01_l1584.png. Keskinleştirme yok. GRADE_EXT 'brightness(1.0) contrast(1.05) sepia(.06) hue-rotate(-3deg)'; GRADE_INT 'brightness(.98) contrast(1.03) sepia(.08)'. Pool'daki 1,04 ve 1,1 ölçekleri kaldırılır. Blur katmanı: 1224×2064 sarmalayıcı, içinde görüntü ile üst ve alt 72 px scaleY(−1) ayna şeritleri; filtre sarmalayıcıya, kırpım dış kadraja uygulanır. Tamamen örtülü karelerde bulanık katman çizilmez (render maliyeti). | Açık soru 9 (daha yüksek çözünürlüklü kaynak) | Düşük (0,5 gün) | Dış çekim ölçeği ≤1,60×, iç çekim ≤1,32×. 23,45–24,15 rampasında üst/alt 60 px ile orta bölge arasındaki parlaklık farkı ≤%5. 10,5 sn'de iç mekân duvarında R≥B. |
| 12 | tüm film | tüm film | Render ayarları ve otomatik QC (durum fonksiyonu, geometri, veri, döngü) | Renk kaymasız yükleme sağlanır. Uydurma, çakışma ve okunurluk her render'da otomatik denetlenir. | npx remotion render src/index.ts V12-916 out/v12.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png --x264-preset=slow --concurrency=4 --muted (--gl verilmez). V12'den saf stateAt(f) dışa aktarılır. scripts/qc-v12.mjs şunları denetler: (a) ekran durumu ≥18 kare, geri dönen durum yok; (b) projectOut ile gövde köşeleri ve dış metin, logo, şerit kutularının kesişimi; ≥48 px; (c) live/*.json ile metin karşılaştırması (£139.000, 2+1, 2 banyo, 107 m² türsüz, 14 foto, 8 ilan, £105–147 bin; detayda _meta 6 özellik); (d) 0. ve 1799. kare SSIM; (e) blackdetect; (f) 360×640 temas sayfası (0,5 sn aralıkla 60 kare). Önce still turu: COMP=V12-916 node scripts/stills.mj | No 1–11 | Düşük (0,5 gün) | ffprobe: yuv420p, color_range=tv, bt709 ×3, 60/1, 1800 kare, 1080×1920, ses yok. QC sıfır hata. Kare bit hızı ölçütü kullanılmaz. |

### Üç kreatif yön (kurul) ve seçim

| Yön | Fikir | Dikkat | İlan arzusu | Ürünün anlaşılması | Marka | Üretilebilirlik |
|---|---|---|---|---|---|---|
| A · Önce ev (ters portal döngüsü) | ChatGPT'deki tek bir Evlek cevabı gerçek bir eve açılan kapıdır: film evle başlar, sohbetin içinden geçer ve aynı evde kapanır. | 7 | 8 | 8 | 7 | 6 |
| B · Bir soru, bir ev (ürün önce) | Tek cümle sor, gerçek ev ekranda açılsın: film ilk kareden itibaren telefonun içindeki sorudan sonuca giden en kısa yoldur. | 5 | 5 | 8 | 6 | 8 |
| C · Bir sabahın böyle başlasa? (yaşam önce) | Denize bakan bir sabahın arzusunu sat; Evlek'i o arzuya giden yol olarak göster. | 7 | 8 | 4 | 5 | 6 |

**Seçilen: A · Önce ev.** Haber, arzu ve ürün kanıtını aynı akışta veren tek yön. B arzuda (5), C ürünün anlaşılmasında (4) kaybediyor.

## F. Final tasarım sistemi

**Telefon.** Gövde 1299×2700 tasarım px, ekran 1179×2556 (gövdede x=60, y=72), perspektif 3200, kalınlık 150 (scale3d), ışık sol üstten. Markasız gövde: Ø44 delik kamera, BR 128, ekran yarıçapı 96, tek tonlu grafit çerçeve, saat 10:24, sol yan tuş yok. Pozlar (x; y; s; rx; ry; rz): PH (540;1110;0,55;2;−4;−1), kanca ve detay; üst kenar 367,5, logoyla pay 72. CHAT (540;1050;0,55;2;−4;−1), kurulum; şeritle pay 104. PB' (432;1700;0,85;2;−4;−1) nominal, soru balonu yakın planı; y formülle seçilir, kart şeridi kadraj dışında. PC (669;606;0,80;2;−4;−1) nominal, CARD5 merkezinden formülle. PDH (540;1180;0,62;2;−4;−1), tam ekran detay kahramanı ve fiyat. P_IN (740;1300;0,42;3;−8;0), iç mekânda giriş; sağda 67, altta 53 px pay. PD (560;1000;0,70;2;−5;−1), detay bilgisi. PP (540;650;0,78;2;−4;−1), evlek.app fiyat ve başlık. PBTN (540;1070;0,60;2;−4;−1), 'Eklentiyi kur' / 'Bağlı' / Girne sonucu; üst kenar 260. CLOSE (540;1330;0,40;3;−6;−1), kapanış; üst 790, alt ≈1872. EXIT (540;2650;0,40;3;−6;−1). Bütün paylar projectOut ile doğrulanır. Gölge: lacivert zeminde v10'un üç katmanı; fotoğraf üstünde temas gölgesi (−40,60)·s, blur 80·s, α .35 ve ortam gölgesi (0,140)·s, blur 220·s, α .22. Plan ölçeği kuralı: geniş plan (s 0,40–0,42) telefonu mekânda bir nesne olarak gösterir; orta plan (0,55–0,62) bir ekranın bütününü okutur; yakın plan (0,70–0,85) tek bir anlam satırını okutur. Yakın planda gövde bilinçli kırpılır, ama bir köşe ve bir kenar görünür kalır.

**Fotoğraf.** Dış çekim EVL-100102_00: Lanczos ile 2560×1920 PNG, 1,60× sabit, zoom yok. Yalnız yatay pan: 1,5%/sn = 22,2 px/sn (taşma 1480 px). Kanca xPct = 24 + 1,5·t (0–1,5). Kapanış xPct = 24 − 1,5·(30 − t) (23,45–30,0). Döngüde konum ve hız aynı. İç çekim EVL-100102_01: 1584×2112 PNG (1,32×), left −150; kapı ve deniz x≈325–640. Tilt top 0→−120 px, 9,65–11,65, bezier(.33,0,.2,1), değer Math.round edilir. Renk: GRADE_EXT 'brightness(1.0) contrast(1.05) sepia(.06) hue-rotate(-3deg)', GRADE_INT 'brightness(.98) contrast(1.03) sepia(.08)'; beyazlarda R≥B. Vinyet radial-gradient(ellipse 80% 62% at 50% 52%, transparent 58%, rgba(5,16,28,.30)). Yazı alanında üst degrade rgba(10,37,64,.55–.60)→0, 0–560/620 px. Bulanık faz: blur 0↔24 px + lacivert 0↔.6, bezier(.4,0,.2,1), tek görüntü, aynalı dolgulu sarmalayıcı. Fotoğraf değişimi yalnız portalla ya da bulanık zeminde kesmeyle yapılır. Arayüz PNG'leri ve page_view.png üstüne filtre uygulanmaz. Kullanılmayanlar: yatak odası (_06/_07), EVL-101433 büyük planda, EVL-100336, 100837 ve 100932 (CGI) görselleri.

**Tipografi.** Font yalnız Inter, letter-spacing −0,03em; fiyatta −0,04em ve tabular-nums. Logo h150, merkez (540;220). Başlık 'artık ChatGPT'de.' 92/700, top 330. Slogan 72/700, top 128. Künye fiyat 96/800 (top 210), alt satır 52/600 (top 322). Yol şeridi 52/600, top 128. CTA 72/800, üç satır, satır aralığı 79, top 330. Dipnot 30/500, satır aralığı 40, sol ve sağ 90, top 610, krem %85, ≤2 satır. Güvenli alan: yanlarda 76 px; metin üstte ≥110 px; alt 280 px'e dış metin konmaz. Minimum: dış metin ≥52 px (dipnot 30); telefon içinde anlam taşıyan metin çıktıda ≥28 px (360 px önizlemede ≥9,3 px). Metin ile telefon gövdesi arası ≥48 px. Ana yazının kalış süresi ≥ kelime×0,3+0,7 sn. Girişler yalnız opaklık ve 14 px yükselme (0,25 sn); bulanık giriş yok.

**Künye.** Tek dış künye, 9,75–11,6 arasında, telefonsuz iç mekân planında: '£139.000' (96/800) ve 'Lapta · 2+1 · 107 m²' (52/600). Krem metin lacivert üst degrade üstünde; kontrast ≥4,5:1; metin gölgesi yok. Alan türü yazılmaz (MCP'de basis null). Künye yalnız telefon kadrajda yokken görünür. Arayüz içindeki bütün künyeler gerçek pikseldir: kart '£139.000 · 2+1 · 2 banyo · 107 m² · Lapta, Girne · 14 foto'; tam ekran detay ('Satılık · Eklendi', 1/14 ve 2/14, gerçek özellikler); evlek.app ('107 m² Kapalı' sayfanın kendi metni).

**Hareket.** Eğriler: SOFT bezier(.25,.1,0,1), kamera hareketleri 0,55–0,7 sn. FLY bezier(.45,0,.15,1): portallar 1,0 sn, logo uçuşu 0,5 sn, çıkış 0,5 sn. ENTER bezier(.22,1,.36,1), 0,65 sn. Ekran geçişi (push/modal) 0,3–0,4 sn, bezier(.4,0,.2,1). Kart kaydırma bezier(.2,.7,.2,1), 0,35 sn ve snap. Dokunuş halkası r 110 ekran px, 0,3 sn, beyaz %35; kick 0,18 sn (s −%0,4, y +3). Kurallar: aynı anda tek büyük hareket; ekran durumu yalnız kamera dururken değişir; her durum ≥0,3 sn; okunacak bir şey varsa ≥1,2 sn duruş. Çapraz geçiş yasak. Hareket bulanıklığı ilk finalde yok. Katman sırası (alttan üste): zemin (Photo/Interior) → degrade ve vinyet → telefon gölgesi → telefon (ekran dahil) → portal → dış metin → yol şeridi → dipnot → logo/Signature.

**Kapanış.** 24,15–29,45 sabit kompozisyon. Zemin keskin EVL-100102_00 (1,60×), xPct 15,2→23,2, üst degrade .55. Logo krem h150, merkez (540;220). CTA 'ChatGPT'de / Eklentiler'den / Evlek'i ekleyin.' 72/800, top 330 (330–567). Dipnot 30/500, top 610 (≤2 satır, 610–690): 'Arayüz temsilidir; ilanlar ve fiyatlar Evlek'in gerçek verisidir. ChatGPT, OpenAI'ın ticari markasıdır.' Telefon CLOSE (540;1330;0,40;3;−6;−1); üst kenar 790, dipnotla pay 100. Ekranda kurulumdan sonraki gerçek Girne sonucu ('Girne · Satılık · 52 ilan'). Kapanışta yol şeridi yok, çünkü CTA yolu içeriyor. 29,45–29,95 telefon EXIT'e iner. 29,5–29,65 CTA ve dipnot söner. 29,7–29,95 'artık ChatGPT'de.' girer. 30,0 = 0. kare.

**Renk.** Lacivert #0A2540: zemin, degradeler, bulanık faz. Krem #FAF8F2: bütün dış metin ve logo. Mercan #B84E3B yalnız dış katmanda, yol şeridindeki aktif adımın 4 px alt çizgisinde. Arayüz renkleri gerçek pikselden gelir: ChatGPT koyu dili (#212121, #2F2F2F, #ECECEC) ve gerçek Evlek widget'ı (mercan 'Emlakçıya sor' düğmesi dahil). Evlek renkleri arayüzün içine sızdırılmaz. evlek.app sayfası açık temadadır ve tarayıcı başlığı açık (#F7F7F7). Mercan piksel oranı (ΔE<12) her karede <%3.

**Uygulamadaki değerler (plandan farklı olanlar)**
- **Degradeler:**
  - kanca ve kapanış: `linear-gradient(180deg, rgba(10,37,64,.74) 0, .58 @520px, 0 @860px)`
  - iç mekân: `.82 → .62 @300px → 0 @560px`
- **Dipnot:** 30/500, tam krem.
- **ChatGPT kabuğu zemini:** `#212121` (yakalamadaki ev sahibi değişkeniyle aynı, böylece widget ile kabuk arasında ton farkı yok); balon ve yazım kutusu `#303030`.

## G. 30 sn kurgu tablosu (0,5 sn çözünürlük)

Plan tablosu uygulamadaki zamanlara göre güncellendi.

| Saniye | Plan | Görüntü | Kaynak | Telefon pozu | Kamera | Yazı | Geçiş / eğri | Ses fikri |
|---|---|---|---|---|---|---|---|---|
| 0,0–0,5 | Kanca · tam ekran dış çekim | Keskin havuz, palmiye ve deniz; üst lacivert degrade | public/v12/EVL-100102_00_l2560.png · V12 Photo | yok | Pan xPct 24→24,75 (22 px/sn) | Logo h150 (540;220) + 'artık ChatGPT'de.' 92/700, top 330 | Döngü girişi (30,0 karesiyle aynı) | Ortam (sonradan eklenecek) |
| 0,5–1,0 | Kanca | Aynı kare | Photo | yok | Pan 24,75→25,5 | Logo + başlık | — | Müzik girişi |
| 1,0–1,5 | Kanca | Başlık söner, logo kalır | Photo | yok | Pan 25,5→26,25 | Başlık çıkışı 1,25–1,5 | Opaklık | — |
| 1,5–2,0 | Ters portal | Fotoğraf ve kırpım çerçevesi küçülür; arkada bulanık havuz ve telefon belirir; ekranda tam ekran Evlek detayı (kahraman alanı boş) | ReversePortal · dFull_1.png (heroHidden) | (540;1110;0,55;2;−4;−1) | Sabit | Logo | Portal FLY 1,5–2,5; üst degrade 1,5–2,0 söner | Whoosh |
| 2,0–2,5 | Ters portal iniş | Fotoğraf kahraman alanına oturur: '1 / 14', £139.000, 2+1 · 2 banyo · 107 m², Lapta, Girne | dFull_1.png | (540;1110;0,55;2;−4;−1) | Sabit | Logo | Köşeler ±2 px eşleşir; heroHidden 2,5'te kalkar | Oturma tıkı |
| 2,5–3,0 | Detay → soru | 2,5–2,95 ChatGPT tam ekranında Evlek detayı. 2,95'te sohbete kesme: gönderilmiş soru balonu (çip yuvası boş), altında 'Evlek' araç satırı | dFull_1 → ChatShell qBubble | (540;1110;0,55;2;−4;−1) | Sabit | Logo 2,95'te uçmaya başlar | Sert kesme 2,95 (ileri sıçramanın sonu) | — |
| 3,0–3,5 | İmza: logo → çip | Logo küçülerek balondaki 'Ev Evlek' çipine iner (3,45) | Signature (BUBBLE_CHIP, projectOut) | (540;1110;0,55;2;−4;−1) | Sabit; itme 3,45'te başlar | — | FLY 2,95–3,45 | Çip 'pop' |
| 3,5–4,0 | Balona itme | 'Lapta’da £160 bin altı, deniz manzaralı 2+1 daire' | ChatShell | → PB (506;1750;0,85;2;−4;−1) | İtme SOFT 3,45–4,15 | — | — | — |
| 4,0–4,5 | Balon yakın plan | Balon okunur (çıktıda ≈38 px) | ChatShell | PB' | Oturuş 4,15 | 'Sor. Evlek göstersin.' 72/700, top 128, giriş 4,15–4,4 | Opaklık + 14 px | — |
| 4,5–5,0 | Cevap gelir | Balonun altında gerçek Lapta haritası ve '£105–147 bin · 8' kapsülü | wLaptaTop.png | PB' | Sabit | Slogan | Ekran içi opaklık 4,5–4,9 | Yumuşak yükleme |
| 5,0–5,5 | Widget üstü | 'Lapta · Satılık · 8 ilan', Satılık/Kiralık, 'Filtreler · 5', 'Havuz', 'Deniz manzarası'; kart şeridi kadraj dışında | wLaptaTop.png | PB' | Sabit | Slogan | Başlık ve çipler 4,95–5,2 | — |
| 5,5–6,0 | Okuma | Duruş | wLaptaTop.png | PB' | Sabit | Slogan tam opak (4,4–6,0) | — | — |
| 6,0–6,5 | Kesme → kart şeridi | Slogan 6,0–6,25'te söner. 6,25'te kart şeridine kesme: şerit parmakla sola akıyor (£120.000 bahçe → £127.000 → £139.000), parmak halkası sürüklenir | wLaptaRow.png (yalnız 3–7. dizin) | PC (669;606;0,80;2;−4;−1) nominal | Sabit | Slogan çıkışı | Sert kesme 6,25; şerit translateX 6,25–6,6 ve snap | Kaydırma 'fış' |
| 6,5–7,0 | Kart yakın plan | £139.000 · 2+1 · 2 banyo · 107 m² · Lapta, Girne · 14 foto; sağda £139.990 kartının kenarı | wLaptaRow.png | PC | Sabit | — | — | — |
| 7,0–7,5 | Karta dokunuş | 7,3'te dokunuş halkası; 7,35'te ChatGPT tam ekran görünümü açılmaya başlar | wLaptaRow → dFull_1 | PC (+kick 7,3) | Sabit | — | Tam ekran açılışı 7,35–7,7 (temsilî ölçek) | Dokunuş tıkı |
| 7,5–8,0 | Tam ekran detay | ‹ geri düğmesi, kahraman 1/14 (kancadaki kare), fiyat | dFull_1.png | PC → PDH (540;1180;0,62;2;−4;−1) | Çekilme SOFT 7,7–8,2 | — | — | — |
| 8,0–8,5 | Galeri 'sonraki' | 8,3'te '›' dokunuşu; 8,35'te kahraman '2 / 14' iç mekâna geçer | dFull_1 → dFull_2 | PDH | Oturuş 8,2 | — | Anlık değişim (gerçek galeri davranışı) | Tık |
| 8,5–9,0 | Portal → iç mekân | 8,65'te 2/14 görseli telefon düzleminden kalkar; bilgi alanı yok (ph=h) | Portal (HERO_D → 1584×2112, left −150) | PDH (hareketsiz; portal üstünü örter) | Sabit | — | Portal FLY 8,65–9,65 | Açılış whoosh |
| 9,0–9,5 | Portal | Görsel büyür, telefon örtülür | Portal | PDH (örtülü) | Sabit | — | Portal sürüyor | — |
| 9,5–10,0 | İç mekân tam ekran | 9,65'te çift yükseklikli cam ve perdeler tam ekranda; telefon gizli | Interior EVL-100102_01_l1584.png | yok | Tilt top 0→−120 (9,65–11,65) | '£139.000' 96/800 top 210, giriş 9,75–10,0 | Köşeler kadraja oturur | İç mekân tonu |
| 10,0–10,5 | İç mekân · künye | Tilt pencereden aşağı iner | Interior | yok | Tilt | + 'Lapta · 2+1 · 107 m²' 52/600 top 322 (9,85–10,1) | — | — |
| 10,5–11,0 | İç mekân · künye | Kapı ve deniz kadrajın sol-ortasına gelir | Interior | yok | Tilt | Künye | — | — |
| 11,0–11,5 | İç mekân | Tilt kapıdaki denize yaklaşır | Interior | yok | Tilt | Künye çıkışı 11,4–11,6 | Opaklık | — |
| 11,5–12,0 | Telefon girişi | 11,65'te telefon sağ alttan girer; ekranda tam ekran detay 2/14 (arkadakiyle aynı fotoğraf); zemin hafif kararır | dFull_2.png · Phone onPhoto gölgesi | (900;2500;0,42) → P_IN (740;1300;0,42;3;−8;0) | ENTER 11,65–12,3 | — | Zemin brightness 1→.85 (11,65–12,05) | Giriş swish |
| 12,0–12,5 | Detaya itme | Telefon oturur, ardından bilgi alanına itme | dFull_2.png | P_IN → PD (560;1000;0,70;2;−5;−1) | İtme SOFT 12,3–12,85 | — | — | — |
| 12,5–13,0 | Detay okuma | £139.000 · 2+1 · 2 banyo · 107 m² · Lapta, Girne; özellik çipleri doku olarak | dFull_2.png | PD | Oturuş 12,85 | — | — | — |
| 13,0–13,5 | Kaydırma | 13,2–13,6 yukarı kaydırma; 'Evlek'te tüm ayrıntılar ↗' görünür | dFull_2 → dFull_info.png | PD | Sabit | — | Ekran içi kaydırma 0,25 sn | — |
| 13,5–14,0 | Dokunuş → tarayıcı | 13,75'te dv__out dokunuşu; 13,85–14,25 uygulama içi tarayıcı aşağıdan kayar | dFull_info → WebPage | PD | Sabit | — | iOS modal 0,4 sn; zemin blur 0→24 + lacivert .6 (13,8–14,4) | Tık |
| 14,0–14,5 | evlek.app üstü | Açık tarayıcı başlığı 'evlek.app', Evlek logosu, 'Satılık' havuz fotoğrafı | public/page/page_view.png (iki parça, 1:1) | PD | Sabit 14,2–14,55 | — | — | — |
| 14,5–15,0 | Fiyat bloğuna itme | Kamera fiyat ve başlık bloğuna iner | WebPage | PD → PP (540;650;0,78;2;−4;−1) | İtme SOFT 14,55–15,15 | — | — | — |
| 15,0–15,5 | evlek.app fiyat | '£139.000' · 'Evlek › Satılık › Girne › Lapta › Daire' · 'Lapta'da Deniz Manzaralı 2+1 Daire' | WebPage | PP | Oturuş 15,15 | — | — | — |
| 15,5–16,0 | evlek.app okuma | 'Lapta, Girne · 2 Yatak · 2 Banyo · 107 m² Kapalı' (≈34 px) | WebPage | PP | Sabit | — | — | — |
| 16,0–16,5 | Kesme → Ekle perdesi | 16,2'de Lapta sohbetine kesme, zemin bulanık havuz; 16,45'te ≡ dokunuşu | ChatShell + wLaptaTop · Photo blur 24 | CHAT (540;1050;0,55;2;−4;−1) | Sabit | Yol şeridi 52/600 top 128, giriş 16,2–16,45, aktif 'ChatGPT' | Bulanık zeminler arasında sert kesme | Bölüm vurgusu |
| 16,5–17,0 | Kenar menü | Menü kayar (16,5–16,75): Ara · Yeni sohbet · Eklentiler · Sohbetler (içeriksiz satırlar); hesap ve sohbet adı yok | Sidebar (temsilî) | CHAT | Sabit | Yol şeridi | Kayma 0,25 sn | Tık |
| 17,0–17,5 | Eklentiler | 17,05'te 'Eklentiler' dokunuşu; 17,1–17,4 push: İzinler · Eklentilere göz at · 'Eklenti ara' | PluginsHome (eklenti_9_0 düzeni) | CHAT | Sabit | Yol şeridi, aktif 'Eklentiler' | Push 0,3 sn | Tık |
| 17,5–18,0 | Arama | 17,7'de aramaya dokunuş; 'evlek' yazılır (17,75–17,95, klavye yok); 18,0'de tek sonuç: 'Ev Evlek · Northern Cyprus property data' | PluginsSearch (iskelet yok) | CHAT | Sabit | Yol şeridi | — | Yazım tıkırtısı |
| 18,0–18,5 | Evlek eklenti sayfası | 18,3'te satıra dokunuş; 18,35–18,65 push: degrade soru kartları, açıklama, 'Eklentiyi kur' | EvlekPage (eklenti_28_5 düzeni) | CHAT | Sabit | Yol şeridi, aktif 'Evlek' | Push 0,3 sn | Tık |
| 18,5–19,0 | Düğmeye itme | Kamera 'Eklentiyi kur' ve 'Uygulama › Evlek' satırına iner | EvlekPage | CHAT → PBTN (540;1070;0,60;2;−4;−1) | İtme SOFT 18,7–19,3 | Yol şeridi | — | — |
| 19,0–19,5 | Kur | 19,35'te 'Eklentiyi kur' dokunuşu; dönen gösterge | EvlekPage | PBTN (+kick) | Oturuş 19,3 | Yol şeridi | spin [19,35; 19,7) | Tık |
| 19,5–20,0 | Bağlı ✓ | 19,7'de aynı karede '✓ Bağlı' (56 ekran px) ve 'Sohbette dene' | EvlekPage connected | PBTN | Sabit | Yol şeridi, 'Ekle ✓' | spin[1] = bound = 19,7; geri dönüş yok | Onay 'ding' |
| 20,0–20,5 | Bağlı okuma | Duruş | EvlekPage | PBTN | Sabit | Yol şeridi | — | — |
| 20,5–21,0 | Sohbette dene | 20,9'da dokunuş; 20,95'te yeni sohbete push başlar | EvlekPage → NewChat | PBTN | Sabit | Yol şeridi çıkışı 20,9–21,15 | Push 20,95–21,25 | Tık |
| 21,0–21,5 | Yeni sohbet | Yazım kutusunda 'Ev Evlek' çipi; 21,3–21,7 Girne istemi yazılır (klavye yok) | NewChat (eklenti_31_5 düzeni) | PBTN | Sabit | — | — | — |
| 21,5–22,0 | Gönder → Girne sonucu | 21,75'te gönder, 21,78 balon, 21,9–22,2 'Evlek'te aranıyor…'; 22,2–22,45 gerçek Girne widget'ı | wGirne.png | PBTN (+kick 21,55) | Sabit | — | Sonuç girişi 0,25 sn | Gönder tıkı |
| 22,0–22,5 | Girne sonucu | 'Girne · Satılık · 52 ilan'; ilk kart £75.000 (gerçek ilk durum) | wGirne.png | PBTN | Sabit | — | — | — |
| 22,5–23,0 | Girne sonucu | Duruş | wGirne.png | PBTN | Sabit | — | — | — |
| 23,0–23,5 | Girne → çekilme | Girne tam 22,45–23,45 (1,0 sn), kapanışta telefonda sürer; 23,45'te çekilme başlar | wGirne · Photo | PBTN → CLOSE | Çekilme SOFT 23,45–24,15 | — | Bulanıklık 24→0 (23,45–24,15, tek görüntü) | Müzik açılır |
| 23,5–24,0 | Kapanışa çekilme | Havuz ve deniz netleşir; telefon Girne sonucuyla iner | Photo (pan) · wGirne | → CLOSE (540;1330;0,40;3;−6;−1) | Çekilme; pan 1,5%/sn | — | — | — |
| 24,0–24,5 | Kapanış | Keskin havuz, önde telefon | Photo · Logo | CLOSE | Oturuş 24,15; pan | Logo 24,15–24,4; CTA 'ChatGPT'de / Eklentiler'den / Evlek'i ekleyin.' 72/800 top 330, giriş 24,25–24,5 | Opaklık + 14 px | — |
| 24,5–25,0 | Kapanış | Sabit kompozisyon | V12 kapanış | CLOSE | Pan | CTA + dipnot 30/500 top 610 (24,6–24,85) | Opaklık | — |
| 25,0–25,5 | Kapanış | Sabit | V12 kapanış | CLOSE | Pan | CTA + dipnot | — | — |
| 25,5–26,0 | Kapanış | Sabit | V12 kapanış | CLOSE | Pan | CTA + dipnot | — | — |
| 26,0–26,5 | Kapanış | Sabit | V12 kapanış | CLOSE | Pan | CTA + dipnot | — | — |
| 26,5–27,0 | Kapanış | Sabit | V12 kapanış | CLOSE | Pan | CTA + dipnot | — | — |
| 27,0–27,5 | Kapanış | Sabit | V12 kapanış | CLOSE | Pan | CTA + dipnot | — | — |
| 27,5–28,0 | Kapanış | Sabit | V12 kapanış | CLOSE | Pan | CTA + dipnot | — | — |
| 28,0–28,5 | Kapanış | Sabit | V12 kapanış | CLOSE | Pan | CTA + dipnot | — | — |
| 28,5–29,0 | Kapanış | Sabit | V12 kapanış | CLOSE | Pan | CTA + dipnot | — | Müzik kapanış cümlesi |
| 29,0–29,5 | Döngü hazırlığı | 29,45'te telefon inmeye başlar | V12 kapanış | CLOSE → EXIT (540;2650;0,40;3;−6;−1), FLY 29,45–29,95 | Pan | CTA ve dipnot; logo kalır | FLY çıkış | — |
| 29,5–30,0 | Döngü dikişi | Telefon kadrajdan çıkar; tam ekran keskin havuz; 30,0 = 0. kare (xPct 24) | Photo | yok (29,95'ten itibaren) | Pan → 24 | CTA ve dipnot çıkışı 29,5–29,65; 'artık ChatGPT'de.' girişi 29,7–29,95 | Dikişsiz döngü | Ortam, açılışa bağlanır |

### 15 ve 6 sn sürümleri (`src/v12/Cuts.tsx`)

15 SN (Root.tsx'te V12-15; <Series.Sequence> + <Sequence from={−başlangıç}> kesme listesi; M = yeni master zamanı; tek kodlama kuşağı):
0,00–3,45 ← M 0,00–3,45: kanca, ters portal, detay, logo → çip (3,45 sn)
3,45–5,55 ← M 4,15–6,25: balon yakın planı ve slogan giriş-çıkış; itmeyle eşleşen kesme (2,10 sn; slogan tam opak 1,6 sn)
5,55–7,00 ← M 6,25–7,70: kaydırma, £139.000 kartı, dokunuş, tam ekran açılış (1,45 sn)
7,00–7,45 ← M 8,20–8,65: '›' ve 2/14 (0,45 sn)
7,45–9,85 ← M 8,65–11,05: portal, iç mekân, künye (2,40 sn; künye tam opak ≈1,05 sn)
9,85–10,90 ← M 16,20–17,25: yol şeridi, ≡ › Eklentiler (1,05 sn)
10,90–12,05 ← M 19,25–20,40: Kur › '✓ Bağlı' (1,15 sn; Bağlı 0,70 sn = 42 kare)
12,05–14,45 ← M 27,05–29,45: kapanış (havuz, telefon, logo, CTA, dipnot) (2,40 sn)
14,45–15,00 ← M 29,45–30,00: döngü dikişi (0,55 sn)
Toplam: 3,45+2,10+1,45+0,45+2,40+1,05+1,15+2,40+0,55 = 15,00 sn ✓ (900 kare). Açılış 0. karede ev ve haber. CTA tam opak 2,40 sn; 5 kelime için kural 2,2 sn ✓. Son kare = ilk kare. Bu sürümde evlek.app sayfası ve Girne sonucu yok. Dipnot 2,4 sn, önerilen 4,6 sn'nin altında; platform açıklamasında da verilmesi önerilir.

6 SN (V12-6):
0,00–2,95 ← M 0,00–2,95: havuz + logo + 'artık ChatGPT'de.' → ters portalla ChatGPT'deki Evlek detayı (2,95 sn)
2,95–3,45 ← M 2,95–3,45: soru balonu ve logo → 'Ev Evlek' çipi (0,50 sn)
3,45–6,00 ← M 26,90–29,45: kapanış: logo, CTA, dipnot, Girne sonucunu gösteren telefon (2,55 sn)
Toplam: 2,95+0,50+2,55 = 6,00 sn ✓ (360 kare). Ana mesaj sayısı iki (haber ve CTA); slogan 1,6 sn kuralını karşılayamadığı için bilinçli olarak çıkarıldı. CTA 2,55 sn ✓ (kural 2,2). Dipnot 2,55 sn; açıklama metninde tekrar edilmesi önerilir. Döngü bağlantısı yok; son kare CTA.

**Doğrulama** (`framesOf`, kare tam sayıları):
- **15 sn:** 207 + 126 + 87 + 27 + 144 + 63 + 69 + 144 + 33 = **900 kare = 15,00 sn ✓**
- **6 sn:** 177 + 30 + 153 = **360 kare = 6,00 sn ✓**

Her kesim noktası tam kareye denk geliyor (sn × 60 tam sayı).

## H. Kırmızı takım: 10 risk ve v12'deki durumu

| # | Ciddiyet | Risk | Kontrol önerisi | v12 durumu |
|---|---|---|---|---|
| 1 | engelleyici | Satır içi kartta 1/14'ten 2/14'e galeri kaydırması uydurma bir widget davranışı. Portalın iç mekâna açılması bu davranışa dayanıyor. | Kartta galeri kaydırması olmayacak. Ya kart kapağından (_00) portal açılır, ya da önce karta dokunulup detay widget'ı açılır, detay galerisinde 2/14'e geçilir ve portal oradan açılır. Kabul ölçütü: ekrandaki her etkileşimin live/listing-*.html içinde karşılık gelen bir olay işleyicisi bulunsun (kart: tıklama → detay; detay: önceki/sonraki fotoğraf, dv__out, dv__pri). | Kapatıldı. Kartta galeri yok; 2/14'e tam ekran detaydaki gerçek '›' (dv__next) ile geçiliyor, portal oradan açılıyor. |
| 2 | engelleyici | 'Evlek'te aç ↗' ile ilan sayfası arasındaki bağlantı yanlış. Önerilen yedek (liste düğmesi) ilan sayfasını değil arama sayfasını açıyor. | Detayda 'Evlek'te tüm ayrıntılar ↗' (dv__out) etiketi kullanılsın ve liste yedeği yasaklansın. cap/harness.mjs ile w_detail_100102.json, contactAvailable true ve false için ayrı ayrı render edilsin; birincil düğmenin gerçek etiketi kayda geçsin. Kabul ölçütü: dokunulan düğmenin kaynakta openLink(d.url) çağırdığı ve URL'nin .../lapta-da-deniz-manzarali-2-1-daire-evl-100102 olduğu doğrulansın. | Kapatıldı. Dokunulan düğme dv__out 'Evlek'te tüm ayrıntılar ↗'; yakalamada openLink → ilanın kendi URL'si kaydedildi (manifest). |
| 3 | yüksek | Widget kararı (karma model) yanlış öncüllere dayanıyor. Gerçek piksel seçeneği gereksiz yere eleniyor. | cap düzeneğiyle Lapta sonucu ve EVL-100102 detayı, koyu temada ve DPR 3'te 1179 px genişlikte render edilsin. Onur'a iki seçenek yan yana sunulsun: (1) gerçek widget pikselleri + dış reklam katmanları (ışık, derinlik, portal, kadraj), (2) envanteri kaynak koda kilitli yeniden tasarım. Yazılı karar alınmadan render yapılmasın. Yeniden tasarım seçilirse bileşen ve etiket listesi masaüstü ekran görüntüsünden değil, HTML'deki EVLEK_STRINGS ve render dallarından çıkarılsın. | Kapatıldı. Evlek yüzeyleri gerçek piksel (cap/capture-v12.mjs). |
| 4 | yüksek | Kancanın vardığı widget durumu (karusel £127.000/£139.000'e kaydırılmış) gerçek bir açılış durumu değil. | Ya en az 0,4 sn'lik görünür bir kaydırma (£105.000 → £139.000) eklensin ve £105.000 kartının insan içermeyen kırpımı 1080 px'de kare kare doğrulansın; ya da kartlar ilk durumda (index 0) gösterilip portal detay widget'ından açılsın. Kabul ölçütü: her widget durumuna, gerçek widget'ta ona götüren bir kullanıcı eylemi eşlik etsin. | Kapatıldı. Kanca tam ekran detaya (gerçek durum) iniyor; kart şeridine kaydırma sürerken kesiliyor, şeridin başı hiçbir varlıkta yok. |
| 5 | yüksek | PBTN pozunda telefon gövdesi yol şeridiyle çakışıyor; planın kendi ≥48 px metin–telefon kuralı çiğneniyor. | PBTN y ≥ 1070 olsun (s 0,60'ta üst kenar ≥ 260), ya da şerit kamera PBTN'ye itilmeden (19,35) önce sönsün. QC betiğine her kare için telefonun 8 köşesinin (3B izdüşüm matrisiyle) dış metin kutularına uzaklığı ≥48 px testi eklensin. | Kapatıldı. PBTN (540;1070;0,60): gövde üstü 275, şerit altı ≈200 → 75 px. |
| 6 | yüksek | page_view.png 1:1 yerleşimde sahte görünüyor: yapışkan alt çubuk ekranın ortasında kalıyor, altında 345 px boşluk oluşuyor. | Png iki parçaya bölünsün (kırpım serbest): içerik 0–1765 aralığı top 270'e, alt çubuk 1765–1941 aralığı ekran tabanına (2380–2556) yerleşsin. Aradaki boşluk sayfanın gerçek zemin rengiyle (#EEF2F7 civarı, png'den örneklenecek) dolsun ya da sayfanın bir sonraki gerçek yakalama bölümü kullanılsın. Kabul ölçütü: PP pozunda '107 m² Kapalı' metni ≥28 px çıktı boyutunda (beklenen ≈34 px) ve 1,0 sn okunur; ekranda boş bant yok. | Kapatıldı. page_view iki parça: içerik 270–2035, yapışkan çubuk 2131–2307, altında markasız tarayıcı araç çubuğu. |
| 7 | yüksek | 15 sn sürüm 'Bağlı ✓' karesini hiç göstermiyor; kısa sürümlerde slogan kalış süresi yetersiz. | 15 sn için 9,5–11,1 ← M 18,9–20,5 yapılsın (Bağlı ≥0,7 sn). Kısa sürümler için slogan çıkışı ayrı bir 'kısa' anahtarla yeniden zamanlansın. QC'ye her kesim listesi için 'Bağlı' kare sayısı ≥42 (0,7 sn) ve her ana yazı için tam opak süre ≥ kural testi eklensin. | Kapatıldı (kâğıt üstünde). V12-15 kesimi 19,25–20,40'ı içeriyor: 'Bağlı' 0,70 sn. Kısa sürümler render edilmedi. |
| 8 | orta | Detay okuma pozu planın kendi okunurluk kuralını karşılamıyor; özellik sayısı da kayıtla tam eşleşmiyor. | Çipler ya PC/PP ölçeğinde (s ≥0,78) okutulsun ya da açıkça 'doku' sayılıp anlatı yükünden çıkarılsın. Özellik listesinin kaynağı (_meta 6 / structuredContent 5) tek bir yerde sabitlensin ve QC o kaynağa göre karşılaştırsın. Arayüz içinde '107 m²' tür eklenmeden kalabilir. 'Kapalı' ibaresi gerçek sayfa ve widget'la tutarlı olduğu için açık soru 5 kapatılsın. | Kısmen. PD (s 0,70) gerçek widget metnini çıktıda ≈29–34 px veriyor. Özellikler gerçek widget'ın kendi listesi (Teras dahil 6), pikselden geliyor. |
| 9 | orta | Bağlayıcı müşteri kararları değiştiriliyor ya da atlanıyor, ama üretim onaydan önce planlanıyor. | Tek sayfalık bir karar kaydı hazırlansın: her sapma için HANDOFF maddesi, öneri ve gerekçe; Girne 1,5 sn maddesi de açık soru olarak eklensin. Onur'un yazılı onayı gelmeden src/v12 render'ı yayın adayı sayılmasın. Kanca için A/B (d) ve HANDOFF cümlesi ayrı kompozisyonlarda tutulsun. | Açık. Widget, kanca, telefonsuz planlar, karşılaştırma ve Girne yorumu Onur'un onayına bağlı (sorular 1–5). |
| 10 | orta | Kabul ölçütleri kendi içinde çelişkili ya da ölçülemez. Koordinat payları 3B dönüş hesaba katılmadan verilmiş. Döngü dikişi iki farklı bileşene bağlı. | (a) Ölçüt 'tam ekran katmanda iki farklı fotoğrafın çapraz geçişi = 0' olarak yeniden yazılsın. (b) Bit hızı ölçütü kaldırılıp yerine kare farkı ve siyah alan ölçümü konsun. (c) Ölçüt yalnız 0–3,0 ve 23,6–30,0 için tanımlansın. (d) Pay, CSS 3D matrisinden (perspektif 3200) köşe izdüşümüyle hesaplansın; P_IN x ≤740 ya da rz 0 olsun. (e) Kanca ve kapanış aynı Photo bileşenini ve aynı GRADE_EXT değerini kullansın; 1799 ve 0. karelerin SSIM'i render sonrası ölçülsün. | Kısmen. Kanca ve kapanış tek Exterior bileşeni; paylar 3B izdüşümle ölçüldü. Döngü SSIM 0,985 (hedef 0,99). |

## I. Uygulama (Remotion)

**Dosyalar** (hepsi `evlek-chatgpt/` içinde; `src/v10` ve `src/v11` değişmedi)

| Dosya | Ne |
|---|---|
| `cap/harness-v12.mjs` | `harness.mjs`'in kopyası. Farkları: `get_listing` isteğine gerçek detay kaydını döndürür, ofis ve kişi alanlarını `null`'a çeker, sabit Chromium yolu kullanır. |
| `cap/capture-v12.mjs` + `cap/compose-v12.py` | Gerçek widget'ı 393 pt × DPR 3 ile yakalar. Lapta satır içi sonucunu (üst, kart şeridi, alt), tam ekran detayı (1/14, 2/14, sabit alt çubuk) ve Girne sonucunu çıkarır. `manifest.json`'a sha256 ve DOM ölçülerini yazar. `dv__out` → `https://evlek.app/tr/satilik/girne/lapta-da-deniz-manzarali-2-1-daire-evl-100102` doğrulandı. |
| `public/v12/w/*.png` | Gerçek widget pikselleri (yeni dosyalar; onaylı varlıkların üstüne yazılmadı) |
| `public/v12/EVL-100102_00_l2560.png`, `_01_l1584.png` | Lanczos ile önceden ölçeklenmiş fotoğraflar (1,60× / 1,32×, keskinleştirme yok) |
| `src/v12/Phone.tsx` | Markasız gövde (Ø44 delik kamera, BR 128, tek tonlu grafit, sol tuş yok, saat 10:24), temas gölgesi, `projectOut` / `bodyBox` (CSS zinciriyle aynı 3B izdüşüm) |
| `src/v12/Screen.tsx` | ChatGPT kabuğu (temsilî), gerçek-piksel Evlek yüzeyleri, iOS push / modal / genişleme, saf `stateAt(t)` |
| `src/v12/V12.tsx` | Pozlar, iki portal (analitik görüntü ve kırpım dikdörtgeni), aynalı dolgulu bulanıklık, dış metin, yol şeridi, imza hareketi |
| `src/v12/Cuts.tsx` | `V12-15` ve `V12-6` kesim kompozisyonları |
| `scripts/v12-stills.mjs` | Kritik kare still'leri |

**Kontrol turları**

1. **Still turu 1** (20 kare)
   - Çalışan: hook, portal, sonuç, kart, detay, iç mekân, evlek.app.
   - Düzeltme: iç mekân künyesinin kontrastı düşüktü; degrade .82 / .62'ye koyulaştırıldı.
2. **Still turu 2** (30 kare: geçiş kenarları 2,49/2,50, 8,64/8,66, 9,64/9,66 ve Eklentiler yolu)
   - Düzeltme: kapanış dipnotu açık gökyüzünde okunmuyordu; kanca ve kapanış degradesi .74 / .58'e koyulaştırıldı, dipnot tam krem yapıldı. Kanca ile kapanış aynı değeri kullanıyor, dikiş korunuyor.
   - Kahraman inişi: 2,49 → 2,50'de piksel kayması yok.
   - Logo → çip inişi: ±3 px.
3. **Tam render**, ardından tam film QC: 6 fps tarama, 2 fps 360×640 ızgara, kare farkı, SSIM, blackdetect.
   - Düzeltme gerektiren hata bulunmadı. Bulunan zayıflıklar puan kartında ve "Plandan sapmalar"da.
4. **Renk etiketi**
   - Remotion transfer'i `iec61966-2-1` (sRGB) yazdı.
   - Yeniden kodlama olmadan (`-c copy -bsf:v h264_metadata=transfer_characteristics=1`) bt709'a çevrildi.
   - Kod çözülmüş kareler değişmedi: MD5 `ded7cc0c…` iki dosyada da aynı.

**Yeniden üretim**

1. ```bash
   cd evlek-chatgpt/cap && node capture-v12.mjs && python3 compose-v12.py
   ```
   Yalnız varlıkları yenilemek için. Ağ gerekir (evlek.app harita ve görselleri).
2. ```bash
   npx remotion render src/index.ts V12-916 out/v12.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png --x264-preset=slow --concurrency=4 --muted
   ```
3. ```bash
   ffmpeg -i out/v12.mp4 -c copy -bsf:v h264_metadata=transfer_characteristics=1 -movflags +faststart out/evlek_chatgpt_v12_1080x1920_60fps.mp4
   ```
4. 15 ve 6 sn sürümleri: aynı komut, `V12-15` / `V12-6`. Bu turda render edilmedi.

## Final kabul kapısı (10 soru)

| # | Soru | Cevap | Kanıt |
|---|---|---|---|
| 1 | İlk karede konu ve odak anlaşılıyor mu? | **Evet** | 0. kare: keskin havuz ve deniz, logo ve "artık ChatGPT'de."; 360×640'ta okunuyor. |
| 2 | İlk üç saniyede izlemeye devam etmek için somut neden var mı? | **Evet** | 1,5–2,5'te fotoğraf telefondaki gerçek ilana iniyor (£139.000, 1/14). 2,95–3,45'te logo sorudaki Evlek çipine iniyor. |
| 3 | Evlek'in ChatGPT içinde kullanıldığı sessiz izlerken anlaşılıyor mu? | **Evet** | Soru balonundaki Evlek çipi → "Evlek · 8 ilan" → gerçek widget. Eklentiler'de "ChatGPT › Eklentiler › Evlek › Ekle". |
| 4 | Eylemler ve sonuçları aynı ilanda doğru bağlanıyor mu? | **Evet** | Kart dokunuşu → aynı ilanın tam ekran detayı (kanca karesiyle aynı). "›" → 2/14 → aynı iç mekân. `dv__out` → aynı ilanın evlek.app sayfası; URL kaynakta doğrulandı. |
| 5 | Büyük fotoğraflar mülkü doğru temsil ediyor mu? | **Evet** | Yalnız EVL-100102 _00 ve _01. Fiyat, alan ve konum künyesi kayıtla aynı; alan türü yazılmadı. |
| 6 | Telefon geçişler dahil tanınabilir kalıyor mu? | **Kısmen** | Fotoğraf ve bulanık planlarda evet. Yakın planlarda (6,25–7,7 ve 14,55–16,2) gövde bilinçli kırpılıyor. 0–1,5 ve 9,65–11,65'te telefon yok. |
| 7 | Tablo okunabiliyor ve doğru yorumlanabiliyor mu? | **Uygulanamaz** | Karşılaştırma ve tablo çıkarıldı (kurul D4). |
| 8 | Son çağrı Eklentiler üzerinden eklemeyi açıkça anlatıyor mu? | **Evet** (iOS yolu doğrulanmadı) | 16,2–21,15 yol şeridi ve adımlar; CTA 5,0 sn. Kenar menüdeki "Eklentiler" girişi Onur'un kaydında yok (soru 6). |
| 9 | Mobil önizlemede kritik metinler okunuyor mu? | **Kısmen** | Ana mesajlar, künye, fiyatlar, yol şeridi ve "Bağlı" okunuyor. Dipnot 360×640'ta ≈10 px. |
| 10 | Sonuç seçilen fikirle tutarlı mı? | **Evet** | Ev → ChatGPT'deki gerçek Evlek → ev; ilk ve son kare aynı (SSIM 0,985). |

## Plandan sapmalar (dürüst liste)

1. **Soru metni.** Plan "…2+1 daireleri ucuzdan pahalıya göster" önermişti. v11'de kullanılan "Lapta'da £160 bin altı, deniz manzaralı 2+1 daire" kaldı. Filtreler `w_lapta.json` ile birebir; sıralama zaten `price-low`.
2. **Soru planı pozu.** PB (506; 1750; 0,85), plandaki nominal (432; 1700) yerine formülden hesaplandı. Amaç, kart şeridini kadraj dışında tutmak.
3. **Kenar menü.** Plandaki "Zamanlananlar, Kitaplık, Keşfet" gerçek kayıtta yok; uydurmamak için yalnız Ara, Yeni sohbet, Eklentiler ve içeriksiz sohbet satırları çizildi.
4. **Girne zamanlaması.** Yeni sohbette istem 0,4 sn'de yazılıyor (21,3–21,7), gönder 21,75, sonuç 22,2. Girne tek başına 1,0 sn tam görünüyor (plan 1,5); kapanış boyunca telefon ekranında sürüyor (toplam ≈7 sn).
5. **Tam ekran detaydaki mini harita.** Bu ev sahibinde "Konum" bölümündeki mini harita kahramanın üstüne taşıyordu. Yakalamada kaldırıldı; widget'ın kendi hata dalı da aynı şeyi yapar (`mini.remove()`). Gerçek ChatGPT'de mini harita görünür olabilir.
6. **Dipnot metni.** "ChatGPT arayüzü temsilîdir; Evlek ekranları ve ilan verileri gerçektir. ChatGPT, OpenAI'ın ticari markasıdır." Artık Evlek ekranları gerçek piksel olduğu için plandaki "Arayüz temsilidir" ifadesi daraltıldı.
7. **Degradeler** plandakinden koyu: kanca ve kapanış .74 → .58, iç mekân .82 → .62. Okunurluk için.
8. **Otomatik QC betiği** (`scripts/qc-v12.mjs`, plan 12) yazılmadı. Aynı denetimler bu turda elle yapıldı: durum fonksiyonu, 3B geometri payları, ffprobe, SSIM, blackdetect, kare farkı, 360×640. Sonraki sürüm için borç.
9. **Tam örtülü karelerde bulanık zemin yine çiziliyor** (plan 11: "çizilmez"). Yalnız render süresini etkiliyor.
10. **Hareket bulanıklığı yok** (plan da ilk finalde istemedi).
11. **15 ve 6 sn sürümleri** kompozisyon olarak hazır, render edilmedi.
12. **Render, Onur'un yazılı onayından önce alındı.** Kurul "onay gelmeden yayın adayı sayılmaz" diyor. Bu dosya onay için hazırlanmış finaldir.
13. **GitHub pre-release oluşturulamadı.** `gh` bu oturumda oturum açmamış; GitHub MCP'de release aracı yok. MP4 sohbete dosya olarak gönderildi.

## Onur'a sorular (yayın öncesi)

1. **Widget.** Evlek yüzeyleri gerçek piksel olarak kaldı (sonuçlar, tam ekran detay, evlek.app); HANDOFF karar 2'deki "daha seksi yeniden tasarım" yerine reklam katmanları (kadraj, ışık, portal) kullanıldı. Kabul mü?
2. **Kanca.** "Bir sabahın böyle başlasa?" yerine "Evlek artık ChatGPT'de." haberi ve görsel arzu kullanıldı. Kabul mü?
3. **Telefonsuz planlar.** İki telefonsuz tam ekran plan var (0–1,5 ve 9,65–11,65). "Telefon her an telefon olmalı" kuralıyla uyumlu mu?
4. **Karşılaştırma.** Filmden tamamen çıkarıldı. Onay?
5. **Girne sonucu.** HANDOFF karar 5 ("Girne sonucu 1,5 sn") kurulumdan sonraki ilk deneme olarak gerçek Girne araması (52 ilan) ile karşılandı. Kastedilen bu mu?
6. **iOS'ta Eklentiler girişi.** ChatGPT iOS'ta Eklentiler'e giriş tam olarak nereden? Filmde kenar menüde bir "Eklentiler" satırı var; kayıtta bu adım yok. Yayın öncesi doğrulanmalı.
7. **Örnek istemler.** Evlek eklenti sayfasındaki örnek istemler gerçekte İngilizce ve öyle kaldı. Uygun mu?
8. **Kaynak fotoğraf.** EVL-100102_00 ve _01'in 1600 px'ten büyük orijinali var mı? Varsa havuz ve salon keskinleşir.
9. **Cihaz.** Markasız telefon (delik kamera, 10:24, tek tonlu grafit, sol tuş yok) yeterli mi, hukuki kontrol gerekir mi?
10. **Canlı doğrulama.** Fiyatlar ve sayılar 14 Kasım MCP kaydından: Lapta 8 ilan, £105–147 bin; Girne 52 ilan; EVL-100102 £139.000, 107 m². Yayından önce canlıdan yeniden doğrulanmalı.
11. **Dal.** Çalışma `video/evlek-chatgpt-v10` dalında sürüyor. CLAUDE.md'deki "her video için ayrı dal" kuralı için `video/evlek-chatgpt-v12` dalı açılsın mı?
