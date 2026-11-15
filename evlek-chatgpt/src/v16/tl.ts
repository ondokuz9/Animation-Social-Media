// v16 · zaman çizelgesi (sn, 60 fps) · 19,0 sn = 1140 kare. docs/v16/V16-KREATIF-RAPOR.md
// Açılış A (evle açılan) kazandı. Izgara: 120 BPM (vuruş 0,5 sn).
// Vuruşlar: sonuç 2,5 · ilan 5,5 · ev 8,0 · dönüş 10,0 · CTA 12,0 · Bağlı 13,5 · kapanış 15,0.
export const DUR = 19;
export const MUSIC = {bpm: 120, phi: 0.5};
const X = 99; // v16'da tetiklenmeyen v15 olayları
const PAST = -9; // film başlamadan olmuş sayılan olaylar (sohbet sonucu hazır)
export const TL = {
  // AÇILIŞ · gerçek ilan fotoğrafı + üstünde sorgu (4 öbek) → fotoğraf ChatGPT'deki gerçek karta iner
  chunks: [-1, 0.4, 0.7, 1.0], shrink: [1.75, 2.5],
  // ÜRÜN · tam telefon + söz
  pull: [3.0, 3.7], title: [3.62, 4.12], titleOut: [4.95, 5.2],
  // İLAN · karta dokun → gerçek ilan (kart fotoğrafı kahraman fotoğrafa birebir oturur)
  tap: 5.0, expand: [5.08, 5.5], swipe: [6.7, 6.93], page2: [6.93, 7.3],
  // EV · ilan fotoğrafı 1080×1600 pencereye büyür
  expand2: [7.45, 8.0], land: [10.0, 10.6],
  // SONRAKİ ADIM
  contact: 11.5, cut: 12.0, ctaIn: [12.0, 12.45], install: 13.0, bound: 13.5, ctaOut: [14.55, 15.0],
  // KAPANIŞ
  end: [15.0, 15.6], etitle: [15.45, 16.1], cta: [16.4, 16.8],
  // sohbet durumu: sonuç gelmiş, şerit £139.000 kartında durmuş
  send: PAST, rise: [PAST, PAST], search: [PAST, PAST], think: PAST, res: [PAST, PAST + 0.1], stopOff: PAST + 0.2,
  scroll: [PAST, PAST + 0.1], drag: [PAST + 0.2, PAST + 0.4], coast: [PAST + 0.4, PAST + 1.2],
  menu: X, plug: X, kbd: [X, X], ptype: [X, X], pres: X, row: X, searchTap: X, page: [X, X], spin: [X, X], tryTap: X, close: X, sig: [X, X], type: [0, 0],
};
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
export const CHUNKS = ['Lapta’da', '£160 bin altı,', 'deniz manzaralı', '2+1 daire'];
export const typeTimes = (): number[] => [];
