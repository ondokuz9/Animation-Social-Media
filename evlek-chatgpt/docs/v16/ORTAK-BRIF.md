# Evlek × ChatGPT lansman filmi — ortak bağlam (bağımsız uzman incelemesi)

Proje: /home/user/Animation-Social-Media/evlek-chatgpt (Remotion, 1080×1920, 60 fps). İncelenen sürüm V15 (30 sn).
DOSYA DEĞİŞTİRME. Yalnız incele; geçici dosyan gerekirse kendi alt klasörünü aç: /tmp/claude-0/-home-user-Animation-Social-Media/8061e222-fdd3-5eed-88a7-976b512a043c/scratchpad/v16/<rolün>/
Başka uzmanların çıktısını okuma (bu klasördeki uzman_*.md veya başka alt klasörler).

## Girdiler
- Film: out/evlek_chatgpt_v15_1080x1920_60fps.mp4 (sesli), out/evlek_chatgpt_v15_1_1080x1920_60fps_sessiz.mp4 (aynı görüntü, kapanış dipnotu kaldırılmış), out/evlek_chatgpt_v15_2_1080x1920_60fps.mp4 (güncel ses).
- Video oynatılamaz; kare çıkar: `ffmpeg -ss <sn> -i <mp4> -frames:v 1 x.png`. Hazır tarama: out/v15_1qc/blok_0…5.jpg (6 fps, her blok 5 sn), docs/v15/v15_izgara_2fps.jpg, docs/v15/v15_okunurluk_360x640.jpg, docs/v15/kareler/.
- Zaman çizelgesi: src/v15/tl.ts · kompozisyon: src/v15/V15.tsx, Screen.tsx, Phone.tsx · rapor: docs/v15/KISA-RAPOR.md
- Gerçek ilan (EVL-100102, Lapta, 2+1, £139.000, 107 m², 14 foto): veri live/r_detail_100102.json; fotoğraflar public/v4/EVL-100102_00…07.jpg (1600×1200 / 1200×1600), büyütülmüş: public/v12/EVL-100102_00_l2560.png, _01_l1584.png
- Gerçek Evlek widget pikselleri (ChatGPT içinde, 393pt×3): public/v12/w/ (wLaptaTop.png harita+filtre, wLaptaRow.png kart şeridi, dFull_1/2.png ilan detayı, dBar.png)
- Gerçek ChatGPT iOS kayıtlarından kareler: docs/eklenti-ref/*.png ve scratchpad/v16/ref/*.jpeg
- Ses kodu: audio/film15_2.py, audio/film15.py

## Değişmez kurallar
Gerçek veri; yapay zekâ görseli yok; ChatGPT/OpenAI/Apple logosu yok; kişi/ofis adı yok; "ilk/tek/en iyi" yok; rakip adı yok; gerçek Evlek widget'ı yeniden tasarlanmaz (gerçek piksel). Renkler: krem #FAF8F2, lacivert #0A2540, mercan #B84E3B. Yazı tipi Inter.

## Yeni film (V16) hedefi
Türkçe, dikey, 18–22 sn. İzleyici kaydırmayı bırakmalı, ChatGPT içinde Evlek'le Kuzey Kıbrıs'ta nasıl ev bulunduğunu birkaç saniyede anlamalı, gördüğü evi merak etmeli. "Bir arama, bir ev, bir sonraki adım." İlk 2 sn'de izleme isteği, ilk 5 sn içinde sorguyla ilişkili gerçek sonuç. Tek CTA. Marka sahibinin eleştirisi: "ince detaylardan yoksun, kalitesiz hissettiriyor, çiğ".

## Sınanacak gözlemler (V15)
- 0–8,5 sn: marka açılışta belirgin; sonra koyu telefon, klavye ve yazım baskın. Tek tek yazılan kelimelerin ne kadarı değer katıyor?
- ~9 sn: harita ve kartlar görünüyor; fiyat, konum, fotoğraf dikkati bölüyor. Bir bakışta hangisi okunacak?
- ~14,7–16,7 sn: havuz/manzara fotoğrafı öne çıkıyor. Daha erken, daha büyük, sorguya daha bağlı olabilir mi?
- ~20–26 sn: eklenti kurulum adımları. Tek açık CTA'ya karşı katkısı?
- ~27–30 sn: logo, boş telefon ekranı. Kapanışta izleyici ne okuyacak, ne yapacak?

## Çıktı biçimi (Türkçe, en fazla ~450 kelime, son mesajında düz metin)
1. En fazla ÜÇ öncelikli bulgu. Her biri: **zaman kodu veya kare → izleyiciye etkisi → kesin müdahale → nasıl doğrulanır**.
2. Rolüne özel çıktı (aşağıda).
3. BİR geçer/kalır testi (final render üzerinde ölçülebilir).
"Sinematik/premium/akıcı" gibi sözcükleri kadraj, süre, kesme, ölçek veya hareket üzerinden somut tarif et. Görmediğin/ölçmediğin şeyi öyle belirt.
