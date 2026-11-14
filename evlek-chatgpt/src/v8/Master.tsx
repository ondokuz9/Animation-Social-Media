// VIDEO-1 v8 · kurul raporu üzerine yeni kurgu.
// Gerçek iOS ekranı (v7 Screen) kaynak zamanından yeniden zamanlanır; ekran markasız 3D bir telefonun içinde,
// geniş / yakın / ekran planları arasında kesilerek anlatılır. Widget ve sayfa pikselleri değişmez.
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {Screen, layoutAt, scrollAt, TEXT_X} from '../v7/Film';
import {F, KB_TOP, useFonts} from '../v7/ios';
import {SCR, T} from '../v7/timeline';
import {LOGO_PATHS} from '../logo';

const FPS = 60;
const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lin = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const E = Easing.bezier(0.22, 1, 0.36, 1); // Ç
const K = Easing.bezier(0.4, 0, 0.2, 1); // K
const IO = Easing.bezier(0.45, 0, 0.2, 1); // kamera

const C = {cream: '#FAF8F2', navy: '#0A2540', coral: '#B84E3B'};

// ---------------- telefon geometrisi (tasarım px) ----------------
const PW = 1299, PH = 2700, OX = 60, OY = 72, PCX = PW / 2, PCY = PH / 2;
type Pose = {x: number; y: number; s: number; rx: number; ry: number; rz: number; glass: number};
const P = (x: number, y: number, s: number, rx = 0, ry = 0, rz = 0, glass = 0): Pose => ({x, y, s, rx, ry, rz, glass});
/** ekran noktasını (sx, sy) çıktıdaki (ox, oy) noktasına getiren cepheden poz */
const focus = (sx: number, sy: number, ox: number, oy: number, s: number): Pose => {
  let y = oy - s * (OY + sy - PCY);
  // yakın/ekran planında telefon kadrajı üstten ve alttan taşar: altta boş zemin kalmaz
  if (s >= 0.7) y = cl(y, 1960 - s * PCY, s * PCY - 40);
  return P(ox - s * (OX + sx - PCX), y, s);
};
const mixPose = (a: Pose, b: Pose, k: number): Pose => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), s: mix(a.s, b.s, k), rx: mix(a.rx, b.rx, k), ry: mix(a.ry, b.ry, k), rz: mix(a.rz, b.rz, k), glass: mix(a.glass, b.glass, k)});

// ---------------- kaynak zamanı (v7 ekranı) ----------------
// [çıktı t0, t1, kaynak s0, s1]; sınırlarda kesme
const SRC: [number, number, number, number][] = [
  [0.0, 1.2, 6.3, 6.55], // kanca: soru yazılıyor (küçük telefonda)
  [1.2, 2.6, 6.55, 7.12], // yakın: yazımın sonu insan hızında, 2,52'de gönder basması
  [2.6, 2.75, 7.12, 7.27],
  [2.75, 6.0, 8.05, 11.3], // harita + kartlar (B1–B5), cevap akmaya başlar
  [6.0, 7.0, 12.95, 13.45], // geniş → yakın: Lapta sorusu, gönder
  [7.0, 10.2, 13.85, 17.05], // Lapta uçuşu, kartlar, kaydırma, basma
  [10.2, 12.0, 17.08, 17.1], // kart telefondan çıkar (ekran durur)
  [12.0, 13.05, 17.62, 18.67], // ilan detayı + galeri kaydırmaları
  [13.05, 14.2, 18.67, 19.15],
  [14.2, 15.6, 20.25, 20.93], // geniş → yakın: karşılaştırma sorusu, gönder
  [15.6, 16.7, 21.4, 21.45],
  [16.7, 21.4, 21.45, 24.1], // tablo, fiyat farkı, öneri, bağlantılar
  [21.4, 22.0, 24.1, 24.2],
  [22.0, 22.2, 24.2, 24.42], // bağlantıya basma (24,30)
  [22.2, 22.56, 24.42, 24.78], // uygulama içi tarayıcı açılır
  [22.56, 22.8, 25.0, 25.24], // sayfa yüklenmiş (iskelet atlanır)
  [22.8, 30.0, 25.24, 25.42],
];
const srcAt = (t: number) => {
  for (const [a, b, s0, s1] of SRC) if (t >= a && t < b) return mix(s0, s1, (t - a) / (b - a));
  return SRC[SRC.length - 1][3];
};

