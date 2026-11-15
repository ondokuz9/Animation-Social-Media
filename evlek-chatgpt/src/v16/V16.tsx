// VIDEO-1 v16 · "Bir arama, bir ev, bir sonraki adım." · 19 sn, 1080×1920, 60 fps. docs/v16/V16-KREATIF-RAPOR.md
// Krem sahne + lacivert tipografi + mercan vurgu. Arayüz okuma anlarında DÜZ ve kenardan kenara (gerçek piksel, eğim 0).
// Ana geçiş: gerçek karttaki fotoğraf aynı eksende 1080×1600 pencereye büyür (kaynağa göre en çok 1,36×).
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, E, EIN, EvIcon, F, FPS, IO, Logo, LOGO_AR, lin, mix, useFontsV10} from '../v10/core';
import {OX, OY, P, PH, PW, Phone, Pose, mixPose} from '../v15/Phone';
import {Screen} from './Screen';
import {CHUNKS, TL} from './tl';

const img = (p: string) => staticFile(p);
const POOL = 'v12/EVL-100102_00_l2560.png'; // 1600×1200 kaynağın Lanczos büyütmesi (yapay zekâ değil)
const ROOM = 'v12/EVL-100102_01_l1584.png'; // 1200×1600 kaynağın Lanczos büyütmesi
const EXP = Easing.bezier(0.62, 0, 0.12, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const NAVY = C.navy, CREAM = C.cream, CORAL = C.coral;
const M = 72; // sol hiza çizgisi

// ---------------- kamera: düz pozlar ----------------
const view = (sx0: number, sy0: number, s: number): Pose => P((PW / 2 - OX - sx0) * s, (PH / 2 - OY - sy0) * s, s);
const CLOSE1 = view(0, 150, 0.916); // balon + harita + kartların başı
const CARDS = view(0, 560, 1); // kart şeridi 1:1 gerçek piksel
const DS = 0.6, DY = 862;
const DETAIL = P(540, DY, DS); // düğme y≈1566: Reels alt arayüzünün üstünde // tam telefon: ilan
const CTAP = P(540, 968, 0.5); // "Eklentiyi kur" düğmesi y≈1525 // tam telefon: Evlek eklenti sayfası
const dy = (p: Pose, y: number): Pose => ({...p, y: p.y + y});
export const poseAt = (t: number): Pose => {
  if (t < TL.sheet[1]) return dy(CLOSE1, (1 - OUT(lin(t, TL.sheet[0], TL.sheet[1]))) * 2000);
  if (t < TL.cam2[0]) return dy(CLOSE1, -14 * lin(t, TL.sheet[1], TL.cam2[0]));
  if (t < TL.cam2[1]) return mixPose(dy(CLOSE1, -14), CARDS, IO(lin(t, TL.cam2[0], TL.cam2[1])));
  if (t < TL.expand[1]) { const b = Math.sin(Math.PI * lin(t, TL.tap, TL.tap + 0.18)); return {...CARDS, s: 1 - 0.004 * b}; }
  if (t < TL.cut) return DETAIL;
  if (t < TL.ctaOut[0]) return dy(CTAP, (1 - OUT(lin(t, TL.ctaIn[0], TL.ctaIn[1]))) * 520);
  return dy(CTAP, EIN(lin(t, TL.ctaOut[0], TL.ctaOut[1])) * 1800);
};

// ---------------- zemin ve gren ----------------
const Stage: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(120% 70% at 30% 18%, #FFFEFB 0%, ${CREAM} 46%, #F0EBDF 100%)`}} />
);
const Grain: React.FC<{o?: number}> = ({o = 0.07}) => (
  <AbsoluteFill style={{backgroundImage: `url(${img('v16/gren.png')})`, backgroundSize: '512px 512px', mixBlendMode: 'multiply', opacity: o, pointerEvents: 'none'}} />
);

// ---------------- tipografi ----------------
const Eyebrow: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = CORAL, style}) => (
  <div style={{fontFamily: F, fontSize: 28, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Rule: React.FC<{w?: number; color?: string}> = ({w = 56, color = CORAL}) => <div style={{width: w, height: 4, borderRadius: 2, background: color}} />;
const rise = (k: number, d = 22): React.CSSProperties => ({opacity: k, transform: `translateY(${(1 - k) * d}px)`});

// ---------------- AÇILIŞ: sorgu, büyük ve açık temalı bir yazım kutusunda ----------------
const BOX = {x: 48, y: 400, w: 984, h: 900};
const BUBBLE_C = {x: 668, y: 268}; // CLOSE1'de sohbet balonunun merkezi
const SendBtn: React.FC<{s: number; on: boolean}> = ({s, on}) => (
  <div style={{width: 128, height: 128, borderRadius: 64, background: on ? '#305BEE' : '#D8D3C6', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`, boxShadow: on ? '0 10px 28px rgba(48,91,238,.35)' : 'none'}}>
    <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
  </div>
);
export const QueryBox: React.FC<{t: number; hand: number}> = ({t, hand}) => {
  if (hand >= 1) return null;
  const n = TL.chunks.filter((c) => t >= c).length;
  const blink = 0.5 + 0.5 * Math.cos(2 * Math.PI * ((t * 1.25) % 1));
  const pr = lin(t, TL.send - 0.02, TL.send + 0.08) * (1 - lin(t, TL.send + 0.08, TL.send + 0.22));
  const k = EXP(hand);
  const cx = mix(BOX.x + BOX.w / 2, BUBBLE_C.x, k), cy = mix(BOX.y + BOX.h / 2, BUBBLE_C.y, k);
  const sc = mix(1, 0.34, k);
  const dark = lin(k, 0.15, 0.75);
  const cur = lin(t, TL.send - 0.42, TL.send - 0.3) * (1 - lin(t, TL.send + 0.16, TL.send + 0.28));
  const ck = EXP(lin(t, TL.send - 0.42, TL.send - 0.06));
  return (
    <div style={{position: 'absolute', left: cx - BOX.w / 2, top: cy - BOX.h / 2, width: BOX.w, height: BOX.h, transform: `scale(${sc})`, opacity: 1 - lin(k, 0.8, 1)}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 84, background: '#FFFFFF', boxShadow: '0 2px 0 rgba(10,37,64,.04), 0 40px 90px rgba(10,37,64,.13), inset 0 0 0 2px rgba(10,37,64,.06)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 84, background: '#010456', opacity: dark}} />
      <div style={{position: 'absolute', left: 64, top: 62, display: 'flex', alignItems: 'center', gap: 20, fontFamily: F, fontSize: 40, fontWeight: 600, color: NAVY, letterSpacing: '-0.01em'}}>
        <EvIcon size={60} r={0.28} />Evlek<span style={{fontWeight: 500, color: 'rgba(10,37,64,.5)'}}>· ChatGPT’de</span>
      </div>
      <div style={{position: 'absolute', left: 64, top: 176, fontFamily: F, fontSize: 116, fontWeight: 700, lineHeight: '124px', letterSpacing: '-0.045em', color: dark > 0 ? `rgb(${mix(10, 242, dark)},${mix(37, 242, dark)},${mix(64, 242, dark)})` : NAVY, whiteSpace: 'nowrap', fontFeatureSettings: '"tnum","ss01"'}}>
        {CHUNKS.map((c, i) => {
          const a = OUT(lin(t, TL.chunks[i], TL.chunks[i] + 0.14));
          return (
            <div key={c} style={{height: 124}}>
              <span style={{display: 'inline-block', ...rise(a, 26)}}>{c}</span>
              {i === Math.max(0, n - 1) && <span style={{display: 'inline-block', width: 8, height: 100, marginLeft: 12, verticalAlign: -14, borderRadius: 4, background: CORAL, opacity: t < TL.send ? blink : 0}} />}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 64, bottom: 62, display: 'flex', alignItems: 'center', gap: 36, color: 'rgba(10,37,64,.38)'}}>
        <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </div>
      <div style={{position: 'absolute', right: 56, bottom: 50}}><SendBtn s={1 - 0.1 * pr} on={n >= 4} /></div>
      {cur > 0 && <div style={{position: 'absolute', left: mix(600, BOX.w - 56 - 64, ck) - 56, top: mix(BOX.h + 60, BOX.h - 50 - 64, ck) - 56, width: 112, height: 112, borderRadius: 56, background: 'rgba(10,37,64,.16)', boxShadow: 'inset 0 0 0 3px rgba(10,37,64,.55)', opacity: cur, transform: `scale(${1 - 0.18 * pr})`}} />}
    </div>
  );
};

/** kart kadrajında sorguyu ekranda tutan etiket */
export const QueryTag: React.FC<{o: number}> = ({o}) =>
  o <= 0 ? null : (
    <div style={{position: 'absolute', left: 44, top: 150, height: 92, padding: '0 34px 0 20px', borderRadius: 46, background: CREAM, boxShadow: '0 14px 40px rgba(0,6,14,.45), inset 0 0 0 1.5px rgba(10,37,64,.08)', display: 'flex', alignItems: 'center', gap: 18, fontFamily: F, fontSize: 35, fontWeight: 600, color: NAVY, letterSpacing: '-0.02em', whiteSpace: 'nowrap', ...rise(o, -16)}}>
      <EvIcon size={54} r={0.3} />Lapta’da £160 bin altı, deniz manzaralı 2+1 daire
    </div>
  );

// ---------------- EV: fotoğraf penceresi ----------------
type Rect = {x: number; y: number; w: number; h: number};
const mixR = (a: Rect, b: Rect, k: number): Rect => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k)});
export const CARD: Rect = {x: 48, y: 620, w: 696, h: 522}; // CARDS kadrajında £139.000 kartının fotoğrafı
export const WIN: Rect = {x: 0, y: 160, w: 1080, h: 1600};
const HERO: Rect = {x: 540 + (OX - PW / 2) * DS, y: DY + (OY + 275 - PH / 2) * DS, w: 1179 * DS, h: 884.25 * DS};
// havuz: kaynak kırpması (470,0,810,1200) → (330,12,794,1176) · ölçek 1,333 → 1,36
const POOL_A: Rect = {x: -470 * (1600 / 1200), y: 0, w: 1600 * (1600 / 1200), h: 1600};
const POOL_B: Rect = {x: -330 * (1080 / 794), y: -12 * (1080 / 794), w: 1600 * (1080 / 794), h: 1200 * (1080 / 794)};
// salon: kaynak 1200×1600 · ölçek 1,0 → 1,10, sabit nokta kapıdaki deniz (460,800)
const ROOM_A: Rect = {x: -60, y: 0, w: 1200, h: 1600};
const ROOM_B: Rect = {x: 400 - 460 * 1.1, y: 800 - 800 * 1.1, w: 1320, h: 1760};
const HERO_IMG: Rect = {x: 0, y: -(HERO.w * (4 / 3) - HERO.h) / 2, w: HERO.w, h: HERO.w * (4 / 3)};
const Pic: React.FC<{src: string; c: Rect; i: Rect; r?: number; dx?: number; shadow?: number; children?: React.ReactNode}> = ({src, c, i, r = 0, dx = 0, shadow = 0, children}) => (
  <div style={{position: 'absolute', left: c.x + dx, top: c.y, width: c.w, height: c.h, overflow: 'hidden', borderRadius: r, boxShadow: shadow > 0 ? `0 ${30 * shadow}px ${90 * shadow}px rgba(10,37,64,${0.28 * shadow})` : undefined}}>
    <Img src={img(src)} style={{position: 'absolute', left: i.x, top: i.y, width: i.w, height: i.h}} />
    {children}
  </div>
);
const Passe: React.FC<{o: number; n: string}> = ({o, n}) => (
  <>
    <div style={{position: 'absolute', left: M, top: 62, opacity: o}}><Logo h={46} color={NAVY} /></div>
    <Eyebrow color="rgba(10,37,64,.55)" style={{position: 'absolute', right: M, top: 70, opacity: o, fontSize: 24}}>ChatGPT’de · gerçek ilan</Eyebrow>
    <Eyebrow color="rgba(10,37,64,.55)" style={{position: 'absolute', left: M, top: 1812, opacity: o, fontSize: 24}}>EVL-100102</Eyebrow>
    <Eyebrow color="rgba(10,37,64,.55)" style={{position: 'absolute', right: M, top: 1812, opacity: o, fontSize: 24, fontFeatureSettings: '"tnum"'}}>{n} / 14</Eyebrow>
  </>
);
export const PriceCaption: React.FC<{k: number; top?: number}> = ({k, top = 262}) =>
  k <= 0 ? null : (
    <div style={{position: 'absolute', left: M, top, fontFamily: F, color: NAVY}}>
      <div style={rise(OUT(lin(k, 0, 0.5)))}><Rule /><Eyebrow color={NAVY} style={{marginTop: 22}}>Lapta · Girne</Eyebrow></div>
      <div style={{marginTop: 6, fontSize: 138, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: '150px', fontFeatureSettings: '"tnum"', ...rise(OUT(lin(k, 0.15, 0.7)), 30)}}>£139.000</div>
      <div style={{fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', ...rise(OUT(lin(k, 0.35, 1)))}}>2+1 · 107 m² · deniz manzaralı</div>
    </div>
  );
const PhotoStage: React.FC<{t: number}> = ({t}) => {
  if (t < TL.expand[0] || t >= TL.land[1]) return null;
  const k1 = EXP(lin(t, TL.expand[0], TL.expand[1]));
  const lk = EXP(lin(t, TL.land[0], TL.land[1]));
  const sk = IO(lin(t, TL.swipe[0], TL.swipe[1]));
  const cover = t < TL.land[0] ? lin(k1, 0.06, 0.5) : 1 - lin(lk, 0.05, 0.5);
  const pan1 = Easing.out(Easing.quad)(lin(t, TL.expand[1] - 0.2, TL.swipe[1]));
  const i1 = k1 < 1 ? mixR({x: 0, y: 0, w: CARD.w, h: CARD.h}, POOL_A, k1) : mixR(POOL_A, POOL_B, pan1);
  const push2 = Easing.out(Easing.quad)(lin(t, TL.swipe[0], TL.land[0] + 0.1));
  const r2 = mixR(ROOM_A, ROOM_B, push2);
  const capK = lin(t, TL.expand[1] - 0.12, TL.expand[1] + 0.55) * (1 - lin(t, TL.swipe[0] - 0.25, TL.swipe[0]));
  const pass = lin(k1, 0.6, 1) * (1 - lin(lk, 0, 0.3));
  return (
    <>
      <AbsoluteFill style={{opacity: cover}}><Stage /></AbsoluteFill>
      <Passe o={pass} n={sk > 0.5 ? '2' : '1'} />
      {sk < 1 && <Pic src={POOL} c={mixR(CARD, WIN, k1)} i={i1} r={mix(36, 0, lin(k1, 0, 0.6))} dx={-sk * 1120} shadow={Math.sin(Math.PI * k1)}>
        <div style={{position: 'absolute', inset: 0, opacity: lin(t, TL.expand[0], TL.expand[0] + 0.07) < 1 ? 0 : 0}} />
      </Pic>}
      {sk < 1 && <div style={{position: 'absolute', left: -sk * 1120, top: 0, width: 1080, height: 1920}}><PriceCaption k={capK} /></div>}
      {sk > 0 && <Pic src={ROOM} c={mixR(WIN, HERO, lk)} i={lk > 0 ? mixR(r2, HERO_IMG, lk) : r2} dx={(1 - sk) * 1120} shadow={Math.sin(Math.PI * lk)} />}
    </>
  );
};

// ---------------- SONRAKİ ADIM (tek CTA) ----------------
const CtaText: React.FC<{t: number}> = ({t}) => {
  if (t < TL.cut || t >= TL.ctaOut[1]) return null;
  const out = 1 - lin(t, TL.ctaOut[0], TL.ctaOut[0] + 0.25);
  const a = OUT(lin(t, TL.cut + 0.05, TL.cut + 0.45)) * out, b = OUT(lin(t, TL.cut + 0.2, TL.cut + 0.6)) * out;
  const bk = OUT(lin(t, TL.bound + 0.05, TL.bound + 0.4)) * out;
  return (
    <div style={{position: 'absolute', left: M, top: 96, fontFamily: F, color: NAVY}}>
      <div style={rise(a)}><Rule /><Eyebrow style={{marginTop: 20}}>ChatGPT · Eklentiler · Evlek</Eyebrow></div>
      <div style={{marginTop: 4, fontSize: 96, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: '112px', whiteSpace: 'nowrap', ...rise(b, 30)}}>Eklentiler’den ekle.</div>
      {bk > 0 && (
        <div style={{position: 'absolute', right: -(1080 - 2 * M) + 0, top: 0}} />
      )}
      <div style={{position: 'absolute', left: 540 - M - 96, top: 1574, height: 76, padding: '0 30px 0 22px', borderRadius: 38, background: NAVY, color: CREAM, display: 'flex', alignItems: 'center', gap: 16, fontSize: 36, fontWeight: 600, letterSpacing: '-0.01em', ...rise(bk, 18)}}>
        <span style={{width: 36, height: 36, borderRadius: 18, background: CORAL, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        Bağlı
      </div>
    </div>
  );
};

// ---------------- KAPANIŞ ----------------
const TITLE = 'artık ChatGPT’de.';
export const EndCard: React.FC<{t: number; t0?: number}> = ({t, t0 = TL.end[0]}) => {
  const q = t - t0;
  if (q < 0) return null;
  const a = OUT(lin(q, 0, 0.55)), ph = OUT(lin(q, 0.12, 0.75)), c = OUT(lin(q, TL.cta[0] - TL.end[0], TL.cta[1] - TL.end[0]));
  const n = Math.round(TITLE.length * lin(q, TL.title[0] - TL.end[0], TL.title[1] - TL.end[0]));
  const z = 1 + 0.035 * lin(q, 0, 4);
  const PW_ = 936, PH_ = 660;
  return (
    <>
      <div style={{position: 'absolute', left: M - 6, top: 268, ...rise(a, 30)}}><Logo h={168} color={NAVY} /></div>
      <div style={{position: 'absolute', left: M, top: 448, fontFamily: F, fontSize: 96, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: '110px', color: NAVY, whiteSpace: 'nowrap'}}>
        <span>{TITLE.slice(0, n)}</span>
        {n < TITLE.length && n > 0 && <span style={{display: 'inline-block', width: 7, height: 84, marginLeft: 8, verticalAlign: -10, borderRadius: 3, background: CORAL}} />}
      </div>
      <div style={{position: 'absolute', left: M, top: 640, width: PW_, height: PH_, borderRadius: 40, overflow: 'hidden', boxShadow: '0 40px 90px rgba(10,37,64,.22)', ...rise(ph, 60)}}>
        <Img src={img(POOL)} style={{position: 'absolute', left: (PW_ - PW_ * z) / 2, top: -42 - (PW_ * 0.75 * z - PW_ * 0.75) / 2, width: PW_ * z, height: PW_ * 0.75 * z}} />
        <div style={{position: 'absolute', left: 28, bottom: 28, height: 68, padding: '0 26px', borderRadius: 34, background: 'rgba(250,248,242,.94)', display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 32, fontWeight: 600, color: NAVY, letterSpacing: '-0.01em', fontFeatureSettings: '"tnum"'}}>Lapta · 2+1 · £139.000</div>
      </div>
      <div style={{position: 'absolute', left: M, top: 1366, width: PW_, height: 136, borderRadius: 68, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 0 50px', boxSizing: 'border-box', fontFamily: F, fontSize: 48, fontWeight: 600, color: CREAM, letterSpacing: '-0.025em', boxShadow: '0 24px 60px rgba(10,37,64,.28)', ...rise(c, 30)}}>
        Eklentiler’den Evlek’i ekle
        <span style={{width: 96, height: 96, borderRadius: 48, background: CORAL, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </div>
    </>
  );
};

// ---------------- master ----------------
export const V16: React.FC = () => {
  const ok = useFontsV10();
  const t = useCurrentFrame() / FPS;
  if (!ok) return <AbsoluteFill style={{background: CREAM}} />;
  const phoneOn = t >= TL.sheet[0] && t < TL.ctaOut[1] && !(t >= TL.expand[1] && t < TL.land[0]);
  const hand = lin(t, TL.send + 0.1, TL.rise[1] + 0.05);
  const tag = OUT(lin(t, TL.cam2[1] - 0.2, TL.cam2[1] + 0.15)) * (1 - lin(t, TL.expand[0], TL.expand[0] + 0.15));
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      <Stage />
      <Grain />
      {phoneOn && <Phone pose={poseAt(t)} lit={1} sweep={-1} flash={0}><Screen t={t} /></Phone>}
      <QueryBox t={t} hand={hand} />
      <QueryTag o={tag} />
      <PhotoStage t={t} />
      <CtaText t={t} />
      <EndCard t={t} />
      {t >= TL.expand[0] && t < TL.land[1] && <Grain o={0.05} />}
    </AbsoluteFill>
  );
};
