// v11 · zaman çizelgesi (saniye, 60 fps). Üç perde: SOR 0–8,5 · GÖR 8,5–20,5 · EKLE 20,5–26 · kapanış.
// Kurul kararı: kamera hareketi 650–1300 ms, ardından ≥1,2 sn duruş; bir anda tek hareket; 0,5 sn ızgara.
export const TL = {
  // I · SOR
  rise: [0.0, 0.5], titleOut: [2.0, 2.25], logoDrop: [2.0, 2.5], push1: [2.5, 3.5],
  qWords: 2.9, qType: [2.9, 3.98], send: 5.0, bubble: [5.0, 5.3], trace: [5.08, 5.5],
  wB: 5.5, scrollB: [5.5, 5.85], fly: [5.85, 7.0], poly: [7.0, 7.3], cap: 7.3, slogan: [7.0, 8.6],
  // II · GÖR
  snaps: [8.7, 9.2, 9.7], snapDur: 0.3, select: 10.0, tap: 10.42,
  portal: [10.5, 11.5], phoneOut: [10.75, 11.4], unblur: [11.1, 11.5],
  tag: [12.0, 14.2], tagSub: 12.5, phoneIn: [14.5, 15.2], swipe: [15.25, 15.57], tilt: [15.5, 17.0],
  back: [17.0, 17.8], iosBack: [17.32, 17.62], q3Type: [17.8, 18.45], send3: 18.5, bubble3: [18.5, 18.8],
  scrollC: [18.5, 18.85], cmp: 18.6, cmpPush: [18.6, 19.3], diff: [18.8, 20.5],
  // III · EKLE
  plug: 20.5, plugPush: [20.5, 20.85], step1: [21.0, 22.9], plugType: [21.3, 21.8], plugRes: 22.0, rowTap: 22.5,
  page: 22.5, pagePush: [22.5, 22.85], btnPush: [23.0, 23.7], step2: [23.2, 25.0],
  installTap: 24.0, spin: [24.0, 24.45], bound: 24.5, boundPush: [24.5, 25.0], tryTap: 25.4,
  newChat: 25.5, newChatPush: [25.5, 25.85],
  // kapanış
  chipLift: [26.0, 26.6], title2: 26.3, foot: 26.6, cta: 27.4, ctaOut: [29.5, 29.75],
};