// ekran koordinatında blok konumu
// ekran planında kartları göstermek için kullanıcı kaydırması (iOS kaydırmasının altına inmez)
const userScroll = (t: number, src: number): {min: number; k: number} | null => {
  const L = layoutAt(src);
  if (t >= 4.0 && t < 6.0 && L.blocks.wA) return {min: L.blocks.wA.y + 110, k: K(lin(t, 4.05, 4.5))};
  if (t >= 7.0 && t < 8.25 && L.blocks.wB) return {min: L.blocks.wB.y - 300, k: 1};
  if (t >= 8.25 && t < 10.2 && L.blocks.wB) return {min: L.blocks.wB.y + mix(-300, 110, K(lin(t, 8.25, 8.7))), k: 1};
  return null;
};
let CUR_T = 0;
const scrollFor = (src: number) => {
  const base = scrollAt(Math.round(src * FPS));
  const u = userScroll(CUR_T, src);
  return u ? base + (Math.max(base, u.min) - base) * u.k : base;
};
const blockY = (src: number, k: string, dy = 0) => {
  const L = layoutAt(src);
  const b = L.blocks[k];
  return (b ? b.y : 0) - scrollFor(src) + dy;
};
const compCenterY = () => KB_TOP - 38 - 240; // açık giriş kutusu (2 satır) ortası

// ---------------- kamera / telefon pozları ----------------
type Key = {t: number; p: (src: number) => Pose; cut?: boolean; ease?: (x: number) => number};
const SX = 589.5; // ekran yatay ortası
const S_ = 0.775; // ekran planı ölçeği (ekran ≈ 914 px, iki yanda gövde görünür)
const KEYS: Key[] = [
  // G1 · kanca: tam telefon sağ altta, eğik
  {t: 0, p: () => P(742, 1300, 0.44, 7, -19, -5, 1)},
  {t: 1.25, p: () => P(736, 1290, 0.455, 6, -15, -4, 1), ease: Easing.linear},
  // N · sorguya yaklaş (400 ms)
  {t: 1.68, p: () => focus(SX, compCenterY() + 120, 540, 1080, 0.86)},
  {t: 2.6, p: () => focus(SX, compCenterY() + 150, 540, 1080, 0.9), ease: Easing.linear},
  // S-M · harita (kesme)
  {t: 2.75, cut: true, p: (s) => focus(SX, blockY(s, 'wA', 420), 540, 860, S_)},
  {t: 4.05, p: (s) => focus(SX, blockY(s, 'wA', 470), 540, 860, S_), ease: Easing.linear},
  // kartlara in (450 ms)
  {t: 4.5, p: (s) => focus(SX, blockY(s, 'wA', 1180), 540, 900, 0.8)},
  {t: 6.0, p: (s) => focus(SX, blockY(s, 'wA', 1200), 540, 900, 0.82), ease: Easing.linear},
  // G2 · gün batımı, tam telefon (kesme)
  {t: 6.0, cut: true, p: () => P(560, 1010, 0.5, 8, 17, 4, 1)},
  {t: 6.35, p: () => P(556, 1000, 0.52, 7, 14, 3.5, 1), ease: Easing.linear},
  {t: 6.95, p: () => focus(SX, compCenterY() + 150, 540, 1060, 0.88)},
  // S-M · Lapta haritası (kesme)
  {t: 7.0, cut: true, p: (s) => focus(SX, blockY(s, 'wB', 420), 540, 860, S_)},
  {t: 8.2, p: (s) => focus(SX, blockY(s, 'wB', 460), 540, 860, S_), ease: Easing.linear},
  {t: 8.65, p: (s) => focus(SX, blockY(s, 'wB', 1180), 540, 900, 0.8)},
  {t: 10.2, p: (s) => focus(SX, blockY(s, 'wB', 1220), 540, 900, 0.83), ease: Easing.linear},
  // G3 · deniz ışığı: telefon üst sağ, kart sol alta çıkar (kesme)
  {t: 10.2, cut: true, p: () => P(775, 700, 0.37, 6, -16, -5, 1)},
  {t: 12.0, p: () => P(770, 690, 0.385, 5, -12, -4, 1), ease: Easing.linear},
  // S-K · ilan detayı (kesme)
  {t: 12.0, cut: true, p: () => P(728, 1268, 0.5, 5, -15, -4, 1)},
  {t: 14.2, p: () => P(722, 1250, 0.52, 4, -12, -3, 1), ease: Easing.linear},
  // G2 · kireç, tam telefon, karşılaştırma sorusu (kesme)
  {t: 14.2, cut: true, p: () => P(540, 1000, 0.5, 8, 16, 4, 1)},
  {t: 14.85, p: () => P(536, 990, 0.52, 7, 13, 3.5, 1), ease: Easing.linear},
  {t: 15.5, p: () => focus(SX, compCenterY() + 150, 540, 1060, 0.88)},
  // N · gönderilmiş soru (kesme)
  {t: 15.6, cut: true, p: (s) => focus(SX, blockY(s, 'b3', 110), 540, 780, 0.86)},
  {t: 16.7, p: (s) => focus(SX, blockY(s, 'b3', 120), 540, 780, 0.87), ease: Easing.linear},
  // S-T · tablo (kesme), sonra fiyat farkı, öneri, bağlantı
  {t: 16.7, cut: true, p: (s) => focus(SX, blockY(s, 'tab', 520), 540, 860, S_)},
  {t: 18.3, p: (s) => focus(SX, blockY(s, 'tab', 620), 540, 860, S_), ease: Easing.linear},
  {t: 18.85, p: (s) => focus(SX, Math.min(blockY(s, 'tab', 900), blockY(s, 'diff', 0) || 1e9), 540, 860, 0.8)},
  {t: 19.9, p: (s) => focus(SX, blockY(s, 'diff', 120), 540, 760, 0.8)},
  {t: 20.6, p: (s) => focus(SX, blockY(s, 'para', 200), 540, 860, 0.8)},
  {t: 21.4, p: (s) => focus(SX, blockY(s, 'para', 320), 540, 860, 0.8)},
  // N · bağlantı (kesme)
  {t: 21.4, cut: true, p: (s) => focus(SX, blockY(s, 'links', 72), 540, 960, 0.9)},
  {t: 22.2, p: (s) => focus(SX, blockY(s, 'links', 72), 540, 960, 0.92), ease: Easing.linear},
  // S-V · evlek.app (kesme), sayfada aşağı
  {t: 22.2, cut: true, p: () => focus(SX, 1180, 540, 900, S_)},
  {t: 23.6, p: () => focus(SX, 1200, 540, 900, S_), ease: Easing.linear},
  {t: 24.3, p: () => focus(SX, 1650, 540, 900, S_)},
  {t: 25.3, p: () => focus(SX, 1660, 540, 900, S_), ease: Easing.linear},
  // G4 · geri çekil, kremde tam telefon
  {t: 26.0, p: () => P(540, 960, 0.56, 5, -12, -4, 1)},
  {t: 26.8, p: () => P(540, 975, 0.54, 5, -13, -4, 1), ease: Easing.linear},
  // kapanış: telefon aşağıya iner, eğik
  {t: 27.5, p: () => P(560, 1690, 0.5, 16, -14, -7, 1)},
  {t: 30.0, p: () => P(560, 1670, 0.5, 15, -12, -6, 1), ease: Easing.linear},
];
const poseAt = (t: number, src: number): Pose => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  if (!b || b.cut) return a.p(src);
  const k = (b.ease ?? IO)(lin(t, a.t, b.t));
  return mixPose(a.p(src), b.p(src), k);
};

