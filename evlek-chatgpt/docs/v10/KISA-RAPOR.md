# VIDEO-1 v10 · Kısa rapor

14 Kasım 2026 · `video/evlek-chatgpt-v10` · kompozisyon `V10-916` (`src/v10/`)
30,0 sn · 1080×1920 · 60 fps · sessiz · Remotion 4.0.300

## Onur'a sorular (önce bunlar)

1. **Eklenti sayfasındaki soru kartları İngilizce.** Gerçek Evlek sayfasındaki metinler İngilizce ("@Evlek Show me apartments for sale in Kyrenia…"). Ben gerçeğe sadık kalıp İngilizce bıraktım. Türkçe filmde Türkçe karşılıkları mı görünsün? Bu durumda sayfa gerçekte olmayan bir metin göstermiş olur; dipnot bunu karşılıyor ama karar senin.
2. **EVL-100102'nin alanı:** MCP "107 m²" diyor (tipi boş), evlek.app sayfası "107 m² Kapalı", v9 tablosu "tipi belirtilmemiş". Filmde yalnız "107 m²" yazdım, EVL-101433 için "104 m² brüt". Kanıt sahnesinde 107'nin yanına "kapalı" yazılsın mı?
3. **Boş sohbet ekranındaki "Evlek hazır · Kuzey Kıbrıs'ta ev ara, karşılaştır." metni** benim yazdığım temsilî bir karşılama (kanca ve "Sohbette dene" sonrası). Gerçek ChatGPT bunu göstermiyor. Kalsın mı, yoksa boş ekran + yalnız çip mi?
4. **İlk soru metni kısaltıldı:** Gerçek oturumdaki "…satılık 2+1 daire göster." yerine dışarıda ve balonda "Girne'de £160 bin altı, deniz manzaralı 2+1 daire" yazıyor. £160 bin sınırını bilerek tuttum, çünkü 52 sonucu bu sınır doğruluyor. Uygun mu?
5. **EVL-100336 kapak fotoğrafında havuzda insanlar var.** Kartta yalnız bina kadrajda kalacak şekilde kırptım. Bu ilanın kartı tamamen çıkarılsın mı?
6. **Yayın öncesi canlı doğrulama:** Fiyatlar ve sayılar 14 Kasım MCP kaydından (52 / 8 ilan, £105–147 bin). Yayından önce canlıdan yeniden kontrol edilmeli.

## Teslim

