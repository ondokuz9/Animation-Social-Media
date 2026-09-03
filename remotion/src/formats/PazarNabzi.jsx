// FORMAT: Pazar Nabzı — the weekly market-pulse reel (15s, 900f).
// Data-driven: every number comes from Evlek's live listing data via props
// (content/pazar-nabzi-<week>.json). No medians are shown unless the source
// returns them; counts are always real. Same physics bible as the brand film
// (one settle, shadows announce 3f early, no fades), but a different world:
// a cream data board with cobalt paper strips — so the grid never repeats.

import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { SANS, MONO, f, ease } from '../brand/tokens.js';
import { NAVY, COBALT, CREAM, cutEdge, MatterDefs } from '../reels/brandfilm/matter.jsx';
import { Wordmark } from '../reels/brandfilm/Styleframes.jsx';

export const PAZAR_NABZI_FRAMES = 900;

const SETTLE = Easing.bezier(0.34, 1.28, 0.64, 1);
const WIPE = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (frame, at, len, easing = SETTLE) =>
  interpolate(frame, [f(at), f(at + len)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });
const place = (frame, at, len, { dx = 0, dy = 0, rot0 = 0, easing = SETTLE } = {}) => {
  const p = prog(frame, at, len, easing);
  return { opacity: frame >= f(at) ? 1 : 0, transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${(1 - p) * rot0}deg)` };
};
const printPress = (frame, at, len = 0.15) => {
  const p = prog(frame, at, len, Easing.linear);
  return { clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, opacity: frame >= f(at) ? 1 : 0 };
};
const Shadow = ({ frame, x, y, w, h, start, len, r = 4 }) => {
  const landed = frame >= f(start + len);
  const on = frame < f(start) - 3 ? 0 : interpolate(frame, [f(start) - 3, f(start) - 1], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blob = (dx, dy, blur, a) => (
    <div style={{ position: 'absolute', left: x + dx, top: y + dy, width: w, height: h, borderRadius: r,
                  background: `rgba(10,37,64,${a})`, filter: `blur(${blur}px)`, opacity: on }} />);
  return landed ? <>{blob(0, 3, 6, 0.16)}{blob(0, 1, 1.5, 0.10)}</> : blob(5, 14, 26, 0.09);
};

const T = {
  header: 0.05, ticket: 0.35, ticketLen: 0.5, caption: 0.95,
  bars: 1.8, barStep: 0.22, barLen: 0.45,
  barsOut: 6.9, cities: 7.35, statement: 9.3,
  board: 11.3, boardLen: 0.55, ctaHead: 12.0, ctaSub: 12.25, pill: 12.5, mark: 12.75, source: 12.95,
  boardLift: 14.2, boardLiftLen: 0.6,
};

const fmt = (n) => n.toLocaleString('tr-TR');

const Bars = ({ frame, rows, at, top, label, maxW = 640 }) => {
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <div style={{ position: 'absolute', left: 84, top, width: 912 }}>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.1em', color: 'rgba(10,37,64,0.62)', ...printPress(frame, at - 0.15) }}>{label}</div>
      {rows.map((r, i) => {
        const start = at + i * T.barStep;
        const w = Math.max(56, Math.round((r.count / max) * maxW));
        const y = 64 + i * 138;
        return (
          <React.Fragment key={r.name}>
            <div style={{ position: 'absolute', left: 0, top: y + 14, fontFamily: SANS, fontWeight: 600, fontSize: 34, color: NAVY,
                          width: 250, ...printPress(frame, start - 0.05, 0.1) }}>{r.name}</div>
            <Shadow frame={frame} x={252} y={y} w={w} h={78} start={start} len={T.barLen} r={3} />
            <div style={{ position: 'absolute', left: 252, top: y, width: w, height: 78, overflow: 'visible' }}>
              <div style={{ position: 'absolute', inset: 0, background: COBALT, clipPath: cutEdge(w, 78, 300 + i * 17, 1.8, 4),
                            ...place(frame, start, T.barLen, { dx: -w - 300, rot0: -1.2 }) }} />
              <div style={{ position: 'absolute', left: w + 22, top: 12, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: NAVY,
                            ...printPress(frame, start + T.barLen - 0.05, 0.1) }}>{r.count}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const PazarNabzi = (props) => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  const d = props;
  const pBoard = prog(frame, T.board, T.boardLen, ease.drawer);
  const pLift = prog(frame, T.boardLift, T.boardLiftLen, ease.inOut);
  const boardY = -2000 * (1 - pBoard) - 2200 * pLift;
  const boardMoving = (frame >= f(T.board) && frame < f(T.board + T.boardLen)) || (frame >= f(T.boardLift) && frame < f(T.boardLift + T.boardLiftLen));
  const showData = t < 12.2;          // hidden under the board, then unmounted → clean loop state
  const barsOut = -1700 * prog(frame, T.barsOut, 0.4, ease.drawer);

  return (
    <div style={{ position: 'absolute', inset: 0, background: CREAM, overflow: 'hidden', fontFamily: SANS }}>
      <MatterDefs />
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}><rect width="1080" height="1920" filter="url(#mTooth)" /></svg>

      {/* header — the loop's still state */}
      <div style={{ position: 'absolute', left: 84, top: 150, fontFamily: MONO, fontSize: 24, letterSpacing: '0.12em', color: COBALT, ...printPress(frame, T.header) }}>
        {d.cityUpper} · SATILIK · BU HAFTA · {d.dateLabel}
      </div>
      <div style={{ position: 'absolute', left: 84, top: 1780, fontFamily: MONO, fontSize: 18, letterSpacing: '0.1em', color: 'rgba(10,37,64,0.5)', ...printPress(frame, T.header) }}>
        {d.source}
      </div>

      {showData && (
        <>
          {/* the number — a paper ticket set down */}
          <Shadow frame={frame} x={84} y={230} w={520} h={300} start={T.ticket} len={T.ticketLen} r={4} />
          <div style={{ position: 'absolute', left: 84, top: 230, width: 520, height: 300, ...place(frame, T.ticket, T.ticketLen, { dy: -260, rot0: -2.5 }) }}>
            <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', clipPath: cutEdge(520, 300, 41, 2.6, 6) }} />
            <div style={{ position: 'absolute', left: 36, top: 10, fontFamily: SANS, fontWeight: 800, fontSize: 250, lineHeight: 1, letterSpacing: '-0.04em', color: NAVY }}>{fmt(d.total)}</div>
          </div>
          <div style={{ position: 'absolute', left: 84, top: 560, fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: '-0.02em', color: NAVY, ...printPress(frame, T.caption) }}>
            aktif satılık ilan
          </div>

          {/* district strips, then city strips */}
          {t < T.cities - 0.1 && (
            <div style={{ transform: `translateY(${barsOut}px)` }}>
              <Bars frame={frame} rows={d.districts} at={T.bars} top={740} label="EN ÇOK İLAN — SEMTLER" />
            </div>
          )}
          {t >= T.cities - 0.4 && (
            <>
              <Bars frame={frame} rows={d.cities} at={T.cities} top={740} label="KKTC — ŞEHİRLER" />
              <div style={{ position: 'absolute', left: 84, top: 1420, width: 912, fontFamily: SANS, fontWeight: 800, fontSize: 64, lineHeight: 1.08,
                            letterSpacing: '-0.02em', color: NAVY, ...printPress(frame, T.statement, 0.18) }}>
                {d.statement}
              </div>
            </>
          )}
        </>
      )}

      {/* the cobalt CTA board — an object: drops in, lifts out for the loop */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${boardY}px)`,
                    filter: boardMoving ? 'drop-shadow(0 22px 40px rgba(10,37,64,0.20))' : 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: COBALT, clipPath: cutEdge(1080, 1920, 77, 8, 14) }}>
          <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}><rect width="1080" height="1920" filter="url(#mCobaltTex)" /></svg>
        </div>
        <div style={{ position: 'absolute', left: 84, top: 520, width: 912, fontFamily: SANS, fontWeight: 800, fontSize: 104, lineHeight: 1.02, letterSpacing: '-0.025em', color: '#FFFFFF', ...printPress(frame, T.ctaHead, 0.15) }}>
          {d.ctaHead}
        </div>
        <div style={{ position: 'absolute', left: 84, top: 790, width: 880, fontFamily: SANS, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: 'rgba(255,255,255,0.85)', ...printPress(frame, T.ctaSub, 0.12) }}>
          {d.ctaSub}
        </div>
        <Shadow frame={frame} x={84} y={960} w={296} h={96} start={T.pill} len={0.4} r={6} />
        <div style={{ position: 'absolute', left: 84, top: 960, ...place(frame, T.pill, 0.4, { dy: 120, rot0: 2 }) }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#FFFFFF', padding: '26px 34px', borderRadius: 6,
                        fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: NAVY }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9h13v-9" /></svg>
            evlek.app
          </div>
        </div>
        <div style={{ position: 'absolute', left: 84, top: 1560, ...place(frame, T.mark, 0.3, { dy: 160, rot0: -1.4 }) }}>
          <Wordmark w={400} color="#FFFFFF" />
        </div>
        <div style={{ position: 'absolute', left: 84, top: 1780, fontFamily: MONO, fontSize: 18, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', ...printPress(frame, T.source) }}>
          {d.source} · {d.dateLabel}
        </div>
      </div>
    </div>
  );
};
