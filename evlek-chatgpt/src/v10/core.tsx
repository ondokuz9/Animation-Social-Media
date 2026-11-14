// VIDEO-1 v10 · ortak sabitler, zaman yardımcıları, yazı tipi, logo ve GERÇEK veri.
// Bütün fiyat/alan/ilan kodları live/*.json (14 Kas 2026 canlı MCP sonucu) ile birebir.
import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, Easing, staticFile} from 'remotion';

export const FPS = 60;
export const W = 1080, H = 1920;
export const C = {cream: '#FAF8F2', navy: '#0A2540', coral: '#B84E3B', ink: '#05101C'};
export const F = 'InterX, Inter, sans-serif';

export const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lin = (t: number, a: number, b: number) => (b === a ? (t >= a ? 1 : 0) : cl((t - a) / (b - a)));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const E = Easing.bezier(0.22, 1, 0.36, 1); // çıkış (yerleşme)
export const S = Easing.bezier(0.4, 0, 0.2, 1); // standart
export const IO = Easing.bezier(0.65, 0, 0.35, 1); // kamera
export const EIN = Easing.bezier(0.55, 0, 0.9, 0.3); // hızlanan çıkış
/** a..b arası E ile 0→1, c..d arası 1→0 */
export const win = (t: number, a: number, b: number, c = 1e9, d = 1e9, e = E) => e(lin(t, a, b)) * (1 - EIN(lin(t, c, d)));

