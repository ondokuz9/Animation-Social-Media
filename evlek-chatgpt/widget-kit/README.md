# Evlek widget kiti

Evlek'in ChatGPT içinde gösterdiği gerçek widget'ı, canlı veriyle ve istenen çözünürlükte çizer. Kurgu ya da taklit yok: ChatGPT'nin iframe'e yüklediği HTML'in kendisi.

## Dosyalar

- `listing-cards-v3-14.html`: `ui://evlek/listing-cards-v3-14.html` (search_listings, search).
- `listing-detail-v3-11.html`: `ui://evlek/listing-detail-v3-11.html` (get_listing, fetch). 13 Kasım 2026'da canlıdan alındı.
- `result.json`: "Girne'de 200 bin £ altı satılık 2+1 daire" için canlı `search_listings` sonucu (`content` + `structuredContent`).
- `host.html` ve `host_fs.html`: MCP Apps (`ui/initialize`, `ui/notifications/tool-result`) konuşan basit bir ev sahibi sayfası. İkisi aynı; yalnız `displayMode` farklı (`inline` ve `fullscreen`).
- `render.js`: Playwright ile ekran görüntüsü alır.

## Çalıştırma

```
node render.js listing-cards-v3-14.html out.png host.html     # satır içi kartlar
node render.js listing-cards-v3-14.html out.png host_fs.html  # tam ekran liste
```

- Viewport 430×932, deviceScaleFactor 2. Video için 3 kullan.
- `result.json` aynı klasörde olmalı.

## Kurallar

- **Final öncesi yenile:** Widget HTML'ini ve sonuçları finalden önce canlı MCP'den yeniden çek (`resources/read`, `tools/call`). Sürüm adı değişmiş olabilir.
- **Animasyon:** Kaydırma, dokunma ve "Tümünü gör" geçişini widget'ın kendi davranışıyla yap. Playwright ile tıkla ya da kaydır, kareleri yakala, Remotion'da birleştir. Widget'ın görünümünü değiştirme.
- **Tema:** Gerçek ChatGPT kaydı açık temadaysa `theme: 'light'`, koyu temadaysa `'dark'`.
