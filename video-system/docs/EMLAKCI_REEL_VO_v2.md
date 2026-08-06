# Seslendirme v2 · anlatan metin

Önceki metin reddedildi ve gerekçesi doğruydu: **"anlatmadı, yazanları okudu."**
Sebep sesin ayarı değil, metnin kendisiydi — 13 satırın 13'ü de ekranda zaten
yazan cümlenin aynısıydı. Bir sesin yapabileceği tek şey kalıyordu: okumak.

## Yeni kural

> **Ekran mekanizmayı gösterir. Ses argümanı taşır.**
> İkisi asla aynı cümleyi söylemez.

Ekran "ne olduğunu" anlatıyor (açıklamayı yazar, beş dile çevirir, döşer…).
Ses artık "**bu neden önemli**"yi anlatıyor — bir emlakçının meslektaşına
anlatacağı dille. Böylece iki kanal birbirini tekrar etmiyor, üst üste
biniyor: izleyici aynı anda hem kanıtı görüyor hem gerekçeyi duyuyor.

## KKTC emlakçısı için düşünülen şey

Bu kitleye "işini kolaylaştırırız" demek en küçük iddia. Onlar zaten iş
yapıyor. Gerçekten değişen şey şu: **alıcının ilk durağı değişti.** Artık
filtre işaretlemiyor, cümle yazıyor; giderek yapay zekâya soruyor. Bu
yüzden ilanın "iyi yazılmış" olması yetmiyor — **okunabilir, çevrilebilir,
kaynak gösterilebilir** olması gerekiyor. Emlakta yenilik tam olarak bu.

Metnin omurgası bu tek fikir: *zor olan ilan koymak değil, görünür olmak.*

---

## Satırlar (10 adet — 13 değil)

Daha az satır, daha çok nefes. Konuşma ~27 sn, geri kalan sessiz —
hook'un çarpması, Staging'in payoff'u ve ağın büyümesi sessiz kalıyor.

Noktalama **kasıtlı**: üç nokta v3'te gerçek duraklama üretir, tire
vurguyu keser. Aynen kopyala, sadeleştirme.

---

**vo_01** · giriş 0.60 sn · SLAM hook üstüne
```
[calm] Zor olan ilan koymak değil... görünür olmak.
```
> Ekran "KKTC'DE EMLAKÇIYSAN BUNU GÖRMEN LAZIM" diye bağırırken ses sakin
> bir meslek gerçeği söylüyor. Kontrast kancayı güçlendiriyor.

**vo_02** · 4.20 sn · tez + ilk beat'ler
```
Evlek, sen yayınladıktan sonrasını üstleniyor.
```
> Ekran beş maddeyi sayıyor; ses hepsini tek cümlede çerçeveliyor.

**vo_03** · 8.50 sn · dönüş
```
Beş iş... tek dokunuş.
```
> Ekranda "Bunları Evlek yaptı." yazarken sesin bunu tekrar etmesi gereksiz.
> Bunun yerine oranı söylüyor.

**vo_04** · 11.20 sn · basış ve onay
```
Onay hep sende kalıyor. Yazan Evlek — karar veren sen.
```
> Otomasyona karşı ilk itirazın cevabı. Ekran "Onayı sen veriyorsun." diyor;
> ses bunu bir güvenceye çeviriyor.

**vo_05** · 15.60 sn · diller
```
Beş dil. Alıcın kendi dilinde okuyor.
```
> Özellik değil, sonuç. KKTC'de alıcının yabancı olması günlük gerçek.

**vo_06** · 18.90 sn · staging
```
Boş oda zor satılır. Döşenmiş oda hayal ettirir.
```
> Filmin hiçbir yerinde yazmayan, her emlakçının bildiği şey. Sesin en çok
> "meslektaş" gibi konuştuğu yer burası.

**vo_07** · 22.80 sn · eşleşme
```
Herkese değil — doğru alıcıya.
```
> "Herkese değil" ayırt edici olan. Spam değil, isabet.

**vo_08** · 26.00 sn · arama
```
Alıcı artık filtre değil... cümle yazıyor.
```
> Davranış değişikliğini adlandırıyor. Ekran aramayı gösteriyor, ses neyin
> değiştiğini söylüyor.

**vo_09** · 29.40 sn · asistan — filmin ana iddiası
```
Cevabı yapay zekâ veriyor. Kaynak senin ilanın.
```
> Beş kelimede tüm konumlandırma. Filmin en güçlü anı, metnin de öyle olmalı.

**vo_10** · 33.40 sn · kapanış
```
[warm] Gerisi Evlek'te. evlek nokta app.
```
> "Gerisi Evlek'te" ekranda da yazıyor — ama burada tekrar değil, **senkron**:
> altın satır otururken sesin aynı şeyi söylemesi kapanışı mühürler.

---

## Giriş için iki alternatif

Birinciyi beğenmezsen aynı işlevi gören iki seçenek — biri seç, hepsini
üretip karşılaştırabilirsin:

**A (varsayılan):** `Zor olan ilan koymak değil... görünür olmak.`
**B (değişim vurgusu):** `Alıcı değişti. İlan da değişmeli.`
**C (soru):** `İlanını koydun... peki alıcı seni nasıl bulacak?`

C en çok merak uyandıran ama soru tonu sesin sonunu yükseltir; SLAM
tipografiyle çakışabilir. A en güvenlisi, B en iddialısı.

---

## Oyunculuk yönü (v3'e verilecek)

Önceki denemenin sorunu buradaydı. İstenen:

| İstenen | İstenmeyen |
|---|---|
| Meslektaşa anlatır gibi | Spiker / tanıtım sesi |
| Cümle sonu **düşer** | Cümle sonu yükselir |
| Duraklamalar gerçek | Nefessiz akış |
| Sakin özgüven | Neşe, coşku, "storyteller" enerjisi |

**Ayarlar:** Stability'yi **Robust'a biraz daha yaklaştır** (şu an ortada).
Bu ses "Joyful and Dynamic" tanımlı; robust taraf o enerjiyi bastırır.
Speed 1.0 kalsın. Language Override → **Türkçe, açık**.

**Tag kullanımı:** sadece iki satırda var (`[calm]` ve `[warm]`). Fazlası
v3'te tonu satır satır dalgalandırır. Yine de fazla neşeli çıkarsa
`vo_02`, `vo_06` ve `vo_09`'a da `[calm]` ekle.

---

## Ses hakkında

"Joyful and Dynamic Storyteller" bu film için hâlâ yanlış profil — ama
metin değiştiği için şansı arttı: artık okuyacağı cümleler tempo isteyen
cümleler değil, düşündüren cümleler. **Önce bu metinle bu sesi dene.**

Tutmazsa Voice Library'de ara: dil **Türkçe**, use case **Narration** veya
**Advertisement**, mood **Calm / Confident / Professional**. Aranan tarif:
*40'lı yaşlarda, alçak tonlu, aceleci olmayan, güven veren.* Kadın ya da
erkek fark etmez.

**Turnusol satırı:** `vo_09` — "Cevabı yapay zekâ veriyor. Kaynak senin
ilanın." Bu iki cümlede ses hem otorite hem sıcaklık taşıyabiliyorsa doğru
sestir.

---

## Sonraki adım

10 dosyayı `vo_01.mp3` … `vo_10.mp3` olarak üret ve gönder. Mix'i zaman
koduna göre yapar, −16 LUFS'a normalize eder, `-c:v copy` ile mux'larım —
görüntü asla yeniden kodlanmaz, sessiz master ayrı dosya olarak korunur.
