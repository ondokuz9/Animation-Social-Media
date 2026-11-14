// VIDEO-1 v10 · "Evlek artık ChatGPT'de" · 30 sn, 1080×1920, 60 fps, sessiz.
// İskelet: docs/raporlar/v10-PLAN.md. Telefon her planda tam silüet ya da en az iki köşeyle görünür.
// Fotoğraflar gerçek ilan fotoğraflarıdır (EVL-100102, EVL-101433); yalnız derecelendirme ve kadraj uygulanır.
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {ALT, C, E, EIN, F, FPS, H, HERO, IO, Logo, S, W, cl, gbp, lin, mix, useFontsV10, win} from './core';
import {P, Phone, Pose, mixPose, screenToOut, SW} from './Phone';
import {Screen, QTEXT, composerTop, heroCardRect, galIndex, press, LAYOUT} from './Screen';
import {TL} from './tl';

const img = (p: string) => staticFile(p);
const GRADE_EXT = 'brightness(1.02) contrast(1.10) saturate(1.12) sepia(.06) hue-rotate(-4deg)';
const GRADE_INT = 'brightness(.97) contrast(1.12) saturate(1.06) sepia(.10) hue-rotate(-6deg)';
const VIGNETTE = 'radial-gradient(ellipse 80% 62% at 50% 52%, transparent 58%, #05101CA6)';
const GLOW = 'radial-gradient(70% 35% at 50% 38%, #FFB8782E, transparent 70%)';

// ---------------- kamera / telefon pozları ----------------
type Key = {t: number; p: Pose; e?: (x: number) => number; cut?: boolean};
const K = (t: number, p: Pose, e?: (x: number) => number, cut?: boolean): Key => ({t, p, e, cut});
const L_ = Easing.linear;
const HOOK_POSE = P(760, 1300, 0.3, 6, -15, -5);
const KEYS: Key[] = [
  K(0, HOOK_POSE),
  K(1.6, P(752, 1290, 0.312, 6, -13, -4.5), L_),
  // soru: telefon döner ve yaklaşır
  K(2.0, P(540, 1095, 0.6, 5, -7, -2.2), IO),
  K(2.62, P(540, 1088, 0.603, 4.5, -6, -2), L_),
  // Girne: widget tam görünür, canlı açı
  K(3.05, P(540, 1088, 0.62, 3, 5, 1.6), IO),
  K(4.5, P(540, 1092, 0.625, 3.5, 6, 2), L_),
  // Lapta sorusu
  K(4.85, P(540, 1110, 0.6, 5, -6, -2), IO),
  K(5.3, P(540, 1104, 0.602, 4.5, -5, -1.8), L_),
  K(5.75, P(540, 1088, 0.62, 3, -5, -1.6), IO),
  K(6.95, P(540, 1080, 0.628, 2, -3.5, -1), L_),
  // basma: telefon düzleşir (portal köşeleri birebir eşleşsin)
  K(7.18, P(540, 1070, 0.635, 0, 0, 0), IO),
  K(7.42, P(540, 1068, 0.636, 0, 0, 0), L_),
  // portal: telefon geri çekilir, kart kareyi doldurur
  K(8.25, P(820, 1540, 0.32, 6, -14, -5), IO),
  // mekân: telefon sağ alttan girer, aynı ilanın galerisi
  K(8.25, P(1180, 2350, 0.27, 4, -12, -5), L_, true),
  K(8.32, P(1180, 2350, 0.27, 4, -12, -5), L_),
  K(8.7, P(808, 1468, 0.27, 4, -12, -4.5), E),
  K(12.45, P(798, 1456, 0.276, 4, -9, -3.5), L_),
  // karşılaştırma sorusu
  K(12.85, P(540, 1110, 0.6, 5, 6, 2), IO),
  K(13.32, P(540, 1104, 0.602, 4.5, 5, 1.8), L_),
  K(13.7, P(540, 1088, 0.62, 3, 4, 1.2), IO),
  K(14.45, P(540, 1086, 0.622, 3, 3.5, 1), L_),
  // kanıt: telefon altta, küçük
  K(14.95, P(540, 1585, 0.27, 9, -6, -2), IO),
  K(16.95, P(540, 1575, 0.275, 8, -4, -1.5), L_),
  // web
  K(17.3, P(540, 1078, 0.62, 2.5, -3.5, -1), IO),
  K(18.55, P(540, 1074, 0.624, 2, -3, -0.8), L_),
  K(18.98, P(540, 1150, 0.5, 6, -11, -3.5), IO),
  // eklenti akışı
  K(19.3, P(556, 1128, 0.6, 5, 8, 2.5), IO),
  K(20.3, P(546, 1120, 0.604, 4, 5, 1.6), L_),
  K(20.75, P(540, 1112, 0.61, 3.5, -3, -1), IO),
  K(22.8, P(540, 1108, 0.612, 3, -5, -1.5), L_),
  K(24.35, P(540, 1112, 0.606, 4, -7, -2), L_),
  // kapanış: telefon alta iner, eğik
  K(25.1, P(540, 1775, 0.42, 14, -10, -5), IO),
  K(29.6, P(540, 1762, 0.42, 13, -8, -4), L_),
  K(29.999, HOOK_POSE, E),
];
const poseAt = (t: number): Pose => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  if (!b || b.cut) return a.p;
  return mixPose(a.p, b.p, (b.e ?? IO)(lin(t, a.t, b.t)));
};
// gönder basmasına fiziksel tepki: kısa çökme ve geri gelme
const kick = (t: number, p: Pose): Pose => {
  let b = 0;
  for (const at of [TL.send1, TL.send2, TL.send3, TL.press, TL.installTap, TL.tryTap, TL.linkTap, TL.rowTap]) {
    const k = lin(t, at, at + 0.26);
    if (k > 0 && k < 1) b = Math.max(b, Math.sin(Math.PI * k) * (1 - k));
  }
  return {...p, s: p.s * (1 - 0.012 * b), y: p.y + 8 * b, rx: p.rx + 0.8 * b};
};

