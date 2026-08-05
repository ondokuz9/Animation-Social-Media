// Act 5 · the match, as a diagram. Dark. No interface at all.
//
// Register change again, and the biggest one: after a photograph filling the
// frame, this is navy, abstract and drawn. It is the only place in the film where
// something invisible — the system putting a listing in front of the right buyers
// — gets a picture. Every other act shows a thing you could screenshot; this one
// shows a mechanism.
//
// Honest about what it depicts: no notification is sent. The listing surfaces to
// buyers whose intent is close to it. So the drawing is proximity — near points
// connect, far ones fade — not a broadcast.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate, random } from 'remotion';
import { C, T, dur, at, ease, tp, MONO, SAFE, holdLine } from '../../../brand/tokens.js';
import { asset, Grain } from '../parts.jsx';
import content from '../content.json';

export const MATCH_SECONDS = 2.6;

const CX = 540, CY = 1090;

/** Buyer points. Three are the matches and carry labels; the rest are the market. */
const POINTS = (() => {
  const named = [
    { x: 210, y: 830, label: 'Girne · 2+1', match: true },
    { x: 858, y: 966, label: 'Deniz yakını', match: true },
    { x: 300, y: 1390, label: 'Yatırımlık', match: true },
  ];
  const rest = Array.from({ length: 44 }, (_, i) => {
    const a = random(`a${i}`) * Math.PI * 2;
    const r = 250 + random(`r${i}`) * 520;
    return { x: CX + Math.cos(a) * r * 1.05, y: CY + Math.sin(a) * r * 0.92, match: false };
  }).filter((p) => p.x > 70 && p.x < 1010 && p.y > 560 && p.y < 1660);
  return [...rest, ...named];
})();

export const Match = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const cardIn = tp(t, 0, 0.40);
  const fieldIn = tp(t, 0.32, 1.06);
  const drawP = tp(t, 0.96, 1.98);
  const settle = tp(t, 1.94, 2.42);

  const line = holdLine(frame, 0.12, 2.46);
  const sub = tp(t, 0.42, 0.42 + dur.md, ease.out);

  // Two rings leaving the listing, 0.55s apart. The act's claim is reach, and a
  // static starburst does not read as reach — something has to travel.
  const ring = (from) => {
    const r = tp(t, from, from + 1.25, ease.out);
    return r > 0.001 && r < 0.999 ? { r: 60 + r * 660, o: 0.34 * (1 - r) } : null;
  };
  const rings = [ring(0.62), ring(1.24)].filter(Boolean);

  // A very slow parallax so the diagram breathes instead of sitting there.
  const par = interpolate(t, [0, MATCH_SECONDS], [-8, 8]);

  const matches = POINTS.filter((p) => p.match);

  return (
    <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
      {/* A faint radial lift so the navy is not flat. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1100px 900px at 50% ${58 + par * 0.4}%, rgba(47,92,255,0.16), rgba(10,37,64,0) 70%)`,
        }}
      />

      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right }}>
          <div style={{ ...T.headline, color: C.white, ...line }}>{content.copy.line_match}</div>
          <div
            style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 27, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.58)', marginTop: 22,
              opacity: sub * line.opacity, transform: `translateY(${(1 - sub) * 10}px)`,
            }}
          >
            {content.copy.line_match_sub}
          </div>
        </div>
      )}

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, transform: `translateY(${par}px)` }}>
        {/* Two reference circles, so the field reads as a space with a centre
            rather than as scattered dots. */}
        {[330, 620].map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r * fieldIn} fill="none"
                  stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" strokeDasharray="3 9" />
        ))}

        {/* Reach, travelling outward. */}
        {rings.map((g, i) => (
          <circle key={`r${i}`} cx={CX} cy={CY} r={g.r} fill="none"
                  stroke={C.gold} strokeWidth="2" opacity={g.o} />
        ))}

        {/* Connections to the matching buyers, drawn one after another. */}
        {matches.map((p, i) => {
          const d = Math.max(0, Math.min(1, (drawP * matches.length) - i));
          if (d <= 0) return null;
          const len = Math.hypot(p.x - CX, p.y - CY);
          return (
            <line
              key={`l${i}`}
              x1={CX} y1={CY} x2={p.x} y2={p.y}
              stroke={C.gold} strokeWidth={2.5} strokeLinecap="round"
              pathLength="1" strokeDasharray="1" strokeDashoffset={1 - d}
              opacity={0.85}
            />
          );
        })}

        {/* Every buyer in the market. The far ones fade as the matches lock. */}
        {POINTS.map((p, i) => {
          const appear = Math.max(0, Math.min(1, (fieldIn * 1.4) - random(`d${i}`) * 0.4));
          const dim = p.match ? 0 : settle * 0.72;
          const r = p.match ? 9 + 3 * settle : 5.5;
          return (
            <circle
              key={`p${i}`}
              cx={p.x} cy={p.y} r={r * appear}
              fill={p.match ? C.gold : C.white}
              opacity={(p.match ? 1 : 0.5) * appear * (1 - dim)}
            />
          );
        })}
      </svg>

      {/* Labels on the three matches. */}
      {matches.map((p, i) => {
        const d = Math.max(0, Math.min(1, (drawP * matches.length) - i));
        if (d <= 0.3) return null;
        const o = Math.min(1, (d - 0.3) / 0.5);
        return (
          <div
            key={`t${i}`}
            style={{
              position: 'absolute',
              left: p.x < CX ? p.x - 10 : p.x - 10,
              top: p.y + 26 + par,
              transform: `translateX(${p.x < CX ? '-100%' : '0'}) translateY(${(1 - o) * 8}px)`,
              opacity: o,
              ...T.uiLabel,
              fontSize: 29,
              color: 'rgba(255,255,255,0.96)',
              whiteSpace: 'nowrap',
            }}
          >
            {p.label}
          </div>
        );
      })}

      {/* The listing itself, at the centre of the field. */}
      <div
        style={{
          position: 'absolute',
          left: CX - 150, top: CY - 190 + par,
          width: 300,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 24}px) scale(${0.94 + 0.06 * cardIn + 0.02 * settle})`,
        }}
      >
        <div
          style={{
            borderRadius: 22, overflow: 'hidden', background: C.white,
            border: `2px solid rgba(201,161,87,${0.3 + 0.7 * settle})`,
            boxShadow: `0 24px 70px rgba(0,0,0,0.45), 0 0 ${40 * settle}px rgba(201,161,87,0.28)`,
          }}
        >
          {/* The same photograph the previous act ended on. The cut into this
              act is a match cut: a room that filled the frame becomes an object
              small enough to be pushed at a market. */}
          <Img
            src={asset('stage_minimal')}
            style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
          />
          <div style={{ padding: '16px 18px 18px' }}>
            <div style={{ ...T.price, fontSize: 32, color: C.navy }}>{content.listing.price}</div>
            <div style={{ ...T.uiBody, fontSize: 24, color: C.ink(0.6), marginTop: 2 }}>{content.listing.place}</div>
          </div>
        </div>
      </div>
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
