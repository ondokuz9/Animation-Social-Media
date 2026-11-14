// VIDEO-1 v12 (final) · "Evlek artık ChatGPT'de" · 30 sn, 1080×1920, 60 fps, sessiz.
// Kurul (docs/v10/KURUL-v10.md) kararları: üç perde SOR → GÖR → EKLE; kanca = logo + "artık ChatGPT'de.";
// imza hareketi: logo yazım kutusundaki Evlek çipine iner, kapanışta geri kalkar; döngü dikişsiz.
// Dış metin: 10 blok; yalnız opaklıkla giriş/çıkış. Kamera hareketi ≥650 ms, ardından duruş. ry hep negatif.
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS, H, Logo, W, lin, mix, useFontsV10} from '../v10/core';
import {OX, OY, P, PH, PW, Phone, Pose, mixPose, screenToOut} from '../v10/Phone';
import {CHIP, INSTALL_BTN, QTEXT, Screen, galSwiped, heroCardRect} from './Screen';
import {TL} from './tl';

const img = (p: string) => staticFile(p);
const SOFT = Easing.bezier(0.25, 0.1, 0, 1); // kurul: bütün kamera hareketleri
const FLY = Easing.bezier(0.45, 0, 0.15, 1); // portal, imza hareketi
const ENTER = Easing.bezier(0.22, 1, 0.36, 1);
const fade = (t: number, a: number, b: number, d = 0.25, din = 0.25) => lin(t, a, a + din) * (1 - lin(t, b, b + d));

// ---------------- telefon pozları ----------------
const HOOK = P(540, 1330, 0.42, 3, -4, -1);
const HOOK0 = {...HOOK, y: HOOK.y + 40}; // ilk kare: 0–0,5 arasında 40 px yükselir
const CHAT = P(540, 1050, 0.55, 2, -4, -1);
type Key = {t: number; p: Pose; e?: (x: number) => number; cut?: boolean};
const K = (t: number, p: Pose, e: (x: number) => number = SOFT, cut = false): Key => ({t, p, e, cut});
const L_ = Easing.linear;
const btnPose = (s: number): Pose => P(540, 1640 - s * (OY + INSTALL_BTN.y - PH / 2), s, 2, -4, -1);
const KEYS: Key[] = [
  K(0, HOOK0),
  K(0.5, HOOK),
  K(2.5, {...HOOK, y: HOOK.y - 4}, L_),
  K(3.5, CHAT), // 1000 ms itme
  K(10.0, {...CHAT, y: CHAT.y - 6, s: CHAT.s * 1.008}, L_),
  K(10.75, {...CHAT, y: CHAT.y - 6, s: CHAT.s * 1.008}, L_),
  K(11.4, P(540, 2520, 0.4, 2, -4, -1), FLY), // portal: telefon kadrajın altından çıkar
  K(14.5, P(860, 2500, 0.42, 3, -8, -2), L_, true),
  K(15.2, P(800, 1440, 0.42, 3, -8, -2), ENTER), // ürün planı, alttan giriş
  K(17.0, P(796, 1432, 0.424, 3, -8, -2), L_),
  K(17.8, CHAT), // 800 ms dönüş
  K(18.6, CHAT, L_),
  K(19.3, P(540, 1060, 0.6, 2, -4, -1)), // karşılaştırma kartına 1,1× itme
  K(20.5, P(540, 1058, 0.602, 2, -4, -1), L_),
  K(21.3, CHAT), // eklentiler: geri çekilme
  K(23.0, {...CHAT, y: CHAT.y - 4}, L_),
  K(23.7, btnPose(0.58)), // "Eklentiyi kur" düğmesine itme
  K(24.5, btnPose(0.582), L_),
  K(25.0, P(540, 1012, 0.615, 2, -4, -1)), // Bağlı ✓ anı: 1,06× push-in
  K(26.0, P(540, 1010, 0.616, 2, -4, -1), L_),
  K(26.6, HOOK, FLY), // imza hareketinin tersi ile kanca pozuna dönüş
  K(29.5, HOOK, L_),
  K(30.0, HOOK0, Easing.bezier(0.45, 0, 0.55, 1)), // döngü: ilk kareye birebir
];
const poseAt = (t: number): Pose => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  if (!b || b.cut) return a.p;
  return mixPose(a.p, b.p, (b.e ?? SOFT)(lin(t, a.t, b.t)));
};
// yalnız üç fiziksel tepki: gönder, £139.000 seçimi, Eklentiyi kur
const kick = (t: number, p: Pose): Pose => {
  let b = 0;
  for (const at of [TL.send, TL.tap, TL.installTap]) {
    const k = lin(t, at, at + 0.18);
    if (k > 0 && k < 1) b = Math.max(b, Math.sin(Math.PI * k));
  }
  return {...p, s: p.s * (1 - 0.004 * b), y: p.y + 3 * b};
};
const poseK = (t: number) => kick(t, poseAt(t));