- **MP4:** `out/v10.mp4` · 35,6 MB · h264 · 1800 kare · 30,000 sn · sha256 `f402aef7aa8c92cbd778950a40987dd1685fc10035d6dc02541606fb2dd84c7b`. MP4 git'e girmedi.
- **GitHub pre-release "v10-taslak" oluşturulamadı.** Bu bulut oturumunda `gh` oturum açılmış değil ("Failed to log in… GH_TOKEN"). GitHub MCP araçlarında da release oluşturma ya da dosya ekleme yok. MP4 sohbete dosya olarak gönderildi. Release'i Onur'un yerelinden şu komutla açabilirsin: `gh release create v10-taslak --prerelease --target video/evlek-chatgpt-v10 out/v10.mp4`
- **Görseller:** `v10_izgara_2fps.jpg` (60 kare), `v10_okunurluk_360x640.jpg` (60 kareyi 360×640'ta gösterir) ve `kareler/` (16 anahtar kare, 540×960).
- **Yeniden üretim:** Önce `npm i`, sonra `npx remotion render src/index.ts V10-916 out/v10.mp4 --crf 18 --muted`. Bu ortamda 4 çekirdekle yaklaşık 33 dk sürdü. Izgara için `bash scripts/v10-grid.sh out/v10.mp4 docs/v10`.

## Ne yapıldı (plana göre)

| Saniye | Bölüm | Durum |
|---|---|---|
| 0,0–1,6 | Derecelendirilmiş Lapta havuzu, sağ altta tam telefon. "Bir sabahın böyle başlasa?" ilk karede tam opak. 1,0 sn'de "ChatGPT'de Evlek'e sor." gelir. | ✔ |
| 1,6–3,0 | Fotoğraf bulanıklaşıp lacivert teknoloji zeminine geçer (hız rampası), telefon döner ve yaklaşır. Soru dışarıda büyük yazılır, yazım kutusuna uçar; gönder basmasına telefon fiziksel tepki verir. Klavye yok. | ✔ |
| 3,0–4,5 | Yeni widget: koyu OpenFreeMap haritası, 12 semtin gerçek sınırları, cam fiyat kapsülleri ("£95–155 bin · Alsancak · 14"), "Girne · Satılık · 52 ilan" ve kartlar. | ✔ |
| 4,5–7,4 | Lapta sorusu, haritanın Lapta'ya uçuşu, mercan Lapta sınırı ve "£105–147 bin · 8 ilan". Kartlar ucuzdan pahalıya kayar, £139.000'de durur ve basılır. | ✔ |
| 7,4–8,7 | Portal: telefon düzleşir, kart ekrandaki kendi köşelerinden kalkar ve kareyi doldurur; derecelendirme kartla birlikte gelir. Telefon sağ alttan geri girer. | ✔ (bkz. sapma 4) |
| 8,7–12,5 | Havuz + künye (£139.000 · Lapta · 2+1 · 107 m² · deniz manzarası), sonra iç mekân `_01` ve `_03`. Telefondaki galeri (1/14 → 2/14 → 4/14) arka planla aynı karede değişir. | ✔ |
| 12,5–14,5 | Karşılaştırma sorusu, ardından yeniden tasarlanmış kompakt karşılaştırma kartı. | ✔ |
| 14,5–17,0 | Kanıt: iki gerçek fotoğraf, iki fiyat ve alan, tek vurgu "Fiyat farkı £12.000 %9,4". Telefon altta görünür. | ✔ |
| 17,0–19,0 | "£139.000 daire ↗" bağlantısına basılır → evlek.app'te aynı ilan (gerçek sayfa görüntüsü, iskelet yok) → geri çekilme. | ✔ |
| 19,0–24,5 | Eklentiler: "evlek" araması → Evlek sayfası (degrade soru kartları) → "Eklentiyi kur" → "Bağlı ✓" → "Sohbette dene" → Evlek çipli sohbet. Üstte ChatGPT › Eklentiler › Evlek adım çipleri. Üçüncü taraf logosu, ad, e-posta ve bildirim yok. | ✔ |
| 24,5–29,6 | Lacivert kapanış: temiz logo, "artık ChatGPT'de.", 58 px CTA, adım çipleri, 28 px dipnot. Telefon altta, ekranda bağlı Evlek sayfası. | ✔ |
| 29,6–30,0 | Döngü: havuz ve kanca, son kare ilk kareyle neredeyse aynı. | ✔ |

**Düzeltilen v9 hataları:**
- **Telefon kalınlığı:** `scale3d` ile 150 px kalınlık. Kalınlık 18 dolu katmandan oluşuyor ve yan tuşlar artık yan yüzde.
- **Logo:** E'deki çapraz kesik ve v/k'deki diken üçgenler vektörleştirme artığıydı. Logo aynı ölçülerle tek parça yeniden yazıldı (`src/v10/core.tsx`).
- **Kart hayaleti:** Portalda opaklık yok; başlangıç dikdörtgeni ekrandaki kartın kendisinden hesaplanıyor.
- **Logo ile telefon çakışması:** Kapanışta telefon 1190 px'in altında kalıyor.

**Değişmeyenler:** v7/v8 kodu, `wcap` bağımlılığı (v10 kullanmıyor) ve `evlek-chatgpt/` dışındaki hiçbir dosya. Tek dış değişiklik `src/Root.tsx`'e eklenen `V10-916` kaydı.

## Plandan sapmalar

1. **Hareket bulanıklığı (`CameraMotionBlur`) yok.** Hız rampaları easing ve bulanıklaşan fotoğraf geçişiyle yapıldı. Motion blur render süresini örnek sayısı kadar katlıyor; v10.1'de yalnız 3 geçiş penceresine eklenebilir.
2. **İlk soru kısaltıldı.** "göster." çıkarıldı, £160 bin sınırı kaldı (Soru 4).
3. **Mesaj bantları** yer yer plandaki önerilerden farklı ve hepsi tek satır, 66 px: "Sor. Evlek göstersin." · "8 ilan, ucuzdan pahalıya." · "İki ilan, yan yana." · "Aynı ilan, evlek.app'te." "Lapta'da 8 ilan · £105–147 bin" 64 px'te tek satıra sığmadı; bu bilgi haritadaki kapsülde duruyor.
4. **Telefon portalda ~0,9 sn görünmüyor (7,8–8,6 sn).** Kart kareyi doldururken telefonu örtüyor, telefon sonra sağ alttan giriyor. "Telefon her an" kuralından bilinçli tek kopuş.
5. **Köşe logosu 3–19 sn arasında.** 19 sn'den sonra Eklentiler adım çipleriyle çakıştığı için kaldırıldı; kapanışta büyük logo var.
6. **Kapanıştaki adım çipleri** dış açıklama grafiği. 52 px okunurluk kuralı için büyütüldü.
7. **Dış yazılar ≥52 px; telefon içi arayüz değil.** Arayüz yazıları çıktıda 25–50 px arasında. Fiyatlar (£139.000 vb.) 360×640'ta okunuyor, kart ayrıntıları okunmuyor; bilinçli olarak dışarıdaki künye ve bantlar taşıyor.
8. **Haritalar statik görüntü** (`public/v10/map`). OpenFreeMap verisiyle `scripts/v10-map` betiği üretildi; koyu stil bana ait. Atıf "© OpenFreeMap · © OpenStreetMap" widget köşesinde.
9. **15 sn / 6 sn kesimler yapılmadı** (plan gereği v10'dan sonra).

## Dürüst puan (10 üzerinden, benim değerlendirmem)

| Ölçüt | v9 (kurul) | v10 | Not |
|---|---|---|---|
| Kanca | 6 | 7 | Tek fotoğraf, tek soru, tanınan telefon. Telefon ekranı karanlık ve küçük; ilk karede ürünü göstermiyor. |
| İlan arzusu | 5 | 7,5 | Portal ve mekân bölümü filmin en iyi yeri. Havuz fotoğrafı 1,6× büyütüldüğü için hafif yumuşak. |
| Telefon gerçekliği | 5,5 | 7,5 | Kalınlık, yan tuşlar ve gölge doğru. Ekran camında yansıma yok (arayüze efekt kuralı). |
| Görsel zenginlik | 5 | 7 | Harita ve semt sınırları güçlü. 2,0–2,9 sn'de telefon ekranı neredeyse boş siyah. |
| Tempo | 4,5 | 7 | Klavye ve tablo yok. 12,5–13,4 sn'deki soru geçişi biraz ağır. |
| Ürünün seksiliği | 5 | 7 | Widget'ın yeniden tasarımı ciddi bir sıçrama. Eklenti bölümü hâlâ "arayüz gezintisi" hissi veriyor. |
| Kapanış | 5,5 | 7 | Okunur ve sakin, ama 5 sn boyunca neredeyse hareketsiz. |

**Genel: ~7/10.** v9'a göre belirgin bir sıçrama; Onur'un istediği 2–3 katın ilk adımı, "dünya standardı" değil. Bu sürüm ses olmadan da anlatıyor, ancak müzik ve ses efekti (Faz B) tempoya en çok katkıyı verecek.

## v10.1 için önerilerim (öncelik sırasıyla)

1. **2,0–2,9 sn:** Boş siyah sohbet yerine soru balonunun arkasında haritanın erken "ön ışığı". Ya da Evlek yükleme izi büyük ve markalı olsun.
2. **Kapanış:** Telefon ekranında "Sohbette dene" anı ve logoda ince ışık süpürmesi; son 5 sn "ölü" görünmesin.
3. **Portal:** 7,8–8,6 sn arasında telefon küçük de olsa görünür kalsın. Kartın arkasından, sağ altta erken girebilir.
4. **Eklenti bölümü (5,5 sn):** 4,5 sn'ye sıkıştırılabilir. Kazanılan 1 sn mekân bölümüne verilebilir.
5. **Havuz fotoğrafının daha yüksek çözünürlüklü özgün dosyası** varsa kanca keskinleşir. Şu an kaynak 1600×1200.
6. **Motion blur** yalnız üç hız rampasında.
