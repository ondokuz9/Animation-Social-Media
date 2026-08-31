// Evlek brand film — DELIVERY cutdowns (V4.8 kreatif kilit sonrası).
//
// EvlekBrandFilm15 (900f) and EvlekBrandFilm06 (360f) are RE-TIMED remixes of
// the approved 30s film: every beat keeps its own settle curve, nothing is
// speed-ramped, no dissolves, at most two elements move at once, shadows
// announce 3 frames early and harden on contact, and both loop physically
// (layers lift, the pile flight crosses frame 0) exactly like the master.
//
// The approved Film30v4.jsx is NOT touched — the shared physics helpers are
// copied here per the repo's copy-not-generalise rule.

import React from 'react';
import { useCurrentFrame, interpolate, Easing, Img } from 'remotion';
import { SANS, MONO, trUpper, f, ease } from '../../brand/tokens.js';
import {
  NAVY, COBALT, GOLD, CREAM, TEX,
  cutEdge, stockCorners, MatterDefs, Ink,
  Photocopy, CardStock, CobaltSheet, Tape, PhotoSlot, CropMarks,
  PHOTO_MASKS,
} from './matter.jsx';
import { Sheet, HandLine, Wordmark, HOME } from './Styleframes.jsx';

export const FILM15_FRAMES = 900;
export const FILM06_FRAMES = 360;

const SETTLE = Easing.bezier(0.34, 1.28, 0.64, 1);
const WIPE = Easing.bezier(0.22, 1, 0.36, 1);