// ---------------- zemin ----------------
const GRADE_EXT = 'brightness(1.02) contrast(1.04) saturate(.96) sepia(.07) hue-rotate(-3deg)';
const GRADE_INT = 'brightness(1.04) contrast(1.05) sepia(.04)';
const VIG = 'radial-gradient(ellipse 80% 62% at 50% 52%, transparent 58%, rgba(5,16,28,.35))';
const POOL = 'v4/EVL-100102_00.jpg';
/** bulanık havuz + %70 lacivert (kurul: tek dünya) — u=0 bulanık, u=1 net */
const Pool: React.FC<{u: number; t: number}> = ({u, t}) => {
  const pan = lin(t, TL.portal[1], 14.5);
  const px = u > 0 ? mix(30, 52, pan) : 30;
  const z = u > 0 ? mix(1, 1.04, pan) : 1.1;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.navy}}>
      <Img src={img(POOL)} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', objectPosition: `${px}% 55%`, transform: `scale(${mix(1.1, z, u)})`,
        filter: u >= 1 ? GRADE_EXT : `blur(${24 * (1 - u)}px) brightness(${mix(0.58, 1.02, u)})${u > 0 ? ` contrast(${mix(1, 1.04, u)}) sepia(${0.07 * u})` : ''}`}} />
      <AbsoluteFill style={{background: C.navy, opacity: 0.6 * (1 - u), mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: VIG, opacity: u}} />
    </AbsoluteFill>
  );
};
const Interior: React.FC<{t: number}> = ({t}) => {
  // EVL-100102_01 (1200×1600): 1,1× fazladan ölçek, 160 px tilt-up (masadan çift yükseklikteki cama)
  const k = Easing.bezier(0.33, 0, 0.2, 1)(lin(t, TL.tilt[0], TL.tilt[1]));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.navy}}>
      <Img src={img('v4/EVL-100102_01.jpg')} style={{position: 'absolute', width: 1584, height: 2112, left: -252, top: mix(-192, -32, k), filter: GRADE_INT}} />
      <AbsoluteFill style={{background: VIG}} />
    </AbsoluteFill>
  );
};
const Background: React.FC<{t: number}> = ({t}) => {
  const unblur = Easing.bezier(0.4, 0, 0.2, 1)(lin(t, TL.unblur[0], TL.unblur[1]));
  const clear = t >= TL.unblur[0] && t < TL.back[0] + 0.6 ? (t < TL.back[0] ? unblur : 1) : 0;
  const intO = t >= TL.swipe[0] ? Easing.bezier(0.4, 0, 0.2, 1)(lin(t, TL.swipe[0] + 0.12, TL.swipe[0] + 0.42)) : 0;
  const backK = Easing.bezier(0.4, 0, 0.2, 1)(lin(t, TL.back[0], TL.back[0] + 0.6));
  return (
    <>
      <Pool u={0} t={t} />
      {clear > 0 && <AbsoluteFill style={{opacity: t < TL.back[0] ? 1 : 1 - backK}}><Pool u={clear} t={t} /></AbsoluteFill>}
      {intO > 0 && t < TL.back[0] + 0.6 && <AbsoluteFill style={{opacity: intO * (t < TL.back[0] ? 1 : 1 - backK)}}><Interior t={t} /></AbsoluteFill>}
    </>
  );
};