// ---------------- arka planlar ----------------
type BgId = 'photo' | 'cream' | 'sunset' | 'sea' | 'lime' | 'navy' | 'blurphoto' | 'gallery';
const BG: [number, BgId][] = [
  [0, 'photo'], [1.75, 'cream'], [6.0, 'sunset'], [7.0, 'cream'], [10.2, 'blurphoto'], [12.0, 'gallery'], [14.2, 'lime'], [15.6, 'cream'], [26.8, 'navy'],
];
const bgAt = (t: number) => { let id: BgId = 'photo', t0 = 0; for (const [a, b] of BG) if (t >= a) { id = b; t0 = a; } return {id, t0}; };
const svg = (p: string) => staticFile(`kurul/${p}`);
const Full: React.FC<{src: string; o?: number; blend?: React.CSSProperties['mixBlendMode']}> = ({src, o = 1, blend}) => (
  <Img src={src} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, opacity: o, mixBlendMode: blend}} />
);
const Background: React.FC<{id: BgId; t: number; t0: number}> = ({id, t, t0}) => {
  const d = t - t0;
  if (id === 'photo') {
    // gerçek ilan fotoğrafı (EVL-100102 · Lapta): havuz ve deniz
    const z = 1 + 0.035 * (t / 1.75);
    return (
      <AbsoluteFill style={{background: '#0E2233', overflow: 'hidden'}}>
        <Img src={staticFile('v4/EVL-100102_00.jpg')} style={{position: 'absolute', height: 1920 * z, left: -420 - 60 * (t / 1.75), top: -(1920 * z - 1920) / 2}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,16,28,.62) 0%, rgba(5,16,28,.28) 26%, rgba(5,16,28,0) 44%, rgba(5,16,28,0) 70%, rgba(5,16,28,.35) 100%)'}} />
      </AbsoluteFill>
    );
  }
  if (id === 'blurphoto')
    return (
      <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
        <Img src={staticFile('v4/EVL-100102_00.jpg')} style={{position: 'absolute', height: 2100, left: -820 + d * 18, top: -90, filter: 'blur(26px) saturate(1.05)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,20,34,.35), rgba(6,20,34,.62))'}} />
      </AbsoluteFill>
    );
  if (id === 'gallery') {
    // ilan galerisi tam kare: widget'taki kaydırmalarla aynı anda (1/14 → 2/14 → 3/14)
    const sw = [12.43, 13.13];
    const pics = ['EVL-100102_00.jpg', 'EVL-100102_01.jpg', 'EVL-100102_02.jpg'];
    return (
      <AbsoluteFill style={{background: '#0E2233', overflow: 'hidden'}}>
        {pics.map((p, i) => {
          const a = i === 0 ? 1 : E(lin(t, sw[i - 1], sw[i - 1] + 0.38));
          const zt = i === 0 ? d : t - sw[i - 1];
          const z = 1.04 + 0.025 * zt;
          return a > 0 && <Img key={p} src={staticFile(`v4/${p}`)} style={{position: 'absolute', height: 1920 * z, left: (i === 0 ? -620 : -700) - zt * 22, top: -(1920 * z - 1920) / 2, opacity: a}} />;
        })}
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,16,28,.70) 0%, rgba(5,16,28,.25) 22%, rgba(5,16,28,0) 40%, rgba(5,16,28,0) 62%, rgba(5,16,28,.55) 100%)'}} />
      </AbsoluteFill>
    );
  }
  if (id === 'cream')
    return (
      <AbsoluteFill style={{background: C.cream}}>
        <Full src={svg('arka-plan/03-kirec-badana.svg')} />
        <Full src={svg('doku/kagit-lifleri.svg')} o={0.26} />
      </AbsoluteFill>
    );
  if (id === 'lime')
    return (
      <AbsoluteFill style={{background: C.cream}}>
        <Full src={svg('arka-plan/03-kirec-badana.svg')} />
        <Full src={svg('doku/kagit-lifleri.svg')} o={0.3} />
        <Full src={svg('doku/isik-sizmasi.svg')} o={0.22 * (1 - lin(d, 0.1, 1.2))} />
      </AbsoluteFill>
    );
  if (id === 'sunset')
    return (
      <AbsoluteFill style={{background: C.cream}}>
        <AbsoluteFill style={{background: 'linear-gradient(165deg, #F6E3D2 0%, #EFC7AE 42%, #D9998A 78%, #B9776E 100%)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(60% 40% at 18% 16%, rgba(255,244,222,.85), rgba(255,244,222,0) 70%)'}} />
        <Full src={svg('doku/kagit-lifleri.svg')} o={0.22} />
        <Full src={svg('doku/isik-sizmasi.svg')} o={0.25 * (1 - lin(d, 0.05, 0.9))} />
      </AbsoluteFill>
    );
  if (id === 'sea')
    return (
      <AbsoluteFill style={{background: C.navy}}>
        <Full src={svg('arka-plan/01-deniz-isigi.svg')} />
        <Full src={svg('doku/ince-gren.svg')} o={0.16} />
      </AbsoluteFill>
    );
  // navy kapanış
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <Full src={svg('arka-plan/01-deniz-isigi.svg')} o={0.85} />
      <AbsoluteFill style={{background: 'radial-gradient(70% 45% at 50% 30%, rgba(250,248,242,.10), rgba(10,37,64,0) 70%)'}} />
      <Full src={svg('doku/ince-gren.svg')} o={0.14} />
    </AbsoluteFill>
  );
};

