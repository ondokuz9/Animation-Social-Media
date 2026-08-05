# Emlakçı Reel · v5 — filmin kendisi

20.000 sn · 1200 kare · 60 fps · 1080×1920 · sessiz
Kaynak: `remotion/src/reels/emlakci/`

Bu belge, çekilmiş filmin **kare seviyesinde** dökümüdür. v4 bir brifingdi; bu,
kodun ne yaptığının kaydı. Bir sayı değişirse burası da değişir.

---

## 0 · Filmin tek cümlesi

> Emlakçı bir şey yapar — **Yayınla**'ya basar. Gerisini sistem yapar, ve emlakçı
> her adımda onaylar.

Filmdeki her plan bu cümlenin ya "bir şey"ini ya da "gerisi"ni gösterir. Bunun
dışında kalan hiçbir şey filme girmedi.

---

## 1 · Kurgu tablosu

| # | perde | kare | sn | zemin | register | kim |
|---|---|---|---|---|---|---|
| 1 | Açılış | 0–167 | 2.80 | karışık | sert kesme montajı | — |
| 2 | Yayınla | 168–359 | 3.20 | krem | cihaz · makro → geniş | emlakçı |
| 3 | Diller | 354–485 | 2.20 | krem | sadece tipografi | — |
| 4 | Staging | 486–665 | 3.00 | fotoğraf | tam ekran, arayüz yok | — |
| 5 | Match | 666–809 | 2.40 | lacivert | çizilmiş diyagram | — |
| 6 | Arama | 810–965 | 2.60 | krem | tam ekran arayüz | alıcı |
| 7 | Asistan | 966–1079 | 1.90 | lacivert | sohbet, yüzey yok | alıcı |
| 8 | Kapanış | 1072–1199 | 2.13 | lacivert | marka planı | — |

**Kural:** ardışık iki perde aynı zemin rengini, aynı kamera davranışını ve aynı
konuyu paylaşamaz. Bu filmin bir önceki kurgusu 10.8 saniye boyunca tek kamera
pozisyonundan tek telefondu — teknik olarak temiz, izlenebilir değil.

**Geçişler:** beşi sert kesme, ikisi dissolve.

- `Yayınla → Diller` · 6 kare. İki zemin de krem ve **konu aynı cümle**: az önce
  yazılan açıklama, birazdan çevrilecek olan. Buradaki sert kesme filmdeki tek
  gerçek match'i çöpe atardı.
- `Asistan → Kapanış` · 8 kare. Lacivertten laciverte; bir cevabın bir isme
  oturması.

Geri kalan her kesme sert, çünkü register değişimi zaten noktalama.

---

## 2 · Perde perde, kare kare

### Perde 1 · Açılış (0–167)

Beş plan, her biri **17 kare** (283 ms), aralarında beyaz flash **yok**.

| kare | plan | kaynak | perde-içi zaman | kamera | kelime |
|---|---|---|---|---|---|
| 0–16 | fotoğraf | Staging | 1.52 → 1.78 | 1.000 → 1.045 | FOTOĞRAF |
| 17–33 | tipografi | Diller | 1.19 → 1.34 | 1.035 → 1.000 | BEŞ DİL |
| 34–50 | diyagram | Match | 1.88 → 2.12 | 1.000 → 1.050 | GÖRÜNÜRLÜK |
| 51–67 | arayüz | Yayınla | 1.94 → 2.16 | 1.040 → 1.000 | AÇIKLAMA |
| 68–84 | sonuç | Arama | 1.94 → 2.18 | 1.000 → 1.040 | ALICI |

Her plan filmin **gerçek** bir karesi: ilgili perdenin kendi zaman çizgisi kendi
zaman kodundan çalıştırılıyor (`<Scene tOverride={…} bare />`). Montaj filmi
taklit etmiyor, filmin kendisi — sırasız hâli. Söz verdiğini bu yüzden
tutabiliyor.

Kamera yönü plandan plana ters çevriliyor (içeri / geri). Beş plan aynı yöne
yaklaşırsa montaj tek bir titreşimli dokuya dönüşüyor.

**Beyaz flash neden yok:** 1.4 saniyede beş tam ekran parlaklık atlaması,
fotosensitif izleyiciler için gerçekten riskli aralığa giriyor. Register
değişimleri zaten kendi noktalamasını yapıyor.

| kare | ne |
|---|---|
| 85 | montaj biter, **her şey durur** — boş form, tek kare |
| 85–167 | kamera 1.00 → 1.16, `transform-origin: 364px 1278px` (Yayınla tuşu) |
| 90 | `"Bunları sen yapmadın."` girer (dur.sm) |
| 125–133 | çıkar |
| 130 | `"Sen sadece Yayınla'ya bastın."` girer — **ve hiç çıkmaz** |

