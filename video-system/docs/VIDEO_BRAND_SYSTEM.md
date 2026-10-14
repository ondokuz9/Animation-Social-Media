# Video tasarım sistemi kararı

Öneri · 14 Ekim 2026 · Onur bu kararı Claude'a bıraktı; uygulamadan önce son onay.

## Sorun

Repoda iki sistem var:

- **Brand v∞** (`Evlak-Emlak/docs/EVLEK_BRAND_V_INF.md`, kanonik): beyaz yüzey,
  Akdeniz Navy `#0A2540`, Champagne `#C9A157` fiyat, Firuze `#3FA796` kiralık,
  Mat Mercan `#B84E3B` yalnız CTA, Inter 700/400–500, "Sessiz Hareket".
- **Video reposunun sistemi** (`chats/chat1.md`, `project/_ds`, `remotion/src/brand`):
  krem `#F4F1EB`, navy `#14213D`, kobalt `#2F5CFF`, Fraunces + Hanken Grotesk +
  JetBrains Mono.

Site ile film ayrı markalar gibi görünüyor. İzleyici filmden siteye geçtiğinde
aynı şeyi görmeli.

## Karar (öneri)

**Yeni her film Brand v∞ ile yapılır.** Video sistemi ayrı bir marka değil,
Brand v∞'nun hareketli hâlidir.

| Konu | Video kuralı |
|---|---|
| Zemin | Beyaz ve Akdeniz Navy. Krem yalnız ikincil yüzey (Brand v∞ §6 izin veriyor). Bir sahnede tek zemin. |
| Metin | Navy zeminde beyaz, beyaz zeminde navy. |
| Fiyat | Champagne. Kiralık rozeti Firuze. |
| Mercan | Yalnız kapanıştaki tek CTA kutusu. Başka hiçbir yerde. |
| AI vurgusu | Violet `--ai-accent` `#534AB7`, yalnız AI özelliğini gösteren sahnede (sitedeki gibi). |
| Kobalt `#2F5CFF` | Yeni filmlerde yok. |
| Yazı tipi | Inter 700 başlık, Inter 400–500 gövde, tabular rakam. Fraunces, Hanken, JetBrains Mono yeni filmlerde yok. AR için Brand v∞'nun Arapça yedeği. |
| Logo | `<EvlekLogo>` SVG yolu; navy zeminde beyaz, beyaz zeminde navy. İtalik, gölge, fotoğraf üstü yok. Min. 24 px. |
| Hareket | Fade ve yavaş itme. Anlam taşımayan hareket yok. Zıplama/yay yok. Metin yalnız opacity ile girer. |
| Fotoğraf | Gerçek, izinli fotoğraf. Stok yok, AI fotoğraf yok (bkz. `AI_FOOTAGE_POLICY.md`). Boş oda tek başına gösterilmez. |

## Ne değişmez

- V7 golden master (`3c22d5a3…`) ve emlakçı master'ı (`06445523…`) olduğu gibi
  kalır. Yeniden render edilmez, yeniden kodlanmaz.
- `render/` ve `encode.mjs` dokunulmaz. Tüm filmler aynı encoder'dan çıkar.

## Uygulama

1. `remotion/src/brand/` yanında yeni bir `brand-vinf/` token dosyası: renkler
   Brand v∞ token adlarıyla, Inter `@font-face` yerel dosyadan.
2. Sonraki film (`video/<ad>` dalı) bu token dosyasını kullanır.
3. Eski token dosyaları silinmez; eski filmler onlara bağlı.
4. Bu dosya Onur onayından sonra Brand v∞'ya "Video eki" olarak taşınır
   (Evlak-Emlak deposunda ayrı PR).