// ---------------- arka planlar ----------------
const Photo: React.FC<{src: string; t: number; t0: number; rate: number; pos?: string; grade: string; o?: number; blur?: number; dx?: number; z0?: number}> = ({src, t, t0, rate, pos = '50% 50%', grade, o = 1, blur = 0, dx = 0, z0 = 1}) => {
  const z = z0 + rate * Math.max(0, t - t0);
  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: o}}>
      <Img src={img(src)} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', objectPosition: pos, transform: `translateX(${dx * Math.max(0, t - t0)}px) scale(${z})`, filter: `${grade}${blur ? ` blur(${blur}px)` : ''}`}} />
    </AbsoluteFill>
  );
};
const PoolBG: React.FC<{t: number; t0: number; z0?: number}> = ({t, t0, z0 = 1}) => (
  <>
    <Photo src="v4/EVL-100102_00.jpg" t={t} t0={t0} rate={0.018} pos="44% 58%" grade={GRADE_EXT} z0={z0} />
    <AbsoluteFill style={{background: GLOW, mixBlendMode: 'soft-light'}} />
    <AbsoluteFill style={{background: VIGNETTE}} />
  </>
);
// teknoloji zemini: derin lacivert, havuzun bulanık rengi, yumuşak ışık; gren yalnız zeminde
const TechBG: React.FC<{t: number; hue?: number}> = ({t, hue = 0}) => (
  <AbsoluteFill style={{background: '#06111D', overflow: 'hidden'}}>
    <Img src={img('v4/EVL-100102_00.jpg')} style={{position: 'absolute', left: -700 + Math.sin(t * 0.35) * 60, top: -200, height: 2400, filter: 'blur(70px) saturate(1.3)', opacity: 0.32}} />
    <AbsoluteFill style={{background: `radial-gradient(55% 32% at ${30 + Math.sin(t * 0.4) * 8}% 14%, rgba(127,178,255,${0.16 + hue * 0.05}), transparent 70%), radial-gradient(60% 40% at 80% 92%, rgba(184,78,59,.10), transparent 70%), linear-gradient(180deg, rgba(6,17,29,.35), rgba(6,17,29,.75))`}} />
    <Img src={img('kurul/doku/ince-gren.svg')} style={{position: 'absolute', inset: 0, width: W, height: H, opacity: 0.1}} />
  </AbsoluteFill>
);
const NavyBG: React.FC = () => (
  <AbsoluteFill style={{background: C.navy}}>
    <Img src={img('kurul/arka-plan/01-deniz-isigi.svg')} style={{position: 'absolute', inset: 0, width: W, height: H, opacity: 0.9}} />
    <AbsoluteFill style={{background: 'radial-gradient(70% 40% at 50% 26%, rgba(250,248,242,.10), rgba(10,37,64,0) 70%)'}} />
    <Img src={img('kurul/doku/ince-gren.svg')} style={{position: 'absolute', inset: 0, width: W, height: H, opacity: 0.12}} />
  </AbsoluteFill>
);
const SPACE = ['v4/EVL-100102_00.jpg', 'v4/EVL-100102_01.jpg', 'v4/EVL-100102_03.jpg'];
const SpaceBG: React.FC<{t: number}> = ({t}) => {
  const gi = galIndex(t);
  if (gi === 0) return <PoolBG t={t} t0={TL.portal[1]} />;
  const t0 = gi === 1 ? TL.gal1 : TL.gal2;
  return (
    <>
      <Photo src={SPACE[gi]} t={t} t0={t0} rate={0.01} pos={gi === 1 ? '50% 60%' : '64% 50%'} grade={GRADE_INT} dx={gi === 2 ? -9 : 0} z0={1.02} />
      <AbsoluteFill style={{background: VIGNETTE}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,16,28,.62) 0%, rgba(5,16,28,.28) 18%, rgba(5,16,28,0) 32%)'}} />
    </>
  );
};
const Background: React.FC<{t: number}> = ({t}) => {
  if (t < TL.hookEnd + 0.4) {
    // kanca → teknoloji zemini: fotoğraf bulanıklaşıp kararır (hız rampası)
    const k = IO(lin(t, TL.hookEnd - 0.05, TL.hookEnd + 0.4));
    return (
      <>
        <TechBG t={t} />
        <AbsoluteFill style={{opacity: 1 - k, filter: `blur(${k * 30}px)`, transform: `scale(${1 + k * 0.08})`}}><PoolBG t={t} t0={0} /></AbsoluteFill>
      </>
    );
  }
  if (t < TL.portal[1]) return <TechBG t={t} />;
  if (t < TL.spaceEnd) return <SpaceBG t={t} />;
  if (t < TL.spaceEnd + 0.4) {
    const k = IO(lin(t, TL.spaceEnd, TL.spaceEnd + 0.4));
    return (
      <>
        <TechBG t={t} />
        <AbsoluteFill style={{opacity: 1 - k, filter: `blur(${k * 30}px)`}}><SpaceBG t={t} /></AbsoluteFill>
      </>
    );
  }
  if (t < TL.close) return <TechBG t={t} hue={t >= TL.plug ? 1 : 0} />;
  const nk = E(lin(t, TL.close, TL.close + 0.4));
  return (
    <>
      <TechBG t={t} hue={1} />
      <AbsoluteFill style={{opacity: nk}}><NavyBG /></AbsoluteFill>
    </>
  );
};

