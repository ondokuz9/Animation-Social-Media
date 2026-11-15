// FINAL · zaman çizelgesi (sn, 60 fps) · 19,5 sn = 1170 kare. docs/v16/V16-KREATIF-RAPOR.md
// Izgara: 120 BPM (vuruş 0,5 sn). Vuruşlar: gönder 3,5 · sonuç 4,0 · ilan 6,5 · ev 9,0 · dönüş 11,0 · CTA 13,0 · Bağlı 14,5 · kapanış 15,5.
export const DUR = 19.5;
export const MUSIC = {bpm: 120, phi: 0.5};
const X = 99; // tetiklenmeyen v15 olayları
const PAST = -9; // kart şeridi baştan £139.000 kartında durur
export const TL = {
  // AÇILIŞ · gerçek ilan fotoğrafı + söz
  hook: [0.0, 1.4], shrink: [1.4, 2.0], sheet: [1.5, 2.0],
  // SOR · gerçek ChatGPT yazım kutusu: Evlek çipi + sorgu (4 öbek) → gönder → Evlek aranıyor
  chunks: [2.1, 2.4, 2.7, 3.0], send: 3.5, rise: [3.55, 3.85], kbdDown: [3.55, 3.8], cam1: [3.5, 3.9],
  search: [3.8, 4.0], think: 3.95, res: [4.0, 4.3], stopOff: 4.3, open: [4.0, 4.5],
  // SONUÇ → KART
  cam2: [4.8, 5.4], scroll: [4.8, 5.3], tap: 6.0,
  // İLAN
  expand: [6.08, 6.5], swipe: [7.5, 7.73], page2: [7.73, 8.1],
  // EV
  expand2: [8.45, 9.0], land: [11.0, 11.6],
  // SONRAKİ ADIM
  contact: 12.4, cut: 13.0, ctaIn: [13.0, 13.4], install: 13.95, bound: 14.5, ctaOut: [15.1, 15.5],
  // KAPANIŞ
  end: [15.5, 16.1], etitle: [15.95, 16.6], cta: [16.8, 17.2],
  drag: [PAST + 0.2, PAST + 0.4], coast: [PAST + 0.4, PAST + 1.2],
  menu: X, plug: X, kbd: [X, X], ptype: [X, X], pres: X, row: X, searchTap: X, page: [X, X], spin: [X, X], tryTap: X, close: X, sig: [X, X], type: [0, 0],
};
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
export const CHUNKS = ['Lapta’da ', '£160 bin altı,\n', 'deniz manzaralı ', '2+1 daire'];
/** her karakterin belirdiği an: öbek öbek (harf harf değil) */
export const typeTimes = (): number[] => CHUNKS.flatMap((c, i) => Array.from(c).map(() => TL.chunks[i]));
