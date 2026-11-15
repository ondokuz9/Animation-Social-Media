// v14 · zaman çizelgesi (sn, 60 fps). docs/v14/kurul/plan.json (finish şefi) + Rumi kararı ("emlakçıya ulaş" anı korunur).
// Müzik ızgarası: 104 BPM, ölçü 2,30769 sn, faz 1,527 → B4 8,450 (sonuç) · B6 13,065 (kart) · B9 19,988 (eklenti) · B11 24,604 (Bağlı).
export const MUSIC = {bpm: 104, phi: 1.527};
export const TL = {
  // GİRİŞ
  sig: [1.4, 2.1], pop: [2.1, 2.3], titleDim: [1.42, 1.58], titleOut: [2.25, 2.45], push: [2.4, 3.1],
  // GELİŞME · yaz → ara → sonuç
  type: [3.15, 7.16], send: 7.296, kbdDown: [7.4, 7.7], rise: [7.4, 7.78], cam1: [7.8, 8.45],
  search: [7.8, 8.3], think: 8.3, res: [8.45, 8.75], stopOff: 8.75, slogan: [8.85, 9.03, 10.5, 10.7],
  // kart ve ilan
  cam2: [10.758, 11.4], scroll: [11.45, 11.95], dragIn: 11.85, drag: [12.0, 12.25], coast: [12.25, 12.85],
  tap: 13.065, expand: [13.25, 13.75],
  // ev ve galeri
  portalOut: [14.7, 15.373], portalIn: [16.45, 17.1], swipe: [17.45, 17.681], page2: [17.681, 18.08],
  contact: 18.3, close: 18.62, collapse: [18.8, 19.18],
  // SONUÇ · Eklentiler'den ekle
  cam3: [19.2, 19.85], path: [19.46, 19.7, 25.55, 25.75], menu: 19.988, side: [20.17, 20.47], plug: 20.854, plugOpen: [21.04, 21.34],
  searchTap: 21.6, kbd: [21.78, 22.06], ptype: [22.1, 22.367], pres: 22.45, row: 22.873, page: [23.06, 23.36],
  install: 24.027, spin: [24.1, 24.55], bound: 24.604, tryTap: 25.181, newChat: [25.36, 25.66],
  // KAPANIŞ
  back: [25.9, 26.55], title2: [26.55, 27.4], foot: [27.5, 27.75, 29.7, 29.9],
};
/** yazma: kelime içinde harf başına 4 kare, boşlukta +0,09 sn, satır sonunda +0,20 sn; her harf bir kareye kilitli */
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
export const typeTimes = (): number[] => {
  const s = QL.join('\n');
  const out: number[] = [];
  let t = TL.type[0];
  for (const ch of s) {
    out.push(Math.ceil(t * 60) / 60);
    t += 4 / 60 + (ch === ' ' ? 0.09 : ch === '\n' ? 0.2 : 0);
  }
  return out;
};
