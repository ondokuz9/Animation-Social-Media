// V19 · FINAL (ilan bölümü yönetmen + UX turu)
// V18 · FINAL · "Evlek artık ChatGPT'de." · 26 sn (V17 + Özellikler kanıtı + hafif yavaşlatma + ince işler), 1080×1920, 60 fps. docs/v17/FINAL-RAPOR.md
// Sıra: başlık + telefon → ekrana yaklaşırken ChatGPT'de Evlek'e yazılır → etkileşim → Eklentiler'den Evlek'i ekle → bitiş.
// Arayüz: ChatGPT kabuğu temsilî (gerçek kayıtlardan ölçüldü), Evlek yüzeyleri gerçek piksel. Okuma anlarında arayüz düz (eğim 0).
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, EIN, F, FPS, IO, Logo, lin, mix, useFontsV10} from '../v10/core';
import {OX, OY, P, PH, PW, Phone, Pose, mixPose} from './Phone';
import {CameraMotionBlur} from '@remotion/motion-blur';
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
const TYPE = {...view(0, 760, 0.88), x: 540}; // ekran yatayda ortalı (ince işler)
const SEND = P(540, (PH / 2 - OY - 300) * 0.78 + 40, 0.78); // gönderince balonu izler: ekranın üstü (balon, Evlek) + telefonun altı
const SEND2 = P(540, (PH / 2 - OY - 300) * 0.82 + 40, 0.82); // aranırken yavaşça yaklaşır
const CHAT = view(0, 150, 0.916); // balon + Evlek + sonuç
const CARDS = view(0, 560, 1); // kart şeridi 1:1 gerçek piksel
const DS = 0.6, DY = 862;
const DETAIL = P(540, DY, DS); // tam telefon: ilan; "Emlakçıya sor" y≈1566
const LIST = view(0, 140, 0.916); // ekran tam genişlikte (kenar yazıları kırpılmaz) // Ç1–Ç2: ilan üstü (✕ Evlek, galeri, fiyat), kart yakınıyla aynı ölçek
/** Ç3: salon fotoğrafına yaklaşma; sabit nokta pencerede görünen deniz (ekran 470, 760) */
const zoomAt = (k: number): Pose => { const s = mix(0.95, 1.4, k); const sx = 470, sy = 760; const fx = 540, fy = 950; /* kırpılan yazı kadraj dışında kalır */ return P(fx + (PW / 2 - OX - sx) * s, fy + (PH / 2 - OY - sy) * s, s); };
const FEAT = view(0, 760, 0.916); // ilan yakın: fiyat, başlık, Temel bilgiler, Özellikler çipleri, alt çubuk
const PLUG = P(540, 1140, 0.55); // eklenti bölümü: üstte başlık + adımlar; düğme altı ≈1793 (Reels alt bandının üstü)
const END = P(540, 1196, 0.47); // telefonun altı ≈1830: kareye ≥90 px pay, Reels bandının dışında
const dy = (p: Pose, y: number): Pose => ({...p, y: p.y + y});
const bump = (p: Pose, t: number, at: number): Pose => { const b = Math.sin(Math.PI * lin(t, at, at + 0.16)); return b > 0 && b < 1 ? {...p, s: p.s * (1 - 0.005 * b)} : p; };
export const poseAt = (t: number): Pose => {
  if (t < TL.intro[1] + 0.3) return mixPose({...OPEN, y: OPEN.y + 90, s: 0.5, ry: 6}, OPEN, OUT(lin(t, TL.intro[0], TL.intro[1] + 0.3)));
  if (t < TL.push[0]) return OPEN;
  if (t < TL.push[1]) return mixPose(OPEN, TYPE, EXP(lin(t, TL.push[0], TL.push[1])));
  if (t < TL.follow[0]) return bump(TYPE, t, TL.send);
  if (t < TL.follow[1]) return mixPose(TYPE, SEND, Easing.bezier(0.3, 0, 0.2, 1)(lin(t, TL.follow[0], TL.follow[1])));
  if (t < TL.cam1[0]) return mixPose(SEND, SEND2, IO(lin(t, TL.follow[1], TL.cam1[0])));
  if (t < TL.cam1[1]) return mixPose(SEND2, CHAT, IO(lin(t, TL.cam1[0], TL.cam1[1])));
  if (t < TL.cam2[0]) return dy(CHAT, -10 * lin(t, TL.cam1[1], TL.cam2[0]));
  if (t < TL.cam2[1]) return mixPose(dy(CHAT, -10), CARDS, IO(lin(t, TL.cam2[0], TL.cam2[1])));
  if (t < TL.expand[0]) return bump(CARDS, t, TL.tap);
  if (t < TL.expand[1]) return mixPose(CARDS, LIST, EXP(lin(t, TL.expand[0], TL.expand[1])));
  const l2 = view(0, 140, 0.95); // fiyat okunurken çok yavaş yaklaşma
  if (t < TL.zoom[0]) return mixPose(LIST, l2, Easing.inOut(Easing.quad)(lin(t, TL.expand[1], TL.zoom[0])));
  if (t < TL.zoom[1]) return mixPose(l2, zoomAt(1), Easing.bezier(0.33, 0, 0.15, 1)(lin(t, TL.zoom[0], TL.zoom[1])));
  if (t < TL.featCam[1]) return mixPose(zoomAt(1), FEAT, Easing.bezier(0.45, 0, 0.2, 1)(lin(t, TL.featCam[0], TL.featCam[1])));
  if (t < TL.featBack[0]) return dy(FEAT, -8 * lin(t, TL.featHold[0], TL.featHold[1]));
  if (t < TL.featBack[1]) return mixPose(dy(FEAT, -8), PLUG, Easing.bezier(0.45, 0, 0.2, 1)(lin(t, TL.featBack[0], TL.featBack[1])));
  if (t < TL.back[0]) return PLUG;
  if (t < TL.back[1]) return mixPose(PLUG, END, IO(lin(t, TL.back[0], TL.back[1])));
  return END;
};

