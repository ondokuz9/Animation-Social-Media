// Evlek — "YERİNE OTURDU" · 30.000s · 1800 frames · 1080×1920 · 60fps · v3
//
// v2 (85/100) → v3: the council's single final pass, all ten priority
// changes applied:
//   COPY   "AYNI EV. ÜÇ AYRI FİYAT." · "EVLEK'TE HER ŞEY YERİNDE." ·
//          "FİYAT TEK BAŞINA YETMEZ." · "BEŞ DİL. AYNI İLAN." ·
//          search line loses quotes/commas — reads as real user input
//   FLOW   price beat compressed to ~1.3s; the three rails close LEFT as one
//          physical pile at ~12.9s; alignment becomes a two-phase, visible
//          correction (straighten 13.7s → lift 16.0s); manifesto revealed by
//          the lift; fermata f1098–f1188; gold lands ~20.8s
//   MATTER separate material layers: cobalt fiber (~1.8%), white-card fiber
//          (~1%), asymmetric 6-anchor wave edge, fixed-seed ±2px wobble on
//          both cobalt lines (shared 16px token), gold gets a dark edge +
//          contact shadow, "BU." +8%
//   MISC   verdict rail spans x56–1024 with a 12% larger wordmark flush
//          right; tags ≥4° apart; "Hâlâ duruyor mu?" +8% and 24 frames of
//          clean reading before the tags; "3 sonuç" label cut; URL +18%;
//          manifesto masked during the loop lift (no content flash)

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Easing, interpolate } from 'remotion';
import { C, SANS, MONO } from '../../brand/tokens.js';
import { WORDMARK_PATHS, WORDMARK_VIEW_BOX } from './wordmark.js';

export const FILM30_FRAMES = 1800;

const COBALT = C.cobalt, NAVY = C.navy, GOLD = C.gold, CREAM = C.cream;
const PAPER_HI = '#FBF9F4';
const STROKE_W = 16;

