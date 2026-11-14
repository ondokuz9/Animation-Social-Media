# Evlek VIDEO-1 · SVG kullanım kılavuzu

Boyutlar SVG viewBox ve doğal piksel boyutudur. Saniyeler yeni 30 sn master’a aittir. Tüm dosyaları aynı klasör hiyerarşisiyle Remotion public altına kopyala.

| Dosya | Boyut | Yeni saniye ve kullanım | Remotion katmanı |
|---|---|---|---|
| telefon/govde.svg | 1299×2700 | 0,00–1,50 / 6,00–6,50 / 10,50–12,00 / 15,00–16,50 / 25,50–26,80. Şeffaf ekran açıklığı, kenar ışığı ve tuşlar. | 3D cihaz ön yüzü, z=0. |
| telefon/ekran-maskesi.svg | 1299×2700 | Tüm cihaz planları. Açıklık x=60, y=72, 1179×2556, r=117. | Yalnız ekran çocuğunun alpha maskesi, z=−1. SVG artboard’unun tamamına mask-size 100% 100%. |
| telefon/sensor-adasi.svg | 1299×2700 | Tam telefon planları. Üstte özgün 116×34 px sensör adası. Sadece temiz kaynakla kullan. | Cihaz üst düzlemi, z=+2. |
| telefon/cam-yansimasi.svg | 1299×2700 | 0,10–0,42 / 25,60–25,92. Yansıma yalnız cam kenarında. | Cihaz ön düzlemi, z=+1. Katman opaklığı .23→.44→.23. |
| telefon/kalinlik-kenari.svg | 1299×2700 | Tam telefon planları. Kademeli 8 arka düzlem. | Cihaz derinliği. z=−3, −6, −9, −12, −15, −18, −21 ve −24. |
| telefon/govde-golgesi.svg | 1299×2700 | Tam telefon planları. Çevresel silüet gölgesi. | Sahne, cihazın altında. Bağımsız 2D katman, opaklık .35. |
| telefon/yumusak-zemin-golgesi.svg | 1440×420 | 0,00–1,20 / 6,00–6,50 / 10,50–12,00 / 15,00–16,50 / 25,50–26,80. Yere değen noktaya hizala. | 2D sahne, gövde gölgesinin altında. G1/G4 .60–.72. |
| arka-plan/01-deniz-isigi.svg | 1080×1920 | 15,00–16,50. Soyut lacivert deniz ışığı. | Tam kadraj taban fonu. |
| arka-plan/02-lapta-gun-batimi.svg | 1080×1920 | 10,50–12,00. Açık, hafif mercanlı gün batımı. | Tam kadraj taban fonu. |
| arka-plan/03-kirec-badana.svg | 1080×1920 | 6,00–6,50 / 25,50–26,80. Açık kireç yüzeyi. | Tam kadraj taban fonu. |
| doku/ince-gren.svg | 1080×1920 | 15,00–16,50. Sabit feTurbulence. Katman opaklığı .12–.20. | Yalnız 01-deniz-isigi üzerinde. |
| doku/kagit-lifleri.svg | 1080×1920 | 6,00–6,50 / 25,50–26,80. Sabit lif dokusu. Katman opaklığı .20–.32. | Yalnız 03-kirec-badana üzerinde. |
| doku/isik-sizmasi.svg | 1080×1920 | 0,10–0,42 / 25,60–25,92. Yumuşak ışık. Katman opaklığı en çok .25. | Fon üzerinde, cihaz ve widget altında. |
| vurgu/konum-pini.svg | 128×148 | 8,25–8,50. Kullanılırsa 0,34 ölçekle, harita dışındaki konum başlığına yakın. | Ekran kırpımı dışında. Gerçek haritaya yeni veri noktası eklenmez. |
| vurgu/ince-cizgi.svg | 456×24 | 12,65–12,85. Kart dışından konum alanına yönlendir. | Editoryal katman, kart piksel kutusunun dışında. |
| vurgu/fiyat-cercevesi.svg | 384×120 | 18,50–18,70. Gerçek fiyat başlığı çevresine uygun ölçekle. | Tablo üstü dış çerçeve, gerçek gliflerden en az 12 px uzakta. |
| vurgu/dokunma-basma.svg | 112×112 | 2,50 / 10,35 / 22,57. 42 px çap açık gri dolu nokta. | Gerçek hedefte üst katman. 83 ms giriş, 100 ms çıkış. |
| kapanis/evlek-kilit-duzeni.svg | 1080×1920 | 27,00–30,00. Logo yuvası x=330, y=682, w=420, h=145. Mevcut gerçek vektörü ortala. | Tam kadraj kapanış tabanı. Gerçek logo üstte, 28,50 sn’den sonra CTA y=1164. |

## Montaj

1. Dış sahnede taban plaka → doku → arka plan ışığı → zemin gölgesi → gövde gölgesi → 3D telefon → dış gerçek kart kırpımı → editoryal yazı sırası.
2. 3D grupta perspective 1800 px ve preserve-3d. SVG’leri ortak 1299×2700 düzlemde hizala. Ekran kaydını açıklık boyutunda ayrı çocuk olarak yerleştir. Uyuşmayan en-boy oranında contain kullan. Gölge ve dokuyu 3D grubun kardeş katmanları olarak tut.
3. Ön yüzün şeffaf alanına gerçek ekran girer. CSS maske alternatifinde x=60, y=72, 1179×2556, border-radius 117 px ve overflow hidden. Bu maske yalnız ekran çocuğundadır.
4. Yan tuşlar ön gövdenin içindedir. Sensör adası, mevcut cihaz donanımı görünmeyen kayıtlarla kullanılır. Cam yansıması ekranın dış çeperinde kalır. Yalnız gerçek harita, kart, site ve tablo kaydı kullan.
5. Dinamik öğeler için zaman kodunu round(saniye×60) ile kareye çevir. Doku hareketi veya renk filtresi gerçek ekran katmanına uygulanmaz. Gri basma görseli ekran tint’i yerine kısa eylem işaretidir.
