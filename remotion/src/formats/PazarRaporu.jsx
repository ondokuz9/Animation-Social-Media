// FORMAT: EVLEK PAZAR RAPORU — the flagship weekly (25s / 1500f).
//
// The deep cut of the weekly system. Where "Pazar Nabzı" states one number,
// this one builds an argument in five acts from live Evlek listing data:
//   1. the week's headline count (paper ticket, physical landing)
//   2. the country split — four cities dealt as paper tabs with ink bars
//   3. the winner's inside — Girne's districts, only those Evlek's own
//      sample gate marks "proven"
//   4. the second market — a spotlight card (İskele / Long Beach)
//   5. the read — one sentence, then the cobalt board and the loop
//
// Research that shaped the timing (Sept 2026 short-video guidance): 20–45s
// outperforms; the first two seconds decide; hyper-local market updates are
// the format that travels. So: the number lands at 00.20, the film is 25s,
// and every screen is one idea.
//
// Every number arrives as a prop from content/pazar-raporu-<week>.json, which
// is written from the live Evlek MCP snapshot. Medians appear ONLY if the
// source returns them; counts are always real; the source line is never
// optional.

import React from 'react';
import { useCurrentFrame } from 'remotion';
import {
  SANS, MONO, NAVY, COBALT, CREAM, MUTED, HAIR, SAFE, f, ease,
  prog, place, press, drawLine, CastShadow,
  PaperGround, StockCard, InkBar, CobaltBoard,
  Kicker, Headline, SourceLine, Lockup, Registration, fmt,
} from './kit.jsx';

export const PAZAR_RAPORU_FRAMES = 1500;   // 25.000s @60

const T = {
  kicker: 0.05,
  card: 0.20, cardLen: 0.55,          // the number lands at 00.45
  caption: 0.95, delta: 1.25,
  cardOut: 3.55,
  compact: 3.85,
  citiesLabel: 4.05, cities: 4.30, cityStep: 0.30, cityLen: 0.45,
  citiesOut: 9.40,
  distLabel: 9.75, dist: 10.00, distStep: 0.26, distLen: 0.45,
  distNote: 13.60,
  distOut: 14.75,
  spot: 15.05, spotLen: 0.55, spotRow: 15.60, spotNote: 16.45,
  spotOut: 18.30,
  statement: 18.62,
  board: 19.60, boardLen: 0.55,
  ctaHead: 20.25, ctaSub: 20.60, lockup: 21.00, ctaSource: 21.45,
  boardLift: 24.05, boardLiftLen: 0.60,
};

/* one measured row: name · ink bar · count. Bars are cut cobalt stock, and
   each row's shadow announces before its paper arrives. */
const Row = ({ frame, at, len, i, name, count, max, top, barX = 340, maxBar = 400, tint = false }) => {
  const w = Math.max(46, Math.round((count / max) * maxBar));
  const y = top + i * 148;
  const rot = [-0.5, 0.35, -0.3, 0.45, -0.4][i % 5];
  return (
    <>
      <CastShadow frame={frame} x={SAFE.x} y={y} w={SAFE.w} h={124} rot={rot} start={at} len={len} small r={3} />
      <div style={place(frame, at, len, { dx: -260, rot0: -1.6 })}>
        <StockCard x={SAFE.x} y={y} w={SAFE.w} h={124} rot={rot} seed={140 + i * 13}
                   bg={tint ? '#FFFFFF' : '#FBF8F1'} texOpacity={0.42} texPos={`${18 + i * 19}% 45%`}>
          <div style={{ position: 'absolute', left: 34, top: 38, fontFamily: SANS, fontWeight: 700,
                        fontSize: 44, letterSpacing: '-0.01em', color: NAVY }}>{name}</div>
          <InkBar x={barX} y={40} w={w} h={46} seed={220 + i * 31} />
          <div style={{ position: 'absolute', left: barX + w + 26, top: 30, fontFamily: SANS,
                        fontWeight: 800, fontSize: 56, letterSpacing: '-0.02em', color: NAVY }}>{count}</div>
        </StockCard>
      </div>
    </>
  );
};

