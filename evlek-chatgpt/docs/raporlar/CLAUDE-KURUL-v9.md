# Evlek VIDEO-1 · Claude kurul raporu (v9 incelemesi)

14 Kasım 2026. Videoyu 5 uzman ayrı ayrı izledi; her biri kareleri ffmpeg ile çıkarıp kodu (`Master.tsx`) okudu:
- reklam filmi yönetmeni
- lüks emlak sanat yönetmeni
- hareket ve arayüz tasarımcısı
- algı ve marka stratejisti
- sosyal medya büyüme uzmanı

Bu rapor, ChatGPT raporuyla birleştirilmeden önceki Claude tarafıdır. Hiçbir dosya değişmedi.

## 1. Ortak teşhis (5 uzmanın en az 3'ü aynı şeyi söylüyor)

| # | Sorun | Saniye | Kaç uzman |
|---|---|---|---|
| 1 | **Kanca hemen ölüyor.** Manzara ve soru iyi, ama 1,25 sn'de siyah ekran ve klavye geliyor. İlk büyük kayıp 1,5–2,5 sn. | 1,2–2,75 | 5/5 |
| 2 | **Sorunun cevabı 10 sn gecikiyor.** "Bu manzarada ne kadar?" diye soruyoruz, önce Girne'de £75.000'lik başka bir ev geliyor. £139.000 ancak 11,5–12 sn'de. Merak köprüsü kopuyor. | 3,5–12 | 4/5 |
| 3 | **Üç kez klavye ve yazma sahnesi.** Aynı kalıp üç kez tekrarlanıyor (sorgu → bekleme → harita/kart); yeni duygu yok. | 1,7 / 6,5 / 14,5 | 5/5 |
| 4 | **Tablo bölümü ölü.** Videonun en uzun planı, 4,7 sn düz siyah. Beyaz fiyat çerçeveleri hata ayıklama işaretine benziyor. | 16,7–21,4 | 5/5 |
| 5 | **Ekran planları hâlâ "ekran kaydı".** Telefon tam cepheden ve 0° açıda; gövde yalnız çerçeve gibi okunuyor. | 2,75–10 / 16,7–25 | 3/5 |
| 6 | **Karşılaştırma kartları çok kısa.** Güçlü bir yorum tetikleyicisi, ama 1,1 sn'de kayboluyor. | 15,6–16,7 | 4/5 |
| 7 | **CTA okunmuyor.** Telefon boyutunda çipler yaklaşık 10 px, "Ekle" 8 px, dipnot 7 px. Ekranda kalış süresi 0,7–1,5 sn; okumak için 3 sn ve üstü gerekiyor. | 28,5–30 | 3/5 |
| 8 | **Döngü yok, marka geç geliyor.** Evlek adı ilk kez 27 sn'de büyük görünüyor. Son kare ilk kareye bağlanmıyor. | 0–3 / 27–30 | 3/5 |

**Teknik hatalar (doğrulandı):**
- **Telefon kalınlığı ölçeklenmiyor.** `scale(s)` yalnız X ve Y'yi ölçekliyor, Z'yi değil. Telefon yaklaştıkça incelip "kâğıtlaşıyor".
- **Logo ek yeri.** Kapanış logosunda E'nin solunda ve v/k'de path ek yeri çizgileri var.
- **Kart çıkışında hayalet.** 10,3 sn'de kart yarı saydam görünüyor. Başlangıç noktası, kartın ekrandaki gerçek yeriyle eşleşmiyor.
- **Kapanışta çakışma.** 26,9 sn'de logo, inen telefonla çakışıyor.

## 2. Puanlar (ortalama, 10 üzerinden)

| Ölçüt | Puan | En düşük veren |
|---|---|---|
| Kanca | 6 | Yönetmen 5 |
| İlan arzusu | 6 | Emlak AD 5 |
| Telefon gerçekliği | 5,5 | Hareket 5 |
| Görsel zenginlik | 4,8 | Emlak AD 4,5 |
| Tempo / tutma | 4 | Sosyal 4 |
| Ürünün seksiliği | 4 | Yönetmen, Hareket |
| CTA / kapanış | 4 | Algı 3 |

