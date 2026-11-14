> **Güncelleme (13 Kas, v6):** Bağlayıcı akış `01-STORYBOARD-2FPS.md`, görsel dil `05-GORSEL-DIL.md`. Bu tretmandaki bölüm listesi, yapay zekâ görüntüsü ve dipnot kararları geçersiz; ses ve kalite ilkeleri geçerli.

# VIDEO-1 v4 · Tretman · "Evlek artık ChatGPT'de"

**Durum:** Taslak 24 saniyelik video (v3) "basit, çekmiyor" diye geri döndü. Bu belge yeni yönü tarif eder. Onur onaylamadan üretime geçilmez.

## 1. Kurul

**Koltuklar:**

- Kreatif direktör (emlak ve teknoloji reklamları)
- Hareket tasarımcısı (arayüz filmi, Apple ürün videosu dili)
- Ürün uzmanı (Evlek MCP'nin gerçekte neler yaptığı)
- Sosyal medya performans uzmanı
- Ses tasarımcısı ve müzik sorumlusu
- Marka ve hukuk
- Kırmızı takım

**v3'ün asıl sorunları:**

1. **Tek bir numara var.** Sor, kartlar gelsin, bitsin. Evlek'in yeteneklerinin yalnız %20'si görünüyor.
2. **Hareketlerin sebebi yok.** Kamera kendi kendine geziyor. İyi arayüz filminde her hareketin bir nedeni var: dokunuş, seçim, sıralama.
3. **Görünüm sıradan.** Açık temalı, beyaz bir telefon. Onur'un gerçek ekranları koyu temalı ve çok daha premium duruyor.
4. **"Vay" anı yok.** Ekranın dışına taşan, durup izleten bir an yok.

**Kararlar:**

- **Konsept:** "Evinizi tarif edin. Gerisini Evlek yapsın." Tek bir sohbet içinde art arda 8 yetenek.
- **Görsel dil:** Koyu tema (gerçek ChatGPT ekranlarıyla aynı).
- **İmza hareket:** Arayüz öğeleri telefondan dışarı, 3B boşluğa çıkar ve geri yerleşir. Kelimeler çipe, çipler filtreye, kartlar sıraya dönüşür.
- **Kural:** Hareket her zaman bir sebebe bağlı (yazı, dokunuş, seçim). Sebepsiz kamera turu yok.
- **Süreler:** 30 saniyelik ana video, 15 saniyelik kısa kesim, 6 saniyelik bumper.

## 2. Gösterilecek yetenekler (hepsi 13 Kasım 2026'da canlı MCP'de doğrulandı)

| # | Yetenek | Kanıt |
|---|---|---|
| 1 | Doğal cümleden filtre: şehir, işlem, oda, fiyat, özellik | Girne, 2+1, ≤ £200k → 169 ilan |
| 2 | Özellik filtresi | Deniz manzarası → 67 ilan |
| 3 | Harita, semt düzeyinde fiyat etiketleri, "Haritada tümü" | Onur'un ekran görüntüsü |
| 4 | Sıralama: ucuzdan pahalıya, m² fiyatı, alan | price-low: £75.000 Arapköy, £79.000 Esentepe… |
| 5 | İlan detayı, fotoğraf galerisi, "18 foto" | get_listing |
| 6 | Yan yana karşılaştırma | compare_listings, EVL-100086 ile EVL-101431 |
| 7 | Döviz: GBP, EUR, USD, TRY, güncel kur | £155.000 = €185.411 = $205.468 |
| 8 | Kiralık ve aylık fiyat, "Eşyalı" | Girne Merkez, eşyalı 2+1, ≤ £800/ay → 9 ilan |
| 9 | 5 dil (TR, EN, RU, DE, AR) | locale parametresi |
| 10 | evlek.app'ten ofise yazma | Canlı ilan sayfasında "WhatsApp'tan yaz" ve "Ara" var |

**Elenenler:**

- Üniversiteye yakınlık: Girne'de veri yok, yalnız 1 ilan var.
- Fiyat endeksi: veri olgun değil.

## 3. Kurgu (30 sn, 9:16, 60 fps master, 124 BPM)

| Sn | Bölüm | Ekranda | İmza hareket | Başlık (TR) |
|---|---|---|---|---|
| 0–2,5 | **Hook** | Siyah zemine dev beyaz harflerle bir cümle yazılır: "Girne'de, deniz manzaralı, 2+1, 200 bin altı." | Cümle küçülerek telefonun giriş kutusuna uçar ve telefon kareye girer | — |
| 2,5–6 | **Cümle → filtre** | Gönder. Cümledeki ifadeler tek tek parlar ve telefondan dışarı fırlayıp çipe dönüşür: Girne, Satılık, 2+1, ≤ £200.000, Deniz manzarası | Her çip vuruşta "tık" diye yerine oturur | Cümleniz filtreye dönüşür. |
| 6–9,5 | **Harita** | Widget'ın haritası 3B eğik düzlemde büyür. Girne kıyısında semt fiyat etiketleri (£75K Arapköy, £155K Alsancak…) dalga dalga belirir | Kamera haritanın üstünden süzülür. "Haritada tümü"ne dokunuş | Haritada görün. |
| 9,5–12,5 | **Sıralama** | "Ucuzdan pahalıya" çipine dokunuş. Kartlar fiziksel olarak yer değiştirip fiyata göre dizilir | Kartlar havalanır, yer değiştirir, iner (FLIP). Gölgeler derinlik verir | İstediğiniz gibi sıralayın. |
| 12,5–15,5 | **İlan** | Bir karta dokunuş. Kart telefondan büyüyüp tam ekran galeriye dönüşür; 3 fotoğraf vuruşta kayar; "18 foto"; satırlar: 2+1 · 2 banyo · Havuz · Alsancak | Eşleşen kesme ve hafif parallax | — |
| 15,5–18,5 | **Karşılaştır** | "Bu ikisini karşılaştır." İki kart ikiye ayrılıp yan yana dizilir, satırlar hizalanır, farklar vurgulanır | Satırlar soldan sağa çizgiyle bağlanır | Yan yana karşılaştırın. |
| 18,5–20,5 | **Döviz** | "Euro göster." Bütün fiyatlar aynı anda £'dan €'ya döner | Mekanik ekran gibi tek seferde döner; ara rakam görünmez | Euro, dolar, lira. |
| 20,5–23 | **Kiralık** | Satılık/Kiralık anahtarı Kiralık'a kayar. Fiyatlar "/ay" olur, "Eşyalı" çipi gelir, kartlar değişir | Anahtar kayınca kartlar sırayla yeniden dolar | Kiralık da var. |
| 23–25 | **5 dil** | Giriş kutusundaki soru hızla dile dile değişir: TR → EN → RU → DE → AR (sağdan sola) | Harfler bulanıklaşıp yeni dile dönüşür | Beş dilde. |
| 25–28 | **Ofise yaz** | "Evlek'te aç" → evlek.app ilan sayfası alttan gelir → "WhatsApp'tan yaz"a dokunuş → "Ofise bağlanılıyor" | Düğme basılınca hafif titreşim halkası | Ofise tek dokunuşla yazın. |
| 28–30 | **Kapanış** | Koyu zemin, ilan fotoğrafından ışık, büyük Evlek logosu, "artık ChatGPT'de.", mercan çizgi, "ChatGPT'de Eklentiler'de Evlek'i arayın.", evlek.app. Dipnot: "Arayüz temsilidir; ilanlar ve fiyatlar gerçektir. ChatGPT, OpenAI'ın ticari markasıdır." | Logo hafif ışık süpürmesiyle | — |

**15 sn kısa kesim:** Hook → Cümle→filtre → Sıralama → İlan → Ofise yaz → Kapanış.

**6 sn bumper:** Cümle → çipler → "Evlek artık ChatGPT'de."

## 4. Görsel dil ("AI slop" olmayacak)

**Yapılacaklar:**

- Gerçek ChatGPT koyu temasına yakın, sade bir sohbet ekranı. Logo yok; "ChatGPT'ye sor" gibi gerçek metinler birebir kopyalanmaz.
- Evlek widget'ı bugünkünden şık ama aynı yapıda: harita, çipler, kart, "Haritada tümü", "Evlek'te aç". Böylece ürüne bakan kişi aynı şeyi tanır.
- **Zemin:** Çok koyu lacivert (#0A2540'dan siyaha). İlan fotoğraflarından gelen çok bulanık sıcak ışık zeminde yavaşça kayar. Bütün renk fotoğraflardan gelir.
- **Tipografi:** Inter. Başlık en fazla 4 kelime, kelime kelime gelir, beyaz. Kalın ve büyük ama ekranın üçte birini geçmez.
- **Derinlik:** Telefon 3B'de. Dışarı çıkan öğeler gerçek gölge düşürür. Hızlı hareketlerde hareket bulanıklığı.
- **Hareket fiziği:**
  - Yaylar: sönüm 16–20, en fazla %4 aşma.
  - Gecikmeler 2–3 kare.
  - Kesmeler ölçü başında.

**Yapılmayacaklar:**

- Neon parıltı, rastgele parçacık, sebepsiz 3B dönüş.
- Yapay zekâyla üretilmiş görsel.
- Sayaç.
- Emoji.
- Mercan birden fazla yerde.

## 5. Ses

- **Müzik:** Lisanslı kütüphaneden (Epidemic Sound ya da Artlist). 122–126 BPM, modern elektronik pop, temiz bas, sözsüz.
  - İlk 2,5 sn gerilim kurar, 2,5'te çipler patlarken açılır.
  - 12,5'te (ilan galerisi) kısa nefes, 25'te son yükseliş, 28'de tek vuruşla biter.
- **Efektler:** Her biri hareketin sesi.
  - Klavye: net, hafif "pıtır pıtır".
  - Çip: "tık" (her biri bir ton yukarı).
  - Harita etiketleri: yumuşak, tonlu "pop" dizisi.
  - Kart sıralama: kâğıt "fış" ve tık.
  - Döviz: mekanik "tak".
  - Anahtar: "klik".
  - WhatsApp düğmesi: tok "tık" (WhatsApp'ın kendi sesi kullanılmaz).
- **Mastering:** −14 LUFS, −1 dBTP. Video sessiz izlenince de anlaşılır.

## 6. Kırmızı takım

| Risk | Önlem |
|---|---|
| 8 yetenek 30 saniyeye çok gelir, okunmaz | Her bölüm tek fikir, başlık en fazla 4 kelime, arayüz yazısı büyük. 15 sn kesimde 5 bölüm. |
| Koyu ChatGPT benzeri ekran taklit sayılır | Logo yok, gerçek metinler kopyalanmaz, Evlek her karede baskın, dipnot var. |
| Gösterilen özellik ChatGPT'de tam böyle çalışmıyor | Her bölümün karşılığı gerçek bir MCP aracı (bölüm 2). Görünüm güzelleşir, yetenek uydurulmaz. |
| Fiyatlar değişir ya da ilanlar satılır | Yayından 1 gün önce bütün ilanlar yeniden kontrol edilir. |
| Fotoğraflar 640 px | Tam ekran yalnız [ofis] ilanlarıyla; diğerleri kart boyunda. |
| Ofis izni | [ofis], [ofis] ve [ofis]'a yayından önce haber. |

## 7. Üretim

1. **Cowork:** Bu tretmanla 4 stil karesi üretir: Hook, Cümle→filtre, Sıralama, Karşılaştır. Onur onaylar.
2. **Cowork:** 30 sn ana videoyu kurar (Remotion, gerçek veri, efektli taslak).
3. **Code:** Lisanslı müzik, ses tasarımı, EN sürüm, 4:5, 15 sn ve 6 sn kesimler, 60 fps final.
