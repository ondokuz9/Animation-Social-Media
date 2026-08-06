# Emlakçı Reel · seslendirme (VO) planı

Film: 36.000 sn · 60 fps · sessiz master (sha256 `06445523…`)
Bu belge sesin nasıl üretileceğini ve videoya nasıl ekleneceğini tanımlar.
**Görüntü asla yeniden kodlanmaz** — ses `-c:v copy` ile mux'lanır.

---

## 1 · Model ve ses seçimi

| Karar | Seçim | Gerekçe |
|---|---|---|
| Model | **`eleven_v3`** | 2 Şubat 2026'da GA oldu. Önceden üretilen (real-time olmayan) pazarlama seslendirmesi için ElevenLabs'ın önerdiği model; audio tag'lerle duygu kontrolü var. |
| Alternatif | `eleven_multilingual_v2` | v3'te tonu tutturamazsan geri dönülecek sağlam seçenek. |
| Kullanılmayacak | `eleven_flash_v2_5` | Düşük gecikme için; canlı asistanlara ait, kalite v3'ün altında. |
| Ses | Türkçe erkek, 30-45 yaş, İstanbul aksanı, sıcak-otoriter | Hedef kitle KKTC emlakçısı: meslektaş tonu ister, spiker tonu değil. |
| Ton | Sakin, iddiasız, hafif tempolu | Film zaten iddialı; ses bağırırsa reklam gibi olur. |

**Ayarlar (v3):** stability `Natural`, speed 1.0 (metin zaten kadraja göre yazıldı),
similarity yüksek, style düşük — abartılı oyunculuk istemiyoruz.

**Audio tag kullanımı:** yalnızca iki yerde, o da hafif — hook'ta `[confident]`,
kapanışta `[warm]`. Gerisi düz okuma; her cümleye tag koymak v3'te ses tonunu
dalgalandırır.

---

## 2 · Neden ses ekliyoruz

Reels'te sesli izlenme oranı yüksek (Feed/Stories'in aksine), ve 2026 verisi
sessiz reklamların dağıtımda ciddi biçimde geri planda kaldığını gösteriyor.
Buna karşılık **film sessiz de tam anlaşılmak zorunda** — bütün iddialar
ekranda yazılı ve öyle kalacak. Ses, mesajı taşımıyor; güçlendiriyor.

---

## 3 · Seslendirme metni (zaman kodlu)

Kural: VO ekrandaki yazıyı kelimesi kelimesine tekrarlamaz — ama **hiçbir yeni
iddia da eklemez.** Filmde olmayan rakam, oran, süre, entegrasyon yok.

| # | Giriş | Metin | Hizalandığı sahne |
|---|-------|-------|-------------------|
| 1 | 0.50 | "KKTC'de emlakçıysan, bunu görmen lazım." | Hook (SLAM tipografi) |
| 2 | 3.60 | "İlan koymak değişti." | Tez |
| 3 | 5.60 | "Açıklamayı yazar, beş dile çevirir, boş odayı döşer." | 01–03 beat'leri |
| 4 | 9.30 | "Bunları Evlek yaptı." | Dönüş |
| 5 | 11.90 | "Sen sadece Yayınla'ya bastın." | Makro / basış |
| 6 | 14.30 | "Onayı sen veriyorsun." | Onayla |
| 7 | 16.30 | "Sen Türkçe yaz, beş dilde yayınlansın." | Diller |
| 8 | 18.60 | "Boş odayı sen çektin." | Staging · kaynak |
| 9 | 20.10 | "Evlek üç stilde döşüyor." | Staging · üretim |
| 10 | 22.70 | "İlanın doğru alıcıya ulaşır." | Match |
| 11 | 25.90 | "Alıcı cümleyle arıyor, ilanın karşısına çıkıyor." | Arama |
| 12 | 29.00 | "Yapay zekâya sorduğunda, cevap senin ilanından geliyor." | Asistan |
| 13 | 33.30 | "Sen yayınla. Gerisi Evlek'te." | Kapanış |

Toplam konuşma ~24 sn; kalan ~12 sn nefes. Hook, Staging'in "Paylaşmaya hazır."
anı ve Match'in ağ büyümesi bilinçli olarak sessiz bırakıldı — görüntünün tek
başına konuştuğu yerler.

**ElevenLabs'a verilecek biçim:** her satırı AYRI üret (13 ayrı dosya).
Tek uzun blok üretip kesmek, cümle aralarındaki nefesleri bozar ve
zaman kodlarına oturtmayı imkânsızlaştırır.

---

## 4 · Müzik

Öneri: çok sade, ritmik olmayan bir altyapı, **−22 LUFS civarı**, VO'nun
altında. Sahne kesmelerinde vurgu arayan bir parça filmin kendi ritmiyle
yarışır. Alternatif: müzik yok, yalnız VO + birkaç ince arayüz sesi
(basış, tik) — film buna daha uygun.

Instagram'ın kendi kütüphanesinden parça eklemek de geçerli bir yol; o durumda
dosyaya yalnızca VO gömülür.

---

## 5 · Mux (görüntü yeniden kodlanmaz)

```bash
# 13 parçayı zaman koduna göre tek stereo track'e yerleştir (adelay ms cinsinden)
ffmpeg -i vo_01.mp3 -i vo_02.mp3 ... \
  -filter_complex "[0]adelay=500|500[a0];[1]adelay=3600|3600[a1];...; \
                   [a0][a1]...amix=inputs=13:normalize=0[vo]" \
  -map "[vo]" -ar 48000 -c:a pcm_s16le vo_mix.wav

# ses ölçüsü: konuşma −16 LUFS civarına normalize
ffmpeg -i vo_mix.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 vo_final.wav

# muxlama — VİDEO KOPYALANIR, ASLA YENİDEN KODLANMAZ
ffmpeg -i evlek_emlakci_reel_FINAL_1080x1920_60fps_master.mp4 -i vo_final.wav \
  -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart \
  evlek_emlakci_reel_FINAL_1080x1920_60fps_sesli.mp4
```

Mux sonrası ffprobe kapısı: video akışının sha/boyut/kare sayısı değişmemeli,
`r_frame_rate` hâlâ `60/1`, süre 36.000 sn, ses akışı 1 adet AAC 48 kHz.

---

## 6 · Sessiz master korunur

Sesli sürüm **yeni bir dosyadır**; sessiz master silinmez, üzerine yazılmaz.
İkisi de baseline'da ayrı ayrı pinlenir.
