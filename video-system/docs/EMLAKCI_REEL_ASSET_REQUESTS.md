# Emlakçı Reel · görsel ihtiyaç listesi

Bu dosya, filmin şu anda **eksik olan** görsellerini listeler. Her madde için
neden gerektiği, teknik şartı ve doğrudan kopyalanabilir bir üretim prompt'u var.

Mevcut varlıklar (`remotion/public/`): `room-00-bos.jpg`, `room-01-akdeniz.jpg`,
`room-02-minimal.jpg`, `peek-balkon.jpg`, `wordmark.png`.

> **Film bunlarsız da render oluyor.** Her yeni görsel `content.json` içinde bir
> anahtara bağlı; dosya gelmezse mevcut görsele düşüyor. Yani bekleme yok —
> görseller geldikçe kalite artıyor.

---

## En kritik teknik şart: **aynı kamera**

Filmin en güçlü iki anı (staging wipe'ı ve üç varyasyon) yalnızca fotoğraflar
**birebir aynı kamera açısından** olduğunda çalışır. Duvarlar, pencere, kapı,
zemin çizgileri, ufuk hattı pikselinde aynı olmalı; sadece içerideki eşya
değişmeli. Kamera 2 derece kaysa wipe "geçiş" değil "kesme" gibi okunur ve
etki tamamen kaybolur.

**Yöntem:** metinden sıfırdan 4 ayrı görsel üretme. **Bir tane** boş oda üret,
sonra onu **görselden-görsele düzenleme** (Gemini image editing / Nano Banana
"edit this image") ile döşe. Her düzenleme prompt'unun sonunda şu cümle olmalı:

> *Keep the exact same camera angle, focal length, wall positions, window, door,
> floor tiles and lighting direction. Only add furniture and decor. Do not move
> the camera.*

---

## SET A — Ana ilan / staging seti (4 görsel) · **ZORUNLU**

Nerede kullanılıyor: Act 3 tam ekran staging wipe'ı, Act 4 üç varyasyon beat'i,
telefon içindeki ilan kartı, Act 5 eşleşme diyagramının merkezi.

Format: **1080 × 1920 dikey** (tam ekran kullanılıyor, yatay görsel kırpılınca
oda kayboluyor). JPEG, yüksek kalite.

| dosya | ne |
|---|---|
| `stage-00-bos.jpg` | boş, döşenmemiş salon |
| `stage-01-akdeniz.jpg` | aynı oda · Akdeniz stili |
| `stage-02-modern.jpg` | aynı oda · modern stil |
| `stage-03-minimal.jpg` | aynı oda · minimal stil |

### A0 — boş oda (önce bunu üret, diğerleri bunun düzenlemesi)

```
Vertical 9:16 real estate listing photo of an EMPTY, unfurnished living room in a
new-build apartment in Kyrenia, Northern Cyprus. Plain white walls, large
light-grey porcelain floor tiles, a wide sliding glass balcony door on the right
filling the room with warm late-afternoon Mediterranean daylight, a glimpse of
sea and palm through the glass. Completely bare: no furniture, no rug, no
curtains, no plants, no people. Slightly wide-angle, camera at chest height,
vertical lines straight, shot the way an estate agent shoots on a phone —
honest, a little plain, not a magazine. Natural colours, no HDR, no vignette.
No text, no watermark, no logo.
```

Bu görselin "biraz sıradan" olması **kasıtlı**: emlakçı kendi çektiği fotoğrafı
tanıyacak, sonra sistemin ne yaptığını görecek. Çok güzel bir "önce" fotoğrafı
etkiyi öldürür.

### A1 — Akdeniz stili (A0'ı düzenle)

```
Edit this photo: furnish this empty living room in a warm Mediterranean style —
a cream linen sofa, a low travertine coffee table, a jute rug, a large olive
tree in a terracotta pot near the balcony door, woven cushions in sand and
terracotta tones, a simple ceramic vase, soft sheer curtains. Warm, lived-in,
inviting.
Keep the exact same camera angle, focal length, wall positions, window, door,
floor tiles and lighting direction. Only add furniture and decor. Do not move
the camera. No text, no watermark, no people.
```

### A2 — modern stil (A0'ı düzenle)

```
Edit this photo: furnish this empty living room in a contemporary modern style —
a deep navy velvet sectional sofa, a black metal and smoked glass coffee table,
a large abstract canvas on the left wall, a slim arc floor lamp, a dark grey
low-pile rug, two sculptural ceramic objects. Crisp, architectural, high-end.
Keep the exact same camera angle, focal length, wall positions, window, door,
floor tiles and lighting direction. Only add furniture and decor. Do not move
the camera. No text, no watermark, no people.
```

### A3 — minimal stil (A0'ı düzenle)

```
Edit this photo: furnish this empty living room in a Japandi minimal style — a
low light-oak sofa with pale grey upholstery, one round paper floor lamp, a
single low oak bench, a small bonsai-like plant, an off-white wool rug. Very
few objects, lots of empty floor, calm and airy.
Keep the exact same camera angle, focal length, wall positions, window, door,
floor tiles and lighting direction. Only add furniture and decor. Do not move
the camera. No text, no watermark, no people.
```

---

## SET B — Arama sonuçları (3 görsel) · **ZORUNLU**

Nerede kullanılıyor: Act 6, alıcı cümleyle aradığında ekrana gelen üç ilan
kartı. Üçü de **belirgin biçimde farklı** görünmeli — aksi hâlde "sonuç listesi"
değil "aynı görselin üç kopyası" gibi okunuyor. Şu an elimizde bu üçlü yok.

Format: **1600 × 1200 yatay** (kart içinde yatay kırpılıyor).

| dosya | ne |
|---|---|
| `ilan-a-deniz.jpg` | deniz manzaralı teras |
| `ilan-b-bahce.jpg` | bahçeli müstakil ev |
| `ilan-c-site.jpg` | havuzlu modern site |

### B1 — deniz manzaralı teras

```
Horizontal real estate photo: a furnished apartment terrace in Kyrenia, Northern
Cyprus, looking out over the Mediterranean at golden hour. A rattan outdoor sofa
with cream cushions, a small round table, potted olive and bougainvillea, a
glass balustrade, the sea and distant mountains beyond. Warm low sun, natural
colours, no people, no text, no watermark.
```

### B2 — bahçeli müstakil ev

```
Horizontal real estate photo: a modern two-storey detached villa in Northern
Cyprus seen from its garden. White rendered walls, large windows, a mature lawn,
olive and citrus trees, a stone path to the front door, mountains in the far
background. Bright midday Mediterranean light, natural colours, no people, no
text, no watermark.
```

### B3 — havuzlu modern site

```
Horizontal real estate photo: a contemporary low-rise apartment complex in
Northern Cyprus with a landscaped communal swimming pool. Clean white and
warm-stone façades, generous balconies, palms and cypress, sun loungers, calm
blue water. Late afternoon light, natural colours, no people, no text, no
watermark.
```

---

## SET C — Girne kimliği (2 görsel) · **ÖNEMLİ**

Nerede kullanılıyor: açılış montajının ilk karesi ve kapanışta marka planının
altında yavaşça kayan zemin. Filmin "burası KKTC" demesi için tek şansı — şu an
hiç yer görseli yok, film havada duruyor.

Format: **1080 × 1920 dikey**.

| dosya | ne |
|---|---|
| `girne-hava.jpg` | Girne sahil şeridi, kuşbakışı |
| `girne-liman.jpg` | Girne antik limanı, akşamüstü |

### C1 — kuşbakışı sahil

```
Vertical 9:16 aerial drone photograph of the Kyrenia coastline, Northern Cyprus,
at golden hour. Turquoise and deep blue Mediterranean water meeting a rocky
shore, low white buildings with terracotta roofs among palms and cypress, the
Beşparmak mountain ridge rising behind. Warm low sunlight, long soft shadows,
natural colours, cinematic, no people visible, no text, no watermark, no logo.
```

### C2 — liman

```
Vertical 9:16 photograph of Kyrenia's old harbour, Northern Cyprus, in the blue
hour just after sunset. Stone harbour wall, moored boats, warm window light from
the old buildings along the quay, the round castle tower on the right, calm
water reflecting the lights. Cinematic, natural colours, no crowds, no text, no
watermark.
```

---

## SET D — Makro detaylar (2 görsel) · **İSTEĞE BAĞLI ama açılışı çok güçlendirir**

Nerede kullanılıyor: açılış montajının sert kesmeleri arasında 8–10 karelik
nefes planları. Montaj sadece arayüzden oluşursa yorucu oluyor; araya giren
fiziksel doku onu "reklam" hissettiriyor.

Format: **1080 × 1920 dikey**.

| dosya | ne |
|---|---|
| `detay-isik.jpg` | zeminde pencere ışığı |
| `detay-balkon.jpg` | balkon kapısında tül, deniz bulanık |

### D1

```
Vertical 9:16 macro photograph: warm late-afternoon sunlight falling through a
window onto a pale porcelain tile floor, casting a sharp geometric shadow, a
corner of a jute rug at the edge of frame. Very shallow depth of field, warm
tones, quiet and still. No people, no text, no watermark.
```

### D2

```
Vertical 9:16 photograph: a sheer white curtain lifting slightly in the breeze at
an open balcony door, the Mediterranean sea and sky completely out of focus
beyond it. Warm daylight, very shallow depth of field, calm. No people, no text,
no watermark.
```

---

## Üretim notları

1. **Metin yok.** Hiçbir görselde yazı, filigran, logo, arayüz elemanı olmasın —
   filmin bütün tipografisi vektör olarak üstte çiziliyor.
2. **İnsan yok.** Yüz girdiği anda izleyicinin gözü oraya kilitleniyor ve
   ürünü bırakıyor. Ayrıca temsilî görselde kimlik sorunu doğuruyor.
3. **HDR / aşırı işlem yok.** Filmin paleti lacivert + krem + altın; aşırı
   doygun görsel bu paletin dışına düşüyor.
4. **Dosya adları yukarıdaki tabloyla birebir aynı olsun**, doğrudan
   `remotion/public/` içine bırakılabilsin.
5. Öncelik sırası: **SET A → SET B → SET C → SET D**. Sadece SET A gelse bile
   filmin en güçlü iki anı çalışır hâle geliyor.
