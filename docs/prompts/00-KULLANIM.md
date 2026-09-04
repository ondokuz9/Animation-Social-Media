# Evlek — ChatGPT üretim promptları

Üç prompt, üç ayrı iş. Sırayla kullanılır:

| # | Dosya | Ne zaman | ChatGPT'den ne çıkar |
|---|---|---|---|
| 1 | `01-fikir-beyni.md` | Her Pazartesi | Üç konsept + seçim + yayın paketi |
| 2 | `02-gorsel-varlik-brifingi.md` | Bir kez, sonra eksik oldukça | SVG ikon/yapı/harita, PNG doku, damga, fotoğraf |
| 3 | `03-video-denetimi.md` | Her render sonrası | Kare hassasiyetinde P0/P1/P2 bulgu listesi + puan |

## Haftalık akış

1. **Pzt** — Canlı veriyi çek, `01`'i doldurup ChatGPT'ye ver → konsept seç.
2. **Sal** — Konsepti içerik JSON'una çevir (`content/<format>-<hafta>.json`).
3. **Çar** — `node scripts/hafta.mjs <Format> <içerik.json>` → render + kapı.
4. **Per** — Videoyu ve kontak sayfasını `03` ile ChatGPT'ye denetlet →
   P0'ları düzelt → yeniden render.
5. **Cum** — Yayınla (kapak + caption + 5 hashtag + ilk yorumda link).

## Kurallar (promptların içinde de var, burada da dursun)

- Sayı uydurulmaz. Kaynak vermiyorsa gösterilmez.
- Her veri karesinde kaynak + tarih.
- Konu `content/icerik-bankasi.json`'dan seçilir; icat edilmez.
- `needs` alanı dolu konu, o girdi gelmeden çekime alınmaz.
- Aynı sütun ve aynı dünya art arda iki hafta kullanılmaz.
