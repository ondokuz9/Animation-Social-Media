// VIDEO-1 v12 (final) · "Evlek artık ChatGPT'de" · 30 sn, 1080×1920, 60 fps, sessiz.
// Yön "Önce ev" (12 uzmanlı kurul, docs/v12/FINAL-RAPOR.md): film gerçek havuz karesi + "Evlek artık ChatGPT'de." ile açılır,
// fotoğraf ters portalla ChatGPT tam ekranındaki gerçek Evlek detayına iner; soru → gerçek sonuç → kart → detay → galeri →
// iç mekân → "Evlek'te tüm ayrıntılar ↗" → evlek.app → Eklentiler yolu → Bağlı → Girne → aynı havuz karesinde CTA; dikişsiz döngü.
// Üç ana mesaj: "Evlek artık ChatGPT'de." · "Sor. Evlek göstersin." · "ChatGPT'de Eklentiler'den Evlek'i ekleyin."
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS, H, Logo, LOGO_AR, W, lin, mix, useFontsV10} from '../v10/core';
import {OX, OY, P, PH, PW, Phone, Pose, mixPose, projectOut} from './Phone';
import {BUBBLE_CHIP, HERO_D, Screen} from './Screen';
import {TL} from './tl';

const img = (p: string) => staticFile(p);
const SOFT = Easing.bezier(0.25, 0.1, 0, 1); // kamera
const FLY = Easing.bezier(0.45, 0, 0.15, 1); // portal, imza, çıkış
const ENTER = Easing.bezier(0.22, 1, 0.36, 1);
const RAMP = Easing.bezier(0.4, 0, 0.2, 1);
const L_ = Easing.linear;

// ---------------- pozlar (x; y; s; rx; ry; rz) ----------------
const PHK = P(540, 1110, 0.55, 2, -4, -1); // kanca ve detay
const PB = P(506, 1750, 0.85, 2, -4, -1); // soru balonu yakın planı; kart şeridi kadraj dışında
const PC = P(695, 654, 0.8, 2, -4, -1); // £139.000 kartı yakın planı
const PDH = P(540, 1180, 0.62, 2, -4, -1); // tam ekran detay kahramanı
const PIN0 = P(900, 2500, 0.42, 3, -8, 0), PIN = P(740, 1300, 0.42, 3, -8, 0);
const PD = P(560, 1000, 0.7, 2, -5, -1); // detay bilgisi
const PP = P(540, 650, 0.78, 2, -4, -1); // evlek.app fiyat ve başlık
const CHAT = P(540, 1050, 0.55, 2, -4, -1);
const PBTN = P(540, 1070, 0.6, 2, -4, -1);
const CLOSE = P(540, 1330, 0.4, 3, -6, -1);
const EXIT = P(540, 2650, 0.4, 3, -6, -1);
const dr = (p: Pose, k = 1.012, dy = -6): Pose => ({...p, s: p.s * k, y: p.y + dy}); // duruşta nefes

type Key = {t: number; p: Pose; e?: (x: number) => number; cut?: boolean};
const K = (t: number, p: Pose, e: (x: number) => number = SOFT, cut = false): Key => ({t, p, e, cut});
const KEYS: Key[] = [
  K(0, PHK), K(3.45, dr(PHK, 1.006, -3), L_),
  K(TL.pushB[1], PB), K(TL.cutCards, dr(PB), L_),
  K(TL.cutCards, PC, L_, true), K(TL.pullD[0], dr(PC, 1.008, -4), L_),
  K(TL.pullD[1], PDH), K(TL.phoneIn[0], PDH, L_),
  K(TL.phoneIn[0], PIN0, L_, true), K(TL.phoneIn[1], PIN, ENTER),
  K(TL.pushPD[1], PD), K(TL.pushPP[0], dr(PD, 1.008, -4), L_),
  K(TL.pushPP[1], PP), K(TL.ext, dr(PP, 1.008, -4), L_),
  K(TL.ext, CHAT, L_, true), K(TL.pushBtn[0], dr(CHAT, 1.006, -3), L_),
  K(TL.pushBtn[1], PBTN), K(TL.close[0], dr(PBTN, 1.01, -4), L_),
  K(TL.close[1], CLOSE), K(TL.exit[0], dr(CLOSE, 1.012, -6), L_),
  K(TL.exit[1], EXIT, FLY),
];
const poseAt = (t: number): Pose => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  if (!b || b.cut) return a.p;
  return mixPose(a.p, b.p, (b.e ?? SOFT)(lin(t, a.t, b.t)));
};
/** üç fiziksel tepki: karta dokunuş, Eklentiyi kur, Girne gönder */
const kick = (t: number, p: Pose): Pose => {
  let b = 0;
  for (const at of [TL.tap, TL.installTap, TL.send]) {
    const k = lin(t, at, at + 0.18);
    if (k > 0 && k < 1) b = Math.max(b, Math.sin(Math.PI * k));
  }
  return {...p, s: p.s * (1 - 0.004 * b), y: p.y + 3 * b};
};
export const poseK = (t: number) => kick(t, poseAt(t));
export const showPhoneAt = (t: number) => t >= TL.rportal[0] && !(t >= TL.portal[1] && t < TL.phoneIn[0]) && t < TL.exit[1];

