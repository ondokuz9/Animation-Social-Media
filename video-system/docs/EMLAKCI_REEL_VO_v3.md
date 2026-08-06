# Seslendirme v3 · pazarlama metni

Değişen üç şey:

1. **Giriş senin cümlen** — "Kıbrıs'ta emlakçıysan bunu görmen lazım!" aynen kalıyor.
2. **Açıklamıyoruz, çekiyoruz.** Amaç emlakçıya ürünü öğretmek değil; ilgisini
   yakalayıp elde tutmak. Özellik anlatan cümleler çıkarıldı.
3. **Tek nefeste akıyor.** Her satır bir öncekine bağlanıyor — "çünkü…",
   "tek işin…", "peki ya…". Baştan sona okununca tek bir konuşma:

> *Kıbrıs'ta emlakçıysan bunu görmen lazım! Çünkü ilan koymak değişti — hem de
> tamamen. Evlek yazıyor… çeviriyor… döşüyor… eşleştiriyor. Tek işin onaylamak.
> O kadar. İngiliz alıcı da anlıyor, Rus alıcı da. Boş oda satılmaz, döşenmiş
> oda satar. Herkese değil — alacak olana gidiyor. Peki ya hiç aramazsa?
> Yapay zekâya sorar. Cevap senin ilanın olur. Gerisi Evlek'te. evlek nokta app.*

Yapı klasik pazarlama yayı: **kanca → söz → hızlı değer → merak → vuruş → çağrı.**
En güçlü iddia (yapay zekânın cevabı senin ilanın oluyor) sona saklandı ve
öncesine bir soru konuldu — çünkü cevabı beklenen soru, izleyiciyi orada tutar.

---

## Satırlar

**vo_01** · 0.55 sn · **SENİN CÜMLEN — dokunulmadı**
```
[excited] Kıbrıs'ta emlakçıysan bunu görmen lazım!
```

**vo_02** · 3.90 sn · söz
```
Çünkü ilan koymak değişti — hem de tamamen.
```
> "Çünkü" kancaya bağlıyor. "Hem de tamamen" pazarlama vurgusu.

**vo_03** · 6.90 sn · hızlı değer — beat'ler ve dönüş üstüne
```
Evlek yazıyor... çeviriyor... döşüyor... eşleştiriyor.
```
> Dört fiil, tek özne. Ekranda "Bunları Evlek yaptı." yazarken bitiyor.
> Açıklama değil, ritim.

**vo_04** · 11.60 sn · rahatlama
```
Tek işin onaylamak. O kadar.
```
> "O kadar." pazarlamada nokta koyar. Kontrolün emlakçıda kaldığını da söyler.

**vo_05** · 15.70 sn · diller
```
İngiliz alıcı da anlıyor, Rus alıcı da.
```
> "Beş dile çeviriyor" bir özellik; bu bir müşteri. KKTC'de alıcının yabancı
> olması günlük gerçek — cümle oraya değiyor.

**vo_06** · 19.00 sn · staging
```
Boş oda satılmaz. Döşenmiş oda satar.
```
> Filmde yazmayan, her emlakçının bildiği söz. Karşıtlık kurulumu akılda kalır.

**vo_07** · 22.90 sn · eşleşme
```
Herkese değil — alacak olana gidiyor.
```
> "Alacak olan" emlakçının kendi dili. "Doğru alıcı"dan daha keskin.

**vo_08** · 27.40 sn · merak — kesmenin üstünden geçer
```
[curious] Peki ya hiç aramazsa?
```
> Arama sahnesi biterken sorulur, cevabı asistan sahnesinde gelir. İzleyiciyi
> son dört saniyeye bağlayan şey bu.

**vo_09** · 29.20 sn · vuruş
```
Yapay zekâya sorar. Cevap senin ilanın olur.
```
> Filmin ve metnin tepe noktası. "Cevap senin ilanın olur" — sahiplik cümlesi.

**vo_10** · 33.40 sn · çağrı
```
[warm] Gerisi Evlek'te. evlek nokta app.
```

---

## Neyi kasten anlatmıyoruz

- Arama sahnesinin nasıl çalıştığı → ekran zaten gösteriyor, ses soru soruyor.
- "Yapay zekâya hazırlar" özelliği → sonundaki vuruşu bozmamak için erken
  söylenmiyor.
- Kaynak gösterme, çeviri sayısı, staging tekniği → hiçbiri. Pazarlama filmi
  ürünü öğretmez, merak bırakır.

Konuşma ~26 sn, kalan ~10 sn sessiz: hook'un çarpması, staging'in payoff'u ve
soru ile cevap arasındaki boşluk. O boşluk kasıtlı — vuruş öncesi nefes.

---

## Ton

Senin `[excited]` tercihin doğru yön: bu bir pazarlama filmi, sakin anlatıcı
değil. İstenen enerji **kendinden emin ve hızlı** — coşkulu değil.

| Satır | Tag | Ton |
|---|---|---|
| 01 | `[excited]` | Kanca — yüksek enerji |
| 02–03 | tag yok | Enerji korunur, tempo hızlı |
| 04 | tag yok | Hafif yavaşlar, rahatlar |
| 05–07 | tag yok | Sohbet tonu, meslektaş |
| 08 | `[curious]` | Yükselen soru |
| 09 | tag yok | **Yavaşlar ve düşer** — vuruş burada |
| 10 | `[warm]` | Kapanış |

`vo_09` en kritik satır: hızlı okunursa vuruş kaybolur. Gerekirse o satırı
`[slow]` ya da nokta yerine üç nokta ile ("Yapay zekâya sorar... cevap senin
ilanın olur.") yavaşlat.

**Ayarlar:** Stability şu anki yerinde kalabilir (ortanın biraz sağı) —
enerjiyi tamamen bastırmasını istemiyoruz artık. Language Override → Türkçe aç.

---

## Küçük not

Senin cümlen "Kıbrıs'ta" diyor, ekrandaki yazı "KKTC'DE". Uyumsuz değil —
konuşma dilinde "Kıbrıs'ta" daha doğal, yazıda "KKTC" daha kesin. Sorun
görmüyorum; ama istersen ekranı da "KIBRIS'TA" yapabiliriz, tek satırlık
değişiklik.

---

## Sonraki adım

10 dosyayı `vo_01.mp3` … `vo_10.mp3` olarak gönder. Zaman koduna göre mix,
−16 LUFS normalize, `-c:v copy` ile mux — görüntü yeniden kodlanmaz, sessiz
master ayrı kalır.
