// Act 5 · reach, drawn. Navy. No interface at all. 3.50s.
//
// This is the only act in the film that has to give a picture to something you
// cannot screenshot: a listing arriving in front of the buyers whose intent is
// close to it. Everything else shows a thing; this shows a mechanism.
//
// The earlier version drew three straight gold lines from a card to three dots.
// It was legible and it was worthless — three straight lines say "connected to
// three things", which is a smaller claim than the truth and a duller picture
// than the subject deserves. Reach is not three lines. Reach BRANCHES: a listing
// enters a market, the market divides, and it keeps dividing until it arrives at
// individual people.
//
// So the field is a dendrite. It grows outward in three generations of forking
// curves, terminals light as their branch completes, and once the structure
// exists, signals travel along it. The nervous-system reading is deliberate: it
// is the one common visual metaphor that carries "one input, many endpoints,
// arriving over time" without needing a caption.
//
// What keeps it honest: no notification is sent, so nothing here flies AT
// anybody. The structure grows, the near terminals light, the far ones recede.
// That is proximity, which is what the product actually does.
//
// Timeline, act-local:
//   0.00–0.42  the listing arrives at the centre
//   0.18–0.72  the field's reference rings open
//   0.30–0.86  first generation — ten primary branches
//   0.64–1.22  second generation — each primary forks
//   1.00–1.58  third generation — terminals
//   1.50–2.00  the four matches take gold; everything else recedes
//   1.66–3.30  signals travel root → match along the built structure
//   1.30–1.86  the four labels
//
// A frame inspection compressed the front of this act and paid the time into
// the back: the dendrite used to grow unexplained for 2.4 of the act's 3.3
// seconds and then show its four labelled matches for 0.8 — the picture's
// entire meaning arrived just in time to be cut off. Growth and labelling now
// run in parallel and the fully-labelled field holds for the final 1.4s.
// The labels themselves changed grammar: "Balkonlu" is a filter, "Balkonlu
// arıyor" is a person — and people are what the headline promises.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate, random } from 'remotion';
import { C, T, dur, ease, tp, MONO, SAFE, holdLine } from '../../../brand/tokens.js';
import { asset, Grain } from '../parts.jsx';
import content from '../content.json';

export const MATCH_SECONDS = 3.3;

const CX = 540;
const CY = 1090;

/* ── The structure ─────────────────────────────────────────────────────────
   Built once at module load from seeded randomness, so it is identical on every
   render and the film stays deterministic. Three generations, each shorter and
   more numerous than the last. The y radius is STRETCHED to 1.18, not squashed:
   the frame is 9:16, and a circular field leaves a third of the picture empty
   above and below before it comes anywhere near the sides. */

const GEN = [
  { len: [190, 70], spread: 0.00, kids: [2, 3] },    // primaries
  { len: [126, 62], spread: 0.50, kids: [2, 3] },    // secondaries
  { len: [82, 52], spread: 0.58, kids: [0, 0] },     // terminals
];
const PRIMARIES = 10;

const TREE = (() => {
  const nodes = [{ x: CX, y: CY, depth: -1, parent: -1, bend: 0, jitter: 0 }];
  const grow = (parentIdx, ang, depth, seed) => {
    const g = GEN[depth];
    if (!g) return;
    const p = nodes[parentIdx];
    const len = g.len[0] + random(`l${seed}`) * g.len[1];
    const a = ang + (random(`a${seed}`) - 0.5) * g.spread;
    const idx = nodes.push({
      x: p.x + Math.cos(a) * len,
      y: p.y + Math.sin(a) * len * 1.18,
      depth,
      parent: parentIdx,
      bend: random(`b${seed}`) < 0.5 ? -1 : 1,
      jitter: random(`j${seed}`),
    }) - 1;
    const k = g.kids[0] + Math.floor(random(`k${seed}`) * (g.kids[1] - g.kids[0] + 1));
    for (let i = 0; i < k; i++) {
      grow(idx, a + (i - (k - 1) / 2) * 0.44, depth + 1, `${seed}.${i}`);
    }
  };
  for (let i = 0; i < PRIMARIES; i++) grow(0, (i / PRIMARIES) * Math.PI * 2 + 0.19, 0, `p${i}`);
  return nodes;
})();