// ---------------- fotoğraflar ----------------
const GRADE_EXT = 'brightness(1.0) contrast(1.05) sepia(.06) hue-rotate(-3deg)';
const GRADE_INT = 'brightness(.98) contrast(1.03) sepia(.08)';
const VIG = 'radial-gradient(ellipse 80% 62% at 50% 52%, transparent 58%, rgba(5,16,28,.30))';
const EXT = 'v12/EVL-100102_00_l2560.png'; // 2560×1920 (1,60×, Lanczos)
const INT = 'v12/EVL-100102_01_l1584.png'; // 1584×2112 (1,32×, Lanczos)
/** dış çekim yatay konumu: kanca 24 + 1,5·t; kapanış 24 − 1,5·(30 − t) → t=30'da 0. kareyle aynı */
const xPct = (t: number) => (t < 12 ? Math.min(24 + 1.5 * t, 26.25) : 24 - 1.5 * (30 - t));
const extLeft = (t: number) => -(xPct(t) / 100) * 1480;
/** bulanık fazda kenar bandı olmasın: görüntü sarmalayıcıya üst/alt 72 px ayna şeridiyle girer, filtre sarmalayıcıda */
const Blurred: React.FC<{src: string; left: number; top: number; w: number; h: number; blur: number; grade: string}> = ({src, left, top, w, h, blur, grade}) => {
  const M = 72;
  const im = (y: number, flip: boolean, clipTop: number, clipH: number) => (
    <div style={{position: 'absolute', left: 0, top: clipTop, width: w, height: clipH, overflow: 'hidden'}}>
      <Img src={img(src)} style={{position: 'absolute', left: 0, top: y, width: w, height: h, transform: flip ? 'scaleY(-1)' : undefined}} />
    </div>
  );
  return (
    <div style={{position: 'absolute', left, top: top - (blur > 0 ? M : 0), width: w, height: h + (blur > 0 ? 2 * M : 0), filter: blur > 0 ? `blur(${blur}px) ${grade}` : grade}}>
      {blur > 0 ? (
        <>
          {im(M - h, true, 0, M)}
          {im(0, false, M, h)}
          {im(0, true, M + h, M)}
        </>
      ) : <Img src={img(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h}} />}
    </div>
  );
};
const Exterior: React.FC<{t: number; blur: number; navy: number}> = ({t, blur, navy}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: C.navy}}>
    <Blurred src={EXT} left={Math.round(extLeft(t) * 2) / 2} top={0} w={2560} h={1920} blur={blur} grade={GRADE_EXT} />
    <AbsoluteFill style={{background: C.navy, opacity: navy, mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: VIG, opacity: 1 - navy}} />
  </AbsoluteFill>
);
const intTop = (t: number) => Math.round(-120 * Easing.bezier(0.33, 0, 0.2, 1)(lin(t, TL.interior[0], TL.interior[1])));
const Interior: React.FC<{t: number; blur: number; navy: number; dim: number}> = ({t, blur, navy, dim}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: C.navy}}>
    <Blurred src={INT} left={-150} top={intTop(t)} w={1584} h={2112} blur={blur} grade={GRADE_INT} />
    <AbsoluteFill style={{background: '#000', opacity: dim}} />
    <AbsoluteFill style={{background: C.navy, opacity: navy, mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: VIG, opacity: 1 - navy}} />
  </AbsoluteFill>
);
/** zeminin keskinliği (0 bulanık-lacivert … 1 net) */
const clarity = (t: number) => {
  if (t < TL.rportal[0]) return 1;
  if (t < TL.interior[0]) return 0;
  if (t < 13.8) return 1;
  if (t < TL.ext) return 1 - RAMP(lin(t, 13.8, 14.4));
  return RAMP(lin(t, TL.close[0], TL.close[1]));
};
const Background: React.FC<{t: number}> = ({t}) => {
  const c = clarity(t);
  if (t >= TL.interior[0] && t < TL.ext) return <Interior t={t} blur={24 * (1 - c)} navy={0.6 * (1 - c)} dim={0.15 * RAMP(lin(t, TL.phoneIn[0], TL.phoneIn[0] + 0.4))} />;
  return <Exterior t={t} blur={24 * (1 - c)} navy={0.6 * (1 - c)} />;
};
/** yazı alanı üst degradesi: kanca, iç mekân künyesi, kapanış */
const topGrad = (t: number) => {
  if (t < TL.gradOut[1]) return 1 - lin(t, TL.gradOut[0], TL.gradOut[1]);
  if (t >= TL.interior[0] - 0.1 && t < TL.tag[2] + 0.2) return lin(t, TL.interior[0] - 0.1, TL.interior[0] + 0.15) * (1 - lin(t, TL.tag[2], TL.tag[2] + 0.2));
  if (t >= TL.close[0]) return RAMP(lin(t, TL.close[0], TL.close[1]));
  return 0;
};