İkinci satır kesme anında hâlâ ekranda. Sonraki perde bir cümleden sonra değil,
cümlenin ortasında başlıyor.

### Perde 2 · Yayınla (168–359 · perde-içi 0.00–3.20)

Filmin tek kamera hareketi burada ve kasten en yavaş şeyi (0.62 sn, `dur.xl`).

| sn | ne |
|---|---|
| 0.00 | **makro**, 3.0×, Yayınla tuşuna kilitli (ölçülen konum: 364 × 1278) |
| 0.10–0.52 | imleç sağ alttan gelir |
| 0.55 | basış — 120 ms aşağı, 80 ms geri (asimetrik; insan yarısı makineninkinden fazla hak eder) |
| 0.68 | halka tuştan ayrılır, etiket `Yayınlandı` olur |
| 0.74–0.96 | tik çizilir (`stroke-dashoffset`) |
| 0.78–1.40 | **kamera geri çekilir** 3.0× → 1.0×, cihaz −0.4° → −2.2° eğilir |
| 1.30–1.52 | form, yazılmış ilana çapraz geçer (`form` sürekli, anahtar değil) |
| 1.44–2.32 | açıklama kelime kelime yazılır |
| 2.34 | `Onayla`, Yayınla'nın bıraktığı **aynı yuvada** belirir |
| 2.58 | emlakçı onaylar |
| 2.72–2.98 | `Onaylandı`, tik çizilir |
| 2.92–3.20 | ilk "yapıldı" satırı altta belirir |

Makro sırasında kamera tuşu kadraja **ortalar** (`lookX/lookY`), geri çekilirken
bu kaydırmayı geri verir. `camP = 1`'de düzen tam olarak diğer perdelerin
beklediği yerde.

Cihaz içindeki her hareket 300 ms altında (arayüz zamanlaması). Kamera 620 ms
(film zamanlaması). İki sözlüğü karıştırmamak, bir ürün filmini ekran kaydından
ayıran şey.

### Perde 3 · Diller (354–485 · 0.00–2.20)

Cihaz yok, kart yok, fotoğraf yok. Konu cümlenin kendisi.

| dil | başlangıç | süre |
|---|---|---|
| TR | 0.30 | 0.55 |
| EN | 0.85 | 0.32 |
| RU | 1.17 | 0.29 |
| DE | 1.46 | 0.26 |
| AR | 1.72 | 0.48 (kalır) |

Süreler **hızlanıyor**. Türkçe okunacak kadar duruyor; sonrası giderek kısalıyor.
Hızlanmanın kendisi argüman — "ve devam ediyor"u tek satır metin yazmadan söylüyor.

Devir 170 ms sürüyor ve blur köprüsüyle: saf crossfade "dissolve" gibi okunuyor,
blur "dönüşüm" gibi. Alt şeritteki altın çizgi kodlar arasında **kayıyor**, sert
geçmiyor — sert geçiş beş ayrı durum, kayma tek şeyin beşinden geçmesi.

Arapça en sonda ve bütün bloğu sağdan sola çeviriyor (`direction: rtl`). Detay
tam olarak mesele: bu, Türkçe düzene iliştirilmiş bir çeviri etiketi değil,
ilanın o alıcıda göründüğü hâli.

**Yazı tipi:** Hanken Grotesk'te ne Kiril ne Arap alfabesi var. `brand/nonlatin.css`
IBM Plex Sans Arabic + Noto Sans'ı gömüyor (ikisi de OFL). Olmasaydı tarayıcı
sessizce DejaVu'ya düşecekti — konusu yazı tipi olan tek planın ortasında görünür
bir yazı tipi değişimi.

### Perde 4 · Staging (486–665 · 0.00–3.00)

| sn | ne |
|---|---|
| 0.00–3.00 | push 1.000 → 1.055, hiç durmaz |
| 0.28 | `AI ile görselleştirildi · Temsilî` rozeti |
| 0.45–1.80 | **wipe**: boş oda → döşenmiş. Yavaş, çünkü perdenin bütün iddiası iki hâl arasındaki fark ve hızlı wipe tam olarak onu gizler |
| 1.78–2.12 | altın halka, tutamağın durduğu yerden dışarı |
| 1.95 | varyasyon şeridi yükselir (koyu panel üzerinde — parlak fotoğrafta okunması için) |
| 2.20 | Modern'e çapraz geçiş (300 ms) |
| 2.60 | Minimal'e çapraz geçiş |

Varyasyonlar **kesme değil dissolve**, çünkü aynı odanın aynı kameradan çekilmiş
iki fotoğrafını çaprazlamak mobilyayı dönüşüyor gibi gösteriyor. Bu yalnızca
kaynak fotoğraflar kamerayı paylaşırsa çalışıyor — `EMLAKCI_REEL_ASSET_REQUESTS.md`
SET A'nın tek teknik şartı bu.

