# remotion/public — filmin görselleri

Buradaki her dosya `src/reels/emlakci/content.json → assets` üzerinden çağrılıyor.
Bir sahne dosyası hiçbir zaman doğrudan bir dosya adı yazmaz; bu yüzden görsel
değiştirmek tek satırlık bir iş.

## Yeni görselleri buraya nasıl bırakırsın

Bu ortamın ağ ayarları Google host'larını (`drive.google.com`,
`drive.usercontent.google.com`, `lh3.googleusercontent.com`) blokluyor, o yüzden
Drive linkinden indiremiyorum. İki yol var:

**1 · GitHub üzerinden (en kolay, ~1 dakika)**

1. github.com/ondokuz9/Animation-Social-Media → branch `feat/evlek-video-system-v1`
2. `remotion/public/` klasörüne gir
3. **Add file → Upload files**, on bir görseli sürükle
4. Commit et — **dosya adlarını değiştirmene gerek yok**, hangisinin hangisi
   olduğunu ben açıp bakarak eşlerim ve doğru adlara taşırım.

**2 · Ağ ayarları üzerinden**

Ortamın network egress ayarlarına yukarıdaki üç host'u eklersen Drive linkinden
doğrudan çekebilirim. Bkz. https://code.claude.com/docs/en/claude-code-on-the-web

## Beklenen dosyalar

| hedef ad | ne | öncelik |
|---|---|---|
| `stage-00-bos.jpg` | boş salon (staging "önce") | zorunlu |
| `stage-01-akdeniz.jpg` | aynı oda · Akdeniz | zorunlu |
| `stage-02-modern.jpg` | aynı oda · modern | zorunlu |
| `stage-03-minimal.jpg` | aynı oda · minimal | zorunlu |
| `stage-10-balkon.jpg` | aynı dairenin balkonu | zorunlu |
| `stage-11-mutfak.jpg` | aynı dairenin mutfağı | zorunlu |
| `ilan-a-deniz.jpg` | deniz manzaralı teras | zorunlu |
| `ilan-b-bahce.jpg` | bahçeli müstakil ev | zorunlu |
| `ilan-c-site.jpg` | havuzlu site | zorunlu |
| `detay-isik.jpg` | zeminde pencere ışığı | opsiyonel |
| `detay-balkon.jpg` | balkon kapısında tül | opsiyonel |
| `girne-hava.jpg` | Girne kuşbakışı — **henüz yok** | kapanış zemini |

Ayrıntılı brief ve üretim prompt'ları:
`../../video-system/docs/EMLAKCI_REEL_ASSET_REQUESTS.md`
