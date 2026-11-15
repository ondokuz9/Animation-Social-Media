// V17 · FINAL · zaman çizelgesi (sn, 60 fps) · 22,0 sn = 1320 kare.
// Sıra (marka sahibi): başlık + telefon → ekrana yaklaşırken ChatGPT'de Evlek'e yazılır → etkileşim (sonuç, kart, ilan, ev, emlakçıya sor)
//   → Eklentiler'den Evlek'i ekle → "Evlek artık ChatGPT'de." bitiş.
// Müzik 120 BPM (vuruş 0,5 sn). Vuruşlar: sonuç 5,0 · ev 10,0 · eklenti 13,5 · Bağlı 18,0 · bitiş 19,5.
export const DUR = 22;
export const MUSIC = {bpm: 120, phi: 0.5};
export const TL = {
  // 1 · AÇILIŞ: başlık + telefon (yeni sohbet)
  intro: [0.0, 0.9], titleOut: [1.55, 1.9], push: [1.6, 2.4],
  // 2 · YAZ: Evlek çipi + sorgu, 4 öbek → gönder → Evlek aranıyor
  chunks: [2.45, 2.75, 3.05, 3.35, 3.65], send: 4.05, kbdDown: [4.1, 4.4], rise: [4.1, 4.55], follow: [4.04, 4.4],
  search: [4.42, 5.0], think: 4.88, res: [5.0, 5.3], stopOff: 5.3, cam1: [5.0, 5.5],
  // 3 · ETKİLEŞİM
  cam2: [5.75, 6.3], scroll: [5.75, 6.25], drag: [6.4, 6.65], coast: [6.65, 7.2], tap: 7.45, expand: [7.53, 7.95],
  swipe: [8.6, 8.83], page2: [8.83, 9.2], portalOut: [9.45, 10.0], portalIn: [11.2, 11.8],
  contact: 12.4, close: 12.85, collapse: [13.0, 13.4],
  // 4 · EKLENTİLER'DEN EVLEK'İ EKLE
  cam3: [13.0, 13.5], cap: [13.25, 13.65], menu: 13.6, side: [13.75, 14.05], plug: 14.45, plugOpen: [14.6, 14.9],
  searchTap: 15.2, kbd: [15.35, 15.6], ptype: [15.65, 15.9], pres: 16.0, row: 16.45, page: [16.6, 16.9],
  install: 17.5, bound: 18.0, tryTap: 18.55, newChat: [18.7, 19.0], capOut: [19.3, 19.55],
  // 5 · BİTİŞ
  back: [19.1, 19.8], end: [19.5, 20.1], cta: [20.3, 20.7],
  // v15 ekranında olup v17'de tetiklenmeyenler
  spin: [99, 99], sig: [-1, -1], type: [0, 0], page2x: 0,
};
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
/** öbekler: çip (0), sonra 4 sözcük grubu; her karakter öbeğiyle birlikte belirir */
const CH = ['Lapta’da ', '£160 bin altı,\n', 'deniz manzaralı ', '2+1 daire'];
export const typeTimes = (): number[] => CH.flatMap((c, i) => Array.from(c).map(() => TL.chunks[i + 1]));