// ---------------- yazı yardımcıları ----------------
const Words: React.FC<{text: string; t: number; t0: number; size: number; weight?: number; color?: string; stagger?: number; lh?: number; dur?: number; style?: React.CSSProperties; align?: 'left' | 'center'}> = ({text, t, t0, size, weight = 700, color = C.cream, stagger = 0.07, lh = 1.08, dur = 0.42, style, align = 'left'}) => {
  let wi = 0;
  return (
    <div style={{fontFamily: F, fontSize: size, fontWeight: weight, color, lineHeight: lh, letterSpacing: '-0.03em', textAlign: align, ...style}}>
      {text.split('\n').map((line, li) => (
        <div key={li} style={{whiteSpace: 'nowrap'}}>
          {line.split(' ').map((w, j) => {
            const st = t0 + wi++ * stagger;
            const k = E(lin(t, st, st + dur));
            return <span key={j} style={{display: 'inline-block', marginRight: '0.25em', opacity: k, transform: `translateY(${(1 - k) * 0.32 * size}px)`, filter: k < 1 ? `blur(${(1 - k) * 5}px)` : undefined}}>{w}</span>;
          })}
        </div>
      ))}
    </div>
  );
};
const SHADOW = '0 4px 30px rgba(0,8,18,.55), 0 1px 3px rgba(0,8,18,.4)';

