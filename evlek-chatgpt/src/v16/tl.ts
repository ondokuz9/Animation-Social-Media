// v16 · zaman çizelgesi (sn, 60 fps) · 18,0 sn = 1080 kare. docs/v16/V16-KREATIF-RAPOR.md
// Açılış A (evle açılan) kazandı. Izgara: 120 BPM (vuruş 0,5 sn).
// Vuruşlar: sonuç 2,5 · ilan 5,0 · ev 7,5 · dönüş 9,5 · CTA 11,5 · Bağlı 13,0 · kapanış 14,0.
export const DUR = 18;
export const MUSIC = {bpm: 120, phi: 0.5};
const X = 99; // v16'da tetiklenmeyen v15 olayları
const PAST = -9; // film başlamadan olmuş sayılan olaylar (sohbet sonucu hazır)
export const TL = {
  // AÇILIŞ · gerçek ilan fotoğrafı + üstünde sorgu (4 öbek) → fotoğraf ChatGPT'deki gerçek karta iner
  chunks: [-1, 0.4, 0.7, 1.0], shrink: [1.75, 2.5],
  // ÜRÜN · tam telefon + söz
  pull: [2.9, 3.5], title: [3.4, 3.85], titleOut: [4.45, 4.7],
  // İLAN · karta dokun → gerçek ilan (kart fotoğrafı kahraman fotoğrafa birebir oturur)
  tap: 4.5, expand: [4.58, 5.0], swipe: [6.0, 6.23], page2: [6.23, 6.6],
  // EV · ilan fotoğrafı 1080×1600 pencereye büyür
  expand2: [6.95, 7.5], land: [9.5, 10.1],
  // SONRAKİ ADIM
  contact: 10.9, cut: 11.5, ctaIn: [11.5, 11.9], install: 12.45, bound: 13.0, ctaOut: [13.6, 14.0],
  // KAPANIŞ
  end: [14.0, 14.6], etitle: [14.45, 15.1], cta: [15.3, 15.7],
  // sohbet durumu: sonuç gelmiş, şerit £139.000 kartında durmuş
  send: PAST, rise: [PAST, PAST], search: [PAST, PAST], think: PAST, res: [PAST, PAST + 0.1], stopOff: PAST + 0.2,
  scroll: [PAST, PAST + 0.1], drag: [PAST + 0.2, PAST + 0.4], coast: [PAST + 0.4, PAST + 1.2],
  menu: X, plug: X, kbd: [X, X], ptype: [X, X], pres: X, row: X, searchTap: X, page: [X, X], spin: [X, X], tryTap: X, close: X, sig: [X, X], type: [0, 0],
};
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
export const CHUNKS = ['Lapta’da', '£160 bin altı,', 'deniz manzaralı', '2+1 daire'];
export const typeTimes = (): number[] => [];
