# VIDEO-1 v3 · Code brief'i · "Evlek artık ChatGPT'de"

Bu klasör çalışan bir Remotion projesi. Cowork 24 saniyelik TR 9:16 taslağı kendisi kurdu ve render etti: `out/evlek-chatgpt-v2-taslak-efektli_tr_916.mp4`. Senin işin bunu bitirmek. Faz 1a kodunu ve "gerçek kayıt" planını (v2 brief'i) bırak.

## Karar

- **Arayüz bilinçli olarak temsili.** Evlek'in ChatGPT widget'ı şu an sade; Onur pazarlama için daha "seksi" bir görünüm istiyor.
- **Sınır:** Görünüm güzelleşebilir ama olmayan bir özellik gösterilmez.
  - "WhatsApp'tan yaz" ChatGPT'de değil, evlek.app ilan sayfasında. Akış "Evlek'te aç → evlek.app → WhatsApp'tan yaz" olarak kalır.
  - İlanlar, fiyatlar, ilçeler ve ofis adları canlı Evlek verisi (13 Kasım 2026). Deniz manzarası filtresi gerçekten çalışıyor.
- **Kapanış dipnotu kalır:** "Arayüz temsilidir; ilanlar ve fiyatlar Evlek'teki gerçek ilanlardır. ChatGPT, OpenAI'ın ticari markasıdır."
- **Marka sınırları:**
  - ChatGPT ya da OpenAI logosu yok; "ChatGPT" yalnız yazı olarak geçer.
  - Evlek logosu her zaman daha büyük.
  - "Resmi", "partner", "ilk" yok.

## Akış (30 fps, 120 BPM; 1 vuruş 15 kare, 1 ölçü 60 kare)

| Kare | Sahne |
|---|---|
| 0–60 | **Hook:** tam ekran gün batımı fotoğrafı, beyaz Evlek logosu, "artık ChatGPT'de." |
| 54–176 | Telefon iner, "ChatGPT" sohbet ekranı. Soru yazılır, kamera giriş kutusuna yakın. Başlık: "Kendi cümlenizle sorun." |
| 178–296 | Gönder. "Evlek'te aranıyor…" ışıltısı. Çipler ve kartlar gelir, karusel kayar. Başlık: "Güncel ilanlar, fotoğraflarıyla." |
| 298–366 | Karta dokunuş. Kamera dalar, eşleşen kesmeyle tam ekran fotoğraf; vuruşta 3 kesme ve "£155.000 · Alsancak". |
| 360–486 | Telefona dönüş. "Deniz manzaralı olsun." "✓ Deniz manzarası" çipi patlar, sonuçlar değişir. Başlık: "Cümleniz filtreye dönüşür." |
| 492–596 | "Evlek'te aç". evlek.app ilan sayfası alttan açılır, "WhatsApp'tan yaz"a dokunulur. Başlık: "Ofise doğrudan yazın." |
| 596–720 | Kapanış kartı. |

## Yapılacaklar (sırayla)

1. **Müzik.** Lisanslı kütüphaneden (Epidemic Sound ya da Artlist, işletme lisansı) 5 aday öner; Onur seçer.
   - Tarif: 118–122 BPM, hareketli, modern pop/house, parlak ve iyimser.
   - Kurgu 120 BPM ızgarasında. Parça farklıysa `T` zamanlarını yeni ölçülere oturt.
   - Düşüş ya da vuruş 300. karede (dalış), kapanış 600. karede.
2. **Ses tasarımı.** Onur tuş sesi istiyor: net ve hoş "pıtır pıtır" klavye, gönderde "tık", sonuç gelince "pop", geçişlerde "whoosh", WhatsApp dokunuşunda tok bir tık.
   - `out/sfx_mix.wav`'daki yerleşim taslak; zamanlamaları koru, sesleri kütüphaneden daha kalitelileriyle değiştir.
   - Mastering: −14 LUFS, −1 dBTP.
3. **Cila.**
   - Hook: logoyu tam ortala, 1. karede okunur olsun.
   - Telefon 54–106 arasında boş görünüyor; ya yazmayı 96'da başlat ya da ilk mesaj ipucunu (placeholder) daha erken göster.
   - Fotoğraftan telefona dönüş (358–366) şu an çift pozlama gibi; kartın kendisine geri küçülen bir eşleşen kesme yap.
   - Kapanışı 3 saniyeye indir (toplam 23 sn).
   - Bütün sahnelerde hareket bulanıklığı (`@remotion/motion-blur`, ince).
   - Render 60 fps master.
4. **EN sürüm.** Metinler:
   - Soru: "Show me 2-bedroom flats for sale in Kyrenia under £200k."
   - Ek koşul: "Make it sea view."
   - Başlıklar:
     - "Ask in your own words."
     - "Live listings, with photos."
     - "Your words become filters."
     - "Message the agency directly."
   - Kapanış: "Now in ChatGPT." ve "Find Evlek under Plugins in ChatGPT."
   - Fiyatlar £155,000 biçiminde.
   - Çipler: Kyrenia, For sale, 2+1, ≤ £200,000, ✓ Sea view.
5. **Formatlar.**
   - 4:5 (1080×1350): kendi yerleşimi; başlık üstte daha küçük, telefon biraz küçük.
   - 15 saniyelik kısa kesim: hook → soru → kartlar → dalış → WhatsApp → kapanış.
6. **Yayından 1 gün önce:** 8 ilanı `get_listing` ile yeniden kontrol et. Satılan ya da fiyatı değişen ilan varsa değiştir.

## Kurallar

- Fiyat ve sayı animasyonu yok (sayaç yok).
- Yapay zekâyla görsel üretilmez; bütün fotoğraflar ilanların kendi fotoğrafları (`public/img/`, canlıdan indirildi).
- Onur'un adı yok.
- Ofislere haber: [ofis], [ofis], [ofis]. Yayından önce Onur verecek.

## Çalıştırma

```
npm i
npx remotion studio src/index.ts
npx remotion render src/index.ts Main916 out/x.mp4 --codec=h264 --crf=18
```

## Teslim

`final/` klasöründe:

- TR ve EN × 9:16 ve 4:5 × 23 sn ve 15 sn.
- Kapak PNG'leri.
- 2 fps kare ızgarası.
- KISA-RAPOR.md: LUFS, müzik lisansı ve dürüst puan.
