// VIDEO-1 v13 · "Evlek artık ChatGPT'de" · 30 sn, 1080×1920, 60 fps.
// Rumi'nin v12 geri bildirimi + kurgu masası (docs/v13/KURUL-v13.md, seçenek A′) + 15 Kas kararları:
// GİRİŞ: dikkat habere (logo + "artık ChatGPT'de."), logo yazım kutusundaki Evlek çipine iner.
// GELİŞME: soru yazılır → gönder → Evlek arar → gerçek Lapta sonucu → kart → gerçek ilan → ev (ilanın kendi
//   çerçevesinden büyür ve geri döner) → galeri → "Emlakçıya sor". Dışarıdan açıklamasız gelen görsel yok.
// SONUÇ: "Eklentiler'den ekle." · ≡ → Eklentiler → evlek → Evlek → Eklentiyi kur → Bağlı → Sohbette dene →
//   çip logoya döner → "artık ChatGPT'de." Son kare ilk kare.
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS, H, Logo, LOGO_AR, W, lin, mix, useFontsV10} from '../v10/core';
import {OX, OY, P, PH, PW, Phone, Pose, mixPose, projectOut} from '../v12/Phone';
import {CHIP_WORD, HERO_D, Screen} from './Screen';
import {TL} from './tl';

const img = (p: string) => staticFile(p);
const SOFT = Easing.bezier(0.25, 0.1, 0, 1);
const FLY = Easing.bezier(0.45, 0, 0.15, 1);
const IOE = Easing.bezier(0.45, 0, 0.55, 1);
const RAMP = Easing.bezier(0.4, 0, 0.2, 1);
const L_ = Easing.linear;

// ---------------- pozlar ----------------
const COVER = P(540, 1330, 0.45, 2, -4, -1); // kapak: telefon altta, karartılmış
const COMP = P(540, 524, 0.9, 2, -4, -1); // yazım kutusu yakın planı (kutu çıktıda y≈1500)
const PR = P(540, 1698, 0.8, 2, -4, -1); // soru + sonuç; kart şeridi önce kadraj dışında
const PT = P(540, 1255, 0.78, 2, -4, -1); // ilan detayı: üst %60 sıkı kadraj
const PF = P(540, 1000, 0.58, 2, -4, -1); // ilanın tamamı + "Emlakçıya sor"
const CHAT = P(540, 1080, 0.55, 2, -4, -1);
const PBTN = P(540, 1140, 0.6, 2, -4, -1);
const dr = (p: Pose, k = 1.01, dy = -4): Pose => ({...p, s: p.s * k, y: p.y + dy});

type Key = {t: number; p: Pose; e?: (x: number) => number; cut?: boolean};
const K = (t: number, p: Pose, e: (x: number) => number = SOFT, cut = false): Key => ({t, p, e, cut});
const KEYS: Key[] = [
  K(0, COVER), K(TL.push[0], COVER, L_),
  K(TL.push[1], COMP, IOE), K(TL.rise[0], dr(COMP, 1.015, -6), L_),
  K(TL.rise[1], PR, IOE), K(TL.expand[0], dr(PR, 1.012, -6), L_),
  K(TL.expand[1], PT, IOE), K(TL.pull[0], PT, L_), // portal sırasında kamera sabit: dönüşte köşeler birebir
  K(TL.pull[1], PF, IOE), K(TL.cut, dr(PF, 1.006, -3), L_),
  K(TL.cut, CHAT, L_, true), K(TL.pushBtn[0], dr(CHAT, 1.006, -3), L_),
  K(TL.pushBtn[1], PBTN, IOE), K(TL.back[0], dr(PBTN, 1.008, -4), L_),
  K(TL.back[1], COVER, FLY), K(30, COVER, L_),
];
const poseAt = (t: number): Pose => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  if (!b || b.cut) return a.p;
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
/** kapakta telefon %45 karartılmış; imza hareketiyle aydınlanır, kapanışta yeniden kararır */
const dimAt = (t: number) => (t < TL.sig[1] ? 0.3 * (1 - RAMP(lin(t, TL.sig[0], TL.sig[1]))) : t >= TL.back[0] ? 0.3 * RAMP(lin(t, TL.back[0], TL.back[1])) : 0);