// ---------- yazı tipi: Inter 300–800 (public/fonts + public/v10/fonts) ----------
export const useFontsV10 = () => {
  const [h] = useState(() => delayRender('fonts-v10'));
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const R: Record<string, string> = {
      latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
      'latin-ext': 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
    };
    const src = (s: string, w: string) => (w === '300' || w === '800' ? `v10/fonts/inter-${s}-${w}-normal.woff2` : `fonts/inter-${s}-${w}-normal.woff2`);
    Promise.all(['300', '400', '500', '600', '700', '800'].flatMap((w) => Object.entries(R).map(([s, u]) =>
      new FontFace('InterX', `url(${staticFile(src(s, w))}) format('woff2')`, {weight: w, unicodeRange: u}).load().then((ff) => document.fonts.add(ff)))))
      .then(() => document.fonts.ready)
      .then(() => { setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};

// ---------- Evlek logosu (temizlenmiş vektör) ----------
// v9 logosundaki ek yerleri vektörleştirme artığıydı: E dört parçadan kuruluydu ve sol kenarında
// çapraz kesik vardı; v ve k içinde sıfır alanlı diken üçgenler vardı. Aynı ölçülerle tek parça yeniden yazıldı.
export const LOGO_VB = '1240 325 530 165';
export const LOGO_AR = 530 / 165;
const LOGO_D = [
  'M1254.4 333H1353.4V357H1281.6V395.2H1349.4V419.2H1281.6V458H1353.4V482H1254.4Z', // E
  'M1361.15 373.2H1389.75L1415 442.942L1441.35 373.2H1469.95L1427.15 482H1403.95Z', // v
  'M1484.43 482V330.6H1510.63V482H1484.43Z', // l
  'M1657.28 330.6H1683.48V416.33L1724.68 373.2H1757.28L1717.08 417L1758.08 482H1728.08L1697.57 433.672L1683.48 448.799V482H1657.28Z', // k
];
import {LOGO_PATHS} from '../logo';
const LOGO_E_LETTER = LOGO_PATHS[3]; // "e" harfi zaten tek parça ve temiz
export const LOGO_ALL = [...LOGO_D.slice(0, 3), LOGO_E_LETTER, LOGO_D[3]];

export const Logo: React.FC<{h: number; color?: string; style?: React.CSSProperties; fill?: string}> = ({h, color = C.cream, style, fill}) => (
  <svg viewBox={LOGO_VB} width={h * LOGO_AR} height={h} style={{display: 'block', overflow: 'visible', ...style}}>
    <path d={LOGO_ALL.join(' ')} fill={fill ?? color} />
  </svg>
);

/** Evlek uygulama simgesi ("Ev"): eklenti listesinde gerçek simge koyu kare üstünde "Ev" */
export const EvIcon: React.FC<{size: number; r?: number; style?: React.CSSProperties}> = ({size, r = 0.24, style}) => (
  <div style={{width: size, height: size, borderRadius: size * r, background: 'linear-gradient(145deg,#1B3550,#0A2540 60%,#071A2E)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 700, fontSize: size * 0.44, color: C.cream, letterSpacing: '-0.04em', flexShrink: 0, ...style}}>Ev</div>
);

// ---------- GERÇEK veri ----------
export type Listing = {ref: string; price: number; district: string; rooms: string; bath: number; area: string | null; photos: number; img: string; pos?: string};
const L = (ref: string, price: number, district: string, bath: number, area: string | null, photos: number, img: string, pos?: string): Listing => ({ref, price, district, rooms: '2+1', bath, area, photos, img, pos});
/** Girne · satılık 2+1 · deniz manzaralı · £160k altı → 52 ilan; ilk 5 (ucuzdan pahalıya) */
export const GIRNE: Listing[] = [
  L('EVL-101212', 75000, 'Arapköy', 1, '85 m² net', 12, 'v4/EVL-101212.jpg'),
  L('EVL-100041', 75000, 'Arapköy', 1, '90 m²', 15, 'v4/EVL-100041.jpg', '50% 70%'),
  L('EVL-100280', 79000, 'Esentepe', 1, '75 m²', 10, 'v4/EVL-100280.jpg'),
  L('EVL-100378', 87000, 'Arapköy', 2, '90 m²', 14, 'v4/EVL-100378.jpg'),
  L('EVL-100197', 90000, 'Karşıyaka', 1, '80 m²', 10, 'v4/EVL-100197.jpg'),
];
/** Lapta · ucuzdan pahalıya → 8 ilan, £105.000–£147.000 */
export const LAPTA: Listing[] = [
  L('EVL-100336', 105000, 'Lapta', 1, '84 m²', 7, 'v4/EVL-100336.jpg', '50% 8%'), // havuzdaki kişiler kadraj dışında: yalnız bina
  L('EVL-100837', 110000, 'Lapta', 1, null, 23, 'v4/EVL-100837.jpg'),
  L('EVL-100932', 120000, 'Lapta', 1, '75 m² brüt', 6, 'v4/EVL-100932.jpg'),
  L('EVL-100185', 120000, 'Lapta', 1, '80 m²', 10, 'v4/EVL-100185.jpg'),
  L('EVL-101433', 127000, 'Lapta', 2, '104 m² brüt', 31, 'img/EVL-101433_00.jpg'),
  L('EVL-100102', 139000, 'Lapta', 2, '107 m²', 14, 'v4/EVL-100102_00.jpg', '45% 60%'),
  L('EVL-100970', 139990, 'Lapta', 2, '80 m² net', 22, 'v4/EVL-100970.jpg'),
  L('EVL-100975', 147000, 'Lapta', 2, '95 m² brüt', 12, 'v4/EVL-100975.jpg'),
];
export const HERO = LAPTA[5]; // EVL-100102 · £139.000
export const ALT = LAPTA[4]; // EVL-101433 · £127.000
/** Girne aramasının semt dağılımı (widget map.semts): ad, sayı, min, maks, [boylam, enlem] */
export const SEMTS: [string, number, number, number, number, number][] = [
  ['Alsancak', 14, 95000, 155000, 33.19607, 35.33941],
  ['Girne Merkez', 11, 129000, 158000, 33.31526, 35.32628],
  ['Lapta', 8, 105000, 147000, 33.17025, 35.33413],
  ['Esentepe', 6, 79000, 139900, 33.58338, 35.32955],
  ['Arapköy', 4, 75000, 93000, 33.43573, 35.29919],
  ['Karşıyaka', 2, 90000, 150000, 33.118, 35.346],
  ['Zeytinlik', 2, 159000, 160000, 33.29291, 35.32807],
  ['Bahçeli', 1, 93000, 93000, 33.62895, 35.34114],
  ['Çatalköy', 1, 120000, 120000, 33.40326, 35.31517],
  ['Edremit', 1, 145000, 145000, 33.25837, 35.33563],
  ['Karaağaç', 1, 137000, 137000, 33.52623, 35.30721],
  ['Karaoğlanoğlu', 1, 113000, 113000, 33.26959, 35.34196],
];
export const gbp = (n: number) => '£' + n.toLocaleString('de-DE');
export const kgbp = (a: number, b: number) => (a === b ? `£${Math.round(a / 1000)} bin` : `£${Math.round(a / 1000)}–${Math.round(b / 1000)} bin`);

// ---------- harita izdüşümü (Web Mercator, maplibre 512 karo) ----------
// Statik harita görüntüleri scripts/v10-map ile OpenFreeMap verisinden üretildi; 1179×820 css px, 2× piksel.
export type MapView = {img: string; lng: number; lat: number; z: number};
export const MAP_W = 1179, MAP_H = 820;
export const MAPS: Record<'girne' | 'mid' | 'lapta', MapView> = {
  girne: {img: 'v10/map/girne-z105.jpg', lng: 33.37, lat: 35.3, z: 10.5},
  mid: {img: 'v10/map/mid-z119.jpg', lng: 33.21, lat: 35.325, z: 11.9},
  lapta: {img: 'v10/map/lapta-z133.jpg', lng: 33.168, lat: 35.33, z: 13.3},
};
const mx = (lng: number) => (lng + 180) / 360;
const my = (lat: number) => { const s = Math.sin((lat * Math.PI) / 180); return 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI); };
/** coğrafi nokta → bir görünümün css pikseli (görünüm merkezi MAP_W/2, MAP_H/2) */
export const project = (v: {lng: number; lat: number; z: number}, lng: number, lat: number) => {
  const k = 512 * Math.pow(2, v.z);
  return {x: MAP_W / 2 + (mx(lng) - mx(v.lng)) * k, y: MAP_H / 2 + (my(lat) - my(v.lat)) * k};
};
