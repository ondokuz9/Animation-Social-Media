# Evlek Reel — Asset Paketi
1080×1920 · 9:16 · 30fps

## İçerik

    evlek.css              Gömülü fontlar (base64) + marka token'ları — TEK dosya, dış çağrı yok
    img/room-00-bos.jpg    Boş oda
    img/room-01-akdeniz.jpg
    img/room-02-minimal.jpg
    img/room-03-dogal.jpg
    img/kiyi.jpg           Kıyı planı — AŞAĞIDAKİ NOTU OKU
    img/wordmark.png       Siyah, şeffaf, kenar boşlukları kırpılmış (539×166)

## Kalite kontrolü — yapıldı

**Hizalama:** 4 oda karesinin üst bölgesi (tavan, duvar, kemerli pencere) karşılaştırıldı.
Sapma 2,4 / 4,4 / 5,6 (255 üzerinden) — bu JPEG gürültüsü seviyesi. Kamera kilitli,
yeniden hizalama gerekmiyor. Wipe geçişlerinde titreme olmayacak.

**Boyut:** Hepsi 768×1376'dan 1080×1920'ye LANCZOS ile ölçeklendi, fazlalık
tüm karelerden ALTTAN eşit kırpıldı — hizalama korundu. Hafif unsharp uygulandı.

**Fontlar:** Fraunces 700, Hanken Grotesk 800, Hanken Italic 400, JetBrains Mono 500.
TR+EN karakter setine alt-kümelendi (dördü toplam 72 KB). Headless Chromium'da
render testi geçti: dördü de yükleniyor, ı/İ/ğ/ş/ç/ö/ü doğru çiziliyor.
Hepsi SIL OFL — ticari kullanım serbest.

## Claude Design'da kullanım

1. Yeni proje aç, **6 görsel + evlek.css'i proje dosyası olarak yükle**
2. Kodda `<link rel="stylesheet" href="evlek.css">` ve `img/...` göreli yolları kullan
3. Export ZIP bu dosyaları içinde taşır — render'da kırılmaz

Görselleri base64'e çevirme. 2 MB görsel base64'te 2,7 MB metne dönüşür,
prompt'a sığmaz. Fontlarda base64 şart (asıl kırılma noktası orası), görsellerde değil.

## Fable prompt'una girecek teknik kurallar

- Animasyon **tek bir `t` değişkeninin saf fonksiyonu** olsun.
  `requestAnimationFrame` sayacı, `Date.now()`, CSS `animation` YOK.
  Her kare `render(t)` ile yeniden çizilebilmeli — frame-accurate export bunu şart koşar.
- Sabit 30fps, sabit toplam süre (22.0 sn = 660 kare)
- Son 1 saniye tam sabit kare (VO kuyruğu için)
- Sıfır dış çağrı: font yok, CDN yok, Google Fonts linki yok
- `<video>` elementi YOK — hareket koddan, kaynak still'lerden

## Kıyı görseli hakkında — karar senin

`kiyi.jpg` Girne değil. Girne limanı at nalı biçiminde ve sağında Venedik kalesi var;
bu karede ikisi de yok. Yerel izleyici bunu ilk saniyede görür.

Evlek'in tüm konumlandırması doğrulama üzerine kurulu. Sahte bir Girne ile açmak,
tam da satmaya çalıştığın şeyi zayıflatır. Elinde gerçek Girne karesi vardı (Commons) —
onu kullan, ya da bu planı tamamen çıkar. Oda dizisi zaten daha güçlü bir açılış.