// ---------------- zemin, gren, tipografi ----------------
const Stage: React.FC = () => { const k = useCurrentFrame() / (26 * 60); return <AbsoluteFill style={{background: `radial-gradient(120% 70% at ${30 + 4 * k}% ${18 + 2 * k}%, #FFFEFB 0%, ${CREAM} 46%, #F0EBDF 100%)`}} />; };
const Grain: React.FC<{o?: number}> = ({o = 0.1}) => {
  const f = Math.floor(useCurrentFrame() / 2);
  const gx = (f * 197) % 512, gy = (f * 331) % 512; // deterministik kayma
  return <AbsoluteFill style={{backgroundImage: `url(${img('v16/gren.png')})`, backgroundSize: '512px 512px', backgroundPosition: `${gx}px ${gy}px`, mixBlendMode: 'soft-light', opacity: o, pointerEvents: 'none'}} />;
};
const Eyebrow: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = CORAL, style}) => (
  <div style={{fontFamily: F, fontSize: 28, fontWeight: 600, letterSpacing: '0.14em', color, whiteSpace: 'nowrap', fontFeatureSettings: '"case"', ...style}}>{children}</div>
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
      <div style={rise(a, 26)}><Logo h={endOn ? 132 : 150} color={NAVY} style={{marginLeft: -13}} /></div>
      <div style={{marginTop: 4, marginLeft: -3, fontFamily: F, fontSize: endOn ? 84 : 92, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: endOn ? '94px' : '102px', color: NAVY, whiteSpace: 'nowrap', ...rise(b, 26)}}>artık ChatGPT’de.</div>
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
    <div style={{position: 'absolute', left: M, top: 438, height: 92, padding: '0 14px 0 34px', borderRadius: 46, background: NAVY, display: 'flex', alignItems: 'center', gap: 22, fontFamily: F, fontSize: 38, fontWeight: 600, color: CREAM, letterSpacing: '-0.02em', boxShadow: '0 1px 2px rgba(10,37,64,.25), 0 12px 26px -8px rgba(10,37,64,.30)', ...rise(c, 20)}}>
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
      <div style={{marginTop: 4, marginLeft: '-0.055em', fontSize: 70, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: '80px', whiteSpace: 'nowrap'}}>Eklentiler’den Evlek’i ekle.</div>
      <div style={{marginTop: 18, display: 'flex', gap: 12}}>
        {STEPS.map(([, label], i) => {
          const on = i <= cur, now = i === cur && !done, ok = done || i < cur;
          return (
            <div key={label} style={{height: 66, padding: '0 22px 0 10px', borderRadius: 33, display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
              background: now ? NAVY : on ? 'rgba(10,37,64,.08)' : 'transparent', color: now ? CREAM : on ? NAVY : 'rgba(10,37,64,.58)', boxShadow: on ? 'none' : 'inset 0 0 0 2px rgba(10,37,64,.18)'}}>
              <span style={{width: 46, height: 46, borderRadius: 23, background: ok ? CORAL : now ? CREAM : 'rgba(10,37,64,.12)', color: ok ? '#fff' : NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700}}>
                {ok ? <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : i + 1}
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
  const cover = t < TL.portalIn[0] ? lin(k1, 0.5, 0.9) : 1 - lin(lk, 0.1, 0.5);
  const r2 = mixR(ROOM_A, ROOM_B, Easing.out(Easing.quad)(lin(t, TL.portalOut[1] - 0.2, TL.portalIn[0] + 0.1)));
  const c = lk > 0 ? mixR(WIN, HERO, lk) : mixR(HERO, WIN, k1);
  const i = lk > 0 ? mixR(r2, HERO_IMG, lk) : mixR(HERO_IMG, r2, k1);
  const pass = lin(k1, 0.6, 1) * (1 - lin(lk, 0, 0.3));
  const cap = OUT(lin(t, TL.portalOut[1] + 0.05, TL.portalOut[1] + 0.5)) * (1 - lin(t, TL.portalIn[0] - 0.2, TL.portalIn[0]));
  return (
    <>
      <AbsoluteFill style={{opacity: cover}}><Stage /><Grain /></AbsoluteFill>
      <div style={{position: 'absolute', left: M, top: 62, opacity: pass}}><Logo h={46} color={NAVY} /></div>
      <Eyebrow color="rgba(10,37,64,.55)" style={{position: 'absolute', right: M, top: 70, opacity: pass, fontSize: 30}}>CHATGPT’DE · GERÇEK İLAN</Eyebrow>
      <Eyebrow color="rgba(10,37,64,.55)" style={{position: 'absolute', left: M, top: 1800, opacity: pass, fontSize: 30}}>EVL-100102</Eyebrow>
      <Eyebrow color="rgba(10,37,64,.55)" style={{position: 'absolute', right: M, top: 1800, opacity: pass, fontSize: 30, fontFeatureSettings: '"tnum"'}}>2 / 14</Eyebrow>
      <div style={{opacity: lin(t, TL.portalOut[0], TL.portalOut[0] + 0.08) * (1 - lin(t, TL.portalIn[1] - 0.12, TL.portalIn[1]))}}><Pic src={ROOM} c={c} i={i} shadow={Math.max(Math.sin(Math.PI * k1), Math.sin(Math.PI * lk))} /></div>
      <div style={{position: 'absolute', left: M, top: 1390, fontFamily: F, ...rise(cap, 24)}}>
        <div style={{display: 'inline-flex', flexDirection: 'column', padding: '26px 38px 30px', borderRadius: 40, background: 'rgba(250,248,242,.96)', boxShadow: '0 24px 60px rgba(10,37,64,.25)', color: NAVY}}>
          <Eyebrow color={CORAL} style={{fontSize: 30}}>LAPTA · GİRNE · 2+1 · 107 m²</Eyebrow>
          <div style={{marginTop: 4, fontSize: 92, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: '98px', fontFeatureSettings: '"tnum"'}}>£139.000</div>
        </div>
      </div>
    </>
  );
};

// ---------------- master ----------------
/** hızlı kamera pencereleri: yalnız bunlarda hareket bulanıklığı ve camda hafif yansıma (okuma anları keskin kalır) */
const FAST: [number, number][] = [[TL.push[0], TL.push[1]], [TL.follow[0], TL.follow[1]], [TL.cam1[0], TL.cam1[1]], [TL.cam2[0], TL.cam2[1]], [TL.expand[0], TL.expand[1]],
  [TL.portalOut[0], TL.portalOut[1]], [TL.portalIn[0], TL.portalIn[1]], [TL.featCam[0], TL.featCam[1]], [TL.featBack[0], TL.featBack[1]], [TL.cam3[0], TL.cam3[1]], [TL.back[0], TL.back[1]]];
/** hareket bulanıklığı yalnız saf kamera hareketlerinde (metnin aktığı gönder/okuma anlarında yok: hayalet kopya yapar) */
const BLUR: [number, number][] = [[TL.push[0], TL.push[1]], [TL.featBack[0], TL.featBack[1]], [TL.back[0], TL.back[1]]]; // yalnız saf kamera hareketleri (içerik değişmeyen)
const blurK = (t: number) => BLUR.reduce((m, [a, b]) => Math.max(m, t > a && t < b ? Math.sin(Math.PI * lin(t, a, b)) : 0), 0);
const fastK = (t: number) => FAST.reduce((m, [a, b]) => Math.max(m, t > a && t < b ? Math.sin(Math.PI * lin(t, a, b)) : 0), 0);
const PhoneLayer: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t >= TL.portalOut[1] && t < TL.portalIn[0]) return null;
  return <Phone pose={poseAt(t)} lit={1} sweep={-1} flash={0} glare={fastK(t)}><Screen t={t} /></Phone>;
};
export const V19: React.FC = () => {
  const ok = useFontsV10();
  const t = useCurrentFrame() / FPS;
  if (!ok) return <AbsoluteFill style={{background: CREAM}} />;
  const fadeIn = lin(t, 0, 0.1), fadeOut = 1 - EIN(lin(t, TL.fade[0], TL.fade[1]));
  const blur = blurK(t) > 0.25;
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      <Stage />
      <Grain />
      {blur ? <CameraMotionBlur shutterAngle={120} samples={6}><PhoneLayer /></CameraMotionBlur> : <PhoneLayer />}
      <TitleBlock t={t} />
      <PlugCaption t={t} />
      <EndCta t={t} />
      <PhotoStage t={t} />
      <AbsoluteFill style={{opacity: 1 - Math.min(fadeIn, fadeOut), pointerEvents: 'none'}}><Stage /><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
