# v14 finish brifi: Evlek "artık ChatGPT'de" (30 sn, 1080×1920, 60 fps)

## Rumi'nin v13 geri bildirimi (birebir, bağlayıcı)

> telefn telefouna benzemiyor görseller gairp duruyor
> yani uzman finish uzmanlarınla tamamlaman lazım. ... kesinlikle bu defa gerçekci hissi vererek sesleri de sen üreteceksin kendi aracınla
> ekran ne alakysa yarım duruyor kötü görünüyor
> evlek eklenti eklemek düzgün anlatılmamış
> baştan orta kısımda chatgptde evlek kullanımı seksi olmamış ve gelişmesi iyileşmesi lazım
> bu ile alakalı yazdığım kısımlara sende 2-3 kat daha fazla inceleyip bulgularını yaz sonra da düzelt final versiyonu üretmeye çalış

Rumi'nin gönderdiği ekran görüntüsü: `/tmp/claude-0/-home-user-Animation-Social-Media/8061e222-fdd3-5eed-88a7-976b512a043c/images/1.webp`.
Kare ≈11–12 sn. Telefon yakın planda, kadrajın altından kesik; üstte boş lacivert alan; Lapta widget'ı yarım.

## v13'te telefonun kadraja göre durumu (3B izdüşümle hesaplandı)

Gövde kutusu: x0, x1, y0, y1; kadraj 1080×1920.

