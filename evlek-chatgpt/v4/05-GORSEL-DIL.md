> **Not (14 Kas, v7):** Geçiş G3 (ekran dışına çıkış) kaldırıldı; tam ekran arayüz ve gerçek iOS görünümü geçerli. Doku, renk ve fotoğraf kuralları sürüyor.

# Görsel dil: doku, geçiş, tipografi, vibe

Hedef his: sakin bir güven ve premium bir hız. Apple ürün filmi disiplini, Akdeniz sıcaklığı. Hiçbir şey "efekt olsun diye" yok.

## 1. Renk ve zemin

| Katman | Değer |
|---|---|
| Koyu sahne (sohbet ve harita) | #070B12 → #0A2540 dikey geçiş, köşelerde %20 vinyet |
| Sohbet ekranı | Zemin #1E1E1E · kart #2A2A2A · balon #303030 · yazı #ECECEC · ikincil #A0A0A0 · çizgi #3A3A3A |
| Sıcak ışık | Ana ilan fotoğrafından örneklenen renk; zeminde 80 px bulanık, %8–12 opaklık, ölçü başına çok yavaş kayar |
| Kapanış | Krem #FAF8F2 · lacivert #0A2540 · mercan #B84E3B (yalnız çizgi) |

Gerçek evlek.app sayfası kendi renkleriyle görünür (ör. "Telefonla ara" düğmesinin mercanı); değiştirilmez.

## 2. Doku

- **Film greni.** Bütün kareye, %3–4 opaklıkta, kare başına değişen ince gren (SVG `feTurbulence` ya da gren PNG dizisi). Koyu sahnelerde dijital düzlüğü kırar.
- **Kâğıt dokusu.** Yalnız kapanıştaki kremde, %2.
- **Cam.** Telefon dışına çıkan çip ve kartlarda: kenarda 1 px beyaz %10 çizgi, üstten 1 px iç parlama. Arkası bulanıklaşır (`backdrop-filter: blur(20px)`).
- **Gölge.** İki katman: yakın, keskin (0 2 6 %30) ve uzak, yumuşak (0 24 60 %35). Z arttıkça uzak gölge büyür ve soluklaşır.
- **Yasak:** neon, parlama halesi, lens flare, parçacık, bokeh balonları, hologram çizgileri.

## 3. Tipografi

- **Font:** Inter. Başlıklarda 800, letter-spacing −0,03 em, line-height 0,95.
- **Başlık boyu:** 80–96 px; telefon dışında, üstte, sola dayalı, güvenli alan 72 px.
- **Ekrana giriş:** Kelime kelime maske (`clip-path` ile aşağıdan yukarı açılma, 9 kare, kelime arası 3 kare). Bulanık giriş yok; daha temiz.
- **Çıkış:** Tümü birlikte, yukarı 12 px ve opaklık, 6 kare.
- **Rakamlar:** `font-variant-numeric: tabular-nums`. Fiyatlar hiçbir zaman sayılmaz; tek seferde, maskeyle açılır.
- **Küçük etiketler:** "ilan fiyatı", "ilan fiyatı aralığı" vb. 26 px, %60 beyaz.
- **Hook rakamı:** £139.000, 200 px, 800.

## 4. Geçiş kataloğu (yalnız bunlar kullanılır)

| Kod | Ad | Nerede | Nasıl |
|---|---|---|---|
| G1 | Eşleşen hareket | Hook → kart; liste satırı → galeri; kart → evlek.app | Aynı fotoğraf ve fiyat aynı kadrajla büyür ya da küçülür. Ara kare yok; 12–15 kare yay. |
| G2 | Geri sarma | Perde 1 → 2 | Ekran sağa 140 px kayar ve %8 küçülür; yatay ince ışık çizgisi geçer; hareket bulanıklığı. 8 kare. |
| G3 | Telefondan çıkış | Çipler, harita, karşılaştırma kartları | Öğe Z +200/+300'e çıkar, gölge büyür, sonra yerine ya da yeni yerine iner. |
| G4 | Katlanma | Harita → liste | Harita düzlemi telefonun widget kutusuna geri katlanır (rotateX 35° → 0). |
| G5 | Işık çizgisiyle kapanma | WhatsApp dokunuşu → kapanış | Dokunuş noktasından yatay beyaz çizgi açılır, kremi ortaya çıkarır. 6–8 kare. |

Başka geçiş (zoom-blur, glitch, whip pan, dönme) kullanılmaz.

## 5. Kamera

- Sanal kamera tek bir: telefona göre dolly (ölçek) ve pan (kaydırma). Rotasyon en fazla 8°.
- Her kamera hareketi bir dokunuşu ya da yeni içeriği takip eder.
- Kamera durduğunda gerçekten durur; titreme, "nefes" yok. Yalnız fotoğraflarda %2 itme.

## 6. Fotoğraf işleme (gerçek ilanlar, yapay zekâ yok)

- **Renk:**
  - Beyaz dengesini nötrle.
  - Parlak alanları yumuşat (highlights −15).
  - Gölgeleri ölçülü aç (+10).
  - Doygunluk +5; denizin ve malzemelerin rengi korunur.
- **Kadraj:** Düşeyleri hafif düzelt. Yatay salon fotoğraflarını 9:16'ya zorla kırpma; koyu çerçevede geniş göster. Manzarayı kanıtlayan balkon ya da pervaz kadrajda kalsın.
- **Çözünürlük:** Tam ekran yalnız 1600 px'lik [ofis] fotoğraflarıyla; 640 px'lik olanlar yalnız kart boyunda.

## 7. Telefon ve arayüz

- **Telefon:** Nötr, koyu çerçeve, Apple'a özgü ayrıntı yok. Durum çubuğu temiz (9:41).
- **ChatGPT ekranı:** Koyu, sade; logo yok. Giriş kutusu yazısı "Sorunuzu yazın". Düzen `ref/chatgpt-gercek-*.jpg` ve `ref/chatgpt-eklentiler-*.jpg` dosyalarına dayanır. Başka uygulamaların simgeleri soyut ve markasız.
- **Evlek widget'ı:**
  - Bugünkünden şık ama aynı yapıda: başlık ("Girne · Satılık · 52 ilan"), çip satırı, harita kutusu, kartlar ("14 foto"), "Haritada tümü", "Evlek'te aç ↗".
  - Kart köşesi 18; fotoğraf 4:3.
- **Dokunuş:** 44 px beyaz halka. %30 dolgu ile başlar, büyürken söner; 12 kare.

## 8. Ses ve hareket eşleşmesi

Her dokunuşun ve her çipin bir sesi var. Sesler müziğin 8–12 dB altında. Kurguda kesme ölçü başında, küçük hareketler vuruşta.
