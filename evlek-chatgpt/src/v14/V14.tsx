// VIDEO-1 v14 · "Evlek artık ChatGPT'de" · 30 sn, 1080×1920, 60 fps. docs/v14/BULGULAR.md + kurul/plan.json.
// Telefon her karede TAM ve ≥48 px payla (yalnız portalda gizlenir); dört poz: KAPAK, A, B, E. Okuma pozlarında rz 0.
// Arayüze filtre/karartma yok; karartma yalnız zeminde. Dış metin: 3 ana mesaj + numaralı adım satırı + dipnot.
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS, Logo, LOGO_AR, lin, mix, useFontsV10} from '../v10/core';
import {OX, OY, P, PH, PW, Phone, Pose, bodyBox, mixPose, projectOut} from './Phone';
import {CHIP_WORD, HERO_D, Screen} from './Screen';
import {TL} from './tl';

const img = (p: string) => staticFile(p);
const SOFT = Easing.bezier(0.25, 0.1, 0, 1);
const FLY = Easing.bezier(0.45, 0, 0.15, 1);
const IOE = Easing.bezier(0.45, 0, 0.55, 1);
const RAMP = Easing.bezier(0.4, 0, 0.2, 1);
const L_ = Easing.linear;

// ---------------- pozlar (gövde kutusu tam kadrajda) ----------------
const KAPAK = P(520, 1287, 0.435, 6, -17, -2);
const B = P(524, 951, 0.67, 3, -12, 0);
const A = P(527, 1058, 0.6, 3, -12, 0);
const EP = P(527, 1095, 0.574, 3, -12, 0);
const dr = (p: Pose, ds: number, dy: number): Pose => ({...p, s: p.s + ds, y: p.y + dy});

type Key = {t: number; p: Pose; e?: (x: number) => number};
const K = (t: number, p: Pose, e: (x: number) => number = IOE): Key => ({t, p, e});
const KEYS: Key[] = [
  K(0, KAPAK), K(TL.push[0], KAPAK, L_),
  K(TL.push[1], B), K(TL.cam1[0], dr(B, 0.005, -3), L_),
  K(TL.cam1[1], A), K(TL.cam2[0], dr(A, 0.004, 3), L_),
  K(TL.cam2[1], B), K(TL.cam3[0], B, L_), // ilan ve portal sırasında kamera sabit (köşe eşleşmesi)
  K(TL.cam3[1], EP), K(TL.back[0], EP, L_),
  K(TL.back[1], KAPAK, FLY), K(30, KAPAK, L_),
];
const poseAt = (t: number): Pose => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  if (!b) return a.p;
  return mixPose(a.p, b.p, (b.e ?? SOFT)(lin(t, a.t, b.t)));
};
const kick = (t: number, p: Pose): Pose => {
  let b = 0;
  for (const at of [TL.send, TL.tap, TL.install]) {
    const k = lin(t, at, at + 0.18);
    if (k > 0 && k < 1) b = Math.max(b, Math.sin(Math.PI * k));
  }
  return {...p, s: p.s * (1 - 0.004 * b), y: p.y + 3 * b};
};
export const poseK = (t: number) => kick(t, poseAt(t));

