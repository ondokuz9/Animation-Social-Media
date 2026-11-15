// V17 · FINAL · "Evlek artık ChatGPT'de." · 22 sn, 1080×1920, 60 fps. docs/v17/FINAL-RAPOR.md
// Sıra: başlık + telefon → ekrana yaklaşırken ChatGPT'de Evlek'e yazılır → etkileşim → Eklentiler'den Evlek'i ekle → bitiş.
// Arayüz: ChatGPT kabuğu temsilî (gerçek kayıtlardan ölçüldü), Evlek yüzeyleri gerçek piksel. Okuma anlarında arayüz düz (eğim 0).
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, EIN, F, FPS, IO, Logo, lin, mix, useFontsV10} from '../v10/core';
import {OX, OY, P, PH, PW, Phone, Pose, mixPose} from '../v15/Phone';
import {Screen} from './Screen';
import {TL} from './tl';

const img = (p: string) => staticFile(p);
const ROOM = 'v12/EVL-100102_01_l1584.png'; // 1200×1600 kaynağın Lanczos büyütmesi (yapay zekâ değil)
const EXP = Easing.bezier(0.62, 0, 0.12, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const NAVY = C.navy, CREAM = C.cream, CORAL = C.coral;
const M = 72; // sol hiza çizgisi

// ---------------- kamera ----------------
const view = (sx0: number, sy0: number, s: number): Pose => P((PW / 2 - OX - sx0) * s, (PH / 2 - OY - sy0) * s, s);
const OPEN = P(540, 1196, 0.52); // başlığın altında tam telefon
const TYPE = view(0, 760, 0.88); // yazarken: yazım kutusu + klavye kadrajın alt %70'inde, ekranın üstü az
const SEND = P(540, (PH / 2 - OY - 300) * 0.78 + 40, 0.78); // gönderince balonu izler: ekranın üstü (balon, Evlek) + telefonun altı
const CHAT = view(0, 150, 0.916); // balon + Evlek + sonuç
const CARDS = view(0, 560, 1); // kart şeridi 1:1 gerçek piksel
const DS = 0.6, DY = 862;
const DETAIL = P(540, DY, DS); // tam telefon: ilan; "Emlakçıya sor" y≈1566
const PLUG = P(540, 1212, 0.6); // eklenti bölümü: üstte başlık + adımlar
const END = P(540, 1236, 0.5);
const dy = (p: Pose, y: number): Pose => ({...p, y: p.y + y});
const bump = (p: Pose, t: number, at: number): Pose => { const b = Math.sin(Math.PI * lin(t, at, at + 0.16)); return b > 0 && b < 1 ? {...p, s: p.s * (1 - 0.005 * b)} : p; };
export const poseAt = (t: number): Pose => {
  if (t < TL.intro[1]) return mixPose({...OPEN, y: OPEN.y + 90, s: 0.5}, OPEN, OUT(lin(t, TL.intro[0], TL.intro[1])));
  if (t < TL.push[0]) return OPEN;
  if (t < TL.push[1]) return mixPose(OPEN, TYPE, EXP(lin(t, TL.push[0], TL.push[1])));
  if (t < TL.follow[0]) return bump(TYPE, t, TL.send);
  if (t < TL.follow[1]) return mixPose(TYPE, SEND, IO(lin(t, TL.follow[0], TL.follow[1])));
  if (t < TL.cam1[0]) return SEND;
  if (t < TL.cam1[1]) return mixPose(SEND, CHAT, IO(lin(t, TL.cam1[0], TL.cam1[1])));
  if (t < TL.cam2[0]) return dy(CHAT, -10 * lin(t, TL.cam1[1], TL.cam2[0]));
  if (t < TL.cam2[1]) return mixPose(dy(CHAT, -10), CARDS, IO(lin(t, TL.cam2[0], TL.cam2[1])));
  if (t < TL.expand[0]) return bump(CARDS, t, TL.tap);
  if (t < TL.expand[1]) return mixPose(CARDS, DETAIL, EXP(lin(t, TL.expand[0], TL.expand[1])));
  if (t < TL.cam3[0]) return DETAIL;
  if (t < TL.cam3[1]) return mixPose(DETAIL, PLUG, IO(lin(t, TL.cam3[0], TL.cam3[1])));
  if (t < TL.back[0]) return PLUG;
  if (t < TL.back[1]) return mixPose(PLUG, END, IO(lin(t, TL.back[0], TL.back[1])));
  return END;
};

// ---------------- zemin, gren, tipografi ----------------
const Stage: React.FC = () => <AbsoluteFill style={{background: `radial-gradient(120% 70% at 30% 18%, #FFFEFB 0%, ${CREAM} 46%, #F0EBDF 100%)`}} />;
const Grain: React.FC<{o?: number}> = ({o = 0.07}) => (
  <AbsoluteFill style={{backgroundImage: `url(${img('v16/gren.png')})`, backgroundSize: '512px 512px', mixBlendMode: 'multiply', opacity: o, pointerEvents: 'none'}} />
);
const Eyebrow: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = CORAL, style}) => (
  <div style={{fontFamily: F, fontSize: 28, fontWeight: 600, letterSpacing: '0.14em', color, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Rule: React.FC<{w?: number; color?: string}> = ({w = 56, color = CORAL}) => <div style={{width: w, height: 4, borderRadius: 2, background: color}} />;
const rise = (k: number, d = 22): React.CSSProperties => ({opacity: k, transform: `translateY(${(1 - k) * d}px)`});

/** başlık: açılışta ve bitişte aynı blok */
const TitleBlock: React.FC<{t: number}> = ({t}) => {
  const inA = OUT(lin(t, 0.05, 0.6)), inB = OUT(lin(t, 0.18, 0.75));
  const outK = lin(t, TL.titleOut[0], TL.titleOut[1]);
  const e1 = OUT(lin(t, TL.end[0], TL.end[0] + 0.5)), e2 = OUT(lin(t, TL.end[0] + 0.12, TL.end[0] + 0.62));
  const endOn = t >= TL.end[0];
  const a = endOn ? e1 : inA * (1 - outK), b = endOn ? e2 : inB * (1 - outK);
  if (a <= 0 && b <= 0) return null;
  const up = endOn ? 0 : -40 * outK;
  return (
    <div style={{position: 'absolute', left: M, top: endOn ? 112 : 150, transform: `translateY(${up}px)`}}>
      <div style={rise(a, 26)}><Logo h={endOn ? 132 : 150} color={NAVY} style={{marginLeft: -6}} /></div>
      <div style={{marginTop: 4, fontFamily: F, fontSize: endOn ? 84 : 92, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: endOn ? '94px' : '102px', color: NAVY, whiteSpace: 'nowrap', ...rise(b, 26)}}>artık ChatGPT’de.</div>
    </div>
  );
};

/** bitiş CTA'sı: başlığın altında, telefonun üstünde */
const EndCta: React.FC<{t: number}> = ({t}) => {
  const c = OUT(lin(t, TL.cta[0], TL.cta[1]));
  if (c <= 0) return null;
  const q = t - TL.cta[1];
  const nudge = q > 0.6 ? -6 * Math.max(0, Math.sin(2 * Math.PI * (q - 0.6) / 1.2)) : 0;
  return (
    <div style={{position: 'absolute', left: M, top: 438, height: 92, padding: '0 14px 0 34px', borderRadius: 46, background: NAVY, display: 'flex', alignItems: 'center', gap: 22, fontFamily: F, fontSize: 38, fontWeight: 600, color: CREAM, letterSpacing: '-0.02em', boxShadow: '0 18px 44px rgba(10,37,64,.26)', ...rise(c, 20)}}>
      Eklentiler’den Evlek’i ekle
      <span style={{width: 66, height: 66, borderRadius: 33, background: CORAL, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateX(${nudge}px)`}}>
        <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </span>
    </div>
  );
};

/** eklenti bölümü başlığı + 3 adım */
const STEPS: [number, string][] = [[TL.menu, 'Eklentiler'], [TL.searchTap, '“evlek” ara'], [TL.page[0], 'Eklentiyi kur']];
const PlugCaption: React.FC<{t: number}> = ({t}) => {
  const o = OUT(lin(t, TL.cap[0], TL.cap[1])) * (1 - lin(t, TL.capOut[0], TL.capOut[1]));
  if (o <= 0) return null;
  let cur = -1;
  STEPS.forEach(([at], i) => { if (t >= at - 0.15) cur = i; });
  const done = t >= TL.bound;
  return (
    <div style={{position: 'absolute', left: M, top: 58, fontFamily: F, color: NAVY, ...rise(o, 18)}}>
      <Rule /><Eyebrow style={{marginTop: 18}}>CHATGPT · EKLENTİLER</Eyebrow>
      <div style={{marginTop: 4, fontSize: 70, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: '80px', whiteSpace: 'nowrap'}}>Eklentiler’den Evlek’i ekle.</div>
      <div style={{marginTop: 18, display: 'flex', gap: 12}}>
        {STEPS.map(([, label], i) => {
          const on = i <= cur, now = i === cur && !done, ok = done || i < cur;
          return (
            <div key={label} style={{height: 58, padding: '0 22px 0 10px', borderRadius: 29, display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
              background: now ? NAVY : on ? 'rgba(10,37,64,.08)' : 'transparent', color: now ? CREAM : on ? NAVY : 'rgba(10,37,64,.4)', boxShadow: on ? 'none' : 'inset 0 0 0 2px rgba(10,37,64,.14)'}}>
              <span style={{width: 40, height: 40, borderRadius: 20, background: ok ? CORAL : now ? CREAM : 'rgba(10,37,64,.12)', color: ok ? '#fff' : NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700}}>
                {ok ? <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : i + 1}
              </span>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------- EV: ilanın 2/14 fotoğrafı telefondan 1080×1600 pencereye ----------------
type Rect = {x: number; y: number; w: number; h: number};
const mixR = (a: Rect, b: Rect, k: number): Rect => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k)});
const WIN: Rect = {x: 0, y: 160, w: 1080, h: 1600};
const HERO: Rect = {x: 540 + (OX - PW / 2) * DS, y: DY + (OY + 275 - PH / 2) * DS, w: 1179 * DS, h: 884.25 * DS};
const HERO_IMG: Rect = {x: 0, y: -(HERO.w * (4 / 3) - HERO.h) / 2 - 1, w: HERO.w, h: HERO.w * (4 / 3)}; // ölçüldü: kalkış/iniş kayması 0 px
const ROOM_A: Rect = {x: -60, y: 0, w: 1200, h: 1600};
const ROOM_B: Rect = {x: 400 - 460 * 1.1, y: 800 - 800 * 1.1, w: 1320, h: 1760}; // 1,00× → 1,10×, sabit nokta kapıdaki deniz
const Pic: React.FC<{src: string; c: Rect; i: Rect; shadow?: number}> = ({src, c, i, shadow = 0}) => (
  <div style={{position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, overflow: 'hidden', boxShadow: shadow > 0 ? `0 ${30 * shadow}px ${90 * shadow}px rgba(10,37,64,${0.28 * shadow})` : undefined}}>
    <Img src={img(src)} style={{position: 'absolute', left: i.x, top: i.y, width: i.w, height: i.h}} />
  </div>
);
const PhotoStage: React.FC<{t: number}> = ({t}) => {
  if (t < TL.portalOut[0] || t >= TL.portalIn[1]) return null;
  const k1 = EXP(lin(t, TL.portalOut[0], TL.portalOut[1]));
  const lk = EXP(lin(t, TL.portalIn[0], TL.portalIn[1]));
  const cover = t < TL.portalIn[0] ? lin(k1, 0.06, 0.5) : 1 - lin(lk, 0.05, 0.5);
  const r2 = mixR(ROOM_A, ROOM_B, Easing.out(Easing.quad)(lin(t, TL.portalOut[1] - 0.2, TL.portalIn[0] + 0.1)));
  const c = lk > 0 ? mixR(WIN, HERO, lk) : mixR(HERO, WIN, k1);
  const i = lk > 0 ? mixR(r2, HERO_IMG, lk) : mixR(HERO_IMG, r2, k1);
  const pass = lin(k1, 0.6, 1) * (1 - lin(lk, 0, 0.3));
  const cap = OUT(lin(t, TL.portalOut[1] + 0.05, TL.portalOut[1] + 0.5)) * (1 - lin(t, TL.portalIn[0] - 0.2, TL.portalIn[0]));
  return (
    <>
      <AbsoluteFill style={{opacity: cover}}><Stage /><Grain /></AbsoluteFill>
      <div style={{position: 'absolute', left: M, top: 62, opacity: pass}}><Logo h={46} color={NAVY} /></div>
      <Eyebrow color="rgba(10,37,64,.55)" style={{position: 'absolute', right: M, top: 70, opacity: pass, fontSize: 24}}>CHATGPT’DE · GERÇEK İLAN</Eyebrow>
      <Eyebrow color="rgba(10,37,64,.55)" style={{position: 'absolute', left: M, top: 1812, opacity: pass, fontSize: 24}}>EVL-100102</Eyebrow>
      <Eyebrow color="rgba(10,37,64,.55)" style={{position: 'absolute', right: M, top: 1812, opacity: pass, fontSize: 24, fontFeatureSettings: '"tnum"'}}>2 / 14</Eyebrow>
      <Pic src={ROOM} c={c} i={i} shadow={Math.max(Math.sin(Math.PI * k1), Math.sin(Math.PI * lk))} />
      <div style={{position: 'absolute', left: M, top: 1390, fontFamily: F, ...rise(cap, 24)}}>
        <div style={{display: 'inline-flex', flexDirection: 'column', padding: '26px 38px 30px', borderRadius: 40, background: 'rgba(250,248,242,.96)', boxShadow: '0 24px 60px rgba(10,37,64,.25)', color: NAVY}}>
          <Eyebrow color={CORAL} style={{fontSize: 24}}>LAPTA · GİRNE · 2+1 · 107 m²</Eyebrow>
          <div style={{marginTop: 4, fontSize: 92, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: '98px', fontFeatureSettings: '"tnum"'}}>£139.000</div>
        </div>
      </div>
    </>
  );
};

// ---------------- master ----------------
export const V17: React.FC = () => {
  const ok = useFontsV10();
  const t = useCurrentFrame() / FPS;
  if (!ok) return <AbsoluteFill style={{background: CREAM}} />;
  const phoneOn = !(t >= TL.portalOut[1] && t < TL.portalIn[0]);
  const fadeIn = lin(t, 0, 0.25), fadeOut = 1 - EIN(lin(t, 21.5, 22));
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      <Stage />
      <Grain />
      {phoneOn && <Phone pose={poseAt(t)} lit={1} sweep={-1} flash={0}><Screen t={t} /></Phone>}
      <TitleBlock t={t} />
      <PlugCaption t={t} />
      <EndCta t={t} />
      <PhotoStage t={t} />
      <AbsoluteFill style={{background: CREAM, opacity: 1 - Math.min(fadeIn, fadeOut), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
