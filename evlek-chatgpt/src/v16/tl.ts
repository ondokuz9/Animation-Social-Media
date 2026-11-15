// v16 · zaman çizelgesi (sn, 60 fps) · 19,0 sn = 1140 kare. docs/v16/V16-KREATIF-RAPOR.md
// Izgara: 120 BPM (vuruş 0,5 sn). Ölçü başları: sonuç 2,5 · ev 5,5 · ikinci fotoğraf 8,0 · ilan 10,0 · CTA 12,0 · Bağlı 13,5 · kapanış 15,0.
export const DUR = 19;
export const MUSIC = {bpm: 120, phi: 0.5};
const X = 99; // v16'da kullanılmayan v15 olayları
export const TL = {
  // AÇILIŞ · sorgu büyük tipografiyle, 4 öbekte
  chunks: [-1, 0.4, 0.7, 1.0], send: 1.5, sheet: [1.55, 2.05], rise: [1.55, 2.0],
  search: [2.0, 2.5], think: 2.35, res: [2.5, 2.8], stopOff: 2.8,
  // SONUÇ → KART
  cam2: [3.1, 3.7], scroll: [3.1, 3.6], drag: [3.75, 3.95], coast: [3.95, 4.45], tap: 4.75,
  // EV · ana geçiş: karttaki fotoğraf → 1080×1600 pencere
  expand: [4.85, 5.5], swipe: [7.8, 8.12], land: [10.0, 10.6],
  // SONRAKİ ADIM
  contact: 11.5, cut: 12.0, ctaIn: [12.0, 12.45], install: 13.0, bound: 13.5, ctaOut: [14.55, 15.0],
  // KAPANIŞ
  end: [15.0, 15.6], title: [15.45, 16.1], cta: [16.4, 16.8],
  // v15 Screen bileşenlerinin okuduğu, v16'da tetiklenmeyen olaylar
  menu: X, plug: X, kbd: [X, X], ptype: [X, X], pres: X, row: X, searchTap: X, page: [X, X], spin: [X, X], tryTap: X, close: X, sig: [X, X], type: [0, 0],
};
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
export const CHUNKS = ['Lapta’da', '£160 bin altı,', 'deniz manzaralı', '2+1 daire'];
export const typeTimes = (): number[] => [];
