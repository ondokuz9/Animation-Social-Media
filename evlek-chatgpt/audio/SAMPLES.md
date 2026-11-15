# Ses örnekleri: kaynak ve lisans

v15.2'den itibaren arayüz sesleri ve müzikteki akustik enstrümanlar gerçek kayıt. Hepsi **CC0 1.0**
(kamu malı): ticari kullanım serbest, atıf zorunlu değil, platform ya da reklam kısıtı yok.
Lisans metinleri her deponun içinde (`LICENSE.txt` / `LICENSE`) ve indirildikten sonra okunarak doğrulandı.

Örnekler git'e girmez (`audio/_samples/` gitignore'da). Sabit commit'lerden indirmek için:

```bash
bash audio/fetch_samples.sh
```

| Kaynak | Depo · commit | Lisans | Kullanıldığı yer |
|---|---|---|---|
| Kenney, *Interface Sounds* ([kenney.nl](https://kenney.nl/assets/interface-sounds)) | [Calinou/kenney-interface-sounds](https://github.com/Calinou/kenney-interface-sounds) · `4596a49` | CC0 1.0 | dokunuş, klavye, gönder, sonuç oturması, galeri, Bağlı çanı, mandallar |
| Kenney, *UI Audio* ([kenney.nl](https://www.kenney.nl/assets/ui-audio)) | [Calinou/kenney-ui-audio](https://github.com/Calinou/kenney-ui-audio) · `8c3d81b` | CC0 1.0 | panel geçişi, dönen gösterge |
| Versilian Studios, *VCSL* | [sgossner/VCSL](https://github.com/sgossner/VCSL) · `c1ea7bc` | CC0 1.0 | Steinway B piyano, vibrafon (yumuşak tokmak), glockenspiel, el çırpma, hi-hat |

## Eşleme (film15_2.py)

| An | Önceki (sentez) | Şimdi (kayıt) |
|---|---|---|
| Harf tuşu | `key_tick` | Kenney `click_002/003/005`, rastgele sırayla, ±0,35 yarım ses |
| Boşluk / satır | `key_tick(space)` | Kenney `tick_002` (800 Hz, daha pes "tok") |
| Dokunuş | `tap` | Kenney `select_002` / `select_007` |
| Gönder | `send_snd` | Kenney `maximize_009` (1,1 → 1,7 kHz yükselen) |
| Sonuç / kart / ilan oturması | `tone_pair` | Kenney `drop_002/003/004`, Re majör notalara akortlu (G5, F#5, D5) |
| Galeri 2/14 | `tone_pair` | Kenney `glass_006` → F#6 |
| Arama sonucu | `tone_pair` | Kenney `select_005` → D6 |
| Sürükleme mandalı | `detent` | Kenney `tick_001` |
| Panel geçişi | `detent` | Kenney UI `switch13` |
| Dönen gösterge | sinüs tık | Kenney UI `switch14` |
| Bağlı | iki klik + keçe | Kenney `toggle_001` + `confirmation_002` (tam D6) + piyano |
| Keçe piyano, logo notaları | FM `felt` | VCSL Steinway B, `vl2`/`vl3` |
| Pluck ostinato | Karplus–Strong | VCSL vibrafon, yumuşak tokmak |
| Çanlar (impact) | FM çan | VCSL glockenspiel, yumuşak |
| Klap, hi-hat | gürültü / kare dalga | VCSL `Clap_rr1–6`, `HiHat_HitC/HitO` |

**Sentez olarak kalanlar:** kick, bas, cam ped, impact alt frekansı, sürtünme, deniz ambiyansı ve oda tonu. Elektronik lansman müziğinde bunlar zaten sentezle üretilir.

## Akort ve seviye

- **Akort:** Dosya adına güvenilmedi, FFT ile ölçüldü.
  - VCSL vibrafon ve glockenspiel adları bir oktav aşağıyı gösteriyor. Glockenspiel ayrıca yaklaşık +0,15 yarım ses tiz. Kodda `offset` ile düzeltildi.
  - Piyano adları doğru (sapma ≤ 0,06 yarım ses).
- **Seviye:** Her örnek, değiştirdiği sentez sesin 20–50 ms kısa süreli seviyesine eşitlendi (`samples.match`). Böylece v15'te kurulan miks dengesi korundu.

## Değerlendirilip alınmayanlar

- **OpenGameArt *Keyboard Soundpack #1*** (CC0): mekanik klavye kaydı. Telefon ekran klavyesine uymuyor.
- **romainsimon/uisfx** (CC0 ses): Kenney setleriyle örtüşüyor; ek kazanç yok.
- **Açık kaynak müzik modelleri:** GPU olmadan pratik değil. Stable Audio Open'ın lisansı da topluluk lisansı ve gelir sınırlı; MusicGen'in ağırlıkları ticari kullanıma kapalı.