// ---------------- 3D telefon ----------------
const Phone: React.FC<{pose: Pose; t: number; children: React.ReactNode; overlay?: React.ReactNode; dark: boolean}> = ({pose, t, children, overlay, dark}) => {
  const {x, y, s, rx, ry, rz, glass} = pose;
  // ışık soldan üstten (saat 10): gölge sağ alta
  const shOff = {x: 26 + ry * -0.8, y: 46};
  const sweep = ((t * 0.55) % 2.4) / 2.4; // cam üstünde yavaş ışık süpürmesi (yalnız geniş planlarda)
  return (
    <>
      {/* yayılım + silüet gölgesi (2D, telefonun altında) */}
      <div style={{position: 'absolute', left: x - PCX, top: y - PCY, width: PW, height: PH, transform: `translate(${shOff.x * s * 2}px, ${shOff.y * s * 2}px) rotate(${rz}deg) scale(${s * 1.01})`, transformOrigin: 'center', opacity: dark ? 0.75 : 0.6}}>
        <Img src={svg('telefon/govde-golgesi.svg')} style={{width: PW, height: PH, filter: `blur(${18}px)`}} />
      </div>
      <div style={{position: 'absolute', inset: 0, perspective: 2400, perspectiveOrigin: `${x}px ${y - 120}px`}}>
        <div style={{position: 'absolute', left: x - PCX, top: y - PCY, width: PW, height: PH, transformStyle: 'preserve-3d', transformOrigin: 'center', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`}}>
          {/* kalınlık: arka plaka katmanları */}
          {[24, 21, 18, 15, 12, 9, 6, 3].map((z) => (
            <Img key={z} src={svg('telefon/kalinlik-kenari.svg')} style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, transform: `translateZ(${-z * 1.6}px)`}} />
          ))}
          {/* ekran */}
          <div style={{position: 'absolute', left: OX, top: OY, width: SCR.w, height: SCR.h, borderRadius: 117, overflow: 'hidden', background: '#000', transform: 'translateZ(-1px)'}}>
            {children}
            {overlay}
            {/* cam: ince ışık süpürmesi (UI üzerinde çok hafif, yalnız geniş planlarda) */}
            {glass > 0.01 && (
              <div style={{position: 'absolute', inset: 0, opacity: 0.55 * glass, background: `linear-gradient(118deg, rgba(255,255,255,0) ${-30 + sweep * 160}%, rgba(255,255,255,.10) ${-18 + sweep * 160}%, rgba(255,255,255,0) ${-6 + sweep * 160}%)`}} />
            )}
          </div>
          {/* ön gövde (şeffaf kesim) */}
          <Img src={svg('telefon/govde.svg')} style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH}} />
          {/* sensör adası (gerçek ölçüde hap) */}
          <div style={{position: 'absolute', left: PCX - 186, top: OY + 34, width: 372, height: 108, borderRadius: 54, background: '#020304', transform: 'translateZ(1px)'}}>
            <div style={{position: 'absolute', right: 34, top: 34, width: 40, height: 40, borderRadius: 20, background: 'radial-gradient(circle at 40% 38%, #3B5363 0 18%, #0E1A22 46%, #05080A 70%)'}} />
          </div>
          {/* cam kenar yansıması */}
          <Img src={svg('telefon/cam-yansimasi.svg')} style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, opacity: 0.23 + 0.21 * glass, transform: 'translateZ(2px)'}} />
        </div>
      </div>
    </>
  );
};

// ---------------- ekran içi editoryal işaretler (ekran koordinatı) ----------------
const ScreenMarks: React.FC<{t: number; src: number}> = ({t, src}) => {
  const out: React.ReactNode[] = [];
  // gri basma noktaları (gerçek hedefte, 183 ms)
  const tap = (tt: number, sx: number, sy: number, key: string) => {
    if (t < tt || t > tt + 0.2) return;
    const k = t < tt + 0.083 ? K(lin(t, tt, tt + 0.083)) : 1 - Easing.bezier(0.33, 0, 0.67, 1)(lin(t, tt + 0.083, tt + 0.183));
    const sc = t < tt + 0.083 ? mix(0.88, 1, k) : mix(0.96, 1, k);
    out.push(<div key={key} style={{position: 'absolute', left: sx - 63, top: sy - 63, width: 126, height: 126, borderRadius: 63, background: `rgba(217,221,224,${0.42 * k})`, transform: `scale(${sc})`}} />);
  };
  tap(2.52, 1068, KB_TOP - 38 - 90, 'send1');
  tap(6.83, 1068, KB_TOP - 38 - 90, 'send2');
  tap(15.52, 1068, KB_TOP - 38 - 90, 'send3');
  // bağlantı satırı: £139.000
  if (src >= T.links[0]) {
    const ly = blockY(src, 'links', 36);
    tap(22.08, TEXT_X + 190, ly + 72, 'link');
  }
  // tablo başlığında iki fiyat çerçevesi (gliflerden ≥12 px uzak)
  if (src >= T.table[0] + 0.1 && t >= 17.0 && t < 18.75) {
    const ty = blockY(src, 'tab', 150);
    const k = E(lin(t, 17.0, 17.2)) * (1 - lin(t, 18.5, 18.75));
    const frame = (x: number, w: number, key: string) => (
      <div key={key} style={{position: 'absolute', left: x, top: ty - 14, width: w, height: 128, borderRadius: 26, border: `4px solid rgba(250,248,242,${0.85 * k})`, boxSizing: 'border-box'}}>
        <div style={{position: 'absolute', left: 22, bottom: -4, height: 6, width: 70 * k, borderRadius: 3, background: C.coral}} />
      </div>
    );
    out.push(frame(TEXT_X + 330 - 22, 300, 'f1'), frame(TEXT_X + 650 - 22, 300, 'f2'));
  }
  // fiyat farkı: mercan alt çizgi
  if (src >= T.diff && t >= 18.95 && t < 21.3) {
    const dy = blockY(src, 'diff', 66);
    const k = E(lin(t, 18.95, 19.35)) * (1 - lin(t, 21.0, 21.3));
    out.push(<div key="diff" style={{position: 'absolute', left: TEXT_X, top: dy, height: 6, width: 860 * k, borderRadius: 3, background: C.coral}} />);
  }
  return <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>{out}</div>;
};

// ---------------- telefondan çıkan gerçek kart (B kaydı, son kare) ----------------
const CARD = {x: 48, y: 867, w: 696, h: 783};
const PopCard: React.FC<{t: number}> = ({t}) => {
  if (t < 10.2 || t >= 12.0) return null;
  const k = E(lin(t, 10.28, 10.62));
  const w = 690 * mix(0.55, 1, k);
  const sc = w / CARD.w;
  const x = mix(560, 64, k), y = mix(760, 1010, k);
  const drift = (t - 10.62) * 6;
  return (
    <div style={{position: 'absolute', left: x, top: y - Math.max(0, drift), width: CARD.w * sc, height: CARD.h * sc, opacity: lin(t, 10.28, 10.4), transform: `rotate(${mix(-5, -1.5, k)}deg)`, borderRadius: 40 * sc, overflow: 'hidden', boxShadow: `0 ${50 * k}px ${110 * k}px rgba(2,10,20,${0.55 * k}), 0 ${8 * k}px ${22 * k}px rgba(2,10,20,.35)`}}>
      <Img src={staticFile('wcap/B/0201.png')} style={{position: 'absolute', left: -CARD.x * sc, top: -CARD.y * sc, width: 1092 * sc}} />
    </div>
  );
};

// ---------------- yazılar ----------------
const Words: React.FC<{text: string; t: number; t0: number; size: number; weight?: number; color?: string; stagger?: number; lh?: number; style?: React.CSSProperties}> = ({text, t, t0, size, weight = 700, color = C.cream, stagger = 0.06, lh = 1.05, style}) => {
  let wi = 0;
  return (
    <div style={{fontFamily: F, fontSize: size, fontWeight: weight, color, lineHeight: lh, letterSpacing: '-0.025em', ...style}}>
      {text.split('\n').map((line, li) => (
        <div key={li} style={{whiteSpace: 'nowrap'}}>
          {line.split(' ').map((w, j) => {
            const st = t0 + wi++ * stagger;
            const k = E(lin(t, st, st + 0.42));
            return <span key={j} style={{display: 'inline-block', marginRight: '0.24em', opacity: k, transform: `translateY(${(1 - k) * 0.35 * size}px)`, filter: `blur(${(1 - k) * 6}px)`}}>{w}</span>;
          })}
        </div>
      ))}
    </div>
  );
};

const Hook: React.FC<{t: number}> = ({t}) => {
  if (t > 1.75) return null;
  const out = Easing.in(Easing.cubic)(lin(t, 1.0, 1.25));
  return (
    <div style={{position: 'absolute', left: 76, top: 168, opacity: 1 - out, transform: `translateY(${-30 * out}px)`}}>
      {/* yer etiketi */}
      <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: F, fontSize: 34, fontWeight: 600, color: 'rgba(250,248,242,.92)', letterSpacing: '0.02em', marginBottom: 26}}>
        <svg width="26" height="30" viewBox="0 0 128 148"><path d="M64 132S22 86 22 59a42 42 0 1 1 84 0c0 27-42 73-42 73Z" fill={C.cream} /><circle cx="64" cy="59" r="14" fill={C.coral} /></svg>
        LAPTA · KUZEY KIBRIS
      </div>
      {/* ilk karede tam okunur: kare 0'da kelimeler yerinde */}
      <Words text={'Bu manzarada\nbir ev ne kadar?'} t={t + 1} t0={0} size={104} stagger={0} style={{textShadow: '0 4px 40px rgba(0,10,20,.45)'}} />
    </div>
  );
};

// karşılaştırma öncesi iki ilan yan yana (gerçek fotoğraf ve veriler)
const Compare: React.FC<{t: number}> = ({t}) => {
  const a = 15.6, b = 16.7;
  if (t < a || t >= b) return null;
  const card = (i: number) => {
    const k = E(lin(t, a + 0.05 + i * 0.1, a + 0.5 + i * 0.1));
    const pic = i === 0 ? 'img/EVL-101433_00.jpg' : 'v4/EVL-100102_00.jpg';
    const price = i === 0 ? '£127.000' : '£139.000';
    const meta = i === 0 ? '2+1 · 104 m² brüt' : '2+1 · 107 m²';
    const x = i === 0 ? 70 : 556, rot = i === 0 ? -2.5 : 2.5;
    return (
      <div key={i} style={{position: 'absolute', left: x, top: 560 + (i ? 40 : 0), width: 454, opacity: k, transform: `translateY(${(1 - k) * 60}px) rotate(${rot * k}deg)`, borderRadius: 34, overflow: 'hidden', background: '#16222E', boxShadow: '0 40px 90px rgba(2,10,20,.5)'}}>
        <Img src={staticFile(pic)} style={{display: 'block', width: 454, height: 560, objectFit: 'cover', transform: `scale(${1.08 - 0.03 * (t - a)})`}} />
        <div style={{padding: '26px 30px 30px', fontFamily: F, color: C.cream}}>
          <div style={{fontSize: 58, fontWeight: 700, letterSpacing: '-0.03em'}}>{price}</div>
          <div style={{marginTop: 6, fontSize: 30, fontWeight: 500, color: 'rgba(250,248,242,.75)'}}>{meta}</div>
          <div style={{marginTop: 4, fontSize: 28, color: 'rgba(250,248,242,.55)'}}>Lapta, Girne</div>
        </div>
      </div>
    );
  };
  const vs = E(lin(t, a + 0.3, a + 0.6));
  return (
    <AbsoluteFill>
      <Background id="blurphoto" t={t} t0={a} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: F, color: C.cream, opacity: E(lin(t, a, a + 0.35))}}>
        <div style={{fontSize: 32, fontWeight: 600, letterSpacing: '0.08em', opacity: 0.8}}>KARŞILAŞTIR</div>
        <div style={{marginTop: 10, fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em'}}>Hangisi daha mantıklı?</div>
      </div>
      {card(0)}{card(1)}
      <div style={{position: 'absolute', left: 540 - 46, top: 1010, width: 92, height: 92, borderRadius: 46, background: C.coral, color: C.cream, fontFamily: F, fontWeight: 700, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${vs})`, boxShadow: '0 10px 30px rgba(2,10,20,.4)'}}>vs</div>
    </AbsoluteFill>
  );
};

