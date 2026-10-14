# İddia denetimi: marka filmi V7 ve emlakçı filmi v7

14 Ekim 2026. Her ekran cümlesi `Evlak-Emlak` reposundaki ürün gerçeğiyle
karşılaştırıldı (`docs/PRODUCT_TRUTH.md`, 13 Ekim doğrulaması;
`src/lib/trust-copy.ts`; kod). Kural (KARAR-19): kod kazanır, film koda uyar.

Bu belge hiçbir dosyayı değiştirmez. V7 golden master ve onaylı varlıklar
olduğu gibi kalır. Düzeltmeler yeni render ile, Onur onayından sonra yapılır.

Durumlar: **TAMAM** canlı ve kanıtlı · **DOĞRULA** muhtemelen doğru, canlı
ayarı kontrol edilmeli · **DEĞİŞTİR** ürün gerçeğiyle çelişiyor.

## Marka filmi V7 (`video-system/templates/brand-reel-v7/content.json`)

| Ekran metni | Durum | Kanıt / not |
|---|---|---|
| "Aklındaki evi… sen tarif et." / "Evlek anlar." / "AI arama" | TAMAM | Cümleyle AI arama canlı (`/api/ai-search`). |
| "Girne'de deniz gören, **Türk koçanlı** 2+1" | DEĞİŞTİR | Koçan, hukuki denetim bitene kadar MCP'den çıkarıldı (PR-E). Ürün gerçeği koçan iddiası taşımıyor. Önerilen sorgu: "Girne'de deniz gören, balkonlu 2+1". |
| Kriter çipi "Türk Koçanı" | DEĞİŞTİR | Aynı gerekçe. Yerine "Balkonlu". |
| "KOÇAN BİLGİSİ" (detay etiketi) | DEĞİŞTİR | Aynı gerekçe. Yerine "İLAN BİLGİSİ" veya "FİYAT GEÇMİŞİ" (canlı olduğu doğrulanırsa). |
| "Sadece bulmaz. Açıklar." | TAMAM | Genel, ölçülebilir iddia içermiyor. |
| "Bugünkü hâli / Olabileceği hâli" + "AI ile görselleştirildi · Temsilî" | DOĞRULA | Sanal dekorasyon kodda var. Üretim `VIRTUAL_STAGING_GENERATION_ENABLED` ile açılıyor; 1 Ağustos'ta yayında 0 onaylı görsel vardı. Prod'daki değer kontrol edilmeli. İfşa satırı doğru. |
| "Piyasayı gör. Getiriyi hesapla." | TAMAM | `/yatirim-hesaplayici` ve fiyat endeksi canlı. |
| "Kıbrıs'ta doğru ev." | TAMAM | Onaylı slogan (Brand v∞ §4.5.1). |
| "Web · iOS · Android · 5 dil" | TAMAM | Arayüz 5 dilde; uygulamalar mağazada. |
| Tüm fotoğraflar | DEĞİŞTİR | AI üretimi (C2PA `trainedAlgorithmicMedia`). Brand v∞ §12 AI fotoğrafını yasaklıyor. Gerçek fotoğrafla değiştir; bkz. `REAL_FOOTAGE_SHOTLIST.md`. |

## Emlakçı filmi v7 (`remotion/src/reels/emlakci/content.json`)

| Ekran metni | Durum | Kanıt / not |
|---|---|---|
| "KKTC'de emlakçıysan bunu görmen lazım." | TAMAM | |
| "İlan koymak değişti." / "Sen yayınla. Gerisi Evlek'te." | TAMAM | Ton iddiası; ölçülebilir vaat yok. |
| "Açıklamayı yazar" / "Sen onayla, o yazsın" / "Onayı sen veriyorsun." | TAMAM | AI açıklama önerisi insan onayıyla (`PRODUCT_TRUTH` §9). |
| "Beş dile çevirir" / "Beş dilde yayınlansın." | DOĞRULA | Açıklama 5 dilde var, başlık yalnız TR ve EN. Çevirilerin bir kısmı incelenmemiş AI. "Otomatik" ya da "tam eşlik" denmemeli. Öneri: "Açıklamayı beş dile çevirir". |
| "Boş odayı döşer" / "Evlek üç stilde döşüyor." | DEĞİŞTİR | Ürün 6 stil sunuyor (Modern Akdeniz, İskandinav, Japandi, Bohem, Çağdaş Lüks, Heykelsi Modern). Filmdeki "Modern / Akdeniz / Minimal" etiketleri ürünle eşleşmiyor. Etiketleri gerçek stil adlarına çevir, "üç stilde" yerine "stil seçerek". Üretim bayrağı da DOĞRULA. |
| "Yapay zekâya hazırlar" / "Cevap senin ilanından geliyor." | DOĞRULA | MCP bağlayıcısı ChatGPT ve Claude için canlı, ama dizin kaydı yok ve görünürlük garanti değil. Asistan sahnesi "Temsilî" etiketli; bu kalmalı. Hiçbir asistan adı verilmemeli. |
| "Doğru alıcıyla eşleştirir" / "Doğru alıcıya ulaşır" / "NİYETİ İLANA YAKIN OLAN ALICILAR" / "Doğru alıcıya çıkıyor" | DEĞİŞTİR | Ürün gerçeğinde eşleştirme özelliği yok. Önerilen yerine: "Cümleyle arayan alıcının karşısına çıkar" (AI arama canlı). |
| "Yayınla" butonu, telefonda | DEĞİŞTİR | Mobilden ilan yayını kapalı (`NATIVE_MOBILE_REGULATED_PUBLISHING_ENABLED=false`). Ayrıca yayın anında olmuyor: ilan önce `pending`, sonra Evlek ekibi aktive ediyor. Öneri: cihazı tarayıcı/masaüstü göster, "Yayınla" sonrası "İncelemeye gönderildi" durumu ekle. |
| "Sen sadece 'Yayınla'ya bastın." / "Bunları Evlek yaptı." | DEĞİŞTİR | v6'da emlakçıyı küçümsediği için kaldırılmıştı; content.json'da hâlâ var. Kullanılmıyorsa sil, kullanılıyorsa çıkar. |
| "Görseller ve ilan bilgileri temsilîdir." | TAMAM | Kalmalı. Gerçek ilana geçilirse "Görseller temsilîdir" de kalkar, yerine "İlan: [ofis adı], izinle" gelir. |
| Fiyatlar (£165.000, £185.000, £178.000) | TAMAM | Temsilî etiketli. Gerçek ilan kullanılırsa ilanın kendi fiyatı. |

## Özet

- 7 DEĞİŞTİR: koçan (×3), eşleştirme, telefonda yayın, staging stil adları, AI fotoğraflar. Bir de kullanılmayan eski satır var.
- 4 DOĞRULA: staging üretim bayrağı, beş dil ifadesi, MCP sahnesi, V7 staging.
- Düzeltmelerin hiçbiri V7 golden master'a dokunmaz. V7 düzeltmesi yeni bir film
  olur (`video/brand-reel-v8`). Emlakçı filminde metin değişiklikleri `content.json`,
  fotoğraf değişiklikleri yeni dosya adıyla yapılır (varlıklar yalnız eklenir).