export const PazarRaporu = (props) => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  const d = props;

  const citiesMax = Math.max(...d.cities.map((c) => c.count));
  const distMax = Math.max(...d.districts.map((c) => c.count));
  const citiesOut = -1500 * prog(frame, T.citiesOut, 0.45, ease.drawer);
  const distOut = -1500 * prog(frame, T.distOut, 0.45, ease.drawer);
  const spotOut = -1500 * prog(frame, T.spotOut, 0.45, ease.drawer);

  const cardOut = -430 * prog(frame, T.cardOut, 0.5, ease.drawer);
  const showBigCard = t < T.cardOut + 0.6;
  const showHead = t < 19.5;                 // everything on paper unmounts under the board
  const showCities = t >= T.citiesLabel - 0.4 && t < T.citiesOut + 0.6;
  const showDist = t >= T.distLabel - 0.4 && t < T.distOut + 0.6;
  const showSpot = t >= T.spot - 0.4 && t < T.spotOut + 0.6;
  const showStatement = t >= T.statement - 0.1 && t < 19.5;

  return (
    <PaperGround>
      <Registration stamp={d.week} />
      <Kicker frame={frame} at={T.kicker}>
        {d.kicker}
      </Kicker>
      <SourceLine frame={frame} at={T.kicker}>{d.source}</SourceLine>

      {showHead && showBigCard && (
        <div style={{ transform: `translateY(${cardOut}px)`, opacity: t < T.cardOut + 0.45 ? 1 : 0 }}>
          {/* THE NUMBER — a printed ticket set down on the page */}
          <CastShadow frame={frame} x={SAFE.x} y={250} w={620} h={330} rot={-1.1}
                      start={T.card} len={T.cardLen} r={4} />
          <div style={place(frame, T.card, T.cardLen, { dy: -240, rot0: -3 })}>
            <StockCard x={SAFE.x} y={250} w={620} h={330} rot={-1.1} seed={31} bg="#FFFFFF"
                       tex="press" texOpacity={0.34} texPos="40% 50%">
              <div style={{ position: 'absolute', left: 40, top: 22, fontFamily: SANS, fontWeight: 800,
                            fontSize: d.total >= 1000 ? 178 : 232, lineHeight: 1, letterSpacing: '-0.045em', color: NAVY }}>
                {fmt(d.total)}
              </div>
            </StockCard>
          </div>
          <Headline frame={frame} at={T.caption} top={618} size={62}>{d.totalLabel}</Headline>

          {/* the change chip — only rendered when a previous snapshot exists */}
          {d.delta && (
            <>
              <CastShadow frame={frame} x={742} y={300} w={254} h={116} rot={2.4}
                          start={T.delta} len={0.4} small r={3} />
              <div style={place(frame, T.delta, 0.4, { dy: -120, rot0: 5 })}>
                <StockCard x={742} y={300} w={254} h={116} rot={2.4} seed={57} bg="#FFFFFF" texOpacity={0.3}>
                  <div style={{ position: 'absolute', left: 22, top: 14, fontFamily: MONO, fontSize: 17,
                                letterSpacing: '0.08em', color: MUTED }}>{d.delta.label}</div>
                  <div style={{ position: 'absolute', left: 22, top: 44, fontFamily: SANS, fontWeight: 800,
                                fontSize: 50, color: COBALT }}>{d.delta.value}</div>
                </StockCard>
              </div>
            </>
          )}
        </div>
      )}

      {/* the anchor: one compact line carries the number through every act */}
      {showHead && t >= T.compact - 0.1 && (
        <div style={{ position: 'absolute', left: SAFE.x, top: 252, display: 'flex', alignItems: 'baseline',
                      gap: 18, ...press(frame, T.compact, 0.14) }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 96, letterSpacing: '-0.035em', color: NAVY }}>
            {fmt(d.total)}
          </span>
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: MUTED }}>{d.totalLabel}</span>
        </div>
      )}

      {/* ACT 2 — the country split */}
      {showCities && (
        <div style={{ transform: `translateX(${citiesOut}px)` }}>
          <div style={{ position: 'absolute', left: SAFE.x, top: 520, fontFamily: MONO, fontSize: 24,
                        letterSpacing: '0.1em', color: MUTED, ...press(frame, T.citiesLabel, 0.12) }}>
            {d.citiesLabel}
          </div>
          <div style={{ position: 'absolute', left: SAFE.x, top: 560, width: SAFE.w, height: 2,
                        background: HAIR, ...drawLine(frame, T.citiesLabel + 0.05, 0.3) }} />
          {d.cities.map((c, i) => (
            <Row key={c.name} frame={frame} at={T.cities + i * T.cityStep} len={T.cityLen} i={i}
                 name={c.name} count={c.count} max={citiesMax} top={606} />
          ))}
          {d.citiesNote && (
            <div style={{ position: 'absolute', left: SAFE.x, top: 1224, width: SAFE.w, fontFamily: MONO,
                          fontSize: 20, letterSpacing: '0.06em', color: MUTED,
                          ...press(frame, T.cities + d.cities.length * T.cityStep + 0.35, 0.12) }}>
              {d.citiesNote}
            </div>
          )}
        </div>
      )}

      {/* ACT 3 — inside the winner */}
      {showDist && (
        <div style={{ transform: `translateX(${distOut}px)` }}>
          <div style={{ position: 'absolute', left: SAFE.x, top: 520, fontFamily: MONO, fontSize: 24,
                        letterSpacing: '0.1em', color: MUTED, ...press(frame, T.distLabel, 0.12) }}>
            {d.districtsLabel}
          </div>
          <div style={{ position: 'absolute', left: SAFE.x, top: 560, width: SAFE.w, height: 2,
                        background: HAIR, ...drawLine(frame, T.distLabel + 0.05, 0.3) }} />
          {d.districts.map((c, i) => (
            <Row key={c.name} frame={frame} at={T.dist + i * T.distStep} len={T.distLen} i={i}
                 name={c.name} count={c.count} max={distMax} top={606} />
          ))}
          <div style={{ position: 'absolute', left: SAFE.x, top: 1372, width: SAFE.w, fontFamily: MONO,
                        fontSize: 20, letterSpacing: '0.06em', color: MUTED, ...press(frame, T.distNote, 0.12) }}>
            {d.districtsNote}
          </div>
        </div>
      )}

      {/* ACT 4 — the second market */}
      {showSpot && (
        <div style={{ transform: `translateX(${spotOut}px)` }}>
          <CastShadow frame={frame} x={SAFE.x} y={520} w={SAFE.w} h={700} rot={0.6}
                      start={T.spot} len={T.spotLen} r={4} />
          <div style={place(frame, T.spot, T.spotLen, { dy: 300, rot0: -2.2 })}>
            <StockCard x={SAFE.x} y={520} w={SAFE.w} h={700} rot={0.6} seed={311} bg="#FBF8F1"
                       texOpacity={0.5} texPos="60% 30%">
              <div style={{ position: 'absolute', left: 44, top: 40, fontFamily: MONO, fontSize: 22,
                            letterSpacing: '0.1em', color: COBALT }}>{d.spotlight.kicker}</div>
              <div style={{ position: 'absolute', left: 44, top: 84, width: 820, fontFamily: SANS,
                            fontWeight: 800, fontSize: 64, letterSpacing: '-0.02em', color: NAVY }}>
                {d.spotlight.title}
              </div>
            </StockCard>
          </div>
          {d.spotlight.rows.map((r, i) => (
            <div key={r.name} style={{ position: 'absolute', left: SAFE.x + 44, top: 790 + i * 118,
                                       display: 'flex', alignItems: 'baseline', gap: 24,
                                       ...press(frame, T.spotRow + i * 0.2, 0.12) }}>
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: NAVY, width: 440 }}>{r.name}</span>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: COBALT }}>{r.count}</span>
              <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.06em', color: MUTED }}>ilan</span>
            </div>
          ))}
          <div style={{ position: 'absolute', left: SAFE.x + 44, top: 1050, width: 800, fontFamily: SANS,
                        fontWeight: 500, fontSize: 32, lineHeight: 1.34, color: MUTED,
                        ...press(frame, T.spotNote, 0.14) }}>
            {d.spotlight.note}
          </div>
        </div>
      )}

      {/* ACT 5 — the read */}
      {showStatement && (
        <Headline frame={frame} at={T.statement} top={900} size={84} len={0.22}>
          {d.statement}
        </Headline>
      )}

      {/* THE BOARD — closing world, then lifts for a physical loop */}
      <CobaltBoard frame={frame} at={T.board} len={T.boardLen} liftAt={T.boardLift} liftLen={T.boardLiftLen}>
        <Headline frame={frame} at={T.ctaHead} top={520} size={104} color="#FFFFFF" len={0.16}>
          {d.ctaHead}
        </Headline>
        <div style={{ position: 'absolute', left: SAFE.x, top: 800, width: 880, fontFamily: SANS,
                      fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: 'rgba(255,255,255,0.86)',
                      ...press(frame, T.ctaSub, 0.14) }}>
          {d.ctaSub}
        </div>
        <Lockup frame={frame} at={T.lockup} y={1180} w={400} color="#FFFFFF" tagBg="#FFFFFF" tagFg={NAVY} />
        <SourceLine frame={frame} at={T.ctaSource} color="rgba(255,255,255,0.72)">
          {d.source} · {d.dateLabel}
        </SourceLine>
      </CobaltBoard>
    </PaperGround>
  );
};