const prog = (frame, atSec, lenSec, easing = SETTLE) =>
  interpolate(frame, [f(atSec), f(atSec + lenSec)], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

const place = (frame, atSec, lenSec, { dx = 0, dy = 0, rot0 = 0, easing = SETTLE } = {}) => {
  const p = prog(frame, atSec, lenSec, easing);
  return {
    opacity: frame >= f(atSec) ? 1 : 0,
    transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${(1 - p) * rot0}deg)`,
  };
};

const wipe = (frame, atSec, lenSec = 0.32, easing = WIPE) => {
  const p = prog(frame, atSec, lenSec, easing);
  return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, opacity: frame >= f(atSec) ? 1 : 0 };
};

const printPress = (frame, atSec, lenSec = 0.2) => {
  const p = prog(frame, atSec, lenSec, Easing.linear);
  return { clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, opacity: frame >= f(atSec) ? 1 : 0 };
};

const cutEdgeBowed = (w, h, seed = 1, amp = 3, n = 7, bow = 0) => {
  let s = seed >>> 0;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s / 4294967296) * 2 - 1; };
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push([(w * i) / n, r() * amp]);
  for (let i = 1; i <= n; i++) pts.push([w + r() * amp, (h * i) / n]);
  for (let i = 1; i <= n; i++) {
    const q = i / n;
    pts.push([w - (w * i) / n, h + r() * amp + bow * Math.sin(Math.PI * q)]);
  }
  for (let i = 1; i < n; i++) pts.push([r() * amp, h - (h * i) / n]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
};

const CastShadow = ({ frame, x, y, w, h, rot = 0, start, len, small = false, r = 10 }) => {
  const landed = frame >= f(start + len);
  const announce = frame < f(start) - 3 ? 0
    : interpolate(frame, [f(start) - 3, f(start) - 1], [0.5, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blob = (dx, dy, blur, a) => (
    <div style={{ position: 'absolute', left: x + dx, top: y + dy, width: w, height: h,
                  transform: `rotate(${rot}deg)`, borderRadius: r,
                  background: `rgba(10,37,64,${a})`, filter: `blur(${blur}px)`,
                  opacity: announce }} />
  );
  if (!landed) return small ? blob(4, 12, 24, 0.08) : blob(8, 26, 52, 0.10);
  return (
    <>
      {small ? blob(0, 2, 5, 0.15) : blob(0, 4, 9, 0.17)}
      {small ? blob(0, 1, 1.5, 0.10) : blob(0, 1, 2, 0.12)}
    </>
  );
};

const ApproachShadow = ({ frame, start }) => {
  const on = frame < f(start) - 3 ? 0
    : interpolate(frame, [f(start) - 3, f(start) - 1], [0.35, 0.6],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const off = prog(frame, start + 0.1, 0.15, WIPE);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 150,
                  opacity: on * (1 - off), pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(10,37,64,0.22), rgba(10,37,64,0))' }} />
  );
};

/* ── shared static geometry (identical to the approved film) ── */
const CARD_IN = { x: 134, y: 742, rot: -2 };
const TAB = { x: 768, y: 608 };
const SLOT = { x: 576, y: 4, w: 152, h: 18 };

/* ── the wall + headline (static, always there — the loop's anchor) ── */
const WallWorld = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0 }}>
    <div style={{ position: 'absolute', inset: 0, background: '#E9E2D7' }}>
      <Img src={TEX.wallPlaster} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                          objectFit: 'cover' }} />
    </div>
    <div style={{ position: 'absolute', left: 84, top: 264 }}>
      <Ink problem roughUrl="url(#cdInkRough80)" ghostOpacity={0.176}
           style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.12,
                    letterSpacing: '-0.015em', color: NAVY }}>
        AYNI EV.<br />ÜÇ AYRI İLAN.
      </Ink>
    </div>
    {children}
  </div>
);

/* ── the duplicate-pile opening, parameterized by timeline ── */
const Opening = ({ fw, T }) => (
  <>
    <CastShadow frame={fw} x={260} y={470} w={580} h={870} rot={-1}
                start={T.stack} len={T.stackLen} r={4} />
    <div style={place(fw, T.stack, T.stackLen, { dy: -400, rot0: -2 })}>
      {(() => { let s7 = 311; const r = () => { s7 = (s7 * 1664525 + 1013904223) >>> 0; return s7 / 4294967296 * 2 - 1; };
        return Array.from({ length: 13 }, (_, i) => (
          <div key={i} style={{ position: 'absolute',
                                left: 250 + r() * 26, top: 464 + i * 5 + r() * 3,
                                width: 596 + r() * 18, height: 16,
                                transform: `rotate(${r() * 1.6}deg)`,
                                background: i % 2 ? '#F1EBDC' : '#EDE7D6',
                                boxShadow: '0 1px 2px rgba(10,37,64,0.10)' }} />
        )); })()}
      <div style={{ position: 'absolute', left: 270, top: 470, width: 560, height: 860,
                    transform: 'rotate(-0.6deg)', background: '#F3EFE5',
                    clipPath: cutEdge(560, 860, 208, 2.6, 7) }}>
        <Img src={TEX.photocopy} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                          objectFit: 'cover', opacity: 0.8 }} />
        <div style={{ position: 'absolute', left: 30, top: 30, width: 500, height: 430,
                      clipPath: PHOTO_MASKS.b }}>
          <Img src={TEX.homeDuoClean} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'absolute', left: 32, top: 486 }}>
          <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, letterSpacing: '0.04em', color: '#20242B' }}>
            SATILIK
          </Ink>
          <Ink problem style={{ fontFamily: MONO, fontWeight: 500, fontSize: 27, color: '#2A2E36', marginTop: 10 }}>
            3+1 · Lapta · denize yakın
          </Ink>
          <Ink problem marker style={{ fontFamily: MONO, fontSize: 30, letterSpacing: '0.05em', color: '#20242B', marginTop: 10 }}>
            0533 8•• •• ••
          </Ink>
        </div>
      </div>

      {[
        { key: 'L', fx: 10, fy: 940, frot: -4.5, srot: -0.9, sdx: 266, sdy: -434, start: T.cardL, kase: false },
        { key: 'R', fx: 550, fy: 900, frot: 4.5, srot: 1.2, sdx: -278, sdy: -396, start: T.cardR, kase: true },
      ].map((c) => {
        const pC = prog(fw, c.start, 0.5);
        const cBow = fw === f(c.start + 0.5) ? 3 : 0;
        return (
          <React.Fragment key={c.key}>
            {fw >= f(c.start) - 3 ? (
              <CastShadow frame={fw} x={c.fx} y={c.fy} w={520} h={620} rot={c.frot}
                          start={c.start} len={0.5} r={4} />
            ) : null}
            <div style={{ position: 'absolute', left: c.fx, top: c.fy, width: 520, height: 620,
                          transform: `translate(${(1 - pC) * c.sdx}px, ${(1 - pC) * c.sdy}px)
                                      rotate(${c.frot + (1 - pC) * (c.srot - c.frot)}deg)`,
                          background: '#F5F1E6',
                          clipPath: cutEdgeBowed(520, 620, 218 + (c.kase ? 3 : 0), 2.4, 6, cBow) }}>
              <Img src={TEX.photocopy} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                                objectFit: 'cover', opacity: 0.7 }} />
              <div style={{ position: 'absolute', left: 24, top: 24, width: 472, height: 340,
                            clipPath: PHOTO_MASKS.a }}>
                <Img src={c.kase ? TEX.homeDuoFlat : TEX.homeDuoSoft}
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', left: 26, top: 384 }}>
                <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: '0.04em', color: '#20242B' }}>
                  SATILIK
                </Ink>
                <Ink problem style={{ fontFamily: MONO, fontWeight: 500, fontSize: 24, color: '#2A2E36', marginTop: 8 }}>
                  3+1 · Lapta{c.kase ? ' · deniz yakın' : ' · denize yakın'}
                </Ink>
                <Ink problem marker style={{ fontFamily: MONO, fontSize: 26, letterSpacing: '0.05em', color: '#20242B', marginTop: 8 }}>
                  {c.kase ? '0542 3•• •• ••' : '0533 8•• •• ••'}
                </Ink>
              </div>
              {c.kase && (
                <div style={{ position: 'absolute', right: 18, top: 14, transform: 'rotate(-8deg)',
                              border: '2.5px solid rgba(10,37,64,0.5)', padding: '4px 10px' }}>
                  <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.08em',
                                 color: 'rgba(10,37,64,0.62)' }}>HÂLÂ SATILIK MI?</span>
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>

    <CastShadow frame={fw} x={380} y={1196} w={340} h={130} rot={2} small start={T.tags[0]} len={T.tagLen} r={3} />
    <div style={place(fw, T.tags[0], T.tagLen, { dy: -140, rot0: -4 })}>
      <Photocopy x={380} y={1196} w={340} h={130} rot={2} seed={61} shadow={false}>
        <div style={{ position: 'absolute', left: 22, top: 12 }}>
          <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 26, letterSpacing: '0.08em', color: 'rgba(32,36,43,0.8)' }}>İLAN SİTESİ</div>
          <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, color: '#20242B', marginTop: 2 }}>
            £175.000
          </Ink>
        </div>
      </Photocopy>
    </div>
    <CastShadow frame={fw} x={30} y={1240} w={340} h={130} rot={-2.4} small start={T.tags[1]} len={T.tagLen} r={3} />
    <div style={place(fw, T.tags[1], T.tagLen, { dy: -140, rot0: 4 })}>
      <Sheet x={30} y={1240} w={340} h={130} rot={-2.4} bg="#F6F2E7" seed={77} amp={4} n={4} fiber={false} shadow={false}>
        <div style={{ position: 'absolute', left: -14, top: 22, width: 24, height: 24,
                      background: '#F6F2E7', clipPath: 'polygon(100% 0, 100% 100%, 0 32%)' }} />
        <div style={{ position: 'absolute', left: 22, top: 12 }}>
          <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 26, letterSpacing: '0.08em', color: 'rgba(32,36,43,0.8)' }}>WHATSAPP GRUBU</div>
          <Ink marker style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: '#23272E', marginTop: 2 }}>
            ₺11.900.000
          </Ink>
        </div>
      </Sheet>
    </div>
    <CastShadow frame={fw} x={630} y={1152} w={340} h={130} rot={3.4} small start={T.tags[2]} len={T.tagLen} r={3} />
    <div style={place(fw, T.tags[2], T.tagLen, { dy: -140, rot0: 5 })}>
      <div style={{ position: 'absolute', left: 630, top: 1152, width: 340, height: 130, transform: 'rotate(3.4deg)' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#F1ECDF',
                      clipPath: 'polygon(3% 8%, 96% 0, 100% 88%, 64% 100%, 30% 92%, 0 96%)' }} />
        <div style={{ position: 'absolute', left: 22, top: 12 }}>
          <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 26, letterSpacing: '0.08em', color: 'rgba(32,36,43,0.8)' }}>EMLAKÇI VİTRİNİ</div>
          <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: '#20242B', marginTop: 4 }}>
            $250.000
          </Ink>
        </div>
        <Tape x={110} y={-18} rot={-3} w={120} h={30} />
      </div>
    </div>

    <CastShadow frame={fw} x={60} y={352} w={960} h={150} rot={-0.8}
                start={T.qband} len={T.qbandLen} r={4} />
    <div style={place(fw, T.qband, T.qbandLen, { dy: -56, rot0: 2.4 })}>
      <Photocopy x={60} y={352} w={960} h={150} rot={-0.8} seed={97} shadow={false}>
        <div style={{ position: 'absolute', left: 36, top: 34 }}>
          <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58,
                                letterSpacing: '-0.01em', color: NAVY }}>
            ÜÇ FİYAT. HANGİSİ DOĞRU?
          </Ink>
        </div>
        <div style={{ position: 'absolute', right: 36, top: -30, width: 120, height: 44,
                      background: COBALT, clipPath: cutEdge(120, 44, 93, 2, 3) }}>
          <Wordmark w={71} color="#FFFFFF" style={{ position: 'absolute', left: 24, top: 10 }} />
        </div>
      </Photocopy>
    </div>

    <div style={{ position: 'absolute', left: 60, top: 1300, width: 1030, height: 60,
                  transform: 'rotate(-8.3deg)', transformOrigin: 'left center',
                  filter: 'url(#cdSerig)', ...wipe(fw, T.strike, 0.27) }}>
      <HandLine x={0} y={10} w={1010} seed={31} sw={24} cap="butt" />
    </div>
  </>
);

/* ── the cream press board (same object physics as the master) ── */
const BoardLayer = ({ frame, T }) => {
  const pIn = prog(frame, T.boardIn, T.boardInLen, ease.drawer);
  const pLift = prog(frame, T.boardLift, T.boardLiftLen, ease.inOut);
  const movingIn = frame >= f(T.boardIn) && frame < f(T.boardIn + T.boardInLen);
  const lifting = frame >= f(T.boardLift) && frame < f(T.boardLift + T.boardLiftLen);
  const moving = movingIn || lifting;
  const y = -2000 * (1 - pIn) - 2350 * pLift;
  const rot = movingIn ? 0.3 * (1 - pIn) : lifting ? 0.35 * Math.sin(Math.PI * pLift) : 0;
  const bow = movingIn ? 6 * Math.sin(Math.PI * pIn) : lifting ? 6 * Math.sin(Math.PI * pLift) : 0;
  return (
    <div style={{ position: 'absolute', inset: 0,
                  transform: `translateY(${y}px) rotate(${rot}deg)`,
                  transformOrigin: '100% 0%',
                  filter: moving
                    ? `drop-shadow(0 ${18 + 14 * pLift}px ${30 + 22 * pLift}px rgba(10,37,64,${0.14 + 0.05 * pLift}))`
                    : 'drop-shadow(0 6px 16px rgba(10,37,64,0.12))' }}>
      {moving && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', height: 18,
                      background: 'linear-gradient(to bottom, rgba(10,37,64,0.18), rgba(10,37,64,0))' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: CREAM,
                    clipPath: moving ? cutEdgeBowed(1080, 1920, 777, 10, 16, bow)
                                     : cutEdge(1080, 1920, 777, 10, 16) }}>
        <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
          <rect width="1080" height="1920" filter="url(#mTooth)" />
        </svg>
      </div>
    </div>
  );
};

/* ── shared local filter defs ── */
const CutdownDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="cdSerig">
        <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="2" seed="23" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
      </filter>
      <filter id="cdInkRough80">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="9" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.8" />
      </filter>
    </defs>
  </svg>
);

/* ── the gold tab (one object, hover hand-off, contact bow) ── */
const GoldTab = ({ frame, T, pageOutY }) => {
  const hoverY = -18 * prog(frame, T.goldUp, 0.083, WIPE)
                 + 18 * prog(frame, T.goldDown, T.goldDownLen);
  const hoverR = 1.2 * prog(frame, T.goldUp, 0.083, WIPE)
                 - 1.2 * prog(frame, T.goldDown, T.goldDownLen, WIPE);
  const landed2 = frame >= f(T.goldDown + T.goldDownLen);
  const hovering = frame >= f(T.goldUp) && !landed2;
  return (
    <div style={{ transform: `translateY(${pageOutY}px)` }}>
      {frame < f(T.goldUp) && (
        <CastShadow frame={frame} x={TAB.x} y={TAB.y} w={168} h={86} small
                    start={T.gold} len={T.goldLen} r={3} />
      )}
      {hovering && (
        <div style={{ position: 'absolute', left: TAB.x + 4, top: TAB.y + 10, width: 168, height: 86,
                      borderRadius: 3, background: 'rgba(10,37,64,0.09)', filter: 'blur(12px)' }} />
      )}
      {landed2 && (
        <>
          <div style={{ position: 'absolute', left: TAB.x, top: TAB.y + 2, width: 168, height: 86,
                        borderRadius: 3, background: 'rgba(10,37,64,0.16)', filter: 'blur(5px)' }} />
          <div style={{ position: 'absolute', left: TAB.x, top: TAB.y + 1, width: 168, height: 86,
                        borderRadius: 3, background: 'rgba(10,37,64,0.10)', filter: 'blur(1.5px)' }} />
        </>
      )}
      <div style={{
        opacity: frame >= f(T.gold) ? 1 : 0,
        transform: `${place(frame, T.gold, T.goldLen, { dx: 320, rot0: 7.5 }).transform} translateY(${hoverY}px) rotate(${hoverR}deg)`,
      }}>
        <div style={{ position: 'absolute', left: TAB.x, top: TAB.y, width: 168, height: 86,
                      transform: 'rotate(1.6deg)' }}>
          <div style={{ position: 'absolute', inset: 0, background: GOLD,
                        clipPath: cutEdgeBowed(168, 86, 3, 2.2, 4,
                          frame === f(T.gold + T.goldLen) ? 2 : 0) }}>
            <svg width="168" height="86" style={{ position: 'absolute', inset: 0 }}>
              <rect width="168" height="86" filter="url(#mFiber)" opacity="0.6" />
              <rect width="168" height="86" filter="url(#mToner)" opacity="0.14" />
            </svg>
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: NAVY,
                        position: 'absolute', left: 34, top: 16 }}>BU.</div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════ 15 SECOND CUTDOWN ════════════════════════ */
const T15 = {
  stack: -0.30, stackLen: 0.5,
  cardR: 0.30, cardL: 0.55,
  tags: [0.85, 1.05, 1.25], tagLen: 0.2,
  qband: 1.55, qbandLen: 0.45,
  strike: 2.40,
  boardIn: 2.62, boardInLen: 0.5,
  cobalt: 2.70,
  hl1: 3.15, under: 3.55,
  hero: 3.55,
  rail: 4.15, railLen: 0.3,
  coverPull: 4.95, coverOff: 5.20,
  railExit: 5.05,
  label: 5.10, lang: 5.25, langStep: 0.18,
  band: 6.60, marker: 7.15, ticket: 7.25, tline: 7.70,
  infoExit: 7.95,
  glide: 8.15, manifesto: 8.45,
  gold: 9.55, goldLen: 0.267,
  goldUp: 10.18, goldDown: 10.75, goldDownLen: 0.216,
  page: 10.20, pageLen: 0.7667,
  slog1: 11.30, slog2: 11.50, url: 11.90,
  proof: 12.10, proofLen: 0.45, mark: 12.60, markLen: 0.233,
  pageLift: 13.42, cobaltLift: 13.72, boardLift: 14.0, boardLiftLen: 0.65,
};

export const Film15 = () => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  const fw = frame >= f(14.55) ? frame - 900 : frame;
  const tw = fw / 60;
  const T = T15;

  const cobaltInY = 1920 * (1 - prog(frame, T.cobalt, 0.6));
  const g = prog(frame, T.glide, 0.55);
  const cardX = CARD_IN.x + (200 - (CARD_IN.x - 36)) * g;
  const cardY = CARD_IN.y + (632 - (CARD_IN.y - 52)) * g;
  const cardRot = CARD_IN.rot + (0 - CARD_IN.rot) * g;

  const pPull = prog(frame, T.coverPull, 0.3, ease.drawer);
  const pOff = prog(frame, T.coverOff, 0.45, ease.inOut);
  const coverY = -120 * pPull - 1500 * pOff;
  const coverLead = -0.6 * Math.min(1, pPull * 4)
                    * (1 - prog(frame, T.coverPull + 0.1, 0.15, WIPE))
                    - 0.35 * prog(frame, T.coverOff, 0.2, WIPE);
  const coverBow = 2.5 * Math.sin(Math.PI * pPull) + 5 * Math.sin(Math.PI * pOff);
  const coverGone = frame >= f(T.coverOff + 0.45);

  const pPage = prog(frame, T.page, T.pageLen);
  const pageInY = 1860 * (1 - pPage);
  const cornerLag = -0.28 * (1 - prog(frame, T.page + 0.05, T.pageLen, WIPE));
  const pageContactF = f(T.page + T.pageLen);
  const pageBow = frame === pageContactF ? 2 : frame === pageContactF + 1 ? 0.7 : 0;
  const pLift = prog(frame, T.pageLift, 0.6, ease.inOut);
  const cLift = prog(frame, T.cobaltLift, 0.6, ease.inOut);
  const pageOutY = -2350 * pLift;
  const liftRotP = 0.35 * Math.sin(Math.PI * pLift);
  const liftRotC = 0.3 * Math.sin(Math.PI * cLift);

  const showWallItems = tw < 3.2;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#D8D1C1', overflow: 'hidden' }}>
      <MatterDefs />
      <CutdownDefs />
      <WallWorld>{showWallItems && <Opening fw={fw} T={T} />}</WallWorld>
      <BoardLayer frame={frame} T={T} />
      {t < 4.5 && <ApproachShadow frame={frame} start={T.cobalt} />}

      {/* COBALT WORLD */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.cobalt - 0.05 ? 1 : 0,
                    transform: `translateY(${cobaltInY - 2250 * cLift}px) rotate(${liftRotC}deg)`,
                    transformOrigin: '30% 0%' }}>
        <CobaltSheet top={128} landed={frame >= f(T.cobalt + 0.6)}>
          <div style={{ position: 'absolute', left: 108, top: 250 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.06,
                          letterSpacing: '-0.015em', color: '#FFFFFF', ...printPress(frame, T.hl1, 0.15) }}>
              {trUpper('Evlek ne aradığını')}<br />{trUpper('anlar.')}
            </div>
            <div style={{ ...wipe(frame, T.under, 0.25), position: 'absolute', left: 0, top: 0,
                          width: 360, height: 220 }}>
              <HandLine x={2} y={186} w={340} color="#FFFFFF" sw={12} seed={9} opacity={0.9} />
            </div>
          </div>

          {/* search rail — slides out of the dossier, exits left */}
          {t < 5.6 && (() => {
            const railEntryX = -1088 * (1 - prog(frame, T.rail, T.railLen, Easing.bezier(0.3, 1.05, 0.55, 1)))
                               - prog(frame, T.railExit, 0.4, ease.drawer) * 1400;
            const railLanded = frame >= f(T.rail + T.railLen);
            return (
              <>
                <div style={{ opacity: frame >= f(T.rail) - 3 && frame < f(T.railExit + 0.4) ? 1 : 0,
                              transform: `translateX(${railEntryX + (railLanded ? 0 : 14)}px)` }}>
                  <div style={{ position: 'absolute', left: -16, top: railLanded ? 563 : 570, width: 1112, height: 102,
                                transform: 'rotate(-0.5deg)', borderRadius: 3,
                                background: railLanded ? 'rgba(10,37,64,0.20)' : 'rgba(10,37,64,0.15)',
                                filter: railLanded ? 'blur(8px)' : 'blur(20px)' }} />
                </div>
                <div style={{ opacity: frame >= f(T.rail) && frame < f(T.railExit + 0.4) ? 1 : 0,
                              transform: `translateX(${railEntryX}px)` }}>
                  <Sheet x={-16} y={560} w={1112} h={102} rot={-0.5} seed={88} amp={2.4} n={5}
                         bg="#F8F4E9" shadow={false} texOpacity={0.68}>
                    <div style={{ position: 'absolute', left: 78, top: 29, fontFamily: MONO, fontSize: 38,
                                  letterSpacing: '0.1em', color: 'rgba(10,37,64,0.68)' }}>ARA:</div>
                    <div style={{ position: 'absolute', left: 296, top: 27, fontFamily: SANS, fontWeight: 600,
                                  fontSize: 43, color: NAVY, whiteSpace: 'nowrap', display: 'flex', gap: 28 }}>
                      <span>Girne’de,</span><span>denize yakın,</span><span>3+1</span>
                    </div>
                  </Sheet>
                </div>
              </>
            );
          })()}

          {/* THE DOSSIER */}
          <CastShadow frame={frame} x={cardX} y={cardY} w={812} h={1010}
                      rot={cardRot} start={T.hero} len={0.55} r={5} />
          <div style={{ transform: `translate(${cardX - CARD_IN.x}px, ${cardY - CARD_IN.y}px)` }}>
            <div style={place(frame, T.hero, 0.55, { dx: 90, dy: 240, rot0: 4.8 })}>
              <CardStock x={CARD_IN.x} y={CARD_IN.y} w={812} h={1010} rot={cardRot} seed={23} pad={0}
                         style={{ boxShadow: 'none' }}>
                <div style={{ position: 'absolute', right: 248, top: -14, width: 128, height: 66,
                              background: COBALT, clipPath: cutEdge(128, 66, 91, 2.4, 4) }}>
                  <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.16em', color: '#FFFFFF',
                                position: 'absolute', left: 18, top: 20 }}>EVLEK</div>
                </div>
                <div style={{ position: 'absolute', left: SLOT.x, top: SLOT.y, width: SLOT.w, height: SLOT.h,
                              background: 'rgba(10,37,64,0.10)',
                              boxShadow: 'inset 0 2px 3px rgba(10,37,64,0.22), inset 0 -1px 0 rgba(255,255,255,0.5)' }} />
                <div style={{ position: 'absolute', left: 36, top: 36, width: 740, height: 560 }}>
                  <PhotoSlot w={740} h={560} mask="a" src={HOME.ext} />
                </div>
                <div style={{ position: 'absolute', left: 44, top: 650 }}>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 42, color: NAVY }}>
                    Girne’de denize yakın 3+1
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 29, letterSpacing: '0.04em',
                                color: 'rgba(10,37,64,0.62)', marginTop: 18 }}>
                    LAPTA · 3+1 · 2 BANYO · 120 M² · EŞYALI
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '0.1em',
                                color: 'rgba(10,37,64,0.45)', marginTop: 46 }}>
                    GİRNE · SATILIK · EVLEK.APP
                  </div>
                </div>
                {frame < f(T.ticket) && (
                  <div style={{ position: 'absolute', left: 44, top: 540, width: 264, height: 74,
                                transform: 'rotate(-0.6deg)',
                                filter: 'drop-shadow(0 2px 4px rgba(10,37,64,0.18))' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF',
                                  clipPath: cutEdge(264, 74, 57, 1.6, 3) }} />
                    <div style={{ position: 'absolute', left: 24, top: 10, fontFamily: SANS, fontWeight: 800,
                                  fontSize: 46, color: NAVY }}>£175.000</div>
                  </div>
                )}
                {!coverGone && (
                  <div style={{ position: 'absolute', left: 0, top: -14, width: 812, height: 1024,
                                transform: `translateY(${coverY}px) rotate(${coverLead}deg)`,
                                transformOrigin: '85% 20%',
                                filter: frame >= f(T.coverPull)
                                  ? 'drop-shadow(0 18px 28px rgba(10,37,64,0.20))'
                                  : 'drop-shadow(0 2px 4px rgba(10,37,64,0.14))' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#FDFBF6',
                                  clipPath: cutEdgeBowed(812, 1024, 141, 2.6, 8, coverBow) }}>
                      <Img src={TEX.cardstock} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                                        objectFit: 'cover', opacity: 0.85, objectPosition: '30% 70%' }} />
                    </div>
                    <div style={{ position: 'absolute', left: 40, top: 34, fontFamily: MONO, fontSize: 22,
                                  letterSpacing: '0.16em', color: 'rgba(10,37,64,0.45)' }}>
                      DOSYA 01 · GİRNE
                    </div>
                    <Wordmark w={236} color={NAVY} style={{ position: 'absolute', left: 288, top: 452 }} />
                    <div style={{ position: 'absolute', left: 296, top: 560, fontFamily: MONO, fontSize: 23,
                                  letterSpacing: '0.12em', color: 'rgba(10,37,64,0.5)' }}>
                      GİRNE ARAMASI
                    </div>
                    {frame < f(T.coverOff) && (
                      <div style={{ position: 'absolute', left: 6, right: 6, bottom: 0, height: 2,
                                    background: 'rgba(10,37,64,0.28)' }} />
                    )}
                  </div>
                )}
              </CardStock>
            </div>
          </div>

          {/* INFO WORLD — deck stays spread (no gather in 15s), band below */}
          {t < 8.7 && (
            <div style={{ transform: `translateY(${prog(frame, T.infoExit, 0.5, ease.drawer) * 1600}px)` }}>
              <CastShadow frame={frame} x={108} y={566} w={640} h={88} small start={T.label} len={0.36} r={3} />
              <div style={place(frame, T.label, 0.36, { dy: -150, rot0: -3 })}>
                <Sheet x={108} y={566} w={640} h={88} rot={-0.6} seed={141} amp={2} n={4} fiber={false} shadow={false}>
                  <div style={{ position: 'absolute', left: 26, top: 18, fontFamily: SANS, fontWeight: 650,
                                fontSize: 42, letterSpacing: '-0.005em', color: NAVY }}>
                    BEŞ DİL. AYNI EV.
                  </div>
                </Sheet>
              </div>
              {[
                { tag: 'TR', line: <>Lapta, Girne’de 3+1 daire</>, sub: <>£175.000 · 120 M² · 3+1</> },
                { tag: 'EN', line: <>3+1 apartment in Lapta, Kyrenia</>, sub: <>£175,000 · 120 M² · 3+1</> },
                { tag: 'RU', line: <>Квартира 3+1 в Лапте, Кирения</>, sub: <>£175 000 · 120 М² · 3+1</> },
                { tag: 'DE', line: <>3+1-Wohnung in Lapta, Kyrenia</>, sub: <>£175.000 · 120 M² · 3+1</> },
                { tag: 'AR', rtl: true,
                  line: <>شقة <bdi dir="ltr">3+1</bdi> في لابتا، كيرينيا</>,
                  sub: <><bdi dir="ltr">£175,000</bdi> · <bdi dir="ltr">120</bdi> م² · <bdi dir="ltr">3+1</bdi></> },
              ].map((c, i) => {
                const start = T.lang + i * T.langStep;
                const x = 108 + [0, 20, 36, 22, 8][i];
                const y = 664 + i * 108;
                return (
                  <div key={c.tag}>
                    <CastShadow frame={frame} x={x} y={y} w={800} h={122} rot={[-1.4, 1, -0.8, 1.2, -1][i]}
                                small start={start} len={0.35} r={4} />
                    <div style={place(frame, start, 0.35, { dy: -200, rot0: [-4, 3.5, -3, 4, -3.5][i] })}>
                      <CardStock x={x} y={y} w={800} h={122} rot={[-1.4, 1, -0.8, 1.2, -1][i]}
                                 seed={101 + i} fiberOpacity={0.58} style={{ boxShadow: 'none' }}>
                        <div style={{ position: 'absolute', left: 22, top: 12, width: 74, height: 36,
                                      background: c.tag === 'AR' ? COBALT : 'transparent',
                                      border: c.tag === 'AR' ? 'none' : '2.5px solid rgba(10,37,64,0.5)',
                                      transform: `rotate(${[-2.5, 1.8, -1.2, 2.2, -1.6][i]}deg)`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: '0.08em',
                                         color: c.tag === 'AR' ? '#FFFFFF' : 'rgba(10,37,64,0.72)' }}>{c.tag}</span>
                        </div>
                        <div dir={c.rtl ? 'rtl' : 'ltr'}
                             style={{ position: 'absolute', left: 116, right: 24, top: 16,
                                      fontFamily: SANS, fontWeight: 600, fontSize: 29, color: NAVY,
                                      textAlign: c.rtl ? 'right' : 'left', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                          {c.line}
                        </div>
                        <div dir={c.rtl ? 'rtl' : 'ltr'}
                             style={{ position: 'absolute', left: 116, right: 24, top: 70, fontFamily: MONO, fontSize: 22,
                                      letterSpacing: '0.05em', color: 'rgba(10,37,64,0.72)',
                                      textAlign: c.rtl ? 'right' : 'left' }}>
                          {c.sub}
                        </div>
                      </CardStock>
                    </div>
                  </div>
                );
              })}

              <CastShadow frame={frame} x={84} y={1218} w={912} h={470} rot={0.7}
                          start={T.band} len={0.6} r={4} />
              <div style={place(frame, T.band, 0.6, { dy: 320, rot0: -2.5 })}>
                <Sheet x={84} y={1218} w={912} h={470} rot={0.7} seed={131} amp={3.4} n={8} shadow={false}
                       texOpacity={0.92}>
                  <div style={{ position: 'absolute', left: 52, top: 38, fontFamily: SANS, fontWeight: 800,
                                fontSize: 52, letterSpacing: '-0.01em', color: NAVY }}>
                    BU FİYAT NORMAL Mİ?
                  </div>
                  <div style={{ position: 'absolute', left: 54, top: 112, fontFamily: MONO, fontSize: 30,
                                letterSpacing: '0.07em', color: 'rgba(10,37,64,0.78)' }}>
                    GİRNE · 3+1 DAİRE · 19 AKTİF İLAN
                  </div>
                  <svg width="800" height="150" style={{ position: 'absolute', left: 52, top: 172 }}>
                    <line x1="0" y1="110" x2="800" y2="110" stroke={NAVY} strokeWidth="3" />
                    {Array.from({ length: 25 }, (_, i) => (
                      <line key={i} x1={(800 / 24) * i} y1={i % 4 === 0 ? 86 : 96} x2={(800 / 24) * i} y2="110"
                            stroke={NAVY} strokeWidth={i % 4 === 0 ? 2.4 : 1.4} opacity={i % 4 === 0 ? 0.9 : 0.5} />
                    ))}
                    <g transform="translate(141.7 0)">
                      <g style={{ ...place(frame, T.marker, 0.3, { dy: -90 }),
                                  transform: `${place(frame, T.marker, 0.3, { dy: -90 }).transform}
                                              translateX(${2 * prog(frame, T.ticket + 0.45, 0.05, WIPE)
                                                           * (1 - prog(frame, T.ticket + 0.5, 0.12))}px)` }}>
                        <path d="M0 74 L-16 38 L16 38 Z" fill={COBALT} />
                        <line x1="0" y1="74" x2="0" y2="110" stroke={COBALT} strokeWidth="4" />
                      </g>
                    </g>
                  </svg>
                  <div style={{ position: 'absolute', left: 52, top: 296, fontFamily: MONO, fontSize: 24,
                                color: 'rgba(10,37,64,0.85)' }}>£90.000</div>
                  <div style={{ position: 'absolute', right: 58, top: 296, fontFamily: MONO, fontSize: 24,
                                color: 'rgba(10,37,64,0.85)' }}>£570.000</div>
                  <div style={{ position: 'absolute', left: 240, top: 236, fontFamily: MONO, fontSize: 23,
                                letterSpacing: '0.06em', color: 'rgba(10,37,64,0.6)',
                                ...wipe(frame, T.tline, 0.25) }}>
                    BU EV · £1.458/M²
                  </div>
                  <div style={{ position: 'absolute', left: 52, bottom: 32, fontFamily: MONO, fontSize: 22,
                                letterSpacing: '0.08em', color: 'rgba(10,37,64,0.58)' }}>
                    KAYNAK: EVLEK.APP CANLI İLAN VERİSİ
                  </div>
                </Sheet>
              </div>

              {frame >= f(T.ticket) && (() => {
                const p = prog(frame, T.ticket, 0.45);
                const tx = 142 + (320 - 142) * p;
                const ty = 1330 + (1386 - 1330) * p - Math.sin(Math.PI * Math.min(1, p)) * 72;
                return (
                  <div style={{ position: 'absolute', left: tx, top: ty, width: 264, height: 74,
                                transform: `rotate(${-0.6 + 1.3 * p}deg)`,
                                filter: p < 1 ? 'drop-shadow(0 10px 16px rgba(10,37,64,0.16))'
                                              : 'drop-shadow(0 3px 6px rgba(10,37,64,0.18))' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF',
                                  clipPath: cutEdge(264, 74, 57, 1.6, 3) }} />
                    <div style={{ position: 'absolute', left: 24, top: 10, fontFamily: SANS, fontWeight: 800,
                                  fontSize: 46, color: NAVY }}>£175.000</div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* MANIFESTO */}
          <CastShadow frame={frame} x={56} y={226} w={968} h={244} rot={-0.4}
                      start={T.manifesto} len={0.5} r={4} />
          <div style={place(frame, T.manifesto, 0.5, { dy: -260, rot0: 3 })}>
            <Sheet x={56} y={226} w={968} h={244} rot={-0.4} seed={171} amp={3} n={8} fiber={false} shadow={false}>
              <div style={{ position: 'absolute', left: 52, top: 82, fontFamily: SANS, fontWeight: 800,
                            fontSize: 56, letterSpacing: '-0.015em', color: NAVY }}>
                GERİYE SADECE EV KALIR.
              </div>
            </Sheet>
          </div>
        </CobaltSheet>
      </div>

      {t > 9.3 && t < 11.3 && <ApproachShadow frame={frame} start={T.page + 1 / 60} />}

      {/* PRESS WORLD */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.page - 0.05 ? 1 : 0,
                    transform: `translateY(${pageOutY}px) rotate(${liftRotP}deg)`,
                    transformOrigin: '25% 0%' }}>
        <div style={{ position: 'absolute', left: 72, top: 96, width: 936, height: 1728,
                      transform: `rotate(${-0.35 + cornerLag}deg) translateY(${pageInY}px)`,
                      transformOrigin: '20% 80%',
                      filter: frame >= pageContactF
                        ? 'drop-shadow(0 3px 8px rgba(10,37,64,0.20)) drop-shadow(0 1px 2px rgba(10,37,64,0.12))'
                        : 'drop-shadow(0 18px 30px rgba(10,37,64,0.16))' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#FBF8F1',
                        clipPath: cutEdgeBowed(936, 1728, 7, 2.2, 10, pageBow) }}>
            <Img src={TEX.press} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                          objectFit: 'cover', opacity: 0.8 }} />
            <svg width="936" height="1728" style={{ position: 'absolute', inset: 0 }}>
              <rect width="936" height="1728" filter="url(#mTooth)" opacity="0.5" />
            </svg>
          </div>
          <CropMarks w={936} h={1728} />
          <div style={{ position: 'absolute', right: 64, top: 64, fontFamily: MONO, fontSize: 22,
                        letterSpacing: '0.14em', color: 'rgba(10,37,64,0.4)' }}>
            EVLEK BASKI 01 · KKTC
          </div>
          <div style={{ position: 'absolute', left: 84, top: 496 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 108, lineHeight: 1.05,
                          letterSpacing: '-0.02em', color: NAVY }}>
              <div style={printPress(frame, T.slog1, 0.133)}>Kıbrıs’ta</div>
              <div style={printPress(frame, T.slog2, 0.133)}>doğru ev.</div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 88, top: 858, fontFamily: MONO, fontWeight: 600,
                        fontSize: 50, letterSpacing: '0.04em', color: NAVY, ...wipe(frame, T.url, 0.25) }}>
            evlek.app
          </div>
          <CastShadow frame={frame} x={84} y={1060} w={768} h={250} start={T.proof} len={T.proofLen} r={8} />
          <div style={place(frame, T.proof, T.proofLen,
                            { dy: 150, rot0: 2.2, easing: Easing.bezier(0.32, 1.16, 0.66, 1) })}>
            <div style={{ position: 'absolute', left: 84, top: 1060, width: 768, height: 250,
                          background: '#F7F3EA', borderRadius: stockCorners(83) }}>
              <Img src={TEX.cardstock} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                                objectFit: 'cover', opacity: 0.55, borderRadius: stockCorners(83),
                                                objectPosition: '64% 38%' }} />
              <div style={{ position: 'absolute', left: 26, top: 26, width: 250, height: 198 }}>
                <PhotoSlot w={250} h={198} mask="b" src={HOME.ext} />
              </div>
              <div style={{ position: 'absolute', left: 306, top: 40 }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: NAVY }}>£175.000</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 29, color: NAVY, marginTop: 8 }}>
                  Girne’de denize yakın 3+1
                </div>
                <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                              color: 'rgba(10,37,64,0.6)', marginTop: 12 }}>
                  LAPTA · 120 M² · SATILIK
                </div>
              </div>
            </div>
          </div>
          <div style={{ ...printPress(frame, T.mark, T.markLen), position: 'absolute', left: 70, top: 1350, width: 460, height: 160 }}>
            <Wordmark w={430} color={NAVY} style={{ position: 'absolute', left: 0, top: 0 }} />
          </div>
        </div>
      </div>

      <GoldTab frame={frame} T={T} pageOutY={pageOutY} />
    </div>
  );
};

/* ════════════════════════ 6 SECOND BUMPER ════════════════════════
   One argument only: same home, three listings/prices — Evlek sets the
   right one in place. No language deck, no ruler, no extra features. */
const T6 = {
  stack: -0.28, stackLen: 0.45,
  cardR: 0.25, cardL: 0.50,
  tags: [0.75, 0.92, 1.09], tagLen: 0.18,
  qband: 1.32, qbandLen: 0.4,
  strike: 1.62,
  boardIn: 1.85, boardInLen: 0.45,
  cobalt: 1.90,
  hero: 2.15,
  gold: 2.65, goldLen: 0.267,
  goldUp: 3.13, goldDown: 3.63, goldDownLen: 0.216,
  page: 3.15, pageLen: 0.7,
  slog1: 4.0, slog2: 4.2, url: 4.55,
  mark: 4.85, markLen: 0.233,
  pageLift: 5.0, cobaltLift: 5.15, boardLift: 5.30, boardLiftLen: 0.4,
};

export const Film06 = () => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  const fw = frame >= f(5.6333) ? frame - 360 : frame;
  const tw = fw / 60;
  const T = T6;

  const cobaltInY = 1920 * (1 - prog(frame, T.cobalt, 0.55));
  const pPage = prog(frame, T.page, T.pageLen);
  const pageInY = 1860 * (1 - pPage);
  const cornerLag = -0.28 * (1 - prog(frame, T.page + 0.05, T.pageLen, WIPE));
  const pageContactF = f(T.page + T.pageLen);
  const pageBow = frame === pageContactF ? 2 : frame === pageContactF + 1 ? 0.7 : 0;
  const pLift = prog(frame, T.pageLift, 0.4, ease.inOut);
  const cLift = prog(frame, T.cobaltLift, 0.4, ease.inOut);
  const pageOutY = -2350 * pLift;
  const liftRotP = 0.35 * Math.sin(Math.PI * pLift);
  const liftRotC = 0.3 * Math.sin(Math.PI * cLift);

  const showWallItems = tw < 2.4;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#D8D1C1', overflow: 'hidden' }}>
      <MatterDefs />
      <CutdownDefs />
      <WallWorld>{showWallItems && <Opening fw={fw} T={T} />}</WallWorld>
      <BoardLayer frame={frame} T={T} />
      {t < 3.2 && <ApproachShadow frame={frame} start={T.cobalt} />}

      {/* COBALT WORLD — the OPEN Evlek card lands with one decisive TAK */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.cobalt - 0.05 ? 1 : 0,
                    transform: `translateY(${cobaltInY - 2250 * cLift}px) rotate(${liftRotC}deg)`,
                    transformOrigin: '30% 0%' }}>
        <CobaltSheet top={128} landed={frame >= f(T.cobalt + 0.55)}>
          <CastShadow frame={frame} x={CARD_IN.x} y={CARD_IN.y - 160} w={812} h={1010}
                      rot={-1} start={T.hero} len={0.5} r={5} />
          <div style={place(frame, T.hero, 0.5, { dx: 90, dy: 260, rot0: 4.8 })}>
            <CardStock x={CARD_IN.x} y={CARD_IN.y - 160} w={812} h={1010} rot={-1} seed={23} pad={0}
                       style={{ boxShadow: 'none' }}>
              <div style={{ position: 'absolute', right: 248, top: -14, width: 128, height: 66,
                            background: COBALT, clipPath: cutEdge(128, 66, 91, 2.4, 4) }}>
                <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.16em', color: '#FFFFFF',
                              position: 'absolute', left: 18, top: 20 }}>EVLEK</div>
              </div>
              <div style={{ position: 'absolute', left: SLOT.x, top: SLOT.y, width: SLOT.w, height: SLOT.h,
                            background: 'rgba(10,37,64,0.10)',
                            boxShadow: 'inset 0 2px 3px rgba(10,37,64,0.22), inset 0 -1px 0 rgba(255,255,255,0.5)' }} />
              <div style={{ position: 'absolute', left: 36, top: 36, width: 740, height: 560 }}>
                <PhotoSlot w={740} h={560} mask="a" src={HOME.ext} />
              </div>
              <div style={{ position: 'absolute', left: 44, top: 650 }}>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 42, color: NAVY }}>
                  Girne’de denize yakın 3+1
                </div>
                <div style={{ fontFamily: MONO, fontSize: 29, letterSpacing: '0.04em',
                              color: 'rgba(10,37,64,0.62)', marginTop: 18 }}>
                  LAPTA · 3+1 · 2 BANYO · 120 M² · EŞYALI
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: NAVY, marginTop: 40 }}>
                  £175.000
                </div>
              </div>
            </CardStock>
          </div>
        </CobaltSheet>
      </div>

      {t > 2.9 && t < 4.2 && <ApproachShadow frame={frame} start={T.page + 1 / 60} />}

      {/* PRESS WORLD — slogan, url, wordmark; nothing else */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.page - 0.05 ? 1 : 0,
                    transform: `translateY(${pageOutY}px) rotate(${liftRotP}deg)`,
                    transformOrigin: '25% 0%' }}>
        <div style={{ position: 'absolute', left: 72, top: 96, width: 936, height: 1728,
                      transform: `rotate(${-0.35 + cornerLag}deg) translateY(${pageInY}px)`,
                      transformOrigin: '20% 80%',
                      filter: frame >= pageContactF
                        ? 'drop-shadow(0 3px 8px rgba(10,37,64,0.20)) drop-shadow(0 1px 2px rgba(10,37,64,0.12))'
                        : 'drop-shadow(0 18px 30px rgba(10,37,64,0.16))' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#FBF8F1',
                        clipPath: cutEdgeBowed(936, 1728, 7, 2.2, 10, pageBow) }}>
            <Img src={TEX.press} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                          objectFit: 'cover', opacity: 0.8 }} />
            <svg width="936" height="1728" style={{ position: 'absolute', inset: 0 }}>
              <rect width="936" height="1728" filter="url(#mTooth)" opacity="0.5" />
            </svg>
          </div>
          <CropMarks w={936} h={1728} />
          <div style={{ position: 'absolute', right: 64, top: 64, fontFamily: MONO, fontSize: 22,
                        letterSpacing: '0.14em', color: 'rgba(10,37,64,0.4)' }}>
            EVLEK BASKI 01 · KKTC
          </div>
          <div style={{ position: 'absolute', left: 84, top: 560 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 108, lineHeight: 1.05,
                          letterSpacing: '-0.02em', color: NAVY }}>
              <div style={printPress(frame, T.slog1, 0.133)}>Kıbrıs’ta</div>
              <div style={printPress(frame, T.slog2, 0.133)}>doğru ev.</div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 88, top: 930, fontFamily: MONO, fontWeight: 600,
                        fontSize: 50, letterSpacing: '0.04em', color: NAVY, ...wipe(frame, T.url, 0.25) }}>
            evlek.app
          </div>
          <div style={{ ...printPress(frame, T.mark, T.markLen), position: 'absolute', left: 70, top: 1290, width: 460, height: 160 }}>
            <Wordmark w={430} color={NAVY} style={{ position: 'absolute', left: 0, top: 0 }} />
          </div>
        </div>
      </div>

      <GoldTab frame={frame} T={T} pageOutY={pageOutY} />
    </div>
  );
};
