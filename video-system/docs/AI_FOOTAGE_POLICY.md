# AI görüntü politikası

Taslak · 14 Ekim 2026 · Onur onayı bekliyor.

Evlek'in vaadi güven. Sahte ilanla mücadele eden bir platform, reklamında sahte
ev ya da sahte insan gösteremez. Bu politika her Evlek filmi, gönderisi ve
reklamı için geçerlidir.

## 1. Asla

- İzleyicinin gerçek bir ilan, iç mekân, manzara, semt ya da mesafe olarak
  okuyabileceği AI görüntüsü.
- AI ile üretilmiş emlakçı, müşteri ya da tanıklık.
- Gerçek bir kişinin izinsiz AI kopyası (yüz, ses, benzerlik). Türkiye'nin
  1 Ağustos 2026 reklam yönetmeliği değişikliği, onay ima eden AI kopyayı
  yasaklıyor. Bu bilgi ikincil kaynaktan; Resmî Gazete metniyle teyit edilmeli.
- Orijinali gösterilmeyen önce/sonra.
- Üretilmiş bir sahneye bağlanmış fiyat, getiri ya da piyasa iddiası.
- Üretilmiş görüntüyle "güvenli yatırım", "garantili tapu" ya da getiri vaadi.

## 2. İzinli (etiketle)

| Kullanım | Koşul |
|---|---|
| Soyut ara görüntü (deniz, ışık, doku) | Belirli bir yer gibi sunulmaz. Gerçekçiyse görünür etiket. |
| Sanal dekorasyon | Sitedeki desen: "AI ile görselleştirildi" + orijinal fotoğraf aynı filmde görünür. Mimariyi, boyutu, manzarayı değiştirmez. |
| Gerçek bir kişinin dublajı / avatarı | Yazılı izin (§4) + görünür etiket + her dilde ana dili konuşan kontrolü. |
| Stilize, fotogerçekçi olmayan karakter | Kimse onu gerçek kişi sanmayacaksa etiket gerekmez; yine de kayda geçer. |
| Kod animasyonu (Motion, Remotion) | AI üretimi sayılmaz; etiket gerekmez. Gösterdiği veri gerçek olmalı. |

## 3. Etiket

- Görünür etiket, AI görüntünün **ilk göründüğü anda** ekranda: "AI ile
  üretildi" / "AI ile görselleştirildi" (5 dilde, `video-system` ortak dizgesi).
  Okunabilir boyutta ve yeterince uzun süre (en az 1,5 sn).
- Her platformda AI ifşa ayarı açılır (Instagram/Facebook "AI info",
  TikTok AI etiketi, YouTube "değiştirilmiş veya sentetik içerik").
- Aracın gömdüğü görünmez filigran (SynthID, C2PA) görünür etiketin yerini
  tutmaz (AB YZ Yasası Md. 50).

## 4. İzin (gerçek kişiler)

Filme alınan, sesi klonlanan ya da avatarı yapılan herkesten imzalı izin:

- kim, hangi çekim/klon/avatar;
- amaç: Evlek tanıtımı, hangi kanallar (organik, ücretli);
- diller (TR, EN, RU, DE, AR);
- süre (önerilen 12 ay, yenilenebilir);
- kişinin her an geri çekme hakkı ve geri çekmede yayından kaldırma süresi
  (önerilen 14 gün);
- kişinin ağzından söyletilemeyecekler: fiyat, getiri, hukuki görüş, başka
  bir markanın onayı.

Onur için de imzalı kopya tutulur (şirket kurulduğunda tüzel kişiye geçer).
Ekip üyesine dayanan bir persona (ör. "Rumi") aynı izni ister.

## 5. Kayıt defteri

Her AI çekim için `video-system/provenance/<film>.csv` satırı:

```
shot_id,film,tool,model_version,plan_tier,date,prompt_or_source,input_assets,label_text,platform_flags,licence_snapshot
```

`licence_snapshot`, o günkü ticari kullanım koşullarının tarihli PDF'inin
dosya adıdır. Satın almadan önce koşullar satıcının kendi sayfasından okunur.

## 6. Yayın öncesi kontrol (her film)

- [ ] Her cümle `CLAIMS_AUDIT` tablosunda TAMAM (kaynak dosyası yazılı).
- [ ] Rakip adı yok, "ilk/tek" yok, kaynaksız rakam yok, "real estate" yok.
- [ ] AI çekimler kayıtta, etiketler ekranda, platform ayarı açık.
- [ ] Ekrandaki her gerçek kişi için imzalı izin var.
- [ ] RU, DE, AR metni ana dili konuşan biri tarafından okundu.
- [ ] Ücretli kampanyaysa: avukat görüşü alındı (AB Md. 50, Türkiye
      yönetmeliği, KKTC 89/2007). Meta'da Housing kategorisi kontrol edildi.