// ---------------- dış metin ----------------
const Txt: React.FC<{o: number; y: number; size: number; weight?: number; children: React.ReactNode; shadow?: boolean}> = ({o, y, size, weight = 700, children, shadow}) =>
  o <= 0 ? null : (
    <div style={{position: 'absolute', left: 76, right: 76, top: y, textAlign: 'center', opacity: o, fontFamily: F, fontSize: size, fontWeight: weight, color: C.cream, letterSpacing: '-0.03em', lineHeight: 1.1,
      textShadow: shadow ? '0 2px 24px rgba(0,8,18,.45)' : undefined}}>{children}</div>
  );
/** kelime kelime: 170 ms aralık, 350 ms giriş, bulanıklık yok */
const WordsIn: React.FC<{lines: string[]; t: number; t0: number}> = ({lines, t, t0}) => {
  let wi = 0;
  return (
    <>
      {lines.map((ln, li) => (
        <div key={li}>
          {ln.split(' ').map((w, j) => {
            const k = SOFT(lin(t, t0 + wi * 0.17, t0 + wi++ * 0.17 + 0.35));
            return <span key={j} style={{display: 'inline-block', marginRight: '0.24em', opacity: k, transform: `translateY(${(1 - k) * 14}px)`}}>{w}</span>;
          })}
        </div>
      ))}
    </>
  );
};

// ---------------- imza: logo ↔ yazım kutusundaki çip ----------------
const LOGO_C = {x: 540, y: 305, h: 150};
const Signature: React.FC<{t: number}> = ({t}) => {
  let k = 0, o = 1, p: Pose;
  if (t < TL.logoDrop[1]) { k = FLY(lin(t, TL.logoDrop[0], TL.logoDrop[1])); p = poseK(TL.logoDrop[1]); o = 1 - lin(t, TL.logoDrop[1] - 0.08, TL.logoDrop[1]); }
  else if (t >= TL.chipLift[0]) { k = 1 - FLY(lin(t, TL.chipLift[0], TL.chipLift[1])); p = poseK(t); o = lin(t, TL.chipLift[0], TL.chipLift[0] + 0.06); }
  else return null;
  const c = screenToOut(p, CHIP.x, CHIP.y);
  const h = mix(LOGO_C.h, CHIP.h * p.s, k);
  const x = mix(LOGO_C.x, c.x, k), y = mix(LOGO_C.y, c.y, k);
  return (
    <div style={{position: 'absolute', left: x - (h * 530) / 165 / 2, top: y - h / 2, opacity: o}}>
      <Logo h={h} />
    </div>
  );
};

