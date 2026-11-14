// v10 · tek zaman çizelgesi (saniye, 60 fps). Telefon ekranı ve dış kurgu aynı değerleri okur.
export const TL = {
  // kanca
  hookEnd: 1.6,
  // 1. soru (Girne)
  q1Type: [1.72, 2.12], q1Fly: [2.14, 2.46], send1: 2.52, bubble1: [2.56, 2.86],
  trace1: [2.74, 3.05], wA: 3.0, scrollA: [2.86, 3.3], carA: [3.4, 4.45],
  // 2. soru (Lapta)
  q2Type: [4.55, 4.92], q2Fly: [4.94, 5.22], send2: 5.28, bubble2: [5.3, 5.56],
  scrollB1: [5.3, 5.62], trace2: [5.5, 5.68], wB: 5.62, fly: [5.72, 6.5],
  scrollB2: [6.42, 6.78], carB: [6.62, 7.12], press: 7.24,
  // portal ve mekân
  portal: [7.42, 8.25], phoneIn: [8.3, 8.85], gal1: 10.45, gal2: 11.5, spaceEnd: 12.5,
  // 3. soru (karşılaştırma)
  q3Type: [12.62, 13.0], q3Fly: [13.02, 13.3], send3: 13.36, bubble3: [13.38, 13.62],
  scrollC: [13.36, 13.7], trace3: [13.56, 13.72], cmp: 13.7,
  proof: [14.5, 17.0],
  // web
  linkTap: 17.32, sheet: [17.46, 17.8], webEnd: 19.0,
  // eklenti akışı
  plug: 19.0, plugType: [19.32, 19.72], plugRes: 19.78, rowTap: 20.2, page: 20.32,
  installTap: 21.42, spin: [21.48, 21.86], bound: 21.86, tryTap: 22.72, newChat: 22.86,
  // kapanış
  close: 24.5, loop: 29.6,
};