const PropTag: React.FC<{t: number}> = ({t}) => {
  const a = 12.12, b = 14.08;
  if (t < a || t > b + 0.2) return null;
  const k = E(lin(t, a, a + 0.45)) * (1 - Easing.in(Easing.cubic)(lin(t, b, b + 0.18)));
  const row = (i: number) => E(lin(t, a + 0.08 * i, a + 0.08 * i + 0.45));
  return (
    <div style={{position: 'absolute', left: 76, top: 176, fontFamily: F, color: C.cream, opacity: k}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 600, letterSpacing: '0.06em', opacity: row(0), transform: `translateY(${(1 - row(0)) * 16}px)`}}>
        <svg width="24" height="28" viewBox="0 0 128 148"><path d="M64 132S22 86 22 59a42 42 0 1 1 84 0c0 27-42 73-42 73Z" fill={C.cream} /><circle cx="64" cy="59" r="14" fill={C.coral} /></svg>
        LAPTA, GİRNE
      </div>
      <div style={{marginTop: 10, fontSize: 112, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.02, opacity: row(1), transform: `translateY(${(1 - row(1)) * 24}px)`, textShadow: '0 6px 40px rgba(0,10,20,.4)'}}>£139.000</div>
      <div style={{marginTop: 14, fontSize: 38, fontWeight: 500, color: 'rgba(250,248,242,.9)', opacity: row(2), transform: `translateY(${(1 - row(2)) * 16}px)`}}>2+1 · 2 banyo · 107 m² · deniz manzaralı</div>
      <div style={{marginTop: 22, height: 4, width: 96 * row(3), borderRadius: 2, background: C.coral}} />
    </div>
  );
};

