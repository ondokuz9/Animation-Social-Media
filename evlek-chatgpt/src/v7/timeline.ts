// VIDEO-1 v7 · tek zaman ve metin dosyası. 60 fps, 30 sn = 1800 kare. Zamanlar saniye.
// Metinler 14 Kas gerçek oturumundan (ref/chatgpt-web-gercek-oturum) birebir; rakamlar canlı MCP sonucundan.
import W from './wtimes.json';

export const FPS = 60;
export const TOTAL = 1800;
export const f2s = (f: number) => f / FPS;

// ---- iOS ekran (iPhone 3x mantığı: 1179×2556), videoda 1080 genişliğe iner ----
export const SCR = {w: 1179, h: 2556};
export const BASE = 1080 / SCR.w; // 0,916

export const T = {
  h1: [0, 3.0],
  cap1: [0.4, 2.8],
  push: [3.15, 3.75], // H1 telefon ekranı → tam kare (600 ms)
  ui: 3.0,
  // 1. mesaj
  kb1Up: 4.1, at: 4.45, mentionOpen: 4.5, mentionTypeE: 4.62, mentionTypeV: 4.74, mentionTap: 4.92, tagIn: 5.0,
  type1: [5.08, 7.0], send1: 7.12,
  think1: [7.3, 8.05], tool1: 8.05, widgetA: 8.2,
  label2: [9.5, 11.5],
  ans1: [10.6, 12.1],
  // 2. mesaj
  kb2Up: 12.15, type2: [12.45, 13.3], send2: 13.38,
  think2: [13.45, 13.75], tool2: 13.77, widgetB: 13.8,
  ans2: [16.1, 16.85],
  // ilan detayı (kart → detay, paylaşılan öğe 420 ms)
  detail: 17.15, detailDur: 0.42,
  // 3. mesaj (karşılaştırma)
  kb3Up: 19.65, type3: [19.95, 20.85], send3: 20.93,
  think3: [21.05, 21.45],
  table: [21.5, 22.6], diff: 22.65, para: [23.0, 23.7], links: [23.75, 24.05],
  linkTap: 24.3,
  sheet: 24.42, sheetDur: 0.36, skeleton: 0.3, waTap: 25.55,
  brighten: [25.75, 25.95], toH3: [25.95, 26.22],
  h3: [26.22, 30],
  logo: 27.0,
};

// Widget kayıt zamanları (ms, sekansın kendi başlangıcına göre) — capture.mjs ile ortak
export const WT = W;

// ---- Metinler (TR) ----
export const TXT = {
  cap1: 'Kuzey Kıbrıs’ta ev mi arıyorsunuz?',
  label2: 'Evlek, ChatGPT içinde',
  closing: 'artık ChatGPT’de.',
  composer: 'ChatGPT’ye sor',
  q1: 'Girne’de 160 bin sterlin altı, deniz manzaralı, satılık 2+1 daire göster.',
  // B4 vurgusu: balondaki ifadeler (sıra hareket kitabıyla aynı)
  q1Phrases: ['160 bin sterlin altı', 'deniz manzaralı', '2+1', 'satılık'],
  q2: 'Lapta’dakileri ucuzdan pahalıya göster.',
  q3: '£139.000 ve £127.000 olanları karşılaştır.',
  thinking: 'Düşünüyor',
  thought: '5s düşündü',
  toolLine: 'Search Northern Cyprus property listings açıldı',
  mentionName: 'Evlek',
  mentionDesc: 'Northern Cyprus property data',
  // **kalın** işaretli; paragraflar \n\n
  ans1:
    'Evlek’te kriterlerine uyan **52 satılık daire** bulundu. İlk 10 ilan yukarıda, en düşük fiyattan başlayarak gösteriliyor.\n\n' +
    'En uygun fiyatlı ilan **Arapköy’de £75.000.** Tüm sonuçlar Girne’de, 2+1, deniz manzaralı ve en fazla £160.000 olarak filtrelendi.\n\n' +
    'İstersen ilanları metrekarelerine göre karşılaştırabilir veya Girne Merkez, Alsancak ve Esentepe gibi bölgelere daraltabiliriz.',
  ans1Focus: '52 satılık daire',
  ans2:
    'Lapta’da kriterlerine uyan **8 satılık 2+1 deniz manzaralı daire** bulundu. İlanları ucuzdan pahalıya sıraladım; fiyatlar **£105.000–£147.000** arasında.\n\n' +
    'Tüm ilanlar £160.000 bütçenin altında. Sonuçları yukarıdaki Evlek kartlarından inceleyebilirsin.',
  tableTitle: 'Lapta: £127.000 ve £139.000 karşılaştırması',
  tableHead: ['Özellik', '£127.000', '£139.000'],
  // "Emlakçı" satırı bilerek yok (kişisel/ofis adı kadraja girmez)
  tableRows: [
    ['İlan', 'EVL-101433', 'EVL-100102'],
    ['Oda', '2+1', '2+1'],
    ['Alan', '104 m² brüt', '107 m² (tipi belirtilmemiş)'],
    ['Banyo', '2', '2'],
    ['Deniz manzarası', 'Var', 'Var'],
    ['Havuz', 'Ortak', 'Ortak'],
    ['Eşyalı', 'Evet', 'Evet'],
    ['Balkon ve teras', 'Var', 'Var'],
    ['Bahçe', 'Var', 'Belirtilmemiş'],
    ['Otopark', 'Var', 'Var'],
  ],
  diff: '**Fiyat farkı: £12.000 (%9,4).**',
  para:
    '**İlk tercihim £127.000’lik daire.** Daha düşük fiyatla bahçe, dağ manzarası, klima ve beyaz eşya gibi ek özellikler sunuyor. Ancak £139.000’lik dairenin alanı brüt/net olarak açıklanmadığından gerçek kullanım alanlarını doğrudan karşılaştıramıyoruz.',
  links: ['İlanları incele: ', '£127.000 daire ↗', ' ve ', '£139.000 daire ↗', '.'],
};
