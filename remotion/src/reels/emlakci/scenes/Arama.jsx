// Act 6 · the buyer's side. Full-frame interface, no device at all. 2.60s.
//
// Everything before this happens on the agent's phone. This act drops the phone
// entirely — the frame IS the app — because the point of the cut is that we have
// changed person, not screen. A second device would have said "another feature";
// no device says "someone else, somewhere else, looking for exactly this".
//
// The signature move: the sentence the buyer typed turns into the filters, IN
// PLACE. Each phrase grows padding, a gold hairline and a pill radius exactly
// where it already sits in the line — nothing flies anywhere, nothing is
// duplicated into a chip row underneath. The move earns its keep because it is
// the honest picture of what happens: the search is not a form with a sentence
// pasted into it, the sentence IS the search.
//
// (An earlier cut drew a bracket under the query and popped chips below it. It
// stated the same idea twice and looked like a diagram of the feature rather
// than the feature.)
//
// Timeline, act-local:
//   0.03–0.52   the sentence types itself, a phrase at a time, caret trailing
//   0.55        submit — the field presses in and the focus halo collapses
//   0.60–1.14   the four phrases become filters, 90ms apart, 260ms each
//   0.66–0.92   three loading cards rise, 60ms apart
//   1.16–1.72   each one resolves into its listing, 100ms apart
//   1.62        the count appears
//   1.80–2.10   the agent's listing takes the gold ring and its label

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, dur, ease, tp, pulse, SAFE, holdLine, MONO } from '../../../brand/tokens.js';
import { Caret } from '../../../brand/ui.jsx';
import { SearchField, ResultCard } from '../parts.jsx';
import content from '../content.json';

export const ARAMA_SECONDS = 2.5;

const P = content.copy.query_parts;      // [{text, chip}]
const R = content.copy.results;

const FIELD_W = 920;
const MORPH_FROM = 0.60;
const MORPH_STEP = 0.09;
const MORPH_LEN = 0.26;

export const Arama = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  // Typing: one phrase at a time, not one character. At 60fps a character
  // typewriter reads as a cheap effect; phrase-level reads as someone thinking.
  const typed = tp(t, 0.03, 0.52, ease.linear) * P.length;
  const typing = t < 0.55;

  const focus = tp(t, 0.0, 0.22);
  const submit = pulse(t, 0.55, 0.22);

  const line1 = holdLine(frame, 0.08, 1.42);
  const line2 = holdLine(frame, 1.50, 2.42);

  const count = tp(t, 1.62, 1.62 + dur.md, ease.out);
  const ringP = tp(t, 1.80, 2.10, ease.out);

  // Continuous drift, for the same reason Diller has one: after the ring lands at
  // 2.10 nothing else is scheduled before the cut at 2.60, and the audit found
  // 26 identical frames there. The list creeps up the way a page settles.
  const drift = interpolate(t, [0, ARAMA_SECONDS], [6, -8]);

  return (
    <AbsoluteFill style={{ background: C.cream }}>
      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right, height: 180 }}>
          <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...line1 }}>{content.copy.line_search}</div>
          <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...line2 }}>{content.copy.line_found}</div>
        </div>
      )}

      {/* The query, becoming the filters. */}
      <div style={{ position: 'absolute', left: 80, top: 560, width: FIELD_W }}>
        <SearchField focus={focus} submit={submit}>
          {P.map((part, i) => {
            const shown = Math.max(0, Math.min(1, typed - i));
            if (shown <= 0) return null;
            const m = tp(t, MORPH_FROM + i * MORPH_STEP, MORPH_FROM + i * MORPH_STEP + MORPH_LEN, ease.out);
            return (
              <span
                key={part.chip}
                style={{
                  display: 'inline-block',
                  marginRight: `${10 + 8 * m}px`,
                  padding: `${7 * m}px ${17 * m}px`,
                  borderRadius: 999,
                  border: `${1.6 * m}px solid rgba(201,161,87,${0.62 * m})`,
                  background: `rgba(201,161,87,${0.08 * m})`,
                  opacity: shown,
                  whiteSpace: 'nowrap',
                }}
              >
                {part.text}
              </span>
            );
          })}
          {typing && <Caret frame={frame} fps={fps} />}
        </SearchField>
      </div>

      <div
        style={{
          position: 'absolute', left: 80, top: 830,
          fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: C.ink(0.58),
          opacity: count, transform: `translateY(${drift + (1 - count) * 10}px)`,
        }}
      >
        {P.length} kritere uyan ilanlar
      </div>

      {/* Results. The agent's listing is first, and it is the only object in the
          frame allowed to carry gold — the entire payoff of the act for the
          audience actually watching this film. */}
      <div style={{ position: 'absolute', left: 80, top: 890, display: 'flex', gap: 25, transform: `translateY(${drift}px)` }}>
        {R.map((item, i) => (
          <ResultCard
            key={item.asset}
            item={item}
            p={tp(t, 0.66 + i * 0.06, 0.66 + i * 0.06 + dur.md, ease.out)}
            real={tp(t, 1.16 + i * 0.10, 1.16 + i * 0.10 + dur.lg, ease.out)}
            ring={item.mine ? ringP : 0}
          />
        ))}
      </div>

      {/* The one label the agent in the audience is here for. It sits on the
          card rather than in the headline, so it reads as a fact about that
          listing instead of a claim about the product. */}
      {ringP > 0.02 && (
        <div
          style={{
            position: 'absolute', left: 98, top: 868 + drift,
            ...T.uiLabel, fontSize: 25,
            background: C.gold, color: '#1B1204',
            padding: '9px 20px', borderRadius: 999,
            opacity: Math.min(1, ringP * 1.6),
            transform: `translateY(${(1 - ringP) * 8}px)`,
            boxShadow: '0 10px 26px rgba(10,37,64,0.22)',
          }}
        >
          Senin ilanın
        </div>
      )}
    </AbsoluteFill>
  );
};