// ---------------- zemin: poza bağlı anahtar ışık; karartma yalnız zeminde ----------------
const POOL = 'v4/EVL-100102_00.jpg';
const poolBg = (t: number) => (t < TL.expand[0] || t >= TL.collapse[1] ? 0 : t < TL.collapse[0] ? RAMP(lin(t, TL.expand[0], TL.expand[1])) : 1 - RAMP(lin(t, TL.collapse[0], TL.collapse[1])));
const bgDim = (t: number) => (t < TL.sig[1] ? 0.15 * (1 - RAMP(lin(t, TL.sig[0], TL.sig[1]))) : t >= TL.back[0] ? 0.15 * RAMP(lin(t, TL.back[0], TL.back[1])) : 0);
const Background: React.FC<{t: number; pose: Pose}> = ({t, pose}) => {
  const b = bodyBox(pose);
  const ly = b.y0 + 0.32 * (b.y1 - b.y0);
  const o = poolBg(t);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 58% at ${pose.x}px ${ly}px, #3B6E9E 0%, #24527F 40%, #0F3157 75%, #061A2E 100%)`}}>
      {o > 0 && (
        <AbsoluteFill style={{opacity: o, overflow: 'hidden'}}>
          <Img src={img(POOL)} style={{position: 'absolute', left: -560, top: -60, width: 2720, height: 2040, filter: 'blur(30px) brightness(.72) saturate(1.05)'}} />
          <AbsoluteFill style={{background: C.navy, opacity: 0.5, mixBlendMode: 'multiply'}} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#000', opacity: bgDim(t)}} />
    </AbsoluteFill>
  );
};

// ---------------- portal: ilanın kahraman fotoğrafı ↔ büyük çerçeve (filtresiz) ----------------
type Rect = {x: number; y: number; w: number; h: number};
const mixR = (a: Rect, b: Rect, k: number): Rect => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k)});
const FRAME: Rect = {x: 0, y: 380, w: 1080, h: 1300}; // 1,08× (özgün 1600 px'e yakın)
const IMG_W = 1600 * (1300 / 1200);
const imgLeft = (t: number) => mix(-0.25 * (IMG_W - 1080), -0.36 * (IMG_W - 1080), Easing.bezier(0.33, 0, 0.67, 1)(lin(t, TL.portalOut[1], TL.portalIn[0])));
export const portalK = (t: number) => {
  if (t >= TL.portalOut[0] && t < TL.portalOut[1]) return FLY(lin(t, TL.portalOut[0], TL.portalOut[1]));
  if (t >= TL.portalOut[1] && t < TL.portalIn[0]) return 1;
  if (t >= TL.portalIn[0] && t < TL.portalIn[1]) return 1 - FLY(lin(t, TL.portalIn[0], TL.portalIn[1]));
  return 0;
};
const Portal: React.FC<{t: number}> = ({t}) => {
  const k = portalK(t);
  if (k <= 0) return null;
  const p0 = poseK(TL.portalOut[0]);
  const s = p0.s;
  const cropHero: Rect = {x: s * (OX + HERO_D.x - PW / 2), y: s * (OY + HERO_D.y - PH / 2), w: s * HERO_D.w, h: s * HERO_D.h};
  const cropFull: Rect = {x: FRAME.x - p0.x, y: FRAME.y - p0.y, w: FRAME.w, h: FRAME.h};
  const cr = mixR(cropHero, cropFull, k);
  const ir = mixR({x: 0, y: 0, w: HERO_D.w * s, h: HERO_D.h * s}, {x: imgLeft(t) - FRAME.x, y: 0, w: IMG_W, h: FRAME.h}, k);
  const lift = Math.sin(Math.PI * Math.min(1, k));
  return (
    <>
      {/* telefonun yerini bulanık havuz alır (k=1'de tam opak; hayalet telefon yok) */}
      <AbsoluteFill style={{opacity: Math.min(1, k * 1.15), overflow: 'hidden'}}>
        <Img src={img(POOL)} style={{position: 'absolute', left: -560, top: -60, width: 2720, height: 2040, filter: 'blur(30px) brightness(.72) saturate(1.05)'}} />
        <AbsoluteFill style={{background: C.navy, opacity: 0.5, mixBlendMode: 'multiply'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', inset: 0, perspective: 3200, perspectiveOrigin: `${p0.x}px ${p0.y}px`}}>
        <div style={{position: 'absolute', left: p0.x, top: p0.y, width: 0, height: 0, transformStyle: 'preserve-3d',
          transform: `rotateX(${p0.rx * (1 - k)}deg) rotateY(${p0.ry * (1 - k)}deg) rotateZ(${p0.rz * (1 - k)}deg) translateZ(${s * (1 - k) + 20 * lift}px)`}}>
          <div style={{position: 'absolute', left: cr.x, top: cr.y, width: cr.w, height: cr.h, overflow: 'hidden', borderRadius: mix(0, 28, k), boxShadow: `0 ${30 * k}px ${120 * k}px rgba(0,6,14,${0.5 * k})`}}>
            <Img src={img(POOL)} style={{position: 'absolute', left: ir.x, top: ir.y, width: ir.w, height: ir.h}} />
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------- dış metin ----------------
const fade4 = (t: number, [a, b, c, d]: number[]) => Easing.bezier(0.25, 0.1, 0.25, 1)(lin(t, a, b)) * (1 - lin(t, c, d));
const Txt: React.FC<{o: number; y: number; size: number; weight?: number; children: React.ReactNode}> = ({o, y, size, weight = 700, children}) =>
  o <= 0 ? null : <div style={{position: 'absolute', left: 60, right: 60, top: y + (1 - o) * 14, textAlign: 'center', opacity: o, fontFamily: F, fontSize: size, fontWeight: weight, color: C.cream, letterSpacing: '-0.03em', lineHeight: 1.1}}>{children}</div>;
const TITLE = 'artık ChatGPT’de.';
const Title: React.FC<{t: number; n: number; o: number}> = ({t, n, o}) => {
  if (o <= 0) return null;
  const on = 0.5 + 0.5 * Math.cos(2 * Math.PI * (t % 1));
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 440, textAlign: 'center', opacity: o, fontFamily: F, fontSize: 92, fontWeight: 700, color: C.cream, letterSpacing: '-0.03em', lineHeight: 1.1, whiteSpace: 'nowrap'}}>
      <span>{TITLE.slice(0, n)}</span>
      <span style={{position: 'relative', display: 'inline-block', width: 0}}><span style={{position: 'absolute', left: 8, top: -76, width: 7, height: 92, borderRadius: 2, background: C.cream, opacity: on}} /></span>
      <span style={{opacity: 0}}>{TITLE.slice(n)}</span>
    </div>
  );
};
/** "Eklentiler’den ekle." + numaralı adım satırı (mercan disk; tek disk) */
const STEPS: [number, string, string][] = [[TL.menu, '1', 'Eklentiler'], [TL.plugOpen[0], '2', '“evlek” ara'], [TL.page[0], '3', 'Eklentiyi kur']];
const PathBlock: React.FC<{t: number}> = ({t}) => {
  const o = fade4(t, TL.path);
  if (o <= 0) return null;
  let i = -1;
  STEPS.forEach(([at], j) => { if (t >= at) i = j; });
  const done = t >= TL.bound;
  const sk = i >= 0 ? E2(lin(t, STEPS[i][0], STEPS[i][0] + 0.2)) : 0;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 112 + (1 - o) * 14, opacity: o, fontFamily: F, color: C.cream, textAlign: 'center'}}>
      <div style={{fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1}}>Eklentiler’den ekle.</div>
      {i >= 0 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 88 + (1 - sk) * 14, opacity: sk, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
          <div style={{width: 76, height: 76, borderRadius: 38, background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 700}}>{done ? '✓' : STEPS[i][1]}</div>
          <div style={{fontSize: 56, fontWeight: 600, letterSpacing: '-0.02em'}}>{STEPS[i][2]}</div>
        </div>
      )}
    </div>
  );
};
const E2 = Easing.bezier(0.22, 1, 0.36, 1);