| Poz | s | Gövde kutusu | Kesik | Zaman (sn) |
|---|---|---|---|---|
| COVER | 0,45 | [254, 834, 734, 1927] | alt (7 px) | 0–2,3 ve 26–30 |
| COMP | 0,92 | [−48, 1139, −1258, 1188] | üst, sol, sağ (yazım kutusu yakın planı) | 3,0–6,35 |
| PR | 0,80 | [36, 1068, 639, 2763] | **alt 843 px** (Rumi'nin ekran görüntüsü) | 6,95–12,75 |
| PT | 0,78 | [48, 1054, 222, 2292] | **alt 372 px** (ilan detayı) | 13,45–18,15 |
| PF | 0,58 | tam | yok | 18,75–19,3 |
| CHAT | 0,55 | tam | yok | 19,3–22,2 |
| PBTN | 0,60 | [160, 934, 345, 1936] | alt 16 px | 22,8–25,35 |

## Telefonun bugünkü yapısı

Kaynak: `src/v12/Phone.tsx`, v13 de bunu kullanıyor.

- **Gövde ve ekran:** Gövde 1299×2700 px, ekran 1179×2556 (gövdede x=60, y=72). Gövde köşe yarıçapı 128, ekran köşesi 96.
- **Kalınlık:** 18 katman ile 150 px (`scale3d`). Kenar tonları `#AEB7BB` → `#384955`.
- **Ön çerçeve:** Grafit degrade `#3C4D59` / `#2B3B47` / `#16232D`. 9 px siyah cam kenarı.
- **Detaylar:** Delik kamera Ø44, yalnız sağda güç tuşu.
- **Gölge:** 2B blur katmanlar.
- **Kamera açısı:** Perspektif 3200; ry −4°, rx 2°, rz −1°.
- **Ekran zemini:** Ekranlar siyah (`#000`), ChatGPT koyu tema.
- **Zemin:** Lacivert radyal degrade; ilan açılınca ilanın bulanık fotoğrafı.

## v13 akışı

Ayrıntı: `docs/v13/KISA-RAPOR.md`

| Saniye | Bölüm | Ne oluyor |
|---|---|---|
| 0–2,3 | GİRİŞ | Lacivert zemin, logo, "artık ChatGPT'de." ve imleç; altta telefon, boş yeni sohbet. Logo 1,4–2,1'de yazım kutusundaki Evlek çipine iner. |
| 2,3–6,2 | GELİŞME · yaz | Yakın plan yazım kutusu; soru yazılır: "Lapta'da £160 bin altı, deniz manzaralı 2+1 daire". 6,2'de gönder. |
| 6,35–8,3 | ara → sonuç | Balon kalkar; "Evlek" etiketi ışıldar; gerçek Lapta widget'ı gelir. |
| 8,5–10,35 | | "Sor. Evlek göstersin." |
| 10,35–12,6 | kart | Sohbet kayar, kart şeridi sürüklenir, £139.000'e dokunuş. |
| 12,75–14,45 | ilan | Kart fotoğrafı kahramana uçar; tam ekran gerçek ilan detayı. |
| 14,45–17,55 | ev | Havuz fotoğrafı ilanın çerçevesinden geniş kareye büyür; künye; geri iner. |
| 17,7–19,3 | | Galeride salon (2/14); "Emlakçıya sor ↗" dokunuşu. |
| 19,3–24,6 | SONUÇ | "Eklentiler'den ekle." ve yol şeridi. Kenar menü → Eklentiler → "evlek" araması → Evlek sayfası → Eklentiyi kur → Bağlı → Sohbette dene. |
| 24,45–26,15 | | Yeni sohbette Evlek çipi; çip logoya döner. |
| 26,15–30 | | "artık ChatGPT'de." harf harf yazılır; dipnot. Son kare ilk kare. |

## v13 görsel malzeme

- **6 fps bloklar:** `/home/user/Animation-Social-Media/evlek-chatgpt/out/v13qc/blok_0.jpg` … `blok_5.jpg`. Her biri 5 sn, 30 kare; başlıklarda saniye yazılı.
- **Anahtar kareler (540×960):** `/home/user/Animation-Social-Media/evlek-chatgpt/docs/v13/kareler/*.jpg`
- **2 fps ızgara:** `/home/user/Animation-Social-Media/evlek-chatgpt/docs/v13/v13_izgara_2fps.jpg`
- **360×640 okunurluk:** `/home/user/Animation-Social-Media/evlek-chatgpt/docs/v13/v13_okunurluk_360x640.jpg`
- **Kod:** `src/v13/V13.tsx` (pozlar, zemin, portal, dış metin), `src/v13/Screen.tsx` (ekranlar), `src/v13/tl.ts` (zamanlar), `src/v12/Phone.tsx` (telefon).
- **Gerçek iOS referansları:**
  - `docs/eklenti-ref/eklenti_*.png` (Onur'un kaydı)
  - `/tmp/claude-0/-home-user-Animation-Social-Media/8061e222-fdd3-5eed-88a7-976b512a043c/scratchpad/ss_rumi/ss3.png` (Rumi'nin ekran görüntüleri: kenar menü, Eklentiler, "evlek" araması)

## Kurallar (değişmez)

- **Veri ve görsel:**
  - Gerçek veri.
  - Evlek widget'ı yeniden tasarlanmaz; gerçek piksel (`public/v12/w/*.png`). Kırpım, ölçek, ışık ve derinlik serbest.
  - Yapay zekâ görseli yok.
- **Marka ve logolar:**
  - ChatGPT/OpenAI ve Apple logosu yok; iPhone kopyası yok (markasız ama tanınır telefon).
  - Kişi ve ofis adı yok.
- **İddialar:** İlk/tek/en iyi iddiası yok; rakip adı yok.
- **Arayüz:** Arayüzün üstüne grain ya da filtre yok.
- **Renk:** Krem `#FAF8F2`, lacivert `#0A2540`, mercan `#B84E3B` (az).
- **Metin:** En çok 3 ana mesaj ("Evlek artık ChatGPT'de." · "Sor. Evlek göstersin." · "Eklentiler'den ekle."). Dış metin ≥52 px.
- **Önceki Rumi kararları:**
  - Kanca A′: dikkat habere, logo → çip.
  - Önce yaz → ara → sonuç → sonra ev.
  - evlek.app sahnesi yok, yerine "Emlakçıya sor".
  - Sonda Eklentiler'den ekleme yolu ve "artık ChatGPT'de." kapanışı.
  - Tempo insan gözüne göre, kalabalık değil.
- **Ses:** Kodla sentez (numpy/scipy), seslendirme yok, 48 kHz stereo, ≈−14 LUFS, tepe ≤−1 dBTP. Mux `-c:v copy`. Kurallar: `video-system/docs/AUDIO_WORKFLOW.md` ve `video-system/assets/audio/README.md` (karakter: sakin, mimari, kendinden emin; whoosh klişesi yok).