// ---------------- portal: kart telefonun 3D düzleminden kalkar ----------------
const Portal: React.FC<{t: number}> = ({t}) => {
  const [a, b] = TL.portal;
  if (t < a || t >= b) return null;
  const p0 = poseK(a);
  const r = heroCardRect(a);
  const k = FLY(lin(t, a, b));
  const lift = Math.sin(Math.PI * k);
  const x = mix(p0.s * (OX + r.x - PW / 2), -p0.x, k);
  const y = mix(p0.s * (OY + r.y - PH / 2), -p0.y, k);
  const w = mix(p0.s * r.w, W, k), h = mix(p0.s * r.h, H, k);
  const ph = mix(p0.s * r.ph, H, k);
  const info = 1 - lin(t, a, a + 0.3);
  return (
    <div style={{position: 'absolute', inset: 0, perspective: 3200, perspectiveOrigin: `${p0.x}px ${p0.y}px`}}>
      <div style={{position: 'absolute', left: p0.x, top: p0.y, width: 0, height: 0, transformStyle: 'preserve-3d',
        transform: `rotateX(${p0.rx * (1 - k)}deg) rotateY(${p0.ry * (1 - k) - 3 * lift}deg) rotateZ(${p0.rz * (1 - k)}deg) translateZ(${30 * lift}px)`}}>
        <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: mix(40 * p0.s, 0, k), overflow: 'hidden', background: '#1C2027',
          boxShadow: `0 ${50 * lift}px ${120 * lift}px rgba(0,6,14,${0.55 * lift})`}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: w, height: ph, overflow: 'hidden'}}>
            <Img src={img(POOL)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${mix(45, 30, k)}% ${mix(60, 55, k)}%`,
              filter: `brightness(${mix(1, 1.02, k)}) contrast(${mix(1, 1.04, k)}) saturate(${mix(1, 0.96, k)}) sepia(${0.07 * k}) hue-rotate(${-3 * k}deg)`}} />
          </div>
          {info > 0 && (
            <div style={{position: 'absolute', left: 0, top: ph, width: r.w, transform: `scale(${w / r.w})`, transformOrigin: '0 0', padding: '30px 34px 0', fontFamily: F, opacity: info}}>
              <div style={{fontSize: 80, fontWeight: 800, letterSpacing: '-0.04em', color: '#EEF0F3', lineHeight: 1}}>£139.000</div>
              <div style={{marginTop: 22, fontSize: 36, fontWeight: 500, color: '#CDD3DC'}}>2+1 · 2 banyo · 107 m²</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------- master ----------------
export const V12: React.FC = () => {
  const ok = useFontsV10();
  const f = useCurrentFrame();
  const t = f / FPS;
  if (!ok) return <AbsoluteFill style={{background: C.navy}} />;
  const pose = poseK(t);
  const hookTitle = t < TL.titleOut[1] ? 1 - lin(t, TL.titleOut[0], TL.titleOut[1]) : t >= TL.title2 ? lin(t, TL.title2, TL.title2 + 0.25) : 0;
  const logoStatic = t < TL.logoDrop[0] || t >= TL.chipLift[1];
  const inPortal = t >= TL.portal[0] && t < TL.portal[1];
  const showPhone = !(t >= TL.phoneOut[1] && t < TL.phoneIn[0]);
  return (
    <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
      <Background t={t} />
      {showPhone && (
        <Phone pose={pose} dark shadow={0.9}>
          <Screen t={t} />
        </Phone>
      )}
      {inPortal && <Portal t={t} />}
      {/* I · kanca ve kapanış: haber cümlesi (ilk ve son kare aynı) */}
      {logoStatic && <div style={{position: 'absolute', left: 0, right: 0, top: LOGO_C.y - LOGO_C.h / 2, display: 'flex', justifyContent: 'center'}}><Logo h={LOGO_C.h} /></div>}
      <Signature t={t} />
      <Txt o={hookTitle} y={400} size={92}>artık ChatGPT’de.</Txt>
      {/* soru: telefondaki yazımla eşzamanlı */}
      {t >= TL.qWords && t < TL.send + 0.3 && (
        <Txt o={1 - lin(t, TL.send, TL.send + 0.3)} y={118} size={72}><WordsIn lines={['Lapta’da deniz', 'manzaralı 2+1']} t={t} t0={TL.qWords} /></Txt>
      )}
      <Txt o={fade(t, TL.slogan[0], TL.slogan[1])} y={150} size={72}>Sor. Evlek göstersin.</Txt>
      {/* II · ev: iki satırlık künye */}
      <Txt o={fade(t, TL.tag[0], TL.tag[1], 0.3, 0.35)} y={250} size={96} weight={800} shadow>£139.000</Txt>
      <Txt o={fade(t, TL.tagSub, TL.tag[1], 0.3, 0.35)} y={370} size={52} weight={500} shadow>Lapta · 2+1 · 107 m²</Txt>
      <Txt o={fade(t, TL.diff[0], TL.diff[1] - 0.1)} y={128} size={80}>Arada £12.000 fark.</Txt>
      {/* III · ekle */}
      <Txt o={fade(t, TL.step1[0], TL.step1[1] - 0.15)} y={134} size={64} weight={600}>Eklentiler’de Evlek’i bul.</Txt>
      <Txt o={fade(t, TL.step2[0] + 0.1, TL.step2[1])} y={134} size={64} weight={600}>Eklentiyi kur.</Txt>
      {/* kapanış */}
      {(() => {
        const out = 1 - lin(t, TL.ctaOut[0], TL.ctaOut[1]);
        return (
          <>
            <Txt o={lin(t, TL.cta, TL.cta + 0.3) * out} y={548} size={60}>Eklentiler’den Evlek’i ekle.</Txt>
            <div style={{position: 'absolute', left: 120, right: 120, top: 664, textAlign: 'center', fontFamily: F, fontSize: 28, lineHeight: '38px', color: 'rgba(250,248,242,.72)', opacity: lin(t, TL.foot, TL.foot + 0.3) * out}}>
              Arayüz temsilidir; ilanlar ve fiyatlar Evlek’in gerçek verisidir. ChatGPT, OpenAI’ın ticari markasıdır.
            </div>
          </>
        );
      })()}
    </AbsoluteFill>
  );
};
