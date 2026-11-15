// V18 · FINAL · zaman çizelgesi (sn, 60 fps) · 26,0 sn = 1560 kare. Kurgu V17 ile aynı sıra; kurgucu turu: +Özellikler, hafif yavaşlatma · vuruşlar: sonuç 5,5 · ev 11,0 · eklenti 16,5 · Bağlı 21,5 · bitiş 23,5
// YENİ: featScroll (ilan 0→500 px dFull, Özellikler çipleri; "Açıklama" görünmez), featCam (DETAIL→FEAT s≈0,82 ve geri)
export const DUR = 26;
export const MUSIC = {bpm: 120, phi: 0.5};
export const TL = {
  intro: [0.0, 0.9], titleOut: [1.55, 1.9], push: [1.6, 2.4],
  // chunks[0] Evlek çipi, chunks[1] ilk harf (yazım harf harf; bkz. typeTimes)
  chunks: [1.85, 1.95, 9, 9, 9], send: 4.5, kbdDown: [4.55, 4.85], rise: [4.55, 5.0], follow: [4.49, 4.85],
  search: [4.87, 5.5], think: 5.38, res: [5.5, 5.8], stopOff: 5.8, cam1: [5.5, 6.0],
  cam2: [6.65, 7.2], scroll: [6.65, 7.15], drag: [7.3, 7.55], coast: [7.55, 8.1], tap: 8.35, expand: [8.43, 8.85],
  swipe: [9.65, 9.88], page2: [9.88, 10.25], portalOut: [10.45, 11.0], portalIn: [12.2, 12.8],
  // kanıt anı 1,6 sn; "Emlakçıya sor" kadrajda kalır, basılmaz (sonucu gösterilemeyen dokunuş kaldırıldı); ✕ → ilan sohbete döner
  featScroll: [12.9, 13.55], featCam: [12.9, 13.6], featHold: [13.6, 15.2], featBack: [15.2, 15.6],
  contact: 99, close: 15.85, collapse: [16.0, 16.4],
  cam3: [16.0, 16.5], cap: [16.25, 16.65], menu: 16.6, side: [16.75, 17.05], plug: 17.5, plugOpen: [17.65, 17.95],
  searchTap: 18.3, kbd: [18.45, 18.75], ptype: [18.8, 19.1], pres: 19.2, row: 19.7, page: [19.85, 20.15],
  install: 21.0, bound: 21.5, tryTap: 22.35, newChat: [22.5, 22.8], capOut: [23.1, 23.35],
  back: [22.9, 23.6], end: [23.5, 24.1], cta: [24.3, 24.7], fade: [25.5, 26.0],
  spin: [99, 99], sig: [-1, -1], type: [0, 0], page2x: 0,
};
/** Özellikler'e kaydırma (dFull pikseli). 520 px'i geçmez: "Açıklama" ve "denize sıfır" görünmez */
export const FEAT_PX = 500;
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
/** harf harf yazım (kamera yaklaşırken başlar): harf 2–3 kare (doğal ritim), boşluk 3 kare, satır sonu 7 kare; her harf bir kareye kilitli.
 *  49 karakter ≈ 2,2 sn → son harf ≈4,18, gönder 4,5. */
export const typeTimes = (): number[] => {
  const s = QL.join('\n'); const out: number[] = [];
  let f = Math.round(TL.chunks[1] * 60), i = 0;
  for (const ch of s) {
    out.push(f / 60);
    f += ch === ' ' ? 3 : ch === '\n' ? 7 : (i++ % 3 === 1 ? 2 : 3);
  }
  return out;
};
