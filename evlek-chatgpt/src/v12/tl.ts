// v12 · zaman çizelgesi (saniye, 60 fps). Yön "Önce ev": film gerçek havuz karesiyle açılır ve aynı karede kapanır.
// Kurgu tablosu: docs/v12/FINAL-RAPOR.md (G). Her ekran durumu ≥0,3 sn; ekran durumu yalnız kamera dururken değişir.
export const TL = {
  // I · kanca → ters portal → soru
  titleOut: [1.25, 1.5], rportal: [1.5, 2.5], gradOut: [1.5, 2.0],
  cutQ: 2.95, sig: [2.95, 3.45], pushB: [3.45, 4.15],
  trace: [3.55, 4.45], mapIn: [4.5, 4.9], headIn: [4.95, 5.2], slogan: [4.15, 6.0, 6.25],
  // kartlar → tam ekran detay → galeri → iç mekân portalı
  cutCards: 6.25, slide: [6.25, 6.6], tap: 7.3, fsOpen: [7.35, 7.7], pullD: [7.7, 8.2],
  nextTap: 8.3, next: 8.35, portal: [8.65, 9.65], interior: [9.65, 11.65],
  tag: [9.75, 11.4, 11.6], tagSub: 9.85,
  // telefon döner → bilgi → evlek.app
  phoneIn: [11.65, 12.3], pushPD: [12.3, 12.85], scroll: [13.2, 13.6], outTap: 13.75, web: [13.85, 14.25], pushPP: [14.55, 15.15],
  // III · ekle (yol şeridi 16,2–21,15)
  ext: 16.2, menuTap: 16.45, side: [16.5, 16.75], plugTap: 17.05, plugPush: [17.1, 17.4], searchTap: 17.7, type: [17.75, 17.95], res: 18.0,
  rowTap: 18.3, pagePush: [18.35, 18.65], pushBtn: [18.7, 19.3], installTap: 19.35, spin: [19.35, 19.7], bound: 19.7,
  tryTap: 20.9, newPush: [20.95, 21.25], gType: [21.3, 21.7], send: 21.75, bubble: [21.78, 22.05], gTrace: [21.9, 22.2], girne: [22.2, 22.45], gScroll: [22.2, 22.75],
  strip: [16.2, 20.9, 21.15],
  // kapanış (döngü)
  close: [23.45, 24.15], logoIn: 24.15, cta: 24.25, foot: 24.6, ctaOut: [29.5, 29.65], title2: [29.7, 29.95], exit: [29.45, 29.95],
};