// ---------------- portal: telefon düzlemindeki kahraman ↔ tam kare ----------------
type Rect = {x: number; y: number; w: number; h: number};
const mixR = (a: Rect, b: Rect, k: number): Rect => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k)});
// filtre karışımı (k=0 filtresiz gerçek piksel, k=1 derecelendirme): sepia/hue sıfırdan, diğerleri 1'den
const gradeMix = (g: string, k: number) =>
  g.replace(/(brightness|contrast|saturate|sepia|hue-rotate)\(([-\d.]+)(deg)?\)/g, (_m, f, v, u) => {
    const n = Number(v);
    const base = f === 'sepia' || f === 'hue-rotate' ? 0 : 1;
    return `${f}(${(base + (n - base) * k).toFixed(4)}${u ?? ''})`;
  });
const Portal: React.FC<{t: number}> = ({t}) => {
  if (t >= TL.rportal[0] && t < TL.rportal[1]) {
    const k = 1 - FLY(lin(t, TL.rportal[0], TL.rportal[1]));
    return <PortalLayer p0={poseK(TL.rportal[1])} k={k} src={EXT} imgHero={{x: 0, y: 0, w: HERO_D.w, h: HERO_D.h}} imgFull={{x: extLeft(TL.rportal[0]), y: 0, w: 2560, h: 1920}} grade={GRADE_EXT} />;
  }
  if (t >= TL.portal[0] && t < TL.portal[1]) {
    const k = FLY(lin(t, TL.portal[0], TL.portal[1]));
    const ih = (HERO_D.w * 1600) / 1200;
    return <PortalLayer p0={poseK(TL.portal[0])} k={k} src={INT} imgHero={{x: 0, y: (HERO_D.h - ih) / 2, w: HERO_D.w, h: ih}} imgFull={{x: -150, y: 0, w: 1584, h: 2112}} grade={GRADE_INT} />;
  }
  return null;
};
const PortalLayer: React.FC<{p0: Pose; k: number; src: string; imgHero: Rect; imgFull: Rect; grade: string}> = (pr) => {
  const s = pr.p0.s;
  const cropHero: Rect = {x: s * (OX + HERO_D.x - PW / 2), y: s * (OY + HERO_D.y - PH / 2), w: s * HERO_D.w, h: s * HERO_D.h};
  const cropFull: Rect = {x: -pr.p0.x, y: -pr.p0.y, w: W, h: H};
  const cr = mixR(cropHero, cropFull, pr.k);
  // görüntü dikdörtgeni kırpım çerçevesine göre: kahramanda (ekran px · s), tam karede (çıktı px)
  const ir = mixR({x: pr.imgHero.x * s, y: pr.imgHero.y * s, w: pr.imgHero.w * s, h: pr.imgHero.h * s}, pr.imgFull, pr.k);
  const lift = Math.sin(Math.PI * pr.k);
  const p0 = pr.p0;
  return (
    <div style={{position: 'absolute', inset: 0, perspective: 3200, perspectiveOrigin: `${p0.x}px ${p0.y}px`}}>
      <div style={{position: 'absolute', left: p0.x, top: p0.y, width: 0, height: 0, transformStyle: 'preserve-3d',
        transform: `rotateX(${p0.rx * (1 - pr.k)}deg) rotateY(${p0.ry * (1 - pr.k)}deg) rotateZ(${p0.rz * (1 - pr.k)}deg) translateZ(${s * (1 - pr.k) + 20 * lift}px)`}}>
        <div style={{position: 'absolute', left: cr.x, top: cr.y, width: cr.w, height: cr.h, overflow: 'hidden', boxShadow: lift > 0.01 ? `0 ${40 * lift}px ${110 * lift}px rgba(0,6,14,${0.5 * lift})` : undefined}}>
          <Img src={img(pr.src)} style={{position: 'absolute', left: ir.x, top: ir.y, width: ir.w, height: ir.h, filter: pr.k > 0 ? gradeMix(pr.grade, pr.k) : undefined}} />
          <div style={{position: 'absolute', inset: 0, background: VIG, opacity: pr.k}} />
        </div>
      </div>
    </div>
  );
};

