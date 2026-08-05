// Act 7 · someone asks an assistant, and the answer comes from your listing. 1.90s.
//
// This is the act about being visible in the AI era, and it is the hardest one to
// do honestly. The temptation is to name a chatbot and imply an integration.
// What is actually true — and what an agent needs to understand — is simpler and
// stronger: the listing is written so that a machine reading it can answer a
// buyer's question from it, and cite where the answer came from.
//
// So the act shows exactly that and nothing more: a question, an answer, and a
// source line. The source line is the whole argument. An answer without an
// attribution is a chatbot; an answer WITH one is the agent's listing being read
// out loud to a buyer who never opened it.
//
// Register: navy, conversational, no interface chrome, no card, no device. The
// only act in the film with no product surface in it at all.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, dur, at, ease, tp, SAFE, holdLine, MONO } from '../../../brand/tokens.js';
import { WordReveal } from '../../../brand/ui.jsx';
import { Grain } from '../parts.jsx';
import content from '../content.json';

export const ASISTAN_SECONDS = 1.9;

const A = content.copy.assistant;

/** The assistant's mark. A four-point star drawn with two quadratic arcs per
    arm, so it has the soft concave sides of a sparkle rather than the hard edges
    of a diamond. It draws itself once and then only breathes. */
const Spark = ({ p, size = 54, rot = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * p})`, opacity: p }}>
    <path
      d="M20 2 Q22.4 15.6 38 20 Q22.4 24.4 20 38 Q17.6 24.4 2 20 Q17.6 15.6 20 2 Z"
      fill={C.gold}
      opacity={0.92}
    />
  </svg>
);

/** Reading indicator: a gold arc that sweeps around a faint ring. It exists for
    340ms and its only job is to make the answer feel produced rather than
    pre-written. */
const Thinking = ({ t, from, len }) => {
  const p = tp(t, from, from + len, ease.linear);
  const vis = Math.min(tp(t, from, from + 0.1), 1 - tp(t, from + len - 0.12, from + len));
  if (vis <= 0.01) return null;
  const a = p * 540;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" style={{ opacity: vis }}>
      <circle cx="26" cy="26" r="21" stroke="rgba(255,255,255,0.16)" strokeWidth="3.4" fill="none" />
      <circle
        cx="26" cy="26" r="21" stroke={C.gold} strokeWidth="3.4" fill="none" strokeLinecap="round"
        pathLength="1" strokeDasharray="0.26 0.74" strokeDashoffset={-p * 1.6}
        transform={`rotate(${a} 26 26)`}
      />
    </svg>
  );
};

export const Asistan = ({ tOverride }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const line = holdLine(frame, 0.06, 1.76);

  const q = tp(t, 0.12, 0.12 + dur.lg, ease.out);
  const spark = tp(t, 0.52, 0.52 + dur.md, ease.out);
  const answer = tp(t, 0.80, 1.52, ease.linear);
  const answerIn = tp(t, 0.78, 0.78 + dur.md, ease.out);
  const src = tp(t, 1.40, 1.40 + dur.lg, ease.out);

  // The navy is never flat: a wide, very slow radial bloom drifts across it.
  const bloom = interpolate(t, [0, ASISTAN_SECONDS], [46, 58]);

  return (
    <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 900px at 62% ${bloom}%, rgba(47,92,255,0.20), rgba(10,37,64,0) 68%)`,
        }}
      />
      <Grain opacity={0.05} />

      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right }}>
        <div style={{ ...T.headline, color: C.white, ...line }}>{content.copy.line_assistant}</div>
      </div>

      {/* The buyer's question. Right-aligned and in a cream bubble, because it is
          the only thing on screen that comes from a person. */}
      <div
        style={{
          position: 'absolute', right: 80, top: 640, maxWidth: 790,
          display: 'flex', justifyContent: 'flex-end',
          opacity: q, transform: `translateY(${(1 - q) * 20}px) translateX(${(1 - q) * 26}px)`,
        }}
      >
        <div
          style={{
            ...T.uiBody, fontSize: 38, lineHeight: 1.35,
            background: C.creamWarm, color: C.navy,
            padding: '26px 34px', borderRadius: 34, borderBottomRightRadius: 10,
            boxShadow: '0 18px 44px rgba(4,14,28,0.3)',
          }}
        >
          {A.question}
        </div>
      </div>

      {/* The answer. No bubble — a system answer is not a person speaking. */}
      <div style={{ position: 'absolute', left: 80, top: 940, right: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 60 }}>
          <Spark p={spark} rot={-8 + spark * 8} />
          <Thinking t={t} from={0.50} len={0.34} />
        </div>

        <div
          style={{
            ...T.uiBody, fontSize: 46, lineHeight: 1.4, color: 'rgba(255,255,255,0.95)',
            marginTop: 22, minHeight: 190,
            opacity: answerIn, transform: `translateY(${(1 - answerIn) * 14}px)`,
          }}
        >
          <WordReveal text={A.answer} progress={answer} />
        </div>

        {/* The citation. This single line is the act's whole argument. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 26, opacity: Math.min(1, src * 1.6) }}>
          <div
            style={{
              width: 120, height: 2, background: C.gold,
              transform: `scaleX(${src})`, transformOrigin: 'left center',
            }}
          />
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 27, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)' }}>
            {A.source}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
