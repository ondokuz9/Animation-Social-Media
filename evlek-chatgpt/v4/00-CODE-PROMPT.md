# VIDEO-1 v7 · Code prompt'u (Faz A ve A2 talimatlarının yerine geçer)

## 0. Tek cümlede

Replit × ChatGPT lansman filminin reçetesi, Evlek için 9:16.

- **Başta ve sonda:** sinematik insan ve atmosfer çekimleri.
- **Ortada:** iOS ChatGPT'nin **birebir** ekranında, bugün gerçek ChatGPT oturumunda alınmış **gerçek içerik**.
- Az yazı, sakin ritim.
- Ekran dışına taşan efekt yok.

**Bağlayıcı ek:** `v4/06-HAREKET-KITABI.md`. Bütün mikro hareketler, eğriler, süreler, kamera ve yazı zanaatı orada. Bu prompt ile çelişirse hareket kitabı geçerli.

## 1. Neden (kurul özeti)

1. Kaliteyi efekt değil gerçeklik veriyor. Replit videosunda arayüz sade, ama gerçek ve büyük; duyguyu sinematik insan çekimleri taşıyor.
2. Faz A "ChatGPT'ye benzeyen şablon" gibi duruyordu. Telefon küçüktü, öğeler gereksiz yere ekran dışına çıkıyordu, arayüz gerçekle tutmuyordu.
3. Cowork, 14 Kasım'da Onur'un ChatGPT hesabında akışın tamamını gerçekten çalıştırdı. Bütün metinler ve ekranlar buradan alınır (`ref/chatgpt-web-gercek-oturum/`). Video bu oturumun mobil hâlidir; uydurma metin yok.

## 2. Format

| Öğe | Değer |
|---|---|
| Ana sürüm | 9:16, 1080×1920, 60 fps, 30 sn |
| LinkedIn | 4:5 kesim (1080×1350) |
| Ek kesimler | 15 sn ve 6 sn |
| Dil | Önce TR; EN Faz B'de |

## 3. Akış (30 sn)