Rozet, üretilmiş bir görsel ekranda olduğu **her** karede duruyor. Mülk satarak
geçinen bir kitle için bu hukuki bir dipnot değil, güven altyapısı — ve emlakçının
bunu paylaşabilmesinin sebebi.

### Perde 5 · Match (666–809 · 0.00–2.40)

Filmin görünmez olan tek şeyinin resmi: ilanın doğru alıcıların önüne çıkması.

| sn | ne |
|---|---|
| 0.00–0.38 | ilan kartı merkeze gelir — **bir önceki perdenin bittiği fotoğrafla** (match cut) |
| 0.28–0.92 | alıcı alanı belirir: 3 eşleşme + ~30 pazar noktası, tohumlanmış rastgelelik |
| 0.55, 1.10 | iki halka merkezden dışarı yayılır (statik yıldız patlaması "erişim" gibi okunmuyor; bir şeyin gitmesi gerekiyor) |
| 0.82–1.74 | altın çizgiler sırayla çizilir (`stroke-dashoffset`) |
| 1.70–2.14 | eşleşmeyen noktalar söner, kart altın çerçeve alır |

**Dürüstlük notu:** hiçbir bildirim gönderilmiyor. İlan, niyeti ona yakın olan
alıcılara çıkıyor. Çizim bu yüzden yayın değil **yakınlık**: yakın noktalar
bağlanıyor, uzaklar sönüyor.

### Perde 6 · Arama (810–965 · 0.00–2.60)

Cihaz tamamen düşüyor — kadrajın kendisi uygulama. Kesmenin anlamı ekran
değiştirmemiz değil, **kişi** değiştirmemiz.