/** Terminals are buyers. The four matches are chosen by angle, so they sit around
    the field rather than clustered on one side, and only from terminals that are
    inside the frame — a label needs somewhere to go. */
const TERMINALS = TREE.map((n, i) => ({ ...n, i })).filter((n) => n.depth === GEN.length - 1);
const MATCH_IDX = (() => {
  const QUADS = [-Math.PI * 0.72, -Math.PI * 0.28, Math.PI * 0.28, Math.PI * 0.72];
  // y < 1470: labels hang up to ~66px below a terminal, and anything under
  // ~1500 sits beneath Instagram's own interface on a real phone.
  const inFrame = (c) => c.x > 260 && c.x < 820 && c.y > 580 && c.y < 1470;
  const picked = [];
  for (const want of QUADS) {
    let best = null, bestScore = Infinity;
    for (const c of TERMINALS) {
      if (picked.includes(c.i)) continue;
      const a = Math.atan2(c.y - CY, c.x - CX);
      const dA = Math.abs(((a - want + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      const crowded = picked.some((i) => Math.hypot(TREE[i].x - c.x, TREE[i].y - c.y) < 340);
      const score = dA + (inFrame(c) ? 0 : 3) + (crowded ? 3 : 0);
      if (score < bestScore) { bestScore = score; best = c; }
    }
    if (best) picked.push(best.i);
  }
  return picked;
})();

/** A quadratic through the midpoint, pushed sideways so the branch curves. */
const edgeD = (a, b) => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const k = b.bend * len * 0.16;
  return `Q ${(a.x + b.x) / 2 + (-dy / len) * k} ${(a.y + b.y) / 2 + (dx / len) * k} ${b.x} ${b.y}`;
};
const edgePath = (a, b) => `M ${a.x} ${a.y} ${edgeD(a, b)}`;

/** Root → terminal as one continuous path, so a signal can run the whole way. */
const chainPath = (idx) => {
  const chain = [];
  for (let i = idx; i > 0; i = TREE[i].parent) chain.unshift(i);
  let d = `M ${CX} ${CY}`;
  let prev = TREE[0];
  for (const i of chain) { d += ` ${edgeD(prev, TREE[i])}`; prev = TREE[i]; }
  return d;
};

/** Is this edge part of a matched chain? Precomputed — walking parents inside the
    render loop would be O(n·depth) on every one of 210 frames. */
const ON_CHAIN = (() => {
  const set = new Set();
  for (const m of MATCH_IDX) for (let i = m; i > 0; i = TREE[i].parent) set.add(i);
  return set;
})();

/* Growth windows per generation, overlapping by ~0.14s. A generation that waits
   for the previous one to finish reads as three separate animations; one that
   starts while its parent is still arriving reads as a single thing growing. */
const GROW = [[0.30, 0.86], [0.64, 1.22], [1.00, 1.58]];
const CHAINS = MATCH_IDX.map(chainPath);
const LABELS = content.copy.match_points;

export const Match = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const cardIn = tp(t, 0, 0.42);
  const fieldIn = tp(t, 0.18, 0.72);
  const settle = tp(t, 1.50, 2.00);
  // The whole field eases in over the first 200ms — the cut from Staging's
  // full-bleed photograph to a bare navy plane landed with no entrance at all.
  const entry = tp(t, 0, 0.20, ease.out);

  const line = holdLine(frame, 0.12, 3.16);
  const sub = tp(t, 0.44, 0.44 + dur.md, ease.out);

  // The field turns by two thirds of a degree across the act and drifts
  // vertically. Neither is perceptible as motion; both stop it being a diagram.
  const spin = interpolate(t, [0, MATCH_SECONDS], [-0.34, 0.34]);
  const par = interpolate(t, [0, MATCH_SECONDS], [-10, 10]);

  const drawn = (n) => {
    const [a, b] = GROW[n.depth];
    const j = n.jitter * 0.16;
    return tp(t, a + j, b + j, ease.out);
  };

  return (
    <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1150px 950px at 50% ${58 + par * 0.4}%, rgba(47,92,255,0.20), rgba(10,37,64,0) 70%)`,
        }}
      />

      <svg
        width={1080}
        height={1920}
        style={{
          position: 'absolute', inset: 0,
          transform: `translateY(${par}px) rotate(${spin}deg) scale(${0.97 + 0.03 * entry})`,
          transformOrigin: `${CX}px ${CY}px`,
          opacity: Math.min(1, entry * 2),
        }}
      >
        <defs>
          <radialGradient id="evlek-core" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(201,161,87,0.5)" />
            <stop offset="100%" stopColor="rgba(201,161,87,0)" />
          </radialGradient>
        </defs>

        {/* Reference rings. Without them the branches float; with them the field
            has a centre and a horizon, and the eye knows where the origin is. */}
        {[300, 520, 740].map((r, i) => (
          <ellipse
            key={r}
            cx={CX} cy={CY}
            rx={r * tp(t, 0.18 + i * 0.09, 0.72 + i * 0.09, ease.out)}
            ry={r * 1.18 * tp(t, 0.18 + i * 0.09, 0.72 + i * 0.09, ease.out)}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="2 10"
          />
        ))}

        <ellipse cx={CX} cy={CY} rx={200 * fieldIn} ry={236 * fieldIn} fill="url(#evlek-core)" opacity={0.5 + 0.5 * settle} />

        {/* Every branch, generation by generation. Matched chains stay bright and
            everything else recedes once the matches lock, so the picture reads as
            a field with four live paths through it rather than as a mesh. */}
        {TREE.slice(1).map((n, k) => {
          const idx = k + 1;
          const d = drawn(n);
          if (d <= 0.001) return null;
          const on = ON_CHAIN.has(idx);
          const dim = on ? 0 : settle * 0.5;
          return (
            <path
              key={`e${idx}`}
              d={edgePath(TREE[n.parent], n)}
              fill="none"
              stroke={on ? C.gold : '#FFFFFF'}
              strokeWidth={[3.6, 2.5, 1.8][n.depth]}
              strokeLinecap="round"
              opacity={(on ? 1 : 0.42) * d * (1 - dim)}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - d}
            />
          );
        })}

        {/* Junctions. Without a dot at every fork the branches read as one
            tangled line rather than as a structure that divides. */}
        {TREE.slice(1).filter((n) => n.depth < GEN.length - 1).map((n, k) => {
          const d = drawn(n);
          if (d < 0.9) return null;
          return (
            <circle key={`j${k}`} cx={n.x} cy={n.y} r={n.depth === 0 ? 4.5 : 3}
                    fill="#FFFFFF" opacity={0.4 * (1 - settle * 0.45)} />
          );
        })}

        {TERMINALS.map((n) => {
          if (drawn(n) < 0.94) return null;
          const isMatch = MATCH_IDX.includes(n.i);
          const dim = isMatch ? 0 : settle * 0.5;
          return (
            <circle
              key={`t${n.i}`}
              cx={n.x} cy={n.y} r={isMatch ? 9 + 6 * settle : 5}
              fill={isMatch ? C.gold : '#FFFFFF'}
              opacity={(isMatch ? 1 : 0.62) * (1 - dim)}
            />
          );
        })}

        {MATCH_IDX.map((i) => {
          const n = TREE[i];
          const p = tp(t, 1.50, 2.00, ease.out);
          if (p <= 0.01) return null;
          return (
            <circle key={`h${i}`} cx={n.x} cy={n.y} r={13 + 16 * p} fill="none"
                    stroke={C.gold} strokeWidth="2" opacity={0.42 * (1 - p) + 0.16} />
          );
        })}

        {/* Signals. Once the structure exists, it carries something: a short dash
            runs root → terminal along each matched chain, on a loop. This is the
            beat that makes the picture mean "reaching" rather than "connected". */}
        {/* Rings leaving the core, on a loop. Reach has to be something that
            travels; a static starburst does not read as reach. */}
        {[0, 1, 2].map((i) => {
          const u = ((t - 0.45 - i * 0.42) / 1.30);
          if (u < 0 || u > 1) return null;
          return (
            <ellipse key={`ring${i}`} cx={CX} cy={CY}
                     rx={70 + u * 600} ry={(70 + u * 600) * 1.18} fill="none"
                     stroke={C.gold} strokeWidth="2.2" opacity={0.30 * (1 - u)} />
          );
        })}

        {/* Signals. Once the structure exists it carries something: a short dash
            runs root → terminal along each matched chain, on a loop, with a
            wider soft pass underneath so it reads as light rather than as a
            dash. This is the beat that makes the picture mean "reaching". */}
        {CHAINS.map((d, i) => {
          const start = 1.66 + i * 0.12;
          if (t < start) return null;
          const off = -(((t - start) / 0.90) % 1);
          return (
            <g key={`s${i}`}>
              <path d={d} fill="none" stroke={C.gold} strokeWidth="13" strokeLinecap="round"
                    pathLength="1" strokeDasharray="0.05 0.95" strokeDashoffset={off} opacity={0.28} />
              <path d={d} fill="none" stroke="#FFF6E4" strokeWidth="5" strokeLinecap="round"
                    pathLength="1" strokeDasharray="0.03 0.97" strokeDashoffset={off} opacity={0.98} />
            </g>
          );
        })}
      </svg>

      <Grain opacity={0.05} />

      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right }}>
          <div style={{ ...T.headline, color: C.white, ...line }}>{content.copy.line_match}</div>
          <div
            style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 27, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.6)', marginTop: 22,
              opacity: sub * line.opacity, transform: `translateY(${(1 - sub) * 10}px)`,
            }}
          >
            {content.copy.line_match_sub}
          </div>
        </div>
      )}

      {/* Labels, outside the SVG so they get real type on a real plate. */}
      {MATCH_IDX.map((i, k) => {
        const n = TREE[i];
        const p = tp(t, 1.30 + k * 0.14, 1.30 + k * 0.14 + dur.md, ease.out);
        if (p <= 0.02) return null;
        // A label anchored to a node near the edge runs off it. Estimate the
        // plate's width from the string and clamp the anchor so the whole thing
        // stays inside the frame — a clipped label is worse than a label that
        // sits 30px off its dot.
        const label = LABELS[k % LABELS.length];
        const w = label.length * 15 + 34;
        const right = n.x >= CX;
        const x = right
          ? Math.min(n.x, 1080 - 60 - w)
          : Math.max(n.x, 60 + w);
        return (
          <div
            key={`lb${i}`}
            style={{
              position: 'absolute',
              left: x, top: Math.min(n.y + (k % 2 ? -66 : 24), 1436) + par,
              transform: `translateX(${right ? '0' : '-100%'}) translateY(${(1 - p) * 8}px)`,
              opacity: p,
              fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.95)',
              whiteSpace: 'nowrap',
              padding: '8px 15px',
              background: 'rgba(4,14,28,0.52)',
              borderRadius: 10,
            }}
          >
            {label}
          </div>
        );
      })}

      {/* The listing, at the origin of all of it. */}
      <div
        style={{
          position: 'absolute',
          left: CX - 135, top: CY - 176 + par,
          width: 270,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 26}px) scale(${0.94 + 0.06 * cardIn + 0.03 * settle})`,
        }}
      >
        <div
          style={{
            borderRadius: 22, overflow: 'hidden', background: C.white,
            border: `2px solid rgba(201,161,87,${0.28 + 0.72 * settle})`,
            boxShadow: `0 26px 74px rgba(0,0,0,0.5), 0 0 ${52 * settle}px rgba(201,161,87,0.34)`,
          }}
        >
          {/* The Akdeniz render the agent picked in the previous act — the
              inspection caught this card wearing the Minimal style while Arama
              and Asistan carried Akdeniz, one listing circulating with two
              different shopfronts. */}
          <Img
            src={asset('listing_image')}
            style={{ width: '100%', height: 172, objectFit: 'cover', display: 'block' }}
          />
          <div style={{ padding: '15px 18px 17px' }}>
            <div style={{ ...T.price, fontSize: 33, color: C.navy }}>{content.listing.price}</div>
            <div style={{ ...T.uiBody, fontSize: 24, color: C.ink(0.6), marginTop: 2 }}>{content.listing.place}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