| Sn | Kaynak | Ne görünür |
|---|---|---|
| 0–3 | **H1** (sinematik; Cowork üretir) | Akşam, yağmurlu pencere önü, sıcak lamba. Bir el telefon tutuyor, yüz görünmüyor. Telefon ışığı yüzeye vuruyor. Alt üçte birde küçük beyaz yazı: "Kuzey Kıbrıs'ta ev mi arıyorsunuz?" |
| 3–4 | Geçiş | Kamera telefon ekranına itilir, ekran kareyi doldurur; tam ekran iOS ChatGPT'ye geçilir. Telefon çerçevesi yalnız bu geçişte görünür. |
| 4–7 | Arayüz | Koyu iOS ChatGPT. "@Evlek" yazılır; açılan listede **yalnız** "Evlek · Northern Cyprus property data" var (Onur'un kişisel dosyaları gösterilmez). Seçilir. Sorgu yazılır: "Girne'de 160 bin sterlin altı, deniz manzaralı, satılık 2+1 daire göster." Gönderilir. |
| 7–9 | Arayüz | "5s düşündü" ve "Search Northern Cyprus property listings açıldı". Ardından **gerçek Evlek widget'ı**: harita (Girne, Çatalköy, Beşparmak…), fiyat kapsülleri "£90–160 bin · 28", "£120–158 bin · 12", "£79–140 bin · 8", "£75–93 bin · 4"; "Girne · Satılık · 52 ilan"; çipler; kartlar. |
| 9–12 | Arayüz | ChatGPT'nin cevabı akar (birebir): "Evlek'te kriterlerine uyan **52 satılık daire** bulundu. İlk 10 ilan yukarıda, en düşük fiyattan başlayarak gösteriliyor." Kamera yumuşakça "52 satılık daire"ye yakınlaşır. |
| 12–16 | Arayüz | Kullanıcı: "Lapta'dakileri ucuzdan pahalıya göster." Widget'ın haritası Lapta'ya iner (Kayalar, Karşıyaka, Lapta, Geçitköy…), "£105–147 bin · 8", "Lapta · Satılık · 8 ilan". Kartlar: £105.000 · £110.000 · £120.000 → kaydırılır → £139.000. Cevap: "Lapta'da kriterlerine uyan **8 satılık 2+1 deniz manzaralı daire** bulundu. İlanları ucuzdan pahalıya sıraladım; fiyatlar **£105.000–£147.000** arasında." |
| 16–19 | Arayüz | £139.000 kartına dokunuş; gerçek ilan detay widget'ı (`listing-detail-v3-11`); fotoğraflar kayar (havuz ve deniz, salon). |
| 19–24 | Arayüz | Kullanıcı: "£139.000 ve £127.000 olanları karşılaştır." ChatGPT'nin gerçek tablosu satır satır akar: "Lapta: £127.000 ve £139.000 karşılaştırması"; Alan, Banyo, Deniz manzarası, Havuz, Eşyalı… Ardından **"Fiyat farkı: £12.000 (%9,4)."** Kamera bu satıra yakınlaşır. **"Emlakçı" satırı gösterilmez** (kırp ya da kaydırmayla dışarıda bırak). |
| 24–26,5 | Arayüz | "Evlek'te aç ↗" → evlek.app ilan sayfası (gerçek düzen): fotoğraf, £139.000, "Lapta'da Deniz Manzaralı 2+1 Daire". Alttaki çubukta "WhatsApp'tan yaz"a dokunuş. **Ofis kartı ve ofis adı görünmez:** kadraj dışında kalır ya da bulanık. |
| 26,5–30 | **H3** (sinematik; Cowork üretir) + kapanış | Gün batımında denize bakan teras, arkadan siluet ya da boş şezlong, yüz yok. Üstüne ortalanmış beyaz Evlek logosu ve "artık ChatGPT'de." Son 1,5 sn sabit. |

## 4. Arayüz kuralları (birebir gerçek)

- **Kaynaklar:**
  - **iOS görünümü:** `ref/chatgpt-gercek-1…5.jpg` (Onur'un iPhone'u, koyu tema) ve `ref/chatgpt-eklentiler-*`. Renkleri bunlardan piksel örnekleyerek al. Başlık çubuğu düğmeleri, "ChatGPT'ye sor", mikrofon, beyaz daire düğme, balon biçimi bunlarla birebir.
  - **İçerik ve davranış:** `ref/chatgpt-web-gercek-oturum/01…07.jpg`, 14 Kas'taki gerçek oturum. Ekrandaki her metin buradan ya da `data/` dosyalarından gelir.
- **Evlek widget'ı** hiç yeniden çizilmez. Gerçek widget HTML'i (`widget-kit/`; finalden önce canlı MCP'den yenile) 3x ölçekte, gerçek veriyle çizilir. Etkileşimler (kartları kaydırma, haritanın Lapta'ya inmesi, ilan detayı) widget'ın kendi davranışıyla Playwright'ta sürülüp kaydedilir.
- **Cevap metinleri** ChatGPT gibi akar: kelime grubu kelime grubu, kalın yerler kalın.
- **Logo:** ChatGPT ya da OpenAI logosu çizilmez. Gerçek iOS ekranında zaten yok.
- **Durum çubuğu temiz:** 9:41, tam pil.
- **Kamera:**
  - Tam ekran arayüz üzerinde yumuşak yakınlaşma ve kaydırma (Screen Studio tarzı), en fazla 1,5×.
  - Her yakınlaşma bir dokunuşu ya da yeni içeriği takip eder.
  - **3B dönüş ve ekran dışına çıkan öğe yok** (eski G3 tamamen kalktı).
- **Netlik:**
  - Arayüzde gren ve renk düzeltmesi yok; ekran kaydı gibi piksel temiz.
  - Yazıda ve arayüzde hareket bulanıklığı yok.
  - Yalnız H1→arayüz ve arayüz→H3 geçişlerinde var.
  - Dokunuş: gerçek iOS'taki gibi çok hafif gri basma; büyük halka yok.

## 5. Yazı (en fazla 3)

| Sn | Yazı |
|---|---|
| 0–3 | "Kuzey Kıbrıs'ta ev mi arıyorsunuz?" (alt üçte bir, sade) |
| 26,5–30 | Evlek logosu ve "artık ChatGPT'de." |
| İsteğe bağlı, 9–12 | Arayüzün üstünde ince bir etiket: "Evlek, ChatGPT içinde" |

Ekran dışına taşan başlık bandı yok.

## 6. Sinematik çekimler (H1, H3)

Cowork Higgsfield ile üretip `public/cine/` için teslim eder:

- Yüz yok.
- Yazı ve logo yok.
- Gerçekçi, 35 mm, sıcak ışık.

Code bunları yalnız kurgular, renk eşler ve geçişleri yapar.

## 7. Ses (Faz B)

- **Müzik:** Lisanslı kütüphaneden.
  - 0–4 sn: sakin, piyano ya da yumuşak synth.
  - 4 sn: arayüze geçişte ritim girer (110–120 BPM, minimal elektronik, sıcak).
  - 26,5: çözülür.
- **Efektler:**
  - Gerçek iOS hissinde: klavye tıkları hafif, gönder sesi.
  - Widget gelince küçük bir "pop".
  - WhatsApp'ın kendi sesi kullanılmaz.
- **Mastering:** −14 LUFS, −1 dBTP.

## 8. Teslim (Faz A3)

1. Sessiz 60 fps video. H1 ve H3 gelmediyse yerlerinde düz koyu yer tutucu.
2. 2 fps ızgara.
3. Şu anların tam çözünürlük PNG'leri: 5,0 · 8,0 · 10,5 · 14,0 · 17,5 · 22,5 · 25,5.
4. KISA-RAPOR.md: dürüst puan ve sapmalar.
5. **Bir de yan yana karşılaştırma görseli:** kendi iOS arayüz karen ile `ref/chatgpt-gercek-2.jpg`. Arayüz gerçeğinden ayırt edilemeyecek kadar yakın olmalı.

`VIDEO-1_v7_fazA3.zip` ve dur.