const SETTLE = Easing.bezier(0.34, 1.28, 0.64, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
const prog = (f, f0, durF, easing = SETTLE) =>
  interpolate(f, [f0, f0 + durF], [0, 1], { ...clamp, easing });
const lin = (f, f0, durF) => interpolate(f, [f0, f0 + durF], [0, 1], clamp);
const pulse01 = (f, f0, durF) =>
  Math.sin(Math.PI * Math.min(1, Math.max(0, (f - f0) / durF)));

const usePut = (f, f0, durF, { dx = 0, dy = 0, rot = 0, tilt = -3, sh = 1 } = {}) => {
  const p = prog(f, f0, durF);
  const land = Math.min(1, Math.max(0, lin(f, f0, durF)));
  const vis = f >= f0 - 3;
  return {
    vis,
    style: {
      opacity: vis ? 1 : 0,
      transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${rot + (1 - p) * tilt}deg)`,
      boxShadow: `0 ${(3 + 9 * (1 - land)) * sh}px ${(6 + 16 * (1 - land)) * sh}px rgba(10,37,64,${0.09 + 0.08 * land})`,
    },
  };
};

const Strip = ({ put, x, y, w, h, bg = PAPER_HI, children, pad = '0 26px', edge, extra = {} }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h,
    background: bg, borderRadius: 8, display: 'flex', alignItems: 'center', padding: pad,
    borderLeft: edge ? '4px solid rgba(10,37,64,0.10)' : 'none',
    ...put.style, ...extra,
  }}>{children}</div>
);

/* big all-caps lines: −0.015em · small rail titles: +0.01em */
const T800 = (size, color = NAVY, extra = {}) => ({
  fontFamily: SANS, fontWeight: 800, fontSize: size, color,
  letterSpacing: '-0.015em', lineHeight: 1.08, whiteSpace: 'nowrap', ...extra,
});
const TRAIL = (size, color = NAVY, extra = {}) => ({
  fontFamily: SANS, fontWeight: 800, fontSize: size, color,
  letterSpacing: '0.01em', lineHeight: 1.12, whiteSpace: 'nowrap', ...extra,
});
const TMONO = (size, color = NAVY, extra = {}) => ({
  fontFamily: MONO, fontWeight: 500, fontSize: size, color, whiteSpace: 'nowrap', ...extra,
});

const Wordmark = ({ w, fill = NAVY, style }) => (
  <svg viewBox={WORDMARK_VIEW_BOX} width={w} style={style}>
    {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill={fill} />)}
  </svg>
);

const Lizard = ({ x, y, color = NAVY, o = 0.5, s = 1 }) => (
  <svg width={22 * s} height={14 * s} viewBox="0 0 22 14"
       style={{ position: 'absolute', left: x, top: y, opacity: o }}>
    <path d="M1 8 Q4 4 8 6 Q11 2 14 5 Q18 3 21 7 Q17 8 14 8 Q12 12 9 9 Q5 12 3 9 Z" fill={color} />
  </svg>
);

/* Hand-inked cobalt line: fixed-seed ±2px wobble, one 16px token, ~3° rise.
   Both the redaction strike and the approval underline are drawn with this. */
const InkLine = ({ x1, y1, x2, y2, p }) => {
  const J = [0, 1.6, -2, 1.2, -1.4, 2, -1, 0.8, 0];
  const pts = J.map((j, i) => {
    const t = i / (J.length - 1);
    return `${x1 + (x2 - x1) * t},${y1 + (y2 - y1) * t + j}`;
  });
  const len = Math.hypot(x2 - x1, y2 - y1) + 8;
  return (
    <polyline points={pts.join(' ')} fill="none"
              stroke={COBALT} strokeWidth={STROKE_W} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
  );
};

/* Flat placeholder imagery — the hero variant leans architectural: a deep
   window recess and an eave shadow instead of the decorative arch. */
const FlatPhoto = ({ w, h, amateur = false }) => (
  <svg width={w} height={h} viewBox="0 0 400 280" preserveAspectRatio="none"
       style={{ display: 'block', borderRadius: amateur ? 2 : 14 }}>
    <rect width="400" height="280" fill={amateur ? '#E9E4D8' : '#EFEAE0'} />
    {amateur && <rect y="196" width="400" height="84" fill="#CFC9BA" />}
    {!amateur && <rect y="224" width="400" height="18" fill="#3FA796" opacity="0.35" />}
    <g transform={amateur ? 'rotate(-2 200 150)' : ''}>
      <path d={amateur ? 'M96 220 l176 0 l26 26 l-176 0 z' : 'M84 212 l232 0 l34 34 l-232 0 z'} fill={NAVY} opacity={amateur ? 0.10 : 0.16} />
      {/* three offset architectural planes, not a symmetric house icon */}
      <rect x={amateur ? 96 : 84} y={amateur ? 108 : 84} width={amateur ? 176 : 148} height={amateur ? 112 : 128} fill="#FFFFFF" />
      {!amateur && <rect x="204" y="112" width="112" height="100" fill="#F6F3EC" />}
      {/* eave: a thin slab casting a hard shadow band */}
      <rect x={amateur ? 96 : 76} y={amateur ? 96 : 74} width={amateur ? 176 : 168} height={amateur ? 16 : 12} fill={NAVY} opacity="0.9" />
      {!amateur && <rect x="84" y="86" width="148" height="14" fill={NAVY} opacity="0.14" />}
      {/* deep window recess */}
      <rect x={amateur ? 128 : 112} y={amateur ? 136 : 122} width={amateur ? 34 : 44} height={amateur ? 46 : 62} fill={NAVY} opacity="0.88" />
      {!amateur && <rect x="112" y="122" width="12" height="62" fill={NAVY} opacity="0.5" />}
      {!amateur && <rect x="232" y="140" width="36" height="40" fill={NAVY} opacity="0.24" />}
      {amateur && <rect x="196" y="136" width="40" height="30" fill={NAVY} opacity="0.28" />}
      <path d={amateur ? 'M272 220 l14 -26 14 26 z' : 'M338 212 l15 -28 15 28 z'} fill="#5F6F45" opacity="0.75" />
    </g>
    {amateur && <rect width="400" height="280" fill="#B9AE93" opacity="0.16" />}
  </svg>
);

const CARD = { x: 164, y: 274, w: 752, h: 910 };
const NOTCH = { w: 132, h: 72, right: 48 };
const GOLDTAB = { w: 124, h: 64 };

export const Film30 = () => {
  const f = useCurrentFrame();

  /* ── v3 timeline ── */
  const F = {
    whats: 21,                                  // 24+ clean frames before tags
    tag1: 78, tag2: 106, tag3: 132, verdict: 158,
    strike: 216, strikeHit: 230,
    page: 273,
    hero: 369, heroTak: 411, heroLine: 421, heroLineOut: 468,
    search: 480, res1: 570, res2: 578,
    res1Off: 700, res2Off: 733,
    lang: 640, price: 690,
    railClose: 774,
    alignA: 820, alignATak: 900,                // straighten onto the axis
    alignB: 960, alignBTak: 1050,               // the 56px lift — last motion
    manifesto: 1000,
    fermataEnd: 1188,
    gold: 1191, goldTak: 1244,
    final: 1310, mark: 1408, markTak: 1450, under: 1456,
    liftPage: 1652, liftStack: 1658,
  };

  const whats = usePut(f, F.whats, 30, { dx: 220, rot: -2 });
  const tag1 = usePut(f, F.tag1, 27, { dy: -90, rot: 3.0, sh: 1.0 });
  const tag2 = usePut(f, F.tag2, 27, { dy: -80, rot: -2.6, sh: 1.25 });
  const tag3 = usePut(f, F.tag3, 24, { dy: -72, rot: 1.8, sh: 1.5 });
  const verdict = usePut(f, F.verdict, 39, { dy: -70 });

  const strikeP = prog(f, F.strike, 16, Easing.bezier(0.3, 0, 0.2, 1));  // 260ms
  const hitP = pulse01(f, F.strikeHit, 12);
  const pileHit = `translateY(${6 * hitP}px) scaleX(${1 + 0.015 * hitP})`;

  const pageP = prog(f, F.page, 78, Easing.bezier(0.5, 0, 0.15, 1));
  const pageY = 1920 - (1920 - 126) * pageP;
  const dip = 4 * pulse01(f, F.heroTak, 12);

  const hero = usePut(f, F.hero, 42, { dx: 72, dy: -220, tilt: 3 });
  const heroLine = usePut(f, F.heroLine, 30, { dy: -40 });
  const heroLineOut = prog(f, F.heroLineOut, 24);
  const search = usePut(f, F.search, 38, { dy: -70, rot: -0.6 });
  const res1P = prog(f, F.res1, 26);
  const res2P = prog(f, F.res2, 26);
  const res1Off = prog(f, F.res1Off, 27);
  const res2Off = prog(f, F.res2Off, 27);
  const lang = usePut(f, F.lang, 22, { dy: -64, rot: 0.5 });     // 360ms in
  const priceS = usePut(f, F.price, 22, { dy: -64, rot: -0.4 });

  /* rails close LEFT as one physical pile — the mid-film release */
  const closeP = prog(f, F.railClose, 28, Easing.bezier(0.5, 0, 0.2, 1));

  /* two-phase alignment: straighten, then the 56px lift that exposes the
     manifesto. Two distinct corrections by the same hand. */
  const alignA = prog(f, F.alignA, 80);
  const alignB = prog(f, F.alignB, 90);
  const heroRot = -1.8 * (1 - alignA);
  const heroMisX = 40 * (1 - alignA);
  const heroLift = -56 * alignB;

  const gold = usePut(f, F.gold, 53, { dy: -96 });
  const squash = f >= F.goldTak ? Math.max(0, 1 - (f - F.goldTak) / 6) : 0;

  const finalPage = usePut(f, F.final, 77, { dy: 480, rot: 0, tilt: -1.2 });
  const mark = usePut(f, F.mark, 44, { dy: -110 });
  const underP = prog(f, F.under, 36, Easing.bezier(0.3, 0, 0.2, 1));

  const liftPagP = prog(f, F.liftPage, 78, Easing.bezier(0.55, 0, 0.25, 1));
  const liftP = prog(f, F.liftStack, 78, Easing.bezier(0.55, 0, 0.25, 1));
  const liftPre = lin(f, F.liftPage - 3, 3);

  const takPulse = (atF) => 1 + Math.sin(Math.PI * Math.min(1, Math.max(0, lin(f, atF, 8)))) * 0.018;

  const rayX = 224, rayY = 178;

  return (
    <AbsoluteFill style={{ background: CREAM, overflow: 'hidden' }}>

      {/* ═ BASE — frame 0 ═ */}
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="tooth30"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.14  0 0 0 0 0.25  0 0 0 0.05 0" /></filter>
          <filter id="blotch30"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="11" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.14  0 0 0 0 0.25  0 0 0 0.028 0" /></filter>
          {/* monochrome fiber for the cobalt sheet (~1.8% multiply feel) */}
          <filter id="fiber30"><feTurbulence type="turbulence" baseFrequency="0.008 0.9" numOctaves="2" seed="21" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0.02  0 0 0 0 0.1  0 0 0 0.05 0" /></filter>
          <filter id="roughT"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="9" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" /></filter>
        </defs>
        <rect width="1080" height="1920" filter="url(#blotch30)" />
        <rect width="1080" height="1920" filter="url(#tooth30)" />
      </svg>

      <div style={{ position: 'absolute', left: 96, top: 316, ...T800(64) }}>
        {'KIBRIS’TA EV ARAMAK:'}
      </div>

      {/* the wall ad */}
      <div style={{
        position: 'absolute', left: 142, top: 460, width: 796, height: 650,
        background: PAPER_HI, borderRadius: 4, transform: `rotate(-0.8deg) ${pileHit}`,
        boxShadow: '0 8px 18px rgba(10,37,64,0.12)', padding: '30px 38px 0',
      }}>
        <div style={{ ...T800(122), letterSpacing: '0.01em', filter: 'url(#roughT)' }}>SATILIK</div>
        <div style={{ display: 'flex', gap: 26, marginTop: 16 }}>
          <div style={{ transform: 'rotate(1.2deg)', boxShadow: '0 4px 10px rgba(10,37,64,0.14)' }}>
            <FlatPhoto w={380} h={266} amateur />
          </div>
          <div style={{ ...T800(46), marginTop: 6, filter: 'url(#roughT)', whiteSpace: 'normal', lineHeight: 1.25 }}>
            0533<br />{'7•• ••'}<br />{'••'}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -46, display: 'flex', justifyContent: 'center', gap: 10 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              width: 92, height: 58, background: PAPER_HI, borderRadius: '0 0 6px 6px',
              transform: `rotate(${[1.5, -1, 2, -2, 0.5][i]}deg)`,
              boxShadow: '0 5px 10px rgba(10,37,64,0.10)', position: 'relative',
              borderTop: '2px dashed rgba(10,37,64,0.25)',
            }}>
              <div style={{ ...TMONO(20), opacity: 0.5, textAlign: 'center', marginTop: 14 }}>0533</div>
              {i === 2 && <Lizard x={30} y={36} o={0.4} s={0.8} />}
            </div>
          ))}
        </div>
      </div>

      {/* ═ THE STACK ═ */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-2780 * liftP}px)` }}>

        {/* loose pieces */}
        <div style={{ position: 'absolute', inset: 0, transform: pileHit }}>
          <Strip put={whats} x={414} y={876} w={492} h={84} pad="0 38px">
            <div style={T800(42)}>{'Hâlâ duruyor mu?'}</div>
          </Strip>
          <Strip put={tag1} x={568} y={576} w={264} h={66} bg="#FFFFFF">
            <div style={T800(38)}>{'£185.000'}</div>
          </Strip>
          <Strip put={tag2} x={492} y={640} w={318} h={66} bg="#FFFFFF">
            <div style={T800(38)}>{'₺9.850.000'}</div>
          </Strip>
          <Strip put={tag3} x={548} y={702} w={276} h={66} bg="#FFFFFF">
            <div style={T800(38)}>$220.000</div>
          </Strip>
          {f >= F.strike && (
            <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
              <InkLine x1={72} y1={796} x2={1010} y2={846} p={strikeP} />
            </svg>
          )}
        </div>

        {/* verdict rail: x56–1024, wordmark flush right */}
        <Strip put={verdict} x={56} y={296} w={968} h={100} pad="0 30px 0 34px"
               extra={{ justifyContent: 'space-between' }}>
          <div style={T800(52)}>{'AYNI EV. ÜÇ AYRI FİYAT.'}</div>
          <Wordmark w={132} style={{ opacity: 0.95, flexShrink: 0 }} />
        </Strip>

        {/* cobalt stage */}
        {f >= F.page && (
          <div style={{ position: 'absolute', left: 0, top: pageY, width: 1080, height: 2400 }}>
            <svg width="1080" height="2400" viewBox="0 0 1080 2400"
                 style={{ position: 'absolute', inset: 0, filter: `drop-shadow(0 -12px 32px rgba(10,37,64,${0.12 + liftPre * 0.06}))` }}>
              {/* 6 asymmetric anchors — a torn sheet, not a sine wave */}
              <path d={`M56 40 C 140 30, 236 54, 356 42 C 452 33, 540 ${58 + dip}, 648 ${38 + dip} C 742 ${22 + dip * 0.5}, 828 46, 918 32 C 962 26, 996 34, 1024 28 L1024 2400 L56 2400 Z`} fill={COBALT} />
              {/* cobalt fiber — one static material layer */}
              <rect x="56" y="20" width="968" height="2380" filter="url(#fiber30)" opacity="0.36" />
            </svg>

            <div style={{ position: 'absolute', left: 220, top: 560, ...T800(46, 'rgba(255,255,255,0.92)') }}>
              {'HER ŞEY AŞAĞI YUKARI.'}
            </div>

            {/* manifesto — revealed by the lift; masked during the loop lift */}
            <div style={{ position: 'absolute', left: 164, top: 1160, ...T800(52, 'rgba(255,255,255,0.95)'),
                          opacity: f >= F.manifesto && f < F.liftPage ? 1 : 0 }}>
              {'GÜRÜLTÜ GİDER. EV KALIR.'}
            </div>

            <div style={{ transform: `translateY(${-620 * heroLineOut}px)` }}>
              <Strip put={heroLine} x={164} y={158} w={624} h={78}>
                <div style={T800(38)}>{'EVLEK’TE HER ŞEY YERİNDE.'}</div>
              </Strip>
            </div>

            {/* result cards behind hero */}
            {[[-1, res1P, res1Off, -112, -2.4], [1, res2P, res2Off, 124, 1.8]].map(([s, pIn, pOut, dx, rot], i) => (
              <div key={i} style={{
                position: 'absolute', left: 194, top: 314, width: 692, height: 830,
                background: '#F2EFE8', borderRadius: 26,
                transform: `translate(${dx * pIn}px, ${-1600 * pOut}px) rotate(${rot * pIn}deg) scale(0.94)`,
                opacity: pIn > 0 ? 1 : 0,
                boxShadow: `0 ${8 + 14 * pOut}px 24px rgba(10,37,64,0.16)`,
              }} />
            ))}

            {/* ACCESSORY RAY — closes left as one pile at ~12.9s */}
            <div style={{ position: 'absolute', left: rayX, top: rayY, width: 640,
                          transform: `translateX(${-980 * closeP}px) rotate(${-2 * closeP}deg)` }}>
              <Strip put={search} x={0} y={0} w={560} h={88}>
                <div style={TRAIL(30)}>{'Girne’de denize yakın 3+1'}</div>
              </Strip>
              <Strip put={lang} x={14} y={0} w={560} h={88} edge>
                <div>
                  <div style={TRAIL(30)}>{'BEŞ DİL. AYNI İLAN.'}</div>
                  <div style={{ ...TMONO(22, 'rgba(10,37,64,0.6)'), marginTop: 2, position: 'relative' }}>
                    {'TR EN RU DE AR'}
                    <Lizard x={104} y={18} o={0.35} s={0.7} />
                  </div>
                </div>
              </Strip>
              <Strip put={priceS} x={28} y={0} w={560} h={88} edge>
                <div style={{ width: '100%' }}>
                  <div style={TRAIL(28)}>{'FİYAT TEK BAŞINA YETMEZ.'}</div>
                  <svg width="490" height="18" style={{ marginTop: 6, display: 'block' }}>
                    <line x1="4" y1="9" x2="486" y2="9" stroke="rgba(10,37,64,0.25)" strokeWidth="3" />
                    <rect x="130" y="4" width="220" height="10" rx="5" fill="rgba(47,92,255,0.28)" />
                    <circle cx="256" cy="9" r="7" fill={NAVY} />
                  </svg>
                </div>
              </Strip>
            </div>

            {/* HERO CARD — 910h, fiber layer, die-cut notch */}
            <div style={{
              position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h,
              background: '#FFFFFF', borderRadius: 28, padding: 24,
              opacity: hero.vis ? 1 : 0,
              transform: `${hero.style.transform} translate(${heroMisX}px, ${heroLift}px) rotate(${heroRot}deg) scaleY(${1 - 0.02 * squash}) scale(${takPulse(F.heroTak) * takPulse(F.alignATak) * takPulse(F.alignBTak)})`,
              boxShadow: squash > 0
                ? `0 ${3 * (1 - squash * 0.3)}px ${6 * (1 - squash * 0.3)}px rgba(10,37,64,0.17)`
                : hero.style.boxShadow,
            }}>
              <svg width={CARD.w} height={CARD.h}
                   style={{ position: 'absolute', inset: 0, borderRadius: 28, pointerEvents: 'none' }}>
                <rect width={CARD.w} height={CARD.h} filter="url(#tooth30)" opacity="0.22" />
              </svg>
              <FlatPhoto w={704} h={520} />
              <Lizard x={662} y={476} o={0.3} s={0.9} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 26 }}>
                <div style={T800(46)}>{'£185.000'}</div>
                <div style={T800(34, 'rgba(10,37,64,0.55)')}>Girne</div>
              </div>
              <div style={{ ...TMONO(24, 'rgba(10,37,64,0.5)'), marginTop: 10 }}>{'3+1 · 145 m² · denize 400 m'}</div>
              <Wordmark w={132} style={{ position: 'absolute', right: 28, bottom: 24, opacity: 0.9 }} />
              <div style={{
                position: 'absolute', right: NOTCH.right, top: -1, width: NOTCH.w, height: NOTCH.h,
                background: COBALT, borderRadius: '0 0 14px 14px',
              }} />
            </div>

            {/* GOLD "BU." — dark edge + contact shadow; +8% type, 2px down */}
            <div style={{
              position: 'absolute',
              left: CARD.x + CARD.w - NOTCH.right - NOTCH.w + (NOTCH.w - GOLDTAB.w) / 2,
              top: CARD.y - 56 + 4,
              width: GOLDTAB.w, height: GOLDTAB.h,
              background: GOLD, borderRadius: '0 0 12px 12px',
              borderRight: '1px solid rgba(10,37,64,0.35)',
              borderBottom: '1px solid rgba(10,37,64,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: gold.vis ? 1 : 0,
              transform: `${gold.style.transform} scale(${takPulse(F.goldTak)})`,
              boxShadow: f >= F.goldTak
                ? '0 4px 6px rgba(10,37,64,0.16)'
                : gold.style.boxShadow,
            }}>
              <div style={{ ...T800(37), paddingTop: 2 }}>BU.</div>
            </div>
          </div>
        )}
      </div>

      {/* ═ FINAL PAGE — leads the loop lift ═ */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-2780 * liftPagP}px)` }}>
        <div style={{
          position: 'absolute', left: 72, top: 118, width: 936, height: 1724,
          background: CREAM, borderRadius: 30,
          opacity: finalPage.vis ? 1 : 0,
          transform: finalPage.style.transform,
          boxShadow: finalPage.vis ? '0 -14px 44px rgba(4,14,28,0.26)' : 'none',
        }}>
          <svg width="936" height="1724" style={{ position: 'absolute', inset: 0, borderRadius: 30 }}>
            <rect width="936" height="1724" filter="url(#tooth30)" opacity="0.8" />
          </svg>
          <div style={{ position: 'absolute', left: 24, top: 620, ...T800(82) }}>
            {'Kıbrıs’ta '}<span style={{ color: COBALT }}>{'doğru'}</span>{' ev.'}
          </div>
          <svg width="936" height="80" style={{ position: 'absolute', left: 0, top: 722 }}>
            <InkLine x1={28} y1={30} x2={592} y2={59} p={underP} />
          </svg>
          <div style={{ position: 'absolute', left: 28, top: 836, ...TMONO(40, 'rgba(10,37,64,0.68)') }}>evlek.app</div>
          <div style={{
            position: 'absolute', left: 24, top: 322,
            opacity: mark.vis ? 1 : 0,
            transform: `${mark.style.transform} scale(${takPulse(F.markTak)})`,
          }}>
            <Wordmark w={470} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
