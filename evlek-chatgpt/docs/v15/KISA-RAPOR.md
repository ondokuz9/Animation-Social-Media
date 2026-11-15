# VIDEO-1 v15 · Lansman sürümü (sesli) · Kısa rapor

15 Kasım 2026 · dal `video/evlek-chatgpt-v10` · kompozisyon `V15-916` (`src/v15/`, v14'ün kopyası; v14 değişmedi)

## Teslim

| Dosya | Boyut | sha256 |
|---|---|---|
| `out/evlek_chatgpt_v15_1080x1920_60fps.mp4` (sesli) | 18,6 MB | `4719b8d0bd2df65cf171dec1f4c48f8cda126b9bfc45f43dd2a396bbca28fbe2` |
| `out/evlek_chatgpt_v15_1080x1920_60fps_sessiz.mp4` | — | `f9e132be37e22df76458cdbbd327cf470c4d7943878767d28e8e015ba0ed54a1` |
| `out/audio/v15_master_48k.wav` | — | `a35f2096183420e49a04fabf4d9d82dc5e2de764fb1f988954d0580b942441a7` |

- **Görüntü:** 30,000 sn · 1080×1920 · 60/1 · 1800 kare · yuv420p · bt709.
- **Ses:** −14,1 LUFS · LRA 4,7 · tepe −2,4 dBFS.
- **Mux:** Ses eklenirken görüntü yeniden kodlanmadı (`-c:v copy`); sessiz ve sesli dosyanın video MD5'i aynı.
- **Kontrol:**
  - siyah kare 0;
  - döngü SSIM 0,992;
  - kare farkında kesme yok; en büyük farklar portal (14,7 / 16,65) ve ilanın karta dönüşü (18,9), üçü de akan hareket.

**Dayanak:** Rumi'nin v14 geri bildirimi:
1. ChatGPT uygulaması olduğu belli olsun, telefon ekranı iyileşsin.
2. Lansman havası.
3. Ses gelişebilir.

Uzman turu dört kişiden oluştu: ChatGPT iOS birebirlik denetçisi, lansman filmi yönetmeni, ışık ve hareket tasarımcısı, ses tasarımcısı. Ham çıktılar `kurul-v15.json`'da.

## 1 · ChatGPT olduğu anında anlaşılıyor

Gerçek iOS kayıtlarından piksel ölçüldü (Onur'un kaydı ve Rumi'nin ekran görüntüleri).

- **Yazım kutusu:**
  - Klavye kapanınca iki katlı kutu, tek satırlık yüzen hapa dönüşüyor (x 98–1078, yükseklik 127). Bu, gerçek ChatGPT'nin en tanıdık imzası.
  - Gönder ve durdur düğmeleri mavi (#305BEE); kutu boşken yalnız mikrofon görünüyor.
  - Yer tutucu ve imleç gerçekteki gibi birlikte duruyor.
- **Üst çubuk:** Daireler gerçek ölçüde (r 59, #181818, ince açık halka). Menü ikonu gerçekteki gibi iki asimetrik çizgi. Kalem simgesi boş sohbette soluk. Durum çubuğu yeniden yerleştirildi.
- **Asistan cevabı:**
  - Balonsuz; "Birkaç saniye düşündü ›" satırının altında küçük, gri "Evlek" etiketi var.
  - Widget kenardan kenara ve gerçek piksellerle 1:1; v14'teki küçültülmüş, yuvarlak köşeli kart görünümü kalktı.
  - Kullanıcı balonunun satır aralığı ve iç dolgusu gerçeğe göre ayarlandı.
- **Kenar menü:** Açılınca sohbet ekranı kararmıyor, hafifçe aydınlanıyor ve köşesi yuvarlanan bir kart gibi kayıyor (gerçek iOS geçişi).
- **Eklentiler araması:**
  - Ekran dışında çizilen kapatma (×) dairesi hatası düzeltildi.
  - Arama hapı ve iskelet liste gerçek ölçüde; mavi odak halkası kaldırıldı.
- **Klavye ve Evlek sayfası:** Klavye tuşları tek tip ve gerçek renkte; arama tuşunda beyaz büyüteç var. Evlek sayfasındaki düğme gerçek ölçüde.
- **Bilerek eklenmeyenler:** Ana başlıkta "ChatGPT ⌄" ve ses modu düğmesi. Elimizdeki gerçek kayıtlarda görülmedi, tahminle eklenmedi.

## 2 · Lansman havası

Kalabalık yaratmadan:

- **Açılış ve kapanış:** Film karanlıktan ışıkla açılıyor (0,15–1,15 sn) ve sonda yine karanlığa iniyor. Böylece döngü bir "perde açılışı" gibi.
- **Işık vuruşları:** Görüntüde yalnız üç vuruş var: sonuç (8,45), eklenti bölümü (19,99) ve final (26,91). Her biri zeminde yumuşak bir lacivert-krem ışık patlaması ve telefonun metal kenarında kısa bir parlama.
- **Kenar ışığı:** Telefonun metal kenarında üç kez ışık süzülüyor: açılış, eklenti bölümü ve final.
- **Ekran temiz:** Ekranın üstüne hiçbir ışık ya da filtre binmiyor.
- **Kamera:** Açılışta telefon hafif bir yörüngeyle oturuyor. Yazım kutusuna itiş daha ağır ve dramatik (0,92 sn, yavaş başlayıp hızlanan). Telefonun altında zemin ışığı var.
- **Final:** Logo final vuruşunda (26,91) iniyor; uçarken ince bir hareket izi bırakıyor. Başlık ve dipnot buna göre kaydırıldı.
- **Tipografi:** Slogan iki kademede geliyor ("Sor." · "Evlek göstersin."). "Bağlı" anında adım diskinden tek bir mercan halka genişliyor.

## 3 · Ses (lansman)

Ses yine tamamen kodla üretildi (`audio/film15.py`, `audio/synth.py`).

- **Akış:**
  - **Açılış:** Karanlıkta filtreli pluck, D drone ve sub nabzı. Kamera itilirken yükselen bir swell, ardından küçük bir varış.
  - **Yazma:** Sakin, yazma tıkları önde.
  - **Sonuç (8,45):** Önce emme ve kısa bir nefes, sonra "impact".
  - **Ritim:** Klap, açık hat, synth bas ve sidechain pompası ile daha dolu bir groove.
  - **Ev sahnesi:** Seyrek ritim, deniz ambiyansı, alt frekansta dalış.
  - **Bağlı:** Merdivenle hazırlanan ikinci vuruş.
  - **Final (26,91):** Filmin en yüksek anı (yaklaşık −9,5 LUFS anlık); "Ev·lek" imzası, sub ve parlak çan.
  - **Kuyruk:** Sakin; 29,9'da sessize yakın.
- **Bölüm dengesi:** Fader otomasyonuyla kuruldu: açılış sessiz, yazma yaklaşık −17, orta bölüm −12…−15, final en yüksek.
- **Kalite:** Whoosh, braam ya da klişe riser yok. Sample ve harici model yok.

## Açık noktalar

1. **Kapak karesi:** İlk kare artık daha karanlık; logo ve başlık okunuyor. Instagram ızgarası için ayrı bir kapak görseli önerilir.
2. **Dinlemeden kuruldu:** Sesi dinleyemiyorum; dengeyi ölçümlerle kurdum. Kulağa ters gelen bir yer olursa kodda tek tek değiştirilebilir.
3. **Yayın öncesi doğrulanacaklar:**
   - ilanın yayında olduğu ve fiyatının £139.000 olduğu;
   - "evlek" aramasının herkese açık hesapta aynı sonucu verdiği.
