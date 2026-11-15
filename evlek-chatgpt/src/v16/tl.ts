// FINAL · zaman çizelgesi (sn, 60 fps) · 20,0 sn = 1200 kare. docs/v16/V16-KREATIF-RAPOR.md
// Izgara: 120 BPM (vuruş 0,5 sn). Vuruşlar: gönder 3,5 · sonuç 4,5 · ilan 7,0 · ev 9,5 · dönüş 11,5 · CTA 13,5 · Bağlı 15,0 · kapanış 16,0.
export const DUR = 20;
export const MUSIC = {bpm: 120, phi: 0.5};
const X = 99; // tetiklenmeyen v15 olayları
const PAST = -9; // kart şeridi baştan £139.000 kartında durur
export const TL = {
  // AÇILIŞ · gerçek ilan fotoğrafı + söz
  hook: [0.0, 1.4], shrink: [1.4, 2.0], sheet: [1.5, 2.0],
  // SOR · gerçek ChatGPT yazım kutusu: Evlek çipi + sorgu (4 öbek) → gönder → Evlek aranıyor (1 sn)
  chunks: [2.1, 2.4, 2.7, 3.0], send: 3.5, rise: [3.55, 3.85], kbdDown: [3.55, 3.8], cam1: [3.5, 3.9],
  search: [3.8, 4.5], think: 4.38, res: [4.5, 4.8], stopOff: 4.8, open: [4.5, 5.0],
  // SONUÇ → KART
  cam2: [5.3, 5.9], scroll: [5.3, 5.8], tap: 6.5,
  // İLAN
  expand: [6.58, 7.0], swipe: [8.0, 8.23], page2: [8.23, 8.6],
  // EV
  expand2: [8.95, 9.5], land: [11.5, 12.1],
  // SONRAKİ ADIM
  contact: 12.9, cut: 13.5, ctaIn: [13.5, 13.9], install: 14.45, bound: 15.0, ctaOut: [15.6, 16.0],
  // KAPANIŞ
  end: [16.0, 16.6], etitle: [16.45, 17.1], cta: [17.3, 17.7],
  drag: [PAST + 0.2, PAST + 0.4], coast: [PAST + 0.4, PAST + 1.2],
  menu: X, plug: X, kbd: [X, X], ptype: [X, X], pres: X, row: X, searchTap: X, page: [X, X], spin: [X, X], tryTap: X, close: X, sig: [X, X], type: [0, 0],
};
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
export const CHUNKS = ['Lapta’da ', '£160 bin altı,\n', 'deniz manzaralı ', '2+1 daire'];
/** her karakterin belirdiği an: öbek öbek (harf harf değil) */
export const typeTimes = (): number[] => CHUNKS.flatMap((c, i) => Array.from(c).map(() => TL.chunks[i]));