// ---------------- kanca ----------------
const Hook: React.FC<{t: number; o?: number}> = ({t, o = 1}) => {
  const out = EIN(lin(t, 1.38, 1.62));
  if (out >= 1) return null;
  const sub = E(lin(t, 0.95, 1.3));
  return (
    <div style={{position: 'absolute', left: 76, top: 214, opacity: o * (1 - out), transform: `translateY(${-24 * out}px)`}}>
      {/* ilk karede tam okunur (döngü) */}
      <div style={{fontFamily: F, fontSize: 106, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.035em', color: C.cream, textShadow: SHADOW}}>Bir sabahın<br />böyle başlasa?</div>
      <div style={{marginTop: 44, display: 'flex', alignItems: 'center', gap: 20, opacity: sub, transform: `translateY(${(1 - sub) * 18}px)`}}>
        <div style={{fontFamily: F, fontSize: 58, fontWeight: 500, color: C.cream, letterSpacing: '-0.02em', textShadow: SHADOW}}>ChatGPT’de</div>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <Logo h={50} style={{filter: 'drop-shadow(0 3px 14px rgba(0,8,18,.5))', alignSelf: 'center', marginTop: 4}} />
          <div style={{fontFamily: F, fontSize: 58, fontWeight: 500, color: C.cream, letterSpacing: '-0.02em', marginLeft: -2, textShadow: SHADOW}}>’e sor.</div>
        </div>
      </div>
    </div>
  );
};

// ---------------- dışarıda büyük soru → yazım kutusuna uçar ----------------
const Question: React.FC<{t: number; q: string[]; type: number[]; fly: number[]; pose: Pose; chip?: boolean}> = ({t, q, type, fly, pose, chip}) => {
  if (t < type[0] || t > fly[1] + 0.02) return null;
  const k = IO(lin(t, fly[0], fly[1]));
  const size = 72;
  const y0 = 150; // metin bloğunun üst kenarı
  const n = q.length + (chip ? 1 : 0);
  const tgt = screenToOut(pose, 140 + 300, composerTop(n) + 50 + (n * 68) / 2);
  const cx = 540, cy = y0 + (q.length * size * 1.1) / 2;
  const sc = mix(1, (50 * pose.s) / size, k);
  return (
    <div style={{position: 'absolute', left: 0, top: y0, width: W, transform: `translate(${(tgt.x - cx) * k}px, ${(tgt.y - cy) * k}px) scale(${sc})`, transformOrigin: `540px ${cy - y0}px`, opacity: 1 - lin(k, 0.6, 1)}}>
      <Words text={q.join('\n')} t={t} t0={type[0]} size={size} weight={700} stagger={(type[1] - type[0]) / 6} lh={1.1} align="center" style={{textShadow: SHADOW}} />
    </div>
  );
};

// ---------------- mesaj bandı (tek satır, ≥64 px) ----------------
const Band: React.FC<{t: number; a: number; b: number; text: string}> = ({t, a, b, text}) => {
  if (t < a || t > b + 0.3) return null;
  const k = win(t, a, a + 0.4, b, b + 0.25);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 104, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * -14}px)`}}>
      <span style={{fontFamily: F, fontSize: 66, fontWeight: 700, color: C.cream, letterSpacing: '-0.03em', textShadow: SHADOW}}>{text}</span>
    </div>
  );
};

// ---------------- köşe logosu (3–24,5 sn) ----------------
const CornerLogo: React.FC<{t: number}> = ({t}) => {
  const k = win(t, 3.0, 3.4, 18.7, 19.0);
  if (k <= 0) return null;
  return <div style={{position: 'absolute', right: 56, top: 52, opacity: 0.88 * k}}><Logo h={40} style={{filter: 'drop-shadow(0 2px 10px rgba(0,8,18,.5))'}} /></div>;
};

// ---------------- portal: £139.000 kartı telefondan kalkar, kareyi doldurur ----------------
const Portal: React.FC<{t: number}> = ({t}) => {
  const [a, b] = TL.portal;
  if (t < a || t >= b) return null;
  const p0 = poseAt(a); // dönme 0: ekran → çıktı birebir
  const r = heroCardRect(a);
  const o = screenToOut(p0, r.x, r.y);
  const s0 = p0.s;
  const k = Easing.bezier(0.7, 0, 0.2, 1)(lin(t, a, b));
  const x = mix(o.x, 0, k), y = mix(o.y, 0, k);
  const w = mix(r.w * s0, W, k), h = mix(r.h * s0, H, k);
  const ph = mix(r.ph * s0, H, k);
  const lift = Math.sin(Math.PI * k);
  const rad = mix(40 * s0, 0, k);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, perspective: 2400}}>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: rad, overflow: 'hidden', background: '#1C2027',
        transform: `rotateY(${-7 * lift}deg) rotateX(${3 * lift}deg) translateZ(${60 * lift}px)`,
        boxShadow: `0 ${60 * lift}px ${140 * lift}px rgba(0,6,14,${0.6 * lift}), 0 ${10 * lift}px ${30 * lift}px rgba(0,6,14,${0.4 * lift})`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: w, height: ph, overflow: 'hidden'}}>
          <Img src={img(HERO.img)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '44% 58%', filter: k > 0 ? `brightness(${mix(1, 1.02, k)}) contrast(${mix(1, 1.1, k)}) saturate(${mix(1, 1.12, k)}) sepia(${0.06 * k}) hue-rotate(${-4 * k}deg)` : undefined}} />
          <div style={{position: 'absolute', inset: 0, background: VIGNETTE, opacity: k}} />
        </div>
        {/* kartın bilgi alanı: ölçekle birlikte aşağı kayıp çıkar */}
        <div style={{position: 'absolute', left: 0, top: ph, width: r.w, transform: `scale(${w / r.w})`, transformOrigin: '0 0', padding: '30px 34px 0', fontFamily: F}}>
          <div style={{fontSize: 80, fontWeight: 800, letterSpacing: '-0.04em', color: '#EEF0F3', lineHeight: 1}}>£139.000</div>
          <div style={{marginTop: 22, fontSize: 40, fontWeight: 500, color: '#CDD3DC'}}>2+1 · 2 banyo · 107 m²</div>
        </div>
      </div>
    </div>
  );
};

// ---------------- mekân künyesi ----------------
const PropTag: React.FC<{t: number}> = ({t}) => {
  const a = 8.95, b = TL.gal1 - 0.15;
  if (t < a || t > b + 0.3) return null;
  const k = win(t, a, a + 0.4, b, b + 0.25);
  const row = (i: number) => E(lin(t, a + 0.08 * i, a + 0.08 * i + 0.5));
  return (
    <div style={{position: 'absolute', left: 76, top: 190, fontFamily: F, color: C.cream, opacity: k, textShadow: SHADOW}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 52, fontWeight: 600, letterSpacing: '0.01em', opacity: row(0), transform: `translateY(${(1 - row(0)) * 16}px)`}}>
        <svg width="34" height="40" viewBox="0 0 128 148"><path d="M64 132S22 86 22 59a42 42 0 1 1 84 0c0 27-42 73-42 73Z" fill={C.cream} /><circle cx="64" cy="59" r="14" fill={C.coral} /></svg>
        Lapta, Girne
      </div>
      <div style={{marginTop: 6, fontSize: 124, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.04, fontVariantNumeric: 'tabular-nums', opacity: row(1), transform: `translateY(${(1 - row(1)) * 24}px)`}}>£139.000</div>
      <div style={{marginTop: 10, fontSize: 52, fontWeight: 500, opacity: row(2), transform: `translateY(${(1 - row(2)) * 16}px)`}}>2+1 · 107 m² · deniz manzarası</div>
      <div style={{marginTop: 26, height: 6, width: 110 * row(3), borderRadius: 3, background: C.coral}} />
    </div>
  );
};
// iç mekânda tek satır: ilan kimliği ve galeri
const RoomTag: React.FC<{t: number}> = ({t}) => {
  const a = TL.gal1 + 0.1, b = TL.spaceEnd - 0.2;
  if (t < a || t > b + 0.3) return null;
  const k = win(t, a, a + 0.4, b, b + 0.2);
  return (
    <div style={{position: 'absolute', left: 76, top: 200, opacity: k, fontFamily: F, color: C.cream, textShadow: SHADOW}}>
      <div style={{fontSize: 52, fontWeight: 600}}>Aynı ilan, içeriden.</div>
      <div style={{marginTop: 8, fontSize: 52, fontWeight: 400, opacity: 0.85}}>EVL-100102 · {galIndex(t) === 1 ? '2' : '4'} / 14</div>
    </div>
  );
};

// ---------------- kanıt: iki gerçek ilan, tek vurgu ----------------
const Proof: React.FC<{t: number}> = ({t}) => {
  const [a, b] = TL.proof;
  if (t < a - 0.1 || t > b + 0.3) return null;
  const out = EIN(lin(t, b - 0.05, b + 0.25));
  const card = (i: number) => {
    const L = i === 0 ? ALT : HERO;
    const k = E(lin(t, a + 0.08 + i * 0.1, a + 0.55 + i * 0.1));
    const x = i === 0 ? 64 : 556;
    return (
      <div key={i} style={{position: 'absolute', left: x, top: 250, width: 460, opacity: k * (1 - out), transform: `translateY(${(1 - k) * 60 - out * 30}px)`}}>
        {/* EVL-101433 kaynağı 640×480: en çok ~1,04× gösterilir */}
        <div style={{width: 460, height: 500, borderRadius: 36, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,6,14,.55)'}}>
          <Img src={img(L.img)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: L.pos ?? '50% 50%', filter: GRADE_EXT, transform: `scale(${1 + 0.01 * (t - a)})`}} />
        </div>
        <div style={{marginTop: 30, fontFamily: F, color: C.cream, textShadow: SHADOW}}>
          <div style={{fontSize: 84, fontWeight: 800, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{gbp(L.price)}</div>
          <div style={{marginTop: 16, fontSize: 52, fontWeight: 500, opacity: 0.92}}>{L.rooms} · {L.bath} banyo</div>
          <div style={{marginTop: 4, fontSize: 52, fontWeight: 500, opacity: 0.92}}>{L.area}</div>
        </div>
      </div>
    );
  };
  const d = E(lin(t, a + 0.75, a + 1.2));
  return (
    <>
      {card(0)}
      {card(1)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1092, textAlign: 'center', fontFamily: F, color: C.cream, opacity: d * (1 - out), transform: `translateY(${(1 - d) * 20}px)`, textShadow: SHADOW}}>
        <span style={{fontSize: 92, fontWeight: 800, letterSpacing: '-0.04em'}}>Fiyat farkı £12.000</span>
        <span style={{fontSize: 56, fontWeight: 500, marginLeft: 18, opacity: 0.85}}>%9,4</span>
        <div style={{margin: '22px auto 0', height: 6, width: 120 * d, borderRadius: 3, background: C.coral}} />
      </div>
    </>
  );
};

// ---------------- eklenti yolu çipleri ----------------
const Steps: React.FC<{t: number; y: number; active: number; o: number; size?: number}> = ({t, y, active, o, size = 52}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: o, fontFamily: F}}>
    {['ChatGPT', 'Eklentiler', 'Evlek'].map((w, i) => {
      const on = i <= active;
      return (
        <React.Fragment key={w}>
          {i > 0 && <span style={{fontSize: size, color: C.cream, opacity: on ? 0.8 : 0.35, fontWeight: 400}}>›</span>}
          <span style={{fontSize: size, fontWeight: 600, padding: `${size * 0.18}px ${size * 0.5}px`, borderRadius: size, color: on ? (i === 2 ? C.cream : C.navy) : 'rgba(250,248,242,.55)',
            background: on ? (i === 2 ? C.coral : C.cream) : 'transparent', boxShadow: on ? '0 10px 30px rgba(0,6,14,.35)' : 'inset 0 0 0 3px rgba(250,248,242,.25)', letterSpacing: '-0.02em', transform: `scale(${i === active ? mix(1.06, 1, E(lin(t, [19.1, 19.9, 20.4][i], [19.1, 19.9, 20.4][i] + 0.35))) : 1})`}}>{w}</span>
        </React.Fragment>
      );
    })}
  </div>
);
const PlugSteps: React.FC<{t: number}> = ({t}) => {
  if (t < TL.plug || t > TL.close + 0.3) return null;
  const o = win(t, TL.plug + 0.05, TL.plug + 0.4, TL.close - 0.15, TL.close + 0.15);
  const active = t < 19.9 ? 0 : t < 20.4 ? 1 : 2;
  const sub = t < TL.page ? 'Eklentiler’de “evlek” ara' : t < TL.bound ? 'Eklentiyi kur' : t < TL.newChat ? 'Bağlı. Sohbette dene.' : 'Sor, Evlek göstersin.';
  const sk = E(lin(t, Math.max(TL.plug + 0.1, [TL.plug, TL.page, TL.bound, TL.newChat].filter((x) => x <= t).pop()!), Math.max(TL.plug + 0.1, [TL.plug, TL.page, TL.bound, TL.newChat].filter((x) => x <= t).pop()!) + 0.35));
  return (
    <>
      <Steps t={t} y={60} active={active} o={o} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 172, textAlign: 'center', fontFamily: F, fontSize: 56, fontWeight: 600, color: C.cream, letterSpacing: '-0.02em', opacity: o * sk, transform: `translateY(${(1 - sk) * 12}px)`, textShadow: SHADOW}}>{sub}</div>
    </>
  );
};

// ---------------- kapanış ----------------
const Closing: React.FC<{t: number}> = ({t}) => {
  if (t < TL.close) return null;
  const t0 = TL.close + 0.1;
  const out = EIN(lin(t, TL.loop, TL.loop + 0.22));
  const lg = E(lin(t, t0, t0 + 0.55));
  const lh = 150;
  const draw = E(lin(t, t0 + 0.55, t0 + 0.95));
  const cta = E(lin(t, t0 + 0.35, t0 + 0.75));
  const st = E(lin(t, t0 + 0.5, t0 + 0.9));
  const act = t < 25.45 ? 0 : t < 25.8 ? 1 : 2;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 236, display: 'flex', justifyContent: 'center', opacity: lg, transform: `translateY(${(1 - lg) * 26}px)`, filter: lg < 1 ? `blur(${(1 - lg) * 8}px)` : undefined}}>
        <Logo h={lh} />
      </div>
      <Words text="artık ChatGPT’de." t={t} t0={t0 + 0.2} size={92} weight={600} stagger={0.07} align="center" style={{position: 'absolute', left: 0, right: 0, top: 440}} />
      <div style={{position: 'absolute', left: 540 - 70, top: 586, height: 6, width: 140 * draw, borderRadius: 3, background: C.coral}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: F, fontSize: 58, fontWeight: 500, lineHeight: 1.22, color: C.cream, letterSpacing: '-0.02em', opacity: cta, transform: `translateY(${(1 - cta) * 16}px)`}}>
        ChatGPT’de <b style={{fontWeight: 700}}>Eklentiler</b>’den<br />Evlek’i ekleyin.
      </div>
      <Steps t={t} y={846} active={act} o={st} />
      <div style={{position: 'absolute', left: 110, right: 110, top: 1016, textAlign: 'center', fontFamily: F, fontSize: 28, lineHeight: '38px', color: 'rgba(250,248,242,.72)', opacity: E(lin(t, t0 + 0.8, t0 + 1.2))}}>
        Arayüz temsilidir; ilanlar ve fiyatlar Evlek’in gerçek verisidir. ChatGPT, OpenAI’ın ticari markasıdır.
      </div>
    </div>
  );
};

// ---------------- döngü: son 0,4 sn ilk kareye bağlanır ----------------
const LoopIn: React.FC<{t: number}> = ({t}) => {
  if (t < TL.loop) return null;
  const k = Easing.bezier(0.3, 0, 0.2, 1)(lin(t, TL.loop, 29.985));
  return <AbsoluteFill style={{opacity: k}}><PoolBG t={0} t0={0} /></AbsoluteFill>;
};

// ---------------- master ----------------
export const V10: React.FC = () => {
  const ok = useFontsV10();
  const f = useCurrentFrame();
  const t = f / FPS;
  if (!ok) return <AbsoluteFill style={{background: C.navy}} />;
  const pose = kick(t, poseAt(t));
  const hookScreen = t < TL.hookEnd || t >= TL.loop + 0.05;
  const inPortal = t >= TL.portal[0] && t < TL.portal[1];
  return (
    <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
      <Background t={t} />
      <LoopIn t={t} />
      <Phone pose={pose} dark>
        <Screen t={t} forceHook={hookScreen} />
      </Phone>
      {inPortal && <Portal t={t} />}
      <Hook t={t >= TL.loop ? 0 : t} o={t >= TL.loop ? E(lin(t, TL.loop + 0.1, 29.985)) : 1} />
      <Question t={t} q={QTEXT.q1} type={TL.q1Type} fly={TL.q1Fly} pose={pose} chip />
      <Question t={t} q={QTEXT.q2} type={TL.q2Type} fly={TL.q2Fly} pose={pose} />
      <Question t={t} q={QTEXT.q3} type={TL.q3Type} fly={TL.q3Fly} pose={pose} />
      <Band t={t} a={3.12} b={4.45} text="Sor. Evlek göstersin." />
      <Band t={t} a={5.8} b={7.2} text="8 ilan, ucuzdan pahalıya." />
      <Band t={t} a={13.8} b={14.42} text="İki ilan, yan yana." />
      <Band t={t} a={17.5} b={18.85} text="Aynı ilan, evlek.app’te." />
      <PropTag t={t} />
      <RoomTag t={t} />
      <Proof t={t} />
      <PlugSteps t={t} />
      <CornerLogo t={t} />
      <Closing t={t} />
    </AbsoluteFill>
  );
};