// ---------------- dış metin ----------------
const Txt: React.FC<{o: number; y: number; size: number; weight?: number; lh?: number; children: React.ReactNode; num?: boolean}> = ({o, y, size, weight = 700, lh = 1.1, children, num}) =>
  o <= 0 ? null : (
    <div style={{position: 'absolute', left: 76, right: 76, top: y + (1 - o) * 14, textAlign: 'center', opacity: o, fontFamily: F, fontSize: size, fontWeight: weight, color: C.cream,
      letterSpacing: num ? '-0.04em' : '-0.03em', lineHeight: lh, fontVariantNumeric: num ? 'tabular-nums' : undefined}}>{children}</div>
  );
const fade = (t: number, a: number, b: number, c: number) => Easing.bezier(0.25, 0.1, 0.25, 1)(lin(t, a, b)) * (1 - lin(t, c - 0.25 < b ? b : c - 0.25, c));
/** Eklentiler yolu: aktif adım krem %100 + 4 px mercan alt çizgi, geçilen adım %55, bitince ✓ */
const STEPS: [string, number][] = [['ChatGPT', TL.ext], ['Eklentiler', TL.plugTap], ['Evlek', TL.rowTap], ['Ekle', TL.installTap]];
const PathStrip: React.FC<{t: number}> = ({t}) => {
  const o = lin(t, TL.strip[0], TL.strip[0] + 0.25) * (1 - lin(t, TL.strip[1], TL.strip[2]));
  if (o <= 0) return null;
  let act = 0;
  STEPS.forEach(([, at], i) => { if (t >= at) act = i; });
  const done = t >= TL.bound;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 128, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 18, fontFamily: F, fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em', color: C.cream, opacity: o}}>
      {STEPS.map(([s], i) => {
        const on = i === act;
        return (
          <React.Fragment key={s}>
            {i > 0 && <span style={{opacity: 0.4}}>›</span>}
            <span style={{position: 'relative', opacity: on ? 1 : i < act ? 0.72 : 0.5}}>
              {s}{on && done ? ' ✓' : ''}
              {on && <span style={{position: 'absolute', left: 0, right: 0, bottom: -12, height: 4, borderRadius: 2, background: C.coral}} />}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------------- logo ve imza hareketi (logo → sorudaki Evlek çipi) ----------------
const LOGO_C = {x: 540, y: 220, h: 150};
const LogoAt: React.FC<{x: number; y: number; h: number; o?: number}> = ({x, y, h, o = 1}) => (
  <div style={{position: 'absolute', left: x - (h * LOGO_AR) / 2, top: y - h / 2, opacity: o}}><Logo h={h} /></div>
);
const LogoLayer: React.FC<{t: number}> = ({t}) => {
  if (t < TL.sig[0]) return <LogoAt {...LOGO_C} />;
  if (t < TL.sig[1]) {
    const k = FLY(lin(t, TL.sig[0], TL.sig[1]));
    const p = poseK(TL.sig[1]);
    const c = projectOut(p, BUBBLE_CHIP.x, BUBBLE_CHIP.y);
    return <LogoAt x={mix(LOGO_C.x, c.x, k)} y={mix(LOGO_C.y, c.y, k)} h={mix(LOGO_C.h, BUBBLE_CHIP.h * p.s, k)} o={1 - lin(t, TL.sig[1] - 0.06, TL.sig[1])} />;
  }
  if (t >= TL.logoIn) return <LogoAt {...LOGO_C} o={lin(t, TL.logoIn, TL.logoIn + 0.25)} />;
  return null;
};

// ---------------- master ----------------
export const V12: React.FC = () => {
  const ok = useFontsV10();
  const f = useCurrentFrame();
  const t = f / FPS;
  if (!ok) return <AbsoluteFill style={{background: C.navy}} />;
  const pose = poseK(t);
  const title = t < TL.titleOut[1] ? 1 - lin(t, TL.titleOut[0], TL.titleOut[1]) : t >= TL.title2[0] ? lin(t, TL.title2[0], TL.title2[1]) : 0;
  const ctaO = lin(t, TL.cta, TL.cta + 0.25) * (1 - lin(t, TL.ctaOut[0], TL.ctaOut[1]));
  const footO = lin(t, TL.foot, TL.foot + 0.25) * (1 - lin(t, TL.ctaOut[0], TL.ctaOut[1]));
  const g = topGrad(t);
  const onPhoto = clarity(t);
  return (
    <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
      <Background t={t} />
      {showPhoneAt(t) && (
        <Phone pose={pose} onPhoto={onPhoto}>
          <Screen t={t} />
        </Phone>
      )}
      <Portal t={t} />
      {g > 0 && <AbsoluteFill style={{background: t >= TL.interior[0] - 0.1 && t < TL.ext ? 'linear-gradient(180deg, rgba(10,37,64,.82) 0px, rgba(10,37,64,.62) 300px, rgba(10,37,64,0) 560px)' : 'linear-gradient(180deg, rgba(10,37,64,.74) 0px, rgba(10,37,64,.58) 520px, rgba(10,37,64,0) 860px)', opacity: g}} />}
      {/* 1 · haber: ilk ve son kare */}
      <Txt o={title} y={330} size={92}>artık ChatGPT’de.</Txt>
      {/* 2 · ürün vaadi */}
      <Txt o={fade(t, TL.slogan[0], TL.slogan[0] + 0.25, TL.slogan[2])} y={128} size={72}>Sor. Evlek göstersin.</Txt>
      {/* tek künye: telefonsuz iç mekân planında */}
      <Txt o={fade(t, TL.tag[0], TL.tag[0] + 0.25, TL.tag[2])} y={210} size={96} weight={800} lh={1} num>£139.000</Txt>
      <Txt o={fade(t, TL.tagSub, TL.tagSub + 0.25, TL.tag[2])} y={322} size={52} weight={600}>Lapta · 2+1 · 107 m²</Txt>
      {/* 3 · edinme yolu */}
      <PathStrip t={t} />
      {/* kapanış */}
      <Txt o={ctaO} y={330} size={72} weight={800} lh={79 / 72}>ChatGPT’de<br />Eklentiler’den<br />Evlek’i ekleyin.</Txt>
      {footO > 0 && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 610, textAlign: 'center', fontFamily: F, fontSize: 30, fontWeight: 500, lineHeight: '40px', color: C.cream, opacity: footO}}>
          ChatGPT arayüzü temsilîdir; Evlek ekranları ve ilan verileri gerçektir. ChatGPT, OpenAI’ın ticari markasıdır.
        </div>
      )}
      <LogoLayer t={t} />
    </AbsoluteFill>
  );
};
