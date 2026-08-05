// Act 7 · a buyer asks an assistant, and the answer comes out of your listing.
// Navy. 2.70s.
//
// This is the act about being visible in the age of AI search, and it is the
// hardest one to do honestly. The temptation is to name a chatbot and imply an
// integration. What is actually true is simpler and stronger: the listing is
// written so that a machine reading it can answer a buyer's question from it —
// and say where the answer came from.
//
// So the act ends on a CITATION. An earlier cut ended on a rule and the words
// "KAYNAK: EVLEK.APP", which is the correct claim typeset as a footnote. The
// citation is now a card: the agent's own listing, thumbnail and price, sitting
// underneath the answer as its source. That single object is the whole argument
// of the act, and it is the one an estate agent will recognise instantly —
// because it is their listing being quoted to a buyer who never opened it.
//
// Register: navy, conversational, no interface chrome, no device. The buyer's
// question is the only thing in the film that comes from a person, so it is the
// only thing here in a cream bubble; the answer has no bubble, because a system
// answer is not a person speaking.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate } from 'remotion';
import { C, T, dur, ease, tp, SAFE, holdLine, MONO } from '../../../brand/tokens.js';
import { WordReveal } from '../../../brand/ui.jsx';
import { asset, Grain } from '../parts.jsx';
import content from '../content.json';

export const ASISTAN_SECONDS = 2.7;

const A = content.copy.assistant;

/** The assistant's mark. A four-point star with concave sides — the sparkle that
    has become the universal sign for "a machine made this" — drawn rather than
    set, so it can breathe. */
const Spark = ({ p, size = 56, rot = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * p})`, opacity: p }}>
    <path d="M20 2 Q22.4 15.6 38 20 Q22.4 24.4 20 38 Q17.6 24.4 2 20 Q17.6 15.6 20 2 Z" fill={C.gold} opacity={0.94} />
  </svg>
);

/** Reading indicator: a gold arc sweeping a faint ring. It exists for 400ms and
    its only job is to make the answer feel produced rather than pre-written. */
const Thinking = ({ t, from, len }) => {
  const p = tp(t, from, from + len, ease.linear);
  const vis = Math.min(tp(t, from, from + 0.10), 1 - tp(t, from + len - 0.14, from + len));
  if (vis <= 0.01) return null;
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" style={{ opacity: vis }}>
      <circle cx="27" cy="27" r="22" stroke="rgba(255,255,255,0.16)" strokeWidth="3.4" fill="none" />
      <circle
        cx="27" cy="27" r="22" stroke={C.gold} strokeWidth="3.4" fill="none" strokeLinecap="round"
        pathLength="1" strokeDasharray="0.26 0.74" strokeDashoffset={-p * 1.6}
        transform={`rotate(${p * 540} 27 27)`}
      />
    </svg>
  );
};

export const Asistan = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const line = holdLine(frame, 0.06, 2.56);

  const q = tp(t, 0.12, 0.12 + dur.lg, ease.out);
  const spark = tp(t, 0.60, 0.60 + dur.md, ease.out);
  // Sixteen words. Anything faster than about twelve words a second stops being
  // read and starts being watched.
  const answer = tp(t, 0.98, 1.96, ease.linear);
  const answerIn = tp(t, 0.96, 0.96 + dur.md, ease.out);
  const cite = tp(t, 2.02, 2.02 + dur.lg, ease.out);
  const rule = tp(t, 1.00, 1.60, ease.out);

  const bloom = interpolate(t, [0, ASISTAN_SECONDS], [44, 58]);

  return (
    <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(1200px 900px at 64% ${bloom}%, rgba(47,92,255,0.22), rgba(10,37,64,0) 68%)` }}
      />
      <Grain opacity={0.05} />

      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right }}>
          <div style={{ ...T.headline, color: C.white, ...line }}>{content.copy.line_assistant}</div>
        </div>
      )}

      {/* The buyer's question. */}
      <div
        style={{
          position: 'absolute', right: 80, top: 560, maxWidth: 800,
          display: 'flex', justifyContent: 'flex-end',
          opacity: q, transform: `translateY(${(1 - q) * 20}px) translateX(${(1 - q) * 26}px)`,
        }}
      >
        <div
          style={{
            ...T.uiBody, fontSize: 38, lineHeight: 1.35,
            background: C.creamWarm, color: C.navy,
            padding: '26px 34px', borderRadius: 34, borderBottomRightRadius: 10,
            boxShadow: '0 18px 44px rgba(4,14,28,0.34)',
          }}
        >
          {A.question}
        </div>
      </div>

      {/* The answer. A gold hairline runs down its left edge as it is written —
          the same drawn-rule motif the citation and the close use. */}
      <div style={{ position: 'absolute', left: 80, top: 830, right: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 62 }}>
          <Spark p={spark} rot={-8 + spark * 8} />
          <Thinking t={t} from={0.56} len={0.40} />
        </div>

        <div style={{ position: 'relative', paddingLeft: 30, marginTop: 20 }}>
          <div
            style={{
              position: 'absolute', left: 0, top: 4, bottom: 6, width: 3,
              background: `rgba(201,161,87,0.8)`,
              transform: `scaleY(${rule})`, transformOrigin: 'top center',
            }}
          />
          <div
            style={{
              ...T.uiBody, fontSize: 45, lineHeight: 1.42, color: 'rgba(255,255,255,0.96)',
              minHeight: 200,
              opacity: answerIn, transform: `translateY(${(1 - answerIn) * 14}px)`,
            }}
          >
            <WordReveal text={A.answer} progress={answer} />
          </div>
        </div>
      </div>

      {/* The citation. This card is the act. */}
      <div
        style={{
          position: 'absolute', left: 80, right: 100, top: 1290,
          opacity: cite, transform: `translateY(${(1 - cite) * 22}px)`,
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 22,
            background: 'rgba(255,255,255,0.07)',
            border: '1.5px solid rgba(255,255,255,0.14)',
            borderLeft: `4px solid ${C.gold}`,
            borderRadius: 20,
            padding: 16,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Img
            src={asset('stage_akdeniz')}
            style={{ width: 132, height: 104, objectFit: 'cover', borderRadius: 12, display: 'block', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: '0.14em',
                color: C.gold, marginBottom: 8,
              }}
            >
              {A.source}
            </div>
            <div style={{ ...T.price, fontSize: 40, color: '#FFFFFF' }}>{content.listing.price}</div>
            <div style={{ ...T.uiBody, fontSize: 26, color: 'rgba(255,255,255,0.62)', marginTop: 2 }}>
              {content.listing.meta}
            </div>
          </div>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginRight: 8 }}>
            <path d="M7 17 L17 7 M17 7 H9 M17 7 V15" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
