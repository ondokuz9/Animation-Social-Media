# VIDEO-1 v11 · Kısa rapor

14 Kasım 2026 · dal `video/evlek-chatgpt-v10` · kompozisyon `V11-916` (`src/v11/`; v10 olduğu gibi duruyor)
30,000 sn · 1080×1920 · 60 fps · 1800 kare · sessiz · `out/v11.mp4` 22,4 MB · sha256 `61ca9daa982632834a5ae9953483998ee8c186204843d9527883f1073b79e980` (MP4 git'e girmez)

Temel: `docs/v10/KURUL-v10.md` (10 kişilik kurul) ve Rumi'nin onayı (14 Kas):
1. Kanca A (logo + "artık ChatGPT'de.", logonun çipe inişi); B yedek.
2. Tek Lapta sorgusu.
3. Havuzda telefonsuz nefes.
4. Tempo "biraz yavaşlasın, insan gözüne göre".

## Onur'a sorular

1. **Varsayımla ilerlediğim üç karar.** Kurulun kararını uyguladım; itiraz varsa söyleyin:
   - karşılaştırma 3,5 sn'lik tek vuruş olarak kaldı;
   - evlek.app bölümü çıkarıldı;
   - CTA "Eklentiler'den Evlek'i ekle." oldu ve film boyunca "sen" diye hitap ediliyor.
2. **Eklenti sayfasındaki soru kartları** gerçekteki gibi İngilizce kaldı. Türkçe mi olsun?
3. **İlk 5 sn telefon ekranı boş sohbet.** Kurulun kararıydı (kanca A), ama karanlık ve boş duruyor. Kanca B (ilk karede gerçek Lapta haritası ve £139.000 kartı) ile bir A/B sürümü yapalım mı?
4. **Soru sayısı:** Telefondaki soru "Lapta'da £160 bin altı, deniz manzaralı 2+1". Bu, 14 Kasım canlı kaydındaki Lapta aramasının filtreleriyle birebir aynı (satılık, Girne/Lapta, daire, 2+1, ≤£160.000, deniz manzarası → 8 ilan). Yayından önce canlıdan yeniden doğrulanmalı.

## v10 → v11 (ölçülen)

| Ölçüt | v10 | v11 | Kurul hedefi |
|---|---|---|---|
| Dış metin bloğu (dipnot hariç) | ~22–24 | 9 | ≤10 |
| Dış kelime (dipnot hariç) | ~106–116 | 25 | ≤30 |
| Bölüm / ortam | 11 / 13 | 3 perde / 7 ortam | 7 |
| Fiziksel tepki (kick) | 8 | 3 (gönder 5,0 · seçim 10,42 · kur 24,0) | 3 |
| Kamera hareketi süresi | ~300–450 ms, sert in-out | 650–1300 ms, yumuşak çıkış (.25,.1,0,1) | ≥650 ms |
| Telefon açısı | ry +8°↔−15° arası sallanma | ry hep negatif (−4° kullanıcı, −8° ürün planı) | işaret değişimi yok |
| Büyük Evlek logosu ekranda | ~5 sn | 0–2,5 + 26,0–30,0 ≈ 6,5 sn | ≥6,5 sn |
| Döngü dikişi (kare 0 ↔ kare 1799) | görsel benzer | **SSIM 0,9965** | ≥0,95 |

**Okuma oranı (kalış ÷ gereken süre).** Gereken süre = kelime × 0,3 + 0,7 sn.
- Başlık 1,7
- Soru 1,1
- Slogan 1,0
- "£139.000" 2,2
- "Lapta · 2+1 · 107 m²" 0,9
- "Arada £12.000 fark." 1,0
- "Eklentiler'de Evlek'i bul." 1,1
- "Eklentiyi kur." 1,3
- CTA 1,3

Kurulun ≥1,15 hedefi her blokta tutmadı. Künye alt satırı, slogan ve fark satırı sınırda; v11.1'de her birine 0,3–0,4 sn eklenmeli.

## Film akışı (v11)

| Saniye | Perde | Ne oluyor |
|---|---|---|
| 0,0–2,5 | SOR · kanca | Bulanık-lacivert havuz, logo + "artık ChatGPT'de.". Telefon 40 px yükselir. 2,0–2,5'te logo yazım kutusuna inip "Ev Evlek" çipine dönüşür (imza hareketi). |
| 2,5–5,5 | SOR · soru | Kamera 1 sn'de yaklaşır. Soru dışarıda kelime kelime ("Lapta'da deniz manzaralı 2+1"), içeride eşzamanlı yazılır. 5,0'da gönder. |
| 5,5–8,5 | SOR · harita | Widget dolu açılır. Girne kıyısından Lapta'ya 1,15 sn uçuş, mercan sınır çizilir, "£105–147 bin · 8 ilan" kapsülü çıkar. "Sor. Evlek göstersin." (tek kez). |
| 8,5–10,5 | GÖR · kartlar | 3 adımlı snap (£120.000 → £127.000 → £139.000), seçim konturu, 10,42'de dokunuş. |
| 10,5–11,5 | GÖR · portal | Kart telefonun 3D düzleminden kalkıp kareyi doldurur. Telefon alttan çıkar, zemin netleşir. |
| 11,5–14,5 | GÖR · ev (nefes) | Telefonsuz, net havuz, yavaş yatay kayma. "£139.000" ve "Lapta · 2+1 · 107 m²". |
| 14,5–17,0 | GÖR · içeri | Telefon sağ alttan girer (ilan detayı). Galeri swipe'ı ile salon (_01) gelir, 160 px tilt-up. |
| 17,0–20,5 | GÖR · kıyas | Sohbete geri dönüş (iOS geri), "Bunu £127.000'likle karşılaştır." telefonda yazılır. Karşılaştırma kartı gelir. "Arada £12.000 fark." |
| 20,5–26,0 | EKLE | Eklentiler (iOS push), "evlek" araması, Evlek sayfası, "Eklentiyi kur" → spinner → "Bağlı ✓" → "Sohbette dene" → yeni sohbette Evlek çipi. Dış yazı: "Eklentiler'de Evlek'i bul." / "Eklentiyi kur." |
| 26,0–30,0 | kapanış | Çip yazım kutusundan kalkıp logoya büyür, telefon kanca pozuna döner. "artık ChatGPT'de.", "Eklentiler'den Evlek'i ekle.", dipnot. 29,5'ten sonra ilk kareye birebir döner. |

**Çıkarılanlar (kurul):**
- Açılış ve metin: "Bir sabahın böyle başlasa?", "Evlek hazır" karşılaması, köşe logosu, adım çip şeritleri, dört üst bant.
- Sahneler: Girne araması, evlek.app bölümü, dış kanıt sahnesi, mutfak planı.

**Düzeltilen hata:** Sohbete dönüşte £139.000 kartının yeri artık boş değil.

## Plandan / kuruldan sapmalar

1. **Telefon ölçeği:** Kancada s 0,42 (kurul 0,48), sohbet planında 0,55 (kurul 0,62). Kurulun koordinatlarıyla logo, CTA ve dipnot telefonla çakışıyordu; dış yazıların telefonun üstüne binmemesi için küçülttüm.
2. **Dipnot kapanışta üstte** (y≈664), kuruldaki gibi altta değil; altta telefon var. Ekranda 26,6–29,5 arası, 2,9 sn kalıyor.
3. **Döngü için telefon 29,5–30,0 arasında 40 px iniyor.** Kancadaki "0–0,5'te 40 px yükselme" ile döngü dikişini aynı anda sağlamak için.
4. **Harita uçuşu 1,15 sn** (kurul 1,3 sn). Widget'ın açılışından sonra 350 ms boşluk bırakmak için.
5. **Kartlarda ilk snap 500 ms** (kurul 300 ms). Hız tavanını (1,0 px/ms) aşmamak için.
6. **Hareket bulanıklığı yok** (kurul portalda 8 örnek istedi). Render süresini ~8 katına çıkarır. v11.1'de yalnız portal penceresine eklenebilir.
7. **Bulanık zemin biraz daha aydınlık:** brightness 0,58 ve %60 lacivert (kurul 0,45 ve %70). Kurulun değeriyle zemin neredeyse siyah çıktı.

## Dürüst puan

| Ölçüt | v10 (kurul ort.) | v11 |
|---|---|---|
| Anlaşılırlık | 5 | 8 |
| Sadelik / kalabalık | 4,5 | 8 |
| Tempo (insan gözü) | 5 | 7,5 |
| Kanca | 5 | 6,5 |
| İlan arzusu | 6 | 7,5 |
| Marka akılda kalması | 5 | 7,5 |
| Catchy / vibe | 5,5 | 6 |

**Genel: ~7,2/10.** Kalabalık ve hız sorunu büyük ölçüde çözüldü, film artık tek fikir anlatıyor.

**Hâlâ zayıf olanlar:**
- **(1) Karanlık ekranlar:** İlk 5 sn ve kapanışta telefon ekranı boş, karanlık bir sohbet. Görsel ödül yok, "catchy" duygusu buradan kaçıyor.
- **(2) Eklentiler araması:** 20,5–22,0'daki iskelet liste boş görünüyor.
- **(3) Renk:** Zemin tek ton lacivert; filmin rengi neredeyse yalnız havuz bölümünde açılıyor.
- **(4) Okuma süresi:** Üç blokta okuma oranı sınırda.

**Müzik:** Faz B'de half-time bir parça, vuruşları 5,0 / 11,5 / 24,5'e oturtulursa tempo hissini en çok taşıyacak şey olur.

## v11.1 önerileri (öncelik sırasıyla)

1. **Kanca B ile A/B sürümü:** İlk karede telefon ekranında gerçek Lapta haritası ve £139.000 kartı olsun. Boş ekran sorununu (1) çözer ve en "catchy" seçenek.
2. **Kapanışta telefon ekranı:** Boş sohbet yerine çipli yazım kutusu ve arkada soluk Lapta widget'ı.
3. **Eklentiler araması:** İskelet yerine dolu bir "Önerilen" listesi. Üçüncü taraf logosu kullanılamadığı için yalnız Evlek satırı ve kategori başlıkları olur.
4. **Okuma süreleri:** Künye alt satırı, slogan ve fark satırına +0,3–0,4 sn.
5. **Hareket bulanıklığı** yalnız portal penceresinde.
