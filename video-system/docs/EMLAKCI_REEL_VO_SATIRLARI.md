# Seslendirme · ElevenLabs'a yapıştırılacak 13 satır

Model: **Eleven v3** · Stability: **Natural–Robust arası** · Speed: 1.0
Output: **MP3 44.1 kHz 192 kbps** (varsa; yoksa 128 olur)
Her satır **AYRI** üretilecek — 13 ayrı dosya. Tek blok üretip kesmek nefesleri bozar.

Dosya adları: `vo_01.mp3` … `vo_13.mp3` (sırayla, atlama yok).

---

## Telaffuz notu

İki tuzak var, ikisi de metne yazılarak çözüldü:

1. **KKTC** → v3 bunu bazen İngilizce harflerle heceliyor. Metne
   `Ka Ka Te Ce'de` diye yazıldı; ekranda yine "KKTC'de" görünüyor,
   sadece okunuş garanti altına alındı.
2. **zekâ** → şapkalı a korunmalı; `zekâya` diye yazıldı.

Ürettikten sonra 1. ve 12. satırı mutlaka dinle — bu ikisi bozulursa
tekrar üretmek gerekir.

---

## Satırlar

**vo_01** · 0.50 sn · hook
```
Ka Ka Te Ce'de emlakçıysan, bunu görmen lazım.
```

**vo_02** · 3.60 sn · tez
```
İlan koymak değişti.
```

**vo_03** · 5.60 sn · 01–03 beat'leri
```
Açıklamayı yazar, beş dile çevirir, boş odayı döşer.
```

**vo_04** · 9.30 sn · dönüş
```
Bunları Evlek yaptı.
```

**vo_05** · 11.90 sn · basış
```
Sen sadece Yayınla'ya bastın.
```

**vo_06** · 14.30 sn · onay
```
Onayı sen veriyorsun.
```

**vo_07** · 16.30 sn · diller
```
Sen Türkçe yaz, beş dilde yayınlansın.
```

**vo_08** · 18.60 sn · staging kaynak
```
Boş odayı sen çektin.
```

**vo_09** · 20.10 sn · staging üretim
```
Evlek üç stilde döşüyor.
```

**vo_10** · 22.70 sn · eşleşme
```
İlanın doğru alıcıya ulaşır.
```

**vo_11** · 25.90 sn · arama
```
Alıcı cümleyle arıyor, ilanın karşısına çıkıyor.
```

**vo_12** · 29.00 sn · asistan
```
Yapay zekâya sorduğunda, cevap senin ilanından geliyor.
```

**vo_13** · 33.30 sn · kapanış
```
Sen yayınla. Gerisi Evlek'te.
```

---

## Ayar gerekçeleri

| Ayar | Değer | Neden |
|---|---|---|
| Stability | Natural–Robust arası | 13 ayrı üretim TEK bir okuma gibi durmalı. Creative tarafı her klipte tonu değiştirir; Robust tarafı tutarlılığı korur. |
| Speed | 1.0 | Metin zaten kadraja göre yazıldı; hızlandırma zaman kodlarını bozar. |
| Language Override | Türkçe (aç) | Kısa cümlelerde otomatik dil algılama şaşabilir; `İlan koymak değişti.` gibi 3 kelimelik satırlarda garanti isteriz. |
| Output | 192 kbps | Mix + AAC dönüşümü ikinci bir sıkıştırma; girdi ne kadar temizse o kadar iyi. |
| Audio tag | Kullanma | Tek istisna aşağıda. |

## Audio tag

Ses "Joyful and Dynamic Storyteller" tanımlıysa filmin sakin tonuyla
çatışır. Çözüm sırası:

1. **Önce tag'siz dene.** v3 metnin kendi tonunu yakalayabiliyor.
2. Fazla neşeli çıkarsa satır başına `[calm]` ya da `[serious]` ekle:
   ```
   [calm] İlan koymak değişti.
   ```
3. Hâlâ tutmuyorsa sesi değiştir — aşağıya bak.

## Ses seçimi

Aranan profil: **sakin, güven veren, meslektaş tonu** — spiker ya da
hikâye anlatıcısı değil. Kadın/erkek fark etmez; belirleyici olan tempo
ve enerji seviyesi.

ElevenLabs Voice Library'de filtre: dil **Türkçe**, use case
**Narration / Informative** ya da **Advertisement**, mood **Calm /
Confident / Professional**. "Storyteller", "Energetic", "Youthful"
etiketli sesler bu film için yanlış.

Seçtiğin sesi tek satırla test et — `vo_02` ("İlan koymak değişti.")
en iyi turnusol: kısa, iddialı, tonu hemen ele veriyor.
