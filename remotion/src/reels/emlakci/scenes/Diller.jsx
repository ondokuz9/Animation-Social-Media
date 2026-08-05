// Act 3 · five languages, as typography. No device, no card.
//
// The register here is type alone. The description the product wrote fills the
// frame and then becomes another language, and another — the sentence itself is
// the subject. Chips listing "TR EN RU DE AR" would state the feature; watching
// the sentence turn into Russian demonstrates it, and demonstration is what a
// twenty-second film has time for.
//
// Arabic flips the whole layout right-to-left. That detail is the point: this is
// not a translation label bolted onto a Turkish layout, it is the listing as that
// buyer sees it.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, SANS, MONO, dur, at, ease, SAFE, holdLine } from '../../../brand/tokens.js';
import content from '../content.json';

export const DILLER_SECONDS = 3.2;

const L = content.copy.translations;   // [{code, text, rtl}]

/** Each language holds, then the next one takes over with a short blur bridge —
    a crossfade alone reads as a dissolve; the blur reads as a transformation. */
const STEP = 0.58;
const START = 0.42;

export const Diller = ({ tOverride }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const idxRaw = (t - START) / STEP;
  const active = Math.max(0, Math.min(L.length - 1, Math.floor(idxRaw)));
  const frac = Math.max(0, Math.min(1, idxRaw - active));

  // The transition happens in the last 30% of each step.
  const trans = Math.max(0, (frac - 0.7) / 0.3);
  const next = Math.min(L.length - 1, active + 1);

  const line = holdLine(frame, 0.1, 2.9);
  const intro = at(frame, 0.3, dur.lg);

  const Sentence = ({ item, opacity, blur, dy }) => (
    <div
      style={{
        position: 'absolute', left: 0, right: 0,
        direction: item.rtl ? 'rtl' : 'ltr',
        textAlign: item.rtl ? 'right' : 'left',
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: item.rtl ? 62 : 58,
        lineHeight: 1.28,
        letterSpacing: '-0.015em',
        color: C.navy,
        opacity,
        filter: blur > 0.01 ? `blur(${blur * 7}px)` : 'none',
        transform: `translateY(${dy}px)`,
      }}
    >
      {item.text}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: C.cream }}>
      {/* A single quiet rule, so the frame is not just floating type. */}
      <div
        style={{
          position: 'absolute', left: SAFE.left + 20, top: 470,
          width: 96 * intro, height: 3, background: C.gold, transformOrigin: 'left center',
        }}
      />

      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right }}>
        <div style={{ ...T.headline, color: C.navy, ...line }}>{content.copy.line_langs}</div>
      </div>

      <div style={{ position: 'absolute', left: SAFE.left + 20, right: SAFE.right, top: 560, height: 420 }}>
        <Sentence item={L[active]} opacity={intro * (1 - trans)} blur={trans} dy={-trans * 10} />
        {trans > 0 && (
          <Sentence item={L[next]} opacity={trans} blur={1 - trans} dy={(1 - trans) * 14} />
        )}
      </div>

      {/* Language codes, ticking through as the sentence changes. The active one
          is the only element in the frame allowed to carry gold. */}
      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 1060, display: 'flex', gap: 16 }}>
        {L.map((l, i) => {
          const isOn = i === active;
          const passed = i < active;
          return (
            <div
              key={l.code}
              style={{
                ...T.mono,
                fontSize: 32,
                letterSpacing: '0.1em',
                color: isOn ? C.navy : C.ink(passed ? 0.34 : 0.18),
                borderBottom: `3px solid ${isOn ? C.gold : 'transparent'}`,
                paddingBottom: 8,
                transform: `translateY(${isOn ? -2 : 0}px)`,
                opacity: intro,
              }}
            >
              {l.code}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