// ---------------- zemin ----------------
const NAVY_BG = 'radial-gradient(ellipse 95% 62% at 50% 38%, #163E68 0%, #0A2540 58%, #061A2E 100%)';
const POOL = 'v4/EVL-100102_00.jpg'; // 1600×1200 özgün
/** ev bulunduktan sonra (ilan açılınca) zemin, ilanın kendi fotoğrafının bulanığına döner */
const poolBg = (t: number) => (t >= TL.expand[0] && t < TL.cut ? RAMP(lin(t, TL.expand[0], TL.expand[1])) : 0);
const Background: React.FC<{t: number}> = ({t}) => {
  const o = poolBg(t);
  return (
    <AbsoluteFill style={{background: NAVY_BG}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 34% at 50% 72%, rgba(140,185,255,.16) 0%, rgba(140,185,255,0) 70%)'}} />
      {o > 0 && (
        <AbsoluteFill style={{opacity: o, overflow: 'hidden'}}>
          <Img src={img(POOL)} style={{position: 'absolute', left: -560, top: -60, width: 2720, height: 2040, filter: 'blur(30px) brightness(.72) saturate(1.05)'}} />
          <AbsoluteFill style={{background: C.navy, opacity: 0.5, mixBlendMode: 'multiply'}} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------- portal: ilanın kahraman fotoğrafı ↔ büyük çerçeve ----------------
type Rect = {x: number; y: number; w: number; h: number};
const mixR = (a: Rect, b: Rect, k: number): Rect => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k)});
const FRAME: Rect = {x: 0, y: 380, w: 1080, h: 1300}; // 1,083× (özgün 1600 px'e yakın: yumuşama yok)
const IMG_W = 1600 * (1300 / 1200);
const imgLeft = (t: number) => mix(-0.25 * (IMG_W - 1080), -0.36 * (IMG_W - 1080), Easing.bezier(0.33, 0, 0.67, 1)(lin(t, TL.portalOut[1], TL.portalIn[0])));
const GRADE = 'brightness(1.0) contrast(1.05) sepia(.06) hue-rotate(-3deg)';
const gradeMix = (g: string, k: number) => g.replace(/(brightness|contrast|saturate|sepia|hue-rotate)\(([-\d.]+)(deg)?\)/g, (_m, f, v, u) => {
  const base = f === 'sepia' || f === 'hue-rotate' ? 0 : 1;
  return `${f}(${(base + (Number(v) - base) * k).toFixed(4)}${u ?? ''})`;
});
const portalK = (t: number) => {
  if (t >= TL.portalOut[0] && t < TL.portalOut[1]) return FLY(lin(t, TL.portalOut[0], TL.portalOut[1]));
  if (t >= TL.portalOut[1] && t < TL.portalIn[0]) return 1;
  if (t >= TL.portalIn[0] && t < TL.portalIn[1]) return 1 - FLY(lin(t, TL.portalIn[0], TL.portalIn[1]));
  return 0;
};
const Portal: React.FC<{t: number}> = ({t}) => {
  if (t < TL.portalOut[0] || t >= TL.portalIn[1]) return null;
  const k = portalK(t);
  const p0 = poseK(TL.portalOut[0]);
  const s = p0.s;
  const cropHero: Rect = {x: s * (OX + HERO_D.x - PW / 2), y: s * (OY + HERO_D.y - PH / 2), w: s * HERO_D.w, h: s * HERO_D.h};
  const cropFull: Rect = {x: FRAME.x - p0.x, y: FRAME.y - p0.y, w: FRAME.w, h: FRAME.h};
  const cr = mixR(cropHero, cropFull, k);
  const ir = mixR({x: 0, y: 0, w: HERO_D.w * s, h: HERO_D.h * s}, {x: imgLeft(t) - FRAME.x, y: 0, w: IMG_W, h: FRAME.h}, k);
  const lift = Math.sin(Math.PI * Math.min(1, k));
  return (
    <>
      <AbsoluteFill style={{background: 'rgba(6,26,46,.78)', opacity: k}} />
      <div style={{position: 'absolute', inset: 0, perspective: 3200, perspectiveOrigin: `${p0.x}px ${p0.y}px`}}>
        <div style={{position: 'absolute', left: p0.x, top: p0.y, width: 0, height: 0, transformStyle: 'preserve-3d',
          transform: `rotateX(${p0.rx * (1 - k)}deg) rotateY(${p0.ry * (1 - k)}deg) rotateZ(${p0.rz * (1 - k)}deg) translateZ(${s * (1 - k) + 20 * lift}px)`}}>
          <div style={{position: 'absolute', left: cr.x, top: cr.y, width: cr.w, height: cr.h, overflow: 'hidden', borderRadius: mix(0, 28, k), boxShadow: `0 ${30 * k}px ${120 * k}px rgba(0,6,14,${0.55 * k})`}}>
            <Img src={img(POOL)} style={{position: 'absolute', left: ir.x, top: ir.y, width: ir.w, height: ir.h, filter: k > 0 ? gradeMix(GRADE, k) : undefined}} />
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------- dış metin ----------------
const Txt: React.FC<{o: number; y: number; size: number; weight?: number; lh?: number; children: React.ReactNode; num?: boolean; dy?: number}> = ({o, y, size, weight = 700, lh = 1.1, children, num, dy = 0}) =>
  o <= 0 ? null : (
    <div style={{position: 'absolute', left: 76, right: 76, top: y + (1 - o) * 14 + dy, textAlign: 'center', opacity: o, fontFamily: F, fontSize: size, fontWeight: weight, color: C.cream,
      letterSpacing: num ? '-0.04em' : '-0.03em', lineHeight: lh, fontVariantNumeric: num ? 'tabular-nums' : undefined}}>{children}</div>
  );
const fade4 = (t: number, [a, b, c, d]: number[]) => Easing.bezier(0.25, 0.1, 0.25, 1)(lin(t, a, b)) * (1 - lin(t, c, d));
/** başlık + imleç; n: görünen karakter sayısı (yerleşim sabit: kalan harfler görünmez) */
const TITLE = 'artık ChatGPT’de.';
const Title: React.FC<{t: number; n: number; o: number; dy?: number}> = ({t, n, o, dy = 0}) => {
  if (o <= 0) return null;
  const on = (t % 1) < 0.5;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 440 + dy, textAlign: 'center', opacity: o, fontFamily: F, fontSize: 92, fontWeight: 700, color: C.cream, letterSpacing: '-0.03em', lineHeight: 1.1, whiteSpace: 'nowrap'}}>
      <span>{TITLE.slice(0, n)}</span>
      <span style={{position: 'relative', display: 'inline-block', width: 0}}><span style={{position: 'absolute', left: 6, top: 8, width: 7, height: 86, borderRadius: 2, background: C.cream, opacity: on ? 1 : 0}} /></span>
      <span style={{opacity: 0}}>{TITLE.slice(n)}</span>
    </div>
  );
};
const STEPS: [string, number][] = [['ChatGPT', TL.cut], ['Eklentiler', TL.plug], ['Evlek', TL.row], ['Ekle', TL.install]];
const PathBlock: React.FC<{t: number}> = ({t}) => {
  const o = fade4(t, TL.path);
  if (o <= 0) return null;
  let act = 0;
  STEPS.forEach(([, at], i) => { if (t >= at) act = i; });
  const done = t >= TL.bound;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 128 + (1 - o) * 14, opacity: o, fontFamily: F, color: C.cream, textAlign: 'center'}}>
      <div style={{fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1}}>Eklentiler’den ekle.</div>
      <div style={{marginTop: 18, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16, fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em'}}>
        {STEPS.map(([s], i) => {
          const on = i === act;
          return (
            <React.Fragment key={s}>
              {i > 0 && <span style={{opacity: 0.4}}>›</span>}
              <span style={{position: 'relative', opacity: on ? 1 : i < act ? 0.72 : 0.45}}>
                {s}{on && done ? ' ✓' : ''}
                {on && <span style={{position: 'absolute', left: 0, right: 0, bottom: -12, height: 4, borderRadius: 2, background: C.coral}} />}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ---------------- logo ve imza (logo ↔ yazım kutusundaki Evlek çipi) ----------------
const LOGO_C = {x: 540, y: 300, h: 200};
const LogoAt: React.FC<{x: number; y: number; h: number; o?: number}> = ({x, y, h, o = 1}) => (
  <div style={{position: 'absolute', left: x - (h * LOGO_AR) / 2, top: y - h / 2, opacity: o}}><Logo h={h} /></div>
);
const LogoLayer: React.FC<{t: number}> = ({t}) => {
  if (t < TL.sig[0] || t >= TL.back[1]) return <LogoAt {...LOGO_C} />;
  if (t < TL.sig[1]) {
    const k = IOE(lin(t, TL.sig[0], TL.sig[1]));
    const p = poseK(t);
    const c = projectOut(p, CHIP_WORD.x, CHIP_WORD.y);
    const arc = -160 * Math.sin(Math.PI * k);
    return <LogoAt x={mix(LOGO_C.x, c.x, k)} y={mix(LOGO_C.y, c.y, k) + arc} h={mix(LOGO_C.h, CHIP_WORD.h * p.s, k)} o={1 - lin(t, TL.sig[1] - 0.06, TL.sig[1])} />;
  }
  if (t >= TL.back[0]) {
    const k = 1 - FLY(lin(t, TL.back[0], TL.back[1]));
    const p = poseK(t);
    const c = projectOut(p, CHIP_WORD.x, CHIP_WORD.y);
    const arc = -160 * Math.sin(Math.PI * k);
    return <LogoAt x={mix(LOGO_C.x, c.x, k)} y={mix(LOGO_C.y, c.y, k) + arc} h={mix(LOGO_C.h, CHIP_WORD.h * p.s, k)} o={lin(t, TL.back[0], TL.back[0] + 0.06)} />;
  }
  return null;
};

// ---------------- master ----------------
export const V13: React.FC = () => {
  const ok = useFontsV10();
  const t = useCurrentFrame() / FPS;
  if (!ok) return <AbsoluteFill style={{background: C.navy}} />;
  const pose = poseK(t);
  const dim = dimAt(t);
  // başlık: 0–2,3 sabit; 2,3–2,8 kamera iterken yukarı çıkıp söner; 26,15–27,1 harf harf yeniden yazılır
  const tOut = lin(t, TL.push[0], TL.push[1]);
  const titleO = t < TL.push[1] ? 1 - tOut : t >= TL.title2[0] ? 1 : 0;
  const titleN = t >= TL.title2[0] ? Math.round(TITLE.length * lin(t, TL.title2[0], TL.title2[1])) : TITLE.length;
  return (
    <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
      <Background t={t} />
      <Phone pose={pose} onPhoto={0}>
        <Screen t={t} />
        {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})`}} />}
      </Phone>
      <Portal t={t} />
      {/* GİRİŞ ve kapanış: haber */}
      <Title t={t} n={titleN} o={titleO} dy={-140 * IOE(tOut) * (t < TL.push[1] ? 1 : 0)} />
      {/* GELİŞME */}
      <Txt o={fade4(t, TL.slogan)} y={480} size={72}>Sor. Evlek göstersin.</Txt>
      <Txt o={fade4(t, TL.tag)} y={150} size={96} weight={800} lh={1} num>£139.000</Txt>
      <Txt o={fade4(t, [TL.tag[0] + 0.1, TL.tag[1] + 0.1, TL.tag[2], TL.tag[3]])} y={262} size={52} weight={600}>Lapta · 2+1 · 107 m²</Txt>
      {/* SONUÇ */}
      <PathBlock t={t} />
      {(() => {
        const o = fade4(t, TL.foot);
        return o > 0 ? (
          <div style={{position: 'absolute', left: 90, right: 90, top: 572, textAlign: 'center', fontFamily: F, fontSize: 30, fontWeight: 500, lineHeight: '40px', color: 'rgba(250,248,242,.86)', opacity: o}}>
            ChatGPT arayüzü temsilîdir; Evlek ekranları ve ilan verileri gerçektir. ChatGPT, OpenAI’ın ticari markasıdır.
          </div>
        ) : null;
      })()}
      <LogoLayer t={t} />
    </AbsoluteFill>
  );
};
void W; void H;