const Chip: React.FC<{t: number}> = ({t}) => {
  const a = 3.05, b = 5.75;
  if (t < a || t > b + 0.3) return null;
  const k = E(lin(t, a, a + 0.36)) * (1 - Easing.in(Easing.cubic)(lin(t, b, b + 0.25)));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 158, display: 'flex', justifyContent: 'center', opacity: k, transform: `translateY(${(1 - k) * -14}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '16px 30px 16px 18px', borderRadius: 40, background: 'rgba(10,37,64,.92)', boxShadow: '0 12px 40px rgba(2,10,20,.35)', fontFamily: F, fontSize: 36, fontWeight: 600, color: C.cream, letterSpacing: '-0.01em'}}>
        <svg viewBox="1240 325 530 165" width={92} height={29}>{LOGO_PATHS.map((d, i) => <path key={i} d={d} fill={C.cream} />)}</svg>
        <span style={{width: 2, height: 30, background: 'rgba(250,248,242,.35)'}} />
        <span style={{fontWeight: 500}}>ChatGPT içinde</span>
      </div>
    </div>
  );
};

const Closing: React.FC<{t: number}> = ({t}) => {
  if (t < 26.8) return null;
  const t0 = 26.95;
  const lg = E(lin(t, t0, t0 + 0.5));
  const lw = 520, lh = (lw * 165) / 530;
  const draw = E(lin(t, t0 + 0.55, t0 + 1.05));
  const coral = lin(t, t0 + 1.05, t0 + 1.3);
  const cta = E(lin(t, 28.5, 28.85));
  const sweep = lin(t, t0 + 0.35, t0 + 1.25);
  return (
    <>
      <div style={{position: 'absolute', left: (1080 - lw) / 2, top: 330, width: lw, height: lh, opacity: lg, transform: `translateY(${(1 - lg) * 24}px)`, filter: `blur(${(1 - lg) * 8}px)`}}>
        <svg viewBox="1240 325 530 165" width={lw} height={lh}>
          <defs>
            <linearGradient id="lsw" x1="0" x2="1" gradientUnits="objectBoundingBox">
              <stop offset={Math.max(0, sweep * 1.4 - 0.4)} stopColor={C.cream} />
              <stop offset={Math.max(0, sweep * 1.4 - 0.2)} stopColor="#FFFFFF" />
              <stop offset={Math.min(1, sweep * 1.4)} stopColor={C.cream} />
            </linearGradient>
          </defs>
          {LOGO_PATHS.map((d, i) => <path key={i} d={d} fill="url(#lsw)" />)}
        </svg>
      </div>
      <Words text="artık ChatGPT’de." t={t} t0={t0 + 0.28} size={84} weight={600} stagger={0.08} style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center'}} />
      <div style={{position: 'absolute', left: 540 - mix(260, 70, coral), top: 676, height: mix(2, 6, coral), width: mix(520 * draw, 140, coral), borderRadius: 3, background: coral > 0 ? C.coral : 'rgba(250,248,242,.45)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 730, textAlign: 'center', fontFamily: F, opacity: cta, transform: `translateY(${(1 - cta) * 14}px)`}}>
        <div style={{fontSize: 44, fontWeight: 500, color: C.cream, letterSpacing: '-0.01em'}}>
          ChatGPT’de <span style={{fontWeight: 700}}>Eklentiler</span>’den Evlek’i ekleyin.
        </div>
        <div style={{marginTop: 26, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 600, color: C.cream}}>
          {['ChatGPT', 'Eklentiler', 'Evlek'].map((w, i) => {
            const k = E(lin(t, 28.75 + i * 0.12, 29.05 + i * 0.12));
            return (
              <React.Fragment key={w}>
                {i > 0 && <span style={{opacity: 0.45 * k, fontWeight: 400}}>›</span>}
                <span style={{opacity: k, transform: `translateY(${(1 - k) * 10}px)`, padding: '10px 22px', borderRadius: 30, border: '2px solid rgba(250,248,242,.28)', background: i === 2 ? 'rgba(250,248,242,.10)' : 'transparent', display: 'inline-flex', alignItems: 'center', gap: 10}}>
                  {w}{i === 2 && <span style={{marginLeft: 6, padding: '2px 12px', borderRadius: 16, background: C.coral, fontSize: 24}}>Ekle</span>}
                </span>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{marginTop: 22, fontSize: 28, fontWeight: 500, color: 'rgba(250,248,242,.55)', letterSpacing: '0.04em'}}>evlek.app</div>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 1000, textAlign: 'center', fontFamily: F, fontSize: 22, lineHeight: '32px', color: 'rgba(250,248,242,.5)', opacity: lin(t, 27.6, 28.0)}}>
        Arayüz temsilidir; ilanlar ve fiyatlar Evlek’in gerçek verisidir. ChatGPT, OpenAI’ın ticari markasıdır.
      </div>
    </>
  );
};

// ---------------- master ----------------
export const Master: React.FC = () => {
  const ok = useFonts();
  const f = useCurrentFrame();
  const t = f / FPS;
  if (!ok) return <AbsoluteFill style={{background: C.cream}} />;
  CUR_T = t;
  const src = srcAt(t);
  const us = userScroll(t, src);
  const pose = poseAt(t, src);
  const {id, t0} = bgAt(t);
  // kapanış geçişi: lacivert 12 kare
  const toNavy = lin(t, 26.8, 27.0);
  const dark = id === 'sea' || id === 'navy' || id === 'photo' || id === 'blurphoto' || id === 'gallery';
  return (
    <AbsoluteFill style={{background: C.cream, overflow: 'hidden'}}>
      {id === 'navy' ? (
        <>
          <Background id="cream" t={t} t0={t0} />
          <AbsoluteFill style={{opacity: E(toNavy)}}><Background id="navy" t={t} t0={t0} /></AbsoluteFill>
        </>
      ) : (
        <Background id={id} t={t} t0={t0} />
      )}
      <Phone pose={pose} t={t} dark={dark} overlay={<ScreenMarks t={t} src={src} />}>
        <Screen t={src} f={Math.round(src * FPS)} minScroll={us?.min} mk={us?.k ?? 0} />
      </Phone>
      <PopCard t={t} />
      <Hook t={t} />
      <Chip t={t} />
      <PropTag t={t} />
      <Compare t={t} />
      <Closing t={t} />
    </AbsoluteFill>
  );
};