**Genel: yaklaşık 5/10, "dünya standardı" değil.** Sosyal uzmanın tahmini izlenme eğrisi: 3 sn'de %55, 10 sn'de %25, 30 sn'de %6–8.

## 3. Uzmanların ayrıştığı yerler ve kararım

| Konu | Görüşler | Karar |
|---|---|---|
| Girne bölümü | Sosyal: tamamen kes, doğrudan Lapta'ya geç. Yönetmen: 2,5 sn'ye sıkıştır. | **Sıkıştır (1,5 sn).** Gerçek oturumda ilk soru Girne. Kanca ise Lapta'daki evi soruyor. Girne'yi atlamak sorgu–sonuç akışının doğruluğunu bozar. |
| Sorgu yazımı | Yönetmen: sorgu telefonun dışında büyük yazıyla yazılsın, sonra balona uçsun. Algı: altyazı girerken telefon dursun. | **Yönetmenin önerisi.** Klavyeler gider; "söylemek kadar kolay" hissi gelir. |
| Cevap ne zaman | Sosyal: £139.000 4–5 sn'ye çekilsin. Yönetmen: 11,5 sn'de tek damga. | **Orta yol: ~8,5 sn'de doruk.** Ürün sırası korunur (Girne → Lapta → kart), ama 2 sn yerine 0,2 sn bekleme. |
| Karşılaştırma kartları | Yönetmen: yeniden çizilmiş kartlar kural riski taşıyor. | **Onur kararı.** Ya gerçek widget kart kırpımlarından kurulur ya da "reklam katmanı" olarak onaylanır. Veriler zaten gerçek. |
| Dipnot | Algı: 28 px, %70 opaklık. Diğerleri değinmedi. | **Algının önerisi.** Yasal dipnot okunmalı. |

## 4. Önerilen v10 planı (öncelik sırasıyla)

| # | Değişiklik | Kaynak | Etki / emek |
|---|---|---|---|
| 1 | **Fiyat tahmin kancası.** Tam ekran ve derecelendirilmiş havuz fotoğrafı. Üstte "Bu manzarada bir ev ne kadar?" ve altında "Tahminini yaz 👇". Telefon 0,6 sn'de alttan, eğik ve dolu ekranla girer; siyah ekran hiç görünmez. Evlek logosu küçük olarak ilk 2 sn'de görünür. | Yönetmen, Sosyal, Algı | Çok yüksek / orta |
| 2 | **Klavyeler gider.** Sorgu telefonun dışında 64 px Inter ile yazılır, sonra balona uçar (350 ms). "Düşünüyor" 0,15 sn'ye iner. | Yönetmen | Yüksek / az |
| 3 | **Doruk: kart çıkışı ve galeri montajı (~8,5–11,5 sn).** Kart telefon 3D ağacının içinden, gerçek yerinden kalkar; opaklık kullanılmaz. Fotoğraf tam ekrana büyür. Ardından 3 iç/dış fotoğraf gelir (`_00`, `_01`/`_04` dikey, `_03`), her biri 0,4 sn. Sonra £139.000 damgası: 124 px, 800 ağırlık. | Yönetmen, Emlak AD, Hareket | Çok yüksek / orta |
| 4 | **Fotoğraf derecelendirmesi.** Emlak AD reçetesi: dış çekim altın saat, iç çekimde yeşil kayma düzeltmesi, vinyet, arka planda 12 px bulanıklık. Yatak odası fotoğrafları (`_06`, `_07`) kullanılmaz. `101433_00` en çok 700 px gösterilir ve keskinleştirilir. | Emlak AD | Yüksek / az |
| 5 | **Karşılaştırma ve tablo yeniden kurulur (~3,5 sn).** "A mı B mi?" kartları 2 sn kalır. Fiyatlar tablo başlıklarına uçar. Tablo eğik ve alçak açıdan; satırlar 3D'de kalkar. "Fiyat farkı £12.000 (%9,4)" ekrandan çıkıp kahraman kare olur. Beyaz çerçeveler silinir. | Hareket, Yönetmen, Sosyal | Yüksek / orta |
| 6 | **Telefon malzemesi.** `scale3d` ile doğru kalınlık (~150 px tasarım). Kenar gradyanı ve ışığa göre kayan parlama. Yan tuşlar yan yüzde. Üç katman gölge: temas, yayılım, ortam. Ekran planlarında da 4–6° canlı poz ve 0,8 ölçek tavanı. | Hareket | Yüksek / orta |
| 7 | **Kesme yerine hız rampası.** 280 ms itme ve yalnız bu pencerelerde hareket bulanıklığı. Gönder tuşundan eşleşmeli geçiş. Kesmeler 0,5 sn ızgaraya oturur (Faz B müziğine hazır). | Hareket, Yönetmen | Orta / orta |
| 8 | **Mesaj bandı.** Her bölümde tek satırlık, en az 64 px başlık: "ChatGPT'ye sor, Evlek göstersin", "Lapta'da 8 ilan · £105–147 bin", "Fiyat farkı £12.000". Sağ üstte kalıcı küçük Evlek logosu (3–25 sn). | Algı, Sosyal | Yüksek / az |
| 9 | **Kapanış 25 sn'de başlar.** CTA 56 px. Eklentiler adımı nötr bir menü şemasıyla gösterilir: Eklentiler › arama › Evlek [Ekle] → "Eklendi ✓". Logo ek yeri düzeltilir. Dipnot 28 px. Son 0,4 sn'de ilk karedeki havuza döngü. | Algı, Yönetmen, Sosyal | Yüksek / orta |
| 10 | **evlek.app bölümü 1,5 sn'ye iner.** Kazanılan süre doruğa ve CTA'ya gider. | Sosyal, Yönetmen | Orta / az |

