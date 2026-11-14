# Evlek VIDEO-1 · Bozulmaz kurallar

## Ürün ve veri
- **Ürün:** Evlek (evlek.app), Kuzey Kıbrıs emlak platformu. Evlek artık ChatGPT içinde bir uygulama (MCP). Kullanıcı Evlek'i ChatGPT'de **Eklentiler**'den ekler.
- **Gerçek arayüz:** Evlek widget'ı (harita, kartlar, ilan detayı) ve evlek.app sayfası gerçek kayıttır. İçerikleri yeniden çizilmez.
  - Kadraj, ölçek, ışık, derinlik ve kesme serbest.
  - Gerçek pikseller kopyalanıp sahneye taşınabilir; v9'da kart telefondan bu şekilde çıkıyor.
- **İlanlar ve fiyatlar gerçek:**
  - EVL-100102 · £139.000 · Lapta · 2+1 · 107 m²
  - EVL-101433 · £127.000 · Lapta · 2+1 · 104 m² brüt
  - Girne aramasında 52 ilan, Lapta'da 8 ilan.
  - Sahte ilan, fiyat ya da özellik olmaz.
- **İlan görselleri:** Gerçeklikten biraz sapma serbest: renk derecelendirme, ışık, kadraj, sinematik hareket. Yapay zekâyla üretilmiş fotoğraf ya da insan görüntüsü olmaz.

## Marka ve iddia
- **ChatGPT/OpenAI:** Logosu kullanılmaz; "ChatGPT" yalnız yazı olarak geçer. Kapanışta dipnot var: ChatGPT, OpenAI'ın ticari markasıdır.
- **Telefon:** iPhone'un birebir kopyası ve Apple logosu kullanılmaz. Telefon markasız; gövde lacivert grafit.
- **İddia:** "İlk", "tek", "en iyi" gibi iddialar yok.

## Gizlilik
- Kişisel veri, emlakçı adı ve ofis adı görünmez.
- Onur'un yüzü ve adı görünmez.

## Görsel dil
- **Renkler:** Krem #FAF8F2, lacivert #0A2540, mercan #B84E3B (vurgu; ölçülü).
- **Font:** Inter.
- **Okunurluk:** Arayüzün üstüne gren ya da renk efekti konmaz. Doku ve ışık yalnız arka planda ve geçişlerde kullanılır.

## Teknik
- Remotion 4 (React) ile 1080×1920, 60 fps.
- 3D telefon CSS 3D ile kuruluyor: perspective, preserve-3d, 8 katman kalınlık, SVG gövde.
- Arayüz kaynağı 1179×2556 iOS ekranı; kaynak zamanı yeniden zamanlanıyor (hızlandırma, yavaşlatma, kesme).
- Ses Faz B'de eklenecek: lisanslı müzik ve efektler, −14 LUFS.