// ---------------- logo ve imza (logo ↔ çip; yol ekranın dışından) ----------------
const LOGO_C = {x: 540, y: 300, h: 200};
const LogoAt: React.FC<{x: number; y: number; h: number; o?: number}> = ({x, y, h, o = 1}) => (
  <div style={{position: 'absolute', left: x - (h * LOGO_AR) / 2, top: y - h / 2, opacity: o}}><Logo h={h} /></div>
);
const bez = (p0: number[], p1: number[], p2: number[], p3: number[], k: number) => {
  const u = 1 - k;
  return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * k * p1[i] + 3 * u * k * k * p2[i] + k * k * k * p3[i]);
};
const logoFlight = (t: number, k: number) => {
  const p = poseK(t);
  const c = projectOut(p, CHIP_WORD.x, CHIP_WORD.y);
  const [x, y] = bez([LOGO_C.x, LOGO_C.y], [140, 520], [150, 1400], [c.x, c.y], k);
  const h = Math.exp(mix(Math.log(LOGO_C.h), Math.log(CHIP_WORD.h * p.s), k));
  return {x, y, h};
};
const LogoLayer: React.FC<{t: number}> = ({t}) => {
  if (t < TL.sig[0] || t >= TL.back[1]) return <LogoAt {...LOGO_C} />;
  if (t < TL.sig[1]) {
    const k = IOE(lin(t, TL.sig[0], TL.sig[1]));
    return <LogoAt {...logoFlight(t, k)} o={1 - lin(t, TL.sig[1] - 0.06, TL.sig[1])} />;
  }
  if (t >= TL.back[0]) {
    const k = 1 - FLY(lin(t, TL.back[0], TL.back[1]));
    return <LogoAt {...logoFlight(t, k)} o={lin(t, TL.back[0], TL.back[0] + 0.06)} />;
  }
  return null;
};

// ---------------- master ----------------
export const V14: React.FC = () => {
  const ok = useFontsV10();
  const t = useCurrentFrame() / FPS;
  if (!ok) return <AbsoluteFill style={{background: C.navy}} />;
  const pose = poseK(t);
  const titleO = t < TL.titleOut[1] ? (t < TL.titleDim[0] ? 1 : t < TL.titleDim[1] ? mix(1, 0.35, lin(t, TL.titleDim[0], TL.titleDim[1])) : t < TL.titleOut[0] ? 0.35 : 0.35 * (1 - lin(t, TL.titleOut[0], TL.titleOut[1]))) : t >= TL.title2[0] ? 1 : 0;
  const titleN = t >= TL.title2[0] ? Math.round(TITLE.length * lin(t, TL.title2[0], TL.title2[1])) : TITLE.length;
  const pk = portalK(t);
  return (
    <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
      <Background t={t} pose={pose} />
      {pk < 0.999 && (
        <Phone pose={pose} onPhoto={poolBg(t)}>
          <Screen t={t} />
        </Phone>
      )}
      <Portal t={t} />
      <LogoLayer t={t} />
      <Title t={t} n={titleN} o={titleO} />
      <Txt o={fade4(t, TL.slogan)} y={130} size={72}>Sor. Evlek göstersin.</Txt>
      <PathBlock t={t} />
      {(() => {
        const o = fade4(t, TL.foot);
        return o > 0 ? (
          <div style={{position: 'absolute', left: 90, right: 90, top: 572, textAlign: 'center', fontFamily: F, fontSize: 30, fontWeight: 500, lineHeight: '40px', color: 'rgba(250,248,242,.86)', opacity: o}}>
            ChatGPT arayüzü temsilîdir; Evlek ekranları ve ilan verileri gerçektir. ChatGPT, OpenAI’ın ticari markasıdır.
          </div>
        ) : null;
      })()}
    </AbsoluteFill>
  );
};