**Beklenen sonuç:**
- Tutma puanı 4 → 6,5+.
- Genel puan ~5 → 8+.
- ChatGPT raporuyla birleşince hedef 9+.

## 5. Yeni 30 sn iskeleti (taslak; ChatGPT raporuyla kesinleşecek)

| Saniye | Bölüm |
|---|---|
| 0,0–1,5 | Havuz tam ekran, kanca + "Tahminini yaz"; telefon girer |
| 1,5–2,5 | Sorgu büyük yazıyla yazılır, balona uçar, gönder (eşleşmeli geçiş) |
| 2,5–4,0 | Girne haritası + "52 ilan" (sıkıştırılmış) |
| 4,0–5,0 | Lapta sorusu büyük yazıyla |
| 5,0–8,0 | Lapta uçuşu, sıralı kartlar, £139.000 kartında durma ve basma |
| 8,0–11,5 | **Doruk:** kart çıkar, fotoğraf tam ekran olur, galeri montajı |
| 11,5–13,0 | **Cevap:** £139.000 damgası (Lapta · 2+1 · 107 m²) |
| 13,0–15,0 | "A mı B mi?" kartları (yorum tetikleyicisi) |
| 15,0–18,5 | Tablo 3D, fiyat farkı kahraman kare |
| 18,5–20,0 | Bağlantı → evlek.app (aynı ilan) |
| 20,0–25,0 | Geri çekilme ve eklenti şeması: "Eklentiler › Evlek › Ekle" |
| 25,0–29,6 | Logo + "artık ChatGPT'de." + CTA + dipnot |
| 29,6–30,0 | Döngü: havuz karesi |

**15 sn ve 6 sn kesimler:** Sosyal ve yönetmenin listeleri v10'dan sonra yeni saniyelere göre kurulacak.

## 6. Onur'un vermesi gereken kararlar

1. **Karşılaştırma kartları:** "Reklam katmanı" olarak yeniden kurulsun mu (veriler gerçek), yoksa yalnız gerçek widget kart kırpımları mı kullanılsın?
2. **Fiyat tahmin kancası ve "Tahminini yaz 👇" yazısı:** Olsun mu?
3. **Eklentiler adımı:** Gerçek bir ekran kaydın var mı? Yoksa nötr şema ve "temsilidir" dipnotuyla mı gidelim?
4. **Girne bölümü:** Tamamen kesilsin mi, 1,5 sn'ye mi insin?