| sn | ne |
|---|---|
| 0.05–0.72 | cümle kendini yazar, öbek öbek (karakter karakter değil — 60 fps'te ucuz duruyor) |
| 0.74 | gönderim: alan içeri basılır, odak halesi çöker |
| 0.82–1.42 | **imza hareket**: her öbek *yerinde* filtreye dönüşür — 100 ms arayla, 260 ms'de |
| 1.30 | `4 KRİTERE UYAN İLANLAR` |
| 1.42–2.02 | üç sonuç, 90 ms arayla |
| 1.98–2.26 | emlakçının ilanı altın çerçeve + `Senin ilanın` rozeti alır |

Öbekler uçmuyor, kopyalanmıyor, altta ayrı bir çip sırası doğurmuyor. Oldukları
yerde padding, altın saç teli ve pill yarıçapı kazanıyorlar. Hareket hakkını
şuradan alıyor: gerçekte olan bu. Arama, cümlenin yapıştırıldığı bir form değil —
**cümle aramanın kendisi**.

> Önceki kurguda sorgunun altına bir köşeli parantez çiziliyor ve altında çipler
> patlıyordu. Aynı fikri iki kere söylüyor ve özelliğin kendisi yerine
> özelliğin diyagramı gibi duruyordu. Atıldı.

### Perde 7 · Asistan (966–1079 · 0.00–1.90)

Filmin, ekranda hiçbir ürün yüzeyi olmayan tek perdesi.

| sn | ne |
|---|---|
| 0.12 | alıcının sorusu sağdan girer (krem balon — ekrandaki tek insan çıktısı) |
| 0.50–0.84 | okuma göstergesi: altın yay, 340 ms |
| 0.52 | asistan işareti (dört uçlu kıvılcım) |
| 0.80–1.52 | cevap kelime kelime akar — balon yok, sistem cevabı konuşan bir insan değil |
| 1.40–1.82 | **kaynak satırı** çizilir: `KAYNAK: EVLEK.APP` |

Kaynak satırı perdenin bütün argümanı. Atıfsız bir cevap chatbot'tur; atıflı bir
cevap, emlakçının ilanının hiç açmamış bir alıcıya okunmasıdır.

Burada bir sohbet ürününün adını anıp entegrasyon ima etmek kolay olurdu.
Gerçekte doğru olan daha basit ve daha güçlü: ilan, onu okuyan bir makinenin
alıcının sorusunu ondan cevaplayabileceği ve nereden aldığını söyleyebileceği
şekilde yazılıyor.

### Perde 8 · Kapanış (1072–1199 · 0.00–2.13)

| sn | ne |
|---|---|
| 0.00–2.13 | Girne arkada %16, push 1.06 → 1.00 |
| 0.08 | logo |
| 0.34 | altın çizgi ortadan açılır |
| 0.46 | `Sen ilanı koy.` |
| 0.62 | `Gerisi Evlek'te.` (altın) |
| 0.96 | `evlek.app` |
| 1.20 | `hello@evlek.app` |
| 1.40–2.13 | durur |

Dikey bir filmin son iki saniyesi, izleyicinin harekete geçip geçmeyeceğine karar
verdiği tek yer, ve bunu bir özellik listesine değil tek bir cümleye bakarak
yapıyor. O yüzden kapanışta tam olarak bir fikir var: filmin baştan beri
gösterdiği iş bölümü. Sonra adres.

---

## 3 · Hareket sözlüğü

Her süre ve her easing `brand/tokens.js`'e çözülüyor. Kendi 340 ms'ini uyduran
bileşen hatadır.

```
dur.xs 0.18  basış, toggle          ease.out    0.22 1 0.36 1   giriş VE çıkış
dur.sm 0.20  bir satır metin        ease.inOut  0.77 0 0.175 1  ekran içi hareket
dur.md 0.28  kart, çip, blok        ease.drawer 0.32 0.72 0 1   kenardan panel
dur.lg 0.42  morph, ekran değişimi  ease.linear                 sabit hız (yazma, drift)
dur.xl 0.62  kamera hareketi
```

`ease.in` **yok**. Kasten: ease-in yavaş başlar ve izleyicinin tam olarak baktığı
anı geciktirir; aynı sürede bile ağır okunur. Token olmayınca yanlışlıkla
uzanılamıyor.

`dur.lg` ve `dur.xl` yalnızca **kamera** için. Telefonun içindeki bir tuş
bunları kullanamaz.

**Motion SVG envanteri** (hepsi `stroke-dashoffset` / `pathLength`, kütüphane yok):

| nerede | ne |
|---|---|
| `DrawnCheck` | Yayınlandı / Onaylandı tikleri, 220 ms |
| `DoneRow` | "yapıldı" satırlarındaki tik |
| Match | eşleşme çizgileri, iki referans çemberi, iki yayılan halka |
| Staging | wipe tutamağındaki çift ok |
| Asistan | okuma yayı (dönen `strokeDasharray`), kıvılcım |
| Kapanış | altın çizginin ortadan açılması |
| `SearchField` | büyeç ikonu |

---

## 4 · İddia disiplini

Filmdeki her cümlenin arkasında ne olduğu:

| ekranda | dayanak |
|---|---|
| "Bunları sen yapmadın." | montaj yalnızca sistemin ürettiklerini gösteriyor; emlakçının girdisi bir basış |
| "Sen sadece Yayınla'ya bastın." | sonraki perde bunu tek planda yapıyor |
| "Onay hep sende kalıyor." | onay adımı üründe var ve perdede gösteriliyor |
| "İlanın beş dilde." | evlek.app şu an 5 dilde |
| "Boş oda, döşenmiş görünüyor." | görsel üretimi; rozet her karede ekranda |
| "İstediğin stili seç." | emlakçı seçiyor; otomatik mod toggle'ı var, filme sokulmadı |
| "Doğru alıcının karşısına çıkıyor." | embedding'e göre önüne çıkma — bildirim **değil**, çizim de yakınlık |
| "Alıcı cümleyle arıyor." | doğal dil arama |
| "Yapay zekâ da senin ilanını okuyor." | kaynak atıflı cevap |

Filmde **koçan yok**, rakip yok, rakip ismi yok, uydurma sayı yok, yüzde yok,
"3 kat daha fazla" yok. Fiyat ve konum temsilî; hiçbiri gerçek bir ilan değil.

---

## 5 · Görsel bağımlılığı

Film şu anda `remotion/public/` içindeki dört fotoğrafla render oluyor ve
bunların ikisi iki farklı rolde kullanılıyor. `content.json → assets` her anahtarı
bir dosyaya bağlıyor; yeni görseller geldiğinde **yalnızca o tablo** değişiyor,
tek bir sahne dosyası bile açılmıyor.

Eksikler ve üretim prompt'ları: `EMLAKCI_REEL_ASSET_REQUESTS.md`.

En kritik olanı SET A: aynı odanın aynı kameradan boş + üç stil hâli. Wipe ve üç
varyasyon beat'i tam olarak buna dayanıyor.

---

## 6 · Render ve master

```
cd remotion
npx remotion render src/index.js EmlakciReel out/seq --sequence --image-format=png \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
  --concurrency=3
node encode-emlakci.mjs
```

`encode-emlakci.mjs` encode'u yeniden yazmıyor — onaylı V7 hattının kullandığı
`render/encode.mjs`'deki **aynı** `encode()`'u çağırıyor. Tek encoder olması
versiyonlamanın bütün amacı; ikinci bir argüman seti, kayabilecek ikinci bir şey
demek.

Çıktı: `remotion/out/evlek_emlakci_reel_1080x1920_60fps_silent_master.mp4`
H.264 High · progressive · yuv420p · BT.709 limited · CRF 17 · preset slow ·
16M/24M · faststart · sessiz.

V7 master'ına dokunulmuyor. `npm run baseline:check` bunu doğrulamalı.
